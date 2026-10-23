
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  X,
  CalendarDays,
  CheckCircle,
  Clock,
} from "lucide-react";
import "../../styles/MedicineInventory.css";

const emptyForm = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  expiry: "",
};

const initialMedicines = [
  {
    id: "MED-001",
    name: "Paracetamol",
    category: "Pain Relief",
    quantity: 150,
    unit: "Tablets",
    expiry: "2027-05-12",
  },
  {
    id: "MED-002",
    name: "Amoxicillin",
    category: "Antibiotic",
    quantity: 80,
    unit: "Capsules",
    expiry: "2027-02-20",
  },
  {
    id: "MED-003",
    name: "Ibuprofen",
    category: "Pain Relief",
    quantity: 25,
    unit: "Tablets",
    expiry: "2026-11-15",
  },
  {
    id: "MED-004",
    name: "Cetirizine",
    category: "Antihistamine",
    quantity: 0,
    unit: "Tablets",
    expiry: "2027-01-10",
  },
];

function getStockStatus(quantity) {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= 30) return "Low Stock";
  return "In Stock";
}

function getExpirationStatus(expiry) {
  if (!expiry) return "No Expiry Date";

  // Compare calendar dates in local time.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(`${expiry}T00:00:00`);

  if (Number.isNaN(expiryDate.getTime())) {
    return "Invalid Date";
  }

  if (expiryDate < today) return "Expired";

  const daysRemaining = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / 86400000
  );

  if (daysRemaining <= 90) return "Expiring Soon";

  return "Valid";
}

