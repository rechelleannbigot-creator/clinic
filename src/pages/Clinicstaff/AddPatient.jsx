import { useEffect, useRef, useState } from "react";
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
    Camera,
    Download,
    ScanLine,
    User,
    Phone,
    CalendarDays,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

import "../../styles/AddPatient.css";

const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    gender: "",
    contact: "",
    yearLevel: "",
    course: "",
};

const initialPatients = [
    {
        id: "P-001",
        firstName: "Juan",
        middleName: "",
        lastName: "Dela Cruz",
        age: 20,
        gender: "Male",
        contact: "09123456789",
        yearLevel: "2nd Year",
        course: "BS Information Technology",
        lastVisit: "Sep 02, 2026",
    },
    {
        id: "P-002",
        firstName: "Maria",
        middleName: "",
        lastName: "Santos",
        age: 21,
        gender: "Female",
        contact: "09987654321",
        yearLevel: "3rd Year",
        course: "BS Nursing",
        lastVisit: "Sep 01, 2026",
    },
    {
        id: "P-003",
        firstName: "Robert",
        middleName: "James",
        lastName: "Lee",
        age: 19,
        gender: "Male",
        contact: "09112223344",
        yearLevel: "1st Year",
        course: "BS Information Technology",
        lastVisit: "Aug 28, 2026",
    },
    {
        id: "P-004",
        firstName: "Ana",
        middleName: "",
        lastName: "Garcia",
        age: 22,
        gender: "Female",
        contact: "09223334455",
        yearLevel: "4th Year",
        course: "BS Education",
        lastVisit: "Aug 25, 2026",
    },
    {
        id: "P-005",
        firstName: "Michael",
        middleName: "",
        lastName: "Reyes",
        age: 20,
        gender: "Male",
        contact: "09334445566",
        yearLevel: "2nd Year",
        course: "BS Criminology",
        lastVisit: "Aug 20, 2026",
    },
];

