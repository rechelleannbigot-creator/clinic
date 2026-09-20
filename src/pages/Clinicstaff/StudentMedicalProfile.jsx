import { useState } from "react";
import {
    Search,
    Users,
    Eye,
    User,
    HeartPulse,
    Hospital,
    ArrowLeft,
    Save,
    CheckCircle,
} from "lucide-react";

import "../../styles/StudentMedicalProfile.css";

function StudentMedicalProfile() {
    // ==========================================
    // STUDENT LIST
    // ==========================================

    const students = [
        {
            id: "STU-001",
            name: "Christian Joseph Castillo",
            yearSection: "BSIT 4",
            sex: "Male",
            age: 22,
            status: "Completed",

            profile: {
                lastName: "Castillo",
                firstName: "Christian Joseph",
                middleInitial: "",
                yearSection: "BSIT 4",
                sex: "Male",
                address: "Isabela Negros Occidental",
                contactPerson: "Maria Castillo",
                telephone: "",
                cellphone: "09XXXXXXXXX",
                dateOfBirth: "2004-11-04",
                age: "22",
                nationality: "Filipino",
                religion: "Catholic",
                height: "",
                weight: "",
                bloodType: "",

                hasAllergy: "No",
                allergyFood: "",
                allergyMedicine: "",
                allergyOther: "",

                immunized: "Yes",
                hepatitisA: "Yes",
                hepatitisB: "Yes",
                typhoid: "Yes",
                rabies: "",
                influenza: "Yes",
                chickenpoxVaccine: "",
                measlesVaccine: "Yes",
                cholera: "",
                dpt: "Yes",
                opv: "Yes",

                measles: "",
                mumps: "",
                hepatitisAHistory: "",
                hepatitisBHistory: "",
                typhoidFever: "",
                chickenPox: "",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                otherDisease: "",

                hospitalized: "No",
                lastHospitalized: "",
                hospitalizationCause: "",
                medicationTaken: "",
                hospitalConfined: "",

                operation: "No",
                operationAge: "",
                operationCause: "",
                operationHospital: "",

                cardiacDisease: "No",
                hypertension: "No",
                diabetes: "No",
                tuberculosis: "No",
                familyAsthma: "No",
            },
        },

        {
            id: "STU-002",
            name: "Maria Santos",
            yearSection: "BSN 3",
            sex: "Female",
            age: 21,
            status: "Completed",

            profile: {
                lastName: "Santos",
                firstName: "Maria",
                middleInitial: "A",
                yearSection: "BSN 3",
                sex: "Female",
                address: "Isabela Negros Occidental",
                contactPerson: "Juan Santos",
                telephone: "",
                cellphone: "09XXXXXXXXX",
                dateOfBirth: "2005-02-15",
                age: "21",
                nationality: "Filipino",
                religion: "Catholic",
                height: "160 cm",
                weight: "55 kg",
                bloodType: "O+",

                hasAllergy: "Yes",
                allergyFood: "Shrimp",
                allergyMedicine: "None",
                allergyOther: "",

                immunized: "Yes",
                hepatitisA: "Yes",
                hepatitisB: "Yes",
                typhoid: "Yes",
                rabies: "",
                influenza: "Yes",
                chickenpoxVaccine: "Yes",
                measlesVaccine: "Yes",
                cholera: "",
                dpt: "Yes",
                opv: "Yes",

                measles: "",
                mumps: "",
                hepatitisAHistory: "",
                hepatitisBHistory: "",
                typhoidFever: "",
                chickenPox: "",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                otherDisease: "",

                hospitalized: "No",
                lastHospitalized: "",
                hospitalizationCause: "",
                medicationTaken: "",
                hospitalConfined: "",

                operation: "No",
                operationAge: "",
                operationCause: "",
                operationHospital: "",

                cardiacDisease: "No",
                hypertension: "No",
                diabetes: "No",
                tuberculosis: "No",
                familyAsthma: "No",
            },
        },

        {
            id: "STU-003",
            name: "Robert Lee",
            yearSection: "BSIT 3",
            sex: "Male",
            age: 20,
            status: "Pending",

            profile: {
                lastName: "Lee",
                firstName: "Robert",
                middleInitial: "",
                yearSection: "BSIT 3",
                sex: "Male",
                address: "",
                contactPerson: "",
                telephone: "",
                cellphone: "",
                dateOfBirth: "",
                age: "20",
                nationality: "Filipino",
                religion: "",
                height: "",
                weight: "",
                bloodType: "",

                hasAllergy: "",
                allergyFood: "",
                allergyMedicine: "",
                allergyOther: "",

                immunized: "",
                hepatitisA: "",
                hepatitisB: "",
                typhoid: "",
                rabies: "",
                influenza: "",
                chickenpoxVaccine: "",
                measlesVaccine: "",
                cholera: "",
                dpt: "",
                opv: "",

                measles: "",
                mumps: "",
                hepatitisAHistory: "",
                hepatitisBHistory: "",
                typhoidFever: "",
                chickenPox: "",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                otherDisease: "",

                hospitalized: "",
                lastHospitalized: "",
                hospitalizationCause: "",
                medicationTaken: "",
                hospitalConfined: "",

                operation: "",
                operationAge: "",
                operationCause: "",
                operationHospital: "",

                cardiacDisease: "",
                hypertension: "",
                diabetes: "",
                tuberculosis: "",
                familyAsthma: "",
            },
        },

        {
            id: "STU-004",
            name: "Angela Cruz",
            yearSection: "BSBA 2",
            sex: "Female",
            age: 19,
            status: "Completed",

            profile: {
                lastName: "Cruz",
                firstName: "Angela",
                middleInitial: "M",
                yearSection: "BSBA 2",
                sex: "Female",
                address: "Baguio City",
                contactPerson: "Pedro Cruz",
                telephone: "",
                cellphone: "09XXXXXXXXX",
                dateOfBirth: "2007-01-20",
                age: "19",
                nationality: "Filipino",
                religion: "Catholic",
                height: "158 cm",
                weight: "52 kg",
                bloodType: "A+",

                hasAllergy: "No",
                allergyFood: "",
                allergyMedicine: "",
                allergyOther: "",

                immunized: "Yes",
                hepatitisA: "Yes",
                hepatitisB: "Yes",
                typhoid: "Yes",
                rabies: "",
                influenza: "Yes",
                chickenpoxVaccine: "Yes",
                measlesVaccine: "Yes",
                cholera: "",
                dpt: "Yes",
                opv: "Yes",

                measles: "",
                mumps: "",
                hepatitisAHistory: "",
                hepatitisBHistory: "",
                typhoidFever: "",
                chickenPox: "",
                bronchitis: "",
                pneumonia: "",
                asthma: "",
                otherDisease: "",

                hospitalized: "No",
                lastHospitalized: "",
                hospitalizationCause: "",
                medicationTaken: "",
                hospitalConfined: "",

                operation: "No",
                operationAge: "",
                operationCause: "",
                operationHospital: "",

                cardiacDisease: "No",
                hypertension: "No",
                diabetes: "No",
                tuberculosis: "No",
                familyAsthma: "No",
            },
        },
    ];

    // ==========================================
    // STATES
    // ==========================================

    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState(null);
    const [saved, setSaved] = useState(false);

    // ==========================================
    // OPEN PROFILE
    // ==========================================

    const handleOpenProfile = (student) => {
        setSelectedStudent(student);
        setFormData({ ...student.profile });
        setSaved(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // BACK TO LIST
    // ==========================================

    const handleBack = () => {
        setSelectedStudent(null);
        setFormData(null);
        setSaved(false);
    };

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSaved(false);
    };

    // ==========================================
    // CHECKBOX
    // ==========================================

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: checked ? "Yes" : "",
        }));

        setSaved(false);
    };

    // ==========================================
    // SAVE
    // ==========================================

    const handleSave = (e) => {
        e.preventDefault();

        console.log("Updated Medical Profile:", formData);

        setSaved(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // FILTER STUDENTS
    // ==========================================

    const filteredStudents = students.filter((student) =>
        `${student.name} ${student.id} ${student.yearSection}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // ==========================================
    // MEDICAL PROFILE VIEW
    // ==========================================

    if (selectedStudent && formData) {
        return (
            <div className="student-medical-profile-page">

                {/* PROFILE HEADER */}

                <div className="profile-top-header">

                    <button
                        className="back-button"
                        onClick={handleBack}
                    >
                        <ArrowLeft size={18} />
                        Back to Students
                    </button>

                    <div className="profile-student-info">
                        <div className="profile-avatar">
                            <User size={25} />
                        </div>

                        <div>
                            <h1>{selectedStudent.name}</h1>

                            <p>
                                {selectedStudent.id} •{" "}
                                {selectedStudent.yearSection}
                            </p>
                        </div>
                    </div>

                </div>

                {/* SUCCESS */}

                {saved && (
                    <div className="profile-success">
                        <CheckCircle size={20} />

                        <div>
                            <strong>
                                Medical profile saved successfully.
                            </strong>

                            <p>
                                The student's medical information has
                                been updated.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSave}>

                    {/* ==================================
                        I. PERSONAL INFORMATION
                    ================================== */}

                    <section className="medical-card">

                        <div className="medical-card-header">

                            <div className="section-number">
                                I
                            </div>

                            <div>
                                <h2>Personal Information</h2>

                                <p>
                                    Student personal and contact
                                    information
                                </p>
                            </div>

                            <User size={22} />

                        </div>

                        <div className="medical-form-grid">

                            <FormInput
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Middle Initial"
                                name="middleInitial"
                                value={formData.middleInitial}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Year & Section"
                                name="yearSection"
                                value={formData.yearSection}
                                onChange={handleChange}
                            />

                            <FormSelect
                                label="Sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                options={[
                                    "Male",
                                    "Female",
                                ]}
                            />

                            <FormInput
                                label="Date of Birth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Religion"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="e.g. 170 cm"
                            />

                            <FormInput
                                label="Weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="e.g. 65 kg"
                            />

                            <FormSelect
                                label="Blood Type"
                                name="bloodType"
                                value={formData.bloodType}
                                onChange={handleChange}
                                options={[
                                    "A+",
                                    "A-",
                                    "B+",
                                    "B-",
                                    "AB+",
                                    "AB-",
                                    "O+",
                                    "O-",
                                    "Unknown",
                                ]}
                            />

                            <FormInput
                                label="Current Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                full
                            />

                            <FormInput
                                label="Person to Contact"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Telephone Number"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                            />

                            <FormInput
                                label="Cellphone Number"
                                name="cellphone"
                                value={formData.cellphone}
                                onChange={handleChange}
                            />

                        </div>
                    </section>

                    {/* ==================================
                        II. MEDICAL HISTORY
                    ================================== */}

                    <section className="medical-card">

                        <div className="medical-card-header">

                            <div className="section-number">
                                II
                            </div>

                            <div>
                                <h2>Medical History</h2>

                                <p>
                                    Allergies, immunization and
                                    previous diseases
                                </p>
                            </div>

                            <HeartPulse size={22} />

                        </div>

                        {/* ALLERGY */}

                        <div className="medical-subsection">

                            <h3>History of Allergy</h3>

                            <div className="radio-group">

                                <label>
                                    <input
                                        type="radio"
                                        name="hasAllergy"
                                        value="Yes"
                                        checked={
                                            formData.hasAllergy === "Yes"
                                        }
                                        onChange={handleChange}
                                    />
                                    Yes
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="hasAllergy"
                                        value="No"
                                        checked={
                                            formData.hasAllergy === "No"
                                        }
                                        onChange={handleChange}
                                    />
                                    No
                                </label>

                            </div>

                            <div className="medical-form-grid">

                                <FormInput
                                    label="Food"
                                    name="allergyFood"
                                    value={formData.allergyFood}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="Medicine"
                                    name="allergyMedicine"
                                    value={formData.allergyMedicine}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="Others"
                                    name="allergyOther"
                                    value={formData.allergyOther}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* IMMUNIZATION */}

                        <div className="medical-subsection">

                            <h3>Immunization</h3>

                            <div className="radio-group">

                                <span className="question-label">
                                    Have you been immunized?
                                </span>

                                <label>
                                    <input
                                        type="radio"
                                        name="immunized"
                                        value="Yes"
                                        checked={
                                            formData.immunized === "Yes"
                                        }
                                        onChange={handleChange}
                                    />
                                    Yes
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="immunized"
                                        value="No"
                                        checked={
                                            formData.immunized === "No"
                                        }
                                        onChange={handleChange}
                                    />
                                    No
                                </label>

                            </div>

                            <div className="checkbox-grid">

                                {[
                                    ["Hepatitis A", "hepatitisA"],
                                    ["Hepatitis B", "hepatitisB"],
                                    ["Typhoid", "typhoid"],
                                    ["Rabies", "rabies"],
                                    ["Influenza", "influenza"],
                                    [
                                        "Chicken Pox",
                                        "chickenpoxVaccine",
                                    ],
                                    [
                                        "Measles",
                                        "measlesVaccine",
                                    ],
                                    ["Cholera", "cholera"],
                                    ["DPT", "dpt"],
                                    ["OPV", "opv"],
                                ].map(([label, name]) => (
                                    <label
                                        className="check-box"
                                        key={name}
                                    >
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={
                                                formData[name] === "Yes"
                                            }
                                            onChange={handleCheckbox}
                                        />

                                        {label}
                                    </label>
                                ))}

                            </div>

                        </div>

                        {/* DISEASES */}

                        <div className="medical-subsection">

                            <h3>
                                Which of these diseases have you
                                had?
                            </h3>

                            <div className="checkbox-grid">

                                {[
                                    ["Measles", "measles"],
                                    ["Mumps", "mumps"],
                                    [
                                        "Hepatitis A",
                                        "hepatitisAHistory",
                                    ],
                                    [
                                        "Hepatitis B",
                                        "hepatitisBHistory",
                                    ],
                                    [
                                        "Typhoid Fever",
                                        "typhoidFever",
                                    ],
                                    ["Chicken Pox", "chickenPox"],
                                    ["Bronchitis", "bronchitis"],
                                    ["Pneumonia", "pneumonia"],
                                    ["Asthma", "asthma"],
                                ].map(([label, name]) => (
                                    <label
                                        className="check-box"
                                        key={name}
                                    >
                                        <input
                                            type="checkbox"
                                            name={name}
                                            checked={
                                                formData[name] === "Yes"
                                            }
                                            onChange={handleCheckbox}
                                        />

                                        {label}
                                    </label>
                                ))}

                            </div>

                            <FormInput
                                label="Others"
                                name="otherDisease"
                                value={formData.otherDisease}
                                onChange={handleChange}
                                placeholder="Specify other disease"
                            />

                        </div>

                    </section>

                    {/* ==================================
                        III. HOSPITALIZATION
                    ================================== */}

                    <section className="medical-card">

                        <div className="medical-card-header">

                            <div className="section-number">
                                III
                            </div>

                            <div>
                                <h2>Hospitalization</h2>

                                <p>
                                    Previous hospitalization and
                                    operations
                                </p>
                            </div>

                            <Hospital size={22} />

                        </div>

                        <div className="medical-subsection">

                            <div className="radio-group">

                                <span className="question-label">
                                    Have you been hospitalized?
                                </span>

                                <label>
                                    <input
                                        type="radio"
                                        name="hospitalized"
                                        value="Yes"
                                        checked={
                                            formData.hospitalized ===
                                            "Yes"
                                        }
                                        onChange={handleChange}
                                    />
                                    Yes
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="hospitalized"
                                        value="No"
                                        checked={
                                            formData.hospitalized ===
                                            "No"
                                        }
                                        onChange={handleChange}
                                    />
                                    No
                                </label>

                            </div>

                            <div className="medical-form-grid">

                                <FormInput
                                    label="When were you last hospitalized?"
                                    type="date"
                                    name="lastHospitalized"
                                    value={
                                        formData.lastHospitalized
                                    }
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="What was the cause?"
                                    name="hospitalizationCause"
                                    value={
                                        formData.hospitalizationCause
                                    }
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="Medication Taken"
                                    name="medicationTaken"
                                    value={formData.medicationTaken}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="Hospital Where You Were Confined"
                                    name="hospitalConfined"
                                    value={formData.hospitalConfined}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="medical-subsection">

                            <h3>Previous Operation</h3>

                            <div className="medical-form-grid">

                                <FormSelect
                                    label="Have you undergone any operation?"
                                    name="operation"
                                    value={formData.operation}
                                    onChange={handleChange}
                                    options={[
                                        "Yes",
                                        "No",
                                    ]}
                                />

                                <FormInput
                                    label="At What Age?"
                                    type="number"
                                    name="operationAge"
                                    value={formData.operationAge}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="What Cause?"
                                    name="operationCause"
                                    value={formData.operationCause}
                                    onChange={handleChange}
                                />

                                <FormInput
                                    label="Hospital Where Confined"
                                    name="operationHospital"
                                    value={formData.operationHospital}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                    </section>

                    {/* ==================================
                        IV. FAMILY HISTORY
                    ================================== */}

                    <section className="medical-card">

                        <div className="medical-card-header">

                            <div className="section-number">
                                IV
                            </div>

                            <div>
                                <h2>Family History of Disease</h2>

                                <p>
                                    Family history of common diseases
                                </p>
                            </div>

                            <Users size={22} />

                        </div>

                        <div className="family-history-grid">

                            {[
                                [
                                    "Cardiac Disease",
                                    "cardiacDisease",
                                ],
                                [
                                    "Hypertension",
                                    "hypertension",
                                ],
                                [
                                    "Diabetes",
                                    "diabetes",
                                ],
                                [
                                    "Tuberculosis",
                                    "tuberculosis",
                                ],
                                [
                                    "Asthma",
                                    "familyAsthma",
                                ],
                            ].map(([label, name]) => (
                                <div
                                    className="family-history-item"
                                    key={name}
                                >
                                    <label>{label}</label>

                                    <select
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option value="Yes">
                                            Yes
                                        </option>

                                        <option value="No">
                                            No
                                        </option>
                                    </select>
                                </div>
                            ))}

                        </div>

                    </section>

                    {/* ACTION */}

                    <div className="profile-actions">

                        <button
                            type="button"
                            className="cancel-profile-button"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={18} />
                            Back to Student List
                        </button>

                        <button
                            type="submit"
                            className="save-profile-button"
                        >
                            <Save size={18} />
                            Save Medical Profile
                        </button>

                    </div>

                </form>
            </div>
        );
    }

    // ==========================================
    // STUDENT LIST VIEW
    // ==========================================

    return (
        <div className="student-medical-profile-page">

            {/* HEADER */}

            <div className="student-list-header">

                <div>
                    <h1>Student Medical Profiles</h1>

                    <p>
                        Select a student to view their complete
                        medical health profile.
                    </p>
                </div>

                <div className="student-list-icon">
                    <Users size={25} />
                </div>

            </div>

            {/* SEARCH */}

            <div className="student-search-card">

                <div className="search-box">

                    <Search size={19} />

                    <input
                        type="text"
                        placeholder="Search student name, ID or section..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <div className="student-count">
                    {filteredStudents.length} Students
                </div>

            </div>

            {/* STUDENT LIST */}

            <div className="student-list-card">

                <div className="student-list-title">
                    <div>
                        <h2>Students</h2>
                        <p>
                            Click a student's name to view their
                            medical profile.
                        </p>
                    </div>
                </div>

                <div className="student-table-wrapper">

                    <table className="student-table">

                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Student ID</th>
                                <th>Year & Section</th>
                                <th>Sex</th>
                                <th>Age</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredStudents.map((student) => (

                                <tr key={student.id}>

                                    <td>

                                        <button
                                            className="student-name-button"
                                            onClick={() =>
                                                handleOpenProfile(
                                                    student
                                                )
                                            }
                                        >
                                            <span className="student-avatar">
                                                <User size={17} />
                                            </span>

                                            <span>
                                                {student.name}
                                            </span>
                                        </button>

                                    </td>

                                    <td>
                                        {student.id}
                                    </td>

                                    <td>
                                        {student.yearSection}
                                    </td>

                                    <td>
                                        {student.sex}
                                    </td>

                                    <td>
                                        {student.age}
                                    </td>

                                    <td>

                                        <span
                                            className={`status-badge ${
                                                student.status ===
                                                "Completed"
                                                    ? "completed"
                                                    : "pending"
                                            }`}
                                        >
                                            {student.status}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            className="view-profile-button"
                                            onClick={() =>
                                                handleOpenProfile(
                                                    student
                                                )
                                            }
                                        >
                                            <Eye size={16} />
                                            View Profile
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {filteredStudents.length === 0 && (
                    <div className="no-student">
                        <Users size={35} />

                        <h3>No students found</h3>

                        <p>
                            Try searching using a different
                            student name or ID.
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

// ==========================================
// REUSABLE INPUT
// ==========================================

function FormInput({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    full = false,
}) {
    return (
        <div className={`medical-form-group ${full ? "full" : ""}`}>
            <label>{label}</label>

            <input
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

// ==========================================
// REUSABLE SELECT
// ==========================================

function FormSelect({
    label,
    name,
    value,
    onChange,
    options,
}) {
    return (
        <div className="medical-form-group">

            <label>{label}</label>

            <select
                name={name}
                value={value || ""}
                onChange={onChange}
            >
                <option value="">
                    Select
                </option>

                {options.map((option) => (
                    <option
                        value={option}
                        key={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default StudentMedicalProfile;