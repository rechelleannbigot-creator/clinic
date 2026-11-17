import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Bell, ClipboardList, FileText, Package, Pill, QrCode, RefreshCw, Stethoscope, UserRound, Users } from "lucide-react";
import { getStaffDashboard } from "../../services/clinicService";
import { getStaffProfile } from "../../services/staffProfileService";
import DashboardNotifications from "./DashboardNotifications";
import "../../styles/Staffdashboard.css";

const cards = [
    ["patients", "Total Patients", Users],
    ["consultationsToday", "Today's Consultations", Stethoscope],
    ["availableMedicines", "Available Medicines", Package],
    ["lowStock", "Low Stock Medicines", AlertTriangle],
    ["issuedToday", "Medicine Issued Today", Pill],
    ["medicalRecords", "Total Medical Records", FileText],
];
const displayDate = (date) => date ? new Date(date).toLocaleString("en-PH", { timeZone: "Asia/Manila", dateStyle: "medium", timeStyle: "short" }) : "Not available";

export default function StaffDashboard() {
    const [data, setData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const request = useRef(0);
    const load = useCallback(async () => {
        const current = ++request.current;
        const [dashboard, staff] = await Promise.allSettled([getStaffDashboard(), getStaffProfile()]);
        if (current !== request.current) return;
        setErrors({
            dashboard: dashboard.status === "rejected" ? dashboard.reason.message : "",
            profile: staff.status === "rejected" ? staff.reason.message : "",
        });
        if (dashboard.status === "fulfilled") setData(dashboard.value);
        if (staff.status === "fulfilled") setProfile(staff.value);
        setLoading(false);
    }, []);
    useEffect(() => {
        const requestRef = request;
        let active = true;
        Promise.resolve().then(() => { if (active) load(); });
        const timer = window.setInterval(() => { if (!document.hidden) load(); }, 60000);
        const onVisible = () => { if (!document.hidden) load(); };
        document.addEventListener("visibilitychange", onVisible);
        return () => { active = false; requestRef.current++; window.clearInterval(timer); document.removeEventListener("visibilitychange", onVisible); };
    }, [load]);
    const markRead = (id) => setData((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, unread: false } : item) }));
    const name = profile && [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ");
    const unread = data?.notifications.filter((item) => item.unread).length;

    return <div className="staff-dashboard">
        <header className="sd-heading">
            <div><p className="sd-eyebrow">CLINIC STAFF OVERVIEW</p><h1>Welcome back, {name || "Staff Member"}!</h1><p>Here's an overview of today's clinic activities.</p></div>
            <button type="button" className="sd-secondary" onClick={load}><RefreshCw size={17} /> Refresh</button>
        </header>
        {loading && <p role="status">Loading dashboard...</p>}
        {errors.dashboard && <p className="sd-error" role="alert">Dashboard data could not be refreshed: {errors.dashboard} {data && "Previously loaded data may be out of date."}</p>}
        {errors.profile && <p className="sd-error" role="alert">Profile could not be loaded: {errors.profile}</p>}
        {data && <>
            <section className="sd-stats" aria-label="Clinic statistics">
                {cards.map(([key, label, Icon]) => <div className="sd-stat" key={key}><span className="sd-icon"><Icon size={21} /></span><div><span>{label}</span><strong>{data.stats[key]}</strong></div></div>)}
            </section>
            <p className="sd-note">Available medicines counts unexpired, stocked items. Low stock includes out-of-stock items; items with invalid stock or expiry data are excluded from these counts. Medical records counts saved patient medical profiles; issuance counts consultations recorded today with medicine.</p>
        </>}
        <div className="sd-grid">
            <section className="sd-panel sd-qr"><div><p className="sd-eyebrow">QUICK PATIENT ACCESS</p><h2>Scan patient QR code</h2><p>Identify a student and open their medical profile.</p><Link className="sd-primary" to="/staff/scan-qr"><QrCode size={18} /> Scan Patient QR Code</Link></div><QrCode className="sd-qr-art" size={76} /></section>
            <section className="sd-panel">
                <div className="sd-panel-heading"><div><h2>Staff profile</h2><p>Your authenticated account</p></div><Link to="/staff/profile">My Profile</Link></div>
                {profile ? <div className="sd-profile">{profile.photoURL ? <img src={profile.photoURL} alt="" /> : <span className="sd-avatar"><UserRound size={25} /></span>}<div><strong>{name || "Staff Member"}</strong><p>{profile.email || "Email not available"}</p><p>Staff ID: {profile.employeeId || "Not provided"}</p><p>Role: {profile.role || "Not provided"} · Account status: {profile.accountStatus || "Not provided"}</p></div></div> : <p className="sd-empty">{loading ? "Loading profile..." : "Profile unavailable."}</p>}
            </section>
            <section className="sd-panel sd-wide"><div className="sd-panel-heading"><div><h2>Quick actions</h2><p>Frequently used tools</p></div></div><div className="sd-actions"><Link className="sd-secondary" to="/staff/new-consultation"><Stethoscope size={17} /> New Consultation</Link><Link className="sd-secondary" to="/staff/add-patient"><Users size={17} /> View Patients</Link><Link className="sd-secondary" to="/staff/student-medical-profile"><FileText size={17} /> Medical Records</Link></div></section>
            {data && <>
                <section className="sd-panel sd-wide"><div className="sd-panel-heading"><div><h2>Today's consultations</h2><p>Recorded consultations for today, Philippine time</p></div><Link to="/staff/visit-history">View All</Link></div>
                    <div className="sd-table-wrap"><table><thead><tr><th>Consultation ID</th><th>Patient</th><th>Type</th><th>Date</th><th>Attending staff</th><th>Status</th></tr></thead><tbody>{data.consultations.map((item) => <tr key={item.consultationId}><td>{item.consultationId}</td><td>{item.patientName || "Not available"}</td><td>{item.consultationType || "Not available"}</td><td>{item.consultationDate}</td><td>{item.clinicStaff || "Not available"}</td><td><span className="sd-badge">{item.status}</span></td></tr>)}</tbody></table></div>
                    {!data.consultations.length && <p className="sd-empty">No consultations recorded for today.</p>}
                </section>
                <section className="sd-panel"><div className="sd-panel-heading"><div><h2>Recent clinic activities</h2><p>Latest registrations, consultations and medicine issuance</p></div><ClipboardList size={20} /></div>
                    {!data.activities.length && <p className="sd-empty">No recent activities available.</p>}
                    <div className="sd-list">{data.activities.map((item) => <div className="sd-list-item" key={item.id}><div><strong>{item.description}</strong><p>{item.patientName || "Patient unavailable"} · {item.reference}</p><small>{displayDate(item.date)} · {item.staff || "Staff not recorded"}</small></div></div>)}</div>
                </section>
                <section className="sd-panel"><div className="sd-panel-heading"><div><h2>Notifications {unread > 0 && <span className="sd-unread">{unread} unread</span>}</h2><p>Stock alerts and recent clinic activity</p></div><Link to="/staff/notifications"><Bell size={18} /> View all</Link></div><DashboardNotifications notifications={data.notifications.slice(0, 5)} onRead={markRead} /></section>
                <section className="sd-panel sd-wide"><div className="sd-panel-heading"><div><h2>Medicine inventory</h2><p>Current stock and expiry overview</p></div><Link to="/staff/inventory">View inventory</Link></div>
                    <div className="sd-table-wrap"><table><thead><tr><th>Medicine</th><th>Available stock</th><th>Unit</th><th>Expiration date</th><th>Status</th></tr></thead><tbody>{data.medicines.slice(0, 10).map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>{item.unit || "Not provided"}</td><td>{item.expirationDate || "Not provided"}</td><td><span className={`sd-badge ${item.status === "In Stock" ? "" : "sd-warning"}`}>{item.status}</span></td></tr>)}</tbody></table></div>
                    {!data.medicines.length && <p className="sd-empty">No medicines in inventory.</p>}
                </section>
            </>}
        </div>
    </div>;
}
