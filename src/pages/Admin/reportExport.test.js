import test from "node:test";
import assert from "node:assert/strict";
import ExcelJS from "exceljs";
import { exportExcel, makeReportPdf, printReport } from "./reportExport.js";

const report = {
  category: "patients", title: "Student Report", admin: "Admin", generatedAt: "2026-01-02T00:00:00Z",
  filters: "search: Jane", columns: [["id", "Patient ID"], ["name", "Name"]],
  rows: [{ id: "P-001", name: "=Jane <test>" }],
};

test("Excel export writes the generated rows as text and includes report metadata", async () => {
  const originalDocument = globalThis.document;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;
  let blob;
  let download;
  URL.createObjectURL = (value) => { blob = value; return "blob:test"; };
  URL.revokeObjectURL = () => {};
  globalThis.document = {
    body: { appendChild() {} },
    createElement: () => ({ click() { download = this.download; }, remove() {} }),
  };
  try {
    await exportExcel(report);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await blob.arrayBuffer());
    const sheet = workbook.getWorksheet("Report");
    assert.equal(download, "patients-report.xlsx");
    assert.equal(sheet.getCell("A1").value, "La Consolacion College of Isabela");
    assert.equal(sheet.getCell("A4").value, "Filters: search: Jane");
    assert.equal(sheet.getCell("B6").value, "=Jane <test>");
  } finally {
    globalThis.document = originalDocument;
    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test("PDF and print exports include the generated report and escape printed data", async () => {
  const originalWindow = globalThis.window;
  let html;
  let printed = false;
  try {
    const pdf = (await makeReportPdf(report)).output();
    assert.match(pdf, /Student Report/);
    assert.match(pdf, /P-001/);
    globalThis.window = { open: () => ({ document: { write: (value) => { html = value; }, close() {} }, focus() {}, print() { printed = true; } }) };
    printReport(report);
    assert.equal(printed, true);
    assert.match(html, /La Consolacion College of Isabela/);
    assert.match(html, /=Jane &lt;test&gt;/);
    assert.doesNotMatch(html, /=Jane <test>/);
  } finally {
    globalThis.window = originalWindow;
  }
});
