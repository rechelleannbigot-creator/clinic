import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { Timestamp } from "firebase-admin/firestore";
import { registerEmployeeRoutes } from "./employeeRoutes.js";

test("employee list sorts Firestore timestamps and handles older records", async () => {
  const records = [
    { id: "missing", data: () => ({}) },
    { id: "older", data: () => ({ createdAt: Timestamp.fromDate(new Date("2024-01-01T00:00:00Z")) }) },
    { id: "newest", data: () => ({ createdAt: Timestamp.fromDate(new Date("2026-01-01T00:00:00Z")) }) },
    { id: "string", data: () => ({ createdAt: "2025-01-01T00:00:00Z" }) },
    { id: "invalid", data: () => ({ createdAt: "invalid" }) },
  ];
  const db = { collection: () => ({ get: async () => ({ docs: records }) }) };
  const app = express();
  const requireSignedIn = (_req, _res, next) => next();
  registerEmployeeRoutes(app, { db, requireSignedIn });
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/employees`);
    assert.equal(response.status, 200);
    const { employees } = await response.json();
    assert.deepEqual(employees.map((employee) => employee.id), [
      "newest", "string", "older", "missing", "invalid",
    ]);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
