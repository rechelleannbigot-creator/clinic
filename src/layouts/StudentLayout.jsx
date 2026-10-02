
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
    ClipboardList,
    UserCircle
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
        if (window.innerWidth <= 700) {
            setSidebarOpen(false);
        }
    };

    return (
        <div
            className={`student-layout ${
                sidebarOpen ? "sidebar-open" : "sidebar-closed"
            }`}
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="student-header">

                <div className="student-header-left">

                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>

                    <div className="student-title">

                        <img
                            src={logo}
                            alt="LCCI Logo"
                        />

                        <div>
                            <h2>
                                Clinic Management System
                            </h2>

                            <span>
                                Student Health Services
                            </span>
                        </div>

                    </div>

                </div>


                {/* USER AREA */}

                <div className="student-user">

                    <div className="student-user-info">

                        <span>
                            {user?.name ||
                                user?.displayName ||
                                "Student"}
                        </span>

                        <small>
                            Student
                        </small>

                    </div>

                    <div className="student-avatar">
                        {(
                            user?.name ||
                            user?.displayName ||
                            "S"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={16} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </header>


            {/* =====================================================
                MOBILE OVERLAY
            ===================================================== */}

            <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
            ></div>


            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="sidebar">

                {/* BRAND */}

                <div className="sidebar-brand">

                    <div className="sidebar-brand-icon">
                        <HeartPulse size={20} />
                    </div>

                    <div className="sidebar-brand-text">

                        <strong>
                            Student Portal
                        </strong>

                        <span>
                            Health & Wellness
                        </span>

                    </div>

                </div>


                {/* =================================================
                    MAIN MENU
                ================================================= */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        Main Menu
                    </div>


                    {/* Dashboard */}

                    <NavLink
                        to="/student/dashboard"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <LayoutDashboard size={18} />
                        </span>

                        <span className="nav-text">
                            Dashboard
                        </span>
                    </NavLink>


                    {/* My Medical Records */}

                    <NavLink
                        to="/student/medical-records"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <FileText size={18} />
                        </span>

                        <span className="nav-text">
                            Medical Records
                        </span>
                    </NavLink>


                    {/* My Consultations */}

                    <NavLink
                        to="/student/my-consultation"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <Stethoscope size={18} />
                        </span>

                        <span className="nav-text">
                            My Consultations
                        </span>
                    </NavLink>

                </div>


                {/* =================================================
                    HEALTH SERVICES
                ================================================= */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        Health Services
                    </div>


                    {/* Book Consultation */}

                    <NavLink
                        to="/student/book-consultation"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <CalendarPlus size={18} />
                        </span>

                        <span className="nav-text">
                            Book Consultation
                        </span>
                    </NavLink>


                    {/* Medicine */}

                    <NavLink
                        to="/student/my-medicine"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <Pill size={18} />
                        </span>

                        <span className="nav-text">
                            My Medicine
                        </span>
                    </NavLink>

                </div>


                {/* =================================================
                    ACCOUNT
                ================================================= */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        Account
                    </div>


                    {/* Medical Profile */}

                    <NavLink
                        to="/student/medical-profile"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <UserRound size={18} />
                        </span>

                        <span className="nav-text">
                            Medical Profile
                        </span>
                    </NavLink>


                    {/* Notifications */}

                    <NavLink
                        to="/student/notifications"
                        onClick={closeSidebarOnMobile}
                        className={({ isActive }) =>
                            `nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="nav-icon">
                            <Bell size={18} />
                        </span>

                        <span className="nav-text">
                            Notifications
                        </span>
                    </NavLink>

                </div>


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

                <div className="sidebar-bottom">

                    <div className="sidebar-profile">

                        <div className="sidebar-profile-avatar">
                            {(
                                user?.name ||
                                user?.displayName ||
                                "S"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="sidebar-profile-info">

                            <strong>
                                {user?.name ||
                                    user?.displayName ||
                                    "Student"}
                            </strong>

                            <span>
                                Student Account
                            </span>

                        </div>

                    </div>

                </div>

            </aside>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="content">
                <Outlet />
            </main>

        </div>
    );
}

export default StudentLayout;

