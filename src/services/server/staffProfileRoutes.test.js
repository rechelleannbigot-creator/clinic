import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerStaffProfileRoutes } from "./staffProfileRoutes.js";

test("staff profile is scoped to the signed-in user and validates updates", async () => {
  const users = new Map([
    ["staff-1", { role: "staff", firstName: "Staff", lastName: "One", employeeId: "E-1", department: "Clinic", photoURL: "https://example.test/old.jpg" }],
    ["staff-2", { role: "staff", firstName: "Staff", lastName: "Two" }],
    ["admin", { role: "admin" }],
  ]);
  const db = { collection: () => ({ doc: (id) => ({ update: async (updates) => {
    if (!users.has(id)) throw new Error("Missing user");
    users.set(id, { ...users.get(id), ...updates });
  } }) }) };
  const requireClinicStaff = (req, res, next) => {
    const uid = req.get("X-Test-User");
    if (!users.has(uid)) return res.status(401).json({ message: "Sign in required." });
    req.authUser = { uid, email: `${uid}@example.test` };
    req.staffProfile = users.get(uid);
    next();
  };
  const app = express();
  app.use(express.json({ limit: "1mb" }));
  registerStaffProfileRoutes(app, { db, requireClinicStaff });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const request = (method, body, user = "staff-1") => fetch(`http://127.0.0.1:${server.address().port}/api/staff/me/profile`, {
    method,
    headers: { "Content-Type": "application/json", "X-Test-User": user },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const fields = { firstName: " New ", middleName: "", lastName: "Name", gender: "", birthDate: "2000-02-29", phone: "+63 912 345 6789", address: "Address" };
  try {
    assert.equal((await request("GET", null, "unknown")).status, 401);
    assert.equal((await request("GET", null, "admin")).status, 403);
    assert.equal((await request("PUT", { ...fields, role: "admin" })).status, 400);
    assert.equal((await request("PUT", { ...fields, employeeId: "E-2" })).status, 400);
    assert.equal((await request("PUT", { ...fields, birthDate: "2025-02-29" })).status, 400);
    assert.equal((await request("PUT", { ...fields, phone: "+++" })).status, 400);
    assert.equal((await request("PUT", { ...fields, photoURL: "data:image/svg+xml;base64,PHN2Zz4=" })).status, 400);
    const response = await request("PUT", fields);
    assert.equal(response.status, 200);
    const { profile } = await response.json();
    assert.equal(profile.firstName, "New");
    assert.equal(profile.email, "staff-1@example.test");
    assert.equal(profile.photoURL, "https://example.test/old.jpg");
    assert.equal(users.get("staff-1").employeeId, "E-1");
    assert.equal(users.get("staff-1").department, "Clinic");
    assert.equal(users.get("staff-2").firstName, "Staff");
    assert.equal((await request("PUT", { ...fields, photoURL: "data:image/png;base64,iVBORw0KGgo=" })).status, 200);
    assert.equal(users.get("staff-1").photoURL, "data:image/png;base64,iVBORw0KGgo=");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
