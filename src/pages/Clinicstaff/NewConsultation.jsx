import { useState } from "react";
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
} from "lucide-react";

import "../../styles/NewConsultation.css";

function NewConsultation() {
    // =====================================================
    // SAMPLE PATIENT DATA
    // =====================================================

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

    // =====================================================
    // SAMPLE MEDICINE DATA
    // =====================================================

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

    // =====================================================
    // INITIAL FORM DATA
    // =====================================================

    const initialFormData = {
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
    };

    // =====================================================
    // STATES
    // =====================================================

    const [formData, setFormData] =
        useState(initialFormData);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [selectedPatient, setSelectedPatient] =
        useState(null);

    const [showPatientList, setShowPatientList] =
        useState(false);

    // MEDICINE DROPDOWN
    const [showMedicineList, setShowMedicineList] =
        useState(false);

    const [consultations, setConsultations] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("");

    // =====================================================
    // FILTER PATIENTS
    // =====================================================

    const filteredPatients =
        patients.filter((patient) => {
            const fullName = [
                patient.firstName,
                patient.middleName,
                patient.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const search =
                searchTerm.toLowerCase();

            return (
                fullName.includes(search) ||
                patient.id
                    .toLowerCase()
                    .includes(search)
            );
        });

    // =====================================================
    // HANDLE FORM CHANGE
    // =====================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =====================================================
    // HANDLE PATIENT SELECT
    // =====================================================

    const handlePatientSelect = (
        patient
    ) => {
        setSelectedPatient(patient);

        setFormData((previous) => ({
            ...previous,
            patientId: patient.id,
        }));

        setSearchTerm(
            `${patient.firstName} ${
                patient.middleName
                    ? patient.middleName + " "
                    : ""
            }${patient.lastName}`
        );

        setShowPatientList(false);
        setMessage("");
    };

    // =====================================================
    // HANDLE MEDICINE SELECT
    // =====================================================

    const handleMedicineSelect = (
        medicine
    ) => {
        setFormData((previous) => ({
            ...previous,
            medicine: medicine.name,
            dosage: medicine.strength,
        }));

        setShowMedicineList(false);
    };

    // =====================================================
    // HANDLE RESET
    // =====================================================

    const handleReset = () => {
        setFormData(initialFormData);

        setSelectedPatient(null);

        setSearchTerm("");

        setShowPatientList(false);

        setShowMedicineList(false);

        setMessage("");

        setMessageType("");
    };

    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = (event) => {
        event.preventDefault();

        // Patient validation
        if (!selectedPatient) {
            setMessage(
                "Please select a patient before saving."
            );

            setMessageType("error");

            return;
        }

        // Required fields validation
        if (
            !formData.consultationType ||
            !formData.clinicStaff.trim() ||
            !formData.symptoms.trim() ||
            !formData.diagnosis.trim()
        ) {
            setMessage(
                "Please complete all required fields."
            );

            setMessageType("error");

            return;
        }

        // Create consultation
        const newConsultation = {
            ...formData,

            consultationId: `CON-${String(
                consultations.length + 1
            ).padStart(3, "0")}`,

            patientName: [
                selectedPatient.firstName,
                selectedPatient.middleName,
                selectedPatient.lastName,
            ]
                .filter(Boolean)
                .join(" "),

            createdAt:
                new Date().toISOString(),
        };

        // Save consultation
        setConsultations((previous) => [
            newConsultation,
            ...previous,
        ]);

        // Success message
        setMessage(
            `Consultation ${newConsultation.consultationId} saved successfully!`
        );

        setMessageType("success");

        // Reset form
        setFormData(initialFormData);

        setSelectedPatient(null);

        setSearchTerm("");

        setShowPatientList(false);

        setShowMedicineList(false);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="new-consultation-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="consultation-page-header">

                <div className="consultation-header-icon">
                    <Stethoscope size={28} />
                </div>

                <div>
                    <h1>
                        New Consultation
                    </h1>

                    <p>
                        Record patient visits,
                        symptoms, diagnosis,
                        and treatment details.
                    </p>
                </div>

            </div>


            {/* =================================================
                NOTIFICATION
            ================================================= */}

            {message && (
                <div
                    className={`consultation-alert ${
                        messageType ===
                        "success"
                            ? "alert-success"
                            : "alert-error"
                    }`}
                >

                    {messageType ===
                    "success" ? (
                        <CheckCircle
                            size={20}
                        />
                    ) : (
                        <AlertCircle
                            size={20}
                        />
                    )}

                    <span>
                        {message}
                    </span>

                </div>
            )}


            <form onSubmit={handleSubmit}>

                {/* =================================================
                    PATIENT INFORMATION
                ================================================= */}

                <section className="consultation-card">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <UserRound
                                size={21}
                            />
                        </div>

                        <div>

                            <h2>
                                Patient Information
                            </h2>

                            <p>
                                Select the patient
                                for this
                                consultation.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-form-grid">

                        {/* SEARCH PATIENT */}

                        <div className="consultation-field patient-search-field">

                            <label htmlFor="patientSearch">
                                Search Patient{" "}
                                <span>*</span>
                            </label>

                            <div className="consultation-search-wrapper">

                                <Search
                                    size={19}
                                />

                                <input
                                    id="patientSearch"
                                    type="text"
                                    placeholder="Search by patient name or ID"
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) => {

                                        setSearchTerm(
                                            event
                                                .target
                                                .value
                                        );

                                        setSelectedPatient(
                                            null
                                        );

                                        setFormData(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                patientId:
                                                    "",
                                            })
                                        );

                                        setShowPatientList(
                                            true
                                        );
                                    }}
                                    onFocus={() =>
                                        setShowPatientList(
                                            true
                                        )
                                    }
                                    autoComplete="off"
                                />

                            </div>


                            {/* PATIENT RESULTS */}

                            {showPatientList &&
                                searchTerm.trim() && (

                                    <div className="patient-search-results">

                                        {filteredPatients.length >
                                        0 ? (

                                            filteredPatients.map(
                                                (
                                                    patient
                                                ) => (

                                                    <button
                                                        type="button"
                                                        className="patient-result-item"
                                                        key={
                                                            patient.id
                                                        }
                                                        onClick={() =>
                                                            handlePatientSelect(
                                                                patient
                                                            )
                                                        }
                                                    >

                                                        <div className="patient-result-avatar">

                                                            <UserRound
                                                                size={
                                                                    20
                                                                }
                                                            />

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    patient.firstName
                                                                }{" "}

                                                                {patient.middleName
                                                                    ? patient.middleName +
                                                                      " "
                                                                    : ""}

                                                                {
                                                                    patient.lastName
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    patient.id
                                                                }
                                                            </span>

                                                        </div>

                                                    </button>

                                                )
                                            )

                                        ) : (

                                            <div className="no-patient-results">
                                                No matching
                                                patient
                                                found.
                                            </div>

                                        )}

                                    </div>

                                )}

                        </div>


                        {/* PATIENT ID */}

                        <div className="consultation-field">

                            <label>
                                Patient ID
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedPatient?.id ||
                                    ""
                                }
                                placeholder="Patient ID"
                                readOnly
                            />

                        </div>

                    </div>


                    {/* SELECTED PATIENT */}

                    {selectedPatient && (

                        <div className="selected-patient-details">

                            <div className="selected-patient-heading">

                                <CheckCircle
                                    size={19}
                                />

                                <strong>
                                    Selected Patient
                                </strong>

                            </div>


                            <div className="consultation-form-grid">

                                <div className="consultation-field">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        value={[
                                            selectedPatient.firstName,
                                            selectedPatient.middleName,
                                            selectedPatient.lastName,
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(" ")}
                                        readOnly
                                    />

                                </div>


                                <div className="consultation-field">

                                    <label>
                                        Age
                                    </label>

                                    <input
                                        value={
                                            selectedPatient.age
                                        }
                                        readOnly
                                    />

                                </div>


                                <div className="consultation-field">

                                    <label>
                                        Gender
                                    </label>

                                    <input
                                        value={
                                            selectedPatient.gender
                                        }
                                        readOnly
                                    />

                                </div>


                                <div className="consultation-field">

                                    <label>
                                        Contact Number
                                    </label>

                                    <input
                                        value={
                                            selectedPatient.contact
                                        }
                                        readOnly
                                    />

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* =================================================
                    CONSULTATION DETAILS
                ================================================= */}

                <section className="consultation-card">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <CalendarDays
                                size={21}
                            />
                        </div>

                        <div>

                            <h2>
                                Consultation Details
                            </h2>

                            <p>
                                Enter the
                                consultation
                                schedule and
                                staff.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-form-grid">

                        {/* DATE */}

                        <div className="consultation-field">

                            <label htmlFor="consultationDate">
                                Consultation Date{" "}
                                <span>*</span>
                            </label>

                            <input
                                id="consultationDate"
                                type="date"
                                name="consultationDate"
                                value={
                                    formData.consultationDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* CONSULTATION TYPE */}

                        <div className="consultation-field">

                            <label htmlFor="consultationType">
                                Consultation Type{" "}
                                <span>*</span>
                            </label>

                            <select
                                id="consultationType"
                                name="consultationType"
                                value={
                                    formData.consultationType
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select
                                    consultation
                                    type
                                </option>

                                <option value="General Checkup">
                                    General Checkup
                                </option>

                                <option value="Medical Consultation">
                                    Medical
                                    Consultation
                                </option>

                                <option value="Follow-up">
                                    Follow-up
                                </option>

                                <option value="Emergency Consultation">
                                    Emergency
                                    Consultation
                                </option>

                            </select>

                        </div>


                        {/* CLINIC STAFF */}

                        <div className="consultation-field full-width">

                            <label htmlFor="clinicStaff">
                                Clinic Staff{" "}
                                <span>*</span>
                            </label>

                            <input
                                id="clinicStaff"
                                type="text"
                                name="clinicStaff"
                                placeholder="Enter clinic staff name"
                                value={
                                    formData.clinicStaff
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MEDICAL ASSESSMENT
                ================================================= */}

                <section className="consultation-card">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <Activity
                                size={21}
                            />
                        </div>

                        <div>

                            <h2>
                                Medical Assessment
                            </h2>

                            <p>
                                Document the
                                patient's
                                condition and
                                findings.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-form-grid">

                        {/* SYMPTOMS */}

                        <div className="consultation-field full-width">

                            <label htmlFor="symptoms">
                                Symptoms / Chief
                                Complaint{" "}
                                <span>*</span>
                            </label>

                            <textarea
                                id="symptoms"
                                name="symptoms"
                                rows="4"
                                placeholder="Describe the patient's symptoms or chief complaint..."
                                value={
                                    formData.symptoms
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* DIAGNOSIS */}

                        <div className="consultation-field full-width">

                            <label htmlFor="diagnosis">
                                Diagnosis{" "}
                                <span>*</span>
                            </label>

                            <textarea
                                id="diagnosis"
                                name="diagnosis"
                                rows="3"
                                placeholder="Enter the diagnosis..."
                                value={
                                    formData.diagnosis
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* TREATMENT */}

                        <div className="consultation-field full-width">

                            <label htmlFor="treatment">
                                Treatment /
                                Management
                            </label>

                            <textarea
                                id="treatment"
                                name="treatment"
                                rows="3"
                                placeholder="Enter treatment or management plan..."
                                value={
                                    formData.treatment
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MEDICINE INFORMATION
                ================================================= */}

                <section className="consultation-card">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <Pill size={21} />
                        </div>

                        <div>

                            <h2>
                                Medicine Information
                            </h2>

                            <p>
                                Select a medicine
                                from the clinic
                                inventory.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-form-grid">

                        {/* =================================================
                            MEDICINE SELECTOR
                        ================================================= */}

                        <div className="consultation-field">

                            <label htmlFor="medicine">
                                Medicine Name
                            </label>

                            <div className="medicine-select-wrapper">

                                <button
                                    type="button"
                                    className={`medicine-select-button ${
                                        formData.medicine
                                            ? "medicine-selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setShowMedicineList(
                                            (
                                                previous
                                            ) =>
                                                !previous
                                        )
                                    }
                                >

                                    <div className="medicine-button-content">

                                        <Pill
                                            size={18}
                                        />

                                        <span>
                                            {formData.medicine
                                                ? formData.medicine
                                                : "Select medicine"}
                                        </span>

                                    </div>

                                    <ChevronDown
                                        size={18}
                                    />

                                </button>


                                {/* MEDICINE LIST */}

                                {showMedicineList && (

                                    <div className="medicine-dropdown">

                                        <div className="medicine-dropdown-header">

                                            <strong>
                                                Available
                                                Medicines
                                            </strong>

                                            <span>
                                                {
                                                    medicines.length
                                                }{" "}
                                                items
                                            </span>

                                        </div>


                                        <div className="medicine-options">

                                            {medicines.map(
                                                (
                                                    medicine
                                                ) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            medicine.id
                                                        }
                                                        className="medicine-option"
                                                        onClick={() =>
                                                            handleMedicineSelect(
                                                                medicine
                                                            )
                                                        }
                                                    >

                                                        <div className="medicine-option-icon">

                                                            <Pill
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </div>


                                                        <div className="medicine-option-info">

                                                            <strong>
                                                                {
                                                                    medicine.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    medicine.strength
                                                                }{" "}
                                                                ·{" "}
                                                                {
                                                                    medicine.unit
                                                                }
                                                            </span>

                                                        </div>


                                                        <div className="medicine-stock">

                                                            <small>
                                                                Stock
                                                            </small>

                                                            <strong>
                                                                {
                                                                    medicine.stock
                                                                }
                                                            </strong>

                                                        </div>

                                                    </button>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* DOSAGE */}

                        <div className="consultation-field">

                            <label htmlFor="dosage">
                                Dosage
                            </label>

                            <input
                                id="dosage"
                                type="text"
                                name="dosage"
                                placeholder="Select a medicine first"
                                value={
                                    formData.dosage
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* QUANTITY */}

                        <div className="consultation-field">

                            <label htmlFor="quantity">
                                Quantity
                            </label>

                            <input
                                id="quantity"
                                type="number"
                                name="quantity"
                                min="1"
                                placeholder="Enter quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* INSTRUCTIONS */}

                        <div className="consultation-field full-width">

                            <label htmlFor="instructions">
                                Medicine Instructions
                            </label>

                            <textarea
                                id="instructions"
                                name="instructions"
                                rows="3"
                                placeholder="Enter instructions for taking the medicine..."
                                value={
                                    formData.instructions
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    ADDITIONAL NOTES
                ================================================= */}

                <section className="consultation-card">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <FileText
                                size={21}
                            />
                        </div>

                        <div>

                            <h2>
                                Additional Notes
                            </h2>

                            <p>
                                Include any other
                                relevant
                                information.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-field">

                        <label htmlFor="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            rows="4"
                            placeholder="Enter additional notes..."
                            value={
                                formData.notes
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>

                </section>


                {/* =================================================
                    FORM ACTIONS
                ================================================= */}

                <div className="consultation-form-actions">

                    <button
                        type="button"
                        className="consultation-reset-btn"
                        onClick={
                            handleReset
                        }
                    >

                        <RotateCcw
                            size={18}
                        />

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


            {/* =================================================
                RECENTLY SAVED CONSULTATIONS
            ================================================= */}

            {consultations.length > 0 && (

                <section className="consultation-card saved-consultations">

                    <div className="consultation-card-header">

                        <div className="section-icon">
                            <ClipboardList
                                size={21}
                            />
                        </div>

                        <div>

                            <h2>
                                Recently Saved
                                Consultations
                            </h2>

                            <p>
                                Consultations
                                saved during
                                this page
                                session.
                            </p>

                        </div>

                    </div>


                    <div className="consultation-table-wrapper">

                        <table className="consultation-table">

                            <thead>

                                <tr>

                                    <th>
                                        Consultation
                                        ID
                                    </th>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Patient ID
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Consultation
                                        Type
                                    </th>

                                    <th>
                                        Medicine
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {consultations.map(
                                    (
                                        consultation
                                    ) => (

                                        <tr
                                            key={
                                                consultation.consultationId
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        consultation.consultationId
                                                    }
                                                </strong>

                                            </td>

                                            <td>
                                                {
                                                    consultation.patientName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    consultation.patientId
                                                }
                                            </td>

                                            <td>
                                                {
                                                    consultation.consultationDate
                                                }
                                            </td>

                                            <td>

                                                <span className="consultation-type-badge">

                                                    {
                                                        consultation.consultationType
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {consultation.medicine ||
                                                    "None"}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            )}

        </div>
    );
}

export default NewConsultation;