import { useState } from "react";
import {
  Search,
  History as HistoryIcon,
  CalendarDays,
  UserRound,
  FileText,
  Eye,
  X,
  Activity,
  Pill,
  ClipboardList,
  Clock,
  CheckCircle,
} from "lucide-react";
import "../../styles/History.css";

function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Sample visit history for UI demonstration
  const [visits] = useState([
    {
      id: "CON-001",
      date: "2026-10-15",
      time: "09:30 AM",
      type: "General Consultation",
      symptoms: "Headache and mild fever",
      diagnosis: "Tension Headache",
      treatment: "Rest and adequate hydration",
      medicine: "Paracetamol 500 mg",
      dosage: "1 tablet as prescribed",
      staff: "Clinic Staff",
      status: "Completed",
      notes: "Monitor symptoms and return if they persist.",
    },
    {
      id: "CON-002",
      date: "2026-10-08",
      time: "10:15 AM",
      type: "Follow-up Check",
      symptoms: "Cough and sore throat",
      diagnosis: "Common Cold",
      treatment: "Rest and increased fluid intake",
      medicine: "Cetirizine 10 mg",
      dosage: "As prescribed",
      staff: "Clinic Staff",
      status: "Completed",
      notes: "Follow the instructions provided by the clinic staff.",
    },
    {
      id: "CON-003",
      date: "2026-09-25",
      time: "01:00 PM",
      type: "Medical Consultation",
      symptoms: "Stomach discomfort",
      diagnosis: "For clinical assessment",
      treatment: "Assessment and monitoring",
      medicine: "None recorded",
      dosage: "N/A",
      staff: "Clinic Staff",
      status: "Completed",
      notes: "Consultation record for demonstration purposes.",
    },
  ]);

  const filteredVisits = visits.filter((visit) =>
    [
      visit.id,
      visit.date,
      visit.type,
      visit.symptoms,
      visit.diagnosis,
      visit.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

  return (
    <div className="history-page">
      {/* Page Header */}
      <div className="history-header">
        <div>
          <h1>Visit History</h1>
          <p>
            View your past medical consultations, clinic visits,
            diagnoses, and treatment records.
          </p>
        </div>

        <div className="history-header-icon">
          <HistoryIcon size={27} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="history-summary">
        <div className="history-summary-card">
          <div className="history-summary-icon blue">
            <CalendarDays size={23} />
          </div>
          <div>
            <span>Total Visits</span>
            <h2>{visits.length}</h2>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="history-summary-icon green">
            <CheckCircle size={23} />
          </div>
          <div>
            <span>Completed Visits</span>
            <h2>
              {visits.filter((visit) => visit.status === "Completed").length}
            </h2>
          </div>
        </div>

        <div className="history-summary-card">
          <div className="history-summary-icon purple">
            <Activity size={23} />
          </div>
          <div>
            <span>Consultation Records</span>
            <h2>{visits.length}</h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="history-search-card">
        <div className="history-search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Search by consultation ID, date, diagnosis, or symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <span className="history-count">
          {filteredVisits.length}{" "}
          {filteredVisits.length === 1 ? "Record" : "Records"}
        </span>
      </div>

      {/* Visit History Table */}
      <div className="history-table-card">
        <div className="history-table-heading">
          <div>
            <h2>Medical Visit Records</h2>
            <p>
              Your recorded clinic consultations and previous visits.
            </p>
          </div>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Consultation ID</th>
                <th>Visit Date</th>
                <th>Consultation</th>
                <th>Symptoms</th>
                <th>Diagnosis</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredVisits.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    <span className="history-record-id">{visit.id}</span>
                  </td>

                  <td>
                    <div className="history-date-cell">
                      <CalendarDays size={16} />
                      {formatDate(visit.date)}
                    </div>
                  </td>

                  <td>{visit.type}</td>
                  <td>{visit.symptoms}</td>
                  <td>{visit.diagnosis}</td>

                  <td>
                    <span
                      className={`history-status ${
                        visit.status === "Completed"
                          ? "completed"
                          : "pending"
                      }`}
                    >
                      {visit.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="history-view-button"
                      onClick={() => setSelectedVisit(visit)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVisits.length === 0 && (
          <div className="history-empty">
            <HistoryIcon size={38} />
            <h3>No visit history found</h3>
            <p>
              Try another search term or check back when a consultation
              record is available.
            </p>
          </div>
        )}
      </div>

      {/* Visit Details Modal */}
      {selectedVisit && (
        <div
          className="history-modal-overlay"
          onClick={() => setSelectedVisit(null)}
        >
          <div
            className="history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="history-modal-header">
              <div>
                <span className="history-modal-label">
                  CONSULTATION RECORD
                </span>
                <h2 id="history-modal-title">Visit Details</h2>
                <p>{selectedVisit.id}</p>
              </div>

              <button
                type="button"
                className="history-modal-close"
                onClick={() => setSelectedVisit(null)}
                aria-label="Close visit details"
              >
                <X size={21} />
              </button>
            </div>

            <div className="history-modal-body">
              <div className="history-detail-highlight">
                <div className="history-detail-icon">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <span>Consultation Type</span>
                  <strong>{selectedVisit.type}</strong>
                </div>
                <span className="history-status completed">
                  {selectedVisit.status}
                </span>
              </div>

              <div className="history-detail-grid">
                <div className="history-detail-item">
                  <span>
                    <CalendarDays size={15} /> Visit Date
                  </span>
                  <strong>{formatDate(selectedVisit.date)}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <Clock size={15} /> Visit Time
                  </span>
                  <strong>{selectedVisit.time}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <Activity size={15} /> Symptoms
                  </span>
                  <strong>{selectedVisit.symptoms}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <FileText size={15} /> Diagnosis
                  </span>
                  <strong>{selectedVisit.diagnosis}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <ClipboardList size={15} /> Treatment
                  </span>
                  <strong>{selectedVisit.treatment}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <Pill size={15} /> Medicine
                  </span>
                  <strong>{selectedVisit.medicine}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <FileText size={15} /> Dosage / Instructions
                  </span>
                  <strong>{selectedVisit.dosage}</strong>
                </div>

                <div className="history-detail-item">
                  <span>
                    <UserRound size={15} /> Recorded By
                  </span>
                  <strong>{selectedVisit.staff}</strong>
                </div>
              </div>

              <div className="history-notes">
                <h3>Additional Notes</h3>
                <p>{selectedVisit.notes || "No additional notes recorded."}</p>
              </div>
            </div>

            <div className="history-modal-footer">
              <button
                type="button"
                className="history-close-button"
                onClick={() => setSelectedVisit(null)}
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

export default History;