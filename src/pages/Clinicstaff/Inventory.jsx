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
    Trash2,
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

        // Sample expired medicine
        {
            id: "MED-007",
            name: "Expired Medicine",
            category: "Tablet",
            quantity: 12,
            unit: "Tablets",
            reorderLevel: 10,
            expirationDate: "2026-08-15",
            status: "Available",
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

    // =========================================================
    // DATE FUNCTIONS
    // =========================================================

    const getToday = () => {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return today;
    };

    const isExpired = (expirationDate) => {
        if (!expirationDate) {
            return false;
        }

        const expiryDate = new Date(
            `${expirationDate}T00:00:00`
        );

        return expiryDate < getToday();
    };

    const getExpiredDays = (expirationDate) => {
        if (!expirationDate) {
            return 0;
        }

        const expiryDate = new Date(
            `${expirationDate}T00:00:00`
        );

        const today = getToday();

        const difference =
            today.getTime() - expiryDate.getTime();

        return Math.max(
            0,
            Math.floor(
                difference /
                    (1000 * 60 * 60 * 24)
            )
        );
    };

    // =========================================================
    // GET MEDICINE STATUS
    // =========================================================

    const getMedicineStatus = (item) => {
        // Expiration always has priority
        if (isExpired(item.expirationDate)) {
            return "Expired";
        }

        if (item.quantity === 0) {
            return "Out of Stock";
        }

        if (item.quantity <= item.reorderLevel) {
            return "Low Stock";
        }

        return "Available";
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredInventory = inventory.filter(
        (item) =>
            item.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // =========================================================
    // EXPIRED MEDICINES
    // =========================================================

    const expiredMedicines = inventory.filter((item) =>
        isExpired(item.expirationDate)
    );

    // =========================================================
    // SUMMARY
    // =========================================================

    const availableCount = inventory.filter(
        (item) =>
            getMedicineStatus(item) === "Available"
    ).length;

    const lowStockCount = inventory.filter(
        (item) =>
            getMedicineStatus(item) === "Low Stock"
    ).length;

    const outOfStockCount = inventory.filter(
        (item) =>
            getMedicineStatus(item) === "Out of Stock"
    ).length;

    const expiredCount = inventory.filter(
        (item) =>
            getMedicineStatus(item) === "Expired"
    ).length;

    // =========================================================
    // FORM HANDLING
    // =========================================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
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

    // =========================================================
    // ADD MEDICINE
    // =========================================================

    const handleAddMedicine = (e) => {
        e.preventDefault();

        const quantity = Number(formData.quantity);
        const reorderLevel = Number(
            formData.reorderLevel
        );

        const newId = `MED-${String(
            inventory.length + 1
        ).padStart(3, "0")}`;

        const newMedicine = {
            id: newId,
            name: formData.name.trim(),
            category: formData.category,
            quantity,
            unit: formData.unit,
            reorderLevel,
            expirationDate:
                formData.expirationDate,
            status: "Available",
        };

        setInventory((previous) => [
            ...previous,
            newMedicine,
        ]);

        setShowAddModal(false);

        alert(
            `${formData.name} has been successfully added.`
        );

        resetForm();
    };

    // =========================================================
    // VIEW MEDICINE
    // =========================================================

    const handleView = (item) => {
        const status = getMedicineStatus(item);

        let message =
            `Medicine Details\n\n` +
            `ID: ${item.id}\n` +
            `Medicine: ${item.name}\n` +
            `Category: ${item.category}\n` +
            `Stock: ${item.quantity} ${item.unit}\n` +
            `Reorder Level: ${item.reorderLevel}\n` +
            `Expiration Date: ${item.expirationDate}\n` +
            `Status: ${status}`;

        if (status === "Expired") {
            message +=
                `\nExpired: ${getExpiredDays(
                    item.expirationDate
                )} days ago`;
        }

        alert(message);
    };

    // =========================================================
    // REMOVE EXPIRED MEDICINE
    // =========================================================

    const handleRemoveExpired = (item) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${item.name}" from the expired medicines list?\n\n` +
                `Medicine ID: ${item.id}\n` +
                `Expiration Date: ${item.expirationDate}`
        );

        if (!confirmed) {
            return;
        }

        setInventory((previous) =>
            previous.filter(
                (medicine) =>
                    medicine.id !== item.id
            )
        );

        alert(
            `${item.name} has been removed from the inventory.`
        );
    };

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <div className="inventory-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="inventory-header">

                <div>
                    <h1>Inventory</h1>

                    <p>
                        Monitor medicine stock and availability
                    </p>
                </div>

                <button
                    className="add-inventory-btn"
                    onClick={() =>
                        setShowAddModal(true)
                    }
                >
                    <Plus size={18} />
                    Add Medicine
                </button>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="inventory-summary">

                {/* TOTAL */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon blue">
                        <Package size={23} />
                    </div>

                    <div>
                        <span>
                            Total Medicines
                        </span>

                        <strong>
                            {inventory.length}
                        </strong>
                    </div>

                </div>

                {/* AVAILABLE */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon green">
                        <CheckCircle size={23} />
                    </div>

                    <div>
                        <span>
                            Available
                        </span>

                        <strong>
                            {availableCount}
                        </strong>
                    </div>

                </div>

                {/* LOW STOCK */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon orange">
                        <AlertTriangle size={23} />
                    </div>

                    <div>
                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {lowStockCount}
                        </strong>
                    </div>

                </div>

                {/* OUT OF STOCK */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon red">
                        <Pill size={23} />
                    </div>

                    <div>
                        <span>
                            Out of Stock
                        </span>

                        <strong>
                            {outOfStockCount}
                        </strong>
                    </div>

                </div>

                {/* EXPIRED */}

                <div className="inventory-summary-card">

                    <div className="inventory-summary-icon expired">
                        <AlertTriangle size={23} />
                    </div>

                    <div>
                        <span>
                            Expired
                        </span>

                        <strong>
                            {expiredCount}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                MAIN INVENTORY
            ================================================= */}

            <div className="inventory-card">

                {/* TOOLBAR */}

                <div className="inventory-toolbar">

                    <div>
                        <h2>
                            Medicine Inventory
                        </h2>

                        <p>
                            View current medicine stock
                        </p>
                    </div>

                    <div className="inventory-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search medicine..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

                {/* TABLE */}

                <div className="inventory-table-container">

                    <table className="inventory-table">

                        <thead>

                            <tr>

                                <th>
                                    Medicine ID
                                </th>

                                <th>
                                    Medicine
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Expiration Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInventory.length > 0 ? (

                                filteredInventory.map(
                                    (item) => {

                                        const status =
                                            getMedicineStatus(
                                                item
                                            );

                                        return (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                {/* ID */}

                                                <td>
                                                    <span className="medicine-id">
                                                        {
                                                            item.id
                                                        }
                                                    </span>
                                                </td>

                                                {/* MEDICINE */}

                                                <td>

                                                    <div className="medicine-info">

                                                        <div className="medicine-icon">
                                                            <Pill
                                                                size={
                                                                    17
                                                                }
                                                            />
                                                        </div>

                                                        <strong>
                                                            {
                                                                item.name
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>

                                                {/* CATEGORY */}

                                                <td>
                                                    {
                                                        item.category
                                                    }
                                                </td>

                                                {/* STOCK */}

                                                <td>

                                                    <div className="stock-info">

                                                        <strong>
                                                            {
                                                                item.quantity
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                item.unit
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* EXPIRATION */}

                                                <td>

                                                    <span
                                                        className={`expiration-date ${
                                                            status ===
                                                            "Expired"
                                                                ? "expiration-expired"
                                                                : ""
                                                        }`}
                                                    >
                                                        {
                                                            item.expirationDate
                                                        }
                                                    </span>

                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`inventory-status ${
                                                            status ===
                                                            "Available"
                                                                ? "available"
                                                                : status ===
                                                                  "Low Stock"
                                                                ? "low-stock"
                                                                : status ===
                                                                  "Out of Stock"
                                                                ? "out-stock"
                                                                : "expired"
                                                        }`}
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </span>

                                                </td>

                                                {/* ACTION */}

                                                <td>

                                                    <button
                                                        className="inventory-view-btn"
                                                        onClick={() =>
                                                            handleView(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        View
                                                    </button>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="inventory-empty"
                                    >

                                        <Package
                                            size={40}
                                        />

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

            {/* =================================================
                EXPIRED MEDICINES
            ================================================= */}

            <div className="expired-medicine-card">

                {/* HEADER */}

                <div className="expired-medicine-header">

                    <div className="expired-medicine-title">

                        <div className="expired-medicine-icon">

                            <AlertTriangle
                                size={21}
                            />

                        </div>

                        <div>

                            <h2>
                                Expired Medicines
                            </h2>

                            <p>
                                Medicines that have passed
                                their expiration date and
                                should not be issued.
                            </p>

                        </div>

                    </div>

                    <span className="expired-count">

                        {expiredCount}{" "}

                        {expiredCount === 1
                            ? "Medicine"
                            : "Medicines"}

                    </span>

                </div>

                {/* EXPIRED TABLE */}

                <div className="expired-medicine-table-container">

                    {expiredMedicines.length > 0 ? (

                        <table className="expired-medicine-table">

                            <thead>

                                <tr>

                                    <th>
                                        Medicine ID
                                    </th>

                                    <th>
                                        Medicine
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Remaining Stock
                                    </th>

                                    <th>
                                        Expiration Date
                                    </th>

                                    <th>
                                        Expired
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {expiredMedicines.map(
                                    (item) => {

                                        const expiredDays =
                                            getExpiredDays(
                                                item.expirationDate
                                            );

                                        return (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                {/* ID */}

                                                <td>

                                                    <span className="expired-medicine-id">
                                                        {
                                                            item.id
                                                        }
                                                    </span>

                                                </td>

                                                {/* MEDICINE */}

                                                <td>

                                                    <div className="expired-medicine-info">

                                                        <div className="expired-pill-icon">

                                                            <Pill
                                                                size={
                                                                    17
                                                                }
                                                            />

                                                        </div>

                                                        <strong>
                                                            {
                                                                item.name
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>

                                                {/* CATEGORY */}

                                                <td>
                                                    {
                                                        item.category
                                                    }
                                                </td>

                                                {/* STOCK */}

                                                <td>

                                                    <div className="expired-stock">

                                                        <strong>
                                                            {
                                                                item.quantity
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                item.unit
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* EXPIRATION */}

                                                <td>

                                                    <span className="expired-date">
                                                        {
                                                            item.expirationDate
                                                        }
                                                    </span>

                                                </td>

                                                {/* DAYS EXPIRED */}

                                                <td>

                                                    <span className="expired-badge">

                                                        <AlertTriangle
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            expiredDays
                                                        }{" "}

                                                        {expiredDays ===
                                                        1
                                                            ? "day"
                                                            : "days"}{" "}
                                                        ago

                                                    </span>

                                                </td>

                                                {/* ACTION */}

                                                <td>

                                                    <div className="expired-actions">

                                                        <button
                                                            type="button"
                                                            className="expired-view-btn"
                                                            onClick={() =>
                                                                handleView(
                                                                    item
                                                                )
                                                            }
                                                        >

                                                            <Eye
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            View

                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="expired-remove-btn"
                                                            onClick={() =>
                                                                handleRemoveExpired(
                                                                    item
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            Remove

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    ) : (

                        <div className="expired-empty">

                            <CheckCircle
                                size={38}
                            />

                            <h3>
                                No Expired Medicines
                            </h3>

                            <p>
                                All medicines are currently
                                within their expiration dates.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* =================================================
                ADD MEDICINE MODAL
            ================================================= */}

            {showAddModal && (

                <div
                    className="medicine-modal-overlay"
                    onClick={
                        handleCloseModal
                    }
                >

                    <div
                        className="medicine-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="medicine-modal-header">

                            <div>

                                <h2>
                                    Add Medicine
                                </h2>

                                <p>
                                    Enter the medicine
                                    information below.
                                </p>

                            </div>

                            <button
                                className="medicine-modal-close"
                                onClick={
                                    handleCloseModal
                                }
                                type="button"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleAddMedicine
                            }
                        >

                            <div className="medicine-form-grid">

                                {/* MEDICINE NAME */}

                                <div className="medicine-form-group full">

                                    <label>
                                        Medicine Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Paracetamol 500mg"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                {/* CATEGORY */}

                                <div className="medicine-form-group">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleInputChange
                                        }
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

                                {/* UNIT */}

                                <div className="medicine-form-group">

                                    <label>
                                        Unit
                                    </label>

                                    <select
                                        name="unit"
                                        value={
                                            formData.unit
                                        }
                                        onChange={
                                            handleInputChange
                                        }
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

                                {/* QUANTITY */}

                                <div className="medicine-form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0"
                                        placeholder="0"
                                        value={
                                            formData.quantity
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                {/* REORDER LEVEL */}

                                <div className="medicine-form-group">

                                    <label>
                                        Reorder Level
                                    </label>

                                    <input
                                        type="number"
                                        name="reorderLevel"
                                        min="0"
                                        placeholder="e.g. 20"
                                        value={
                                            formData.reorderLevel
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                {/* EXPIRATION DATE */}

                                <div className="medicine-form-group full">

                                    <label>
                                        Expiration Date
                                    </label>

                                    <input
                                        type="date"
                                        name="expirationDate"
                                        value={
                                            formData.expirationDate
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                            </div>

                            {/* BUTTONS */}

                            <div className="medicine-form-actions">

                                <button
                                    type="button"
                                    className="medicine-cancel-btn"
                                    onClick={
                                        handleCloseModal
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="medicine-save-btn"
                                >

                                    <Plus
                                        size={18}
                                    />

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