
import { useState } from "react";
import {
    Search,
    Package,
    AlertTriangle,
    CheckCircle,
    Pill,
    Plus,
    Eye,
    X,
} from "lucide-react";
import "../../styles/Inventory.css";

function Inventory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    const [inventory, setInventory] = useState([
        {
            id: "MED-001",
            name: "Paracetamol 500mg",
            category: "Tablet",
            quantity: 120,
            unit: "Tablets",
            reorderLevel: 20,
            expirationDate: "2027-06-30",
            status: "Available",
        },
        {
            id: "MED-002",
            name: "Amoxicillin 500mg",
            category: "Capsule",
            quantity: 45,
            unit: "Capsules",
            reorderLevel: 20,
            expirationDate: "2027-04-15",
            status: "Available",
        },
        {
            id: "MED-003",
            name: "Ibuprofen 400mg",
            category: "Tablet",
            quantity: 18,
            unit: "Tablets",
            reorderLevel: 20,
            expirationDate: "2027-08-20",
            status: "Low Stock",
        },
        {
            id: "MED-004",
            name: "Cetirizine 10mg",
            category: "Tablet",
            quantity: 75,
            unit: "Tablets",
            reorderLevel: 20,
            expirationDate: "2027-09-10",
            status: "Available",
        },
        {
            id: "MED-005",
            name: "Cough Syrup",
            category: "Syrup",
            quantity: 8,
            unit: "Bottles",
            reorderLevel: 10,
            expirationDate: "2027-02-28",
            status: "Low Stock",
        },
        {
            id: "MED-006",
            name: "Vitamin C 500mg",
            category: "Tablet",
            quantity: 0,
            unit: "Tablets",
            reorderLevel: 20,
            expirationDate: "2027-11-30",
            status: "Out of Stock",
        },
    ]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        reorderLevel: "",
        expirationDate: "",
    });

    // =========================
    // SEARCH
    // =========================

    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // =========================
    // SUMMARY
    // =========================

    const availableCount = inventory.filter(
        (item) => item.status === "Available"
    ).length;

    const lowStockCount = inventory.filter(
        (item) => item.status === "Low Stock"
    ).length;

    const outOfStockCount = inventory.filter(
        (item) => item.status === "Out of Stock"
    ).length;

    // =========================
    // FORM HANDLING
    // =========================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            quantity: "",
            unit: "",
            reorderLevel: "",
            expirationDate: "",
        });
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        resetForm();
    };

    // =========================
    // ADD MEDICINE
    // =========================

    const handleAddMedicine = (e) => {
        e.preventDefault();

        const quantity = Number(formData.quantity);
        const reorderLevel = Number(formData.reorderLevel);

        let status = "Available";

        if (quantity === 0) {
            status = "Out of Stock";
        } else if (quantity <= reorderLevel) {
            status = "Low Stock";
        }

        const newId = `MED-${String(inventory.length + 1).padStart(3, "0")}`;

        const newMedicine = {
            id: newId,
            name: formData.name,
            category: formData.category,
            quantity: quantity,
            unit: formData.unit,
            reorderLevel: reorderLevel,
            expirationDate: formData.expirationDate,
            status: status,
        };

        setInventory([...inventory, newMedicine]);

        setShowAddModal(false);
        resetForm();

        alert(`${formData.name} has been successfully added.`);
    };

    // =========================
    // VIEW MEDICINE
    // =========================

    const handleView = (item) => {
        alert(
            `Medicine Details\n\n` +
            `ID: ${item.id}\n` +
            `Medicine: ${item.name}\n` +
            `Category: ${item.category}\n` +
            `Stock: ${item.quantity} ${item.unit}\n` +
            `Reorder Level: ${item.reorderLevel}\n` +
            `Expiration Date: ${item.expirationDate}\n` +
            `Status: ${item.status}`
        );
    };

    return (
        <div className="inventory-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="inventory-header">
                <div>
                    <h1>Inventory</h1>
                    <p>Monitor medicine stock and availability</p>
                </div>

                <button
                    className="add-inventory-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus size={18} />
                    Add Medicine
                </button>
            </div>

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="inventory-summary">

                <div className="inventory-summary-card">
                    <div className="inventory-summary-icon blue">
                        <Package size={23} />
                    </div>

                    <div>
                        <span>Total Medicines</span>
                        <strong>{inventory.length}</strong>
                    </div>
                </div>

                <div className="inventory-summary-card">
                    <div className="inventory-summary-icon green">
                        <CheckCircle size={23} />
                    </div>

                    <div>
                        <span>Available</span>
                        <strong>{availableCount}</strong>
                    </div>
                </div>

                <div className="inventory-summary-card">
                    <div className="inventory-summary-icon orange">
                        <AlertTriangle size={23} />
                    </div>

                    <div>
                        <span>Low Stock</span>
                        <strong>{lowStockCount}</strong>
                    </div>
                </div>

                <div className="inventory-summary-card">
                    <div className="inventory-summary-icon red">
                        <Pill size={23} />
                    </div>

                    <div>
                        <span>Out of Stock</span>
                        <strong>{outOfStockCount}</strong>
                    </div>
                </div>

            </div>

            {/* =========================
                INVENTORY CARD
            ========================= */}

            <div className="inventory-card">

                <div className="inventory-toolbar">

                    <div>
                        <h2>Medicine Inventory</h2>
                        <p>View current medicine stock</p>
                    </div>

                    <div className="inventory-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search medicine..."
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

                <div className="inventory-table-container">

                    <table className="inventory-table">

                        <thead>
                            <tr>
                                <th>Medicine ID</th>
                                <th>Medicine</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredInventory.length > 0 ? (

                                filteredInventory.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            <span className="medicine-id">
                                                {item.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="medicine-info">

                                                <div className="medicine-icon">
                                                    <Pill size={17} />
                                                </div>

                                                <strong>
                                                    {item.name}
                                                </strong>

                                            </div>
                                        </td>

                                        <td>
                                            {item.category}
                                        </td>

                                        <td>
                                            <div className="stock-info">

                                                <strong>
                                                    {item.quantity}
                                                </strong>

                                                <span>
                                                    {item.unit}
                                                </span>

                                            </div>
                                        </td>

                                        <td>

                                            <span
                                                className={`inventory-status ${
                                                    item.status === "Available"
                                                        ? "available"
                                                        : item.status === "Low Stock"
                                                        ? "low-stock"
                                                        : "out-stock"
                                                }`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="inventory-view-btn"
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
                                        colSpan="6"
                                        className="inventory-empty"
                                    >

                                        <Package size={40} />

                                        <p>
                                            No medicines found.
                                        </p>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =========================
                ADD MEDICINE MODAL
            ========================= */}

            {showAddModal && (

                <div
                    className="medicine-modal-overlay"
                    onClick={handleCloseModal}
                >

                    <div
                        className="medicine-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}

                        <div className="medicine-modal-header">

                            <div>
                                <h2>Add Medicine</h2>
                                <p>
                                    Enter the medicine information below.
                                </p>
                            </div>

                            <button
                                className="medicine-modal-close"
                                onClick={handleCloseModal}
                                type="button"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Form */}

                        <form onSubmit={handleAddMedicine}>

                            <div className="medicine-form-grid">

                                {/* Medicine Name */}

                                <div className="medicine-form-group full">

                                    <label>
                                        Medicine Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Paracetamol 500mg"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                                {/* Category */}

                                <div className="medicine-form-group">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >

                                        <option value="">
                                            Select category
                                        </option>

                                        <option value="Tablet">
                                            Tablet
                                        </option>

                                        <option value="Capsule">
                                            Capsule
                                        </option>

                                        <option value="Syrup">
                                            Syrup
                                        </option>

                                        <option value="Injection">
                                            Injection
                                        </option>

                                        <option value="Cream">
                                            Cream
                                        </option>

                                        <option value="Drops">
                                            Drops
                                        </option>

                                    </select>

                                </div>

                                {/* Unit */}

                                <div className="medicine-form-group">

                                    <label>
                                        Unit
                                    </label>

                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        required
                                    >

                                        <option value="">
                                            Select unit
                                        </option>

                                        <option value="Tablets">
                                            Tablets
                                        </option>

                                        <option value="Capsules">
                                            Capsules
                                        </option>

                                        <option value="Bottles">
                                            Bottles
                                        </option>

                                        <option value="Boxes">
                                            Boxes
                                        </option>

                                        <option value="Tubes">
                                            Tubes
                                        </option>

                                        <option value="Vials">
                                            Vials
                                        </option>

                                    </select>

                                </div>

                                {/* Quantity */}

                                <div className="medicine-form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        placeholder="0"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                                {/* Reorder Level */}

                                <div className="medicine-form-group">

                                    <label>
                                        Reorder Level
                                    </label>

                                    <input
                                        type="number"
                                        name="reorderLevel"
                                        min="0"
                                        placeholder="e.g. 20"
                                        value={formData.reorderLevel}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                                {/* Expiration Date */}

                                <div className="medicine-form-group full">

                                    <label>
                                        Expiration Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expirationDate"
                                        value={formData.expirationDate}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                            </div>

                            {/* Buttons */}

                            <div className="medicine-form-actions">

                                <button
                                    type="button"
                                    className="medicine-cancel-btn"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="medicine-save-btn"
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

export default Inventory;
