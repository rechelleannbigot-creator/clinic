import { useState } from "react";
import { markDashboardNotificationRead } from "../../services/clinicService";

export default function DashboardNotifications({ notifications, onRead }) {
    const [pending, setPending] = useState("");
    const [error, setError] = useState("");
    const markRead = async (id) => {
        setPending(id);
        setError("");
        try {
            await markDashboardNotificationRead(id);
            onRead(id);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setPending("");
        }
    };
    return <>
        {error && <p className="sd-error" role="alert">{error}</p>}
        {!notifications.length && <p className="sd-empty">No current alerts or recent notifications.</p>}
        <div className="sd-list">
            {notifications.map((item) => <div className="sd-list-item" key={item.id}>
                <div><strong>{item.title} {item.unread && <span className="sd-unread">New</span>}</strong><p>{item.message}</p>{item.date && <small>{new Date(item.date).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}</small>}</div>
                {item.unread && <button className="sd-link-button" type="button" disabled={Boolean(pending)} onClick={() => markRead(item.id)}>{pending === item.id ? "Saving..." : "Mark read"}</button>}
            </div>)}
        </div>
    </>;
}
