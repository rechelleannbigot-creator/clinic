
import {
    Users,
    Stethoscope,
    FileText,
    CalendarCheck,
    Activity,
    ArrowUpRight,
} from "lucide-react";
import "../../styles/StaffDashboard.css";

function StaffDashboard() {
    return (
        <div className="staff-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Staff Dashboard</h1>
                    <p>Welcome back! Here's what's happening in the clinic today.</p>
                </div>

                <div className="dashboard-date">
                    <CalendarCheck size={20} />
                    <span>Today</span>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon patients">
                        <Users size={25} />
                    </div>
                    <div className="stat-info">
                        <span>Total Patients</span>
                        <h2>248</h2>
                        <small>+12% this month</small>
                    </div>
                    <ArrowUpRight className="stat-arrow" size={20} />
                </div>

                <div className="stat-card">
                    <div className="stat-icon consultations">
                        <Stethoscope size={25} />
                    </div>
                    <div className="stat-info">
                        <span>Consultations</span>
                        <h2>36</h2>
                        <small>8 scheduled today</small>
                    </div>
                    <ArrowUpRight className="stat-arrow" size={20} />
                </div>

                <div className="stat-card">
                    <div className="stat-icon records">
                        <FileText size={25} />
                    </div>
                    <div className="stat-info">
                        <span>Medical Records</span>
                        <h2>182</h2>
                        <small>Updated recently</small>
                    </div>
                    <ArrowUpRight className="stat-arrow" size={20} />
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">
                        <Activity size={25} />
                    </div>
                    <div className="stat-info">
                        <span>Active Patients</span>
                        <h2>14</h2>
                        <small>Currently in clinic</small>
                    </div>
                    <ArrowUpRight className="stat-arrow" size={20} />
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Today's Consultations */}
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Today's Consultations</h2>
                            <p>Upcoming patient consultations</p>
                        </div>

                        <button className="view-btn">
                            View All
                        </button>
                    </div>

                    <div className="consultation-list">
                        <div className="consultation-item">
                            <div className="patient-avatar">JD</div>

                            <div className="patient-info">
                                <h3>John Doe</h3>
                                <p>General Consultation</p>
                            </div>

                            <div className="consultation-time">
                                <strong>09:00 AM</strong>
                                <span className="status waiting">Waiting</span>
                            </div>
                        </div>

                        <div className="consultation-item">
                            <div className="patient-avatar">MS</div>

                            <div className="patient-info">
                                <h3>Maria Santos</h3>
                                <p>Follow-up Checkup</p>
                            </div>

                            <div className="consultation-time">
                                <strong>10:30 AM</strong>
                                <span className="status ongoing">Ongoing</span>
                            </div>
                        </div>

                        <div className="consultation-item">
                            <div className="patient-avatar">RL</div>

                            <div className="patient-info">
                                <h3>Robert Lee</h3>
                                <p>Medical Examination</p>
                            </div>

                            <div className="consultation-time">
                                <strong>01:00 PM</strong>
                                <span className="status scheduled">Scheduled</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-panel quick-actions-panel">
                    <div className="panel-header">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Frequently used tools</p>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <button className="quick-action">
                            <div className="action-icon">
                                <Stethoscope size={22} />
                            </div>
                            <div>
                                <strong>New Consultation</strong>
                                <span>Start a patient consultation</span>
                            </div>
                        </button>

                        <button className="quick-action">
                            <div className="action-icon">
                                <Users size={22} />
                            </div>
                            <div>
                                <strong>View Patients</strong>
                                <span>Search patient information</span>
                            </div>
                        </button>

                        <button className="quick-action">
                            <div className="action-icon">
                                <FileText size={22} />
                            </div>
                            <div>
                                <strong>Medical Records</strong>
                                <span>Access patient records</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffDashboard;

