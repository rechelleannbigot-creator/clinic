import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  getUserAnnouncements,
  getAnnouncementUnreadCount,
  markAnnouncementAsRead,
} from "../../services/announcementService";
import "../../styles/StudentAnnouncements.css";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const requestRef = useRef(0);

  // Load announcements
  const loadAnnouncements = useCallback(async () => {
    const current = ++requestRef.current;
    try {
      setLoading(true);
      setError("");

      const [announcementsData, unreadData] = await Promise.all([
        getUserAnnouncements(),
        getAnnouncementUnreadCount(),
      ]);

      if (current !== requestRef.current) return;

      setAnnouncements(announcementsData);
      setUnreadCount(unreadData);
    } catch (err) {
      if (current !== requestRef.current) return;
      setError(err.message || "Failed to load announcements.");
    } finally {
      if (current === requestRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // Mark as read
  const handleMarkAsRead = async (announcement) => {
    if (!announcement.unread) return;

    try {
      await markAnnouncementAsRead(announcement.announcementId);

      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.announcementId === announcement.announcementId
            ? { ...ann, unread: false }
            : ann
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      if (selectedAnnouncement?.announcementId === announcement.announcementId) {
        setSelectedAnnouncement({ ...selectedAnnouncement, unread: false });
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // View announcement
  const handleViewAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
    handleMarkAsRead(announcement);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get priority badge class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return "priority-urgent";
      case "Important":
        return "priority-important";
      default:
        return "priority-normal";
    }
  };

  // Get category icon class
  const getCategoryClass = (category) => {
    return `category-${category.toLowerCase().replace(/\s+/g, "-")}`;
  };

  return (
    <div className="student-announcements">
      {/* ===== HEADER ===== */}
      <div className="announcements-header">
        <div>
          <h1>Announcements</h1>
          <p>Stay updated with important clinic announcements and reminders.</p>
        </div>

        {unreadCount > 0 && (
          <div className="unread-badge">
            <Bell size={18} />
            <span>{unreadCount}</span>
          </div>
        )}
      </div>

      {/* ===== ERROR MESSAGE ===== */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ===== LOADING STATE ===== */}
      {loading && (
        <div className="announcements-container">
          <div className="loading-state">
            <p>Loading announcements...</p>
          </div>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && announcements.length === 0 && (
        <div className="announcements-container">
          <div className="empty-state">
            <Bell size={48} />
            <h3>No Announcements</h3>
            <p>No announcements are currently available. Check back later!</p>
          </div>
        </div>
      )}

      {/* ===== ANNOUNCEMENTS LIST ===== */}
      {!loading && announcements.length > 0 && (
        <div className="announcements-container">
          {announcements.map((announcement) => (
            <div
              key={announcement.announcementId}
              className={`announcement-item ${announcement.unread ? "unread" : ""}`}
              onClick={() => handleViewAnnouncement(announcement)}
            >
              {/* Unread indicator */}
              {announcement.unread && (
                <div className="unread-indicator" />
              )}

              {/* Category badge */}
              <div className={`category-badge ${getCategoryClass(announcement.category)}`}>
                {announcement.category.charAt(0)}
              </div>

              {/* Content */}
              <div className="announcement-content">
                <div className="announcement-header-row">
                  <h3 className="announcement-title">
                    {announcement.title}
                  </h3>

                  {announcement.priority !== "Normal" && (
                    <span className={`priority-badge ${getPriorityClass(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  )}
                </div>

                <p className="announcement-message">
                  {announcement.message.substring(0, 150)}
                  {announcement.message.length > 150 ? "..." : ""}
                </p>

                <div className="announcement-footer">
                  <span className="announcement-date">
                    {formatDate(announcement.publishedAt)}
                  </span>

                  <button className="read-more-btn">
                    Read More
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedAnnouncement && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedAnnouncement.title}</h2>
              <button
                className="btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Category & Priority */}
              <div className="detail-badges">
                <span className={`category-badge ${getCategoryClass(selectedAnnouncement.category)}`}>
                  {selectedAnnouncement.category}
                </span>

                {selectedAnnouncement.priority !== "Normal" && (
                  <span className={`priority-badge ${getPriorityClass(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="announcement-message-box">
                {selectedAnnouncement.message}
              </div>

              {/* Details */}
              <div className="announcement-details">
                <div className="detail-row">
                  <label>Published:</label>
                  <span>{formatDate(selectedAnnouncement.publishedAt)}</span>
                </div>

                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedAnnouncement.category}</span>
                </div>

                <div className="detail-row">
                  <label>Priority:</label>
                  <span className={`priority-badge ${getPriorityClass(selectedAnnouncement.priority)}`}>
                    {selectedAnnouncement.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowDetailModal(false)}
              >
                <CheckCircle size={16} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentAnnouncements;
