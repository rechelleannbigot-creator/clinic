import test from "node:test";
import assert from "node:assert/strict";
import { calendarDate, emptyFilters, filterRecords } from "./reportModel.js";

test("report filtering uses Philippine dates and matches patient ID, type and staff together", () => {
  const rows = [
    { id: "1", patientId: "P-001", studentId: "S-12", patientName: "Jane Doe", date: "2026-01-01T17:00:00Z", type: "Follow-up", staff: "Nurse" },
    { id: "2", patientId: "P-002", patientName: "Jane Doe", date: "", type: "Follow-up", staff: "Nurse" },
    { id: "3", patientId: "P-001", date: "2026-01-02", type: "Emergency", staff: "Nurse" },
  ];
  assert.equal(calendarDate(rows[0].date), "2026-01-02");
  assert.deepEqual(filterRecords(rows, "consultations", { ...emptyFilters, search: "s-12", start: "2026-01-02", end: "2026-01-02", consultationType: "Follow-up", staff: "Nurse" }).map((row) => row.id), ["1"]);
  assert.deepEqual(filterRecords(rows, "consultations", { ...emptyFilters, search: "jane", start: "2026-01-02" }).map((row) => row.id), ["1"]);
});

test("medicine and transaction type filters use the selected category", () => {
  assert.deepEqual(filterRecords([{ name: "A" }, { name: "B" }], "medicines", { ...emptyFilters, medicine: "B" }), [{ name: "B" }]);
  assert.deepEqual(filterRecords([{ medicine: "A" }, { medicine: "B" }], "issuances", { ...emptyFilters, medicine: "A" }), [{ medicine: "A" }]);
  assert.deepEqual(filterRecords([{ type: "Consultation" }, { type: "Medicine issuance" }], "transactions", { ...emptyFilters, transactionType: "Consultation" }), [{ type: "Consultation" }]);
});
