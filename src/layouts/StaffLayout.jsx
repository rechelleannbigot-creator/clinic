import { useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/StaffLayout.css";

import logo from "../assets/lcc-logo.jpg";

import { Menu, LayoutDashboard } from "lucide-react";

function StaffLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // State to manage the sidebar's open/closed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle the sidebar open/closed state
  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };
  // Close the sidebar on mobile devices when a link is clicked
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 700) {
      setSidebarOpen(false);
    }
  };


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
      // Apply different classes based on the sidebar's state
      className={`staff-layout ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* HEADER */}
      <header className="staff-header">
        <div className="staff-header-left">
          {/* Sidebar Toggle */}
          <button
            type="button" //type attribute specifies the button's behavior
            className="sidebar-toggle" //className attribute assigns a CSS class for styling
            onClick={toggleSidebar} //onClick attribute specifies the function to be called when the button is clicked
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"} //aria-label attribute provides an accessible label for screen readers
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"} //title attribute provides a tooltip when hovering over the button
          >
            <Menu size={22} />
          </button>

          {/* Application Title */}
          <div className="staff-title">
            <img src={logo} alt="Clinic Management System" className="staff-logo" />
            <h2>Clinic Management System</h2>
          </div> 
        </div>

        {/* Staff User */}
        <div className="staff-user">
          <span title={`${user?.firstName} ${user?.lastName}`}>
            {user?.firstName} {user?.lastName}
          </span>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>


            {/* STAFF BODY */}
      <div className="staff-body">
        {/* SIDEBAR */}
        <aside className="sidebar">
          
          {/* MAIN */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">MAIN</div>

            <NavLink
              to="/staff"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Dashboard"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">QUICK ACTIONS</div>

            <NavLink
              to="scan-qr-code"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Scan QR Code"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Scan QR Code</span>
            </NavLink>


            <NavLink
              to="new-consultation"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="New Consultation"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">New Consultation</span>
            </NavLink>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">QUICK ACTIONS</div>

           <NavLink
              to="Patients"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Patients"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Patients</span>
            </NavLink>

            <NavLink
              to="medical-records"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Medical Records"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Medical Records</span>
            </NavLink>

            <NavLink
              to="consultation"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Consultation"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Consultation</span>
            </NavLink>
            </div>

            {/* Medicine */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">MEDICINE</div>

           <NavLink
              to="inventory"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Inventory"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Inventory</span>
            </NavLink>

            <NavLink
              to="issuance"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Issuance"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Issuance</span>
            </NavLink>
            </div>

            {/* Reports */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">REPORTS</div>

           <NavLink
              to="staff-reports"
              end
              onClick={closeSidebarOnMobile}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              title="Staff Reports"
            >
              <span className="nav-icon">
                <LayoutDashboard size={18} />
              </span>
              <span className="nav-text">Staff Reports</span>
            </NavLink>
            </div>

          </aside>

          {/* MOBILE OVERLAY - this overlay is displayed on mobile devices when the sidebar is open. Clicking on it will close the sidebar. */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar} />
        )}

        {/* MAIN CONTENT - this is where the main content of the admin dashboard will be rendered. The Outlet component is used to render the matched child route components.*/}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StaffLayout;



