import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/StaffLayout.css";

import logo from "../assets/lcc-logo.jpg";

import {
  Menu,
  LayoutDashboard,
  UserPlus,
  FileText,
  GraduationCap,
  Users,
  Stethoscope,
  History,
  Package,
  Bell,
  UserCircle,
} from "lucide-react";

function StaffLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  // Close sidebar on mobile after clicking a link
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 700) {
      setSidebarOpen(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`staff-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="staff-header">

        {/* LEFT SIDE OF HEADER */}
        <div className="staff-header-left">

          {/* Sidebar Toggle */}
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={
              sidebarOpen ? "Close sidebar" : "Open sidebar"
            }
            title={
              sidebarOpen ? "Close sidebar" : "Open sidebar"
            }
          >
            <Menu size={22} />
          </button>

          {/* Application Title */}
          <div className="staff-title">
            <img
              src={logo}
              alt="Clinic Management System"
              className="staff-logo"
            />

            <h2>Clinic Management System</h2>
          </div>
        </div>

        {/* =====================================================
            STAFF USER
        ===================================================== */}
        <div className="staff-user">

          <span
            title={`${user?.firstName || ""} ${
              user?.lastName || ""
            }`}
          >
            {user?.firstName} {user?.lastName}
          </span>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* =====================================================
          STAFF BODY
      ===================================================== */}
      <div className="staff-body">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}
        <aside className="sidebar">

          {/* =================================================
              MAIN
          ================================================= */}
          <div className="sidebar-section">

            <div className="sidebar-section-title">
              MAIN
            </div>

            {/* Dashboard */}
            <NavLink
              to="/staff"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
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

          {/* =================================================
              PATIENT RECORDS
          ================================================= */}
          <div className="sidebar-section">

            <div className="sidebar-section-title">
              PATIENT RECORDS
            </div>

            {/* Add Patient */}
            <NavLink
              to="add-patient"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Add Patient"
            >
              <span className="nav-icon">
                <UserPlus size={18} />
              </span>

              <span className="nav-text">
                Add Patient
              </span>
            </NavLink>

            {/* Medical Records */}
            <NavLink
              to="medical-records"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Medical Records"
            >
              <span className="nav-icon">
                <FileText size={18} />
              </span>

              <span className="nav-text">
                Medical Records
              </span>
            </NavLink>

            {/* Student Medical Profile */}
            <NavLink
              to="student-medical-profile"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Student Medical Profile"
            >
              <span className="nav-icon">
                <GraduationCap size={18} />
              </span>

              <span className="nav-text">
                Student Medical Profile
              </span>
            </NavLink>

            {/* Employee Profiles */}
            <NavLink
              to="employee-profiles"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Employee Profiles"
            >
              <span className="nav-icon">
                <Users size={18} />
              </span>

              <span className="nav-text">
                Employee Profiles
              </span>
            </NavLink>
          </div>

          {/* =================================================
              CONSULTATIONS & VISITS
          ================================================= */}
          <div className="sidebar-section">

            <div className="sidebar-section-title">
              CONSULTATIONS & VISITS
            </div>

            {/* New Consultation */}
            <NavLink
              to="new-consultation"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="New Consultation"
            >
              <span className="nav-icon">
                <Stethoscope size={18} />
              </span>

              <span className="nav-text">
                New Consultation
              </span>
            </NavLink>

            {/* Visit History */}
            <NavLink
              to="visit-history"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Visit History"
            >
              <span className="nav-icon">
                <History size={18} />
              </span>

              <span className="nav-text">
                Visit History
              </span>
            </NavLink>
          </div>

          {/* =================================================
              INVENTORY
          ================================================= */}
          <div className="sidebar-section">

            <div className="sidebar-section-title">
              INVENTORY
            </div>

            {/* Manage Inventory */}
            <NavLink
              to="inventory"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Manage Inventory"
            >
              <span className="nav-icon">
                <Package size={18} />
              </span>

              <span className="nav-text">
                Manage Inventory
              </span>
            </NavLink>
          </div>

          {/* =================================================
              REPORTS / ACCOUNT
          ================================================= */}
          <div className="sidebar-section">

            <div className="sidebar-section-title">
              REPORTS & ACCOUNT
            </div>

            {/* Notifications */}
            <NavLink
              to="notifications"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="Notifications"
            >
              <span className="nav-icon">
                <Bell size={18} />
              </span>

              <span className="nav-text">
                Notifications
              </span>
            </NavLink>

            {/* My Profile */}
            <NavLink
              to="profile"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
              title="My Profile"
            >
              <span className="nav-icon">
                <UserCircle size={18} />
              </span>

              <span className="nav-text">
                My Profile
              </span>
            </NavLink>
          </div>
        </aside>

        {/* =====================================================
            MOBILE OVERLAY
        ===================================================== */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleSidebar}
          />
        )}

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;