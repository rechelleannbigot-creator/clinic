import { useState } from "react";
import {
    Users,
    Stethoscope,
    Pill,
    Activity,
    TrendingUp,
    TrendingDown,
    Calendar,
    BarChart3,
    PieChart,
} from "lucide-react";
import "../../styles/Analytics.css";

function Analytics() {
    const [period, setPeriod] = useState("This Month");

    const monthlyData = [
        { month: "Jan", patients: 85, consultations: 120 },
        { month: "Feb", patients: 105, consultations: 145 },
        { month: "Mar", patients: 98, consultations: 132 },
        { month: "Apr", patients: 120, consultations: 165 },
        { month: "May", patients: 135, consultations: 180 },
        { month: "Jun", patients: 128, consultations: 172 },
        { month: "Jul", patients: 145, consultations: 195 },
        { month: "Aug", patients: 158, consultations: 210 },
        { month: "Sep", patients: 168, consultations: 225 },
    ];

    const maxValue = Math.max(
        ...monthlyData.map((item) => item.consultations)
    );

    return (
        <div className="analytics-page">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1>Analytics</h1>
                    <p>
                        Monitor clinic performance and analyze healthcare
                        activities.
                    </p>
                </div>

                <div className="analytics-period">
                    <Calendar size={17} />

                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option>This Month</option>
                        <option>This Week</option>
                        <option>Last Month</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="analytics-kpis">
                <div className="analytics-kpi-card">
                    <div className="kpi-icon blue">
                        <Users size={24} />
                    </div>

                    <div className="kpi-content">
                        <span>Total Patients</span>
                        <strong>1,248</strong>

                        <div className="kpi-change positive">
                            <TrendingUp size={14} />
                            12.5% from last month
                        </div>
                    </div>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-icon green">
                        <Stethoscope size={24} />
                    </div>

                    <div className="kpi-content">
                        <span>Consultations</span>
                        <strong>2,456</strong>

                        <div className="kpi-change positive">
                            <TrendingUp size={14} />
                            8.4% from last month
                        </div>
                    </div>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-icon orange">
                        <Pill size={24} />
                    </div>

                    <div className="kpi-content">
                        <span>Medicine Issued</span>
                        <strong>1,892</strong>

                        <div className="kpi-change negative">
                            <TrendingDown size={14} />
                            3.2% from last month
                        </div>
                    </div>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-icon purple">
                        <Activity size={24} />
                    </div>

                    <div className="kpi-content">
                        <span>Clinic Activity</span>
                        <strong>94.8%</strong>

                        <div className="kpi-change positive">
                            <TrendingUp size={14} />
                            5.7% from last month
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Analytics Grid */}
            <div className="analytics-grid">
                {/* Consultation Chart */}
                <div className="analytics-card consultation-chart">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Patient & Consultation Trends</h2>
                            <p>
                                Monthly patient registrations and consultations
                            </p>
                        </div>

                        <BarChart3 size={21} />
                    </div>

                    <div className="chart-area">
                        <div className="chart-y-axis">
                            <span>250</span>
                            <span>200</span>
                            <span>150</span>
                            <span>100</span>
                            <span>50</span>
                            <span>0</span>
                        </div>

                        <div className="bar-chart">
                            {monthlyData.map((item) => {
                                const patientHeight =
                                    (item.patients / maxValue) * 100;

                                const consultationHeight =
                                    (item.consultations / maxValue) * 100;

                                return (
                                    <div
                                        className="chart-column"
                                        key={item.month}
                                    >
                                        <div className="bars">
                                            <div
                                                className="chart-bar patients-bar"
                                                style={{
                                                    height: `${patientHeight}%`,
                                                }}
                                                title={`Patients: ${item.patients}`}
                                            ></div>

                                            <div
                                                className="chart-bar consultation-bar"
                                                style={{
                                                    height: `${consultationHeight}%`,
                                                }}
                                                title={`Consultations: ${item.consultations}`}
                                            ></div>
                                        </div>

                                        <span>{item.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="chart-legend">
                        <span>
                            <i className="legend-dot patients"></i>
                            Patients
                        </span>

                        <span>
                            <i className="legend-dot consultations"></i>
                            Consultations
                        </span>
                    </div>
                </div>

                {/* Patient Demographics */}
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Patient Overview</h2>
                            <p>Patient distribution</p>
                        </div>

                        <PieChart size={21} />
                    </div>

                    <div className="patient-overview">
                        <div className="donut-chart">
                            <div className="donut-inner">
                                <strong>1,248</strong>
                                <span>Patients</span>
                            </div>
                        </div>

                        <div className="patient-breakdown">
                            <div>
                                <span>
                                    <i className="breakdown-dot male"></i>
                                    Male
                                </span>
                                <strong>48%</strong>
                            </div>

                            <div>
                                <span>
                                    <i className="breakdown-dot female"></i>
                                    Female
                                </span>
                                <strong>52%</strong>
                            </div>

                            <div>
                                <span>
                                    <i className="breakdown-dot other"></i>
                                    Other
                                </span>
                                <strong>2%</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Analytics */}
            <div className="analytics-bottom-grid">
                {/* Consultation Types */}
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Consultation Types</h2>
                            <p>Most common consultation categories</p>
                        </div>
                    </div>

                    <div className="progress-list">
                        <div className="progress-item">
                            <div className="progress-label">
                                <span>General Consultation</span>
                                <strong>42%</strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill blue-fill"
                                    style={{ width: "42%" }}
                                ></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Follow-up</span>
                                <strong>27%</strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill green-fill"
                                    style={{ width: "27%" }}
                                ></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Medical Certificate</span>
                                <strong>18%</strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill orange-fill"
                                    style={{ width: "18%" }}
                                ></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-label">
                                <span>Other</span>
                                <strong>13%</strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className="progress-fill purple-fill"
                                    style={{ width: "13%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medicine Analytics */}
                <div className="analytics-card">
                    <div className="analytics-card-header">
                        <div>
                            <h2>Medicine Usage</h2>
                            <p>Most frequently issued medicines</p>
                        </div>

                        <Pill size={21} />
                    </div>

                    <div className="medicine-list">
                        <div className="medicine-analytics-item">
                            <div className="medicine-rank">01</div>

                            <div className="medicine-name">
                                <strong>Paracetamol</strong>
                                <span>486 issued</span>
                            </div>

                            <div className="medicine-percent">
                                32%
                            </div>
                        </div>

                        <div className="medicine-analytics-item">
                            <div className="medicine-rank">02</div>

                            <div className="medicine-name">
                                <strong>Amoxicillin</strong>
                                <span>352 issued</span>
                            </div>

                            <div className="medicine-percent">
                                24%
                            </div>
                        </div>

                        <div className="medicine-analytics-item">
                            <div className="medicine-rank">03</div>

                            <div className="medicine-name">
                                <strong>Ibuprofen</strong>
                                <span>278 issued</span>
                            </div>

                            <div className="medicine-percent">
                                19%
                            </div>
                        </div>

                        <div className="medicine-analytics-item">
                            <div className="medicine-rank">04</div>

                            <div className="medicine-name">
                                <strong>Cetirizine</strong>
                                <span>194 issued</span>
                            </div>

                            <div className="medicine-percent">
                                13%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;

