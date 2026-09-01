
import { useState } from "react";
import {
    Bell,
    Check,
    Trash2,
    AlertTriangle,
    Pill,
    Users,
    Calendar,
    Info,
} from "lucide-react";
import "../../styles/Notification.css";

function Notification() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "medicine",
            title: "Low Medicine Stock",
            message: "Paracetamol stock is running low.",
            time: "10 minutes ago",
            read: false,
        },
        {
            id: 2,
            type: "patient",
            title: "New Patient Registered",
            message: "A new patient has been registered successfully.",
            time: "30 minutes ago",
            read: false,
        },
        {
            id: 3,
            type: "consultation",
            title: "New Consultation",
            message: "A new consultation record has been added.",
            time: "1 hour ago",
            read: true,
        },
        {
            id: 4,
            type: "alert",
            title: "Medicine Expiring Soon",
            message: "Some medicines will expire within 30 days.",
            time: "3 hours ago",
            read: true,
        },
        {
            id: 5,
            type: "system",
            title: "System Update",
            message: "The clinic management system was updated successfully.",
            time: "Yesterday",
            read: true,
        },
    ]);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notification) => ({
                ...notification,
                read: true,
            }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(
            notifications.filter(
                (notification) => notification.id !== id
            )
        );
    };

    const getIcon = (type) => {
        switch (type) {
            case "medicine":
                return <Pill size={20} />;

            case "patient":
                return <Users size={20} />;

            case "consultation":
                return <Calendar size={20} />;

            case "alert":
                return <AlertTriangle size={20} />;

            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className="notification-page">

            {/* Header */}
            <div className="notification-header">
                <div>
                    <h1>Notifications</h1>
                    <p>
                        View important updates and activities from your
                        clinic.
                    </p>
                </div>

                <button
                    className="mark-all-btn"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                >
                    <Check size={17} />
                    Mark All as Read
                </button>
            </div>

            {/* Summary */}
            <div className="notification-summary">

                <div className="notification-summary-card">
                    <div className="summary-icon blue">
                        <Bell size={22} />
                    </div>

                    <div>
                        <span>Total Notifications</span>
                        <strong>{notifications.length}</strong>
                    </div>
                </div>

                <div className="notification-summary-card">
                    <div className="summary-icon orange">
                        <Bell size={22} />
                    </div>

                    <div>
                        <span>Unread</span>
                        <strong>{unreadCount}</strong>
                    </div>
                </div>

                <div className="notification-summary-card">
                    <div className="summary-icon green">
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

            {/* Notification List */}
            <div className="notification-card">

                <div className="notification-card-header">
                    <div>
                        <h2>Recent Notifications</h2>
                        <p>
                            Stay updated with recent clinic activities.
                        </p>
                    </div>
                </div>

                <div className="notification-list">

                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                className={`notification-item ${
                                    !notification.read ? "unread" : ""
                                }`}
                                key={notification.id}
                            >

                                {/* Icon */}
                                <div
                                    className={`notification-icon ${notification.type}`}
                                >
                                    {getIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="notification-content">

                                    <div className="notification-title-row">
                                        <h3>{notification.title}</h3>

                                        {!notification.read && (
                                            <span className="unread-dot"></span>
                                        )}
                                    </div>

                                    <p>{notification.message}</p>

                                    <span className="notification-time">
                                        {notification.time}
                                    </span>

                                </div>

                                {/* Actions */}
                                <div className="notification-actions">

                                    {!notification.read && (
                                        <button
                                            className="read-btn"
                                            title="Mark as read"
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}

                                    <button
                                        className="delete-btn"
                                        title="Delete"
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
                                You currently have no notifications.
                            </p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Notification;

