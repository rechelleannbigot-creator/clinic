
import { useEffect, useState } from "react";
import {
    User,
    HeartPulse,
    Hospital,
    Save,
    CheckCircle,
    AlertCircle,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "../../styles/MedicalProfile.css";

const emptyProfile = {
    firstName: "",
    middleName: "",
    lastName: "",
    studentId: "",
    yearSection: "",
    sex: "",
    dateOfBirth: "",
    age: "",
    address: "",
    cellphone: "",
    contactPerson: "",
    nationality: "",
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
};

function MedicalProfile() {
    const { user } = useAuth();

    const [formData, setFormData] = useState(emptyProfile);
    const [saved, setSaved] = useState(false);

    // Load personal information from the logged-in account only.
    useEffect(() => {
        if (!user) return;

        const fullName = user.name || user.fullName || "";
        const nameParts = fullName.trim().split(/\s+/).filter(Boolean);

        setFormData((previous) => ({
            ...previous,
            firstName: user.firstName || nameParts[0] || "",
            middleName: user.middleName || "",
            lastName:
                user.lastName ||
                (nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""),
            studentId: user.studentId || user.studentNumber || user.id || "",
            yearSection: user.yearSection || user.courseYearSection || "",
            sex: user.sex || user.gender || "",
            dateOfBirth: user.dateOfBirth || "",
            age: user.age ? String(user.age) : "",
            address: user.address || "",
            cellphone: user.cellphone || user.phone || "",
            contactPerson: user.contactPerson || "",
            nationality: user.nationality || "",
            religion: user.religion || "",
            height: user.height || "",
            weight: user.weight || "",
            bloodType: user.bloodType || "",
        }));
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSaved(false);
    };

    const handleCheckbox = (event) => {
        const { name, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: checked ? "Yes" : "",
        }));

        setSaved(false);
    };

    const handleSave = (event) => {
        event.preventDefault();

        // This currently saves changes to component state only.
        // Connect this handler to your backend to permanently save records.
        setSaved(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!user) {
        return (
            <div className="student-medical-profile-page">
                <div className="medical-card">
                    <AlertCircle size={28} />
                    <h2>Sign in required</h2>
                    <p>
                        Please sign in with your student account to view
                        your medical profile.
                    </p>
                </div>
            </div>
        );
    }

    const displayName =
        [
            formData.firstName,
            formData.middleName,
            formData.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        user.email ||
        "Student";

    return (
        <div className="student-medical-profile-page">
            <div className="profile-top-header">
                <div className="profile-student-info">
                    <div className="profile-avatar">
                        <User size={25} />
                    </div>

                    <div>
                        <h1>My Medical Profile</h1>
                        <p>{displayName}</p>
                        <small>
                            Student ID: {formData.studentId || "Not provided"}
                        </small>
                    </div>
                </div>

                <div className="profile-private-note">
                    <ShieldCheck size={19} />
                    <span>Personal medical information</span>
                </div>
            </div>

            {saved && (
                <div className="profile-success">
                    <CheckCircle size={20} />
                    <div>
                        <strong>Changes saved in this page.</strong>
                        <p>
                            Connect the save action to your backend to
                            permanently store your medical information.
                        </p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSave}>
                <section className="medical-card">
                    <div className="medical-card-header">
                        <div className="section-number">I</div>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Your personal and contact details</p>
                        </div>
                        <User size={22} />
                    </div>

                    <div className="medical-form-grid">
                        <FormInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <FormInput label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                        <FormInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                        <FormInput label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} />
                        <FormInput label="Course / Year & Section" name="yearSection" value={formData.yearSection} onChange={handleChange} />
                        <FormSelect label="Sex" name="sex" value={formData.sex} onChange={handleChange} options={["Male", "Female", "Prefer not to say"]} />
                        <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                        <FormInput label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                        <FormInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
                        <FormInput label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                        <FormInput label="Height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 170 cm" />
                        <FormInput label="Weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 65 kg" />
                        <FormSelect label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange} options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]} />
                        <FormInput label="Cellphone Number" name="cellphone" value={formData.cellphone} onChange={handleChange} />
                        <FormInput label="Person to Contact in an Emergency" name="contactPerson" value={formData.contactPerson} onChange={handleChange} full />
                        <FormInput label="Current Address" name="address" value={formData.address} onChange={handleChange} full />
                    </div>
                </section>

                <section className="medical-card">
                    <div className="medical-card-header">
                        <div className="section-number">II</div>
                        <div>
                            <h2>Medical History</h2>
                            <p>Allergies, immunizations, and previous diseases</p>
                        </div>
                        <HeartPulse size={22} />
                    </div>

                    <Subsection title="History of Allergy">
                        <RadioGroup
                            label="Do you have any known allergies?"
                            name="hasAllergy"
                            value={formData.hasAllergy}
                            onChange={handleChange}
                            options={["Yes", "No"]}
                        />
                        <div className="medical-form-grid">
                            <FormInput label="Food Allergies" name="allergyFood" value={formData.allergyFood} onChange={handleChange} />
                            <FormInput label="Medicine Allergies" name="allergyMedicine" value={formData.allergyMedicine} onChange={handleChange} />
                            <FormInput label="Other Allergies" name="allergyOther" value={formData.allergyOther} onChange={handleChange} />
                        </div>
                    </Subsection>

                    <Subsection title="Immunization">
                        <RadioGroup
                            label="Have you been immunized?"
                            name="immunized"
                            value={formData.immunized}
                            onChange={handleChange}
                            options={["Yes", "No"]}
                        />
                        <CheckboxGrid
                            values={formData}
                            onChange={handleCheckbox}
                            items={[
                                ["Hepatitis A", "hepatitisA"],
                                ["Hepatitis B", "hepatitisB"],
                                ["Typhoid", "typhoid"],
                                ["Rabies", "rabies"],
                                ["Influenza", "influenza"],
                                ["Chicken Pox Vaccine", "chickenpoxVaccine"],
                                ["Measles Vaccine", "measlesVaccine"],
                                ["Cholera", "cholera"],
                                ["DPT", "dpt"],
                                ["OPV", "opv"],
                            ]}
                        />
                    </Subsection>

                    <Subsection title="Previous Diseases">
                        <CheckboxGrid
                            values={formData}
                            onChange={handleCheckbox}
                            items={[
                                ["Measles", "measles"],
                                ["Mumps", "mumps"],
                                ["Hepatitis A", "hepatitisAHistory"],
                                ["Hepatitis B", "hepatitisBHistory"],
                                ["Typhoid Fever", "typhoidFever"],
                                ["Chicken Pox", "chickenPox"],
                                ["Bronchitis", "bronchitis"],
                                ["Pneumonia", "pneumonia"],
                                ["Asthma", "asthma"],
                            ]}
                        />
                        <FormInput label="Other Diseases" name="otherDisease" value={formData.otherDisease} onChange={handleChange} full />
                    </Subsection>
                </section>

                <section className="medical-card">
                    <div className="medical-card-header">
                        <div className="section-number">III</div>
                        <div>
                            <h2>Hospitalization & Operations</h2>
                            <p>Previous hospital stays and operations</p>
                        </div>
                        <Hospital size={22} />
                    </div>

                    <Subsection title="Hospitalization">
                        <RadioGroup
                            label="Have you ever been hospitalized?"
                            name="hospitalized"
                            value={formData.hospitalized}
                            onChange={handleChange}
                            options={["Yes", "No"]}
                        />
                        <div className="medical-form-grid">
                            <FormInput label="Date Last Hospitalized" name="lastHospitalized" type="date" value={formData.lastHospitalized} onChange={handleChange} />
                            <FormInput label="Cause of Hospitalization" name="hospitalizationCause" value={formData.hospitalizationCause} onChange={handleChange} />
                            <FormInput label="Medication Taken" name="medicationTaken" value={formData.medicationTaken} onChange={handleChange} />
                            <FormInput label="Hospital Name" name="hospitalConfined" value={formData.hospitalConfined} onChange={handleChange} />
                        </div>
                    </Subsection>

                    <Subsection title="Previous Operations">
                        <div className="medical-form-grid">
                            <FormSelect label="Have you undergone an operation?" name="operation" value={formData.operation} onChange={handleChange} options={["Yes", "No"]} />
                            <FormInput label="Age at Operation" name="operationAge" type="number" value={formData.operationAge} onChange={handleChange} />
                            <FormInput label="Cause of Operation" name="operationCause" value={formData.operationCause} onChange={handleChange} />
                            <FormInput label="Hospital Name" name="operationHospital" value={formData.operationHospital} onChange={handleChange} />
                        </div>
                    </Subsection>
                </section>

                <section className="medical-card">
                    <div className="medical-card-header">
                        <div className="section-number">IV</div>
                        <div>
                            <h2>Family Medical History</h2>
                            <p>Medical conditions reported in your family</p>
                        </div>
                        <HeartPulse size={22} />
                    </div>

                    <CheckboxGrid
                        values={formData}
                        onChange={handleCheckbox}
                        items={[
                            ["Cardiac Disease", "cardiacDisease"],
                            ["Hypertension", "hypertension"],
                            ["Diabetes", "diabetes"],
                            ["Tuberculosis", "tuberculosis"],
                            ["Asthma", "familyAsthma"],
                        ]}
                    />
                </section>

                <div className="medical-form-actions">
                    <button type="submit" className="save-profile-button">
                        <Save size={18} />
                        Save Medical Profile
                    </button>
                </div>
            </form>
        </div>
    );
}

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
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value || ""}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
}

function FormSelect({ label, name, value, onChange, options }) {
    return (
        <div className="medical-form-group">
            <label htmlFor={name}>{label}</label>
            <select
                id={name}
                name={name}
                value={value || ""}
                onChange={onChange}
            >
                <option value="">Select</option>
                {options.map((option) => (
                    <option value={option} key={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Subsection({ title, children }) {
    return (
        <div className="medical-subsection">
            <h3>{title}</h3>
            {children}
        </div>
    );
}

function RadioGroup({ label, name, value, onChange, options }) {
    return (
        <div className="radio-group">
            <span className="question-label">{label}</span>
            {options.map((option) => (
                <label key={option}>
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={onChange}
                    />
                    {option}
                </label>
            ))}
        </div>
    );
}

function CheckboxGrid({ values, onChange, items }) {
    return (
        <div className="checkbox-grid">
            {items.map(([label, name]) => (
                <label className="check-box" key={name}>
                    <input
                        type="checkbox"
                        name={name}
                        checked={values[name] === "Yes"}
                        onChange={onChange}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
}

export default MedicalProfile;
