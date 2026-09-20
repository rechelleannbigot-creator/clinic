import { useState } from "react";
import "../../styles/MedicalProfile.css";

function MedicalProfile() {
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        middleInitial: "",
        suffix: "",
        yearSection: "",
        address: "",
        contactPerson: "",
        telephone: "",
        cellNumber: "",
        birthDate: "",
        age: "",
        sex: "",
        height: "",
        weight: "",
        nationality: "",
        religion: "",
        bloodType: "",

        allergy: "",
        allergyFood: "",
        allergyMedicine: "",
        allergyOthers: "",

        immunized: "",
        hospitalization: "",
        lastHospitalized: "",
        hospitalizationCause: "",
        medicationTaken: "",
        hospitalConfined: "",
        operation: "",
        operationAge: "",
        operationCause: "",
        operationHospital: "",

        parentSignature: ""
    });

    const [diseases, setDiseases] = useState({
        measles: false,
        mumps: false,
        hepA: false,
        hepB: false,
        typhoid: false,
        chickenPox: false,
        bronchitis: false,
        pneumonia: false,
        asthma: false,
        others: false
    });

    const [vaccines, setVaccines] = useState({
        hepA: "",
        hepB: "",
        typhoid: "",
        rabies: "",
        influenza: "",
        chickenPox: "",
        measles: "",
        cholera: "",
        dpt: "",
        opv: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDiseaseChange = (e) => {
        const { name, checked } = e.target;

        setDiseases((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleVaccineChange = (e) => {
        const { name, value } = e.target;

        setVaccines((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Medical Profile:", {
            ...formData,
            diseases,
            vaccines
        });

        alert("Medical profile saved successfully!");
    };

    return (
        <div className="medical-profile-page">
            <form className="medical-form" onSubmit={handleSubmit}>

                {/* HEADER */}
                <div className="form-header">
                    <div className="clinic-logo">
                        <div className="logo-circle">
                            ✚
                        </div>
                    </div>

                    <div className="clinic-title">
                        <h1>LA CONSOLACION COLLEGE ISABELA</h1>
                        <h2>ISABELA NEGROS OCCIDENTAL</h2>
                        <h3>HEALTH SERVICES CENTER</h3>
                    </div>
                </div>

                <div className="header-line"></div>

                {/* INSTRUCTION */}
                <div className="instruction">
                    <strong>Instruction:</strong>

                    <p>
                        Accomplish this form so as to provide us your medical
                        health profile.
                        <br />
                        The assistance of your present guardian is needed.
                    </p>
                </div>

                {/* ======================================
                    I. PERSONAL INFORMATION
                ====================================== */}
                <SectionTitle number="I." title="PERSONAL INFORMATION" />

                <div className="form-row name-row">
                    <div className="form-group">
                        <label>Name:</label>
                    </div>

                    <div className="input-with-label">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <small>Last name</small>
                    </div>

                    <div className="input-with-label">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <small>First name</small>
                    </div>

                    <div className="input-with-label">
                        <input
                            type="text"
                            name="middleInitial"
                            value={formData.middleInitial}
                            onChange={handleChange}
                        />
                        <small>Middle Initial</small>
                    </div>
                </div>

                <div className="form-grid two-column">
                    <FormInput
                        label="Yr. & Sec."
                        name="yearSection"
                        value={formData.yearSection}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Current Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <FormInput
                    label="Person to be contacted"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                />

                <div className="form-grid two-column">
                    <FormInput
                        label="Tel. No."
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Cell Number"
                        name="cellNumber"
                        value={formData.cellNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-grid three-column">
                    <FormInput
                        label="Date of Birth"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                    />

                    <FormSelect
                        label="Sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        options={["Male", "Female"]}
                    />
                </div>

                <div className="form-grid four-column">
                    <FormInput
                        label="Height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        placeholder="e.g. 5'8"
                    />

                    <FormInput
                        label="Weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="kg"
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
                </div>

                <FormInput
                    label="Blood Type"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                />

                {/* ======================================
                    II. MEDICAL HISTORY
                ====================================== */}
                <SectionTitle number="II." title="MEDICAL HISTORY" />

                <Question>
                    <span>Do you have history of allergy?</span>

                    <Radio
                        name="allergy"
                        value="Yes"
                        label="Yes"
                        checked={formData.allergy === "Yes"}
                        onChange={handleChange}
                    />

                    <Radio
                        name="allergy"
                        value="No"
                        label="No"
                        checked={formData.allergy === "No"}
                        onChange={handleChange}
                    />
                </Question>

                <div className="sub-section">
                    <h4>If yes, please specify:</h4>

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
                        name="allergyOthers"
                        value={formData.allergyOthers}
                        onChange={handleChange}
                    />
                </div>

                <Question>
                    <span>Have you been immunized?</span>

                    <Radio
                        name="immunized"
                        value="Yes"
                        label="Yes"
                        checked={formData.immunized === "Yes"}
                        onChange={handleChange}
                    />

                    <Radio
                        name="immunized"
                        value="No"
                        label="No"
                        checked={formData.immunized === "No"}
                        onChange={handleChange}
                    />
                </Question>

                <div className="sub-section">
                    <h4>If yes, please specify:</h4>

                    <div className="vaccine-grid">
                        <VaccineInput
                            label="Hep A"
                            name="hepA"
                            value={vaccines.hepA}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Influenza"
                            name="influenza"
                            value={vaccines.influenza}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="DPT"
                            name="dpt"
                            value={vaccines.dpt}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Hep B"
                            name="hepB"
                            value={vaccines.hepB}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Chicken pox"
                            name="chickenPox"
                            value={vaccines.chickenPox}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="OPV"
                            name="opv"
                            value={vaccines.opv}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Typhoid"
                            name="typhoid"
                            value={vaccines.typhoid}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Measles"
                            name="measles"
                            value={vaccines.measles}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Rabies"
                            name="rabies"
                            value={vaccines.rabies}
                            onChange={handleVaccineChange}
                        />

                        <VaccineInput
                            label="Cholera"
                            name="cholera"
                            value={vaccines.cholera}
                            onChange={handleVaccineChange}
                        />
                    </div>
                </div>

                <div className="disease-question">
                    Which of these diseases have you had? Please check.
                </div>

                <div className="disease-grid">
                    <CheckBox
                        name="measles"
                        label="Measles"
                        checked={diseases.measles}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="typhoid"
                        label="Typhoid Fever"
                        checked={diseases.typhoid}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="asthma"
                        label="Asthma"
                        checked={diseases.asthma}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="mumps"
                        label="Mumps"
                        checked={diseases.mumps}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="chickenPox"
                        label="Chicken Pox"
                        checked={diseases.chickenPox}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="others"
                        label="Others"
                        checked={diseases.others}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="hepA"
                        label="Hep A"
                        checked={diseases.hepA}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="bronchitis"
                        label="Bronchitis"
                        checked={diseases.bronchitis}
                        onChange={handleDiseaseChange}
                    />

                    <div></div>

                    <CheckBox
                        name="hepB"
                        label="Hep B"
                        checked={diseases.hepB}
                        onChange={handleDiseaseChange}
                    />

                    <CheckBox
                        name="pneumonia"
                        label="Pneumonia"
                        checked={diseases.pneumonia}
                        onChange={handleDiseaseChange}
                    />
                </div>

                {/* ======================================
                    III. HOSPITALIZATION
                ====================================== */}
                <SectionTitle number="III." title="HOSPITALIZATION" />

                <Question>
                    <span>Have you been hospitalized?</span>

                    <Radio
                        name="hospitalization"
                        value="Yes"
                        label="Yes"
                        checked={formData.hospitalization === "Yes"}
                        onChange={handleChange}
                    />

                    <Radio
                        name="hospitalization"
                        value="No"
                        label="No"
                        checked={formData.hospitalization === "No"}
                        onChange={handleChange}
                    />
                </Question>

                <div className="hospitalization-fields">
                    <FormInput
                        label="When was the last time you were hospitalized?"
                        name="lastHospitalized"
                        value={formData.lastHospitalized}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Please Specify"
                        name="hospitalizationCause"
                        value={formData.hospitalizationCause}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="What is the cause?"
                        name="hospitalizationCause"
                        value={formData.hospitalizationCause}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Medication taken"
                        name="medicationTaken"
                        value={formData.medicationTaken}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Hospital where you were confined"
                        name="hospitalConfined"
                        value={formData.hospitalConfined}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Have you undergone any operation?"
                        name="operation"
                        value={formData.operation}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="At what age?"
                        name="operationAge"
                        value={formData.operationAge}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="What cause?"
                        name="operationCause"
                        value={formData.operationCause}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Hospital where you confined?"
                        name="operationHospital"
                        value={formData.operationHospital}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="None at all"
                        name="none"
                        value=""
                        onChange={() => {}}
                    />
                </div>

                {/* ======================================
                    IV. FAMILY HISTORY
                ====================================== */}
                <SectionTitle number="IV." title="FAMILY HISTORY OF DISEASE" />

                <div className="family-history-grid">

                    <FormInput
                        label="Cardiac Disease"
                        name="cardiacDisease"
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Tuberculosis"
                        name="tuberculosis"
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Hypertension"
                        name="hypertension"
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Asthma"
                        name="familyAsthma"
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Diabetes"
                        name="diabetes"
                        onChange={handleChange}
                    />
                </div>

                {/* SIGNATURE */}
                <div className="signature-section">
                    <input
                        type="text"
                        name="parentSignature"
                        value={formData.parentSignature}
                        onChange={handleChange}
                    />

                    <span>
                        Parent's Signature Over Printed Name
                    </span>
                </div>

                {/* BUTTONS */}
                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Medical Profile
                    </button>
                </div>

            </form>
        </div>
    );
}


/* ======================================
   REUSABLE COMPONENTS
====================================== */

function SectionTitle({ number, title }) {
    return (
        <div className="section-title">
            <span className="section-number">{number}</span>
            <span>{title}</span>
        </div>
    );
}

function FormInput({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = ""
}) {
    return (
        <div className="line-field">
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

function FormSelect({
    label,
    name,
    value,
    onChange,
    options
}) {
    return (
        <div className="line-field">
            <label>{label}</label>

            <select
                name={name}
                value={value}
                onChange={onChange}
            >
                <option value="">Select</option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Radio({
    name,
    value,
    label,
    checked,
    onChange
}) {
    return (
        <label className="radio-option">
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span>{label}</span>
        </label>
    );
}

function Question({ children }) {
    return (
        <div className="question-row">
            {children}
        </div>
    );
}

function VaccineInput({
    label,
    name,
    value,
    onChange
}) {
    return (
        <div className="vaccine-input">
            <label>{label}</label>

            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

function CheckBox({
    name,
    label,
    checked,
    onChange
}) {
    return (
        <label className="checkbox-option">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <span>{label}</span>
        </label>
    );
}

export default MedicalProfile;