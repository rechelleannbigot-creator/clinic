import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerClinicRoutes } from "./clinicRoutes.js";

function fakeDatabase() {
  const records = new Map([
    ["patients/P-001", { firstName: "Test", lastName: "Patient", uid: "student-1" }],
    ["users/student-1", { patientId: "P-001" }],
    ["medicines/med-1", { name: "Test medicine", quantity: 5, expirationDate: "2099-12-31" }],
  ]);
  const snapshot = (key) => ({ exists: records.has(key), data: () => records.get(key) });
  const db = {
    collection(name) {
      const collection = {
        doc(id) {
          const key = `${name}/${id}`;
          return { id, key, get: async () => snapshot(key) };
        },
        get: async () => ({
          docs: [...records.entries()].filter(([key]) => key.startsWith(`${name}/`)).map(([key]) => ({ id: key.split("/")[1], data: () => records.get(key) })),
        }),
        where(field, _op, value) {
          return { get: async () => {
            const result = await collection.get();
            return { docs: result.docs.filter((item) => item.data()[field] === value) };
          } };
        },
      };
      return collection;
    },
    async runTransaction(callback) {
      const writes = [];
      const result = await callback({
        get: async (ref) => snapshot(ref.key),
        update: (ref, data) => writes.push(() => records.set(ref.key, { ...records.get(ref.key), ...data })),
        create: (ref, data) => writes.push(() => records.set(ref.key, data)),
      });
      writes.forEach((write) => write());
      return result;
    },
  };
  return { db, records };
}

test("consultation API validates, issues stock once, and limits patient history", async () => {
  const { db, records } = fakeDatabase();
  const app = express();
  app.use(express.json());
  const signedIn = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: "Sign in required." });
    req.authUser = { uid: req.headers.authorization === "student" ? "student-1" : "staff-1", email: "staff@example.test" };
    next();
  };
  const staff = (req, res, next) => signedIn(req, res, () => {
    if (req.authUser.uid !== "staff-1") return res.status(403).json({ message: "Forbidden" });
    req.staffProfile = { firstName: "Clinic", lastName: "Staff" };
    next();
  });
  registerClinicRoutes(app, { db, requireClinicStaff: staff, requireSignedIn: signedIn });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const body = {
    requestId: "7b2c8254-314a-4af5-a169-bf5b85966222", patientId: "P-001",
    consultationDate: "2026-11-09", consultationType: "Follow-up Check",
    symptoms: "Symptoms", diagnosis: "Diagnosis", treatment: "Treatment",
    medicineId: "med-1", dosage: "One tablet", quantity: 3, instructions: "After food", notes: "Notes",
  };
  const request = (path, method, data, identity = "staff") => fetch(`${base}${path}`, {
    method, headers: { "Content-Type": "application/json", ...(identity ? { Authorization: identity } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  try {
    assert.equal((await request("/api/consultations", "POST", body, "")).status, 401);
    assert.equal((await request("/api/consultations", "POST", body, "student")).status, 403);
    assert.equal((await request("/api/consultations", "POST", { ...body, consultationDate: "2026-02-30" })).status, 400);
    assert.equal((await request("/api/consultations", "POST", { ...body, patientId: "P-999" })).status, 404);
    assert.equal((await request("/api/consultations", "POST", { ...body, quantity: 6 })).status, 409);
    assert.equal(records.get("medicines/med-1").quantity, 5);
    const response = await request("/api/consultations", "POST", body);
    assert.equal(response.status, 201);
    const { consultation } = await response.json();
    assert.equal(consultation.patientId, "P-001");
    assert.equal(consultation.clinicStaff, "Clinic Staff");
    assert.equal(records.get("medicines/med-1").quantity, 2);
    assert.equal((await request("/api/consultations", "POST", body)).status, 201);
    assert.equal(records.get("medicines/med-1").quantity, 2);
    assert.equal((await request("/api/consultations", "POST", { ...body, quantity: 1 })).status, 409);
    const ownHistory = await request("/api/my-consultations", "GET", null, "student");
    assert.equal((await ownHistory.json()).consultations[0].consultationId, consultation.consultationId);
    records.set("patients/P-001", { uid: "someone-else" });
    assert.equal((await request("/api/my-consultations", "GET", null, "student")).status, 403);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
