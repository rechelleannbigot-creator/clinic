import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Stethoscope,
    FileText,
    CalendarPlus,
    Pill,
    UserRound,
    Bell,
    LogOut,
    Menu,
    X,
    HeartPulse,
} from "lucide-react";

import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/lcc-logo.jpg";

import "../styles/StudentLayout.css";

function StudentLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const closeSidebarOnMobile = () => {
        if (typeof window !== "undefined" && window.innerWidth <= 700) {
            setSidebarOpen(false);
        }
    };

    return (
        <div
            className={`student-layout ${
                sidebarOpen ? "sidebar-open" : "sidebar-closed"
            }`}
        >
            <header className="student-header">
                <div className="student-header-left">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="student-title">
                        <img src={logo} alt="LCCI Logo" />

                        <div>
                            <h2>Clinic Management System</h2>
                            <span>Student Health Services</span>
                        </div>
                    </div>
                </div>

                <div className="student-user">
                    <div className="student-user-info">
                        <span>{user?.name || user?.displayName || "Student"}</span>
                        <small>Student</small>
                    </div>

                    <div className="student-avatar">
                        {(user?.name || user?.displayName || "S")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <HeartPulse size={20} />
                    </div>

                    <div className="sidebar-brand-text">
                        <strong>Student Portal</strong>
                        <span>Health & Wellness</span>
                    </div>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Main Menu</div>

                    <NavLink
                        to="/student/dashboard"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon">
                            <LayoutDashboard size={18} />
                        </span>

                        <span className="nav-text">Dashboard</span>
                    </NavLink>
                </div>

                <div className="sidebar-section">
                    <div className="sidebar-section-title">Health Services</div>

                    <NavLink
                        to="/student/medical-profile"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon">
                            <UserRound size={18} />
                        </span>

                        <span className="nav-text">Medical Profile</span>
                    </NavLink>
                </div>

                    <div className="sidebar-section">
                    <div className="sidebar-section-title">notification</div>

                    <NavLink
                        to="/student/notifications"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="nav-icon">
                            <Bell size={18} />
                        </span>

                        <span className="nav-text">Notifications</span>
                    </NavLink>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default StudentLayout;