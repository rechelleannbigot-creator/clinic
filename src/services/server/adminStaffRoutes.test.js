import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { registerAdminStaffRoutes } from "./adminStaffRoutes.js";

function createTestApp() {
  const documents = new Map([
    ["admin-1", { role: "admin", email: "admin@example.test" }],
    ["staff-1", {
      role: "clinicstaff", staffId: "S-001", firstName: "Existing", lastName: "Staff",
      email: "existing@example.test", phone: "09123456789", position: "Nurse", status: "ACTIVE",
    }],
  ]);
  const users = {
    doc(uid) {
      const ref = {
        id: uid,
        get: async () => {
          const data = documents.get(uid);
          return { exists: Boolean(data), data: () => data, ref };
        },
        update: async (updates) => {
          if (!documents.has(uid)) throw Object.assign(new Error("not found"), { code: "not-found" });
          documents.set(uid, { ...documents.get(uid), ...updates });
        },
        delete: async () => documents.delete(uid),
        create: async (data) => documents.set(uid, data),
      };
      return ref;
    },
    get: async () => ({
      docs: [...documents.entries()].map(([id, data]) => ({ id, data: () => data })),
    }),
  };
  let counter = 1;
  const counters = {
    doc: () => ({ get: async () => ({ data: () => ({ lastNumber: counter - 1 }) }) }),
  };
  const db = {
    collection: (name) => name === "users" ? users : counters,
    runTransaction: async (callback) => {
      const writes = [];
      const result = await callback({
        get: async (ref) => ref.get(),
        set: (_ref, data) => writes.push(() => { counter = data.lastNumber + 1; }),
        create: (ref, data) => writes.push(() => documents.set(ref.id, data)),
      });
      writes.forEach((write) => write());
      return result;
    },
  };
  const authUsers = new Map([
    ["admin-1", { uid: "admin-1", email: "admin@example.test", disabled: false, metadata: {} }],
    ["staff-1", { uid: "staff-1", email: "existing@example.test", disabled: false, metadata: { lastSignInTime: "2026-01-02T03:04:05Z" } }],
  ]);
  let nextUid = 1;
  const auth = {
    getUser: async (uid) => {
      const user = authUsers.get(uid);
      if (!user) throw Object.assign(new Error("not found"), { code: "auth/user-not-found" });
      return user;
    },
    createUser: async (data) => {
      if ([...authUsers.values()].some((user) => user.email === data.email)) {
        throw Object.assign(new Error("email exists"), { code: "auth/email-already-exists" });
      }
      const user = { uid: `created-${nextUid++}`, ...data, metadata: {} };
      authUsers.set(user.uid, user);
      return user;
    },
    updateUser: async (uid, updates) => {
      const user = await auth.getUser(uid);
      const updated = { ...user, ...updates };
      authUsers.set(uid, updated);
      return updated;
    },
    deleteUser: async (uid) => {
      if (!authUsers.delete(uid)) throw Object.assign(new Error("not found"), { code: "auth/user-not-found" });
    },
  };
  const app = express();
  app.use(express.json());
  const requireAdmin = (req, res, next) => {
    if (req.get("x-admin") !== "true") return res.status(403).json({ message: "Admin required." });
    req.authUser = { uid: "admin-1" };
    next();
  };
  registerAdminStaffRoutes(app, { db, auth, requireAdmin });
  return { app, documents, authUsers };
}

test("admin staff API creates, lists, updates status, and deletes staff accounts", async () => {
  const { app, documents, authUsers } = createTestApp();
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const base = `http://127.0.0.1:${server.address().port}/api/admin/staff`;
  const request = (path = "", method = "GET", body, admin = true) => fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(admin ? { "X-Admin": "true" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = {
    firstName: "Taylor", middleName: "A", lastName: "Nurse",
    email: "taylor@example.test", phone: "09123456789", gender: "Female",
    position: "Clinic Nurse", status: "ACTIVE",
  };
  try {
    assert.equal((await request("", "GET", null, false)).status, 403);
    const list = await request();
    assert.equal(list.status, 200);
    assert.equal((await list.json()).staff.length, 1);
    assert.equal((await request("", "POST", { ...payload, email: "bad-email" })).status, 400);
    const createdResponse = await request("", "POST", payload);
    assert.equal(createdResponse.status, 201);
    const created = (await createdResponse.json()).staff;
    assert.equal(created.staffId, "S-002");
    assert.equal(created.position, "Clinic Nurse");
    assert.equal(documents.get(created.uid).role, "clinicstaff");
    assert.equal((await request("", "POST", payload)).status, 409);

    const detailResponse = await request(`/${created.uid}`);
    assert.equal(detailResponse.status, 200);
    assert.equal((await detailResponse.json()).staff.lastLogin, "");

    const updatedResponse = await request(`/${created.uid}`, "PUT", { ...payload, status: "INACTIVE" });
    assert.equal(updatedResponse.status, 200);
    assert.equal((await updatedResponse.json()).staff.status, "Inactive");
    assert.equal(authUsers.get(created.uid).disabled, true);

    assert.equal((await request("/admin-1", "DELETE")).status, 404);
    assert.equal((await request(`/${created.uid}`, "DELETE")).status, 200);
    assert.equal(documents.has(created.uid), false);
    assert.equal(authUsers.has(created.uid), false);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
