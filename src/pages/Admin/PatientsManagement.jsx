import React, { useState } from "react";
import "./PatientsManagement.css";

function PatientsManagement() {
    const [patients, setPatients] = useState([
        {
            id: "P-001",
            name: "John Doe",
            age: 32,
            gender: "Male",
            contact: "0917-123-4567",
            status: "Active",
        },
        {
            id: "P-002",
            name: "Anna Smith",
            age: 28,
            gender: "Female",
            contact: "0918-234-5678",
            status: "Active",
        },
        {
            id: "P-003",
            name: "Robert Wilson",
            age: 45,
            gender: "Male",
            contact: "0919-345-6789",
            status: "Inactive",
        },
        {
            id: "P-004",
            name: "Emily Brown",
            age: 36,
            gender: "Female",
            contact: "0920-456-7890",
            status: "Active",
        },
    ]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        gender: "Male",
        contact: "",
        status: "Active",
    });

    // Search patients
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.id.toLowerCase().includes(search.toLowerCase()) ||
        patient.contact.includes(search)
    );

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewPatient({
            ...newPatient,
            [name]: value,
        });
    };

    // Add patient
    const handleAddPatient = (e) => {
        e.preventDefault();

        if (!newPatient.name || !newPatient.age || !newPatient.contact) {
            alert("Please fill in all required fields.");
            return;
        }

        const newId = `P-${String(patients.length + 1).padStart(3, "0")}`;

        const patient = {
            id: newId,
            name: newPatient.name,
            age: Number(newPatient.age),
            gender: newPatient.gender,
            contact: newPatient.contact,
            status: newPatient.status,
        };

        setPatients([...patients, patient]);

        setNewPatient({
            name: "",
            age: "",
            gender: "Male",
            contact: "",
            status: "Active",
        });

        setShowModal(false);
    };

    // Delete patient
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmDelete) {
            return;
        }

        setPatients(patients.filter((patient) => patient.id !== id));
    };

    return (
        <div className="patients-page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Patients Management</h1>
                    <p>Manage and monitor registered patients.</p>
                </div>

                <button
                    className="add-patient-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Patient
                </button>
            </div>

            {/* Statistics */}
            <div className="patient-stats">

                <div className="patient-stat-card">
                    <div className="stat-icon blue">
                        👥
                    </div>

                    <div>
                        <span>Total Patients</span>
                        <h2>{patients.length}</h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>Active Patients</span>
                        <h2>
                            {
                                patients.filter(
                                    (patient) => patient.status === "Active"
                                ).length
                            }
                        </h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="stat-icon orange">
                        !
                    </div>

                    <div>
                        <span>Inactive Patients</span>
                        <h2>
                            {
                                patients.filter(
                                    (patient) => patient.status === "Inactive"
                                ).length
                            }
                        </h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="stat-icon purple">
                        +
                    </div>

                    <div>
                        <span>New This Month</span>
                        <h2>24</h2>
                    </div>
                </div>

            </div>

            {/* Patient Table */}
            <div className="patients-card">

                <div className="patients-card-header">

                    <div>
                        <h2>Patient List</h2>
                        <p>View and manage all registered patients.</p>
                    </div>

                    <div className="search-box">
                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>

                <div className="table-wrapper">

                    <table className="patients-table">

                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Patient Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id}>

                                        <td>
                                            <strong className="patient-id">
                                                {patient.id}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="patient-info">
                                                <div className="patient-avatar">
                                                    {patient.name
                                                        .split(" ")
                                                        .map((word) => word[0])
                                                        .join("")
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </div>

                                                <span>{patient.name}</span>
                                            </div>
                                        </td>

                                        <td>{patient.age}</td>

                                        <td>{patient.gender}</td>

                                        <td>{patient.contact}</td>

                                        <td>
                                            <span
                                                className={`patient-status ${
                                                    patient.status === "Active"
                                                        ? "active"
                                                        : "inactive"
                                                }`}
                                            >
                                                {patient.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="action-btn view"
                                                    title="View"
                                                >
                                                    👁
                                                </button>

                                                <button
                                                    className="action-btn edit"
                                                    title="Edit"
                                                >
                                                    ✎
                                                </button>

                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                    onClick={() =>
                                                        handleDelete(patient.id)
                                                    }
                                                >
                                                    🗑
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="no-patients"
                                    >
                                        No patients found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Table Footer */}
                <div className="table-footer">
                    <span>
                        Showing {filteredPatients.length} of {patients.length} patients
                    </span>

                    <div className="pagination">
                        <button>‹</button>
                        <button className="page-active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>›</button>
                    </div>
                </div>

            </div>

            {/* Add Patient Modal */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="patient-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="modal-header">
                            <div>
                                <h2>Add New Patient</h2>
                                <p>Enter the patient's information below.</p>
                            </div>

                            <button
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAddPatient}>

                            <div className="form-group">
                                <label>
                                    Patient Name <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter patient name"
                                    value={newPatient.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Age <span>*</span>
                                    </label>

                                    <input
                                        type="number"
                                        name="age"
                                        placeholder="Age"
                                        value={newPatient.age}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>

                                    <select
                                        name="gender"
                                        value={newPatient.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>
                                    </select>
                                </div>

                            </div>

                            <div className="form-group">
                                <label>
                                    Contact Number <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="09XX-XXX-XXXX"
                                    value={newPatient.contact}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Status</label>

                                <select
                                    name="status"
                                    value={newPatient.status}
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

export default PatientsManagement;