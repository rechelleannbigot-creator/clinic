import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerIssuanceRoutes } from "./issuanceRoutes.js";

function fakeDatabase() {
  const records = new Map([
    ["patients/P-001", { firstName: "Test", lastName: "Student", studentId: "S-001", course: "Course", yearLevel: "1" }],
    ["medicines/med-1", { name: "Medicine", unit: "tablets", quantity: 5, expirationDate: "2099-12-31" }],
    ["consultations/CON-old", { consultationId: "CON-old", patientId: "P-001", patientName: "Test Student", medicineId: "med-1", medicine: "Medicine", quantity: 1, diagnosis: "Reason", createdAt: "2025-01-01T00:00:00.000Z" }],
  ]);
  const snapshot = (key) => ({ id: key.split("/")[1], exists: records.has(key), data: () => records.get(key) });
  let queue = Promise.resolve();
  return {
    records,
    db: {
      collection(name) {
        const collection = {
          doc(id) { return { id, key: `${name}/${id}`, get: async () => snapshot(`${name}/${id}`) }; },
          async get() { return { docs: [...records.keys()].filter((key) => key.startsWith(`${name}/`)).map(snapshot) }; },
          where(field, _op, value) { return { get: async () => ({ docs: (await collection.get()).docs.filter((doc) => doc.data()[field] === value) }) }; },
        };
        return collection;
      },
      runTransaction(callback) {
        const run = queue.then(async () => {
          const writes = [];
          const result = await callback({
            get: async (ref) => snapshot(ref.key),
            create: (ref, data) => writes.push(() => records.set(ref.key, data)),
            update: (ref, data) => writes.push(() => records.set(ref.key, { ...records.get(ref.key), ...data })),
          });
          writes.forEach((write) => write());
          return result;
        });
        queue = run.catch(() => {});
        return run;
      },
    },
  };
}

test("issuance validates authorization and saves atomically with idempotent retries", async () => {
  const { db, records } = fakeDatabase();
  const app = express();
  app.use(express.json());
  const staff = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: "Sign in required." });
    if (req.headers.authorization !== "staff") return res.status(403).json({ message: "Forbidden." });
    req.authUser = { uid: "staff-1", email: "staff@example.test" };
    req.staffProfile = { firstName: "Clinic", lastName: "Staff" };
    next();
  };
  registerIssuanceRoutes(app, { db, requireClinicStaff: staff });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, method = "GET", data, identity = "staff") => fetch(`${base}${path}`, {
    method, headers: { "Content-Type": "application/json", ...(identity ? { Authorization: identity } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  const body = { requestId: "7b2c8254-314a-4af5-a169-bf5b85966222", patientId: "P-001", medicineId: "med-1", quantity: 3, dosage: "One", instructions: "After food", reason: "Pain" };
  try {
    assert.equal((await request("/api/medicine-issuances", "POST", body, "")).status, 401);
    assert.equal((await request("/api/medicine-issuances", "POST", body, "student")).status, 403);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, quantity: 0 })).status, 400);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, quantity: 1.5 })).status, 400);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, quantity: true })).status, 400);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, reason: " " })).status, 400);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, patientId: "missing" })).status, 404);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, medicineId: "missing" })).status, 409);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, quantity: 6 })).status, 409);
    assert.equal(records.get("medicines/med-1").quantity, 5);
    const responses = await Promise.all([request("/api/medicine-issuances", "POST", body), request("/api/medicine-issuances", "POST", body)]);
    assert.deepEqual(responses.map((response) => response.status), [201, 201]);
    const { issuance } = await responses[0].json();
    assert.equal(issuance.issuedBy, "Clinic Staff");
    assert.equal(issuance.studentId, "S-001");
    assert.equal(records.get("medicines/med-1").quantity, 2);
    assert.equal((await request("/api/medicine-issuances", "POST", { ...body, quantity: 1 })).status, 409);
    const competing = { ...body, requestId: "7b2c8254-314a-4af5-a169-bf5b85966223" };
    assert.equal((await request("/api/medicine-issuances", "POST", competing)).status, 409);
    assert.equal(records.get("medicines/med-1").quantity, 2);
    const history = await (await request("/api/medicine-issuances?patientId=P-001")).json();
    assert.equal(history.issuances.length, 2);
    assert.equal(history.issuances[1].source, "consultation");
    assert.equal((await (await request(`/api/medicine-issuances/${issuance.issuanceId}`)).json()).issuance.reason, "Pain");
    assert.equal((await (await request("/api/medicine-issuances/CON-old")).json()).issuance.studentId, "S-001");
    assert.equal((await request("/api/medicine-issuances/missing")).status, 404);
    assert.equal((await request("/api/medicine-issuances", "GET", null, "student")).status, 403);
    records.set("medicines/med-1", { name: "Medicine", quantity: 5, expirationDate: "2000-01-01" });
    assert.equal((await request("/api/medicine-issuances", "POST", competing)).status, 409);
    assert.equal(records.get("medicines/med-1").quantity, 5);
    records.set("medicines/med-1", { name: "Medicine", quantity: 5, expirationDate: "2099-12-31" });
    const simultaneous = await Promise.all([
      request("/api/medicine-issuances", "POST", { ...competing, quantity: 4 }),
      request("/api/medicine-issuances", "POST", { ...competing, requestId: "7b2c8254-314a-4af5-a169-bf5b85966224", quantity: 4 }),
    ]);
    assert.deepEqual(simultaneous.map((response) => response.status).sort(), [201, 409]);
    assert.equal(records.get("medicines/med-1").quantity, 1);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
