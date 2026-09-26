import { useState } from "react";
import {
    Search,
    Eye,
    FileText,
    User,
    Calendar,
    Stethoscope
} from "lucide-react";
import "../../styles/MedicalRecords.css";

function MedicalRecords() {
    const [searchTerm, setSearchTerm] = useState("");

    const records = [
        {
            id: "MR-001",
            patientId: "P-001",
            patient: "Juan Dela Cruz",
            date: "2026-09-04",
            doctor: "Dr. Maria Santos",
            diagnosis: "Fever and Headache",
            status: "Completed"
        },
        {
            id: "MR-002",
            patientId: "P-002",
            patient: "Maria Garcia",
            date: "2026-09-03",
            doctor: "Dr. John Reyes",
            diagnosis: "Common Cold",
            status: "Completed"
        },
        {
            id: "MR-003",
            patientId: "P-003",
            patient: "Pedro Ramos",
            date: "2026-09-02",
            doctor: "Dr. Maria Santos",
            diagnosis: "Hypertension",
            status: "Follow-up"
        },
        {
            id: "MR-004",
            patientId: "P-004",
            patient: "Ana Cruz",
            date: "2026-09-01",
            doctor: "Dr. John Reyes",
            diagnosis: "Stomach Pain",
            status: "Completed"
        }
    ];

    const filteredRecords = records.filter((record) =>
        record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleView = (record) => {
        alert(
            `Medical Record: ${record.id}\n\n` +
            `Patient: ${record.patient}\n` +
            `Diagnosis: ${record.diagnosis}\n` +
            `Doctor: ${record.doctor}\n` +
            `Date: ${record.date}`
        );
    };

    return (
        <div className="medical-records-page">

            {/* Header */}
            <div className="records-header">
                <div>
                    <h1>Medical Records</h1>
                    <p>View and manage patient medical records</p>
                </div>

                <div className="records-icon">
                    <FileText size={28} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="records-summary">

                <div className="summary-card">
                    <div className="summary-icon">
                        <FileText size={22} />
                    </div>
                    <div>
                        <span>Total Records</span>
                        <strong>{records.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        <User size={22} />
                    </div>
                    <div>
                        <span>Patients</span>
                        <strong>4</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        <Stethoscope size={22} />
                    </div>
                    <div>
                        <span>Consultations</span>
                        <strong>4</strong>
                    </div>
                </div>

            </div>

            {/* Records Card */}
            <div className="records-card">

                <div className="records-toolbar">

                    <div>
                        <h2>Patient Records</h2>
                        <p>Search through medical records</p>
                    </div>

                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search patient or diagnosis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Record ID</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Doctor</th>
                                <th>Diagnosis</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record.id}>

                                        <td>
                                            <span className="record-id">
                                                {record.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-info">
                                                <div className="patient-avatar">
                                                    <User size={17} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {record.patient}
                                                    </strong>
                                                    <small>
                                                        {record.patientId}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="date-info">
                                                <Calendar size={15} />
                                                {record.date}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="doctor-info">
                                                <Stethoscope size={15} />
                                                {record.doctor}
                                            </div>
                                        </td>

                                        <td>
                                            {record.diagnosis}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${
                                                    record.status ===
                                                    "Completed"
                                                        ? "completed"
                                                        : "follow-up"
                                                }`}
                                            >
                                                {record.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() =>
                                                    handleView(record)
                                                }
                                            >
                                                <Eye size={16} />
                                                View
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="no-records"
                                    >
                                        <FileText size={35} />
                                        <p>No medical records found.</p>
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

export default MedicalRecords;

