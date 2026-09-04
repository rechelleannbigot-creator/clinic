import { useState } from "react";
import {
    Bell,
    CheckCircle,
    Calendar,
    Pill,
    User,
    AlertCircle,
    Check,
    Trash2
} from "lucide-react";
import "../../styles/Notifications.css";

function Notification() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "appointment",
            title: "New Appointment",
            message: "Juan Dela Cruz has a new consultation scheduled today.",
            time: "10 minutes ago",
            unread: true
        },
        {
            id: 2,
            type: "medicine",
            title: "Medicine Inventory Alert",
            message: "Paracetamol stock is running low. Please check the inventory.",
            time: "30 minutes ago",
            unread: true
        },
        {
            id: 3,
            type: "patient",
            title: "New Patient Registered",
            message: "A new patient record has been added to the system.",
            time: "1 hour ago",
            unread: true
        },
        {
            id: 4,
            type: "appointment",
            title: "Consultation Reminder",
            message: "You have a scheduled consultation at 2:00 PM today.",
            time: "2 hours ago",
            unread: false
        },
        {
            id: 5,
            type: "system",
            title: "Medical Record Updated",
            message: "A patient's medical record has been successfully updated.",
            time: "Yesterday",
            unread: false
        }
    ]);

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false
            }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((current) =>
            current.filter((notification) => notification.id !== id)
        );
    };

    const getIcon = (type) => {
        switch (type) {
            case "appointment":
                return <Calendar size={21} />;

            case "medicine":
                return <Pill size={21} />;

            case "patient":
                return <User size={21} />;

            default:
                return <CheckCircle size={21} />;
        }
    };

    const unreadCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    return (
        <div className="notification-page">

            {/* Header */}
            <div className="notification-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your clinic activities</p>
                </div>

                <div className="notification-header-icon">
                    <Bell size={27} />

                    {unreadCount > 0 && (
                        <span>{unreadCount}</span>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="notification-summary">

                <div className="notification-summary-card">
                    <div className="summary-icon">
                        <Bell size={22} />
                    </div>

                    <div>
                        <span>Total Notifications</span>
                        <strong>{notifications.length}</strong>
                    </div>
                </div>

                <div className="notification-summary-card">
                    <div className="summary-icon unread">
                        <AlertCircle size={22} />
                    </div>

                    <div>
                        <span>Unread</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </div>

                <div className="notification-summary-card">
                    <div className="summary-icon read">
                        <Check size={22} />
                    </div>

                    <div>
                        <span>Read</span>
                        <strong>
                            {notifications.length - unreadCount}
                        </strong>
                    </div>
                </div>

            </div>

            {/* Notification Card */}
            <div className="notification-card">

                <div className="notification-toolbar">

                    <div>
                        <h2>Recent Notifications</h2>
                        <p>
                            You have {unreadCount} unread notification
                            {unreadCount !== 1 ? "s" : ""}.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            className="mark-all-btn"
                            onClick={markAllAsRead}
                        >
                            <Check size={16} />
                            Mark all as read
                        </button>
                    )}

                </div>

                {/* Notifications */}
                <div className="notification-list">

                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${
                                    notification.unread
                                        ? "unread"
                                        : ""
                                }`}
                            >

                                <div
                                    className={`notification-icon ${notification.type}`}
                                >
                                    {getIcon(notification.type)}
                                </div>

                                <div className="notification-content">

                                    <div className="notification-title-row">
                                        <h3>
                                            {notification.title}
                                        </h3>

                                        {notification.unread && (
                                            <span className="new-badge">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <p>
                                        {notification.message}
                                    </p>

                                    <span className="notification-time">
                                        {notification.time}
                                    </span>

                                </div>

                                <div className="notification-actions">

                                    {notification.unread && (
                                        <button
                                            className="read-btn"
                                            title="Mark as read"
                                            onClick={() =>
                                                markAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}

                                    <button
                                        className="delete-btn"
                                        title="Delete notification"
                                        onClick={() =>
                                            deleteNotification(
                                                notification.id
                                            )
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="empty-notifications">
                            <Bell size={45} />
                            <h3>No Notifications</h3>
                            <p>
                                You're all caught up!
                            </p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Notification;

