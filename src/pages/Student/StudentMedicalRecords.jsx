import { useState } from "react";
import {
    Search,
    User,
    Eye,
    ArrowLeft,
    Calendar,
    Phone,
    MapPin,
    GraduationCap,
    HeartPulse,
    ShieldCheck,
    Activity,
    Hospital,
    Users,
    FileText,
} from "lucide-react";

import "../../styles/StudentMedicalProfile.css";

function StudentMedicalProfile() {
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);

    // ============================================
    // SAMPLE STUDENTS
    // ============================================
    const students = [
        {
            id: "P-001",
            lastName: "CASTILLO",
            firstName: "CHRISTIAN",
            middleInitial: "M",
            yearSection: "BSed 4",
            address: "LDA - Brgy. Leda, Isabela",
            emergencyContact: "0906-991-5588",
            dateOfBirth: "November 04, 2004",
            age: "22",
            sex: "Male",
            height: "170 cm",
            weight: "65 kg",
            nationality: "Filipino",
            religion: "Catholic",
            bloodType: "O+",

            allergy: "No",
            foodAllergy: "",
            medicineAllergy: "",
            otherAllergy: "",

            immunized: "Yes",
            vaccines: {
                hepA: "Completed",
                hepB: "Completed",
                typhoid: "Completed",
                rabies: "",
                influenza: "Completed",
                chickenPox: "Completed",
                measles: "Completed",
                cholera: "",
                dpt: "Completed",
                opv: "Completed",
            },

            diseases: {
                measles: "",
                mumps: "",
                hepA: "",
                hepB: "",
                typhoidFever: "",
                chickenPox: "",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                others: "",
            },

            hospitalized: "Yes",
            lastHospitalized: "2023",
            hospitalizationCause: "Fever",
            medicationTaken: "Prescribed medication",
            hospitalConfined: "Local hospital",
            operation: "No",
            operationAge: "",
            operationCause: "",

            familyHistory: {
                cardiacDisease: "None reported",
                hypertension: "None reported",
                diabetes: "None reported",
                tuberculosis: "None reported",
                asthma: "None reported",
            },

            parentSignature: "Christian J. Castillo",
        },

        {
            id: "P-002",
            lastName: "SANTOS",
            firstName: "MARIA",
            middleInitial: "L",
            yearSection: "BSN 3",
            address: "Burgos, Isabela",
            emergencyContact: "0912-345-6789",
            dateOfBirth: "August 15, 2005",
            age: "21",
            sex: "Female",
            height: "160 cm",
            weight: "55 kg",
            nationality: "Filipino",
            religion: "Catholic",
            bloodType: "A+",

            allergy: "Yes",
            foodAllergy: "Shrimp",
            medicineAllergy: "None",
            otherAllergy: "None",

            immunized: "Yes",
            vaccines: {
                hepA: "Completed",
                hepB: "Completed",
                typhoid: "",
                rabies: "",
                influenza: "Completed",
                chickenPox: "Completed",
                measles: "Completed",
                cholera: "",
                dpt: "Completed",
                opv: "Completed",
            },

            diseases: {
                measles: "",
                mumps: "",
                hepA: "",
                hepB: "",
                typhoidFever: "",
                chickenPox: "Childhood",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                others: "",
            },

            hospitalized: "No",
            lastHospitalized: "",
            hospitalizationCause: "",
            medicationTaken: "",
            hospitalConfined: "",
            operation: "No",
            operationAge: "",
            operationCause: "",

            familyHistory: {
                cardiacDisease: "None reported",
                hypertension: "Mother",
                diabetes: "None reported",
                tuberculosis: "None reported",
                asthma: "None reported",
            },

            parentSignature: "Maria L. Santos",
        },
    ];

    // ============================================
    // SEARCH
    // ============================================
    const filteredStudents = students.filter((student) =>
        `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // ============================================
    // PROFILE VIEW
    // ============================================
    if (selectedStudent) {
        const student = selectedStudent;

        return (
            <div className="student-medical-profile-page">

                {/* PROFILE HEADER */}
                <div className="medical-profile-header">
                    <button
                        className="back-profile-button"
                        onClick={() => setSelectedStudent(null)}
                    >
                        <ArrowLeft size={18} />
                        Back to Students
                    </button>

                    <div className="profile-header-content">
                        <div className="profile-header-icon">
                            <FileText size={30} />
                        </div>

                        <div>
                            <h1>Student Medical Profile</h1>
                            <p>
                                Complete medical health information and history
                            </p>
                        </div>
                    </div>
                </div>

                {/* PROFILE CARD */}
                <div className="medical-form-container">

                    {/* SCHOOL HEADER */}
                    <div className="school-header">
                        <div className="school-logo">
                            <HeartPulse size={35} />
                        </div>

                        <div>
                            <h2>LA CONSOLACION COLLEGE ISABELA</h2>
                            <h3>ISABELA NEGROS OCCIDENTAL</h3>
                            <h4>HEALTH SERVICES CENTER</h4>
                        </div>
                    </div>

                    <div className="form-instruction">
                        <strong>Instruction:</strong>
                        <p>
                            This medical profile contains the student's
                            personal information, medical history,
                            hospitalization information, and family history.
                        </p>
                    </div>

                    {/* ==========================================
                        I. PERSONAL INFORMATION
                    ========================================== */}
                    <section className="medical-section">

                        <div className="section-title">
                            <span>01</span>
                            <div>
                                <h2>Personal Information</h2>
                                <p>Student's basic personal details</p>
                            </div>
                        </div>

                        <div className="personal-name-grid">

                            <div className="medical-field">
                                <label>Last Name</label>
                                <div className="field-value">
                                    {student.lastName}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>First Name</label>
                                <div className="field-value">
                                    {student.firstName}
                                </div>
                            </div>

                            <div className="medical-field small-field">
                                <label>Middle Initial</label>
                                <div className="field-value">
                                    {student.middleInitial}
                                </div>
                            </div>

                        </div>

                        <div className="medical-grid">

                            <div className="medical-field">
                                <label>
                                    <GraduationCap size={15} />
                                    Year & Section
                                </label>
                                <div className="field-value">
                                    {student.yearSection}
                                </div>
                            </div>

                            <div className="medical-field field-wide">
                                <label>
                                    <MapPin size={15} />
                                    Current Address
                                </label>
                                <div className="field-value">
                                    {student.address}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>
                                    <Phone size={15} />
                                    Person to be Contacted
                                </label>
                                <div className="field-value">
                                    {student.emergencyContact}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>
                                    <Calendar size={15} />
                                    Date of Birth
                                </label>
                                <div className="field-value">
                                    {student.dateOfBirth}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Age</label>
                                <div className="field-value">
                                    {student.age}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Sex</label>
                                <div className="field-value">
                                    {student.sex}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Height</label>
                                <div className="field-value">
                                    {student.height}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Weight</label>
                                <div className="field-value">
                                    {student.weight}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Nationality</label>
                                <div className="field-value">
                                    {student.nationality}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Religion</label>
                                <div className="field-value">
                                    {student.religion}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Blood Type</label>
                                <div className="field-value">
                                    {student.bloodType}
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ==========================================
                        II. MEDICAL HISTORY
                    ========================================== */}
                    <section className="medical-section">

                        <div className="section-title">
                            <span>02</span>
                            <div>
                                <h2>Medical History</h2>
                                <p>Allergies, immunization and diseases</p>
                            </div>
                        </div>

                        {/* Allergy */}
                        <div className="medical-subsection">
                            <div className="subsection-heading">
                                <HeartPulse size={19} />
                                <h3>Allergy Information</h3>
                            </div>

                            <div className="answer-box">
                                <span>History of Allergy</span>

                                <strong
                                    className={
                                        student.allergy === "Yes"
                                            ? "status-warning"
                                            : "status-success"
                                    }
                                >
                                    {student.allergy}
                                </strong>
                            </div>

                            {student.allergy === "Yes" && (
                                <div className="medical-grid allergy-details">

                                    <div className="medical-field">
                                        <label>Food</label>
                                        <div className="field-value">
                                            {student.foodAllergy || "None"}
                                        </div>
                                    </div>

                                    <div className="medical-field">
                                        <label>Medicine</label>
                                        <div className="field-value">
                                            {student.medicineAllergy || "None"}
                                        </div>
                                    </div>

                                    <div className="medical-field">
                                        <label>Others</label>
                                        <div className="field-value">
                                            {student.otherAllergy || "None"}
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        {/* Immunization */}
                        <div className="medical-subsection">

                            <div className="subsection-heading">
                                <ShieldCheck size={19} />
                                <h3>Immunization</h3>
                            </div>

                            <div className="answer-box">
                                <span>Has the student been immunized?</span>

                                <strong className="status-success">
                                    {student.immunized}
                                </strong>
                            </div>

                            <div className="vaccine-grid">

                                {Object.entries(student.vaccines).map(
                                    ([name, value]) => (
                                        <div className="vaccine-card" key={name}>
                                            <div>
                                                <span>
                                                    {name
                                                        .replace(/([A-Z])/g, " $1")
                                                        .replace(/^./, (str) =>
                                                            str.toUpperCase()
                                                        )}
                                                </span>
                                            </div>

                                            <strong>
                                                {value || "Not specified"}
                                            </strong>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        {/* Diseases */}
                        <div className="medical-subsection">

                            <div className="subsection-heading">
                                <Activity size={19} />
                                <h3>Previous Diseases</h3>
                            </div>

                            <div className="disease-grid">

                                {Object.entries(student.diseases).map(
                                    ([name, value]) => (
                                        <div className="disease-item" key={name}>
                                            <span>
                                                {name
                                                    .replace(/([A-Z])/g, " $1")
                                                    .replace(/^./, (str) =>
                                                        str.toUpperCase()
                                                    )}
                                            </span>

                                            <strong>
                                                {value || "None reported"}
                                            </strong>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    </section>

                    {/* ==========================================
                        III. HOSPITALIZATION
                    ========================================== */}
                    <section className="medical-section">

                        <div className="section-title">
                            <span>03</span>
                            <div>
                                <h2>Hospitalization</h2>
                                <p>Previous hospital and operation history</p>
                            </div>
                        </div>

                        <div className="answer-box">
                            <span>Has the student been hospitalized?</span>

                            <strong
                                className={
                                    student.hospitalized === "Yes"
                                        ? "status-info"
                                        : "status-success"
                                }
                            >
                                {student.hospitalized}
                            </strong>
                        </div>

                        <div className="medical-grid">

                            <div className="medical-field">
                                <label>
                                    <Calendar size={15} />
                                    Last Hospitalization
                                </label>
                                <div className="field-value">
                                    {student.lastHospitalized || "None"}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Cause</label>
                                <div className="field-value">
                                    {student.hospitalizationCause || "None"}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Medication Taken</label>
                                <div className="field-value">
                                    {student.medicationTaken || "None"}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>
                                    <Hospital size={15} />
                                    Hospital
                                </label>
                                <div className="field-value">
                                    {student.hospitalConfined || "None"}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Operation</label>
                                <div className="field-value">
                                    {student.operation}
                                </div>
                            </div>

                            <div className="medical-field">
                                <label>Age During Operation</label>
                                <div className="field-value">
                                    {student.operationAge || "N/A"}
                                </div>
                            </div>

                            <div className="medical-field field-full">
                                <label>Cause of Operation</label>
                                <div className="field-value">
                                    {student.operationCause || "N/A"}
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* ==========================================
                        IV. FAMILY HISTORY
                    ========================================== */}
                    <section className="medical-section">

                        <div className="section-title">
                            <span>04</span>
                            <div>
                                <h2>Family History of Disease</h2>
                                <p>Reported family medical history</p>
                            </div>
                        </div>

                        <div className="family-history-grid">

                            {Object.entries(student.familyHistory).map(
                                ([name, value]) => (
                                    <div
                                        className="family-history-card"
                                        key={name}
                                    >
                                        <div className="family-icon">
                                            <Users size={18} />
                                        </div>

                                        <div>
                                            <span>
                                                {name
                                                    .replace(/([A-Z])/g, " $1")
                                                    .replace(/^./, (str) =>
                                                        str.toUpperCase()
                                                    )}
                                            </span>

                                            <strong>{value}</strong>
                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    </section>

                    {/* SIGNATURE */}
                    <div className="signature-section">

                        <div className="signature-line">
                            <strong>{student.parentSignature}</strong>
                        </div>

                        <p>
                            Parent's / Guardian's Signature Over Printed Name
                        </p>

                    </div>

                    {/* FOOTER */}
                    <div className="medical-form-footer">
                        <ShieldCheck size={18} />
                        <span>
                            Medical information is confidential and should
                            only be accessed by authorized clinic personnel.
                        </span>
                    </div>

                </div>
            </div>
        );
    }

    // ============================================
    // STUDENT LIST
    // ============================================
    return (
        <div className="student-medical-profile-page">

            <div className="student-list-page">

                <div className="student-list-header">
                    <div>
                        <span className="page-label">
                            STUDENT RECORDS
                        </span>

                        <h1>Student Medical Profiles</h1>

                        <p>
                            Select a student to view their complete medical
                            profile.
                        </p>
                    </div>
                </div>

                {/* SEARCH */}
                <div className="student-search-bar">
                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search student name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* STUDENTS */}
                <div className="student-profile-list">

                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div
                                className="student-profile-card"
                                key={student.id}
                                onClick={() =>
                                    setSelectedStudent(student)
                                }
                            >

                                <div className="student-avatar">
                                    <User size={27} />
                                </div>

                                <div className="student-info">

                                    <div className="student-name-row">
                                        <h2>
                                            {student.firstName}{" "}
                                            {student.lastName}
                                        </h2>

                                        <span className="student-status">
                                            Active
                                        </span>
                                    </div>

                                    <p className="student-id">
                                        Patient ID: {student.id}
                                    </p>

                                    <div className="student-details">
                                        <span>
                                            <GraduationCap size={14} />
                                            {student.yearSection}
                                        </span>

                                        <span>
                                            <User size={14} />
                                            {student.sex}
                                        </span>

                                        <span>
                                            <Calendar size={14} />
                                            {student.age} years old
                                        </span>
                                    </div>

                                </div>

                                <button
                                    className="view-profile-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedStudent(student);
                                    }}
                                >
                                    <Eye size={17} />
                                    View Profile
                                </button>

                            </div>
                        ))
                    ) : (
                        <div className="no-students">
                            <User size={40} />
                            <h3>No students found</h3>
                            <p>
                                Try searching using a different student name.
                            </p>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}

export default StudentMedicalProfile;