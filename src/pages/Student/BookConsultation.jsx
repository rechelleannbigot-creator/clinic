import { useState } from "react";
import {
    Calendar,
    Clock,
    Stethoscope,
    FileText,
    CheckCircle,
} from "lucide-react";

import "../../styles/BookConsultation.css";

function BookConsultation() {
    const [formData, setFormData] = useState({
        consultation: "",
        date: "",
        time: "",
        reason: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                consultation: "",
                date: "",
                time: "",
                reason: "",
            });
        }, 3000);
    };

    return (
        <div className="book-consultation-page">

            {/* HEADER */}
            <div className="booking-header">
                <div>
                    <h1>Book Consultation</h1>
                    <p>
                        Schedule a consultation with the clinic staff.
                    </p>
                </div>

                <div className="booking-icon">
                    <Stethoscope size={22} />
                    <span>Clinic Appointment</span>
                </div>
            </div>

            {/* SUCCESS MESSAGE */}
            {submitted && (
                <div className="booking-success">
                    <CheckCircle size={20} />
                    <div>
                        <strong>Consultation booked successfully!</strong>
                        <p>
                            Your consultation request has been submitted.
                        </p>
                    </div>
                </div>
            )}

            {/* BOOKING CARD */}
            <div className="booking-card">

                <div className="booking-card-header">
                    <div className="header-icon">
                        <Calendar size={22} />
                    </div>

                    <div>
                        <h2>Schedule a Consultation</h2>
                        <p>
                            Please provide the details for your consultation.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="booking-form">

                        {/* CONSULTATION */}
                        <div className="form-group">
                            <label>
                                Consultation <span>*</span>
                            </label>

                            <select
                                name="consultation"
                                value={formData.consultation}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select consultation
                                </option>
                                <option value="Follow-up">
                                    Follow-up
                                </option>
                            </select>
                        </div>

                        {/* DATE */}
                        <div className="form-group">
                            <label>
                                Preferred Date <span>*</span>
                            </label>

                            <div className="input-icon">
                                <Calendar size={18} />

                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* TIME */}
                        <div className="form-group">
                            <label>
                                Preferred Time <span>*</span>
                            </label>

                            <div className="input-icon">
                                <Clock size={18} />

                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* REASON */}
                        <div className="form-group full-width">
                            <label>
                                Reason for Consultation <span>*</span>
                            </label>

                            <div className="textarea-icon">
                                <FileText size={18} />

                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Briefly describe the reason for your follow-up consultation..."
                                    rows="5"
                                    required
                                />
                            </div>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="booking-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                setFormData({
                                    consultation: "",
                                    date: "",
                                    time: "",
                                    reason: "",
                                })
                            }
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="book-btn"
                        >
                            <Calendar size={18} />
                            Book Consultation
                        </button>

                    </div>

                </form>
            </div>

            {/* INFORMATION */}
            <div className="booking-information">
                <h3>Before booking</h3>

                <ul>
                    <li>
                        Choose your preferred date and time.
                    </li>
                    <li>
                        Consultation type is currently set to Follow-up.
                    </li>
                    <li>
                        Please provide an accurate reason for your visit.
                    </li>
                    <li>
                        Your request will be reviewed by the clinic staff.
                    </li>
                </ul>
            </div>

        </div>
    );
}

export default BookConsultation;

