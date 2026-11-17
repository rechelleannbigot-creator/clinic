import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerClinicRoutes } from "./clinicRoutes.js";

test("staff dashboard projects clinic data, enforces roles and persists per-user read state", async () => {
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const soon = new Date(`${today}T00:00:00Z`);
  soon.setUTCDate(soon.getUTCDate() + 30);
  const records = new Map([
    ["patients/P-001", { firstName: "Test", lastName: "Patient", yearLevel: "1", course: "Course", createdAt: now.toISOString(), medicalProfile: { diagnosis: "private" } }],
    ["medicines/low", { name: "Low", quantity: 0, reorderLevel: 3, unit: "tablet", expirationDate: "2099-01-01" }],
    ["medicines/soon", { name: "Soon", quantity: 5, reorderLevel: 1, unit: "tablet", expirationDate: soon.toISOString().slice(0, 10) }],
    ["medicines/expired", { name: "Expired", quantity: 2, reorderLevel: 0, unit: "tablet", expirationDate: "2000-01-01" }],
    ["medicines/invalid", { name: "Invalid", quantity: 5, reorderLevel: 1, unit: "tablet", expirationDate: "" }],
    ["consultations/CON-1", { consultationId: "CON-1", patientName: "Test Patient", consultationDate: today, consultationType: "Follow-up", clinicStaff: "Staff", medicine: "Low", createdAt: now.toISOString(), diagnosis: "private" }],
  ]);
  const db = {
    collection(path) {
      return {
        doc(id) {
          const key = `${path}/${id}`;
          return {
            id, get: async () => ({ id, exists: records.has(key), data: () => records.get(key) }),
            set: async (value) => records.set(key, value),
            collection: (name) => db.collection(`${key}/${name}`),
          };
        },
        get: async () => ({ docs: [...records.entries()].filter(([key]) => key.startsWith(`${path}/`) && !key.slice(path.length + 1).includes("/")).map(([key, data]) => ({ id: key.slice(path.length + 1), data: () => data })) }),
      };
    },
  };
  const staffAuth = (req, res, next) => {
    const identity = req.headers.authorization;
    if (!identity) return res.status(401).json({ message: "Sign in required." });
    if (identity === "student") return res.status(403).json({ message: "Forbidden." });
    req.authUser = { uid: identity };
    req.staffProfile = { role: identity === "admin" ? "admin" : "staff" };
    next();
  };
  const app = express();
  app.use(express.json());
  registerClinicRoutes(app, { db, requireClinicStaff: staffAuth, requireSignedIn: staffAuth });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, identity = "staff-1", method = "GET") => fetch(`${base}${path}`, { method, headers: identity ? { Authorization: identity } : {} });
  try {
    assert.equal((await request("/api/staff/dashboard", "")).status, 401);
    assert.equal((await request("/api/staff/dashboard", "student")).status, 403);
    assert.equal((await request("/api/staff/dashboard", "admin")).status, 403);
    const dashboard = await (await request("/api/staff/dashboard")).json();
    assert.deepEqual(dashboard.stats, { patients: 1, consultationsToday: 1, availableMedicines: 1, lowStock: 1, issuedToday: 1, medicalRecords: 1 });
    assert.equal(dashboard.medicines.find((item) => item.id === "soon").status, "Expiring Soon");
    assert.equal(dashboard.medicines.find((item) => item.id === "expired").status, "Expired");
    assert.equal(dashboard.medicines.find((item) => item.id === "low").status, "Out of Stock");
    assert.equal(dashboard.medicines.find((item) => item.id === "invalid").status, "Unknown");
    assert.equal(JSON.stringify(dashboard).includes("private"), false);
    const patient = await (await request("/api/staff/dashboard/patients/P-001")).json();
    assert.equal(patient.patient.name, "Test Patient");
    assert.equal(JSON.stringify(patient).includes("private"), false);
    assert.equal((await request("/api/staff/dashboard/patients/P-999")).status, 404);
    const id = dashboard.notifications[0].id;
    assert.equal((await request(`/api/staff/dashboard/notifications/${id}/read`, "staff-1", "POST")).status, 200);
    const after = await (await request("/api/staff/dashboard")).json();
    const other = await (await request("/api/staff/dashboard", "staff-2")).json();
    assert.equal(after.notifications.find((item) => item.id === id).unread, false);
    assert.equal(other.notifications.find((item) => item.id === id).unread, true);
    assert.equal((await request("/api/staff/dashboard/notifications/invalid/read", "staff-1", "POST")).status, 400);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
