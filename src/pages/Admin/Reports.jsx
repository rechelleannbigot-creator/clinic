
import { useMemo, useState } from "react";
import {
  FileText,
  Users,
  Stethoscope,
  Pill,
  Search,
  Download,
  Printer,
  Calendar,
  Filter,
  Activity,
  Eye,
} from "lucide-react";
import "../../styles/Reports.css";

function Reports() {
  const [reportType, setReportType] = useState("All Reports");
  const [dateRange, setDateRange] = useState("This Month");
  const [search, setSearch] = useState("");

  // Sample data for the Reports page.
  // Replace this array with backend data when your API is ready.
  const [reports] = useState([
    {
      id: "RPT-001",
      title: "Patient Registration Report",
      type: "Patients",
      description: "Summary of registered clinic patients.",
      records: 128,
      date: "September 1, 2026",
    },
    {
      id: "RPT-002",
      title: "Consultation Report",
      type: "Consultations",
      description: "Summary of clinic consultations and visits.",
      records: 245,
      date: "September 5, 2026",
    },
    {
      id: "RPT-003",
      title: "Medicine Inventory Report",
      type: "Medicine",
      description: "Medicine stock levels and inventory records.",
      records: 56,
      date: "September 10, 2026",
    },
    {
      id: "RPT-004",
      title: "Medicine Issuance Report",
      type: "Medicine",
      description: "Medicines issued to patients by clinic staff.",
      records: 189,
      date: "September 15, 2026",
    },
    {
      id: "RPT-005",
      title: "Monthly Clinic Activity",
      type: "Activity",
      description: "Overview of clinic activities and transactions.",
      records: 562,
      date: "September 30, 2026",
    },
    {
      id: "RPT-006",
      title: "Student Medical Records Report",
      type: "Patients",
      description: "Summary of student medical record entries.",
      records: 96,
      date: "October 5, 2026",
    },
    {
      id: "RPT-007",
      title: "Clinic Staff Activity Report",
      type: "Activity",
      description: "Summary of clinic staff activities.",
      records: 74,
      date: "October 12, 2026",
    },
    {
      id: "RPT-008",
      title: "Follow-up Consultation Report",
      type: "Consultations",
      description: "Summary of follow-up clinic consultations.",
      records: 42,
      date: "October 20, 2026",
    },
  ]);

  const getIcon = (type) => {
    if (type === "Patients") return Users;
    if (type === "Consultations") return Stethoscope;
    if (type === "Medicine") return Pill;
    if (type === "Activity") return Activity;
    return FileText;
  };

  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesType =
        reportType === "All Reports" || report.type === reportType;

      const matchesSearch =
        report.id.toLowerCase().includes(keyword) ||
        report.title.toLowerCase().includes(keyword) ||
        report.type.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword);

      return matchesType && matchesSearch;
    });
  }, [reports, reportType, search]);

  const totalRecords = reports.reduce(
    (total, report) => total + report.records,
    0
  );

  const patientRecords = reports
    .filter((report) => report.type === "Patients")
    .reduce((total, report) => total + report.records, 0);

  const consultationRecords = reports
    .filter((report) => report.type === "Consultations")
    .reduce((total, report) => total + report.records, 0);

  const medicineRecords = reports
    .filter((report) => report.title === "Medicine Issuance Report")
    .reduce((total, report) => total + report.records, 0);

  // Export the currently filtered table to CSV.
  const handleExport = () => {
    if (filteredReports.length === 0) {
      window.alert("There are no reports to export.");
      return;
    }

    const columns = [
      "Report ID",
      "Report Name",
      "Category",
      "Description",
      "Number of Records",
      "Generated Date",
    ];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredReports.map((report) => [
      report.id,
      report.title,
      report.type,
      report.description,
      report.records,
      report.date,
    ]);

    const csvContent = [
      columns.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "clinic-management-reports.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Open a print-friendly report in a separate window.
  const handlePrint = (report = null) => {
    const selectedReports = report ? [report] : filteredReports;

    if (selectedReports.length === 0) {
      window.alert("There are no reports to print.");
      return;
    }

    const escapeHTML = (value) =>
      String(value ?? "").replace(/[&<>"']/g, (character) => {
        const entities = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        };
        return entities[character];
      });

    const tableRows = selectedReports
      .map(
        (item) => `
          <tr>
            <td>${escapeHTML(item.id)}</td>
            <td>${escapeHTML(item.title)}</td>
            <td>${escapeHTML(item.type)}</td>
            <td>${escapeHTML(item.records)}</td>
            <td>${escapeHTML(item.date)}</td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1000,height=700");

    if (!printWindow) {
      window.alert(
        "The print window was blocked. Please allow pop-ups for this site."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Clinic Management System - Reports</title>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 28px;
              color: #1e293b;
            }
            h1 { color: #173b63; margin-bottom: 6px; }
            p { color: #64748b; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }
            th, td {
              border: 1px solid #dbe3ed;
              padding: 12px 10px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background: #edf4fb;
              color: #173b63;
            }
            tr { page-break-inside: avoid; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Clinic Management System</h1>
          <p>${report ? "Individual Report" : "Clinic Reports Summary"}</p>
          <p>Report period: ${escapeHTML(dateRange)}</p>
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Name</th>
                <th>Category</th>
                <th>Records</th>
                <th>Generated Date</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="reports-page">
      {/* Page header */}
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>
            Generate, view, export, and manage clinic management reports.
          </p>
        </div>

        <button className="reports-primary-btn" onClick={handleExport}>
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="report-summary">
        <div className="report-summary-card">
          <div className="report-summary-icon blue">
            <FileText size={23} />
          </div>
          <div>
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
            <small>Available reports</small>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon green">
            <Users size={23} />
          </div>
          <div>
            <span>Patient Records</span>
            <strong>{patientRecords}</strong>
            <small>Patient-related records</small>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon purple">
            <Stethoscope size={23} />
          </div>
          <div>
            <span>Consultations</span>
            <strong>{consultationRecords}</strong>
            <small>Consultation report records</small>
          </div>
        </div>

        <div className="report-summary-card">
          <div className="report-summary-icon orange">
            <Pill size={23} />
          </div>
          <div>
            <span>Medicines Issued</span>
            <strong>{medicineRecords}</strong>
            <small>Issuance report records</small>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-filter-card">
        <div className="filter-title">
          <Filter size={18} />
          <h2>Report Filters</h2>
        </div>

        <div className="report-filters">
          <div className="filter-group">
            <label htmlFor="reportType">Report Category</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
            >
              <option>All Reports</option>
              <option>Patients</option>
              <option>Consultations</option>
              <option>Medicine</option>
              <option>Activity</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dateRange">Date Range</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
            >
              <option>This Month</option>
              <option>Today</option>
              <option>This Week</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>All Dates</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label htmlFor="reportSearch">Search Reports</label>
            <div className="reports-search">
              <Search size={18} />
              <input
                id="reportSearch"
                type="search"
                placeholder="Search ID, name, or category..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports table */}
      <div className="reports-card">
        <div className="reports-card-header">
          <div>
            <h2>Clinic Reports Table</h2>
            <p>
              View the details of reports generated by the clinic system.
            </p>
          </div>

          <span className="report-count">
            {filteredReports.length}{" "}
            {filteredReports.length === 1 ? "report" : "reports"}
          </span>
        </div>

        <div className="reports-table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Name</th>
                <th>Category</th>
                <th>Records</th>
                <th>Generated Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const Icon = getIcon(report.type);

                  return (
                    <tr key={report.id}>
                      <td>
                        <span className="report-id">{report.id}</span>
                      </td>

                      <td>
                        <div className="report-name-cell">
                          <div className="table-report-icon">
                            <Icon size={19} />
                          </div>
                          <div>
                            <strong>{report.title}</strong>
                            <small>{report.description}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`report-category category-${report.type.toLowerCase()}`}
                        >
                          {report.type}
                        </span>
                      </td>

                      <td>
                        <span className="record-number">
                          {report.records.toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <span className="report-date">
                          <Calendar size={15} />
                          {report.date}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-action-btn view-btn"
                            title={`View ${report.title}`}
                            aria-label={`View ${report.title}`}
                            onClick={() => handlePrint(report)}
                          >
                            <Eye size={16} />
                            View
                          </button>

                          <button
                            type="button"
                            className="table-action-btn print-btn"
                            title={`Print ${report.title}`}
                            aria-label={`Print ${report.title}`}
                            onClick={() => handlePrint(report)}
                          >
                            <Printer size={16} />
                            Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="reports-empty">
                    <FileText size={36} />
                    <strong>No Reports Found</strong>
                    <span>
                      Try another category or search keyword.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setReportType("All Reports");
                        setSearch("");
                      }}
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="reports-table-footer">
          <span>
            Showing {filteredReports.length} of {reports.length} reports
          </span>

          <div className="table-footer-actions">
            <button
              type="button"
              className="footer-btn"
              onClick={handleExport}
            >
              <Download size={16} />
              Export Table
            </button>

            <button
              type="button"
              className="footer-btn"
              onClick={() => handlePrint()}
            >
              <Printer size={16} />
              Print Table
            </button>
          </div>
        </div>
      </div>

      <p className="reports-note">
        Note: Report totals are based on the sample data currently in this
        page. Connect your backend to display actual clinic records.
      </p>
    </div>
  );
}

export default Reports;
