import { useState } from "react";
import {
    Search,
    Plus,
    Eye,
    Pill,
    User,
    Calendar,
    X,
} from "lucide-react";
import "../../styles/MedicineIssuance.css";

function MedicineIssuance() {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [issuances, setIssuances] = useState([
        {
            id: "ISS-001",
            patient: "Juan Dela Cruz",
            patientId: "P-001",
            medicine: "Paracetamol",
            quantity: 10,
            unit: "Tablets",
            date: "2026-09-01",
            issuedBy: "Maria Santos",
            status: "Issued",
        },
        {
            id: "ISS-002",
            patient: "Ana Reyes",
            patientId: "P-002",
            medicine: "Amoxicillin",
            quantity: 15,
            unit: "Capsules",
            date: "2026-08-31",
            issuedBy: "John Garcia",
            status: "Issued",
        },
        {
            id: "ISS-003",
            patient: "Pedro Ramos",
            patientId: "P-003",
            medicine: "Ibuprofen",
            quantity: 5,
            unit: "Tablets",
            date: "2026-08-30",
            issuedBy: "Maria Santos",
            status: "Issued",
        },
        {
            id: "ISS-004",
            patient: "Sofia Mendoza",
            patientId: "P-004",
            medicine: "Cetirizine",
            quantity: 10,
            unit: "Tablets",
            date: "2026-08-29",
            issuedBy: "John Garcia",
            status: "Pending",
        },
    ]);

    const filteredIssuances = issuances.filter((issuance) =>
        `${issuance.id} ${issuance.patient} ${issuance.patientId} ${issuance.medicine}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalIssued = issuances.filter(
        (issuance) => issuance.status === "Issued"
    ).length;

    const totalPending = issuances.filter(
        (issuance) => issuance.status === "Pending"
    ).length;

    return (
        <div className="issuance-page">
            {/* Header */}
            <div className="issuance-header">
                <div>
                    <h1>Medicine Issuance</h1>
                    <p>
                        Issue medicines to patients and monitor issuance
                        records.
                    </p>
                </div>

                <button
                    className="issue-medicine-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Issue Medicine
                </button>
            </div>

            {/* Statistics */}
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
                        <Pill size={23} />
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
                        <strong>
                            {
                                new Set(
                                    issuances.map(
                                        (issuance) => issuance.patientId
                                    )
                                ).size
                            }
                        </strong>
                    </div>
                </div>
            </div>

            {/* Issuance Table */}
            <div className="issuance-card">
                <div className="issuance-card-header">
                    <div>
                        <h2>Issuance History</h2>
                        <p>
                            View all medicine issued to clinic patients.
                        </p>
                    </div>

                    <div className="issuance-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search patient or medicine..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="issuance-table-container">
                    <table className="issuance-table">
                        <thead>
                            <tr>
                                <th>Issuance ID</th>
                                <th>Patient</th>
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
                                        <td>
                                            <span className="issuance-id">
                                                {issuance.id}
                                            </span>
                                        </td>

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

                                        <td>
                                            <strong>
                                                {issuance.medicine}
                                            </strong>
                                        </td>

                                        <td>
                                            {issuance.quantity}{" "}
                                            {issuance.unit}
                                        </td>

                                        <td>{issuance.date}</td>

                                        <td>{issuance.issuedBy}</td>

                                        <td>
                                            <span
                                                className={`issuance-status ${issuance.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {issuance.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-issuance-btn"
                                                title="View details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="issuance-empty"
                                    >
                                        No issuance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Medicine Modal */}
            {showModal && (
                <div
                    className="issuance-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="issuance-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="issuance-modal-header">
                            <div>
                                <h2>Issue Medicine</h2>
                                <p>
                                    Record medicine issued to a patient.
                                </p>
                            </div>

                            <button
                                className="issuance-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowModal(false);
                            }}
                        >
                            <div className="issuance-form-grid">
                                <div className="issuance-form-group">
                                    <label>Patient</label>

                                    <select required>
                                        <option value="">
                                            Select patient
                                        </option>
                                        <option>
                                            Juan Dela Cruz - P-001
                                        </option>
                                        <option>
                                            Ana Reyes - P-002
                                        </option>
                                        <option>
                                            Pedro Ramos - P-003
                                        </option>
                                        <option>
                                            Sofia Mendoza - P-004
                                        </option>
                                    </select>
                                </div>

                                <div className="issuance-form-group">
                                    <label>Medicine</label>

                                    <select required>
                                        <option value="">
                                            Select medicine
                                        </option>
                                        <option>
                                            Paracetamol - 150 Tablets
                                        </option>
                                        <option>
                                            Amoxicillin - 80 Capsules
                                        </option>
                                        <option>
                                            Ibuprofen - 25 Tablets
                                        </option>
                                    </select>
                                </div>

                                <div className="issuance-form-group">
                                    <label>Quantity</label>

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Enter quantity"
                                        required
                                    />
                                </div>

                                <div className="issuance-form-group">
                                    <label>Date Issued</label>

                                    <input
                                        type="date"
                                        defaultValue="2026-09-01"
                                        required
                                    />
                                </div>

                                <div className="issuance-form-group full">
                                    <label>Remarks</label>

                                    <textarea
                                        rows="3"
                                        placeholder="Enter additional notes..."
                                    ></textarea>
                                </div>
                            </div>

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
        </div>
    );
}

export default MedicineIssuance;

