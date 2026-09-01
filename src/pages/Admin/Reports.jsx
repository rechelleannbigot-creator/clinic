import { useState } from "react";
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
} from "lucide-react";
import "../../styles/Reports.css";

function Reports() {
    const [reportType, setReportType] = useState("All Reports");
    const [dateRange, setDateRange] = useState("This Month");
    const [search, setSearch] = useState("");

    const reports = [
        {
            id: "RPT-001",
            title: "Patient Registration Report",
            type: "Patients",
            description: "Summary of newly registered patients.",
            records: 128,
            date: "September 1, 2026",
            icon: Users,
        },
        {
            id: "RPT-002",
            title: "Consultation Report",
            type: "Consultations",
            description: "Summary of patient consultations.",
            records: 245,
            date: "September 1, 2026",
            icon: Stethoscope,
        },
        {
            id: "RPT-003",
            title: "Medicine Inventory Report",
            type: "Medicine",
            description: "Current medicine stock and inventory.",
            records: 56,
            date: "September 1, 2026",
            icon: Pill,
        },
        {
            id: "RPT-004",
            title: "Medicine Issuance Report",
            type: "Medicine",
            description: "Summary of medicines issued to patients.",
            records: 189,
            date: "September 1, 2026",
            icon: Pill,
        },
        {
            id: "RPT-005",
            title: "Monthly Clinic Activity",
            type: "Activity",
            description: "Overall clinic activity for the selected period.",
            records: 562,
            date: "September 1, 2026",
            icon: FileText,
        },
    ];

    const filteredReports = reports.filter((report) => {
        const matchesType =
            reportType === "All Reports" || report.type === reportType;

        const matchesSearch =
            report.title.toLowerCase().includes(search.toLowerCase()) ||
            report.description.toLowerCase().includes(search.toLowerCase());

        return matchesType && matchesSearch;
    });

    const handleExport = (report) => {
        alert(`Exporting ${report.title}...`);
    };

    const handlePrint = (report) => {
        alert(`Preparing ${report.title} for printing...`);
    };

    return (
        <div className="reports-page">
            {/* Page Header */}
            <div className="reports-header">
                <div>
                    <h1>Reports</h1>
                    <p>
                        Generate, view, and manage clinic management reports.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="report-summary">
                <div className="report-summary-card">
                    <div className="report-summary-icon blue">
                        <FileText size={24} />
                    </div>

                    <div>
                        <span>Total Reports</span>
                        <strong>{reports.length}</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon green">
                        <Users size={24} />
                    </div>

                    <div>
                        <span>Patient Records</span>
                        <strong>128</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon purple">
                        <Stethoscope size={24} />
                    </div>

                    <div>
                        <span>Consultations</span>
                        <strong>245</strong>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-summary-icon orange">
                        <Pill size={24} />
                    </div>

                    <div>
                        <span>Medicine Issued</span>
                        <strong>189</strong>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="reports-filter-card">
                <div className="filter-title">
                    <Filter size={18} />
                    <span>Report Filters</span>
                </div>

                <div className="report-filters">
                    <div className="filter-group">
                        <label>Report Type</label>

                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                        >
                            <option>All Reports</option>
                            <option>Patients</option>
                            <option>Consultations</option>
                            <option>Medicine</option>
                            <option>Activity</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Date Range</label>

                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option>This Month</option>
                            <option>Today</option>
                            <option>This Week</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="filter-group search-group">
                        <label>Search</label>

                        <div className="reports-search">
                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="reports-card">
                <div className="reports-card-header">
                    <div>
                        <h2>Available Reports</h2>
                        <p>
                            Select a report to view, export, or print.
                        </p>
                    </div>

                    <div className="selected-period">
                        <Calendar size={16} />
                        {dateRange}
                    </div>
                </div>

                <div className="reports-list">
                    {filteredReports.length > 0 ? (
                        filteredReports.map((report) => {
                            const Icon = report.icon;

                            return (
                                <div
                                    className="report-item"
                                    key={report.id}
                                >
                                    <div className="report-icon">
                                        <Icon size={22} />
                                    </div>

                                    <div className="report-info">
                                        <div className="report-title-row">
                                            <h3>{report.title}</h3>

                                            <span className="report-type">
                                                {report.type}
                                            </span>
                                        </div>

                                        <p>{report.description}</p>

                                        <div className="report-meta">
                                            <span>
                                                Report ID: {report.id}
                                            </span>

                                            <span>
                                                Records: {report.records}
                                            </span>

                                            <span>
                                                Generated: {report.date}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="report-actions">
                                        <button
                                            className="export-report-btn"
                                            onClick={() =>
                                                handleExport(report)
                                            }
                                        >
                                            <Download size={16} />
                                            Export
                                        </button>

                                        <button
                                            className="print-report-btn"
                                            onClick={() =>
                                                handlePrint(report)
                                            }
                                        >
                                            <Printer size={16} />
                                            Print
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-reports">
                            <FileText size={40} />
                            <h3>No Reports Found</h3>
                            <p>
                                Try changing your filters or search keyword.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reports;

