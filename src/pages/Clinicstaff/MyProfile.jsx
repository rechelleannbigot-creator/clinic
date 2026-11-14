import { useEffect, useState } from "react";
import { BriefcaseBusiness, Camera, LockKeyhole, Pencil, Save, UserRound, X } from "lucide-react";
import { changeStaffPassword, getStaffProfile, saveStaffProfile } from "../../services/staffProfileService";
import "../../styles/StaffMyProfile.css";

const editable = ["firstName", "middleName", "lastName", "gender", "birthDate", "phone", "address"];
const valueOrDash = (value) => value || "Not provided";

function calculateAge(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "";
  const birth = new Date(`${value}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "";
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear() -
    (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate()) ? 1 : 0);
  return age >= 0 ? age : "";
}

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({});
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [readingPhoto, setReadingPhoto] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notice, setNotice] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    getStaffProfile().then((data) => {
      if (active) setProfile(data);
    }).catch((error) => {
      if (active) setLoadError(error.message);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const beginEdit = () => {
    setDraft(Object.fromEntries(editable.map((key) => [key, profile[key] || ""])));
    setPhoto(null);
    setNotice(null);
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    setPhoto(null);
    setNotice(null);
  };
  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 200 * 1024) {
      event.target.value = "";
      setNotice({ type: "error", text: "Choose a JPEG, PNG, or WebP image no larger than 200 KB." });
      return;
    }
    setReadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setReadingPhoto(false);
      setNotice(null);
    };
    reader.onerror = () => {
      setReadingPhoto(false);
      setNotice({ type: "error", text: "Unable to read the selected image." });
    };
    reader.readAsDataURL(file);
  };
  const save = async (event) => {
    event.preventDefault();
    if (saving || readingPhoto) return;
    setSaving(true);
    setNotice(null);
    try {
      const result = await saveStaffProfile({ ...draft, ...(photo !== null ? { photoURL: photo } : {}) });
      setProfile(result);
      setEditing(false);
      setPhoto(null);
      setNotice({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Unable to save your profile." });
    } finally {
      setSaving(false);
    }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    if (changingPassword) return;
    if (passwords.next.length < 6 || passwords.next !== passwords.confirm) {
      setNotice({ type: "error", text: "Your new password must be at least 6 characters and both entries must match." });
      return;
    }
    setChangingPassword(true);
    setNotice(null);
    try {
      await changeStaffPassword(passwords.current, passwords.next);
      setPasswords({ current: "", next: "", confirm: "" });
      setNotice({ type: "success", text: "Password changed successfully." });
    } catch (error) {
      const messages = {
        "auth/invalid-credential": "The current password is incorrect.",
        "auth/wrong-password": "The current password is incorrect.",
        "auth/weak-password": "The new password does not meet the account password policy.",
        "auth/password-does-not-meet-requirements": "The new password does not meet the account password policy.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };
      setNotice({ type: "error", text: messages[error.code] || (error.code ? "Unable to change your password. Please try again." : error.message) });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <div className="staff-my-profile"><p role="status">Loading your profile...</p></div>;
  if (loadError) return <div className="staff-my-profile"><p role="alert">{loadError}</p><button type="button" onClick={() => window.location.reload()}>Retry</button></div>;

  const fields = [
    ["First Name", profile.firstName], ["Middle Name", profile.middleName], ["Last Name", profile.lastName],
    ["Gender", profile.gender], ["Date of Birth", profile.birthDate], ["Age", calculateAge(profile.birthDate)],
    ["Contact Number", profile.phone], ["Email Address", profile.email], ["Home Address", profile.address],
  ];
  const employment = [
    ["Employee ID", profile.employeeId], ["Position", profile.position], ["Department", profile.department],
    ["Employment Status", profile.employmentStatus], ["Date Hired", profile.dateHired], ["Role", profile.role],
  ];
  return (
    <div className="staff-my-profile">
      <header className="staff-profile-heading">
        <div><h1>My Profile</h1><p>View and manage your personal information</p></div>
        {!editing && <button className="staff-profile-primary" type="button" onClick={beginEdit}><Pencil size={17} /> Edit Profile</button>}
      </header>
      {notice && <div className={`staff-profile-notice ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.text}</div>}
      <div className="staff-profile-hero">
        <div className="staff-profile-avatar">
          {(photo || profile.photoURL) ? <img src={photo || profile.photoURL} alt="Your profile" /> : <UserRound size={42} />}
        </div>
        <div><h2>{[profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") || "Your profile"}</h2><p>{valueOrDash(profile.position)}</p><span>Employee ID: {valueOrDash(profile.employeeId)}</span></div>
      </div>
      {editing ? (
        <form className="staff-profile-card" onSubmit={save}>
          <h2><Pencil size={20} /> Edit personal information</h2>
          <div className="staff-profile-grid">
            {[["firstName", "First Name", "text"], ["middleName", "Middle Name", "text"], ["lastName", "Last Name", "text"],
              ["gender", "Gender", "text"], ["birthDate", "Date of Birth", "date"], ["phone", "Contact Number", "tel"],
              ["address", "Home Address", "text"]].map(([key, label, type]) => (
              <label key={key}>{label}<input type={type} name={key} value={draft[key]} required={key === "firstName" || key === "lastName"} maxLength={key === "address" ? 300 : key === "gender" ? 50 : key === "phone" ? 30 : 100} onChange={(event) => setDraft((old) => ({ ...old, [key]: event.target.value }))} /></label>
            ))}
            <label>Email Address<input type="email" value={profile.email} readOnly /><small>Login email is managed through your account administrator.</small></label>
            <label className="staff-profile-photo-input"><span><Camera size={16} /> Profile picture</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={saving || readingPhoto} onChange={choosePhoto} /><small>{readingPhoto ? "Reading image..." : "JPEG, PNG or WebP, up to 200 KB."}</small></label>
          </div>
          <div className="staff-profile-actions"><button type="button" disabled={saving || readingPhoto} onClick={cancelEdit}><X size={17} /> Cancel</button><button className="staff-profile-primary" disabled={saving || readingPhoto} type="submit"><Save size={17} /> {saving ? "Saving..." : "Save Changes"}</button></div>
        </form>
      ) : (
        <div className="staff-profile-cards">
          <section className="staff-profile-card"><h2><UserRound size={20} /> Personal Information</h2><div className="staff-profile-details">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{valueOrDash(value === 0 ? "0" : value)}</strong></div>)}</div></section>
          <section className="staff-profile-card"><h2><BriefcaseBusiness size={20} /> Employment Information</h2><div className="staff-profile-details">{employment.map(([label, value]) => <div key={label}><span>{label}</span><strong>{valueOrDash(value)}</strong></div>)}</div></section>
        </div>
      )}
      <section className="staff-profile-card staff-profile-password">
        <h2><LockKeyhole size={20} /> Change Password</h2><p>Confirm your current password before choosing a new one.</p>
        <form onSubmit={changePassword}>
          <div className="staff-profile-grid">{[["current", "Current Password", "current-password"], ["next", "New Password", "new-password"], ["confirm", "Confirm New Password", "new-password"]].map(([key, label, autoComplete]) => <label key={key}>{label}<input required type="password" autoComplete={autoComplete} value={passwords[key]} onChange={(event) => setPasswords((old) => ({ ...old, [key]: event.target.value }))} /></label>)}</div>
          <div className="staff-profile-actions"><button type="submit" className="staff-profile-primary" disabled={changingPassword}>{changingPassword ? "Changing..." : "Change Password"}</button></div>
        </form>
      </section>
    </div>
  );
}

export default MyProfile;
