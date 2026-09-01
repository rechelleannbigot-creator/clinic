
import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import "./ManageUser.css";

function ManageUser() {
    const [searchTerm, setSearchTerm] = useState("");

    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Juan Dela Cruz",
            email: "juan@gmail.com",
            role: "Clinic Staff",
            status: "Active",
        },
        {
            id: 2,
            name: "Maria Santos",
            email: "maria@gmail.com",
            role: "Administrator",
            status: "Active",
        },
        {
            id: 3,
            name: "Pedro Garcia",
            email: "pedro@gmail.com",
            role: "Clinic Staff",
            status: "Inactive",
        },
    ]);

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

                <button className="add-user-btn">
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select className="filter-select">
                        <option value="">All Roles</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Clinic Staff">Clinic Staff</option>
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
                                                className={`status-badge ${
                                                    user.status.toLowerCase()
                                                }`}
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
        </div>
    );
}

export default ManageUser;

