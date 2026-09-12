import { useState } from "react";
import {
    Search,
    Pill,
    Calendar,
    Package,
    Clock,
    CheckCircle,
    Eye,
    X,
} from "lucide-react";

import "../../styles/MyMedicine.css";

const MyMedicine = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMedicine, setSelectedMedicine] = useState(null);

    const medicines = [
        {
            id: "MED-001",
            medicine: "Paracetamol 500mg",
            quantity: 10,
            dateIssued: "September 5, 2026",
            issuedBy: "Clinic Staff",
            instructions: "Take 1 tablet every 6 hours as needed.",
            status: "Issued",
        },
        {
            id: "MED-002",
            medicine: "Cetirizine 10mg",
            quantity: 7,
            dateIssued: "August 18, 2026",
            issuedBy: "Clinic Staff",
            instructions: "Take 1 tablet once daily.",
            status: "Issued",
        },
        {
            id: "MED-003",
            medicine: "Antacid",
            quantity: 10,
            dateIssued: "July 10, 2026",
            issuedBy: "Clinic Staff",
            instructions: "Take as directed by clinic staff.",
            status: "Completed",
        },
    ];

    const filteredMedicines = medicines.filter((medicine) =>
        `${medicine.id} ${medicine.medicine} ${medicine.status}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="my-medicine-page">

            {/* HEADER */}
            <div className="medicine-header">
                <div>
                    <h1>My Medicine</h1>
                    <p>
                        View medicines issued to you by the clinic.
                    </p>
                </div>

                <div className="medicine-header-badge">
                    <Pill size={21} />
                    <span>My Medicines</span>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="medicine-summary">

                <div className="medicine-summary-card">
                    <div className="medicine-summary-icon blue">
                        <Pill size={22} />
                    </div>

                    <div>
                        <span>Total Medicines</span>
                        <strong>{medicines.length}</strong>
                    </div>
                </div>

                <div className="medicine-summary-card">
                    <div className="medicine-summary-icon green">
                        <CheckCircle size={22} />
                    </div>

                    <div>
                        <span>Active</span>
                        <strong>
                            {
                                medicines.filter(
                                    (item) => item.status === "Issued"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="medicine-summary-card">
                    <div className="medicine-summary-icon orange">
                        <Package size={22} />
                    </div>

                    <div>
                        <span>Total Quantity</span>
                        <strong>
                            {medicines.reduce(
                                (total, item) => total + item.quantity,
                                0
                            )}
                        </strong>
                    </div>
                </div>

            </div>

            {/* SEARCH */}
            <div className="medicine-toolbar">
                <div className="medicine-search">
                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search medicine..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* MEDICINE TABLE */}
            <div className="medicine-card">

                <div className="medicine-card-header">
                    <div>
                        <h2>Medicine History</h2>
                        <p>
                            Medicines previously issued by the clinic.
                        </p>
                    </div>
                </div>

                <div className="medicine-table-wrapper">
                    <table className="medicine-table">

                        <thead>
                            <tr>
                                <th>Medicine ID</th>
                                <th>Medicine</th>
                                <th>Quantity</th>
                                <th>Date Issued</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMedicines.length > 0 ? (
                                filteredMedicines.map((medicine) => (
                                    <tr key={medicine.id}>

                                        <td>
                                            <strong>{medicine.id}</strong>
                                        </td>

                                        <td>
                                            <div className="medicine-name">
                                                <div className="pill-icon">
                                                    <Pill size={17} />
                                                </div>

                                                <span>
                                                    {medicine.medicine}
                                                </span>
                                            </div>
                                        </td>

                                        <td>{medicine.quantity}</td>

                                        <td>{medicine.dateIssued}</td>

                                        <td>
                                            <span
                                                className={
                                                    medicine.status ===
                                                    "Issued"
                                                        ? "medicine-status issued"
                                                        : "medicine-status completed"
                                                }
                                            >
                                                {medicine.status}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="view-medicine-btn"
                                                onClick={() =>
                                                    setSelectedMedicine(
                                                        medicine
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
                                        className="no-medicines"
                                    >
                                        No medicine records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedMedicine && (
                <div className="medicine-modal-overlay">

                    <div className="medicine-modal">

                        <div className="modal-header">
                            <div>
                                <h2>Medicine Details</h2>
                                <p>{selectedMedicine.id}</p>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setSelectedMedicine(null)
                                }
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="medicine-details">

                            <div className="medicine-detail-box">
                                <span>Medicine</span>
                                <strong>
                                    {selectedMedicine.medicine}
                                </strong>
                            </div>

                            <div className="medicine-detail-box">
                                <span>Quantity</span>
                                <strong>
                                    {selectedMedicine.quantity}
                                </strong>
                            </div>

                            <div className="medicine-detail-box">
                                <span>Date Issued</span>
                                <strong>
                                    {selectedMedicine.dateIssued}
                                </strong>
                            </div>

                            <div className="medicine-detail-box">
                                <span>Issued By</span>
                                <strong>
                                    {selectedMedicine.issuedBy}
                                </strong>
                            </div>

                            <div className="medicine-detail-box full">
                                <span>Instructions</span>
                                <strong>
                                    {selectedMedicine.instructions}
                                </strong>
                            </div>

                            <div className="medicine-detail-box">
                                <span>Status</span>

                                <span
                                    className={
                                        selectedMedicine.status === "Issued"
                                            ? "medicine-status issued"
                                            : "medicine-status completed"
                                    }
                                >
                                    {selectedMedicine.status}
                                </span>
                            </div>

                        </div>

                        <button
                            className="modal-done-btn"
                            onClick={() =>
                                setSelectedMedicine(null)
                            }
                        >
                            Close
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MyMedicine;

