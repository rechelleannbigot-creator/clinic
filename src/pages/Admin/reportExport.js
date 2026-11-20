import { displayValue } from "./reportModel.js";

const school = "La Consolacion College of Isabela";
const generatedDate = (date) => new Date(date).toLocaleString("en-PH", {
  timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short",
});
const rowsOf = (report) => report.rows.map((row) => report.columns.map(([key]) => displayValue(key, row[key])));

export async function makeReportPdf(report) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(15);
  doc.setTextColor(23, 59, 99);
  doc.text(school, 14, 16);
  doc.setFontSize(12);
  doc.text(report.title, 14, 24);
  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(`Generated: ${generatedDate(report.generatedAt)} (Philippine time) | Administrator: ${report.admin} | Records: ${report.rows.length}`, 14, 31);
  const filterLines = doc.splitTextToSize(`Filters: ${report.filters}`, doc.internal.pageSize.getWidth() - 28);
  doc.text(filterLines, 14, 36);
  autoTable(doc, { startY: 39 + filterLines.length * 4, head: [report.columns.map(([, label]) => label)], body: rowsOf(report),
    styles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" }, headStyles: { fillColor: [23, 59, 99] },
    didDrawPage: (data) => { doc.setFontSize(8); doc.text(`Page ${data.pageNumber}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 8); } });
  return doc;
}

export async function exportPdf(report) {
  const doc = await makeReportPdf(report);
  doc.save(`${report.category}-report.pdf`);
}

export async function exportExcel(report) {
  const ExcelJS = await import("exceljs");
  const Workbook = ExcelJS.Workbook || ExcelJS.default.Workbook;
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Report");
  sheet.addRow([school]);
  sheet.addRow([report.title]);
  sheet.addRow([`Generated: ${generatedDate(report.generatedAt)} (Philippine time)`, `Administrator: ${report.admin}`, `Records: ${report.rows.length}`]);
  sheet.addRow([`Filters: ${report.filters}`]);
  sheet.addRow(report.columns.map(([, label]) => label));
  rowsOf(report).forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true, size: 15, color: { argb: "FF173B63" } };
  sheet.getRow(2).font = { bold: true, size: 12 };
  sheet.getRow(5).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF173B63" } };
  sheet.views = [{ state: "frozen", ySplit: 5 }];
  sheet.autoFilter = { from: { row: 5, column: 1 }, to: { row: 5, column: report.columns.length } };
  sheet.columns.forEach((column) => { column.width = 24; });
  const buffer = await workbook.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.category}-report.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printReport(report) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const popup = window.open("", "_blank", "width=1100,height=800");
  if (!popup) throw new Error("The print window was blocked. Allow pop-ups and try again.");
  const head = report.columns.map(([, label]) => `<th>${escape(label)}</th>`).join("");
  const body = rowsOf(report).map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("");
  popup.document.write(`<!doctype html><html><head><title>${escape(report.title)}</title><style>
    body{font:12px Arial,sans-serif;color:#1e293b;margin:24px}h1{color:#173b63;font-size:19px}h2{font-size:15px}
    table{width:100%;border-collapse:collapse;table-layout:auto}th,td{border:1px solid #dbe3ed;padding:6px;text-align:left;overflow-wrap:anywhere}
    th{background:#edf4fb;color:#173b63}tr{break-inside:avoid}@page{size:landscape}
  </style></head><body><h1>${escape(school)}</h1><h2>${escape(report.title)}</h2>
    <p>Generated: ${escape(generatedDate(report.generatedAt))} (Philippine time) | Administrator: ${escape(report.admin)} | Records: ${report.rows.length}</p><p>Filters: ${escape(report.filters)}</p>
    <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`);
  popup.document.close();
  popup.focus();
  popup.print();
}
