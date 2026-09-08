import { useState } from "react";
import {
    Search,
    UserPlus,
    Eye,
    Pencil,
    Users,
    UserCheck,
    Clock,
    X,
} from "lucide-react";
import "../../styles/Patients.css";

function Patients() {
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    // Patients data
    const [patients, setPatients] = useState([
        {
            id: "P-001",
            name: "Juan Dela Cruz",
            age: 25,
            gender: "Male",
            contact: "0917-123-4567",
            lastVisit: "Sep 02, 2026",
            status: "Active",
        },
        {
            id: "P-002",
            name: "Maria Santos",
            age: 31,
            gender: "Female",
            contact: "0918-234-5678",
            lastVisit: "Sep 01, 2026",
            status: "Active",
        },
        {
            id: "P-003",
            name: "Robert Lee",
            age: 42,
            gender: "Male",
            contact: "0919-345-6789",
            lastVisit: "Aug 30, 2026",
            status: "Active",
        },
        {
            id: "P-004",
            name: "Ana Garcia",
            age: 28,
            gender: "Female",
            contact: "0920-456-7890",
            lastVisit: "Aug 28, 2026",
            status: "Inactive",
        },
        {
            id: "P-005",
            name: "Michael Reyes",
            age: 36,
            gender: "Male",
            contact: "0921-567-8901",
            lastVisit: "Aug 25, 2026",
            status: "Active",
        },
    ]);

    // New patient form
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        contact: "",
        status: "Active",
    });

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Add new patient
    const handleAddPatient = (e) => {
        e.preventDefault();

        // Generate patient ID
        const newId = `P-${String(patients.length + 1).padStart(3, "0")}`;

        // Get today's date
        const today = new Date();

        const lastVisit = today.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        });

        const newPatient = {
            id: newId,
            name: formData.name,
            age: Number(formData.age),
            gender: formData.gender,
            contact: formData.contact,
            lastVisit: lastVisit,
            status: formData.status,
        };

        // Add patient to the list
        setPatients([...patients, newPatient]);

        // Reset form
        setFormData({
            name: "",
            age: "",
            gender: "",
            contact: "",
            status: "Active",
        });

        // Close modal
        setShowAddModal(false);
    };

    // Search
    const filteredPatients = patients.filter((patient) =>
        `${patient.id} ${patient.name} ${patient.contact}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Statistics
    const totalPatients = patients.length;

    const activePatients = patients.filter(
        (patient) => patient.status === "Active"
    ).length;

    return (
        <div className="patients-page">

            {/* =========================
                HEADER
            ========================= */}
            <div className="patients-header">
                <div>
                    <h1>Patients</h1>
                    <p>Manage and view patient information.</p>
                </div>

                {/* FUNCTIONAL ADD PATIENT BUTTON */}
                <button
                    className="add-patient-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    <UserPlus size={18} />
                    Add Patient
                </button>
            </div>

            {/* =========================
                STATISTICS
            ========================= */}
            <div className="patient-stats">

                <div className="patient-stat-card">
                    <div className="patient-stat-icon blue">
                        <Users size={23} />
                    </div>

                    <div>
                        <span>Total Patients</span>
                        <h2>{totalPatients}</h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="patient-stat-icon green">
                        <UserCheck size={23} />
                    </div>

                    <div>
                        <span>Active Patients</span>
                        <h2>{activePatients}</h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="patient-stat-icon orange">
                        <Clock size={23} />
                    </div>

                    <div>
                        <span>Today's Patients</span>
                        <h2>18</h2>
                    </div>
                </div>

            </div>

            {/* =========================
                PATIENT LIST
            ========================= */}
            <div className="patients-card">

                <div className="patients-card-header">
                    <div>
                        <h2>Patient List</h2>
                        <p>View and manage registered patients.</p>
                    </div>

                    {/* SEARCH */}
                    <div className="patient-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* =========================
                    TABLE
                ========================= */}
                <div className="patients-table-wrapper">

                    <table className="patients-table">

                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Patient</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Last Visit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id}>

                                        <td>
                                            <span className="patient-id">
                                                {patient.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-name">

                                                <div className="patient-avatar">
                                                    {patient.name
                                                        .split(" ")
                                                        .map((name) => name[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {patient.name}
                                                    </strong>

                                                    <small>
                                                        Registered Patient
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        <td>{patient.age}</td>

                                        <td>{patient.gender}</td>

                                        <td>{patient.contact}</td>

                                        <td>{patient.lastVisit}</td>

                                        <td>
                                            <span
                                                className={`patient-status ${patient.status.toLowerCase()}`}
                                            >
                                                {patient.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-actions">

                                                <button
                                                    className="action-btn view"
                                                    title="View Patient"
                                                    onClick={() =>
                                                        alert(
                                                            `Patient ID: ${patient.id}\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nContact: ${patient.contact}\nStatus: ${patient.status}`
                                                        )
                                                    }
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    className="action-btn edit"
                                                    title="Edit Patient"
                                                    onClick={() =>
                                                        alert(
                                                            `Edit Patient: ${patient.name}`
                                                        )
                                                    }
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="no-patients"
                                    >
                                        No patients found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

                {/* =========================
                    FOOTER
                ========================= */}
                <div className="patients-footer">

                    <span>
                        Showing {filteredPatients.length} of{" "}
                        {patients.length} patients
                    </span>

                    <div className="pagination">
                        <button disabled>Previous</button>
                        <button className="active-page">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>Next</button>
                    </div>

                </div>

            </div>

            {/* ==================================================
                ADD PATIENT MODAL
            ================================================== */}
            {showAddModal && (
                <div
                    className="patient-modal-overlay"
                    onClick={() => setShowAddModal(false)}
                >

                    <div
                        className="patient-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}
                        <div className="patient-modal-header">

                            <div>
                                <h2>Add New Patient</h2>
                                <p>
                                    Enter the patient's information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setShowAddModal(false)}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}
                        <form onSubmit={handleAddPatient}>

                            <div className="form-grid">

                                {/* FULL NAME */}
                                <div className="form-group full">
                                    <label>Full Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* AGE */}
                                <div className="form-group">
                                    <label>Age</label>

                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Enter age"
                                        min="1"
                                        max="120"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* GENDER */}
                                <div className="form-group">
                                    <label>Gender</label>

                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>
                                    </select>
                                </div>

                                {/* CONTACT */}
                                <div className="form-group">
                                    <label>Contact Number</label>

                                    <input
                                        type="text"
                                        name="contact"
                                        placeholder="09XX-XXX-XXXX"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* STATUS */}
                                <div className="form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>

                            </div>

                            {/* BUTTONS */}
                            <div className="patient-modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-patient-btn"
                                >
                                    <UserPlus size={18} />
                                    Add Patient
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Patients;
