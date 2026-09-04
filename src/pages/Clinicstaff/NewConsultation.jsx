import { useState } from "react";
import {
    User,
    Calendar,
    Activity,
    Stethoscope,
    FileText,
    Save,
    X
} from "lucide-react";
import "../../styles/NewConsultation.css";

function NewConsultation() {
    const [formData, setFormData] = useState({
        patient: "",
        date: new Date().toISOString().split("T")[0],
        chiefComplaint: "",
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        weight: "",
        diagnosis: "",
        treatment: "",
        notes: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Consultation Data:", formData);

        alert("Consultation saved successfully!");

        setFormData({
            patient: "",
            date: new Date().toISOString().split("T")[0],
            chiefComplaint: "",
            bloodPressure: "",
            temperature: "",
            heartRate: "",
            weight: "",
            diagnosis: "",
            treatment: "",
            notes: ""
        });
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="consultation-page">

            {/* Header */}
            <div className="consultation-header">
                <div>
                    <h1>New Consultation</h1>
                    <p>Create a new patient consultation record</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                {/* Patient Information */}
                <div className="consultation-card">
                    <div className="card-title">
                        <User size={20} />
                        <h2>Patient Information</h2>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>
                                Patient <span>*</span>
                            </label>

                            <select
                                name="patient"
                                value={formData.patient}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Patient</option>
                                <option value="P-001">
                                    P-001 - Juan Dela Cruz
                                </option>
                                <option value="P-002">
                                    P-002 - Maria Santos
                                </option>
                                <option value="P-003">
                                    P-003 - Pedro Garcia
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <Calendar size={16} />
                                Consultation Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>
                </div>

                {/* Chief Complaint */}
                <div className="consultation-card">
                    <div className="card-title">
                        <Stethoscope size={20} />
                        <h2>Consultation Details</h2>
                    </div>

                    <div className="form-group">
                        <label>
                            Chief Complaint <span>*</span>
                        </label>

                        <textarea
                            name="chiefComplaint"
                            value={formData.chiefComplaint}
                            onChange={handleChange}
                            placeholder="Enter patient's chief complaint..."
                            rows="4"
                            required
                        />
                    </div>
                </div>

                {/* Vital Signs */}
                <div className="consultation-card">
                    <div className="card-title">
                        <Activity size={20} />
                        <h2>Vital Signs</h2>
                    </div>

                    <div className="vitals-grid">

                        <div className="form-group">
                            <label>Blood Pressure</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                placeholder="120/80 mmHg"
                            />
                        </div>

                        <div className="form-group">
                            <label>Temperature</label>
                            <input
                                type="text"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                placeholder="36.5 °C"
                            />
                        </div>

                        <div className="form-group">
                            <label>Heart Rate</label>
                            <input
                                type="text"
                                name="heartRate"
                                value={formData.heartRate}
                                onChange={handleChange}
                                placeholder="72 bpm"
                            />
                        </div>

                        <div className="form-group">
                            <label>Weight</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="60 kg"
                            />
                        </div>

                    </div>
                </div>

                {/* Diagnosis and Treatment */}
                <div className="consultation-card">
                    <div className="card-title">
                        <FileText size={20} />
                        <h2>Diagnosis & Treatment</h2>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Diagnosis</label>

                            <textarea
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                placeholder="Enter diagnosis..."
                                rows="4"
                            />
                        </div>

                        <div className="form-group">
                            <label>Treatment / Prescription</label>

                            <textarea
                                name="treatment"
                                value={formData.treatment}
                                onChange={handleChange}
                                placeholder="Enter treatment or prescription..."
                                rows="4"
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label>Additional Notes</label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Enter additional consultation notes..."
                            rows="4"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleCancel}
                    >
                        <X size={18} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        <Save size={18} />
                        Save Consultation
                    </button>

                </div>

            </form>
        </div>
    );
}

export default NewConsultation;

