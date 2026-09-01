import { useState } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Lock,
    Camera,
    Edit3,
    Save,
    X,
} from "lucide-react";
import "../../styles/MyProfile.css";

function MyProfile() {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        firstName: "Admin",
        lastName: "User",
        email: "admin@clinic.com",
        phone: "+63 912 345 6789",
        address: "Cebu City, Philippines",
        role: "Administrator",
        department: "Clinic Administration",
    });

    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEdit = () => {
        setFormData(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    const handleSave = (e) => {
        e.preventDefault();

        setProfile(formData);
        setIsEditing(false);

        alert("Profile updated successfully!");
    };

    return (
        <div className="profile-page">

            {/* Header */}
            <div className="profile-header">
                <div>
                    <h1>My Profile</h1>
                    <p>
                        Manage your personal information and account settings.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        className="edit-profile-btn"
                        onClick={handleEdit}
                    >
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
                            <User size={42} />
                        </div>

                        <button className="camera-btn" title="Change photo">
                            <Camera size={15} />
                        </button>

                    </div>

                    <div className="profile-basic-info">
                        <h2>
                            {profile.firstName} {profile.lastName}
                        </h2>

                        <span className="profile-role">
                            <Shield size={13} />
                            {profile.role}
                        </span>

                        <p>{profile.department}</p>
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
                                <strong>{profile.phone}</strong>
                            </div>
                        </div>

                        <div className="contact-item">
                            <MapPin size={17} />
                            <div>
                                <span>Address</span>
                                <strong>{profile.address}</strong>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Information Card */}
                <div className="profile-card profile-info-card">

                    <div className="profile-card-header">
                        <div>
                            <h2>Personal Information</h2>
                            <p>
                                Update your account information below.
                            </p>
                        </div>

                        <User size={21} />
                    </div>

                    {isEditing ? (
                        <form
                            className="profile-form"
                            onSubmit={handleSave}
                        >

                            <div className="form-row">

                                <div className="form-group">
                                    <label>First Name</label>

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
                                    <label>Last Name</label>

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
                                <label>Email Address</label>

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
                                <label>Phone Number</label>

                                <div className="input-wrapper">
                                    <Phone size={16} />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Address</label>

                                <div className="input-wrapper">
                                    <MapPin size={16} />

                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
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
                                    <label>Department</label>

                                    <input
                                        className="readonly-input"
                                        type="text"
                                        value={formData.department}
                                        readOnly
                                    />
                                </div>

                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                >
                                    <X size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    <Save size={16} />
                                    Save Changes
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
                                <span>Last Name</span>
                                <strong>{profile.lastName}</strong>
                            </div>

                            <div className="information-row">
                                <span>Email Address</span>
                                <strong>{profile.email}</strong>
                            </div>

                            <div className="information-row">
                                <span>Phone Number</span>
                                <strong>{profile.phone}</strong>
                            </div>

                            <div className="information-row">
                                <span>Address</span>
                                <strong>{profile.address}</strong>
                            </div>

                            <div className="information-row">
                                <span>Role</span>
                                <strong>{profile.role}</strong>
                            </div>

                            <div className="information-row">
                                <span>Department</span>
                                <strong>{profile.department}</strong>
                            </div>

                        </div>
                    )}

                </div>

                {/* Security Card */}
                <div className="profile-card security-card">

                    <div className="profile-card-header">
                        <div>
                            <h2>Account Security</h2>
                            <p>
                                Keep your account secure.
                            </p>
                        </div>

                        <Lock size={21} />
                    </div>

                    <div className="security-content">

                        <div className="security-icon">
                            <Lock size={22} />
                        </div>

                        <div>
                            <h3>Password</h3>
                            <p>
                                Your password was last updated recently.
                            </p>
                        </div>

                        <button className="change-password-btn">
                            Change Password
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default MyProfile;

