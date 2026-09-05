import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";

import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/AdminLayout.css";
import logo from "../assets/lcc-logo.jpg";

import {
    Menu,
    LayoutDashboard,
    Users,
    UserRoundSearch,
    Stethoscope,
    Pill,
    ClipboardList,
    FileText,
    Bell,
    BarChart3,
    User,
    LogOut,
} from "lucide-react";


function AdminLayout() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(true);


    // =========================================
    // SIDEBAR TOGGLE
    // =========================================

    const toggleSidebar = () => {
        setSidebarOpen((previous) => !previous);
    };


    // =========================================
    // CLOSE SIDEBAR ON MOBILE
    // =========================================

    const closeSidebarOnMobile = () => {
        if (window.innerWidth <= 700) {
            setSidebarOpen(false);
        }
    };


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };


    // =========================================
    // NAVIGATION CLASS
    // =========================================

    const navClass = ({ isActive }) =>
        isActive
            ? "nav-link active"
            : "nav-link";


    return (

        <div
            className={`admin-layout ${
                sidebarOpen
                    ? "sidebar-open"
                    : "sidebar-closed"
            }`}
        >

            {/* =====================================
                HEADER
            ====================================== */}

            <header className="admin-header">

                <div className="admin-header-left">

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


                    {/* Logo + Application Name */}

                    <div className="admin-title">

                        <img
                            src={logo}
                            alt="Clinic Management System"
                            className="admin-logo"
                        />

                        <div>

                            <h2>
                                Clinic Management System
                            </h2>

                            <span>
                                Administrator Portal
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================
                    ADMIN USER
                ================================== */}

                <div className="admin-user">

                    <div className="admin-user-info">

                        <span>
                            {user?.firstName || "Admin"}{" "}
                            {user?.lastName || ""}
                        </span>

                        <small>
                            Administrator
                        </small>

                    </div>


                    {/* Avatar */}

                    <div className="admin-avatar">

                        {user?.firstName?.charAt(0) || "A"}

                    </div>


                    {/* Logout */}

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={17} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </header>


            {/* =====================================
                BODY
            ====================================== */}

            <div className="admin-body">


                {/* =================================
                    SIDEBAR
                ================================== */}

                <aside className="sidebar">


                    {/* =================================
                        MAIN
                    ================================== */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            MAIN
                        </div>


                        <NavLink
                            to="/admin"
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


                    {/* =================================
                        SYSTEM MANAGEMENT
                    ================================== */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            SYSTEM MANAGEMENT
                        </div>


                        <NavLink
                            to="manage-users"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="User Management"
                        >

                            <span className="nav-icon">
                                <Users size={18} />
                            </span>

                            <span className="nav-text">
                                User Management
                            </span>

                        </NavLink>


                        <NavLink
                            to="patients-management"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Patients Management"
                        >

                            <span className="nav-icon">
                                <UserRoundSearch size={18} />
                            </span>

                            <span className="nav-text">
                                Patients Management
                            </span>

                        </NavLink>

                    </div>


                    {/* =================================
                        CLINIC DATA
                    ================================== */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            CLINIC DATA
                        </div>


                        <NavLink
                            to="consultations"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Consultations"
                        >

                            <span className="nav-icon">
                                <Stethoscope size={18} />
                            </span>

                            <span className="nav-text">
                                Consultations
                            </span>

                        </NavLink>


                        <NavLink
                            to="medicine-inventory"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Medicine Inventory"
                        >

                            <span className="nav-icon">
                                <Pill size={18} />
                            </span>

                            <span className="nav-text">
                                Medicine Inventory
                            </span>

                        </NavLink>


                        <NavLink
                            to="medicine-issuance"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Medicine Issuance"
                        >

                            <span className="nav-icon">
                                <ClipboardList size={18} />
                            </span>

                            <span className="nav-text">
                                Medicine Issuance
                            </span>

                        </NavLink>

                    </div>


                    {/* =================================
                        REPORTS & MONITORING
                    ================================== */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            REPORTS & MONITORING
                        </div>


                        <NavLink
                            to="reports"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Reports"
                        >

                            <span className="nav-icon">
                                <FileText size={18} />
                            </span>

                            <span className="nav-text">
                                Reports
                            </span>

                        </NavLink>


                        <NavLink
                            to="notifications"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Notifications"
                        >

                            <span className="nav-icon">
                                <Bell size={18} />
                            </span>

                            <span className="nav-text">
                                Notifications
                            </span>

                        </NavLink>


                        <NavLink
                            to="analytics"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="Analytics"
                        >

                            <span className="nav-icon">
                                <BarChart3 size={18} />
                            </span>

                            <span className="nav-text">
                                Analytics
                            </span>

                        </NavLink>

                    </div>


                    {/* =================================
                        SYSTEM SETTINGS
                    ================================== */}

                    <div className="sidebar-section">

                        <div className="sidebar-section-title">
                            SYSTEM SETTINGS
                        </div>


                        <NavLink
                            to="my-profile"
                            onClick={closeSidebarOnMobile}
                            className={navClass}
                            title="My Profile"
                        >

                            <span className="nav-icon">
                                <User size={18} />
                            </span>

                            <span className="nav-text">
                                My Profile
                            </span>

                        </NavLink>

                    </div>

                </aside>


                {/* =================================
                    MOBILE OVERLAY
                ================================== */}

                {sidebarOpen && (

                    <div
                        className="sidebar-overlay"
                        onClick={toggleSidebar}
                    />

                )}


                {/* =================================
                    MAIN CONTENT
                ================================== */}

                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}


export default AdminLayout;
