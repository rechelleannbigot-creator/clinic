import { useState } from "react";
import {
    Search,
    Eye,
    Calendar,
    FileText,
    Pill,
    Activity,
    X,
} from "lucide-react";
import "../../styles/StudentMedicalRecords.css";

function MedicalRecords() {
    const [search, setSearch] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);

    const records = [
        {
            id: "MR-001",
            date: "September 5, 2026",
            consultation: "General Checkup",
            complaint: "Headache and fatigue",
            diagnosis: "Tension Headache",
            treatment: "Rest and adequate hydration",
            medicine: "Paracetamol 500mg",
            status: "Completed",
        },
        {
            id: "MR-002",
            date: "August 18, 2026",
            consultation: "Follow-up",
            complaint: "Cough and sore throat",
            diagnosis: "Upper Respiratory Infection",
            treatment: "Rest and increased fluid intake",
            medicine: "Cetirizine 10mg",
            status: "Completed",
        },
        {
            id: "MR-003",
            date: "July 10, 2026",
            consultation: "Medical Consultation",
            complaint: "Stomach pain",
            diagnosis: "Gastritis",
            treatment: "Diet modification",
            medicine: "Antacid",
            status: "Completed",
        },
    ];

    const filteredRecords = records.filter((record) =>
        `${record.consultation} ${record.diagnosis} ${record.complaint}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="student-medical-page">

            {/* HEADER */}
            <div className="medical-header">
                <div>
                    <h1>Medical Records</h1>
                    <p>View your clinic consultation and medical history.</p>
                </div>

                <div className="student-health-badge">
                    <Activity size={20} />
                    <span>Health Records</span>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="medical-summary">

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
                        <Calendar size={22} />
                    </div>
                    <div>
                        <span>Latest Visit</span>
                        <strong>Sept. 5, 2026</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon">
                        <Pill size={22} />
                    </div>
                    <div>
                        <span>Medicine Records</span>
                        <strong>{records.filter(r => r.medicine).length}</strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="medical-toolbar">
                <div className="medical-search">
                    <Search size={19} />
                    <input
                        type="text"
                        placeholder="Search medical records..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* RECORDS TABLE */}
            <div className="medical-card">

                <div className="medical-card-header">
                    <div>
                        <h2>My Medical History</h2>
                        <p>Your previous clinic visits and consultation records.</p>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="medical-table">
                        <thead>
                            <tr>
                                <th>Record ID</th>
                                <th>Date</th>
                                <th>Consultation</th>
                                <th>Diagnosis</th>
                                <th>Medicine</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr key={record.id}>
                                        <td>
                                            <strong>{record.id}</strong>
                                        </td>

                                        <td>{record.date}</td>

                                        <td>{record.consultation}</td>

                                        <td>{record.diagnosis}</td>

                                        <td>
                                            {record.medicine || "None"}
                                        </td>

                                        <td>
                                            <span className="status-completed">
                                                {record.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-record-btn"
                                                onClick={() =>
                                                    setSelectedRecord(record)
                                                }
                                            >
                                                <Eye size={17} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="empty-records">
                                        No medical records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedRecord && (
                <div className="medical-modal-overlay">
                    <div className="medical-modal">

                        <div className="modal-header">
                            <div>
                                <h2>Medical Record</h2>
                                <p>{selectedRecord.id}</p>
                            </div>

                            <button
                                className="close-modal"
                                onClick={() => setSelectedRecord(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="record-details">

                            <div className="detail-item">
                                <span>Date</span>
                                <strong>{selectedRecord.date}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Consultation</span>
                                <strong>{selectedRecord.consultation}</strong>
                            </div>

                            <div className="detail-item full-width">
                                <span>Chief Complaint</span>
                                <strong>{selectedRecord.complaint}</strong>
                            </div>

                            <div className="detail-item full-width">
                                <span>Diagnosis</span>
                                <strong>{selectedRecord.diagnosis}</strong>
                            </div>

                            <div className="detail-item full-width">
                                <span>Treatment</span>
                                <strong>{selectedRecord.treatment}</strong>
                            </div>

                            <div className="detail-item full-width">
                                <span>Medicine</span>
                                <strong>
                                    {selectedRecord.medicine || "No medicine prescribed"}
                                </strong>
                            </div>

                        </div>

                        <button
                            className="modal-done-btn"
                            onClick={() => setSelectedRecord(null)}
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default MedicalRecords;      