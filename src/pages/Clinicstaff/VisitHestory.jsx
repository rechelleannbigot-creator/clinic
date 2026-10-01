import { useState } from "react";
import {
    Search,
    CalendarDays,
    Users,
    ClipboardList,
    CheckCircle,
    Clock,
    Eye,
    X,
    UserRound,
    Stethoscope,
    QrCode,
    FileText,
} from "lucide-react";

import "../../styles/VisitHistory.css";

function VisitHistory() {
    // =====================================================
    // SAMPLE SCHOOL CLINIC VISIT RECORDS
    // =====================================================

    const [visits] = useState([
        {
            id: "VIS-001",
            patientId: "P-001",
            patientName: "Juan Dela Cruz",
            role: "Student",
            courseYear: "BSIT - 2nd Year",
            date: "2026-10-02",
            time: "08:30 AM",
            consultation: "General Checkup",
            complaint: "Headache and dizziness",
            diagnosis: "Headache",
            treatment: "Rest, hydration, and monitoring",
            medicine: "Paracetamol 500mg",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-002",
            patientId: "P-002",
            patientName: "Maria Santos",
            role: "Student",
            courseYear: "BSHM - 1st Year",
            date: "2026-10-01",
            time: "10:15 AM",
            consultation: "Follow-up",
            complaint: "Follow-up for cough",
            diagnosis: "Cough / Upper Respiratory Symptoms",
            treatment: "Rest, fluids, and symptom monitoring",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-003",
            patientId: "P-003",
            patientName: "Robert Lee",
            role: "Employee",
            courseYear: "Teaching Personnel",
            date: "2026-09-30",
            time: "01:20 PM",
            consultation: "Medical Consultation",
            complaint: "Stomach discomfort",
            diagnosis: "Stomach Discomfort",
            treatment: "Rest and observation",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-004",
            patientId: "P-004",
            patientName: "Ana Garcia",
            role: "Student",
            courseYear: "BSBA - 3rd Year",
            date: "2026-09-25",
            time: "09:45 AM",
            consultation: "General Checkup",
            complaint: "Minor wound",
            diagnosis: "Minor Superficial Wound",
            treatment: "Wound cleaning and dressing",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "Completed",
        },
        {
            id: "VIS-005",
            patientId: "P-005",
            patientName: "Michael Reyes",
            role: "Student",
            courseYear: "BSED - 4th Year",
            date: "2026-09-15",
            time: "02:10 PM",
            consultation: "Emergency Consultation",
            complaint: "Feeling faint",
            diagnosis: "Dizziness / Near Fainting",
            treatment: "Seated rest, hydration, and observation",
            medicine: "None",
            staff: "Clinic Nurse",
            status: "In Progress",
        },
    ]);

    // =====================================================
    // STATES
    // =====================================================

    const [searchTerm, setSearchTerm] = useState("");

    const [filterType, setFilterType] = useState("All");

    // DATE FILTER
    const [filterDate, setFilterDate] = useState("All");

    // CUSTOM DATE
    const [customDate, setCustomDate] = useState("");

    // SELECTED VISIT FOR MODAL
    const [selectedVisit, setSelectedVisit] = useState(null);

    // =====================================================
    // LOCAL DATE HELPERS
    // =====================================================

    /*
        Converts a JavaScript Date object into:
        YYYY-MM-DD

        This uses LOCAL time instead of UTC.
        This prevents date filtering problems caused by
        toISOString() and timezone differences.
    */

    const getLocalDateString = (date = new Date()) => {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // =====================================================
    // TODAY
    // =====================================================

    const getToday = () => {
        return getLocalDateString(new Date());
    };

    // =====================================================
    // YESTERDAY
    // =====================================================

    const getYesterday = () => {
        const yesterday = new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        return getLocalDateString(yesterday);
    };

    // =====================================================
    // START OF WEEK
    // =====================================================

    const getStartOfWeek = () => {
        const today = new Date();

        const day = today.getDay();

        const startOfWeek = new Date(today);

        startOfWeek.setDate(
            today.getDate() - day
        );

        startOfWeek.setHours(
            0,
            0,
            0,
            0
        );

        return startOfWeek;
    };

    // =====================================================
    // END OF WEEK
    // =====================================================

    const getEndOfWeek = () => {
        const startOfWeek = getStartOfWeek();

        const endOfWeek = new Date(
            startOfWeek
        );

        endOfWeek.setDate(
            startOfWeek.getDate() + 6
        );

        endOfWeek.setHours(
            23,
            59,
            59,
            999
        );

        return endOfWeek;
    };

    // =====================================================
    // THIS WEEK
    // =====================================================

    const isThisWeek = (dateString) => {
        const visitDate = new Date(
            `${dateString}T00:00:00`
        );

        const startOfWeek =
            getStartOfWeek();

        const endOfWeek =
            getEndOfWeek();

        return (
            visitDate >= startOfWeek &&
            visitDate <= endOfWeek
        );
    };

    // =====================================================
    // THIS MONTH
    // =====================================================

    const isThisMonth = (dateString) => {
        const visitDate = new Date(
            `${dateString}T00:00:00`
        );

        const today = new Date();

        return (
            visitDate.getMonth() ===
                today.getMonth() &&
            visitDate.getFullYear() ===
                today.getFullYear()
        );
    };

    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredVisits = visits.filter(
        (visit) => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            // -------------------------------------------------
            // SEARCH FILTER
            // -------------------------------------------------

            const matchesSearch =
                visit.patientName
                    .toLowerCase()
                    .includes(search) ||

                visit.patientId
                    .toLowerCase()
                    .includes(search) ||

                visit.id
                    .toLowerCase()
                    .includes(search) ||

                visit.consultation
                    .toLowerCase()
                    .includes(search) ||

                visit.complaint
                    .toLowerCase()
                    .includes(search) ||

                visit.diagnosis
                    .toLowerCase()
                    .includes(search);

            // -------------------------------------------------
            // PATIENT TYPE FILTER
            // -------------------------------------------------

            const matchesType =
                filterType === "All" ||
                visit.role === filterType;

            // -------------------------------------------------
            // DATE FILTER
            // -------------------------------------------------

            let matchesDate = true;

            switch (filterDate) {
                case "Today":
                    matchesDate =
                        visit.date ===
                        getToday();
                    break;

                case "Yesterday":
                    matchesDate =
                        visit.date ===
                        getYesterday();
                    break;

                case "This Week":
                    matchesDate =
                        isThisWeek(
                            visit.date
                        );
                    break;

                case "This Month":
                    matchesDate =
                        isThisMonth(
                            visit.date
                        );
                    break;

                case "Custom Date":
                    matchesDate =
                        customDate !== "" &&
                        visit.date ===
                            customDate;
                    break;

                case "All":
                default:
                    matchesDate = true;
                    break;
            }

            // -------------------------------------------------
            // FINAL FILTER RESULT
            // -------------------------------------------------

            return (
                matchesSearch &&
                matchesType &&
                matchesDate
            );
        }
    );

    // =====================================================
    // SUMMARY
    // =====================================================

    const totalVisits =
        visits.length;

    const completedVisits =
        visits.filter(
            (visit) =>
                visit.status ===
                "Completed"
        ).length;

    const inProgressVisits =
        visits.filter(
            (visit) =>
                visit.status ===
                "In Progress"
        ).length;

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (
        dateString
    ) => {
        if (!dateString) {
            return "—";
        }

        const date = new Date(
            `${dateString}T00:00:00`
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {
        setSearchTerm("");

        setFilterType("All");

        setFilterDate("All");

        setCustomDate("");
    };

    // =====================================================
    // HANDLE DATE FILTER CHANGE
    // =====================================================

    const handleDateFilterChange = (
        event
    ) => {
        const selectedDate =
            event.target.value;

        setFilterDate(
            selectedDate
        );

        // Remove custom date when
        // another filter is selected.
        if (
            selectedDate !==
            "Custom Date"
        ) {
            setCustomDate("");
        }
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <div className="visit-history-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="visit-history-header">

                <div className="visit-history-title">

                    <div className="visit-history-header-icon">
                        <ClipboardList
                            size={27}
                        />
                    </div>

                    <div>

                        <h1>
                            Visit History
                        </h1>

                        <p>
                            View and manage
                            student and
                            employee visits
                            to the school
                            clinic.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="visit-history-stats">

                {/* TOTAL VISITS */}

                <div className="visit-stat-card">

                    <div className="visit-stat-icon total-icon">
                        <Users size={23} />
                    </div>

                    <div>

                        <p>
                            Total Visits
                        </p>

                        <h2>
                            {totalVisits}
                        </h2>

                        <span>
                            Recorded clinic
                            visits
                        </span>

                    </div>

                </div>


                {/* COMPLETED */}

                <div className="visit-stat-card">

                    <div className="visit-stat-icon completed-icon">
                        <CheckCircle
                            size={23}
                        />
                    </div>

                    <div>

                        <p>
                            Completed Visits
                        </p>

                        <h2>
                            {completedVisits}
                        </h2>

                        <span>
                            Completed
                            consultations
                        </span>

                    </div>

                </div>


                {/* IN PROGRESS */}

                <div className="visit-stat-card">

                    <div className="visit-stat-icon progress-icon">
                        <Clock size={23} />
                    </div>

                    <div>

                        <p>
                            In Progress
                        </p>

                        <h2>
                            {inProgressVisits}
                        </h2>

                        <span>
                            Ongoing clinic
                            visits
                        </span>

                    </div>

                </div>


                {/* DISPLAYED RECORDS */}

                <div className="visit-stat-card">

                    <div className="visit-stat-icon records-icon">
                        <CalendarDays
                            size={23}
                        />
                    </div>

                    <div>

                        <p>
                            Displayed Records
                        </p>

                        <h2>
                            {
                                filteredVisits.length
                            }
                        </h2>

                        <span>
                            Matching your
                            filters
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                VISIT HISTORY CARD
            ================================================= */}

            <div className="visit-history-card">

                {/* HEADER */}

                <div className="visit-history-card-header">

                    <div>

                        <h2>
                            Clinic Visit Records
                        </h2>

                        <p>
                            Search patient visits
                            and review
                            consultation
                            information.
                        </p>

                    </div>

                    <div className="visit-record-count">

                        {
                            filteredVisits.length
                        }{" "}
                        Records

                    </div>

                </div>


                {/* =================================================
                    SEARCH + FILTER TOOLBAR
                ================================================= */}

                <div className="visit-history-toolbar">

                    {/* SEARCH */}

                    <div className="visit-history-search">

                        <Search size={19} />

                        <input
                            type="text"
                            placeholder="Search patient, diagnosis, visit ID..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                        />

                    </div>


                    {/* FILTERS */}

                    <div className="visit-history-filters">

                        {/* PATIENT TYPE */}

                        <select
                            value={filterType}
                            onChange={(event) =>
                                setFilterType(
                                    event.target
                                        .value
                                )
                            }
                            aria-label="Filter by patient type"
                        >

                            <option value="All">
                                All Patient Types
                            </option>

                            <option value="Student">
                                Students
                            </option>

                            <option value="Employee">
                                Employees
                            </option>

                        </select>


                        {/* DATE FILTER */}

                        <select
                            value={filterDate}
                            onChange={
                                handleDateFilterChange
                            }
                            aria-label="Filter visits by date"
                        >

                            <option value="All">
                                All Dates
                            </option>

                            <option value="Today">
                                Today
                            </option>

                            <option value="Yesterday">
                                Yesterday
                            </option>

                            <option value="This Week">
                                This Week
                            </option>

                            <option value="This Month">
                                This Month
                            </option>

                            <option value="Custom Date">
                                Custom Date
                            </option>

                        </select>


                        {/* CUSTOM DATE PICKER */}

                        {filterDate ===
                            "Custom Date" && (

                            <div className="custom-date-wrapper">

                                <CalendarDays
                                    size={17}
                                />

                                <input
                                    type="date"
                                    value={
                                        customDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCustomDate(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    aria-label="Select custom visit date"
                                />

                            </div>

                        )}


                        {/* CLEAR FILTERS */}

                        {(
                            searchTerm ||
                            filterType !==
                                "All" ||
                            filterDate !==
                                "All" ||
                            customDate !==
                                ""
                        ) && (

                            <button
                                type="button"
                                className="clear-filter-btn"
                                onClick={
                                    clearFilters
                                }
                            >
                                Clear
                            </button>

                        )}

                    </div>

                </div>


                {/* =================================================
                    ACTIVE FILTER INFORMATION
                ================================================= */}

                {filterDate !==
                    "All" && (

                    <div className="active-date-filter">

                        <CalendarDays
                            size={16}
                        />

                        <span>
                            Date filter:
                        </span>

                        <strong>

                            {filterDate ===
                            "Custom Date"
                                ? customDate
                                    ? formatDate(
                                          customDate
                                      )
                                    : "Select a date"
                                : filterDate}

                        </strong>

                    </div>

                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="visit-history-table-wrapper">

                    <table className="visit-history-table">

                        <thead>

                            <tr>

                                <th>
                                    Visit ID
                                </th>

                                <th>
                                    Patient
                                </th>

                                <th>
                                    Patient Type
                                </th>

                                <th>
                                    Date & Time
                                </th>

                                <th>
                                    Consultation
                                </th>

                                <th>
                                    Diagnosis
                                </th>

                                <th>
                                    Clinic Staff
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredVisits.length >
                            0 ? (

                                filteredVisits.map(
                                    (visit) => (

                                        <tr
                                            key={
                                                visit.id
                                            }
                                        >

                                            {/* VISIT ID */}

                                            <td>

                                                <span className="visit-id">
                                                    {
                                                        visit.id
                                                    }
                                                </span>

                                            </td>


                                            {/* PATIENT */}

                                            <td>

                                                <div className="visit-patient-cell">

                                                    <div className="visit-patient-avatar">

                                                        <UserRound
                                                            size={
                                                                19
                                                            }
                                                        />

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                visit.patientName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                visit.patientId
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* PATIENT TYPE */}

                                            <td>

                                                <span
                                                    className={`patient-type-badge ${
                                                        visit.role ===
                                                        "Student"
                                                            ? "student-badge"
                                                            : "employee-badge"
                                                    }`}
                                                >
                                                    {
                                                        visit.role
                                                    }
                                                </span>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                <div className="visit-date-cell">

                                                    <strong>
                                                        {formatDate(
                                                            visit.date
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {
                                                            visit.time
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* CONSULTATION */}

                                            <td>
                                                {
                                                    visit.consultation
                                                }
                                            </td>


                                            {/* DIAGNOSIS */}

                                            <td>

                                                <div className="visit-diagnosis-cell">

                                                    <Stethoscope
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            visit.diagnosis
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* STAFF */}

                                            <td>
                                                {
                                                    visit.staff
                                                }
                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`visit-status-badge ${
                                                        visit.status ===
                                                        "Completed"
                                                            ? "status-completed"
                                                            : "status-progress"
                                                    }`}
                                                >

                                                    <span className="status-dot" />

                                                    {
                                                        visit.status
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    type="button"
                                                    className="visit-view-btn"
                                                    onClick={() =>
                                                        setSelectedVisit(
                                                            visit
                                                        )
                                                    }
                                                >

                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    View

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="visit-empty-state"
                                    >

                                        <div>

                                            <ClipboardList
                                                size={
                                                    35
                                                }
                                            />

                                            <h3>
                                                No visit
                                                records
                                                found
                                            </h3>

                                            <p>
                                                Try
                                                changing
                                                your
                                                search
                                                or date
                                                filter.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="visit-history-footer">

                    Showing{" "}

                    <strong>
                        {
                            filteredVisits.length
                        }
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {visits.length}
                    </strong>

                    {" "}visit records

                </div>

            </div>


            {/* =================================================
                VIEW VISIT MODAL
            ================================================= */}

            {selectedVisit && (

                <div
                    className="visit-modal-overlay"
                    onClick={() =>
                        setSelectedVisit(null)
                    }
                >

                    <div
                        className="visit-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="visit-modal-header">

                            <div className="visit-modal-heading">

                                <div className="visit-modal-icon">

                                    <FileText
                                        size={23}
                                    />

                                </div>

                                <div>

                                    <h2>
                                        Visit Details
                                    </h2>

                                    <p>
                                        Visit ID:{" "}
                                        {
                                            selectedVisit.id
                                        }
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="visit-modal-close"
                                onClick={() =>
                                    setSelectedVisit(
                                        null
                                    )
                                }
                                aria-label="Close visit details"
                            >

                                <X size={21} />

                            </button>

                        </div>


                        {/* MODAL BODY */}

                        <div className="visit-modal-body">

                            {/* PATIENT */}

                            <div className="visit-modal-patient">

                                <div className="visit-modal-patient-avatar">

                                    <UserRound
                                        size={26}
                                    />

                                </div>

                                <div>

                                    <h3>
                                        {
                                            selectedVisit.patientName
                                        }
                                    </h3>

                                    <p>

                                        {
                                            selectedVisit.patientId
                                        }

                                        {" · "}

                                        {
                                            selectedVisit.role
                                        }

                                    </p>

                                    <span>
                                        {
                                            selectedVisit.courseYear
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* VISIT INFORMATION */}

                            <div className="visit-modal-section">

                                <h4>

                                    <CalendarDays
                                        size={18}
                                    />

                                    Visit Information

                                </h4>


                                <div className="visit-detail-grid">

                                    <div>

                                        <span>
                                            Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                selectedVisit.date
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Time
                                        </span>

                                        <strong>
                                            {
                                                selectedVisit.time
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Consultation
                                        </span>

                                        <strong>
                                            {
                                                selectedVisit.consultation
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Clinic Staff
                                        </span>

                                        <strong>
                                            {
                                                selectedVisit.staff
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {
                                                selectedVisit.status
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* MEDICAL INFORMATION */}

                            <div className="visit-modal-section">

                                <h4>

                                    <Stethoscope
                                        size={18}
                                    />

                                    Medical Information

                                </h4>


                                {/* COMPLAINT */}

                                <div className="visit-medical-detail">

                                    <span>
                                        Chief Complaint /
                                        Symptoms
                                    </span>

                                    <p>
                                        {
                                            selectedVisit.complaint ||
                                            "—"
                                        }
                                    </p>

                                </div>


                                {/* DIAGNOSIS */}

                                <div className="visit-medical-detail diagnosis-detail">

                                    <span>
                                        Diagnosis
                                    </span>

                                    <p>
                                        {
                                            selectedVisit.diagnosis ||
                                            "—"
                                        }
                                    </p>

                                </div>


                                {/* TREATMENT */}

                                <div className="visit-medical-detail">

                                    <span>
                                        Treatment /
                                        Management
                                    </span>

                                    <p>
                                        {
                                            selectedVisit.treatment ||
                                            "—"
                                        }
                                    </p>

                                </div>


                                {/* MEDICINE */}

                                <div className="visit-medical-detail">

                                    <span>
                                        Medicine
                                    </span>

                                    <p>
                                        {
                                            selectedVisit.medicine ||
                                            "None"
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* QR NOTE */}

                            <div className="visit-qr-note">

                                <QrCode
                                    size={19}
                                />

                                <p>
                                    Patient
                                    identification
                                    can be linked
                                    to the patient's
                                    QR code when QR
                                    scanning is
                                    connected to your
                                    patient records.
                                </p>

                            </div>

                        </div>


                        {/* MODAL FOOTER */}

                        <div className="visit-modal-footer">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedVisit(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default VisitHistory;