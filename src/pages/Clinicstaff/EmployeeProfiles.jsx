import { useState } from "react";
import {
    Search,
    Users,
    Eye,
    User,
    BriefcaseMedical,
    Mail,
    Phone,
    X,
} from "lucide-react";

import "../../styles/EmployeeProfiles.css";

function EmployeeProfiles() {
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Sample employee data
    const employees = [
        {
            id: "EMP-001",
            name: "Maria Santos",
            position: "Clinic Nurse",
            department: "Clinic",
            email: "maria.santos@example.com",
            contact: "09XXXXXXXXX",
            status: "Active",
        },
        {
            id: "EMP-002",
            name: "Juan Dela Cruz",
            position: "Clinic Staff",
            department: "Clinic",
            email: "juan.delacruz@example.com",
            contact: "09XXXXXXXXX",
            status: "Active",
        },
        {
            id: "EMP-003",
            name: "Angela Reyes",
            position: "Administrator",
            department: "Administration",
            email: "angela.reyes@example.com",
            contact: "09XXXXXXXXX",
            status: "Active",
        },
        {
            id: "EMP-004",
            name: "Robert Garcia",
            position: "Medical Officer",
            department: "Clinic",
            email: "robert.garcia@example.com",
            contact: "09XXXXXXXXX",
            status: "Inactive",
        },
    ];

    const filteredEmployees = employees.filter((employee) =>
        `${employee.name} ${employee.id} ${employee.position} ${employee.department}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const activeEmployees = employees.filter(
        (employee) => employee.status === "Active"
    ).length;

    return (
        <div className="employee-profiles-page">
            {/* PAGE HEADER */}
            <div className="employee-page-header">
                <div>
                    <span className="employee-eyebrow">
                        CLINIC MANAGEMENT SYSTEM
                    </span>

                    <h1>Employee Profiles</h1>

                    <p>
                        View and manage employee information and contact
                        details.
                    </p>
                </div>

                <div className="employee-header-icon">
                    <Users size={27} />
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="employee-summary-grid">
                <div className="employee-summary-card">
                    <div className="employee-summary-icon blue">
                        <Users size={23} />
                    </div>

                    <div>
                        <p>Total Employees</p>
                        <h2>{employees.length}</h2>
                        <span>Registered employees</span>
                    </div>
                </div>

                <div className="employee-summary-card">
                    <div className="employee-summary-icon green">
                        <BriefcaseMedical size={23} />
                    </div>

                    <div>
                        <p>Active Employees</p>
                        <h2>{activeEmployees}</h2>
                        <span>Currently active</span>
                    </div>
                </div>
            </div>

            {/* SEARCH */}
            <div className="employee-search-card">
                <div className="employee-search-box">
                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search employee name, ID, position..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <span className="employee-count">
                    {filteredEmployees.length} Employees
                </span>
            </div>

            {/* EMPLOYEE TABLE */}
            <div className="employee-table-card">
                <div className="employee-table-heading">
                    <div>
                        <h2>Employee Directory</h2>
                        <p>
                            Select an employee to view their profile
                            information.
                        </p>
                    </div>
                </div>

                <div className="employee-table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Employee ID</th>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>
                                        <div className="employee-name-cell">
                                            <div className="employee-avatar">
                                                <User size={18} />
                                            </div>

                                            <span>{employee.name}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="employee-id">
                                            {employee.id}
                                        </span>
                                    </td>

                                    <td>{employee.position}</td>

                                    <td>{employee.department}</td>

                                    <td>
                                        <span
                                            className={`employee-status ${
                                                employee.status === "Active"
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {employee.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="employee-view-button"
                                            onClick={() =>
                                                setSelectedEmployee(employee)
                                            }
                                        >
                                            <Eye size={16} />
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredEmployees.length === 0 && (
                    <div className="employee-empty-state">
                        <Users size={38} />

                        <h3>No employees found</h3>

                        <p>
                            Try searching with another name, employee ID,
                            or position.
                        </p>
                    </div>
                )}
            </div>

            {/* EMPLOYEE PROFILE MODAL */}
            {selectedEmployee && (
                <div
                    className="employee-modal-overlay"
                    onClick={() => setSelectedEmployee(null)}
                >
                    <div
                        className="employee-profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="employee-modal-header">
                            <div>
                                <h2>Employee Profile</h2>
                                <p>Employee information and contact details</p>
                            </div>

                            <button
                                className="employee-modal-close"
                                onClick={() => setSelectedEmployee(null)}
                                aria-label="Close employee profile"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="employee-modal-body">
                            <div className="employee-profile-heading">
                                <div className="employee-profile-avatar">
                                    <User size={30} />
                                </div>

                                <div>
                                    <h3>{selectedEmployee.name}</h3>
                                    <p>{selectedEmployee.position}</p>

                                    <span
                                        className={`employee-status ${
                                            selectedEmployee.status === "Active"
                                                ? "active"
                                                : "inactive"
                                        }`}
                                    >
                                        {selectedEmployee.status}
                                    </span>
                                </div>
                            </div>

                            <div className="employee-details-section">
                                <h4>Basic Information</h4>

                                <div className="employee-details-grid">
                                    <div className="employee-detail-item">
                                        <span>Employee ID</span>
                                        <strong>{selectedEmployee.id}</strong>
                                    </div>

                                    <div className="employee-detail-item">
                                        <span>Position</span>
                                        <strong>
                                            {selectedEmployee.position}
                                        </strong>
                                    </div>

                                    <div className="employee-detail-item">
                                        <span>Department</span>
                                        <strong>
                                            {selectedEmployee.department}
                                        </strong>
                                    </div>

                                    <div className="employee-detail-item">
                                        <span>Status</span>
                                        <strong>{selectedEmployee.status}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="employee-details-section">
                                <h4>Contact Information</h4>

                                <div className="employee-contact-item">
                                    <Mail size={18} />

                                    <div>
                                        <span>Email Address</span>
                                        <strong>{selectedEmployee.email}</strong>
                                    </div>
                                </div>

                                <div className="employee-contact-item">
                                    <Phone size={18} />

                                    <div>
                                        <span>Contact Number</span>
                                        <strong>{selectedEmployee.contact}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="employee-modal-footer">
                            <button
                                className="employee-close-button"
                                onClick={() => setSelectedEmployee(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployeeProfiles;