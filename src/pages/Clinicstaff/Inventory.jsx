import { useState } from "react";
import {
    Search,
    Package,
    AlertTriangle,
    CheckCircle,
    Pill,
    Plus,
    Eye
} from "lucide-react";
import "../../styles/Inventory.css";

function Inventory() {
    const [searchTerm, setSearchTerm] = useState("");

    const inventory = [
        {
            id: "MED-001",
            name: "Paracetamol 500mg",
            category: "Tablet",
            quantity: 120,
            unit: "Tablets",
            status: "Available"
        },
        {
            id: "MED-002",
            name: "Amoxicillin 500mg",
            category: "Capsule",
            quantity: 45,
            unit: "Capsules",
            status: "Available"
        },
        {
            id: "MED-003",
            name: "Ibuprofen 400mg",
            category: "Tablet",
            quantity: 18,
            unit: "Tablets",
            status: "Low Stock"
        },
        {
            id: "MED-004",
            name: "Cetirizine 10mg",
            category: "Tablet",
            quantity: 75,
            unit: "Tablets",
            status: "Available"
        },
        {
            id: "MED-005",
            name: "Cough Syrup",
            category: "Syrup",
            quantity: 8,
            unit: "Bottles",
            status: "Low Stock"
        },
        {
            id: "MED-006",
            name: "Vitamin C 500mg",
            category: "Tablet",
            quantity: 0,
            unit: "Tablets",
            status: "Out of Stock"
        }
    ];

    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const availableCount = inventory.filter(
        (item) => item.status === "Available"
    ).length;

    const lowStockCount = inventory.filter(
        (item) => item.status === "Low Stock"
    ).length;

    const outOfStockCount = inventory.filter(
        (item) => item.status === "Out of Stock"
    ).length;

    const handleView = (item) => {
        alert(
            `Medicine Details\n\n` +
            `ID: ${item.id}\n` +
            `Medicine: ${item.name}\n` +
            `Category: ${item.category}\n` +
            `Stock: ${item.quantity} ${item.unit}\n` +
            `Status: ${item.status}`
        );
    };

    return (
        <div className="inventory-page">

            {/* Header */}
            <div className="inventory-header">
                <div>
                    <h1>Inventory</h1>
                    <p>Monitor medicine stock and availability</p>
                </div>

                <button className="add-inventory-btn">
                    <Plus size={18} />
                    Add Medicine
                </button>
            </div>

            {/* Summary Cards */}
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

            {/* Inventory Card */}
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

                {/* Table */}
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
                                                    item.status ===
                                                    "Available"
                                                        ? "available"
                                                        : item.status ===
                                                          "Low Stock"
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

        </div>
    );
}

export default Inventory;

