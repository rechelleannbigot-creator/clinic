import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Calendar,
  X,
} from "lucide-react";
import "../../styles/Consultations.css";

function Consultations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [consultations, setConsultations] = useState([
    {
      id: 1,
      patient: "Juan Dela Cruz",
      doctor: "Dr. Maria Santos",
      date: "2026-09-01",
      time: "09:00 AM",
      type: "General Checkup",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Maria Clara",
      doctor: "Dr. Jose Reyes",
      date: "2026-09-01",
      time: "10:30 AM",
      type: "Follow-up",
      status: "Scheduled",
    },
    {
      id: 3,
      patient: "Pedro Garcia",
      doctor: "Dr. Maria Santos",
      date: "2026-09-02",
      time: "01:00 PM",
      type: "Medical Consultation",
      status: "Scheduled",
    },
    {
      id: 4,
      patient: "Ana Lopez",
      doctor: "Dr. Jose Reyes",
      date: "2026-08-30",
      time: "02:30 PM",
      type: "Follow-up",
      status: "Completed",
    },
    {
      id: 5,
      patient: "Carlos Mendoza",
      doctor: "Dr. Maria Santos",
      date: "2026-08-29",
      time: "03:00 PM",
      type: "General Checkup",
      status: "Cancelled",
    },
  ]);

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.patient
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.doctor
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      consultation.type
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this consultation?"
    );

    if (confirmDelete) {
      setConsultations(
        consultations.filter((consultation) => consultation.id !== id)
      );
    }
  };

  return (
    <div className="consultations-page">

      {/* HEADER */}
      <div className="consultations-header">
        <div>
          <h1>Consultations</h1>
          <p>Manage and monitor patient consultations.</p>
        </div>

        <button
          className="add-consultation-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          New Consultation
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="consultation-stats">

        <div className="consultation-stat-card">
          <div className="stat-icon">
            <Calendar size={22} />
          </div>

          <div>
            <span>Total Consultations</span>
            <h2>{consultations.length}</h2>
          </div>
        </div>

        <div className="consultation-stat-card">
          <div className="stat-icon scheduled">
            <Calendar size={22} />
          </div>

          <div>
            <span>Scheduled</span>
            <h2>
              {
                consultations.filter(
                  (item) => item.status === "Scheduled"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="consultation-stat-card">
          <div className="stat-icon completed">
            <Calendar size={22} />
          </div>

          <div>
            <span>Completed</span>
            <h2>
              {
                consultations.filter(
                  (item) => item.status === "Completed"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="consultation-stat-card">
          <div className="stat-icon cancelled">
            <Calendar size={22} />
          </div>

          <div>
            <span>Cancelled</span>
            <h2>
              {
                consultations.filter(
                  (item) => item.status === "Cancelled"
                ).length
              }
            </h2>
          </div>
        </div>

      </div>

      {/* SEARCH */}
      <div className="consultations-toolbar">

        <div className="consultations-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search patient, doctor, or consultation type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="consultations-table-container">

        <table className="consultations-table">

          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Consultation Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredConsultations.length > 0 ? (
              filteredConsultations.map((consultation) => (
                <tr key={consultation.id}>

                  <td>
                    <div className="patient-name">
                      {consultation.patient}
                    </div>
                  </td>

                  <td>{consultation.doctor}</td>

                  <td>{consultation.date}</td>

                  <td>{consultation.time}</td>

                  <td>{consultation.type}</td>

                  <td>
                    <span
                      className={`status-badge ${consultation.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {consultation.status}
                    </span>
                  </td>

                  <td>

                    <div className="consultation-actions">

                      <button
                        className="icon-button view"
                        title="View Consultation"
                        onClick={() =>
                          alert(
                            `Viewing consultation for ${consultation.patient}`
                          )
                        }
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        className="icon-button edit"
                        title="Edit Consultation"
                        onClick={() =>
                          alert(
                            `Editing consultation for ${consultation.patient}`
                          )
                        }
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        className="icon-button delete"
                        title="Delete Consultation"
                        onClick={() =>
                          handleDelete(consultation.id)
                        }
                      >
                        <X size={17} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No consultations found.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="consultation-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <h2>New Consultation</h2>
                <p>Create a new patient consultation.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Consultation created successfully!");
                setShowModal(false);
              }}
            >

              <div className="form-group">
                <label>Patient</label>
                <select required>
                  <option value="">Select patient</option>
                  <option>Juan Dela Cruz</option>
                  <option>Maria Clara</option>
                  <option>Pedro Garcia</option>
                  <option>Ana Lopez</option>
                  <option>Carlos Mendoza</option>
                </select>
              </div>

             

              <div className="form-row">

                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required />
                </div>

              </div>

              <div className="form-group">
                <label>Consultation Type</label>

                <select required>
                  <option value="">Select type</option>
                  <option>General Checkup</option>
                  <option>Medical Consultation</option>
                  <option>Follow-up</option>
                  <option>Emergency Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>

                <textarea
                  placeholder="Enter consultation notes..."
                  rows="4"
                ></textarea>
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  Save Consultation
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Consultations;