import { useState } from "react";
import {
    Search,
    Stethoscope,
    User,
    Calendar,
    Clock,
    Eye,
    Plus,
    X,
    CheckCircle,
} from "lucide-react";

import "../../styles/Consultation.css";

function Consultation() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [consultations, setConsultations] = useState([
        {
            id: "CON-001",
            patientId: "P-001",
            patient: "Juan Dela Cruz",
            doctor: "Dr. Maria Santos",
            date: "2026-09-04",
            time: "09:00 AM",
            complaint: "Headache and fever",
            diagnosis: "Viral Infection",
            status: "Completed",
        },
        {
            id: "CON-002",
            patientId: "P-002",
            patient: "Maria Garcia",
            doctor: "Dr. John Reyes",
            date: "2026-09-04",
            time: "10:30 AM",
            complaint: "Cough and sore throat",
            diagnosis: "Upper Respiratory Infection",
            status: "Completed",
        },
        {
            id: "CON-003",
            patientId: "P-003",
            patient: "Pedro Santos",
            doctor: "Dr. Maria Santos",
            date: "2026-09-04",
            time: "01:00 PM",
            complaint: "Stomach pain",
            diagnosis: "Gastritis",
            status: "Pending",
        },
        {
            id: "CON-004",
            patientId: "P-004",
            patient: "Ana Reyes",
            doctor: "Dr. John Reyes",
            date: "2026-09-03",
            time: "02:30 PM",
            complaint: "Skin allergy",
            diagnosis: "Allergic Dermatitis",
            status: "Completed",
        },
        {
            id: "CON-005",
            patientId: "P-005",
            patient: "Jose Mendoza",
            doctor: "Dr. Maria Santos",
            date: "2026-09-03",
            time: "04:00 PM",
            complaint: "Back pain",
            diagnosis: "Muscle Strain",
            status: "Pending",
        },
    ]);

    const filteredConsultations = consultations.filter((item) =>
        item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalConsultations = consultations.length;

    const completedCount = consultations.filter(
        (item) => item.status === "Completed"
    ).length;

    const pendingCount = consultations.filter(
        (item) => item.status === "Pending"
    ).length;

    const todayCount = consultations.filter(
        (item) => item.date === "2026-09-04"
    ).length;

    const handleView = (item) => {
        alert(
            `Consultation Details\n\n` +
            `Consultation ID: ${item.id}\n` +
            `Patient: ${item.patient}\n` +
            `Patient ID: ${item.patientId}\n` +
            `Doctor: ${item.doctor}\n` +
            `Date: ${item.date}\n` +
            `Time: ${item.time}\n` +
            `Chief Complaint: ${item.complaint}\n` +
            `Diagnosis: ${item.diagnosis}\n` +
            `Status: ${item.status}`
        );
    };

    const handleAddConsultation = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const newConsultation = {
            id: `CON-${String(consultations.length + 1).padStart(3, "0")}`,
            patientId: formData.get("patientId"),
            patient: formData.get("patient"),
            doctor: formData.get("doctor"),
            date: formData.get("date"),
            time: formData.get("time"),
            complaint: formData.get("complaint"),
            diagnosis: formData.get("diagnosis"),
            status: "Pending",
        };

        setConsultations([newConsultation, ...consultations]);
        setShowModal(false);
        e.target.reset();
    };

    return (
        <div className="consultation-page">

            {/* Header */}
            <div className="consultation-header">
                <div>
                    <h1>Consultation</h1>
                    <p>
                        Manage patient consultations and consultation
                        records.
                    </p>
                </div>

                <button
                    className="add-consultation-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    New Consultation
                </button>
            </div>

            {/* Summary Cards */}
            <div className="consultation-summary">

                <div className="consultation-summary-card">
                    <div className="consultation-summary-icon blue">
                        <Stethoscope size={24} />
                    </div>

                    <div>
                        <span>Total Consultations</span>
                        <h2>{totalConsultations}</h2>
                    </div>
                </div>

                <div className="consultation-summary-card">
                    <div className="consultation-summary-icon green">
                        <CheckCircle size={24} />
                    </div>

                    <div>
                        <span>Completed</span>
                        <h2>{completedCount}</h2>
                    </div>
                </div>

                <div className="consultation-summary-card">
                    <div className="consultation-summary-icon orange">
                        <Clock size={24} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <h2>{pendingCount}</h2>
                    </div>
                </div>

                <div className="consultation-summary-card">
                    <div className="consultation-summary-icon purple">
                        <Calendar size={24} />
                    </div>

                    <div>
                        <span>Today's Consultations</span>
                        <h2>{todayCount}</h2>
                    </div>
                </div>

            </div>

            {/* Consultation Table */}
            <div className="consultation-card">

                <div className="consultation-toolbar">
                    <div className="consultation-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search patient, doctor, diagnosis..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="consultation-table-container">
                    <table className="consultation-table">

                        <thead>
                            <tr>
                                <th>Consultation ID</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date & Time</th>
                                <th>Chief Complaint</th>
                                <th>Diagnosis</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredConsultations.length > 0 ? (
                                filteredConsultations.map((item) => (
                                    <tr key={item.id}>

                                        <td>
                                            <span className="consultation-id">
                                                {item.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-info">
                                                <div className="patient-icon">
                                                    <User size={17} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {item.patient}
                                                    </strong>

                                                    <small>
                                                        {item.patientId}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="doctor-info">
                                                <Stethoscope size={16} />
                                                {item.doctor}
                                            </div>
                                        </td>

                                        <td>
                                            <div className="datetime-info">
                                                <div>
                                                    <Calendar size={14} />
                                                    {item.date}
                                                </div>

                                                <small>
                                                    <Clock size={13} />
                                                    {item.time}
                                                </small>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="complaint">
                                                {item.complaint}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="diagnosis">
                                                {item.diagnosis}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`consultation-status ${
                                                    item.status === "Completed"
                                                        ? "completed"
                                                        : "pending"
                                                }`}
                                            >
                                                {item.status === "Completed" ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <Clock size={14} />
                                                )}

                                                {item.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="consultation-view-btn"
                                                onClick={() =>
                                                    handleView(item)
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
                                        colSpan="8"
                                        className="consultation-empty"
                                    >
                                        <Stethoscope size={42} />

                                        <h3>
                                            No consultations found
                                        </h3>

                                        <p>
                                            Try searching for another patient,
                                            doctor, or diagnosis.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </div>

            {/* New Consultation Modal */}
            {showModal && (
                <div
                    className="consultation-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="consultation-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="consultation-modal-header">

                            <div>
                                <h2>New Consultation</h2>
                                <p>
                                    Enter the patient's consultation
                                    information.
                                </p>
                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form onSubmit={handleAddConsultation}>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Patient ID</label>

                                    <input
                                        type="text"
                                        name="patientId"
                                        placeholder="e.g. P-006"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Patient Name</label>

                                    <input
                                        type="text"
                                        name="patient"
                                        placeholder="Enter patient name"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <label>Doctor</label>

                                <select name="doctor" required>
                                    <option value="">
                                        Select doctor
                                    </option>

                                    <option>
                                        Dr. Maria Santos
                                    </option>

                                    <option>
                                        Dr. John Reyes
                                    </option>

                                    <option>
                                        Dr. Ana Garcia
                                    </option>
                                </select>
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Date</label>

                                    <input
                                        type="date"
                                        name="date"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Time</label>

                                    <input
                                        type="time"
                                        name="time"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <label>Chief Complaint</label>

                                <textarea
                                    name="complaint"
                                    placeholder="Enter patient's chief complaint..."
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Diagnosis</label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    placeholder="Enter diagnosis"
                                    required
                                />
                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-consultation-btn"
                                >
                                    <CheckCircle size={17} />
                                    Save Consultation
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Consultation;