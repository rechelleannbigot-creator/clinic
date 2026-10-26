
import { useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Users,
  GraduationCap,
  BookOpen,
  X,
  QrCode,
  Download,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Mail,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/AddPatient.css";

const gradeSections = {
  "Grade 7": ["St. Clare", "St. Rita"],
  "Grade 8": ["St. Alypius", "St.Possidius"],
  "Grade 9": ["St. Nicholas", "St. Ambrose"],
  "Grade 10": ["St. Augustine", "St. Monica"],
  "Grade 11": ["St. Ezekiel", "St. Dominic"],
  "Grade 12": ["Mo.Teresa", "Mo. Evangelista"],
};

const initialPatients = [
  {
    id: "P-001",
    firstName: "Juan",
    middleName: "",
    lastName: "Dela Cruz",
    age: "20",
    gender: "Male",
    contact: "09123456789",
    email: "juan.delacruz@gmail.com",
    yearLevel: "2nd Year",
    course: "BS Information Technology",
    section: "",
  },
  {
    id: "P-002",
    firstName: "Maria",
    middleName: "",
    lastName: "Santos",
    age: "21",
    gender: "Female",
    contact: "09123456780",
    email: "maria.santos@gmail.com",
    yearLevel: "1st Year",
    course: "BS Business Administration",
    section: "",
  },
  {
    id: "P-003",
    firstName: "Robert",
    middleName: "James",
    lastName: "Lee",
    age: "22",
    gender: "Male",
    contact: "09123456781",
    email: "robert.lee@gmail.com",
    yearLevel: "3rd Year",
    course: "BS Computer Science",
    section: "",
  },
  {
    id: "P-004",
    firstName: "Ana",
    middleName: "",
    lastName: "Garcia",
    age: "19",
    gender: "Female",
    contact: "09123456782",
    email: "ana.garcia@gmail.com",
    yearLevel: "Grade 12",
    course: "",
    section: "Mo. Teresa",
  },
  {
    id: "P-005",
    firstName: "Michael",
    middleName: "",
    lastName: "Reyes",
    age: "20",
    gender: "Male",
    contact: "09123456783",
    email: "michael.reyes@gmail.com",
    yearLevel: "2nd Year",
    course: "BS Information Technology",
    section: "",
  },
];

const emptyForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  age: "",
  gender: "",
  contact: "",
  email: "",
  yearLevel: "",
  course: "",
  section: "",
};

