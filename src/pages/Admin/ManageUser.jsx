
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import "./ManageUser.css";

function ManageUser() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Rechelle Ann Bigot",
            email: "ann@gmail.com",
            role: "Clinic Staff",
            status: "Active",
        },
        
        
    ]);

    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        role: "Clinic Staff",
        status: "Active",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const handleAddUser = (e) => {
        e.preventDefault();

        if (!newUser.name || !newUser.email) {
            alert("Please fill in all required fields.");
            return;
        }

        const user = {
            id: Date.now(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
        };

        setUsers([...users, user]);

        // Reset form
        setNewUser({
            name: "",
            email: "",
            role: "Clinic Staff",
            status: "Active",
        });

        setShowModal(false);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (confirmDelete) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-user-page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Manage Users</h1>
                    <p>Manage administrator and clinic staff accounts.</p>
                </div>

                <button
                    className="add-user-btn"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* User Management Card */}
            <div className="users-card">

                {/* Search */}
                <div className="user-toolbar">

                    <div className="search-box">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <select className="filter-select">
                        <option value="">All Roles</option>
                        <option value="Administrator">
                            Administrator
                        </option>
                        <option value="Clinic Staff">
                            Clinic Staff
                        </option>
                    </select>

                    <select className="filter-select">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>

                </div>

                {/* Users Table */}
                <div className="table-container">
                    <table className="users-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>

                                        <td>
                                            <div className="user-info">

                                                <div className="user-avatar">
                                                    {user.name.charAt(0)}
                                                </div>

                                                <span>{user.name}</span>

                                            </div>
                                        </td>

                                        <td>{user.email}</td>

                                        <td>
                                            <span className="role-badge">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${user.status.toLowerCase()}`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="edit-btn"
                                                    title="Edit User"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    title="Delete User"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="no-users"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* ADD USER MODAL */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="add-user-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="modal-header">
                            <div>
                                <h2>Add New User</h2>
                                <p>Create a new administrator or clinic staff account.</p>
                            </div>

                            <button
                                className="close-modal-btn"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddUser}>

                            <div className="form-group">
                                <label>
                                    Full Name <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={newUser.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Email Address <span>*</span>
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>Role</label>

                                    <select
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Clinic Staff">
                                            Clinic Staff
                                        </option>

                                        <option value="Administrator">
                                            Administrator
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={newUser.status}
                                        onChange={handleInputChange}
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

                            {/* Modal Buttons */}
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
                                    className="save-user-btn"
                                >
                                    <Plus size={18} />
                                    Add User
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageUser;

