import { useCallback, useEffect, useRef, useState } from "react";
import { getStaffDashboard } from "../../services/clinicService";
import DashboardNotifications from "./DashboardNotifications";
import "../../styles/Staffdashboard.css";

export default function Notifications() {
    const [notifications, setNotifications] = useState(null);
    const [error, setError] = useState("");
    const request = useRef(0);
    const load = useCallback(async () => {
        const current = ++request.current;
        try {
            const data = await getStaffDashboard();
            if (current !== request.current) return;
            setNotifications(data.notifications);
            setError("");
        } catch (requestError) {
            if (current !== request.current) return;
            setError(requestError.message);
        }
    }, []);
    useEffect(() => {
        const requestRef = request;
        let active = true;
        Promise.resolve().then(() => { if (active) load(); });
        const timer = window.setInterval(() => { if (!document.hidden) load(); }, 60000);
        return () => { active = false; requestRef.current++; window.clearInterval(timer); };
    }, [load]);
    return <div className="staff-dashboard">
        <header className="sd-heading"><div><p className="sd-eyebrow">CLINIC UPDATES</p><h1>Notifications</h1><p>Current stock alerts and recent registrations and consultations.</p></div><button className="sd-secondary" type="button" onClick={load}>Refresh</button></header>
        {error && <p className="sd-error" role="alert">Unable to refresh notifications: {error}</p>}
        {!notifications ? <p role="status">{error ? "Notifications unavailable." : "Loading notifications..."}</p> : <section className="sd-panel"><div className="sd-panel-heading"><h2>Updates</h2><span>{notifications.filter((item) => item.unread).length} unread</span></div><DashboardNotifications notifications={notifications} onRead={(id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item))} /></section>}
    </div>;
}
