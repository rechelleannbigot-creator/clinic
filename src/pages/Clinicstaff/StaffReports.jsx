import { useState } from "react";
import {
    FileText,
    Users,
    Stethoscope,
    Pill,
    Calendar,
    Download,
    Search
} from "lucide-react";
import "../../styles/StaffReports.css";

function StaffReports() {
    const [reportType, setReportType] = useState("All Reports");
    const [searchTerm, setSearchTerm] = useState("");

    const reports = [
        {
            id: "RPT-001",
            date: "2026-09-04",
            type: "Consultation",
            patient: "Juan Dela Cruz",
            description: "General consultation",
            status: "Completed"
        },
        {
            id: "RPT-002",
            date: "2026-09-03",
            type: "Medical Record",
            patient: "Maria Garcia",
            description: "Follow-up examination",
            status: "Completed"
        },
        {
            id: "RPT-003",
            date: "2026-09-03",
            type: "Medicine",
            patient: "Pedro Ramos",
            description: "Medicine issuance",
            status: "Issued"
        },
        {
            id: "RPT-004",
            date: "2026-09-02",
            type: "Consultation",
            patient: "Ana Cruz",
            description: "Blood pressure check",
            status: "Completed"
        }
    ];

    const filteredReports = reports.filter((report) => {
        const matchesType =
            reportType === "All Reports" ||
            report.type === reportType;

        const matchesSearch =
            report.patient
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            report.id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            report.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesType && matchesSearch;
    });

    const handleDownload = () => {
        alert("Report download started.");
    };

    return (
        <div className="staff-reports-page">

            {/* Header */}
            <div className="reports-header">
                <div>
                    <h1>Staff Reports</h1>
                    <p>
                        View and monitor clinic activities and reports
                    </p>
                </div>

                <button
                    className="download-btn"
                    onClick={handleDownload}
                >
                    <Download size={18} />
                    Download Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="report-summary">

                <div className="report-summary-card">
                    <div className="report-icon blue">
                        <FileText size={23} />
                    </div>
                    <div>
                        <span>Total Reports</span>
                        <strong>24</strong>
                        <small>This month</small>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-icon green">
                        <Users size={23} />
                    </div>
                    <div>
                        <span>Patients Served</span>
                        <strong>86</strong>
                        <small>This month</small>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-icon purple">
                        <Stethoscope size={23} />
                    </div>
                    <div>
                        <span>Consultations</span>
                        <strong>72</strong>
                        <small>This month</small>
                    </div>
                </div>

                <div className="report-summary-card">
                    <div className="report-icon orange">
                        <Pill size={23} />
                    </div>
                    <div>
                        <span>Medicines Issued</span>
                        <strong>134</strong>
                        <small>This month</small>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <div className="reports-card">

                <div className="reports-toolbar">

                    <div>
                        <h2>Activity Reports</h2>
                        <p>Review recent clinic activities</p>
                    </div>

                    <div className="report-filters">

                        <div className="date-filter">
                            <Calendar size={17} />

                            <input
                                type="date"
                                defaultValue="2026-09-01"
                            />

                            <span>to</span>

                            <input
                                type="date"
                                defaultValue="2026-09-04"
                            />
                        </div>

                        <select
                            value={reportType}
                            onChange={(e) =>
                                setReportType(e.target.value)
                            }
                        >
                            <option>All Reports</option>
                            <option>Consultation</option>
                            <option>Medical Record</option>
                            <option>Medicine</option>
                        </select>

                    </div>

                </div>

                {/* Search */}
                <div className="report-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search reports, patients, or report ID..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                </div>

                {/* Table */}
                <div className="reports-table-container">

                    <table className="reports-table">

                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Patient</th>
                                <th>Description</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report.id}>

                                        <td>
                                            <span className="report-id">
                                                {report.id}
                                            </span>
                                        </td>

                                        <td>
                                            {report.date}
                                        </td>

                                        <td>
                                            <span
                                                className={`type-badge ${report.type
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {report.type}
                                            </span>
                                        </td>

                                        <td className="patient-name">
                                            {report.patient}
                                        </td>

                                        <td>
                                            {report.description}
                                        </td>

                                        <td>
                                            <span className="status-badge">
                                                {report.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="no-reports"
                                    >
                                        No reports found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default StaffReports;

