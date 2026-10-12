
import { useState } from "react";
import {
  Bell,
  CalendarCheck,
  Pill,
  FileText,
  CheckCheck,
  Info,
  Check,
  Clock,
} from "lucide-react";

import "../../styles/StudentNotification.css";

function StudentNotification() {
  const [activeFilter, setActiveFilter] = useState("All");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Consultation Reminder",
      message:
        "Please remember your scheduled clinic consultation. Visit the clinic at your appointed time.",
      date: "Oct 10, 2026",
      time: "8:30 AM",
      type: "Consultation",
      icon: CalendarCheck,
      unread: true,
    },
    {
      id: 2,
      title: "Medicine Issued",
      message:
        "Your medicine issuance record has been updated. Check your medical records for details.",
      date: "Oct 9, 2026",
      time: "2:15 PM",
      type: "Medicine",
      icon: Pill,
      unread: true,
    },
    {
      id: 3,
      title: "Medical Record Updated",
      message:
        "Your clinic medical record has been updated. Please review your latest record.",
      date: "Oct 8, 2026",
      time: "10:00 AM",
      type: "Medical Record",
      icon: FileText,
      unread: false,
    },
    {
      id: 4,
      title: "Clinic Announcement",
      message:
        "Keep your student information updated to help the clinic provide accurate health services.",
      date: "Oct 7, 2026",
      time: "9:00 AM",
      type: "Announcement",
      icon: Info,
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) => {
      if (activeFilter === "Unread") {
        return notification.unread;
      }

      if (activeFilter === "Read") {
        return !notification.unread;
      }

      return true;
    }
  );

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  return (
    <div className="student-notification-container">
      {/* Page Header */}
      <div className="student-notification-header">
        <div>
          <h2>Notifications</h2>
          <p>
            Stay updated with your clinic activities and health
            announcements.
          </p>
        </div>

        <div className="student-notification-header-icon">
          <Bell size={25} />
          {unreadCount > 0 && (
            <span className="student-notification-count">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="student-notification-summary">
        <div className="student-notification-summary-card">
          <div className="student-notification-summary-icon total">
            <Bell size={21} />
          </div>
          <div>
            <p>Total Notifications</p>
            <h3>{notifications.length}</h3>
          </div>
        </div>

        <div className="student-notification-summary-card">
          <div className="student-notification-summary-icon unread">
            <Clock size={21} />
          </div>
          <div>
            <p>Unread Notifications</p>
            <h3>{unreadCount}</h3>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <section className="student-notification-panel">
        <div className="student-notification-panel-header">
          <div>
            <h3>Recent Notifications</h3>
            <p>View and manage your clinic notifications.</p>
          </div>

          <button
            type="button"
            className="student-mark-all-button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={17} />
            Mark all as read
          </button>
        </div>

        {/* Filters */}
        <div className="student-notification-filters">
          {["All", "Unread", "Read"].map((filter) => (
            <button
              type="button"
              key={filter}
              className={`student-notification-filter ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              {filter === "Unread" && unreadCount > 0 && (
                <span className="student-filter-count">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notification Items */}
        <div className="student-notification-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;

              return (
                <article
                  key={notification.id}
                  className={`student-notification-card ${
                    notification.unread ? "unread" : ""
                  }`}
                >
                  <div
                    className={`student-notification-item-icon ${notification.type
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="student-notification-item-content">
                    <div className="student-notification-item-heading">
                      <h4>{notification.title}</h4>

                      {notification.unread && (
                        <span className="student-unread-badge">
                          New
                        </span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <div className="student-notification-meta">
                      <span>
                        <Clock size={14} />
                        {notification.date} · {notification.time}
                      </span>

                      <span className="student-notification-type">
                        {notification.type}
                      </span>
                    </div>
                  </div>

                  {notification.unread && (
                    <button
                      type="button"
                      className="student-mark-read-button"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                      aria-label={`Mark ${notification.title} as read`}
                    >
                      <Check size={18} />
                    </button>
                  )}
                </article>
              );
            })
          ) : (
            <div className="student-notification-empty">
              <Bell size={35} />
              <h3>No notifications found</h3>
              <p>
                {activeFilter === "Unread"
                  ? "You are all caught up!"
                  : "There are no notifications in this category."}
              </p>
            </div>
          )}
        </div>

        <div className="student-notification-footer">
          Showing {filteredNotifications.length} of{" "}
          {notifications.length} notifications
        </div>
      </section>
    </div>
  );
}

export default StudentNotification;
