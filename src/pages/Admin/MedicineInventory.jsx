import { useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Package,
    AlertTriangle,
    X,
} from "lucide-react";
import "../../styles/MedicineInventory.css";

function MedicineInventory() {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [medicines, setMedicines] = useState([
        {
            id: "MED-001",
            name: "Paracetamol",
            category: "Pain Relief",
            quantity: 150,
            unit: "Tablets",
            expiry: "2027-05-12",
            status: "In Stock",
        },
        {
            id: "MED-002",
            name: "Amoxicillin",
            category: "Antibiotic",
            quantity: 80,
            unit: "Capsules",
            expiry: "2027-02-20",
            status: "In Stock",
        },
        {
            id: "MED-003",
            name: "Ibuprofen",
            category: "Pain Relief",
            quantity: 25,
            unit: "Tablets",
            expiry: "2026-11-15",
            status: "Low Stock",
        },
        {
            id: "MED-004",
            name: "Cetirizine",
            category: "Antihistamine",
            quantity: 0,
            unit: "Tablets",
            expiry: "2027-01-10",
            status: "Out of Stock",
        },
    ]);

    const filteredMedicines = medicines.filter((medicine) =>
        `${medicine.name} ${medicine.category} ${medicine.id}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const deleteMedicine = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this medicine?"
        );

        if (confirmDelete) {
            setMedicines(medicines.filter((medicine) => medicine.id !== id));
        }
    };

    return (
        <div className="medicine-page">
            {/* Page Header */}
            <div className="medicine-header">
                <div>
                    <h1>Medicine Inventory</h1>
                    <p>Manage and monitor your clinic's medicine stocks.</p>
                </div>

                <button
                    className="add-medicine-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add Medicine
                </button>
            </div>

            {/* Statistics */}
            <div className="medicine-stats">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <Package size={24} />
                    </div>
                    <div>
                        <span>Total Medicines</span>
                        <strong>{medicines.length}</strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <Package size={24} />
                    </div>
                    <div>
                        <span>In Stock</span>
                        <strong>
                            {
                                medicines.filter(
                                    (medicine) => medicine.quantity > 30
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <span>Low Stock</span>
                        <strong>
                            {
                                medicines.filter(
                                    (medicine) =>
                                        medicine.quantity > 0 &&
                                        medicine.quantity <= 30
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon red">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <span>Out of Stock</span>
                        <strong>
                            {
                                medicines.filter(
                                    (medicine) => medicine.quantity === 0
                                ).length
                            }
                        </strong>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="medicine-card">
                <div className="medicine-card-header">
                    <div>
                        <h2>Medicine List</h2>
                        <p>View and manage all available medicines.</p>
                    </div>

                    <div className="medicine-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search medicine..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="medicine-table">
                        <thead>
                            <tr>
                                <th>Medicine ID</th>
                                <th>Medicine Name</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredMedicines.length > 0 ? (
                                filteredMedicines.map((medicine) => (
                                    <tr key={medicine.id}>
                                        <td>
                                            <span className="medicine-id">
                                                {medicine.id}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>{medicine.name}</strong>
                                        </td>

                                        <td>{medicine.category}</td>

                                        <td>
                                            <strong>{medicine.quantity}</strong>
                                        </td>

                                        <td>{medicine.unit}</td>

                                        <td>{medicine.expiry}</td>

                                        <td>
                                            <span
                                                className={`status ${medicine.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {medicine.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-btn"
                                                    title="Edit medicine"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    title="Delete medicine"
                                                    onClick={() =>
                                                        deleteMedicine(
                                                            medicine.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="empty-message"
                                    >
                                        No medicines found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Medicine Modal */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="medicine-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>Add Medicine</h2>
                                <p>Add a new medicine to your inventory.</p>
                            </div>

                            <button
                                className="close-modal"
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
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Medicine Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter medicine name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <select required>
                                        <option value="">
                                            Select category
                                        </option>
                                        <option>Pain Relief</option>
                                        <option>Antibiotic</option>
                                        <option>Antihistamine</option>
                                        <option>Vitamins</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        placeholder="Enter quantity"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Unit</label>
                                    <select required>
                                        <option value="">
                                            Select unit
                                        </option>
                                        <option>Tablets</option>
                                        <option>Capsules</option>
                                        <option>Bottles</option>
                                        <option>Boxes</option>
                                        <option>Vials</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <label>Expiry Date</label>
                                    <input type="date" required />
                                </div>
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
                                    className="save-btn"
                                >
                                    <Plus size={18} />
                                    Add Medicine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MedicineInventory;

