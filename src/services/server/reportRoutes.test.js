import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerReportRoutes } from "./reportRoutes.js";

test("admin reports use existing records and include consultation issuances once", async () => {
  const records = {
    patients: [{ id: "P-1", data: { firstName: "Test", lastName: "Student", createdAt: "2026-01-01T00:00:00Z", studentId: "S-1" } }],
    consultations: [{ id: "CON-1", data: { consultationId: "CON-1", patientId: "P-1", patientName: "Test Student", medicineId: "M-1", medicine: "Medicine", quantity: 2, consultationType: "Follow-up", createdAt: "2026-01-02T00:00:00Z" } }],
    medicines: [{ id: "M-1", data: { name: "Medicine", quantity: 0, reorderLevel: 5 } }, { id: "M-2", data: { quantity: 1 } }],
    medicineIssuances: [{ id: "ISS-1", data: { patientId: "P-1", patientName: "Test Student", medicineName: "Medicine", quantity: 3, createdAt: "2026-01-03T00:00:00Z" } }],
    users: [{ id: "staff", data: { role: "clinicstaff", firstName: "Clinic", lastName: "Staff", status: "ACTIVE" } }, { id: "student", data: { role: "student" } }],
  };
  const db = { collection: (name) => ({ get: async () => ({ docs: records[name].map((item) => ({ id: item.id, data: () => item.data })) }) }) };
  const auth = { getUser: async (uid) => ({ uid, email: "staff@example.test", disabled: true }) };
  const app = express();
  const requireAdmin = (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).json({ message: "Sign in required." });
    if (req.headers.authorization !== "admin") return res.status(403).json({ message: "Forbidden." });
    next();
  };
  registerReportRoutes(app, { db, auth, requireAdmin });
  const server = await new Promise((resolve) => { const listener = app.listen(0, "127.0.0.1", () => resolve(listener)); });
  const request = (identity) => fetch(`http://127.0.0.1:${server.address().port}/api/admin/reports`, { headers: identity ? { Authorization: identity } : {} });
  try {
    assert.equal((await request()).status, 401);
    assert.equal((await request("staff")).status, 403);
    assert.equal((await request("student")).status, 403);
    const response = await request("admin");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const result = await response.json();
    assert.equal(result.patients.length, 1);
    assert.equal(result.consultations.length, 1);
    assert.deepEqual(result.issuances.map((item) => item.quantity), [3, 2]);
    assert.equal(result.issuances[1].studentId, "S-1");
    assert.equal(result.transactions.length, 4);
    assert.equal(new Set(result.transactions.map((item) => item.id)).size, 4);
    assert.equal(result.medicines[0].lowStock, true);
    assert.equal(result.medicines[1].status, "Unknown");
    assert.equal(result.staff.length, 1);
    assert.equal(result.staff[0].status, "Inactive");
    records.consultations.push({ id: "CON-2", data: { consultationId: "CON-2" } });
    assert.equal((await (await request("admin")).json()).consultations.length, 2);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
