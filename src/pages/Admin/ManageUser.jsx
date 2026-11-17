import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  Clock3,
  Eye,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  createManagedStaff,
  deleteManagedStaff,
  getManagedStaff,
  getManagedStaffProfile,
  sendStaffPasswordSetupEmail,
  updateManagedStaff,
} from "../../services/adminStaffService";
import "./ManageUser.css";

const emptyStaff = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  position: "",
  status: "ACTIVE",
};

const displayStatus = (status) => String(status || "").toLowerCase() === "inactive" ? "Inactive" : "Active";
const staffName = (staff) => staff.name || [staff.firstName, staff.middleName, staff.lastName].filter(Boolean).join(" ") || "Staff member";
const dateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const formatDate = (value) => dateValue(value)?.toLocaleDateString() || "—";

function ManageUser() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyUid, setBusyUid] = useState("");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [modal, setModal] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState(emptyStaff);

  const loadStaff = async () => {
    setLoading(true);
    setLoadError("");
    try {
      setStaff(await getManagedStaff());
    } catch (error) {
      setLoadError(error.message || "Unable to load staff accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getManagedStaff()
      .then((records) => { if (active) setStaff(records); })
      .catch((error) => { if (active) setLoadError(error.message || "Unable to load staff accounts."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activeCount = staff.filter((item) => displayStatus(item.status) === "Active").length;
  const inactiveCount = staff.length - activeCount;
  const recentCount = staff.filter((item) => item.recentlyAdded).length;
  const positions = [...new Set(staff.map((item) => item.position).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const result = staff.filter((item) => {
      const matchesSearch = [item.staffId, staffName(item), item.email]
        .some((value) => String(value || "").toLowerCase().includes(keyword));
      const matchesStatus = statusFilter === "all" || displayStatus(item.status).toLowerCase() === statusFilter;
      const matchesPosition = positionFilter === "all" || item.position === positionFilter;
      return matchesSearch && matchesStatus && matchesPosition;
    });
    result.sort((a, b) => {
      if (sortBy === "name-desc") return staffName(b).localeCompare(staffName(a));
      if (sortBy === "date-newest") return (dateValue(b.createdAt)?.getTime() || 0) - (dateValue(a.createdAt)?.getTime() || 0);
      if (sortBy === "date-oldest") return (dateValue(a.createdAt)?.getTime() || 0) - (dateValue(b.createdAt)?.getTime() || 0);
      return staffName(a).localeCompare(staffName(b));
    });
    return result;
  }, [staff, search, statusFilter, positionFilter, sortBy]);

  const openAdd = () => {
    setForm(emptyStaff);
    setNotice(null);
    setModal("add");
  };

  const openEdit = (record) => {
    setSelectedStaff(record);
    setForm({
      firstName: record.firstName || "",
      middleName: record.middleName || "",
      lastName: record.lastName || "",
      email: record.email || "",
      phone: record.phone || "",
      gender: record.gender || "",
      position: record.position || "Clinic Staff",
      status: displayStatus(record.status).toUpperCase(),
    });
    setNotice(null);
    setModal("edit");
  };

  const closeModal = () => {
    if (saving || busyUid) return;
    setModal(null);
    setSelectedStaff(null);
  };

  const openDetails = async (record) => {
    setSelectedStaff(record);
    setModal("view");
    try {
      setSelectedStaff(await getManagedStaffProfile(record.uid));
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Unable to load staff details." });
    }
  };

  const changeForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setNotice(null);
    const payload = {
      ...form,
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      position: form.position.trim(),
    };
    try {
      if (modal === "edit") {
        const updated = await updateManagedStaff(selectedStaff.uid, payload);
        setStaff((previous) => previous.map((item) => item.uid === updated.uid ? updated : item));
        setModal(null);
        setNotice({ type: "success", text: `${staffName(updated)}'s account was updated.` });
      } else {
        const created = await createManagedStaff(payload);
        setStaff((previous) => [...previous, created]);
        let invitationSent = true;
        try {
          await sendStaffPasswordSetupEmail(created.email);
        } catch (error) {
          console.error("Send staff setup email error:", error);
          invitationSent = false;
        }
        setModal(null);
        setNotice({
          type: invitationSent ? "success" : "warning",
          text: invitationSent
            ? `${staffName(created)} was added. A password setup email was sent.`
            : `${staffName(created)} was added, but the setup email could not be sent. Ask them to use Forgot Password on the login page.`,
        });
      }
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Unable to save the staff account." });
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (record) => {
    const nextStatus = displayStatus(record.status) === "Active" ? "INACTIVE" : "ACTIVE";
    const action = nextStatus === "INACTIVE" ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} ${staffName(record)}?`)) return;
    setBusyUid(record.uid);
    setNotice(null);
    try {
      const updated = await updateManagedStaff(record.uid, {
        firstName: record.firstName || "",
        middleName: record.middleName || "",
        lastName: record.lastName || "",
        email: record.email,
        phone: record.phone || "",
        gender: record.gender || "",
        position: record.position || "Clinic Staff",
        status: nextStatus,
      });
      setStaff((previous) => previous.map((item) => item.uid === updated.uid ? updated : item));
      setNotice({ type: "success", text: `${staffName(updated)} was ${action}d.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message || `Unable to ${action} this account.` });
    } finally {
      setBusyUid("");
    }
  };

  const deleteStaff = async (record) => {
    if (!window.confirm(`Delete ${staffName(record)} (${record.staffId})? This permanently removes their sign-in account and staff record.`)) return;
    setBusyUid(record.uid);
    setNotice(null);
    try {
      await deleteManagedStaff(record.uid);
      setStaff((previous) => previous.filter((item) => item.uid !== record.uid));
      if (selectedStaff?.uid === record.uid) setModal(null);
      setNotice({ type: "success", text: `${staffName(record)} was deleted.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Unable to delete this staff account." });
    } finally {
      setBusyUid("");
    }
  };

  const resendSetup = async () => {
    if (!selectedStaff?.email || busyUid) return;
    setBusyUid(selectedStaff.uid);
    setNotice(null);
    try {
      await sendStaffPasswordSetupEmail(selectedStaff.email);
      setNotice({ type: "success", text: `Password setup email sent to ${selectedStaff.email}.` });
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Unable to send the password setup email." });
    } finally {
      setBusyUid("");
    }
  };

  return (
    <div className="manage-user-page">
      <header className="staff-management-header">
        <div>
          <span className="staff-management-eyebrow">ADMINISTRATION</span>
          <h1>Staff Management</h1>
          <p>Manage clinic staff accounts and access.</p>
        </div>
        <button type="button" className="staff-management-add" onClick={openAdd}><Plus size={18} /> Add Staff</button>
      </header>

      {notice && <div className={`staff-management-notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.text}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={16} /></button></div>}

      <section className="staff-summary-grid" aria-label="Staff summary">
        <SummaryCard icon={<Users size={20} />} label="Total Staff" value={staff.length} />
        <SummaryCard icon={<Activity size={20} />} label="Active Staff" value={activeCount} tone="green" />
        <SummaryCard icon={<ShieldCheck size={20} />} label="Inactive Staff" value={inactiveCount} tone="red" />
        <SummaryCard icon={<CalendarDays size={20} />} label="Recently Added" value={recentCount} tone="orange" detail="Last 30 days" />
      </section>

      <section className="staff-management-card">
        <div className="staff-management-toolbar">
          <div><h2>Clinic Staff</h2><p>{filteredStaff.length} of {staff.length} accounts</p></div>
          <label className="staff-management-search"><Search size={18} /><input type="search" placeholder="Search ID, name, or email" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        <div className="staff-management-filters">
          <label>Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </label>
          <label>Position
            <select value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)}>
              <option value="all">All positions</option>{positions.map((position) => <option key={position} value={position}>{position}</option>)}
            </select>
          </label>
          <label>Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="name-asc">Name (A–Z)</option><option value="name-desc">Name (Z–A)</option>
              <option value="date-newest">Date added (newest)</option><option value="date-oldest">Date added (oldest)</option>
            </select>
          </label>
        </div>

        {loadError ? (
          <div className="staff-management-state error"><p>{loadError}</p><button type="button" onClick={loadStaff}><RefreshCw size={16} /> Retry</button></div>
        ) : loading ? (
          <div className="staff-management-state" role="status">Loading staff accounts...</div>
        ) : (
          <div className="staff-management-table-wrap">
            <table className="staff-management-table">
              <thead><tr><th>Staff ID</th><th>Full Name</th><th>Email Address</th><th>Contact Number</th><th>Position</th><th>Status</th><th>Date Registered</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredStaff.length ? filteredStaff.map((record) => (
                  <tr key={record.uid}>
                    <td><span className="staff-id-badge">{record.staffId || "—"}</span></td>
                    <td><div className="staff-name-cell"><span className="staff-name-avatar">{staffName(record).charAt(0).toUpperCase()}</span><strong>{staffName(record)}</strong></div></td>
                    <td>{record.email || "—"}</td><td>{record.phone || "—"}</td><td>{record.position || "Clinic Staff"}</td>
                    <td><span className={`staff-status-badge ${displayStatus(record.status).toLowerCase()}`}>{displayStatus(record.status)}</span></td>
                    <td>{formatDate(record.createdAt)}</td>
                    <td><div className="staff-row-actions">
                      <button type="button" aria-label={`View ${staffName(record)}`} title="View profile" onClick={() => openDetails(record)}><Eye size={16} /></button>
                      <button type="button" aria-label={`Edit ${staffName(record)}`} title="Edit staff" onClick={() => openEdit(record)}><Pencil size={16} /></button>
                      <button type="button" aria-label={`${displayStatus(record.status) === "Active" ? "Deactivate" : "Activate"} ${staffName(record)}`} title={displayStatus(record.status) === "Active" ? "Deactivate account" : "Activate account"} disabled={busyUid === record.uid} onClick={() => toggleStatus(record)}>{displayStatus(record.status) === "Active" ? <ShieldCheck size={16} /> : <Check size={16} />}</button>
                      <button type="button" className="danger" aria-label={`Delete ${staffName(record)}`} title="Delete staff" disabled={busyUid === record.uid} onClick={() => deleteStaff(record)}><Trash2 size={16} /></button>
                    </div></td>
                  </tr>
                )) : <tr><td colSpan="8" className="staff-management-empty">{staff.length ? "No staff match these filters." : "No clinic staff accounts found."}</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {(modal === "add" || modal === "edit") && (
        <div className="staff-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="staff-management-modal" role="dialog" aria-modal="true" aria-labelledby="staff-form-title">
            <header><div><h2 id="staff-form-title">{modal === "edit" ? "Edit Staff" : "Add New Staff"}</h2><p>{modal === "edit" ? `Update ${staffName(selectedStaff)}'s information.` : "Create a clinic staff sign-in account."}</p></div><button type="button" aria-label="Close dialog" disabled={saving} onClick={closeModal}><X size={20} /></button></header>
            <form onSubmit={handleSave}>
              <div className="staff-form-grid">
                <label>First Name <span>*</span><input name="firstName" value={form.firstName} onChange={changeForm} maxLength={100} required /></label>
                <label>Middle Name<input name="middleName" value={form.middleName} onChange={changeForm} maxLength={100} /></label>
                <label>Last Name <span>*</span><input name="lastName" value={form.lastName} onChange={changeForm} maxLength={100} required /></label>
                <label>Email Address <span>*</span><input type="email" name="email" value={form.email} onChange={changeForm} maxLength={254} required /></label>
                <label>Contact Number<input type="tel" name="phone" value={form.phone} onChange={changeForm} maxLength={30} /></label>
                <label>Gender<select name="gender" value={form.gender} onChange={changeForm}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></label>
                <label>Position <span>*</span><input name="position" value={form.position} onChange={changeForm} maxLength={100} placeholder="e.g. Clinic Staff" required /></label>
                <label>Account Status<select name="status" value={form.status} onChange={changeForm}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label>
              </div>
              <p className="staff-form-note">A unique Staff ID is generated automatically. Staff sign in with their email; username login is not configured.</p>
              <footer><button type="button" className="staff-secondary-button" disabled={saving} onClick={closeModal}>Cancel</button><button type="submit" className="staff-management-add" disabled={saving}>{saving ? "Saving..." : modal === "edit" ? <><Check size={17} /> Save Changes</> : <><Plus size={17} /> Add Staff</>}</button></footer>
            </form>
          </section>
        </div>
      )}

      {modal === "view" && selectedStaff && (
        <div className="staff-modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="staff-management-modal staff-detail-modal" role="dialog" aria-modal="true" aria-labelledby="staff-detail-title">
            <header><div><h2 id="staff-detail-title">Staff Profile</h2><p>Complete account and employment information</p></div><button type="button" aria-label="Close dialog" onClick={closeModal}><X size={20} /></button></header>
            <div className="staff-detail-hero"><span className="staff-name-avatar large"><UserRound size={25} /></span><div><h3>{staffName(selectedStaff)}</h3><span>{selectedStaff.staffId || "Staff ID not assigned"}</span></div></div>
            <dl className="staff-detail-grid">
              <Detail icon={<Mail size={16} />} label="Email Address" value={selectedStaff.email} />
              <Detail icon={<Phone size={16} />} label="Contact Number" value={selectedStaff.phone} />
              <Detail icon={<UserRound size={16} />} label="Gender" value={selectedStaff.gender} />
              <Detail icon={<Activity size={16} />} label="Position" value={selectedStaff.position || "Clinic Staff"} />
              <Detail icon={<ShieldCheck size={16} />} label="Account Status" value={displayStatus(selectedStaff.status)} />
              <Detail icon={<CalendarDays size={16} />} label="Date Created" value={formatDate(selectedStaff.createdAt)} />
              <Detail icon={<Clock3 size={16} />} label="Last Login" value={selectedStaff.lastLogin ? formatDate(selectedStaff.lastLogin) : "Not available"} />
            </dl>
            <footer><button type="button" className="staff-secondary-button" disabled={Boolean(busyUid)} onClick={resendSetup}>{busyUid ? "Sending..." : "Resend Password Setup"}</button><button type="button" className="staff-management-add" onClick={() => openEdit(selectedStaff)}><Pencil size={16} /> Edit Staff</button></footer>
          </section>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, tone = "blue", detail = "" }) {
  return <article className={`staff-summary-card ${tone}`}><span className="staff-summary-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div></article>;
}

function Detail({ icon, label, value }) {
  return <div><dt>{icon}{label}</dt><dd>{value || "—"}</dd></div>;
}

export default ManageUser;
