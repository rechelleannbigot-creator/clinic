import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/StudentLayout.css";
import logo from "../assets/lcc-logo.jpg";

import {
    Menu,
    LayoutDashboard,
    CalendarDays,
    Stethoscope,
    FileText,
    Bell,
    User,
    LogOut,
} from "lucide-react";


function StudentLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);


    // ========================================
    // SIDEBAR TOGGLE
    // ========================================

    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
    };


    // ========================================
    // CLOSE SIDEBAR ON MOBILE
    // ========================================

    const closeSidebarOnMobile = () => {
        if (window.innerWidth <= 700) {
            setSidebarOpen(false);
        }
    };


    // ========================================
    // LOGOUT
    // ========================================

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };


    // ========================================
    // NAVIGATION LINK
    // ========================================

    const navClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";


    return (
        <div
            className={`student-layout ${
                sidebarOpen
                    ? "sidebar-open"
                    : "sidebar-closed"
            }`}
        >

            {/* ==================================
                HEADER
            ================================== */}

            <header className="student-header">

                <div className="student-header-left">

                    {/* Sidebar Toggle */}
                    <button
                        type="button"
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        aria-label={
                            sidebarOpen
                                ? "Close sidebar"
                                : "Open sidebar"
                        }
                        title={
                            sidebarOpen
                                ? "Close sidebar"
                                : "Open sidebar"
                        }
                    >
                        <Menu size={22} />
                    </button>


                    {/* Logo and Title */}
                    <div className="student-title">

                        <img
                            src={logo}
                            alt="Clinic Management System"
                            className="student-logo"
                        />

                        <div>
                            <h2>
                                Clinic Management System
                            </h2>

                            <span>
                                Student Portal
                            </span>
                        </div>

                    </div>

                </div>


                {/* Student User */}
                <div className="student-user">

                    <div className="student-user-info">

                        <span>
                            {user?.firstName || "Student"}{" "}
                            {user?.lastName || ""}
                        </span>

                        <small>
                            Student
                        </small>

                    </div>


                    <div className="student-avatar">
                        {user?.firstName?.charAt(0) || "S"}
                    </div>


                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>

                </div>

            </header>


            {/* ==================================
                BODY
            ================================== */}

            <div className="student-body">


                {/* ==================================
                    SIDEBAR
                ================================== */}

                <aside className="sidebar">


                    {/* MAIN */}
                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            MAIN
                        </div>


                        <NavLink
                            to="/student"
                            end
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Dashboard"
                        >
                            <span className="nav-icon">
                                <LayoutDashboard size={18} />
                            </span>

                            <span className="nav-text">
                                Dashboard
                            </span>
                        </NavLink>

                    </div>
                </aside>


                {/* ==================================
                    MOBILE OVERLAY
                ================================== */}

                {sidebarOpen && (
                    <div
                        className="sidebar-overlay"
                        onClick={toggleSidebar}
                    />
                )}


                {/* ==================================
                    MAIN CONTENT
                ================================== */}

                <main className="content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


export default StudentLayout;
