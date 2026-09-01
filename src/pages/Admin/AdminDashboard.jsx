import {
    Users,
    CalendarDays,
    UserRoundCog,
    Building2,
    Bell,
    ArrowUpRight,
    ArrowRight,
    Activity,
} from "lucide-react";

import "./AdminDashboard.css";


function AdminDashboard() {

    return (
        <div className="admin-dashboard">

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="dashboard-page-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Welcome back! Boy.
                    </p>
                </div>


                <button className="dashboard-notification">
                    <Bell size={19} />

                    <span></span>
                </button>

            </div>


            {/* =====================================
                STATISTICS
            ====================================== */}

            <section className="stats-grid">


                {/* Total Patients */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon blue">
                            <Users size={22} />
                        </div>

                        <span className="stat-trend positive">
                            <ArrowUpRight size={14} />
                            12.5%
                        </span>

                    </div>


                    <div className="stat-content">

                        <span className="stat-label">
                            Total Patients
                        </span>

                        <h2>
                            1,248
                        </h2>

                        <small>
                            Compared with last month
                        </small>

                    </div>

                </div>


                {/* Appointments */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon green">
                            <CalendarDays size={22} />
                        </div>

                        <span className="stat-trend positive">
                            <ArrowUpRight size={14} />
                            8.2%
                        </span>

                    </div>


                    <div className="stat-content">

                        <span className="stat-label">
                            Appointments
                        </span>

                        <h2>
                            324
                        </h2>

                        <small>
                            Scheduled this month
                        </small>

                    </div>

                </div>


                {/* Clinic Staff */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon purple">
                            <UserRoundCog size={22} />
                        </div>

                        <span className="stat-trend neutral">
                            Active
                        </span>

                    </div>


                    <div className="stat-content">

                        <span className="stat-label">
                            Clinic Staff
                        </span>

                        <h2>
                            48
                        </h2>

                        <small>
                            Active staff members
                        </small>

                    </div>

                </div>


                {/* Clinics */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon orange">
                            <Building2 size={22} />
                        </div>

                        <span className="stat-trend positive">
                            +2
                        </span>

                    </div>


                    <div className="stat-content">

                        <span className="stat-label">
                            Total Clinics
                        </span>

                        <h2>
                            12
                        </h2>

                        <small>
                            Clinics registered
                        </small>

                    </div>

                </div>

            </section>


            {/* =====================================
                MAIN DASHBOARD GRID
            ====================================== */}

            <section className="dashboard-grid">


                {/* =================================
                    APPOINTMENT OVERVIEW
                ================================== */}

                <div className="dashboard-card appointment-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Appointment Overview
                            </h3>

                            <p>
                                Monthly appointment statistics
                            </p>
                        </div>


                        <select defaultValue="7">
                            <option value="7">
                                Last 7 Months
                            </option>

                            <option value="30">
                                Last 30 Days
                            </option>

                            <option value="year">
                                This Year
                            </option>
                        </select>

                    </div>


                    {/* Chart */}

                    <div className="bar-chart">

                        <div className="chart-y-axis">

                            <span>400</span>
                            <span>300</span>
                            <span>200</span>
                            <span>100</span>
                            <span>0</span>

                        </div>


                        <div className="chart-content">

                            <div className="chart-grid-line"></div>
                            <div className="chart-grid-line"></div>
                            <div className="chart-grid-line"></div>
                            <div className="chart-grid-line"></div>


                            <div className="chart-bars">

                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "45%" }}
                                    ></div>
                                    <span>Feb</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "60%" }}
                                    ></div>
                                    <span>Mar</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "52%" }}
                                    ></div>
                                    <span>Apr</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "72%" }}
                                    ></div>
                                    <span>May</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "65%" }}
                                    ></div>
                                    <span>Jun</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar"
                                        style={{ height: "82%" }}
                                    ></div>
                                    <span>Jul</span>
                                </div>


                                <div className="chart-bar-item">
                                    <div
                                        className="chart-bar current"
                                        style={{ height: "92%" }}
                                    ></div>
                                    <span>Aug</span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================
                    PATIENT SUMMARY
                ================================== */}

                <div className="dashboard-card patient-summary-card">

                    <div className="card-header">

                        <div>
                            <h3>
                                Patient Summary
                            </h3>

                            <p>
                                Current patient statistics
                            </p>
                        </div>

                    </div>


                    <div className="patient-donut-container">

                        <div className="patient-donut">

                            <div className="donut-center">

                                <strong>
                                    1,248
                                </strong>

                                <span>
                                    Patients
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="patient-legend">

                        <div className="legend-row">

                            <div>
                                <span className="legend-dot new"></span>

                                <span>
                                    New Patients
                                </span>
                            </div>

                            <strong>
                                35%
                            </strong>

                        </div>


                        <div className="legend-row">

                            <div>
                                <span className="legend-dot existing"></span>

                                <span>
                                    Existing Patients
                                </span>
                            </div>

                            <strong>
                                65%
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                BOTTOM GRID
            ====================================== */}

            <section className="bottom-grid">


                {/* =================================
                    RECENT APPOINTMENTS
                ================================== */}

                <div className="dashboard-card appointments-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Recent Appointments
                            </h3>

                            <p>
                                Latest scheduled appointments
                            </p>

                        </div>


                        <button className="view-btn">
                            View All
                            <ArrowRight size={15} />
                        </button>

                    </div>


                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>

                            </thead>


                            <tbody>

                                <tr>

                                    <td>
                                        <div className="patient-name">

                                            <div className="table-avatar">
                                                JD
                                            </div>

                                            <span>
                                                John Doe
                                            </span>

                                        </div>
                                    </td>

                                    <td>
                                        Dr. Maria Santos
                                    </td>

                                    <td>
                                        Aug 31, 2026
                                    </td>

                                    <td>
                                        <span className="status completed">
                                            Completed
                                        </span>
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        <div className="patient-name">

                                            <div className="table-avatar">
                                                AS
                                            </div>

                                            <span>
                                                Anna Smith
                                            </span>

                                        </div>
                                    </td>

                                    <td>
                                        Dr. Michael Cruz
                                    </td>

                                    <td>
                                        Aug 31, 2026
                                    </td>

                                    <td>
                                        <span className="status pending">
                                            Pending
                                        </span>
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        <div className="patient-name">

                                            <div className="table-avatar">
                                                RW
                                            </div>

                                            <span>
                                                Robert Wilson
                                            </span>

                                        </div>
                                    </td>

                                    <td>
                                        Dr. Maria Santos
                                    </td>

                                    <td>
                                        Sep 01, 2026
                                    </td>

                                    <td>
                                        <span className="status confirmed">
                                            Confirmed
                                        </span>
                                    </td>

                                </tr>


                                <tr>

                                    <td>
                                        <div className="patient-name">

                                            <div className="table-avatar">
                                                EB
                                            </div>

                                            <span>
                                                Emily Brown
                                            </span>

                                        </div>
                                    </td>

                                    <td>
                                        Dr. James Lee
                                    </td>

                                    <td>
                                        Sep 01, 2026
                                    </td>

                                    <td>
                                        <span className="status pending">
                                            Pending
                                        </span>
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =================================
                    QUICK ACTIONS
                ================================== */}

                <div className="dashboard-card quick-card">

                    <div className="card-header">

                        <div>

                            <h3>
                                Quick Actions
                            </h3>

                            <p>
                                Common administrative tasks
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">


                        <button
                            className="quick-action"
                            onClick={() =>
                                window.location.href =
                                    "/admin/patients-management"
                            }
                        >

                            <span className="quick-icon blue">
                                <Users size={19} />
                            </span>

                            <div>

                                <strong>
                                    Add Patient
                                </strong>

                                <small>
                                    Register a new patient
                                </small>

                            </div>

                            <ArrowRight size={16} />

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                window.location.href =
                                    "/admin/consultations"
                            }
                        >

                            <span className="quick-icon green">
                                <CalendarDays size={19} />
                            </span>

                            <div>

                                <strong>
                                    New Appointment
                                </strong>

                                <small>
                                    Schedule an appointment
                                </small>

                            </div>

                            <ArrowRight size={16} />

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                window.location.href =
                                    "/admin/manage-users"
                            }
                        >

                            <span className="quick-icon purple">
                                <UserRoundCog size={19} />
                            </span>

                            <div>

                                <strong>
                                    Manage Staff
                                </strong>

                                <small>
                                    Manage clinic users
                                </small>

                            </div>

                            <ArrowRight size={16} />

                        </button>


                        <button
                            className="quick-action"
                            onClick={() =>
                                window.location.href =
                                    "/admin/reports"
                            }
                        >

                            <span className="quick-icon orange">
                                <Activity size={19} />
                            </span>

                            <div>

                                <strong>
                                    Generate Report
                                </strong>

                                <small>
                                    Create system reports
                                </small>

                            </div>

                            <ArrowRight size={16} />

                        </button>


                    </div>

                </div>

            </section>

        </div>
    );
}


export default AdminDashboard;
