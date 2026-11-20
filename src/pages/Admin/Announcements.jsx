import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Archive,
  Send,
  Calendar,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  archiveAnnouncement,
} from "../../services/announcementService";
import "../../styles/Announcements.css";

function Announcements() {
  // ===================================
  // STATE MANAGEMENT
  // ===================================
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestRef = useRef(0);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "General Announcement",
    message: "",
    recipients: [],
    priority: "Normal",
    attachment: null,
    status: "Draft",
    scheduledAt: "",
  });

  // ===================================
  // LOAD ANNOUNCEMENTS
  // ===================================
  const loadAnnouncements = useCallback(async () => {
    const current = ++requestRef.current;
    try {
      setLoading(true);
      setError("");

      const status = filterStatus !== "All" ? filterStatus : null;
      const data = await getAllAnnouncements(status);

      if (current !== requestRef.current) return;

      setAnnouncements(data);
    } catch (err) {
      if (current !== requestRef.current) return;
      setError(err.message || "Failed to load announcements.");
      setAnnouncements([]);
    } finally {
      if (current === requestRef.current) {
        setLoading(false);
      }
    }
  }, [filterStatus]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  // ===================================
  // FILTER & SEARCH
  // ===================================
  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || ann.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ===================================
  // SUMMARY STATS
  // ===================================
  const stats = {
    total: announcements.length,
    published: announcements.filter((a) => a.status === "Published").length,
    draft: announcements.filter((a) => a.status === "Draft").length,
    scheduled: announcements.filter((a) => a.status === "Scheduled").length,
  };

  // ===================================
  // FORM HANDLERS
  // ===================================
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleRecipientsChange = (recipient) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(recipient)
        ? prev.recipients.filter((r) => r !== recipient)
        : [...prev.recipients, recipient],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!formData.title.trim() || !formData.message.trim() || formData.recipients.length === 0) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      if (isEditing && selectedAnnouncement) {
        const updated = await updateAnnouncement(selectedAnnouncement.announcementId, formData);
        setAnnouncements((prev) =>
          prev.map((ann) =>
            ann.announcementId === updated.announcementId ? updated : ann
          )
        );
        setSuccessMessage("Announcement updated successfully!");
      } else {
        const created = await createAnnouncement(formData);
        setAnnouncements((prev) => [created, ...prev]);
        setSuccessMessage("Announcement created successfully!");
      }

      resetForm();
      setShowCreateModal(false);
      setShowViewModal(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to save announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General Announcement",
      message: "",
      recipients: [],
      priority: "Normal",
      attachment: null,
      status: "Draft",
      scheduledAt: "",
    });
    setIsEditing(false);
    setSelectedAnnouncement(null);
  };

  // ===================================
  // ACTION HANDLERS
  // ===================================
  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      category: announcement.category,
      message: announcement.message,
      recipients: announcement.recipients,
      priority: announcement.priority,
      attachment: announcement.attachment,
      status: announcement.status,
      scheduledAt: announcement.scheduledAt
        ? new Date(announcement.scheduledAt).toISOString().slice(0, 16)
        : "",
    });
    setIsEditing(false);
    setShowViewModal(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePublish = async (announcement) => {
    if (!window.confirm("Are you sure you want to publish this announcement?")) {
      return;
    }

    try {
      const updated = await publishAnnouncement(announcement.announcementId);
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.announcementId === updated.announcementId ? updated : ann
        )
      );
      setSuccessMessage("Announcement published successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to publish announcement.");
    }
  };

  const handleArchive = async (announcement) => {
    if (!window.confirm("Are you sure you want to archive this announcement?")) {
      return;
    }

    try {
      const updated = await archiveAnnouncement(announcement.announcementId);
      setAnnouncements((prev) =>
        prev.map((ann) =>
          ann.announcementId === updated.announcementId ? updated : ann
        )
      );
      setSuccessMessage("Announcement archived successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to archive announcement.");
    }
  };

  const handleDelete = async (announcement) => {
    if (!window.confirm("Are you sure you want to delete this announcement? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteAnnouncement(announcement.announcementId);
      setAnnouncements((prev) =>
        prev.filter((ann) => ann.announcementId !== announcement.announcementId)
      );
      setSuccessMessage("Announcement deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to delete announcement.");
    }
  };

  // ===================================
  // HELPER FUNCTIONS
  // ===================================
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Published":
        return "badge-published";
      case "Draft":
        return "badge-draft";
      case "Scheduled":
        return "badge-scheduled";
      case "Archived":
        return "badge-archived";
      default:
        return "badge-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Published":
        return <CheckCircle size={16} />;
      case "Scheduled":
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

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

  // ===================================
  // RENDER
  // ===================================
  return (
    <div className="announcements-page">
      {/* ===== HEADER ===== */}
      <div className="announcements-header">
        <div>
          <h1>Announcements</h1>
          <p>Create and manage announcements for students and clinic staff.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <Plus size={18} />
          Create Announcement
        </button>
      </div>

      {/* ===== SUCCESS/ERROR MESSAGES ===== */}
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ===== SUMMARY CARDS ===== */}
      <div className="announcements-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Total Announcements</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <span>Published</span>
            <strong>{stats.published}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <Clock size={22} />
          </div>
          <div>
            <span>Scheduled</span>
            <strong>{stats.scheduled}</strong>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon purple">
            <Calendar size={22} />
          </div>
          <div>
            <span>Draft</span>
            <strong>{stats.draft}</strong>
          </div>
        </div>
      </div>

      {/* ===== FILTERS & SEARCH ===== */}
      <div className="announcements-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* ===== ANNOUNCEMENTS TABLE ===== */}
      <div className="announcements-card">
        {loading ? (
          <div className="loading-state">
            <p>Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <h3>No announcements found</h3>
            <p>
              {announcements.length === 0
                ? "Start by creating your first announcement."
                : "No announcements match your filters."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="announcements-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Recipients</th>
                  <th>Priority</th>
                  <th>Published Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((ann) => (
                  <tr key={ann.announcementId}>
                    <td className="cell-id">{ann.announcementId.substring(0, 8)}...</td>
                    <td className="cell-title">{ann.title}</td>
                    <td>{ann.category}</td>
                    <td>{ann.recipients.join(", ")}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(ann.priority)}`}>
                        {ann.priority}
                      </span>
                    </td>
                    <td>{formatDate(ann.publishedAt)}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(ann.status)}`}>
                        {getStatusIcon(ann.status)}
                        {ann.status}
                      </span>
                    </td>
                    <td className="cell-actions">
                      <button
                        className="btn-icon"
                        title="View"
                        onClick={() => handleView(ann)}
                      >
                        <Eye size={16} />
                      </button>

                      {ann.status === "Draft" && (
                        <>
                          <button
                            className="btn-icon"
                            title="Edit"
                            onClick={() => {
                              handleView(ann);
                              handleEdit();
                            }}
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            className="btn-icon"
                            title="Publish"
                            onClick={() => handlePublish(ann)}
                          >
                            <Send size={16} />
                          </button>
                        </>
                      )}

                      {ann.status === "Published" && (
                        <button
                          className="btn-icon"
                          title="Archive"
                          onClick={() => handleArchive(ann)}
                        >
                          <Archive size={16} />
                        </button>
                      )}

                      <button
                        className="btn-icon btn-delete"
                        title="Delete"
                        onClick={() => handleDelete(ann)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== CREATE/EDIT MODAL ===== */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? "Edit Announcement" : "Create New Announcement"}</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="announcement-form">
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Announcement Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter announcement title"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General Announcement">General Announcement</option>
                  <option value="Health Advisory">Health Advisory</option>
                  <option value="Clinic Schedule">Clinic Schedule</option>
                  <option value="Medical Reminder">Medical Reminder</option>
                  <option value="Emergency Announcement">Emergency Announcement</option>
                  <option value="Important Notice">Important Notice</option>
                </select>
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter announcement message"
                  rows={6}
                  required
                />
              </div>

              {/* Recipients */}
              <div className="form-group">
                <label>Target Recipients *</label>
                <div className="checkbox-group">
                  {[
                    "All Students",
                    "All Clinic Staff",
                    "Students Only",
                    "Clinic Staff Only",
                  ].map((recipient) => (
                    <label key={recipient} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.recipients.includes(recipient)}
                        onChange={() => handleRecipientsChange(recipient)}
                      />
                      <span>{recipient}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label htmlFor="priority">Priority Level *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Publication Option */}
              <div className="form-group">
                <label htmlFor="status">Publish Option *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Draft">Save as Draft</option>
                  <option value="Published">Publish Immediately</option>
                  <option value="Scheduled">Schedule Announcement</option>
                </select>
              </div>

              {/* Scheduled Date/Time */}
              {formData.status === "Scheduled" && (
                <div className="form-group">
                  <label htmlFor="scheduledAt">Publication Date & Time *</label>
                  <input
                    id="scheduledAt"
                    type="datetime-local"
                    name="scheduledAt"
                    value={formData.scheduledAt}
                    onChange={handleInputChange}
                    required={formData.status === "Scheduled"}
                  />
                </div>
              )}

              {/* Form Actions */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== VIEW MODAL ===== */}
      {showViewModal && selectedAnnouncement && !isEditing && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Announcement Details</h2>
              <button
                className="btn-close"
                onClick={() => setShowViewModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="announcement-details">
              <div className="detail-row">
                <label>ID:</label>
                <span>{selectedAnnouncement.announcementId}</span>
              </div>

              <div className="detail-row">
                <label>Title:</label>
                <span>{selectedAnnouncement.title}</span>
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

              <div className="detail-row">
                <label>Recipients:</label>
                <span>{selectedAnnouncement.recipients.join(", ")}</span>
              </div>

              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${getStatusBadgeClass(selectedAnnouncement.status)}`}>
                  {getStatusIcon(selectedAnnouncement.status)}
                  {selectedAnnouncement.status}
                </span>
              </div>

              <div className="detail-row">
                <label>Message:</label>
                <div className="message-box">
                  {selectedAnnouncement.message}
                </div>
              </div>

              <div className="detail-row">
                <label>Created:</label>
                <span>{formatDate(selectedAnnouncement.createdAt)}</span>
              </div>

              {selectedAnnouncement.publishedAt && (
                <div className="detail-row">
                  <label>Published:</label>
                  <span>{formatDate(selectedAnnouncement.publishedAt)}</span>
                </div>
              )}

              {selectedAnnouncement.scheduledAt && (
                <div className="detail-row">
                  <label>Scheduled For:</label>
                  <span>{formatDate(selectedAnnouncement.scheduledAt)}</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {selectedAnnouncement.status === "Draft" && (
                <>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      handleEdit();
                      setShowViewModal(false);
                      setShowCreateModal(true);
                    }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>

                  <button
                    className="btn-primary"
                    onClick={() => {
                      handlePublish(selectedAnnouncement);
                      setShowViewModal(false);
                    }}
                  >
                    <Send size={16} />
                    Publish Now
                  </button>
                </>
              )}

              {selectedAnnouncement.status === "Published" && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    handleArchive(selectedAnnouncement);
                    setShowViewModal(false);
                  }}
                >
                  <Archive size={16} />
                  Archive
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announcements;
