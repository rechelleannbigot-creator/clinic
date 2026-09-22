import { useState } from "react";
import {
    Search,
    CalendarDays,
    Users,
    ClipboardList,
    CheckCircle,
    Clock,
    Eye,
    X,
    UserRound,
    Stethoscope,
    QrCode,
    FileText,
} from "lucide-react";

import "../../styles/VisitHistory.css";

function VisitHistory() {
    // Sample school clinic visit records
    // Replace these records with data from your database/API.
    const [visits] = useState([
        {
            id: "VIS-001",
            patientId: "P-001",
            patientName: "Juan Dela Cruz",
            role: "Student",
            courseYear: "BSIT - 2nd Year",
            date: "2026-09-22",
            time: "08:30 AM",
            consultation: "General Checkup",
            complaint: "Headache and dizziness",
            diagnosis: "For further assessment",
            treatment: "Rest and monitoring",
            medicine: "Paracetamol 500mg",
            staff: "Student",
            status: "Completed",
        },
        {
            id: "VIS-002",
            patientId: "P-002",
            patientName: "Maria Santos",
            role: "Student",
            courseYear: "BSHM - 1st Year",
            date: "2026-09-21",
            time: "10:15 AM",
            consultation: "Follow-up",
            complaint: "Follow-up for cough",
            diagnosis: "Upper respiratory symptoms",
            treatment: "Monitor symptoms and follow clinic advice",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-003",
            patientId: "P-003",
            patientName: "Robert Lee",
            role: "Employee",
            courseYear: "Teaching Personnel",
            date: "2026-09-20",
            time: "01:20 PM",
            consultation: "Medical Consultation",
            complaint: "Stomach discomfort",
            diagnosis: "For further assessment",
            treatment: "Rest and observation",
            medicine: "None",
            staff: "Student",
            status: "Completed",
        },
        {
            id: "VIS-004",
            patientId: "P-004",
            patientName: "Ana Garcia",
            role: "Student",
            courseYear: "BSBA - 3rd Year",
            date: "2026-09-19",
            time: "09:45 AM",
            consultation: "General Checkup",
            complaint: "Minor wound",
            diagnosis: "Minor superficial wound",
            treatment: "Wound cleaning and dressing",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-005",
            patientId: "P-005",
            patientName: "Michael Reyes",
            role: "Student",
            courseYear: "BSED - 4th Year",
            date: "2026-09-18",
            time: "02:10 PM",
            consultation: "Emergency Consultation",
            complaint: "Feeling faint",
            diagnosis: "Requires clinical assessment",
            treatment: "Seated rest and observation",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "In Progress",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedVisit, setSelectedVisit] = useState(null);

    const filteredVisits = visits.filter((visit) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            visit.patientName.toLowerCase().includes(search) ||
            visit.patientId.toLowerCase().includes(search) ||
            visit.id.toLowerCase().includes(search) ||
            visit.consultation.toLowerCase().includes(search) ||
            visit.complaint.toLowerCase().includes(search);

        const matchesType =
            filterType === "All" || visit.role === filterType;

        const matchesStatus =
            filterStatus === "All" || visit.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const totalVisits = visits.length;
    const completedVisits = visits.filter(
        (visit) => visit.status === "Completed"
    ).length;
    const inProgressVisits = visits.filter(
        (visit) => visit.status === "In Progress"
    ).length;

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="visit-history-page">
            {/* Page Header */}
            <div className="visit-history-header">
                <div className="visit-history-title">
                    <div className="visit-history-header-icon">
                        <ClipboardList size={27} />
                    </div>

                    <div>
                        <h1>Visit History</h1>
                        <p>
                            View and manage student and employee visits to
                            the school clinic.
                        </p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="visit-history-stats">
                <div className="visit-stat-card">
                    <div className="visit-stat-icon total-icon">
                        <Users size={23} />
                    </div>

                    <div>
                        <p>Total Visits</p>
                        <h2>{totalVisits}</h2>
                        <span>Recorded clinic visits</span>
                    </div>
                </div>

                <div className="visit-stat-card">
                    <div className="visit-stat-icon completed-icon">
                        <CheckCircle size={23} />
                    </div>

                    <div>
                        <p>Completed Visits</p>
                        <h2>{completedVisits}</h2>
                        <span>Completed consultations</span>
                    </div>
                </div>

                <div className="visit-stat-card">
                    <div className="visit-stat-icon progress-icon">
                        <Clock size={23} />
                    </div>

                    <div>
                        <p>In Progress</p>
                        <h2>{inProgressVisits}</h2>
                        <span>Ongoing clinic visits</span>
                    </div>
                </div>

                <div className="visit-stat-card">
                    <div className="visit-stat-icon records-icon">
                        <CalendarDays size={23} />
                    </div>

                    <div>
                        <p>Displayed Records</p>
                        <h2>{filteredVisits.length}</h2>
                        <span>Matching your filters</span>
                    </div>
                </div>
            </div>

            {/* Visit History Table */}
            <div className="visit-history-card">
                <div className="visit-history-card-header">
                    <div>
                        <h2>Clinic Visit Records</h2>
                        <p>
                            Search patient visits and review consultation
                            information.
                        </p>
                    </div>

                    <div className="visit-record-count">
                        {filteredVisits.length} Records
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="visit-history-toolbar">
                    <div className="visit-history-search">
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search patient, patient ID, visit ID..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />
                    </div>

                    <div className="visit-history-filters">
                        <select
                            value={filterType}
                            onChange={(event) =>
                                setFilterType(event.target.value)
                            }
                            aria-label="Filter by patient type"
                        >
                            <option value="All">All Patient Types</option>
                            <option value="Student">Students</option>
                            <option value="Employee">Employees</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(event) =>
                                setFilterStatus(event.target.value)
                            }
                            aria-label="Filter by visit status"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                        </select>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="visit-history-table-wrapper">
                    <table className="visit-history-table">
                        <thead>
                            <tr>
                                <th>Visit ID</th>
                                <th>Patient</th>
                                <th>Patient Type</th>
                                <th>Date & Time</th>
                                <th>Consultation</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredVisits.length > 0 ? (
                                filteredVisits.map((visit) => (
                                    <tr key={visit.id}>
                                        <td>
                                            <span className="visit-id">
                                                {visit.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="visit-patient-cell">
                                                <div className="visit-patient-avatar">
                                                    <UserRound size={19} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {visit.patientName}
                                                    </strong>
                                                    <span>{visit.patientId}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`patient-type-badge ${
                                                    visit.role === "Student"
                                                        ? "student-badge"
                                                        : "employee-badge"
                                                }`}
                                            >
                                                {visit.role}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="visit-date-cell">
                                                <strong>
                                                    {formatDate(visit.date)}
                                                </strong>
                                                <span>{visit.time}</span>
                                            </div>
                                        </td>

                                        <td>{visit.consultation}</td>

                                        <td>{visit.staff}</td>

                                        <td>
                                            <span
                                                className={`visit-status-badge ${
                                                    visit.status === "Completed"
                                                        ? "status-completed"
                                                        : "status-progress"
                                                }`}
                                            >
                                                <span className="status-dot" />
                                                {visit.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="visit-view-btn"
                                                onClick={() =>
                                                    setSelectedVisit(visit)
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
                                    <td
                                        colSpan="8"
                                        className="visit-empty-state"
                                    >
                                        <div>
                                            <ClipboardList size={35} />
                                            <h3>No visit records found</h3>
                                            <p>
                                                Try changing your search or
                                                filter options.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="visit-history-footer">
                    Showing <strong>{filteredVisits.length}</strong> of{" "}
                    <strong>{visits.length}</strong> visit records
                </div>
            </div>

            {/* View Visit Modal */}
            {selectedVisit && (
                <div
                    className="visit-modal-overlay"
                    onClick={() => setSelectedVisit(null)}
                >
                    <div
                        className="visit-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="visit-modal-header">
                            <div className="visit-modal-heading">
                                <div className="visit-modal-icon">
                                    <FileText size={23} />
                                </div>

                                <div>
                                    <h2>Visit Details</h2>
                                    <p>
                                        Visit ID: {selectedVisit.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="visit-modal-close"
                                onClick={() => setSelectedVisit(null)}
                                aria-label="Close visit details"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="visit-modal-body">
                            <div className="visit-modal-patient">
                                <div className="visit-modal-patient-avatar">
                                    <UserRound size={26} />
                                </div>

                                <div>
                                    <h3>{selectedVisit.patientName}</h3>
                                    <p>
                                        {selectedVisit.patientId} ·{" "}
                                        {selectedVisit.role}
                                    </p>
                                    <span>{selectedVisit.courseYear}</span>
                                </div>
                            </div>

                            <div className="visit-modal-section">
                                <h4>
                                    <CalendarDays size={18} />
                                    Visit Information
                                </h4>

                                <div className="visit-detail-grid">
                                    <div>
                                        <span>Date</span>
                                        <strong>
                                            {formatDate(selectedVisit.date)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Time</span>
                                        <strong>{selectedVisit.time}</strong>
                                    </div>

                                    <div>
                                        <span>Consultation Type</span>
                                        <strong>
                                            {selectedVisit.consultation}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Clinic Staff</span>
                                        <strong>{selectedVisit.staff}</strong>
                                    </div>

                                    <div>
                                        <span>Visit Status</span>
                                        <strong>
                                            {selectedVisit.status}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="visit-modal-section">
                                <h4>
                                    <Stethoscope size={18} />
                                    Medical Information
                                </h4>

                                <div className="visit-medical-detail">
                                    <span>Chief Complaint / Symptoms</span>
                                    <p>{selectedVisit.complaint || "—"}</p>
                                </div>

                                <div className="visit-medical-detail">
                                    <span>Diagnosis / Assessment</span>
                                    <p>{selectedVisit.diagnosis || "—"}</p>
                                </div>

                                <div className="visit-medical-detail">
                                    <span>Treatment / Management</span>
                                    <p>{selectedVisit.treatment || "—"}</p>
                                </div>

                                <div className="visit-medical-detail">
                                    <span>Medicine</span>
                                    <p>{selectedVisit.medicine || "None"}</p>
                                </div>
                            </div>

                            <div className="visit-qr-note">
                                <QrCode size={19} />
                                <p>
                                    Patient identification can be linked to
                                    the patient's QR code when QR scanning is
                                    connected to your patient records.
                                </p>
                            </div>
                        </div>

                        <div className="visit-modal-footer">
                            <button
                                type="button"
                                onClick={() => setSelectedVisit(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VisitHistory;