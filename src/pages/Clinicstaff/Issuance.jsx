import { useState } from "react";
import {
    Search,
    Pill,
    User,
    Calendar,
    Package,
    CheckCircle,
    Clock,
    Eye,
    Plus,
    X,
    ClipboardList,
} from "lucide-react";

import "../../styles/Issuance.css";

function Issuance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [issuances, setIssuances] = useState([
        {
            id: "ISS-001",
            patientId: "P-001",
            patient: "Juan Dela Cruz",
            diagnosis: "Fever",
            medicine: "Paracetamol 500mg",
            quantity: 10,
            issuedBy: "Staff Nurse",
            date: "2026-09-04",
            status: "Issued",
        },
        {
            id: "ISS-002",
            patientId: "P-002",
            patient: "Maria Santos",
            diagnosis: "Bacterial Infection",
            medicine: "Amoxicillin 500mg",
            quantity: 14,
            issuedBy: "Staff Nurse",
            date: "2026-09-04",
            status: "Issued",
        },
        {
            id: "ISS-003",
            patientId: "P-003",
            patient: "Pedro Reyes",
            diagnosis: "Body Pain",
            medicine: "Ibuprofen 400mg",
            quantity: 8,
            issuedBy: "Staff Nurse",
            date: "2026-09-03",
            status: "Issued",
        },
        {
            id: "ISS-004",
            patientId: "P-004",
            patient: "Ana Garcia",
            diagnosis: "Allergic Rhinitis",
            medicine: "Cetirizine 10mg",
            quantity: 10,
            issuedBy: "Staff Nurse",
            date: "2026-09-03",
            status: "Pending",
        },
        {
            id: "ISS-005",
            patientId: "P-005",
            patient: "Jose Mendoza",
            diagnosis: "Vitamin C Deficiency",
            medicine: "Vitamin C 500mg",
            quantity: 20,
            issuedBy: "Staff Nurse",
            date: "2026-09-02",
            status: "Issued",
        },
    ]);

    /* =========================
       SEARCH
    ========================= */

    const filteredIssuances = issuances.filter((item) =>
        item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* =========================
       SUMMARY
    ========================= */

    const totalIssuances = issuances.length;

    const issuedCount = issuances.filter(
        (item) => item.status === "Issued"
    ).length;

    const pendingCount = issuances.filter(
        (item) => item.status === "Pending"
    ).length;

    const totalMedicines = issuances.reduce(
        (total, item) => total + item.quantity,
        0
    );

    /* =========================
       VIEW ISSUANCE
    ========================= */

    const handleView = (item) => {
        alert(
            `Issuance Details\n\n` +
            `Issuance ID: ${item.id}\n` +
            `Patient: ${item.patient}\n` +
            `Patient ID: ${item.patientId}\n` +
            `Diagnosis: ${item.diagnosis}\n` +
            `Medicine: ${item.medicine}\n` +
            `Quantity: ${item.quantity}\n` +
            `Date: ${item.date}\n` +
            `Issued By: ${item.issuedBy}\n` +
            `Status: ${item.status}`
        );
    };

    /* =========================
       ADD ISSUANCE
    ========================= */

    const handleAddIssuance = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const newIssuance = {
            id: `ISS-${String(issuances.length + 1).padStart(3, "0")}`,

            patientId: formData.get("patientId"),

            patient: formData.get("patient"),

            diagnosis: formData.get("diagnosis"),

            medicine: formData.get("medicine"),

            quantity: Number(formData.get("quantity")),

            issuedBy: "Staff Nurse",

            date: new Date().toISOString().split("T")[0],

            status: "Issued",
        };

        setIssuances((prev) => [newIssuance, ...prev]);

        setShowModal(false);

        e.target.reset();
    };

    return (
        <div className="issuance-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="issuance-header">

                <div>
                    <h1>Medicine Issuance</h1>

                    <p>
                        Manage and track medicines issued to patients.
                    </p>
                </div>

                <button
                    className="add-issuance-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Issue Medicine
                </button>

            </div>

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="issuance-summary">

                {/* Total Issuances */}

                <div className="issuance-summary-card">

                    <div className="issuance-summary-icon blue">
                        <Package size={24} />
                    </div>

                    <div>
                        <span>Total Issuances</span>
                        <h2>{totalIssuances}</h2>
                    </div>

                </div>

                {/* Issued */}

                <div className="issuance-summary-card">

                    <div className="issuance-summary-icon green">
                        <CheckCircle size={24} />
                    </div>

                    <div>
                        <span>Issued</span>
                        <h2>{issuedCount}</h2>
                    </div>

                </div>

                {/* Pending */}

                <div className="issuance-summary-card">

                    <div className="issuance-summary-icon orange">
                        <Clock size={24} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <h2>{pendingCount}</h2>
                    </div>

                </div>

                {/* Medicines */}

                <div className="issuance-summary-card">

                    <div className="issuance-summary-icon purple">
                        <Pill size={24} />
                    </div>

                    <div>
                        <span>Medicines Issued</span>
                        <h2>{totalMedicines}</h2>
                    </div>

                </div>

            </div>

            {/* =========================
                MAIN CARD
            ========================= */}

            <div className="issuance-card">

                <div className="issuance-toolbar">

                    <div className="issuance-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search patient, diagnosis, medicine, or issuance ID..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
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

                                <th>Date</th>

                                <th>Issued By</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredIssuances.length > 0 ? (

                                filteredIssuances.map((item) => (

                                    <tr key={item.id}>

                                        {/* Issuance ID */}

                                        <td>

                                            <span className="issuance-id">
                                                {item.id}
                                            </span>

                                        </td>

                                        {/* Patient */}

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

                                        {/* Diagnosis */}

                                        <td>

                                            <div className="diagnosis-info">

                                                <div className="diagnosis-icon">
                                                    <ClipboardList size={16} />
                                                </div>

                                                <span>
                                                    {item.diagnosis}
                                                </span>

                                            </div>

                                        </td>

                                        {/* Medicine */}

                                        <td>

                                            <div className="medicine-info">

                                                <div className="medicine-icon">
                                                    <Pill size={17} />
                                                </div>

                                                <span>
                                                    {item.medicine}
                                                </span>

                                            </div>

                                        </td>

                                        {/* Quantity */}

                                        <td>

                                            <span className="quantity">
                                                {item.quantity}
                                            </span>

                                        </td>

                                        {/* Date */}

                                        <td>

                                            <div className="date-info">

                                                <Calendar size={15} />

                                                {item.date}

                                            </div>

                                        </td>

                                        {/* Issued By */}

                                        <td>
                                            {item.issuedBy}
                                        </td>

                                        {/* Status */}

                                        <td>

                                            <span
                                                className={`issuance-status ${
                                                    item.status === "Issued"
                                                        ? "issued"
                                                        : "pending"
                                                }`}
                                            >

                                                {item.status === "Issued" ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <Clock size={14} />
                                                )}

                                                {item.status}

                                            </span>

                                        </td>

                                        {/* Action */}

                                        <td>

                                            <button
                                                className="issuance-view-btn"
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
                                        colSpan="9"
                                        className="issuance-empty"
                                    >

                                        <Package size={40} />

                                        <h3>
                                            No issuance records found
                                        </h3>

                                        <p>
                                            Try searching for another
                                            patient, diagnosis, or medicine.
                                        </p>

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

                        {/* Modal Header */}

                        <div className="issuance-modal-header">

                            <div>

                                <h2>
                                    Issue Medicine
                                </h2>

                                <p>
                                    Enter the medicine issuance information.
                                </p>

                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={() => setShowModal(false)}
                            >

                                <X size={20} />

                            </button>

                        </div>

                        {/* Form */}

                        <form onSubmit={handleAddIssuance}>

                            {/* Patient ID */}

                            <div className="form-group">

                                <label>
                                    Patient ID
                                </label>

                                <input
                                    type="text"
                                    name="patientId"
                                    placeholder="e.g. P-006"
                                    required
                                />

                            </div>

                            {/* Patient Name */}

                            <div className="form-group">

                                <label>
                                    Patient Name
                                </label>

                                <input
                                    type="text"
                                    name="patient"
                                    placeholder="Enter patient name"
                                    required
                                />

                            </div>

                            {/* Diagnosis */}

                            <div className="form-group">

                                <label>
                                    Diagnosis
                                </label>

                                <input
                                    type="text"
                                    name="diagnosis"
                                    placeholder="Enter patient's diagnosis"
                                    required
                                />

                            </div>

                            {/* Medicine */}

                            <div className="form-group">

                                <label>
                                    Medicine
                                </label>

                                <select
                                    name="medicine"
                                    required
                                >

                                    <option value="">
                                        Select medicine
                                    </option>

                                    <option>
                                        Paracetamol 500mg
                                    </option>

                                    <option>
                                        Amoxicillin 500mg
                                    </option>

                                    <option>
                                        Ibuprofen 400mg
                                    </option>

                                    <option>
                                        Cetirizine 10mg
                                    </option>

                                    <option>
                                        Vitamin C 500mg
                                    </option>

                                    <option>
                                        Cough Syrup
                                    </option>

                                </select>

                            </div>

                            {/* Quantity */}

                            <div className="form-group">

                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    placeholder="Enter quantity"
                                    required
                                />

                            </div>

                            {/* Modal Actions */}

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
                                    className="submit-issuance-btn"
                                >

                                    <CheckCircle size={17} />

                                    Issue Medicine

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Issuance;