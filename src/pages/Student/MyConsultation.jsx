import { useState } from "react";
import {
    Search,
    Eye,
    Calendar,
    Stethoscope,
    Clock,
    CheckCircle,
    X,
} from "lucide-react";

import "../../styles/MyConsultation.css";

function MyConsultation() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    const consultations = [
        {
            id: "CON-001",
            date: "September 5, 2026",
            type: "Follow-up",
            complaint: "Headache and fatigue",
            clinicStaff: "Clinic Staff",
            diagnosis: "Tension Headache",
            treatment: "Rest and adequate hydration",
            status: "Completed",
        },
        {
            id: "CON-002",
            date: "August 18, 2026",
            type: "Follow-up",
            complaint: "Cough and sore throat",
            clinicStaff: "Clinic Staff",
            diagnosis: "Upper Respiratory Infection",
            treatment: "Rest and increased fluid intake",
            status: "Completed",
        },
        {
            id: "CON-003",
            date: "September 15, 2026",
            type: "Follow-up",
            complaint: "Scheduled follow-up check",
            clinicStaff: "Clinic Staff",
            diagnosis: "Pending",
            treatment: "Pending consultation",
            status: "Scheduled",
        },
    ];

    const filteredConsultations = consultations.filter((consultation) =>
        `${consultation.id} ${consultation.type} ${consultation.complaint} ${consultation.status}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="my-consultation-page">

            {/* HEADER */}
            <div className="consultation-header">
                <div>
                    <h1>My Consultation</h1>
                    <p>View your consultation history and upcoming follow-up checks.</p>
                </div>

                <div className="consultation-header-icon">
                    <Stethoscope size={21} />
                    <span>My Health</span>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="consultation-summary">

                <div className="consultation-summary-card">
                    <div className="summary-icon blue">
                        <Calendar size={21} />
                    </div>

                    <div>
                        <span>Total Consultations</span>
                        <strong>{consultations.length}</strong>
                    </div>
                </div>

                <div className="consultation-summary-card">
                    <div className="summary-icon green">
                        <CheckCircle size={21} />
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>
                            {
                                consultations.filter(
                                    (item) => item.status === "Completed"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="consultation-summary-card">
                    <div className="summary-icon orange">
                        <Clock size={21} />
                    </div>

                    <div>
                        <span>Upcoming</span>
                        <strong>
                            {
                                consultations.filter(
                                    (item) => item.status === "Scheduled"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="consultation-toolbar">
                <div className="consultation-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search consultations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* TABLE */}
            <div className="consultation-card">

                <div className="consultation-card-header">
                    <div>
                        <h2>Consultation History</h2>
                        <p>
                            View your previous and scheduled consultations.
                        </p>
                    </div>
                </div>

                <div className="consultation-table-wrapper">
                    <table className="consultation-table">

                        <thead>
                            <tr>
                                <th>Consultation ID</th>
                                <th>Date</th>
                                <th>Consultation</th>
                                <th>Complaint</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredConsultations.length > 0 ? (
                                filteredConsultations.map((consultation) => (
                                    <tr key={consultation.id}>

                                        <td>
                                            <strong>{consultation.id}</strong>
                                        </td>

                                        <td>{consultation.date}</td>

                                        <td>{consultation.type}</td>

                                        <td>{consultation.complaint}</td>

                                        <td>
                                            <span
                                                className={
                                                    consultation.status ===
                                                    "Completed"
                                                        ? "consultation-status completed"
                                                        : "consultation-status scheduled"
                                                }
                                            >
                                                {consultation.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-consultation-btn"
                                                onClick={() =>
                                                    setSelectedConsultation(
                                                        consultation
                                                    )
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
                                        colSpan="6"
                                        className="no-consultations"
                                    >
                                        No consultations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedConsultation && (
                <div className="consultation-modal-overlay">

                    <div className="consultation-modal">

                        <div className="modal-header">
                            <div>
                                <h2>Consultation Details</h2>
                                <p>{selectedConsultation.id}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedConsultation(null)
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="consultation-details">

                            <div className="detail-box">
                                <span>Date</span>
                                <strong>
                                    {selectedConsultation.date}
                                </strong>
                            </div>

                            <div className="detail-box">
                                <span>Consultation</span>
                                <strong>
                                    {selectedConsultation.type}
                                </strong>
                            </div>

                            <div className="detail-box full">
                                <span>Complaint</span>
                                <strong>
                                    {selectedConsultation.complaint}
                                </strong>
                            </div>

                            <div className="detail-box full">
                                <span>Clinic Staff</span>
                                <strong>
                                    {selectedConsultation.clinicStaff}
                                </strong>
                            </div>

                            <div className="detail-box full">
                                <span>Diagnosis</span>
                                <strong>
                                    {selectedConsultation.diagnosis}
                                </strong>
                            </div>

                            <div className="detail-box full">
                                <span>Treatment / Remarks</span>
                                <strong>
                                    {selectedConsultation.treatment}
                                </strong>
                            </div>

                            <div className="detail-box">
                                <span>Status</span>

                                <span
                                    className={
                                        selectedConsultation.status ===
                                        "Completed"
                                            ? "consultation-status completed"
                                            : "consultation-status scheduled"
                                    }
                                >
                                    {selectedConsultation.status}
                                </span>
                            </div>

                        </div>

                        <button
                            className="modal-close-btn"
                            onClick={() =>
                                setSelectedConsultation(null)
                            }
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default MyConsultation;