function formatDate(date) {
  if (!date) return "Not set";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function MedicineInventory() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState(initialMedicines);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const filteredMedicines = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return medicines.filter((medicine) =>
      [
        medicine.id,
        medicine.name,
        medicine.category,
        medicine.unit,
        medicine.expiry,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [medicines, search]);

  const expiredCount = medicines.filter(
    (medicine) => getExpirationStatus(medicine.expiry) === "Expired"
  ).length;

  const expiringSoonCount = medicines.filter(
    (medicine) =>
      getExpirationStatus(medicine.expiry) === "Expiring Soon"
  ).length;

  const inStockCount = medicines.filter(
    (medicine) =>
      medicine.quantity > 30 &&
      getExpirationStatus(medicine.expiry) !== "Expired"
  ).length;

  const lowStockCount = medicines.filter(
    (medicine) =>
      medicine.quantity > 0 &&
      medicine.quantity <= 30
  ).length;

  const outOfStockCount = medicines.filter(
    (medicine) => medicine.quantity === 0
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (medicine) => {
    setEditingId(medicine.id);
    setForm({
      name: medicine.name,
      category: medicine.category,
      quantity: String(medicine.quantity),
      unit: medicine.unit,
      expiry: medicine.expiry,
    });
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const quantity = Number(form.quantity);

    if (
      !form.name.trim() ||
      !form.category ||
      !form.unit ||
      !form.expiry ||
      form.quantity === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError("Please complete all fields using valid values.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(`${form.expiry}T00:00:00`);

    if (
      Number.isNaN(expiryDate.getTime()) ||
      expiryDate < today
    ) {
      setError(
        "The expiration date has already passed. Please enter a valid date."
      );
      return;
    }

    const normalizedMedicine = {
      name: form.name.trim(),
      category: form.category,
      quantity,
      unit: form.unit,
      expiry: form.expiry,
    };

    if (editingId) {
      setMedicines((previous) =>
        previous.map((medicine) =>
          medicine.id === editingId
            ? { ...medicine, ...normalizedMedicine }
            : medicine
        )
      );
    } else {
      const nextNumber =
        medicines.reduce((maximum, medicine) => {
          const match = medicine.id.match(/^MED-(\d+)$/);
          return match
            ? Math.max(maximum, Number(match[1]))
            : maximum;
        }, 0) + 1;

      const newMedicine = {
        id: `MED-${String(nextNumber).padStart(3, "0")}`,
        ...normalizedMedicine,
      };

      setMedicines((previous) => [...previous, newMedicine]);
    }

    closeModal();
  };

  const deleteMedicine = (id) => {
    const medicine = medicines.find((item) => item.id === id);

    if (!medicine) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${medicine.name} (${medicine.id})?`
    );

    if (confirmed) {
      setMedicines((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  return (
    <div className="medicine-page">
      {/* Page Header */}
      <div className="medicine-header">
        <div>
          <h1>Medicine Inventory</h1>
          <p>
            Manage medicine stocks, expiration dates, and inventory records.
          </p>
        </div>

        <button
          type="button"
          className="add-medicine-btn"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      {/* Inventory Statistics */}
      <div className="medicine-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={23} />
          </div>
          <div>
            <span>Total Medicines</span>
            <strong>{medicines.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={23} />
          </div>
          <div>
            <span>In Stock</span>
            <strong>{inStockCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <AlertTriangle size={23} />
          </div>
          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <Package size={23} />
          </div>
          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={23} />
          </div>
          <div>
            <span>Expired</span>
            <strong>{expiredCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={23} />
          </div>
          <div>
            <span>Expiring Soon</span>
            <strong>{expiringSoonCount}</strong>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="medicine-card">
        <div className="medicine-card-header">
          <div>
            <h2>Medicine List</h2>
            <p>
              Edit medicine details, monitor expiration, and manage stock.
            </p>
          </div>

          <div className="medicine-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search medicine..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicine ID</th>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Expiration Date</th>
                <th>Expiration Status</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine.quantity);
                  const expirationStatus = getExpirationStatus(
                    medicine.expiry
                  );

                  return (
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

                      <td>
                        <span className="expiry-date">
                          <CalendarDays size={15} />
                          {formatDate(medicine.expiry)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`expiration-status ${expirationStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {expirationStatus === "Expired" && (
                            <AlertTriangle size={14} />
                          )}
                          {expirationStatus === "Expiring Soon" && (
                            <Clock size={14} />
                          )}
                          {expirationStatus === "Valid" && (
                            <CheckCircle size={14} />
                          )}
                          {expirationStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status ${stockStatus
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {stockStatus}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-btn"
                            title="Edit medicine"
                            aria-label={`Edit ${medicine.name}`}
                            onClick={() => openEditModal(medicine)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            title="Delete medicine"
                            aria-label={`Delete ${medicine.name}`}
                            onClick={() => deleteMedicine(medicine.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="empty-message">
                    <Package size={28} />
                    <span>No medicines found.</span>
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                    >
                      Clear Search
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="medicine-table-footer">
          Showing {filteredMedicines.length} of {medicines.length} medicines
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="medicine-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="medicine-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 id="medicine-modal-title">
                  {editingId ? "Edit Medicine" : "Add Medicine"}
                </h2>
                <p>
                  {editingId
                    ? `Update inventory details for ${editingId}.`
                    : "Enter the details of the new medicine."}
                </p>
              </div>

              <button
                type="button"
                className="close-modal"
                aria-label="Close form"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="medicine-form-error" role="alert">
                  <AlertTriangle size={17} />
                  {error}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="medicine-name">Medicine Name</label>
                  <input
                    id="medicine-name"
                    name="name"
                    type="text"
                    placeholder="Enter medicine name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="medicine-category">Category</label>
                  <select
                    id="medicine-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option>Pain Relief</option>
                    <option>Antibiotic</option>
                    <option>Antihistamine</option>
                    <option>Vitamins</option>
                    <option>Gastrointestinal</option>
                    <option>First Aid</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="medicine-quantity">Quantity</label>
                  <input
                    id="medicine-quantity"
                    name="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    min="0"
                    step="1"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="medicine-unit">Unit</label>
                  <select
                    id="medicine-unit"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select unit</option>
                    <option>Tablets</option>
                    <option>Capsules</option>
                    <option>Bottles</option>
                    <option>Boxes</option>
                    <option>Vials</option>
                    <option>Sachets</option>
                    <option>Tubes</option>
                    <option>Pieces</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="medicine-expiry">
                    Expiration Date
                  </label>
                  <input
                    id="medicine-expiry"
                    name="expiry"
                    type="date"
                    value={form.expiry}
                    min={new Date().toLocaleDateString("en-CA")}
                    onChange={handleChange}
                    required
                  />
                  <small>
                    Medicines expiring within 90 days will be marked
                    "Expiring Soon".
                  </small>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingId ? (
                    <>
                      <CheckCircle size={17} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Medicine
                    </>
                  )}
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
