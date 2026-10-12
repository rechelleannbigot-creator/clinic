
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
    Activity,
    UserRound,
    Search,
    CalendarDays,
    ClipboardList,
    Stethoscope,
    Pill,
    Save,
    RotateCcw,
    CheckCircle,
    AlertCircle,
    FileText,
    ChevronDown,
    QrCode,
    Camera,
    X,
} from "lucide-react";

import "../../styles/NewConsultation.css";

function NewConsultation() {
    // =========================================
    // SAMPLE PATIENT DATA
    // Replace with Firebase data when connected.
    // =========================================

    const patients = [
        {
            id: "P-001",
            firstName: "Juan",
            middleName: "Santos",
            lastName: "Dela Cruz",
            age: 25,
            gender: "Male",
            contact: "09123456789",
        },
        {
            id: "P-002",
            firstName: "Maria",
            middleName: "Reyes",
            lastName: "Santos",
            age: 31,
            gender: "Female",
            contact: "09987654321",
        },
        {
            id: "P-003",
            firstName: "Robert",
            middleName: "",
            lastName: "Lee",
            age: 22,
            gender: "Male",
            contact: "09112223334",
        },
        {
            id: "P-004",
            firstName: "Ana",
            middleName: "Garcia",
            lastName: "Garcia",
            age: 28,
            gender: "Female",
            contact: "09223334455",
        },
    ];

    // =========================================
    // SAMPLE MEDICINE DATA
    // =========================================

    const medicines = [
        {
            id: "MED-001",
            name: "Paracetamol",
            strength: "500 mg",
            stock: 50,
            unit: "tablet",
        },
        {
            id: "MED-002",
            name: "Ibuprofen",
            strength: "200 mg",
            stock: 35,
            unit: "tablet",
        },
        {
            id: "MED-003",
            name: "Amoxicillin",
            strength: "500 mg",
            stock: 40,
            unit: "capsule",
        },
        {
            id: "MED-004",
            name: "Cetirizine",
            strength: "10 mg",
            stock: 30,
            unit: "tablet",
        },
        {
            id: "MED-005",
            name: "Loratadine",
            strength: "10 mg",
            stock: 25,
            unit: "tablet",
        },
        {
            id: "MED-006",
            name: "Omeprazole",
            strength: "20 mg",
            stock: 20,
            unit: "capsule",
        },
        {
            id: "MED-007",
            name: "Oral Rehydration Salts",
            strength: "Standard",
            stock: 15,
            unit: "sachet",
        },
    ];

    // =========================================
    // INITIAL FORM DATA
    // =========================================

    const createInitialFormData = () => ({
        patientId: "",
        consultationDate: new Date()
            .toISOString()
            .split("T")[0],
        consultationType: "",
        clinicStaff: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        medicine: "",
        dosage: "",
        quantity: "",
        instructions: "",
        notes: "",
    });

    // =========================================
    // STATES
    // =========================================

    const [formData, setFormData] = useState(
        createInitialFormData
    );

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientList, setShowPatientList] = useState(false);
    const [showMedicineList, setShowMedicineList] = useState(false);
    const [showQrScanner, setShowQrScanner] = useState(false);

    const [consultations, setConsultations] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    // =========================================
    // PATIENT NAME HELPER
    // =========================================

    const getPatientName = (patient) =>
        [
            patient.firstName,
            patient.middleName,
            patient.lastName,
        ]
            .filter(Boolean)
            .join(" ");

    // =========================================
    // FILTER PATIENTS
    // =========================================

    const filteredPatients = patients.filter((patient) => {
        const fullName = getPatientName(patient).toLowerCase();
        const search = searchTerm.trim().toLowerCase();

        return (
            fullName.includes(search) ||
            patient.id.toLowerCase().includes(search)
        );
    });

    // =========================================
    // FORM CHANGE
    // =========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================
    // SELECT PATIENT
    // Used by both search and QR scanner.
    // =========================================

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);

        setFormData((previous) => ({
            ...previous,
            patientId: patient.id,
        }));

        setSearchTerm(getPatientName(patient));
        setShowPatientList(false);
        setMessage("");
        setMessageType("");
    };

    // =========================================
    // QR CODE SCANNER
    //
    // Supported QR contents:
    // P-001
    // {"patientId":"P-001"}
    // {"studentId":"P-001"}
    // {"id":"P-001"}
    //
    // The scanned ID must match a registered patient.
    // =========================================

    useEffect(() => {
        if (!showQrScanner) return undefined;

        let scanner = null;
        let cancelled = false;
        let scanHandled = false;

        const startScanner = async () => {
            try {
                // Allow the scanner container to render first.
                scanner = new Html5Qrcode("patient-qr-reader");

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: {
                            width: 230,
                            height: 230,
                        },
                        aspectRatio: 1,
                    },
                    (decodedText) => {
                        if (cancelled || scanHandled) return;

                        scanHandled = true;

                        let scannedId = decodedText.trim();

                        // Read plain-text IDs or JSON QR data.
                        try {
                            const parsed = JSON.parse(scannedId);

                            if (typeof parsed === "string") {
                                scannedId = parsed.trim();
                            } else if (
                                parsed &&
                                typeof parsed === "object"
                            ) {
                                scannedId = String(
                                    parsed.patientId ??
                                    parsed.studentId ??
                                    parsed.id ??
                                    ""
                                ).trim();
                            }
                        } catch {
                            // QR contains plain text.
                        }

                        const patient = patients.find(
                            (item) =>
                                item.id.toLowerCase() ===
                                scannedId.toLowerCase()
                        );

                        if (patient) {
                            handlePatientSelect(patient);

                            setMessage(
                                `QR code scanned successfully! ${getPatientName(patient)} selected.`
                            );
                            setMessageType("success");
                        } else {
                            setMessage(
                                `No registered patient matches QR data: ${scannedId || "Empty QR code"}.`
                            );
                            setMessageType("error");
                        }

                        setShowPatientList(false);
                        setShowQrScanner(false);
                    },
                    () => {
                        // Ignore normal, unsuccessful scan frames.
                    }
                );

                // The scanner might finish starting after the
                // user has already closed the scanner.
                if (cancelled && scanner.isScanning) {
                    await scanner.stop();
                    scanner.clear();
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("QR scanner error:", error);

                    setMessage(
                        "Unable to open the camera. Allow camera access or use patient search instead."
                    );
                    setMessageType("error");
                    setShowQrScanner(false);
                }
            }
        };

        startScanner();

        return () => {
            cancelled = true;

            if (scanner) {
                if (scanner.isScanning) {
                    scanner
                        .stop()
                        .then(() => scanner.clear())
                        .catch((error) => {
                            console.warn(
                                "Unable to stop QR scanner:",
                                error
                            );
                        });
                } else {
                    try {
                        scanner.clear();
                    } catch {
                        // Scanner may not have initialized.
                    }
                }
            }
        };
    }, [showQrScanner]);

    // =========================================
    // SELECT MEDICINE
    // =========================================

    const handleMedicineSelect = (medicine) => {
        setFormData((previous) => ({
            ...previous,
            medicine: medicine.name,
            dosage: medicine.strength,
        }));

        setShowMedicineList(false);
    };

    // =========================================
    // RESET FORM
    // =========================================

    const handleReset = () => {
        setFormData(createInitialFormData());
        setSelectedPatient(null);
        setSearchTerm("");
        setShowPatientList(false);
        setShowMedicineList(false);
        setShowQrScanner(false);
        setMessage("");
        setMessageType("");
    };

    // =========================================
    // SAVE CONSULTATION
    // =========================================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedPatient) {
            setMessage(
                "Please select a patient using search or the QR scanner."
            );
            setMessageType("error");
            return;
        }

        if (
            !formData.consultationType ||
            !formData.clinicStaff.trim() ||
            !formData.symptoms.trim() ||
            !formData.diagnosis.trim()
        ) {
            setMessage("Please complete all required fields.");
            setMessageType("error");
            return;
        }

        const newConsultation = {
            ...formData,
            consultationId: `CON-${String(
                consultations.length + 1
            ).padStart(3, "0")}`,
            patientName: getPatientName(selectedPatient),
            createdAt: new Date().toISOString(),
        };

        setConsultations((previous) => [
            newConsultation,
            ...previous,
        ]);

        setMessage(
            `Consultation ${newConsultation.consultationId} saved successfully!`
        );
        setMessageType("success");

        setFormData(createInitialFormData());
        setSelectedPatient(null);
        setSearchTerm("");
        setShowPatientList(false);
        setShowMedicineList(false);
        setShowQrScanner(false);
    };

    // =========================================
    // REUSABLE PATIENT INFORMATION FIELD
    // =========================================

    const renderReadOnlyField = (label, value) => (
        <div className="consultation-field" key={label}>
            <label>{label}</label>
            <input value={value ?? ""} readOnly />
        </div>
    );

    // =========================================
    // PAGE UI
    // =========================================

    return (
        <div className="new-consultation-page">
            {/* PAGE HEADER */}
            <div className="consultation-page-header">
                <div className="consultation-header-icon">
                    <Stethoscope size={28} />
                </div>

                <div>
                    <h1>New Consultation</h1>
                    <p>
                        Record patient visits, symptoms,
                        diagnosis, and treatment details.
                    </p>
                </div>
            </div>

            {/* NOTIFICATION */}
            {message && (
                <div
                    role="status"
                    className={`consultation-alert ${
                        messageType === "success"
                            ? "alert-success"
                            : "alert-error"
                    }`}
                >
                    {messageType === "success" ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}
                    <span>{message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* =====================================
                    PATIENT INFORMATION
                ===================================== */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <h2>Patient Information</h2>
                            <p>
                                Scan the student's QR code or
                                search for a registered patient.
                            </p>
                        </div>
                    </div>

                    {/* QR SCANNER */}
                    <div className="patient-qr-section">
                        <div className="patient-qr-description">
                            <div className="patient-qr-icon">
                                <QrCode size={24} />
                            </div>

                            <div>
                                <strong>Scan Student QR Code</strong>
                                <p>
                                    Scan the QR code on the
                                    student's ID to automatically
                                    fill in patient information.
                                </p>
                            </div>
                        </div>

                        {!showQrScanner ? (
                            <button
                                type="button"
                                className="patient-qr-scan-btn"
                                onClick={() => {
                                    setMessage("");
                                    setMessageType("");
                                    setShowPatientList(false);
                                    setShowQrScanner(true);
                                }}
                            >
                                <Camera size={19} />
                                Scan QR Code
                            </button>
                        ) : (
                            <div className="patient-qr-scanner-panel">
                                <div className="patient-qr-scanner-heading">
                                    <span>
                                        <Camera size={18} />
                                        Camera Scanner
                                    </span>

                                    <button
                                        type="button"
                                        aria-label="Close QR scanner"
                                        onClick={() =>
                                            setShowQrScanner(false)
                                        }
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div
                                    id="patient-qr-reader"
                                    className="patient-qr-reader"
                                />

                                <p className="patient-qr-hint">
                                    Position the student's QR
                                    code inside the camera frame.
                                </p>

                                <button
                                    type="button"
                                    className="patient-qr-cancel-btn"
                                    onClick={() =>
                                        setShowQrScanner(false)
                                    }
                                >
                                    Cancel Scanning
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="consultation-form-grid">
                        {/* SEARCH PATIENT */}
                        <div className="consultation-field patient-search-field">
                            <label htmlFor="patientSearch">
                                Search Patient <span>*</span>
                            </label>

                            <div className="consultation-search-wrapper">
                                <Search size={19} />

                                <input
                                    id="patientSearch"
                                    type="text"
                                    placeholder="Search by patient name or ID"
                                    value={searchTerm}
                                    autoComplete="off"
                                    onChange={(event) => {
                                        const value = event.target.value;

                                        setSearchTerm(value);
                                        setSelectedPatient(null);

                                        setFormData((previous) => ({
                                            ...previous,
                                            patientId: "",
                                        }));

                                        setShowPatientList(true);
                                    }}
                                    onFocus={() =>
                                        setShowPatientList(true)
                                    }
                                />
                            </div>

                            {showPatientList &&
                                searchTerm.trim() && (
                                    <div className="patient-search-results">
                                        {filteredPatients.length > 0 ? (
                                            filteredPatients.map(
                                                (patient) => (
                                                    <button
                                                        type="button"
                                                        className="patient-result-item"
                                                        key={patient.id}
                                                        onClick={() =>
                                                            handlePatientSelect(
                                                                patient
                                                            )
                                                        }
                                                    >
                                                        <div className="patient-result-avatar">
                                                            <UserRound size={20} />
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {getPatientName(
                                                                    patient
                                                                )}
                                                            </strong>
                                                            <span>
                                                                {patient.id}
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            )
                                        ) : (
                                            <div className="no-patient-results">
                                                No matching patient found.
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* PATIENT ID */}
                        <div className="consultation-field">
                            <label htmlFor="patientId">
                                Patient ID
                            </label>

                            <input
                                id="patientId"
                                value={selectedPatient?.id || ""}
                                placeholder="Automatically filled"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* AUTOMATICALLY FILLED PATIENT DETAILS */}
                    {selectedPatient && (
                        <div className="selected-patient-details">
                            <div className="selected-patient-heading">
                                <CheckCircle size={19} />
                                <strong>Selected Patient</strong>
                            </div>

                            <div className="consultation-form-grid">
                                {renderReadOnlyField(
                                    "First Name",
                                    selectedPatient.firstName
                                )}

                                {renderReadOnlyField(
                                    "Middle Name",
                                    selectedPatient.middleName || "—"
                                )}

                                {renderReadOnlyField(
                                    "Last Name",
                                    selectedPatient.lastName
                                )}

                                {renderReadOnlyField(
                                    "Age",
                                    selectedPatient.age
                                )}

                                {renderReadOnlyField(
                                    "Gender",
                                    selectedPatient.gender
                                )}

                                {renderReadOnlyField(
                                    "Contact Number",
                                    selectedPatient.contact
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* =====================================
                    CONSULTATION DETAILS
                ===================================== */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <CalendarDays size={21} />
                        </div>

                        <div>
                            <h2>Consultation Details</h2>
                            <p>
                                Enter the consultation date,
                                type, and clinic staff.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-form-grid">
                        <div className="consultation-field">
                            <label htmlFor="consultationDate">
                                Consultation Date <span>*</span>
                            </label>

                            <input
                                id="consultationDate"
                                type="date"
                                name="consultationDate"
                                value={formData.consultationDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="consultation-field">
                            <label htmlFor="consultationType">
                                Consultation Type <span>*</span>
                            </label>

                            <select
                                id="consultationType"
                                name="consultationType"
                                value={formData.consultationType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select consultation type
                                </option>
                                <option value="General Checkup">
                                    General Checkup
                                </option>
                                <option value="Medical Consultation">
                                    Medical Consultation
                                </option>
                                <option value="Follow-up">
                                    Follow-up
                                </option>
                                <option value="Emergency Consultation">
                                    Emergency Consultation
                                </option>
                            </select>
                        </div>

                        <div className="consultation-field full-width">
                            <label htmlFor="clinicStaff">
                                Clinic Staff <span>*</span>
                            </label>

                            <input
                                id="clinicStaff"
                                type="text"
                                name="clinicStaff"
                                placeholder="Enter clinic staff name"
                                value={formData.clinicStaff}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================
                    MEDICAL ASSESSMENT
                ===================================== */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <Activity size={21} />
                        </div>

                        <div>
                            <h2>Medical Assessment</h2>
                            <p>
                                Document the patient's condition
                                and findings.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-form-grid">
                        <div className="consultation-field full-width">
                            <label htmlFor="symptoms">
                                Symptoms / Chief Complaint <span>*</span>
                            </label>

                            <textarea
                                id="symptoms"
                                name="symptoms"
                                rows="4"
                                placeholder="Describe the patient's symptoms or chief complaint..."
                                value={formData.symptoms}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="consultation-field full-width">
                            <label htmlFor="diagnosis">
                                Diagnosis <span>*</span>
                            </label>

                            <textarea
                                id="diagnosis"
                                name="diagnosis"
                                rows="3"
                                placeholder="Enter the diagnosis..."
                                value={formData.diagnosis}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="consultation-field full-width">
                            <label htmlFor="treatment">
                                Treatment / Management
                            </label>

                            <textarea
                                id="treatment"
                                name="treatment"
                                rows="3"
                                placeholder="Enter treatment or management plan..."
                                value={formData.treatment}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================
                    MEDICINE INFORMATION
                ===================================== */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <Pill size={21} />
                        </div>

                        <div>
                            <h2>Medicine Information</h2>
                            <p>
                                Select a medicine from the clinic
                                inventory.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-form-grid">
                        {/* MEDICINE DROPDOWN */}
                        <div className="consultation-field">
                            <label htmlFor="medicineSelector">
                                Medicine Name
                            </label>

                            <div className="medicine-select-wrapper">
                                <button
                                    id="medicineSelector"
                                    type="button"
                                    className={`medicine-select-button ${
                                        formData.medicine
                                            ? "medicine-selected"
                                            : ""
                                    }`}
                                    aria-expanded={showMedicineList}
                                    onClick={() =>
                                        setShowMedicineList(
                                            (previous) => !previous
                                        )
                                    }
                                >
                                    <div className="medicine-button-content">
                                        <Pill size={18} />
                                        <span>
                                            {formData.medicine ||
                                                "Select medicine"}
                                        </span>
                                    </div>

                                    <ChevronDown size={18} />
                                </button>

                                {showMedicineList && (
                                    <div className="medicine-dropdown">
                                        <div className="medicine-dropdown-header">
                                            <strong>
                                                Available Medicines
                                            </strong>
                                            <span>
                                                {medicines.length} items
                                            </span>
                                        </div>

                                        <div className="medicine-options">
                                            {medicines.map((medicine) => (
                                                <button
                                                    type="button"
                                                    key={medicine.id}
                                                    className="medicine-option"
                                                    onClick={() =>
                                                        handleMedicineSelect(
                                                            medicine
                                                        )
                                                    }
                                                >
                                                    <div className="medicine-option-icon">
                                                        <Pill size={18} />
                                                    </div>

                                                    <div className="medicine-option-info">
                                                        <strong>
                                                            {medicine.name}
                                                        </strong>
                                                        <span>
                                                            {medicine.strength}
                                                            {" · "}
                                                            {medicine.unit}
                                                        </span>
                                                    </div>

                                                    <div className="medicine-stock">
                                                        <small>Stock</small>
                                                        <strong>
                                                            {medicine.stock}
                                                        </strong>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="consultation-field">
                            <label htmlFor="dosage">Dosage</label>
                            <input
                                id="dosage"
                                type="text"
                                name="dosage"
                                placeholder="Select a medicine first"
                                value={formData.dosage}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="consultation-field">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                min="1"
                                placeholder="Enter quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="consultation-field full-width">
                            <label htmlFor="instructions">
                                Medicine Instructions
                            </label>

                            <textarea
                                id="instructions"
                                name="instructions"
                                rows="3"
                                placeholder="Enter medicine instructions..."
                                value={formData.instructions}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* =====================================
                    ADDITIONAL NOTES
                ===================================== */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <FileText size={21} />
                        </div>

                        <div>
                            <h2>Additional Notes</h2>
                            <p>
                                Include any other relevant information.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-field">
                        <label htmlFor="notes">Notes</label>

                        <textarea
                            id="notes"
                            name="notes"
                            rows="4"
                            placeholder="Enter additional notes..."
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                </section>

                {/* FORM ACTIONS */}
                <div className="consultation-form-actions">
                    <button
                        type="button"
                        className="consultation-reset-btn"
                        onClick={handleReset}
                    >
                        <RotateCcw size={18} />
                        Clear Form
                    </button>

                    <button
                        type="submit"
                        className="consultation-save-btn"
                    >
                        <Save size={18} />
                        Save Consultation
                    </button>
                </div>
            </form>

            {/* =====================================
                RECENTLY SAVED CONSULTATIONS
            ===================================== */}
            {consultations.length > 0 && (
                <section className="consultation-card saved-consultations">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <ClipboardList size={21} />
                        </div>

                        <div>
                            <h2>Recently Saved Consultations</h2>
                            <p>
                                Consultations saved during this
                                page session.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-table-wrapper">
                        <table className="consultation-table">
                            <thead>
                                <tr>
                                    <th>Consultation ID</th>
                                    <th>Patient</th>
                                    <th>Patient ID</th>
                                    <th>Date</th>
                                    <th>Consultation Type</th>
                                    <th>Medicine</th>
                                </tr>
                            </thead>

                            <tbody>
                                {consultations.map((consultation) => (
                                    <tr
                                        key={consultation.consultationId}
                                    >
                                        <td>
                                            <strong>
                                                {consultation.consultationId}
                                            </strong>
                                        </td>
                                        <td>{consultation.patientName}</td>
                                        <td>{consultation.patientId}</td>
                                        <td>
                                            {consultation.consultationDate}
                                        </td>
                                        <td>
                                            <span className="consultation-type-badge">
                                                {consultation.consultationType}
                                            </span>
                                        </td>
                                        <td>
                                            {consultation.medicine || "None"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}

export default NewConsultation;