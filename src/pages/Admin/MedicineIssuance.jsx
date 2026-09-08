import { useState } from "react";
import {
    Search,
    Plus,
    Eye,
    Pill,
    User,
    Calendar,
    X,
    FileText,
    ClipboardList,
} from "lucide-react";

import "../../styles/MedicineIssuance.css";

function MedicineIssuance() {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedIssuance, setSelectedIssuance] = useState(null);

    const [issuances, setIssuances] = useState([
        {
            id: "ISS-001",
            patient: "Juan Dela Cruz",
            patientId: "P-001",
            diagnosis: "Fever",
            medicine: "Paracetamol",
            quantity: 10,
            unit: "Tablets",
            date: "2026-09-01",
            issuedBy: "Maria Santos",
            status: "Issued",
            remarks: "Take 1 tablet every 6 hours as needed.",
        },
        {
            id: "ISS-002",
            patient: "Ana Reyes",
            patientId: "P-002",
            diagnosis: "Bacterial Infection",
            medicine: "Amoxicillin",
            quantity: 15,
            unit: "Capsules",
            date: "2026-08-31",
            issuedBy: "John Garcia",
            status: "Issued",
            remarks: "Take after meals.",
        },
        {
            id: "ISS-003",
            patient: "Pedro Ramos",
            patientId: "P-003",
            diagnosis: "Body Pain",
            medicine: "Ibuprofen",
            quantity: 5,
            unit: "Tablets",
            date: "2026-08-30",
            issuedBy: "Maria Santos",
            status: "Issued",
            remarks: "Take as prescribed.",
        },
        {
            id: "ISS-004",
            patient: "Sofia Mendoza",
            patientId: "P-004",
            diagnosis: "Allergic Rhinitis",
            medicine: "Cetirizine",
            quantity: 10,
            unit: "Tablets",
            date: "2026-08-29",
            issuedBy: "John Garcia",
            status: "Pending",
            remarks: "For approval.",
        },
    ]);

    const [formData, setFormData] = useState({
        patient: "",
        patientId: "",
        diagnosis: "",
        medicine: "",
        quantity: "",
        unit: "",
        date: "2026-09-08",
        remarks: "",
    });

    /* =========================
       FILTER ISSUANCES
    ========================= */

    const filteredIssuances = issuances.filter((issuance) =>
        `
        ${issuance.id}
        ${issuance.patient}
        ${issuance.patientId}
        ${issuance.diagnosis}
        ${issuance.medicine}
        ${issuance.status}
        `
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    /* =========================
       STATISTICS
    ========================= */

    const totalIssued = issuances.filter(
        (issuance) => issuance.status === "Issued"
    ).length;

    const totalPending = issuances.filter(
        (issuance) => issuance.status === "Pending"
    ).length;

    const patientsServed = new Set(
        issuances.map((issuance) => issuance.patientId)
    ).size;

    /* =========================
       HANDLE FORM INPUT
    ========================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================
       PATIENT SELECTION
    ========================= */

    const handlePatientChange = (e) => {
        const value = e.target.value;

        const patients = {
            "Juan Dela Cruz": "P-001",
            "Ana Reyes": "P-002",
            "Pedro Ramos": "P-003",
            "Sofia Mendoza": "P-004",
        };

        setFormData((prev) => ({
            ...prev,
            patient: value,
            patientId: patients[value] || "",
        }));
    };

    /* =========================
       MEDICINE SELECTION
    ========================= */

    const handleMedicineChange = (e) => {
        const value = e.target.value;

        const medicineUnits = {
            Paracetamol: "Tablets",
            Amoxicillin: "Capsules",
            Ibuprofen: "Tablets",
            Cetirizine: "Tablets",
        };

        setFormData((prev) => ({
            ...prev,
            medicine: value,
            unit: medicineUnits[value] || "",
        }));
    };

    /* =========================
       SUBMIT ISSUANCE
    ========================= */

    const handleSubmit = (e) => {
        e.preventDefault();

        const nextNumber = issuances.length + 1;

        const newIssuance = {
            id: `ISS-${String(nextNumber).padStart(3, "0")}`,
            patient: formData.patient,
            patientId: formData.patientId,
            diagnosis: formData.diagnosis,
            medicine: formData.medicine,
            quantity: Number(formData.quantity),
            unit: formData.unit,
            date: formData.date,
            issuedBy: "Current Staff",
            status: "Issued",
            remarks: formData.remarks,
        };

        setIssuances((prev) => [newIssuance, ...prev]);

        setFormData({
            patient: "",
            patientId: "",
            diagnosis: "",
            medicine: "",
            quantity: "",
            unit: "",
            date: "2026-09-08",
            remarks: "",
        });

        setShowModal(false);
    };

    /* =========================
       VIEW DETAILS
    ========================= */

    const handleView = (issuance) => {
        setSelectedIssuance(issuance);
    };

    return (
        <div className="issuance-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="issuance-header">
                <div>
                    <div className="page-title-icon">
                        <Pill size={25} />
                    </div>

                    <div>
                        <h1>Medicine Issuance</h1>
                        <p>
                            Issue medicines to patients and monitor
                            medicine issuance records.
                        </p>
                    </div>
                </div>

                <button
                    className="issue-medicine-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Issue Medicine
                </button>
            </div>

            {/* =========================
                STATISTICS
            ========================= */}

            <div className="issuance-stats">

                <div className="issuance-stat-card">
                    <div className="issuance-stat-icon blue">
                        <Pill size={23} />
                    </div>

                    <div>
                        <span>Total Issuances</span>
                        <strong>{issuances.length}</strong>
                    </div>
                </div>

                <div className="issuance-stat-card">
                    <div className="issuance-stat-icon green">
                        <ClipboardList size={23} />
                    </div>

                    <div>
                        <span>Issued</span>
                        <strong>{totalIssued}</strong>
                    </div>
                </div>

                <div className="issuance-stat-card">
                    <div className="issuance-stat-icon orange">
                        <Calendar size={23} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>{totalPending}</strong>
                    </div>
                </div>

                <div className="issuance-stat-card">
                    <div className="issuance-stat-icon purple">
                        <User size={23} />
                    </div>

                    <div>
                        <span>Patients Served</span>
                        <strong>{patientsServed}</strong>
                    </div>
                </div>

            </div>

            {/* =========================
                ISSUANCE CARD
            ========================= */}

            <div className="issuance-card">

                <div className="issuance-card-header">

                    <div>
                        <h2>Issuance History</h2>

                        <p>
                            View all medicines issued to clinic patients.
                        </p>
                    </div>

                    <div className="issuance-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search patient, diagnosis or medicine..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                {/* =========================
                    TABLE
                ========================= */}

                <div className="issuance-table-container">

                    <table className="issuance-table">

                        <thead>
                            <tr>
                                <th>Issuance ID</th>
                                <th>Patient</th>
                                <th>Diagnosis</th>
                                <th>Medicine</th>
                                <th>Quantity</th>
                                <th>Date Issued</th>
                                <th>Issued By</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredIssuances.length > 0 ? (

                                filteredIssuances.map((issuance) => (

                                    <tr key={issuance.id}>

                                        {/* ID */}
                                        <td>
                                            <span className="issuance-id">
                                                {issuance.id}
                                            </span>
                                        </td>

                                        {/* PATIENT */}
                                        <td>
                                            <div className="patient-info">

                                                <div className="patient-avatar">
                                                    {issuance.patient
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {issuance.patient}
                                                    </strong>

                                                    <small>
                                                        {issuance.patientId}
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        {/* DIAGNOSIS */}
                                        <td>
                                            <span className="diagnosis-text">
                                                {issuance.diagnosis}
                                            </span>
                                        </td>

                                        {/* MEDICINE */}
                                        <td>
                                            <div className="medicine-name">
                                                <Pill size={16} />
                                                <strong>
                                                    {issuance.medicine}
                                                </strong>
                                            </div>
                                        </td>

                                        {/* QUANTITY */}
                                        <td>
                                            <strong>
                                                {issuance.quantity}
                                            </strong>{" "}
                                            {issuance.unit}
                                        </td>

                                        {/* DATE */}
                                        <td>
                                            {issuance.date}
                                        </td>

                                        {/* ISSUED BY */}
                                        <td>
                                            {issuance.issuedBy}
                                        </td>

                                        {/* STATUS */}
                                        <td>
                                            <span
                                                className={`issuance-status ${issuance.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {issuance.status}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td>

                                            <button
                                                className="view-issuance-btn"
                                                title="View details"
                                                onClick={() =>
                                                    handleView(issuance)
                                                }
                                            >
                                                <Eye size={16} />
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="issuance-empty"
                                    >
                                        <FileText size={40} />

                                        <strong>
                                            No issuance records found
                                        </strong>

                                        <span>
                                            Try changing your search.
                                        </span>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =========================
                ISSUE MEDICINE MODAL
            ========================= */}

            {showModal && (

                <div
                    className="issuance-modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="issuance-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="issuance-modal-header">

                            <div>
                                <div className="modal-icon">
                                    <Pill size={21} />
                                </div>

                                <div>
                                    <h2>Issue Medicine</h2>

                                    <p>
                                        Record medicine issued to a patient.
                                    </p>
                                </div>
                            </div>

                            <button
                                className="issuance-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form onSubmit={handleSubmit}>

                            <div className="issuance-form-grid">

                                {/* PATIENT */}

                                <div className="issuance-form-group">

                                    <label>
                                        Patient
                                    </label>

                                    <select
                                        name="patient"
                                        value={formData.patient}
                                        onChange={handlePatientChange}
                                        required
                                    >
                                        <option value="">
                                            Select patient
                                        </option>

                                        <option>
                                            Juan Dela Cruz
                                        </option>

                                        <option>
                                            Ana Reyes
                                        </option>

                                        <option>
                                            Pedro Ramos
                                        </option>

                                        <option>
                                            Sofia Mendoza
                                        </option>

                                    </select>

                                </div>

                                {/* PATIENT ID */}

                                <div className="issuance-form-group">

                                    <label>
                                        Patient ID
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.patientId}
                                        placeholder="Patient ID"
                                        readOnly
                                    />

                                </div>

                                {/* DIAGNOSIS */}

                                <div className="issuance-form-group full">

                                    <label>
                                        Diagnosis
                                    </label>

                                    <input
                                        type="text"
                                        name="diagnosis"
                                        value={formData.diagnosis}
                                        onChange={handleChange}
                                        placeholder="Enter patient's diagnosis"
                                        required
                                    />

                                </div>

                                {/* MEDICINE */}

                                <div className="issuance-form-group">

                                    <label>
                                        Medicine
                                    </label>

                                    <select
                                        name="medicine"
                                        value={formData.medicine}
                                        onChange={handleMedicineChange}
                                        required
                                    >

                                        <option value="">
                                            Select medicine
                                        </option>

                                        <option>
                                            Paracetamol
                                        </option>

                                        <option>
                                            Amoxicillin
                                        </option>

                                        <option>
                                            Ibuprofen
                                        </option>

                                        <option>
                                            Cetirizine
                                        </option>

                                    </select>

                                </div>

                                {/* UNIT */}

                                <div className="issuance-form-group">

                                    <label>
                                        Unit
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.unit}
                                        placeholder="Unit"
                                        readOnly
                                    />

                                </div>

                                {/* QUANTITY */}

                                <div className="issuance-form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="Enter quantity"
                                        required
                                    />

                                </div>

                                {/* DATE */}

                                <div className="issuance-form-group">

                                    <label>
                                        Date Issued
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                {/* REMARKS */}

                                <div className="issuance-form-group full">

                                    <label>
                                        Remarks
                                    </label>

                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Enter additional notes..."
                                    />

                                </div>

                            </div>

                            {/* MODAL BUTTONS */}

                            <div className="issuance-modal-actions">

                                <button
                                    type="button"
                                    className="issuance-cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="issuance-save-btn"
                                >
                                    <Pill size={17} />
                                    Issue Medicine
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =========================
                VIEW DETAILS MODAL
            ========================= */}

            {selectedIssuance && (

                <div
                    className="issuance-modal-overlay"
                    onClick={() => setSelectedIssuance(null)}
                >

                    <div
                        className="issuance-details-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="issuance-modal-header">

                            <div>
                                <div className="modal-icon">
                                    <FileText size={21} />
                                </div>

                                <div>
                                    <h2>Issuance Details</h2>

                                    <p>
                                        {selectedIssuance.id}
                                    </p>
                                </div>
                            </div>

                            <button
                                className="issuance-close-btn"
                                onClick={() =>
                                    setSelectedIssuance(null)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="issuance-details">

                            <div className="detail-item">
                                <span>Patient</span>
                                <strong>
                                    {selectedIssuance.patient}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Patient ID</span>
                                <strong>
                                    {selectedIssuance.patientId}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Diagnosis</span>
                                <strong>
                                    {selectedIssuance.diagnosis}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Medicine</span>
                                <strong>
                                    {selectedIssuance.medicine}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Quantity</span>
                                <strong>
                                    {selectedIssuance.quantity}{" "}
                                    {selectedIssuance.unit}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Date Issued</span>
                                <strong>
                                    {selectedIssuance.date}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Issued By</span>
                                <strong>
                                    {selectedIssuance.issuedBy}
                                </strong>
                            </div>

                            <div className="detail-item">
                                <span>Status</span>

                                <span
                                    className={`issuance-status ${selectedIssuance.status
                                        .toLowerCase()
                                        .replace(" ", "-")}`}
                                >
                                    {selectedIssuance.status}
                                </span>
                            </div>

                            <div className="detail-item full-detail">
                                <span>Remarks</span>

                                <p>
                                    {selectedIssuance.remarks ||
                                        "No remarks provided."}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MedicineIssuance;