function AddPatient() {
    const [patients, setPatients] = useState(initialPatients);
    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [scannedPatient, setScannedPatient] = useState(null);

    const [formData, setFormData] = useState(initialFormData);
    const [editingPatientId, setEditingPatientId] = useState(null);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const scannerRef = useRef(null);
    const patientsRef = useRef(patients);

    useEffect(() => {
        patientsRef.current = patients;
    }, [patients]);

    // Combine first, middle, and last name.
    const getFullName = (patient) => {
        return [
            patient.firstName,
            patient.middleName,
            patient.lastName,
        ]
            .filter(Boolean)
            .join(" ");
    };

    // Search patients by ID, name, course, or year level.
    const filteredPatients = patients.filter((patient) => {
        const searchText = search.toLowerCase();

        return (
            patient.id.toLowerCase().includes(searchText) ||
            getFullName(patient).toLowerCase().includes(searchText) ||
            patient.course.toLowerCase().includes(searchText) ||
            patient.yearLevel.toLowerCase().includes(searchText)
        );
    });

    // Count distinct year levels and courses.
    const uniqueYearLevels = new Set(
        patients.map((patient) => patient.yearLevel).filter(Boolean)
    ).size;

    const uniqueCourses = new Set(
        patients.map((patient) => patient.course).filter(Boolean)
    ).size;

    // Display a temporary success or error message.
    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);

        window.setTimeout(() => {
            setMessage("");
        }, 3500);
    };

    // Generate the next patient ID.
    const getNextPatientId = () => {
        const highestNumber = patients.reduce((highest, patient) => {
            const number = Number(patient.id.replace("P-", ""));

            return Number.isNaN(number)
                ? highest
                : Math.max(highest, number);
        }, 0);

        return `P-${String(highestNumber + 1).padStart(3, "0")}`;
    };

    // Handle form inputs.
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Open the Add Patient form.
    const openAddModal = () => {
        setEditingPatientId(null);
        setFormData(initialFormData);
        setShowAddModal(true);
    };

    // Close and reset the Add Patient form.
    const closeAddModal = () => {
        setShowAddModal(false);
        setEditingPatientId(null);
        setFormData(initialFormData);
    };

    // Open the Edit Patient form.
    const handleEditPatient = (patient) => {
        setEditingPatientId(patient.id);

        setFormData({
            firstName: patient.firstName || "",
            middleName: patient.middleName || "",
            lastName: patient.lastName || "",
            age: String(patient.age ?? ""),
            gender: patient.gender || "",
            contact: patient.contact || "",
            yearLevel: patient.yearLevel || "",
            course: patient.course || "",
        });

        setShowAddModal(true);
    };

    // Add or update a patient.
    const handleSubmit = (event) => {
        event.preventDefault();

        const requiredFields = [
            "firstName",
            "lastName",
            "age",
            "gender",
            "contact",
            "yearLevel",
            "course",
        ];

        const hasMissingFields = requiredFields.some(
            (field) => !String(formData[field] || "").trim()
        );

        if (hasMissingFields) {
            showMessage("Please complete all required fields.", "error");
            return;
        }

        const age = Number(formData.age);

        if (!Number.isInteger(age) || age < 1 || age > 120) {
            showMessage("Please enter a valid age.", "error");
            return;
        }

        const cleanedData = {
            firstName: formData.firstName.trim(),
            middleName: formData.middleName.trim(),
            lastName: formData.lastName.trim(),
            age,
            gender: formData.gender,
            contact: formData.contact.trim(),
            yearLevel: formData.yearLevel,
            course: formData.course,
        };

        if (editingPatientId) {
            setPatients((previous) =>
                previous.map((patient) =>
                    patient.id === editingPatientId
                        ? {
                              ...patient,
                              ...cleanedData,
                          }
                        : patient
                )
            );

            showMessage("Patient information updated successfully.");
        } else {
            const newPatient = {
                id: getNextPatientId(),
                ...cleanedData,
                lastVisit: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }),
            };

            setPatients((previous) => [...previous, newPatient]);

            showMessage("Patient added successfully.");
        }

        closeAddModal();
    };

    // Download a patient's QR code as a PNG image.
    const handleDownloadQR = (patientId) => {
        const canvas = document.getElementById(`qr-${patientId}`);

        if (!canvas) {
            showMessage("QR code could not be found.", "error");
            return;
        }

        const imageUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");

        downloadLink.href = imageUrl;
        downloadLink.download = `${patientId}-QR-Code.png`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    // Find a patient using the scanned QR code's ID.
    const handleScanSuccess = (decodedText) => {
        const scannedId = decodedText.trim();

        const matchedPatient = patientsRef.current.find(
            (patient) => patient.id.toLowerCase() === scannedId.toLowerCase()
        );

        setShowScanner(false);

        if (matchedPatient) {
            setScannedPatient(matchedPatient);
        } else {
            showMessage(
                `No patient was found with ID ${scannedId}.`,
                "error"
            );
        }
    };

    // Initialize and clean up the QR scanner.
    useEffect(() => {
        if (!showScanner) {
            return undefined;
        }

        const scanner = new Html5QrcodeScanner(
            "patient-qr-reader",
            {
                fps: 10,
                qrbox: {
                    width: 230,
                    height: 230,
                },
                rememberLastUsedCamera: true,
            },
            false
        );

        scannerRef.current = scanner;

        scanner.render(
            (decodedText) => {
                handleScanSuccess(decodedText);

                scanner.clear().catch(() => {});
                scannerRef.current = null;
            },
            () => {
                // Ignore repeated scan errors while the camera is searching.
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {});
                scannerRef.current = null;
            }
        };

        // The scanner is initialized when the scanner modal opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showScanner]);

    const closeScanner = () => {
        setShowScanner(false);
    };

    const closePatientDetails = () => {
        setSelectedPatient(null);
        setScannedPatient(null);
    };

    return (
        <div className="add-patient-page">
            {/* Page Header */}
            <div className="add-patient-header">
                <div>
                    <span className="page-eyebrow">CLINIC STAFF</span>

                    <h1>Patient Management</h1>

                    <p>
                        Manage patient information and identify patients using
                        their QR codes.
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => setShowScanner(true)}
                    >
                        <ScanLine size={18} />
                        Scan Patient QR
                    </button>

                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={openAddModal}
                    >
                        <UserPlus size={18} />
                        Add Patient
                    </button>
                </div>
            </div>

            {/* Notification Message */}
            {message && (
                <div className={`patient-toast ${messageType}`}>
                    {messageType === "error" ? (
                        <AlertCircle size={19} />
                    ) : (
                        <CheckCircle size={19} />
                    )}

                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Dismiss message"
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="patient-summary-grid">
                <div className="patient-summary-card">
                    <div className="summary-icon blue">
                        <Users size={23} />
                    </div>

                    <div>
                        <p>Total Patients</p>
                        <h2>{patients.length}</h2>
                        <span>Registered patients</span>
                    </div>
                </div>

                <div className="patient-summary-card">
                    <div className="summary-icon purple">
                        <GraduationCap size={23} />
                    </div>

                    <div>
                        <p>Year Levels</p>
                        <h2>{uniqueYearLevels}</h2>
                        <span>Different year levels</span>
                    </div>
                </div>

                <div className="patient-summary-card">
                    <div className="summary-icon green">
                        <BookOpen size={23} />
                    </div>

                    <div>
                        <p>Courses</p>
                        <h2>{uniqueCourses}</h2>
                        <span>Different courses</span>
                    </div>
                </div>
            </div>

            {/* Patient Table */}
            <section className="patient-table-card">
                <div className="patient-table-heading">
                    <div>
                        <h2>Patient List</h2>
                        <p>View and manage registered patient records.</p>
                    </div>

                    <div className="patient-search">
                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search name, ID, year level, or course..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                            >
                                <X size={17} />
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
                                <th>Course</th>
                                <th>Contact</th>
                                <th>Last Visit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td>
                                            <span className="patient-id">
                                                {patient.id}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="patient-name-cell">
                                                <div className="patient-avatar">
                                                    <User size={18} />
                                                </div>

                                                <span>
                                                    {getFullName(patient)}
                                                </span>
                                            </div>
                                        </td>

                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>

                                        <td>
                                            <span className="year-level-badge">
                                                {patient.yearLevel}
                                            </span>
                                        </td>

                                        <td>{patient.course}</td>
                                        <td>{patient.contact}</td>
                                        <td>{patient.lastVisit}</td>

                                        <td>
                                            <div className="patient-action-buttons">
                                                <button
                                                    type="button"
                                                    className="icon-action view"
                                                    title="View patient"
                                                    onClick={() =>
                                                        setSelectedPatient(patient)
                                                    }
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="icon-action edit"
                                                    title="Edit patient"
                                                    onClick={() =>
                                                        handleEditPatient(patient)
                                                    }
                                                >
                                                    <Pencil size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9">
                                        <div className="patient-empty-state">
                                            <Users size={35} />

                                            <h3>No patients found</h3>

                                            <p>
                                                Try a different search or add a
                                                new patient.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="patient-table-footer">
                    Showing <strong>{filteredPatients.length}</strong> of{" "}
                    <strong>{patients.length}</strong> patients
                </div>
            </section>

            {/* Add / Edit Patient Modal */}
            {showAddModal && (
                <div
                    className="patient-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeAddModal();
                        }
                    }}
                >
                    <div className="patient-modal add-patient-modal">
                        <div className="patient-modal-header">
                            <div className="modal-title-icon">
                                <UserPlus size={22} />
                            </div>

                            <div>
                                <h2>
                                    {editingPatientId
                                        ? "Edit Patient"
                                        : "Add New Patient"}
                                </h2>

                                <p>
                                    Enter the patient's personal and academic
                                    information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={closeAddModal}
                                aria-label="Close modal"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="patient-modal-body">
                                {/* Personal Information */}
                                <div className="form-section-title">
                                    <User size={18} />
                                    <h3>Personal Information</h3>
                                </div>

                                <div className="patient-form-grid">
                                    <div className="form-group">
                                        <label htmlFor="firstName">
                                            First Name <span>*</span>
                                        </label>

                                        <input
                                            id="firstName"
                                            name="firstName"
                                            type="text"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="Enter first name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="middleName">
                                            Middle Name
                                        </label>

                                        <input
                                            id="middleName"
                                            name="middleName"
                                            type="text"
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            placeholder="Enter middle name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="lastName">
                                            Last Name <span>*</span>
                                        </label>

                                        <input
                                            id="lastName"
                                            name="lastName"
                                            type="text"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Enter last name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="age">
                                            Age <span>*</span>
                                        </label>

                                        <input
                                            id="age"
                                            name="age"
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            placeholder="Enter age"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="gender">
                                            Gender <span>*</span>
                                        </label>

                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact">
                                            Contact Number <span>*</span>
                                        </label>

                                        <input
                                            id="contact"
                                            name="contact"
                                            type="tel"
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            placeholder="Enter contact number"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div className="form-section-title academic-title">
                                    <GraduationCap size={19} />
                                    <h3>Academic Information</h3>
                                </div>

                                <div className="patient-form-grid">
                                    {/* UPDATED YEAR LEVEL DROPDOWN */}
                                    <div className="form-group">
                                        <label htmlFor="yearLevel">
                                            Year Level <span>*</span>
                                        </label>

                                        <select
                                            id="yearLevel"
                                            name="yearLevel"
                                            value={formData.yearLevel}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">
                                                Select year level
                                            </option>

                                            <optgroup label="High School">
                                                <option value="Grade 7">
                                                    Grade 7
                                                </option>

                                                <option value="Grade 8">
                                                    Grade 8
                                                </option>

                                                <option value="Grade 9">
                                                    Grade 9
                                                </option>

                                                <option value="Grade 10">
                                                    Grade 10
                                                </option>
                                            </optgroup>

                                            <optgroup label="Senior High School">
                                                <option value="Grade 11">
                                                    Grade 11
                                                </option>

                                                <option value="Grade 12">
                                                    Grade 12
                                                </option>
                                            </optgroup>

                                            <optgroup label="College">
                                                <option value="1st Year">
                                                    1st Year
                                                </option>

                                                <option value="2nd Year">
                                                    2nd Year
                                                </option>

                                                <option value="3rd Year">
                                                    3rd Year
                                                </option>

                                                <option value="4th Year">
                                                    4th Year
                                                </option>

                                                <option value="5th Year">
                                                    5th Year
                                                </option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="course">
                                            Course <span>*</span>
                                        </label>

                                        <select
                                            id="course"
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">
                                                Select course
                                            </option>

                                            <option value="BS Information Technology">
                                                BS Information Technology
                                            </option>

                                            <option value="BS Nursing">
                                                BS Nursing
                                            </option>

                                            <option value="BS Education">
                                                BS Education
                                            </option>

                                            <option value="BS Criminology">
                                                BS Criminology
                                            </option>

                                            <option value="BS Business Administration">
                                                BS Business Administration
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* QR Code Preview */}
                                {!editingPatientId && (
                                    <div className="patient-qr-preview">
                                        <div className="qr-preview-heading">
                                            <div className="qr-preview-icon">
                                                <QrCode size={21} />
                                            </div>

                                            <div>
                                                <h3>Patient QR Code</h3>

                                                <p>
                                                    A QR code will be generated
                                                    for this patient's ID.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="qr-preview-content">
                                            <div className="qr-canvas-container">
                                                <QRCodeCanvas
                                                    id={`qr-${getNextPatientId()}`}
                                                    value={getNextPatientId()}
                                                    size={145}
                                                    level="H"
                                                    includeMargin
                                                />
                                            </div>

                                            <div className="qr-preview-info">
                                                <span>Patient ID</span>

                                                <strong>
                                                    {getNextPatientId()}
                                                </strong>

                                                <p>
                                                    This QR code contains the
                                                    patient's unique ID. Clinic
                                                    staff can scan it to look up
                                                    the patient record.
                                                </p>

                                                <span className="qr-note">
                                                    The ID is assigned when the
                                                    patient is saved.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Buttons */}
                            <div className="patient-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-cancel"
                                    onClick={closeAddModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <UserPlus size={18} />

                                    {editingPatientId
                                        ? "Save Changes"
                                        : "Add Patient"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Scanner Modal */}
            {showScanner && (
                <div className="patient-modal-overlay">
                    <div className="patient-modal scanner-modal">
                        <div className="patient-modal-header">
                            <div className="modal-title-icon scanner-icon">
                                <ScanLine size={22} />
                            </div>

                            <div>
                                <h2>Scan Patient QR Code</h2>

                                <p>
                                    Scan the QR code to find the patient's
                                    record.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={closeScanner}
                                aria-label="Close scanner"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <div className="scanner-modal-body">
                            <div className="scanner-instructions">
                                <Camera size={19} />

                                <span>
                                    Allow camera access and position the QR code
                                    inside the scanning area.
                                </span>
                            </div>

                            <div id="patient-qr-reader" />

                            <p className="scanner-help-text">
                                If the camera does not start, check your browser
                                permissions and ensure you are using a secure
                                connection such as HTTPS or localhost.
                            </p>
                        </div>

                        <div className="patient-modal-footer">
                            <button
                                type="button"
                                className="btn btn-cancel"
                                onClick={closeScanner}
                            >
                                Close Scanner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Patient Modal */}
            {selectedPatient && (
                <PatientDetailsModal
                    patient={selectedPatient}
                    getFullName={getFullName}
                    onClose={closePatientDetails}
                    onDownloadQR={handleDownloadQR}
                />
            )}

            {/* Scanned Patient Modal */}
            {scannedPatient && (
                <PatientDetailsModal
                    patient={scannedPatient}
                    getFullName={getFullName}
                    onClose={closePatientDetails}
                    onDownloadQR={handleDownloadQR}
                    scanned
                />
            )}
        </div>
    );
}

// Patient Details Modal
function PatientDetailsModal({
    patient,
    getFullName,
    onClose,
    onDownloadQR,
    scanned = false,
}) {
    return (
        <div
            className="patient-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="patient-modal details-modal">
                <div className="patient-modal-header">
                    <div className="modal-title-icon">
                        {scanned ? (
                            <ScanLine size={22} />
                        ) : (
                            <User size={22} />
                        )}
                    </div>

                    <div>
                        <h2>
                            {scanned
                                ? "Scanned Patient Record"
                                : "Patient Details"}
                        </h2>

                        <p>
                            {scanned
                                ? "The QR code matched the following patient."
                                : "Patient personal and academic information."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close patient details"
                    >
                        <X size={21} />
                    </button>
                </div>

                {scanned && (
                    <div className="scan-success-banner">
                        <CheckCircle size={19} />
                        Patient successfully identified using QR code.
                    </div>
                )}

                <div className="patient-details-body">
                    {/* Patient Profile Heading */}
                    <div className="patient-profile-heading">
                        <div className="patient-profile-avatar">
                            <User size={31} />
                        </div>

                        <div>
                            <h3>{getFullName(patient)}</h3>

                            <span className="patient-id">
                                {patient.id}
                            </span>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="details-section">
                        <h3>Personal Information</h3>

                        <div className="details-grid">
                            <DetailItem
                                label="First Name"
                                value={patient.firstName}
                            />

                            <DetailItem
                                label="Middle Name"
                                value={patient.middleName || "—"}
                            />

                            <DetailItem
                                label="Last Name"
                                value={patient.lastName}
                            />

                            <DetailItem
                                label="Age"
                                value={patient.age}
                            />

                            <DetailItem
                                label="Gender"
                                value={patient.gender}
                            />

                            <DetailItem
                                label="Contact Number"
                                value={patient.contact}
                                icon={<Phone size={16} />}
                            />
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="details-section">
                        <h3>Academic Information</h3>

                        <div className="details-grid">
                            <DetailItem
                                label="Year Level"
                                value={patient.yearLevel}
                            />

                            <DetailItem
                                label="Course"
                                value={patient.course}
                            />
                        </div>
                    </div>

                    {/* Clinic Information */}
                    <div className="details-section">
                        <h3>Clinic Information</h3>

                        <div className="details-grid">
                            <DetailItem
                                label="Last Visit"
                                value={
                                    patient.lastVisit || "No visit recorded"
                                }
                                icon={<CalendarDays size={16} />}
                            />
                        </div>
                    </div>

                    {/* Patient QR Code */}
                    <div className="details-qr-section">
                        <div>
                            <h3>Patient QR Code</h3>

                            <p>
                                Use this QR code to identify the patient by ID.
                            </p>
                        </div>

                        <div className="details-qr-code">
                            <QRCodeCanvas
                                id={`qr-${patient.id}`}
                                value={patient.id}
                                size={135}
                                level="H"
                                includeMargin
                            />

                            <strong>{patient.id}</strong>
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline download-qr-button"
                            onClick={() => onDownloadQR(patient.id)}
                        >
                            <Download size={18} />
                            Download QR Code
                        </button>
                    </div>
                </div>

                <div className="patient-modal-footer">
                    <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Reusable Patient Detail Item
function DetailItem({ label, value, icon }) {
    return (
        <div className="detail-item">
            <span className="detail-label">
                {icon}
                {label}
            </span>

            <strong>{value || "—"}</strong>
        </div>
    );
}

export default AddPatient;