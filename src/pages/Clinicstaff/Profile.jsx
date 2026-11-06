import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck,
    Pencil,
    X,
    Save,
} from "lucide-react";
import "../../styles/Profile.css";

const emptyProfile = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    role: "",
    employeeId: "",
    status: "",
    photoURL: "",
    memberSince: "",
};

const formatRole = (role) =>
    String(role || "")
        .replace(/[_-]+/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatMemberSince = (createdAt) => {
    const date = createdAt?.toDate ? createdAt.toDate() : null;
    return date
        ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "";
};

const toProfile = (data, authUser) => {
    const [firstFromName = "", ...restName] = (data.name || authUser?.displayName || "").split(" ");
    return {
        firstName: data.firstName ?? firstFromName,
        middleName: data.middleName ?? "",
        lastName: data.lastName ?? restName.join(" "),
        email: authUser?.email || data.email || "",
        phone: data.phone || data.contact || "",
        address: data.address || "",
        birthDate: data.birthDate || "",
        role: data.role || "",
        employeeId:
            data.employeeId || data.patientId || data.studentId || data.idNumber || "",
        status: data.status || "",
        photoURL: data.photoURL || authUser?.photoURL || "",
        memberSince: formatMemberSince(data.createdAt),
    };
};

function Profile() {
    const { user } = useAuth() || {};
    const uid = user?.uid;

    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [notice, setNotice] = useState(null);
    const [profile, setProfile] = useState(emptyProfile);
    const [formData, setFormData] = useState(emptyProfile);

    useEffect(() => {
        if (!uid) return;

        let active = true;
        getDoc(doc(db, "users", uid))
            .then((snapshot) => {
                if (!active) return;
                if (!snapshot.exists()) {
                    setLoadError("No profile record was found for your account.");
                    return;
                }
                setProfile(toProfile(snapshot.data(), auth.currentUser));
            })
            .catch((error) => {
                console.error("Load profile error:", error);
                if (active) setLoadError("Unable to load your profile. Please try again.");
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [uid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleEditProfile = () => {
        setFormData(profile);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (isSaving || !uid) return;

        setIsSaving(true);
        setNotice(null);

        // Only personal fields are written; role, status and IDs are never sent.
        const updates = {
            firstName: formData.firstName.trim(),
            middleName: formData.middleName.trim(),
            lastName: formData.lastName.trim(),
            birthDate: formData.birthDate,
            phone: formData.phone.trim(),
            contact: formData.phone.trim(),
            address: formData.address.trim(),
        };

        try {
            await updateDoc(doc(db, "users", uid), {
                ...updates,
                updatedAt: serverTimestamp(),
            });

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: [updates.firstName, updates.middleName, updates.lastName]
                        .filter(Boolean)
                        .join(" "),
                });
            }

            setProfile((previous) => ({ ...previous, ...updates }));
            setShowEditModal(false);
            setNotice({ type: "success", text: "Profile updated successfully." });
        } catch (error) {
            console.error("Save profile error:", error);
            setNotice({
                type: "error",
                text:
                    error.code === "permission-denied"
                        ? "You do not have permission to update this profile."
                        : "Unable to save your profile. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!uid) {
        return (
            <div className="profile-page">
                <p role="alert">You must be signed in to view your profile.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="profile-page">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="profile-page">
                <p role="alert">{loadError}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {notice && (
                <p
                    role={notice.type === "error" ? "alert" : "status"}
                    style={{ color: notice.type === "error" ? "#b91c1c" : "#15803d" }}
                >
                    {notice.text}
                </p>
            )}

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="profile-page-header">
                <div>
                    <h1>My Profile</h1>
                    <p>
                        View and manage your personal information
                    </p>
                </div>

                <button
                    className="profile-edit-btn"
                    onClick={handleEditProfile}
                >
                    <Pencil size={17} />
                    Edit Profile
                </button>
            </div>


            {/* =================================================
                PROFILE HERO
            ================================================= */}

            <div className="profile-hero-card">

                <div className="profile-avatar">
                    {profile.photoURL ? (
                        <img
                            src={profile.photoURL}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", borderRadius: "inherit", objectFit: "cover" }}
                        />
                    ) : (
                        <User size={45} />
                    )}
                </div>

                <div className="profile-hero-info">
                    <h2>
                        {[profile.firstName, profile.middleName, profile.lastName]
                            .filter(Boolean)
                            .join(" ")}
                    </h2>

                    <p>{formatRole(profile.role)}</p>

                    <span className="profile-id">
                        ID: {profile.employeeId || "N/A"}
                    </span>
                </div>

                <div className="profile-status">
                    <span className="status-dot"></span>
                    {profile.status
                        ? `${formatRole(profile.status)} Account`
                        : "Account"}
                </div>

            </div>


            {/* =================================================
                PROFILE CONTENT
            ================================================= */}

            <div className="profile-content-grid">

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="profile-card">

                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <User size={19} />
                        </div>

                        <div>
                            <h3>Personal Information</h3>
                            <p>Your basic personal details</p>
                        </div>
                    </div>

                    <div className="profile-info-grid">

                        <div className="profile-info-item">
                            <span>First Name</span>
                            <strong>{profile.firstName}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Middle Name</span>
                            <strong>{profile.middleName}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Last Name</span>
                            <strong>{profile.lastName}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Birth Date</span>
                            <strong>{profile.birthDate}</strong>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTACT INFORMATION
                ================================================= */}

                <div className="profile-card">

                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <Phone size={19} />
                        </div>

                        <div>
                            <h3>Contact Information</h3>
                            <p>Your contact details</p>
                        </div>
                    </div>

                    <div className="profile-contact-list">

                        <div className="profile-contact-item">
                            <div className="contact-icon">
                                <Mail size={17} />
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>{profile.email}</strong>
                            </div>
                        </div>

                        <div className="profile-contact-item">
                            <div className="contact-icon">
                                <Phone size={17} />
                            </div>

                            <div>
                                <span>Phone Number</span>
                                <strong>{profile.phone}</strong>
                            </div>
                        </div>

                        <div className="profile-contact-item">
                            <div className="contact-icon">
                                <MapPin size={17} />
                            </div>

                            <div>
                                <span>Address</span>
                                <strong>{profile.address}</strong>
                            </div>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <div className="profile-card">

                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <div>
                            <h3>Account Information</h3>
                            <p>System account details</p>
                        </div>
                    </div>

                    <div className="profile-account-list">

                        <div className="account-row">
                            <span>Employee ID</span>
                            <strong>{profile.employeeId || "N/A"}</strong>
                        </div>

                        <div className="account-row">
                            <span>Role</span>
                            <strong>{formatRole(profile.role)}</strong>
                        </div>

                        <div className="account-row">
                            <span>Account Status</span>

                            <span className="account-active">
                                {formatRole(profile.status) || "N/A"}
                            </span>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    QUICK DETAILS
                ================================================= */}

                <div className="profile-card">

                    <div className="profile-card-header">
                        <div className="profile-card-icon">
                            <Calendar size={19} />
                        </div>

                        <div>
                            <h3>Profile Details</h3>
                            <p>Additional account information</p>
                        </div>
                    </div>

                    <div className="profile-detail-box">

                        <div>
                            <span>Member Since</span>
                            <strong>{profile.memberSince || "N/A"}</strong>
                        </div>

                        <div>
                            <span>Account Type</span>
                            <strong>{formatRole(profile.role)}</strong>
                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                EDIT PROFILE MODAL
            ================================================= */}

            {showEditModal && (
                <div
                    className="profile-modal-overlay"
                    onClick={handleCloseModal}
                >

                    <div
                        className="profile-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="profile-modal-header">

                            <div>
                                <h2>Edit Profile</h2>
                                <p>
                                    Update your personal information
                                </p>
                            </div>

                            <button
                                type="button"
                                className="profile-modal-close"
                                onClick={handleCloseModal}
                            >
                                <X size={19} />
                            </button>

                        </div>


                        <form onSubmit={handleSaveProfile}>

                            <div className="profile-form-grid">

                                <div className="profile-form-group">
                                    <label>First Name</label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Middle Name</label>

                                    <input
                                        type="text"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Last Name</label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Birth Date</label>

                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="profile-form-group full">
                                    <label>Email Address</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                        title="Email changes require re-verification and are not available here"
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Phone Number</label>

                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="profile-form-group">
                                    <label>Address</label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>


                            <div className="profile-form-actions">

                                <button
                                    type="button"
                                    className="profile-cancel-btn"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="profile-save-btn"
                                    disabled={isSaving}
                                >
                                    <Save size={17} />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Profile;