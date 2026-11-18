import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    Shield,
    Lock,
    Camera,
    Edit3,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Trash2,
    Upload,
} from "lucide-react";
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from "../../services/adminProfileService";
import "../../styles/MyProfile.css";

function MyProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [notification, setNotification] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const profileData = await getAdminProfile();
            setProfile(profileData);
            setFormData(profileData);
            setNotification({ type: "", message: "" });
        } catch (error) {
            setNotification({
                type: "error",
                message: error.message || "Failed to load profile",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setNotification({
                type: "error",
                message: "Please select a valid image file (JPEG, PNG, or WebP)",
            });
            return;
        }

        if (file.size > 200 * 1024) {
            setNotification({
                type: "error",
                message: "Image size must be less than 200 KB",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setImagePreview(dataUrl);
            setUploadedFile(dataUrl);
            setFormData({
                ...formData,
                photoURL: dataUrl,
            });
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setImagePreview(null);
        setUploadedFile(null);
        setFormData({
            ...formData,
            photoURL: "",
        });
    };

    const handleEdit = () => {
        setFormData(profile);
        setImagePreview(profile?.photoURL || null);
        setIsEditing(true);
        setNotification({ type: "", message: "" });
    };

    const handleCancel = () => {
        setFormData(profile);
        setImagePreview(null);
        setUploadedFile(null);
        setIsEditing(false);
        setNotification({ type: "", message: "" });
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.firstName.trim()) {
            setNotification({ type: "error", message: "First name is required" });
            return false;
        }
        if (!formData.lastName || !formData.lastName.trim()) {
            setNotification({ type: "error", message: "Last name is required" });
            return false;
        }
        if (!formData.email || !formData.email.trim()) {
            setNotification({ type: "error", message: "Email is required" });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setNotification({ type: "error", message: "Please enter a valid email address" });
            return false;
        }
        if (formData.phone && !/^[\d+()\s-]+$/.test(formData.phone)) {
            setNotification({ type: "error", message: "Please enter a valid contact number" });
            return false;
        }
        if (formData.phone && formData.phone.replace(/\D/g, "").length < 7) {
            setNotification({ type: "error", message: "Contact number must contain at least 7 digits" });
            return false;
        }
        return true;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const updateData = {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            username: formData.username,
        };

        if (uploadedFile) {
            updateData.photoURL = uploadedFile;
        } else if (formData.photoURL === "" && profile?.photoURL) {
            updateData.photoURL = "";
        }

        try {
            setLoading(true);
            const updatedProfile = await updateAdminProfile(updateData);
            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setIsEditing(false);
            setImagePreview(null);
            setUploadedFile(null);
            setNotification({
                type: "success",
                message: "Profile updated successfully!",
            });
            setTimeout(() => {
                setNotification({ type: "", message: "" });
            }, 3000);
        } catch (error) {
            setNotification({
                type: "error",
                message: error.message || "Failed to update profile",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    const validatePasswordForm = () => {
        if (!passwordData.currentPassword) {
            setNotification({ type: "error", message: "Current password is required" });
            return false;
        }
        if (!passwordData.newPassword) {
            setNotification({ type: "error", message: "New password is required" });
            return false;
        }
        if (!passwordData.confirmPassword) {
            setNotification({ type: "error", message: "Please confirm your new password" });
            return false;
        }
        if (passwordData.newPassword.length < 6) {
            setNotification({ type: "error", message: "New password must be at least 6 characters" });
            return false;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setNotification({ type: "error", message: "New passwords do not match" });
            return false;
        }
        return true;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        try {
            setLoading(true);
            await changeAdminPassword(
                passwordData.currentPassword,
                passwordData.newPassword,
                passwordData.confirmPassword
            );
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsChangingPassword(false);
            setNotification({
                type: "success",
                message: "Password changed successfully!",
            });
            setTimeout(() => {
                setNotification({ type: "", message: "" });
            }, 3000);
        } catch (error) {
            setNotification({
                type: "error",
                message: error.message || "Failed to change password",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <div className="error-container">
                    <AlertCircle size={48} />
                    <p>Unable to load profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            {notification.message && (
                <div className={`notification notification-${notification.type}`}>
                    {notification.type === "success" ? (
                        <CheckCircle size={18} />
                    ) : (
                        <AlertCircle size={18} />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="profile-header">
                <div>
                    <h1>My Profile</h1>
                    <p>Manage your personal information and account settings.</p>
                </div>

                {!isEditing && !isChangingPassword && (
                    <button className="edit-profile-btn" onClick={handleEdit} disabled={loading}>
                        <Edit3 size={17} />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="profile-layout">
                {/* Profile Card */}
                <div className="profile-card profile-main-card">
                    <div className="profile-cover"></div>

                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="avatar-image" />
                            ) : profile?.photoURL ? (
                                <img src={profile.photoURL} alt="Profile" className="avatar-image" />
                            ) : (
                                <User size={42} />
                            )}
                        </div>

                        {isEditing && (
                            <>
                                <label className="camera-btn" title="Change photo">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        style={{ display: "none" }}
                                    />
                                    <Camera size={15} />
                                </label>
                            </>
                        )}
                    </div>

                    <div className="profile-basic-info">
                        <h2>{profile.fullName || `${profile.firstName} ${profile.lastName}`}</h2>

                        <span className="profile-role">
                            <Shield size={13} />
                            {profile.role}
                        </span>

                        <p>{profile.accountStatus}</p>
                    </div>

                    <div className="profile-divider"></div>

                    <div className="profile-contact">
                        <div className="contact-item">
                            <Mail size={17} />
                            <div>
                                <span>Email</span>
                                <strong>{profile.email}</strong>
                            </div>
                        </div>

                        <div className="contact-item">
                            <Phone size={17} />
                            <div>
                                <span>Phone</span>
                                <strong>{profile.phone || "Not provided"}</strong>
                            </div>
                        </div>

                        <div className="contact-item">
                            <User size={17} />
                            <div>
                                <span>Username</span>
                                <strong>{profile.username}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Card */}
                <div className="profile-card profile-info-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Personal Information</h2>
                            <p>Update your account information below.</p>
                        </div>
                        <User size={21} />
                    </div>

                    {isEditing ? (
                        <form className="profile-form" onSubmit={handleSave}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <div className="input-wrapper">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Middle Name</label>
                                    <div className="input-wrapper">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <div className="input-wrapper">
                                        <User size={16} />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <div className="input-wrapper">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Contact Number</label>
                                <div className="input-wrapper">
                                    <Phone size={16} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+63 XXX XXX XXXX"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Username</label>
                                <div className="input-wrapper">
                                    <User size={16} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        className="readonly-input"
                                        type="text"
                                        value={formData.role}
                                        readOnly
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Account Status</label>
                                    <input
                                        className="readonly-input"
                                        type="text"
                                        value={formData.accountStatus}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="photo-section">
                                    <label>Profile Picture</label>
                                    {imagePreview || profile?.photoURL ? (
                                        <div className="photo-preview-container">
                                            <img
                                                src={imagePreview || profile?.photoURL}
                                                alt="Profile Preview"
                                                className="photo-preview"
                                            />
                                            <button
                                                type="button"
                                                className="remove-photo-btn"
                                                onClick={removePhoto}
                                            >
                                                <Trash2 size={14} />
                                                Remove Photo
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="photo-upload">
                                            <Upload size={20} />
                                            <span>Click to upload a profile picture</span>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageChange}
                                                style={{ display: "none" }}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    <Save size={16} />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="information-list">
                            <div className="information-row">
                                <span>First Name</span>
                                <strong>{profile.firstName}</strong>
                            </div>

                            <div className="information-row">
                                <span>Middle Name</span>
                                <strong>{profile.middleName || "—"}</strong>
                            </div>

                            <div className="information-row">
                                <span>Last Name</span>
                                <strong>{profile.lastName}</strong>
                            </div>

                            <div className="information-row">
                                <span>Email Address</span>
                                <strong>{profile.email}</strong>
                            </div>

                            <div className="information-row">
                                <span>Contact Number</span>
                                <strong>{profile.phone || "—"}</strong>
                            </div>

                            <div className="information-row">
                                <span>Username</span>
                                <strong>{profile.username}</strong>
                            </div>

                            <div className="information-row">
                                <span>Role</span>
                                <strong>{profile.role}</strong>
                            </div>

                            <div className="information-row">
                                <span>Account Status</span>
                                <strong>{profile.accountStatus}</strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Security Card */}
                <div className="profile-card security-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Account Security</h2>
                            <p>Keep your account secure.</p>
                        </div>
                        <Shield size={21} />
                    </div>

                    <div className="security-info">
                        <div className="security-item">
                            <div className="security-icon">
                                <Mail size={18} />
                            </div>
                            <div className="security-item-content">
                                <h4>Email Verification</h4>
                                <p>{profile.emailVerified ? "✓ Email verified" : "⚠ Email not verified"}</p>
                            </div>
                        </div>

                        <div className="security-item">
                            <div className="security-icon">
                                <Shield size={18} />
                            </div>
                            <div className="security-item-content">
                                <h4>Account Status</h4>
                                <p>{profile.accountStatus}</p>
                            </div>
                        </div>

                        {profile.lastLogin && (
                            <div className="security-item">
                                <div className="security-icon">
                                    <User size={18} />
                                </div>
                                <div className="security-item-content">
                                    <h4>Last Login</h4>
                                    <p>{new Date(profile.lastLogin).toLocaleString()}</p>
                                </div>
                            </div>
                        )}

                        {profile.dateCreated && (
                            <div className="security-item">
                                <div className="security-icon">
                                    <User size={18} />
                                </div>
                                <div className="security-item-content">
                                    <h4>Account Created</h4>
                                    <p>{new Date(profile.dateCreated).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Change Password Card */}
                <div className="profile-card password-card">
                    <div className="profile-card-header">
                        <div>
                            <h2>Change Password</h2>
                            <p>Update your password regularly for better security.</p>
                        </div>
                        <Lock size={21} />
                    </div>

                    {isChangingPassword ? (
                        <form className="password-form" onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Current Password *</label>
                                <div className="input-wrapper password-input">
                                    <Lock size={16} />
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                current: !showPasswords.current,
                                            })
                                        }
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password *</label>
                                <div className="input-wrapper password-input">
                                    <Lock size={16} />
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                new: !showPasswords.new,
                                            })
                                        }
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password *</label>
                                <div className="input-wrapper password-input">
                                    <Lock size={16} />
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() =>
                                            setShowPasswords({
                                                ...showPasswords,
                                                confirm: !showPasswords.confirm,
                                            })
                                        }
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                        setNotification({ type: "", message: "" });
                                    }}
                                    disabled={loading}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={loading}
                                >
                                    <Lock size={16} />
                                    {loading ? "Updating..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="password-info">
                            <p>Secure your account by changing your password regularly.</p>
                            <button
                                className="change-password-btn"
                                onClick={() => setIsChangingPassword(true)}
                                disabled={loading}
                            >
                                <Lock size={16} />
                                Change Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
