import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users } from "lucide-react";

const COLORS = ["#1677c8", "#16a05d", "#ffa500", "#c5192d"];

function AnalyticsStaff({ data }) {
  const staffConsultationsData = Object.entries(data.staff.consultationsByStaff)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([staff, count]) => ({
      name: staff || "Unknown",
      consultations: count,
    }));

  return (
    <>
      {/* Staff Overview */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Clinic Staff Overview</h2>
            <p>Total staff in clinic: {data.staff.total}</p>
          </div>
          <Users size={21} />
        </div>

        <div className="staff-overview-grid">
          <div className="stat-box">
            <strong>Total Staff</strong>
            <span className="stat-value">{data.staff.total}</span>
          </div>
          <div className="stat-box">
            <strong>Active</strong>
            <span className="stat-value active">{data.staff.active}</span>
          </div>
          <div className="stat-box">
            <strong>Inactive</strong>
            <span className="stat-value inactive">{data.staff.inactive}</span>
          </div>
        </div>
      </div>

      {/* Consultations Per Staff Member */}
      {staffConsultationsData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Consultations by Staff Member</h2>
              <p>Number of consultations recorded by each staff member</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={staffConsultationsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis type="number" stroke="#718096" />
              <YAxis dataKey="name" type="category" width={150} stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5edf5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="consultations" fill="#1677c8">
                {staffConsultationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Staff Performance Table */}
      {staffConsultationsData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Staff Performance Summary</h2>
              <p>Consultation activity per staff member</p>
            </div>
          </div>

          <div className="staff-performance-table">
            <div className="table-header">
              <div className="col-rank">Rank</div>
              <div className="col-name">Staff Name</div>
              <div className="col-consultations">Consultations</div>
              <div className="col-percentage">% of Total</div>
            </div>
            {staffConsultationsData.map((staff, index) => {
              const totalConsultations = staffConsultationsData.reduce(
                (sum, s) => sum + s.consultations,
                0
              );
              const percentage = totalConsultations > 0
                ? ((staff.consultations / totalConsultations) * 100).toFixed(1)
                : "0.0";

              return (
                <div key={index} className="table-row">
                  <div className="col-rank">#{index + 1}</div>
                  <div className="col-name">{staff.name}</div>
                  <div className="col-consultations">{staff.consultations}</div>
                  <div className="col-percentage">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default AnalyticsStaff;
