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
} from "lucide-react";

import "../../styles/NewConsultation.css";

function NewConsultation() {
    // Sample patient data
    // Replace this with data from your database/API when available.
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

    const initialFormData = {
        patientId: "",
        consultationDate: new Date().toISOString().split("T")[0],
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

    const [formData, setFormData] = useState(initialFormData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientList, setShowPatientList] = useState(false);
    const [consultations, setConsultations] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const filteredPatients = patients.filter((patient) => {
        const fullName = [
            patient.firstName,
            patient.middleName,
            patient.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setFormData((previous) => ({
            ...previous,
            patientId: patient.id,
        }));

        setSearchTerm(
            `${patient.firstName} ${
                patient.middleName ? patient.middleName + " " : ""
            }${patient.lastName}`
        );

        setShowPatientList(false);
        setMessage("");
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setSelectedPatient(null);
        setSearchTerm("");
        setShowPatientList(false);
        setMessage("");
        setMessageType("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedPatient) {
            setMessage("Please select a patient before saving.");
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
            patientName: [
                selectedPatient.firstName,
                selectedPatient.middleName,
                selectedPatient.lastName,
            ]
                .filter(Boolean)
                .join(" "),
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

        setFormData(initialFormData);
        setSelectedPatient(null);
        setSearchTerm("");
        setShowPatientList(false);
    };

    return (
        <div className="new-consultation-page">
            {/* Page Header */}
            <div className="consultation-page-header">
                <div className="consultation-header-icon">
                    <Stethoscope size={28} />
                </div>

                <div>
                    <h1>New Consultation</h1>
                    <p>
                        Record patient visits, symptoms, diagnosis, and
                        treatment details.
                    </p>
                </div>
            </div>

            {/* Notification */}
            {message && (
                <div
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
                {/* Patient Information */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <h2>Patient Information</h2>
                            <p>Select the patient for this consultation.</p>
                        </div>
                    </div>

                    <div className="consultation-form-grid">
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
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                        setSelectedPatient(null);
                                        setFormData((previous) => ({
                                            ...previous,
                                            patientId: "",
                                        }));
                                        setShowPatientList(true);
                                    }}
                                    onFocus={() => setShowPatientList(true)}
                                    autoComplete="off"
                                />
                            </div>

                            {showPatientList && searchTerm.trim() && (
                                <div className="patient-search-results">
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map((patient) => (
                                            <button
                                                type="button"
                                                className="patient-result-item"
                                                key={patient.id}
                                                onClick={() =>
                                                    handlePatientSelect(patient)
                                                }
                                            >
                                                <div className="patient-result-avatar">
                                                    <UserRound size={20} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {patient.firstName}{" "}
                                                        {patient.middleName
                                                            ? patient.middleName +
                                                              " "
                                                            : ""}
                                                        {patient.lastName}
                                                    </strong>
                                                    <span>{patient.id}</span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="no-patient-results">
                                            No matching patient found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="consultation-field">
                            <label>Patient ID</label>
                            <input
                                type="text"
                                value={selectedPatient?.id || ""}
                                placeholder="Patient ID"
                                readOnly
                            />
                        </div>
                    </div>

                    {selectedPatient && (
                        <div className="selected-patient-details">
                            <div className="selected-patient-heading">
                                <CheckCircle size={19} />
                                <strong>Selected Patient</strong>
                            </div>

                            <div className="consultation-form-grid">
                                <div className="consultation-field">
                                    <label>Full Name</label>
                                    <input
                                        value={[
                                            selectedPatient.firstName,
                                            selectedPatient.middleName,
                                            selectedPatient.lastName,
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        readOnly
                                    />
                                </div>

                                <div className="consultation-field">
                                    <label>Age</label>
                                    <input
                                        value={selectedPatient.age}
                                        readOnly
                                    />
                                </div>

                                <div className="consultation-field">
                                    <label>Gender</label>
                                    <input
                                        value={selectedPatient.gender}
                                        readOnly
                                    />
                                </div>

                                <div className="consultation-field">
                                    <label>Contact Number</label>
                                    <input
                                        value={selectedPatient.contact}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Consultation Details */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <CalendarDays size={21} />
                        </div>

                        <div>
                            <h2>Consultation Details</h2>
                            <p>Enter the consultation schedule and staff.</p>
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
                                <option value="Follow-up">Follow-up</option>
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

                {/* Medical Assessment */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <Activity size={21} />
                        </div>

                        <div>
                            <h2>Medical Assessment</h2>
                            <p>Document the patient's condition and findings.</p>
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

                {/* Medicine Information */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <Pill size={21} />
                        </div>

                        <div>
                            <h2>Medicine Information</h2>
                            <p>
                                Record any medicine associated with this
                                consultation.
                            </p>
                        </div>
                    </div>

                    <div className="consultation-form-grid">
                        <div className="consultation-field">
                            <label htmlFor="medicine">Medicine Name</label>

                            <input
                                id="medicine"
                                type="text"
                                name="medicine"
                                placeholder="Enter medicine name"
                                value={formData.medicine}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="consultation-field">
                            <label htmlFor="dosage">Dosage</label>

                            <input
                                id="dosage"
                                type="text"
                                name="dosage"
                                placeholder="e.g. 500 mg"
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

                        <div className="consultation-field">
                            <label htmlFor="instructions">
                                Instructions
                            </label>

                            <input
                                id="instructions"
                                type="text"
                                name="instructions"
                                placeholder="e.g. Take after meals"
                                value={formData.instructions}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* Additional Notes */}
                <section className="consultation-card">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <FileText size={21} />
                        </div>

                        <div>
                            <h2>Additional Notes</h2>
                            <p>Include any other relevant information.</p>
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

                {/* Form Actions */}
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

            {/* Recently Saved Consultations */}
            {consultations.length > 0 && (
                <section className="consultation-card saved-consultations">
                    <div className="consultation-card-header">
                        <div className="section-icon">
                            <ClipboardList size={21} />
                        </div>

                        <div>
                            <h2>Recently Saved Consultations</h2>
                            <p>
                                Consultations saved during this page session.
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
                                </tr>
                            </thead>

                            <tbody>
                                {consultations.map((consultation) => (
                                    <tr key={consultation.consultationId}>
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