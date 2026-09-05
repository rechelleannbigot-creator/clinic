import {
    LayoutDashboard,
    CalendarCheck,
    FileText,
    User,
    Bell
} from "lucide-react";
import "../../styles/StudentDashboard.css";

function StudentDashboard() {
    return (
        <div className="student-dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, Student! Here's your clinic overview.</p>
                </div>

                <button className="notification-btn">
                    <Bell size={20} />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="card-icon">
                        <CalendarCheck size={26} />
                    </div>
                    <div>
                        <h3>Consultations</h3>
                        <p>0</p>
                        <span>View consultations</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">
                        <FileText size={26} />
                    </div>
                    <div>
                        <h3>Medical Records</h3>
                        <p>0</p>
                        <span>View records</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">
                        <User size={26} />
                    </div>
                    <div>
                        <h3>Profile</h3>
                        <p>Active</p>
                        <span>Manage profile</span>
                    </div>
                </div>

            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2>Quick Actions</h2>

                <div className="quick-actions">

                    <button className="action-card">
                        <CalendarCheck size={24} />
                        <div>
                            <strong>Request Consultation</strong>
                            <span>Book a clinic consultation</span>
                        </div>
                    </button>

                    <button className="action-card">
                        <FileText size={24} />
                        <div>
                            <strong>Medical Records</strong>
                            <span>View your medical history</span>
                        </div>
                    </button>

                    <button className="action-card">
                        <User size={24} />
                        <div>
                            <strong>My Profile</strong>
                            <span>Update your information</span>
                        </div>
                    </button>

                </div>
            </div>

            {/* Welcome Panel */}
            <div className="welcome-panel">
                <div>
                    <h2>Welcome to the Clinic Management System</h2>
                    <p>
                        Manage your consultations, medical records, and
                        personal information from your student dashboard.
                    </p>
                </div>

                <LayoutDashboard size={55} />
            </div>

        </div>
    );
}

export default StudentDashboard;
