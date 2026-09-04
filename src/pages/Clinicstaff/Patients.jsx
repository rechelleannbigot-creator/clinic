import { useState } from "react";
import {
    Search,
    UserPlus,
    Eye,
    Pencil,
    Users,
    UserCheck,
    Clock,
} from "lucide-react";
import "../../styles/Patients.css";

function Patients() {
    const [search, setSearch] = useState("");

    const patients = [
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
    ];

    const filteredPatients = patients.filter((patient) =>
        `${patient.id} ${patient.name} ${patient.contact}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="patients-page">

            {/* Header */}
            <div className="patients-header">
                <div>
                    <h1>Patients</h1>
                    <p>Manage and view patient information.</p>
                </div>

                <button className="add-patient-btn">
                    <UserPlus size={18} />
                    Add Patient
                </button>
            </div>

            {/* Statistics */}
            <div className="patient-stats">

                <div className="patient-stat-card">
                    <div className="patient-stat-icon blue">
                        <Users size={23} />
                    </div>

                    <div>
                        <span>Total Patients</span>
                        <h2>248</h2>
                    </div>
                </div>

                <div className="patient-stat-card">
                    <div className="patient-stat-icon green">
                        <UserCheck size={23} />
                    </div>

                    <div>
                        <span>Active Patients</span>
                        <h2>214</h2>
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

            {/* Patient List */}
            <div className="patients-card">

                <div className="patients-card-header">
                    <div>
                        <h2>Patient List</h2>
                        <p>View and manage registered patients.</p>
                    </div>

                    {/* Search */}
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

                {/* Table */}
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
                                                    <strong>{patient.name}</strong>
                                                    <small>Registered Patient</small>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{patient.age}</td>

                                        <td>{patient.gender}</td>

                                        <td>{patient.contact}</td>

                                        <td>{patient.lastVisit}</td>

                                        <td>
                                            <span
                                                className={`patient-status ${
                                                    patient.status.toLowerCase()
                                                }`}
                                            >
                                                {patient.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-actions">
                                                <button
                                                    className="action-btn view"
                                                    title="View Patient"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    className="action-btn edit"
                                                    title="Edit Patient"
                                                >
                                                    <Pencil size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-patients">
                                        No patients found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="patients-footer">
                    <span>
                        Showing {filteredPatients.length} of {patients.length} patients
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
        </div>
    );
}

export default Patients;