function AddPatient() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const getNextPatientId = () => {
    const highestId = patients.reduce((highest, patient) => {
      const number = Number(patient.id.replace("P-", ""));
      return Math.max(highest, number);
    }, 0);

    return `P-${String(highestId + 1).padStart(3, "0")}`;
  };

  const getFullName = (patient) =>
    [patient.firstName, patient.middleName, patient.lastName]
      .filter(Boolean)
      .join(" ");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    window.setTimeout(() => setMessage(""), 3500);
  };

  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    return [
      patient.id,
      patient.firstName,
      patient.middleName,
      patient.lastName,
      patient.email,
      patient.contact,
      patient.yearLevel,
      patient.course,
      patient.section,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));
  });

  const totalYearLevels = new Set(
    patients.map((patient) => patient.yearLevel).filter(Boolean)
  ).size;

  const totalCourses = new Set(
    patients.map((patient) => patient.course).filter(Boolean)
  ).size;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "yearLevel") {
        if (value.startsWith("Grade ")) {
          updated.course = "";
        } else {
          updated.section = "";
        }
      }

      return updated;
    });
  };

  const openAddModal = () => {
    setEditingPatientId(null);
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id);

    setFormData({
      firstName: patient.firstName || "",
      middleName: patient.middleName || "",
      lastName: patient.lastName || "",
      age: patient.age || "",
      gender: patient.gender || "",
      contact: patient.contact || "",
      email: patient.email || "",
      yearLevel: patient.yearLevel || "",
      course: patient.course || "",
      section: patient.section || "",
    });

    setSelectedPatient(null);
    setShowAddModal(true);
  };

  const closeFormModal = () => {
    setShowAddModal(false);
    setEditingPatientId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const requiredFields = [
      ["firstName", "First name"],
      ["lastName", "Last name"],
      ["age", "Age"],
      ["gender", "Gender"],
      ["contact", "Contact number"],
      ["email", "Gmail account"],
      ["yearLevel", "Year level"],
    ];

    for (const [field, label] of requiredFields) {
      if (!String(formData[field] || "").trim()) {
        showMessage(`Please enter ${label.toLowerCase()}.`, "error");
        return;
      }
    }

    const email = formData.email.trim().toLowerCase();

    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      showMessage(
        "Please enter a valid Gmail address ending in @gmail.com.",
        "error"
      );
      return;
    }

    if (
      !Number.isInteger(Number(formData.age)) ||
      Number(formData.age) < 1 ||
      Number(formData.age) > 120
    ) {
      showMessage("Please enter a valid age between 1 and 120.", "error");
      return;
    }

    if (!/^[0-9+\-()\s]+$/.test(formData.contact.trim())) {
      showMessage("Please enter a valid contact number.", "error");
      return;
    }

    const isHighSchool = formData.yearLevel.startsWith("Grade ");

    if (isHighSchool && !formData.section) {
      showMessage("Please select a section.", "error");
      return;
    }

    if (!isHighSchool && !formData.course) {
      showMessage("Please select a course.", "error");
      return;
    }

    const duplicateEmail = patients.some(
      (patient) =>
        patient.email?.toLowerCase() === email &&
        patient.id !== editingPatientId
    );

    if (duplicateEmail) {
      showMessage("This Gmail address is already registered.", "error");
      return;
    }

    if (editingPatientId) {
      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === editingPatientId
            ? {
                ...patient,
                ...formData,
                email,
                age: String(formData.age),
              }
            : patient
        )
      );

      showMessage("Patient information updated successfully.");
    } else {
      const newPatient = {
        ...formData,
        id: getNextPatientId(),
        email,
        age: String(formData.age),
      };

      setPatients((previous) => [...previous, newPatient]);
      showMessage(`Patient ${newPatient.id} added successfully.`);
    }

    closeFormModal();
  };

  const handleDownloadQR = (patient) => {
    const canvas = document.getElementById(`qr-${patient.id}`);

    if (!canvas) {
      showMessage("QR code is not available.", "error");
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${patient.id}-QR-Code.png`;
    link.click();
  };

  const getAcademicInfo = (patient) =>
    patient.yearLevel?.startsWith("Grade ")
      ? patient.section || "Not specified"
      : patient.course || "Not specified";

  return (
    <div className="add-patient-page">
      {/* Page Header */}
      <div className="add-patient-header">
        <div className="add-patient-title">
          <div className="add-patient-title-icon">
            <Users size={28} />
          </div>

          <div>
            <h1>Patients Management</h1>
            <p>Manage patient information and academic records.</p>
          </div>
        </div>

        <button
          type="button"
          className="add-patient-btn"
          onClick={openAddModal}
        >
          <UserPlus size={19} />
          Add New Patient
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div className={`patient-message ${messageType}`}>
          {messageType === "success" ? (
            <CheckCircle size={19} />
          ) : (
            <AlertCircle size={19} />
          )}

          <span>{message}</span>

          <button
            type="button"
            aria-label="Close notification"
            onClick={() => setMessage("")}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="patient-summary-grid">
        <div className="patient-summary-card">
          <div className="patient-summary-icon blue">
            <Users size={25} />
          </div>
          <div>
            <p>Total Patients</p>
            <h2>{patients.length}</h2>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="patient-summary-icon purple">
            <GraduationCap size={25} />
          </div>
          <div>
            <p>Year Levels</p>
            <h2>{totalYearLevels}</h2>
          </div>
        </div>

        <div className="patient-summary-card">
          <div className="patient-summary-icon green">
            <BookOpen size={25} />
          </div>
          <div>
            <p>Courses</p>
            <h2>{totalCourses}</h2>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="patient-table-card">
        <div className="patient-table-header">
          <div>
            <h2>Patient Records</h2>
            <p>View and manage registered patients.</p>
          </div>

          <div className="patient-search">
            <Search size={19} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search patients"
            />

            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="patient-table-wrapper">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Year Level</th>
                <th>Course / Section</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <span className="patient-id">{patient.id}</span>
                    </td>

                    <td>
                      <div className="patient-name-cell">
                        <div className="patient-avatar">
                          <User size={18} />
                        </div>
                        <span>{getFullName(patient)}</span>
                      </div>
                    </td>

                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.yearLevel}</td>
                    <td>{getAcademicInfo(patient)}</td>
                    <td>{patient.contact}</td>

                    <td>
                      <div className="patient-actions">
                        <button
                          type="button"
                          className="patient-action-btn view"
                          title="View patient"
                          aria-label={`View ${getFullName(patient)}`}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="patient-action-btn edit"
                          title="Edit patient"
                          aria-label={`Edit ${getFullName(patient)}`}
                          onClick={() => openEditModal(patient)}
                        >
                          <Pencil size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="patient-empty-state">
                    <Users size={34} />
                    <p>No patient records found.</p>
                    <span>Try another search or add a new patient.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="patient-table-footer">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Add / Edit Patient Modal */}
      {showAddModal && (
        <div
          className="patient-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFormModal();
          }}
        >
          <div
            className="patient-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-form-title"
          >
            <div className="patient-form-modal-header">
              <div className="patient-form-heading">
                <div className="patient-form-heading-icon">
                  <UserPlus size={29} />
                </div>

                <div>
                  <h2 id="patient-form-title">
                    {editingPatientId ? "Edit Patient" : "Add New Patient"}
                  </h2>
                  <p>
                    Enter the patient's personal and academic information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="patient-modal-close"
                onClick={closeFormModal}
                aria-label="Close form"
              >
                <X size={25} />
              </button>
            </div>

            <form className="patient-form" onSubmit={handleSubmit}>
              <div className="patient-form-section">
                <h3>Personal Information</h3>

                <div className="patient-form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="middleName">Middle Name</label>
                    <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      placeholder="Enter middle name"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">
                      Age <span className="required">*</span>
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">
                      Gender <span className="required">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact">
                      Contact Number <span className="required">*</span>
                    </label>
                    <input
                      id="contact"
                      name="contact"
                      type="tel"
                      placeholder="Enter contact number"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Gmail Account */}
                  <div className="form-group">
                    <label htmlFor="email">
                      Gmail Account <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter Gmail address"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                      title="Please enter a Gmail address ending in @gmail.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="patient-form-section">
                <h3>Academic Information</h3>

                <div className="patient-form-grid">
                  <div className="form-group">
                    <label htmlFor="yearLevel">
                      Year Level <span className="required">*</span>
                    </label>
                    <select
                      id="yearLevel"
                      name="yearLevel"
                      value={formData.yearLevel}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select year level</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="Grade 12">Grade 12</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                  </div>

                  {formData.yearLevel.startsWith("Grade ") ? (
                    <div className="form-group">
                      <label htmlFor="section">
                        Section <span className="required">*</span>
                      </label>
                      <select
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select section</option>
                        {(gradeSections[formData.yearLevel] || []).map(
                          (section) => (
                            <option key={section} value={section}>
                              {section}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="course">
                        Course <span className="required">*</span>
                      </label>
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        disabled={!formData.yearLevel}
                      >
                        <option value="">Select course</option>
                        <option value="BS Information Technology">
                          BS Information Technology
                        </option>
                        <option value="BS Computer Science">
                          BS Computer Science
                        </option>
                        <option value="BS Information Systems">
                          BS Information Systems
                        </option>
                        <option value="BS Business Administration">
                          BS Business Administration
                        </option>
                        <option value="BS Accountancy">BS Accountancy</option>
                        <option value="BS Hospitality Management">
                          BS Hospitality Management
                        </option>
                        <option value="Bachelor of Elementary Education">
                          Bachelor of Elementary Education
                        </option>
                        <option value="Bachelor of Secondary Education">
                          Bachelor of Secondary Education
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Preview */}
              {!editingPatientId && (
                <div className="patient-qr-preview">
                  <div className="patient-qr-preview-heading">
                    <QrCode size={21} />
                    <div>
                      <h3>Patient QR Code</h3>
                      <p>
                        A unique QR code will be generated for this patient.
                      </p>
                    </div>
                  </div>

                  <div className="patient-qr-preview-content">
                    <QRCodeCanvas
                      id={`qr-${getNextPatientId()}`}
                      value={getNextPatientId()}
                      size={115}
                      level="H"
                      includeMargin
                    />
                    <div>
                      <strong>{getNextPatientId()}</strong>
                      <p>The QR code identifies the patient's record ID.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="patient-form-footer">
                <button
                  type="button"
                  className="patient-cancel-btn"
                  onClick={closeFormModal}
                >
                  Cancel
                </button>

                <button type="submit" className="patient-submit-btn">
                  {editingPatientId ? (
                    <>
                      <CheckCircle size={19} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <UserPlus size={19} />
                      Add Patient
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div
          className="patient-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPatient(null);
            }
          }}
        >
          <div
            className="patient-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-details-title"
          >
            <div className="patient-details-header">
              <div className="patient-details-header-icon">
                <User size={26} />
              </div>

              <div>
                <h2 id="patient-details-title">Patient Profile</h2>
                <p>Personal and academic information</p>
              </div>

              <button
                type="button"
                className="patient-modal-close"
                onClick={() => setSelectedPatient(null)}
                aria-label="Close patient details"
              >
                <X size={24} />
              </button>
            </div>

            <div className="patient-details-body">
              <div className="patient-profile-banner">
                <div className="patient-profile-avatar">
                  <User size={34} />
                </div>
                <div>
                  <h3>{getFullName(selectedPatient)}</h3>
                  <span className="patient-id">{selectedPatient.id}</span>
                </div>
              </div>

              <div className="patient-details-section">
                <h3>
                  <User size={18} />
                  Personal Information
                </h3>

                <div className="patient-details-grid">
                  <div className="patient-detail-item">
                    <span>First Name</span>
                    <strong>{selectedPatient.firstName}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Middle Name</span>
                    <strong>{selectedPatient.middleName || "—"}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Last Name</span>
                    <strong>{selectedPatient.lastName}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Age</span>
                    <strong>{selectedPatient.age}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Gender</span>
                    <strong>{selectedPatient.gender}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Contact Number</span>
                    <strong>
                      <Phone size={15} />
                      {selectedPatient.contact}
                    </strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>Gmail Account</span>
                    <strong>
                      <Mail size={15} />
                      {selectedPatient.email || "Not provided"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="patient-details-section">
                <h3>
                  <GraduationCap size={19} />
                  Academic Information
                </h3>

                <div className="patient-details-grid">
                  <div className="patient-detail-item">
                    <span>Year Level</span>
                    <strong>{selectedPatient.yearLevel}</strong>
                  </div>

                  <div className="patient-detail-item">
                    <span>
                      {selectedPatient.yearLevel?.startsWith("Grade ")
                        ? "Section"
                        : "Course"}
                    </span>
                    <strong>{getAcademicInfo(selectedPatient)}</strong>
                  </div>
                </div>
              </div>

              {/* Last Visit has been removed from the profile. */}

              <div className="patient-details-section patient-details-qr">
                <h3>
                  <QrCode size={19} />
                  Patient QR Code
                </h3>

                <div className="patient-details-qr-content">
                  <QRCodeCanvas
                    id={`qr-${selectedPatient.id}`}
                    value={selectedPatient.id}
                    size={140}
                    level="H"
                    includeMargin
                  />

                  <div>
                    <strong>{selectedPatient.id}</strong>
                    <p>Use this code to identify the patient's record.</p>

                    <button
                      type="button"
                      className="patient-download-qr-btn"
                      onClick={() => handleDownloadQR(selectedPatient)}
                    >
                      <Download size={17} />
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="patient-details-footer">
              <button
                type="button"
                className="patient-cancel-btn"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="patient-submit-btn"
                onClick={() => openEditModal(selectedPatient)}
              >
                <Pencil size={17} />
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPatient;
