import { useState } from "react";
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

function Profile() {
    const [showEditModal, setShowEditModal] = useState(false);

    const [profile, setProfile] = useState({
        firstName: "Juan",
        middleName: "Santos",
        lastName: "Dela Cruz",
        email: "juan.delacruz@email.com",
        phone: "09123456789",
        address: "Isabela, Philippines",
        birthDate: "2001-05-15",
        role: "Clinic Staff",
        employeeId: "STAFF-001",
    });

    const [formData, setFormData] = useState(profile);

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

    const handleSaveProfile = (e) => {
        e.preventDefault();

        setProfile(formData);
        setShowEditModal(false);

        alert("Profile updated successfully.");
    };

    return (
        <div className="profile-page">

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
                    <User size={45} />
                </div>

                <div className="profile-hero-info">
                    <h2>
                        {profile.firstName}{" "}
                        {profile.middleName}{" "}
                        {profile.lastName}
                    </h2>

                    <p>{profile.role}</p>

                    <span className="profile-id">
                        ID: {profile.employeeId}
                    </span>
                </div>

                <div className="profile-status">
                    <span className="status-dot"></span>
                    Active Account
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
                            <strong>{profile.employeeId}</strong>
                        </div>

                        <div className="account-row">
                            <span>Role</span>
                            <strong>{profile.role}</strong>
                        </div>

                        <div className="account-row">
                            <span>Account Status</span>

                            <span className="account-active">
                                Active
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
                            <strong>September 2026</strong>
                        </div>

                        <div>
                            <span>Account Type</span>
                            <strong>Clinic Staff</strong>
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
                                        onChange={handleInputChange}
                                        required
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
                                >
                                    <Save size={17} />
                                    Save Changes
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