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
            medicine: "Vitamin C 500mg",
            quantity: 20,
            issuedBy: "Staff Nurse",
            date: "2026-09-02",
            status: "Issued",
        },
    ]);

    const filteredIssuances = issuances.filter((item) =>
        item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medicine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const handleView = (item) => {
        alert(
            `Issuance Details\n\n` +
            `Issuance ID: ${item.id}\n` +
            `Patient: ${item.patient}\n` +
            `Patient ID: ${item.patientId}\n` +
            `Medicine: ${item.medicine}\n` +
            `Quantity: ${item.quantity}\n` +
            `Date: ${item.date}\n` +
            `Status: ${item.status}`
        );
    };

    const handleAddIssuance = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const newIssuance = {
            id: `ISS-${String(issuances.length + 1).padStart(3, "0")}`,
            patientId: formData.get("patientId"),
            patient: formData.get("patient"),
            medicine: formData.get("medicine"),
            quantity: Number(formData.get("quantity")),
            issuedBy: "Staff Nurse",
            date: new Date().toISOString().split("T")[0],
            status: "Issued",
        };

        setIssuances([newIssuance, ...issuances]);
        setShowModal(false);
        e.target.reset();
    };

    return (
        <div className="issuance-page">

            {/* Header */}
            <div className="issuance-header">
                <div>
                    <h1>Medicine Issuance</h1>
                    <p>Manage and track medicines issued to patients.</p>
                </div>

                <button
                    className="add-issuance-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Issue Medicine
                </button>
            </div>

            {/* Summary Cards */}
            <div className="issuance-summary">

                <div className="issuance-summary-card">
                    <div className="issuance-summary-icon blue">
                        <Package size={24} />
                    </div>

                    <div>
                        <span>Total Issuances</span>
                        <h2>{totalIssuances}</h2>
                    </div>
                </div>

                <div className="issuance-summary-card">
                    <div className="issuance-summary-icon green">
                        <CheckCircle size={24} />
                    </div>

                    <div>
                        <span>Issued</span>
                        <h2>{issuedCount}</h2>
                    </div>
                </div>

                <div className="issuance-summary-card">
                    <div className="issuance-summary-icon orange">
                        <Clock size={24} />
                    </div>

                    <div>
                        <span>Pending</span>
                        <h2>{pendingCount}</h2>
                    </div>
                </div>

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

            {/* Main Card */}
            <div className="issuance-card">

                <div className="issuance-toolbar">

                    <div className="issuance-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search patient, medicine, or issuance ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                </div>

                {/* Table */}
                <div className="issuance-table-container">
                    <table className="issuance-table">

                        <thead>
                            <tr>
                                <th>Issuance ID</th>
                                <th>Patient</th>
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

                                        <td>
                                            <span className="issuance-id">
                                                {item.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-info">
                                                <div className="patient-icon">
                                                    <User size={17} />
                                                </div>

                                                <div>
                                                    <strong>{item.patient}</strong>
                                                    <small>{item.patientId}</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="medicine-info">
                                                <div className="medicine-icon">
                                                    <Pill size={17} />
                                                </div>

                                                <span>{item.medicine}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="quantity">
                                                {item.quantity}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="date-info">
                                                <Calendar size={15} />
                                                {item.date}
                                            </div>
                                        </td>

                                        <td>{item.issuedBy}</td>

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
                                        colSpan="8"
                                        className="issuance-empty"
                                    >
                                        <Package size={40} />
                                        <h3>No issuance records found</h3>
                                        <p>
                                            Try searching for another patient
                                            or medicine.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

            </div>

            {/* Add Issuance Modal */}
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

                        <form onSubmit={handleAddIssuance}>

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

                            <div className="form-group">
                                <label>Medicine</label>
                                <select name="medicine" required>
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

                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    placeholder="Enter quantity"
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