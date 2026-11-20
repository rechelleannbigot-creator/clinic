import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";

const COLORS = ["#1677c8", "#16a05d", "#ffa500", "#c5192d", "#7c3aed", "#ec4899"];

function AnalyticsStudents({ data }) {
  const genderData = Object.entries(data.students.byGender).map(
    ([gender, count]) => ({
      name: gender,
      value: count,
    })
  );

  const yearLevelData = Object.entries(data.students.byYearLevel)
    .map(([level, count]) => ({
      name: level,
      count: count,
    }))
    .sort((a, b) => {
      const aNum = parseInt(a.name);
      const bNum = parseInt(b.name);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.name.localeCompare(b.name);
    });

  const courseData = Object.entries(data.students.byCourse)
    .map(([course, count]) => ({
      name: course,
      count: count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const monthlyRegistrations = Object.entries(data.students.monthlyRegistrations)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      registrations: count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <>
      {/* Student Overview */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Student Overview</h2>
            <p>Total registered students: {data.students.total}</p>
          </div>
          <Users size={21} />
        </div>

        <div className="student-overview-grid">
          <div className="stat-box">
            <strong>Total Students</strong>
            <span className="stat-value">{data.students.total}</span>
          </div>
          <div className="stat-box">
            <strong>Male</strong>
            <span className="stat-value">{data.students.byGender.Male || 0}</span>
          </div>
          <div className="stat-box">
            <strong>Female</strong>
            <span className="stat-value">{data.students.byGender.Female || 0}</span>
          </div>
          <div className="stat-box">
            <strong>Other</strong>
            <span className="stat-value">{data.students.byGender.Other || 0}</span>
          </div>
        </div>
      </div>

      {/* Gender Distribution */}
      {genderData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Gender Distribution</h2>
              <p>Student distribution by gender</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Students by Year Level */}
      {yearLevelData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Students by Year Level</h2>
              <p>Distribution of students across year levels</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis dataKey="name" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5edf5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#1677c8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Students by Course */}
      {courseData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Students by Course/Section</h2>
              <p>Top 10 courses/sections by enrollment</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis type="number" stroke="#718096" />
              <YAxis dataKey="name" type="category" width={120} stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5edf5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#16a05d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Student Registrations */}
      {monthlyRegistrations.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Monthly Student Registrations</h2>
              <p>New student registrations per month</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRegistrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis dataKey="month" stroke="#718096" />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5edf5",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#ffa500"
                strokeWidth={2}
                dot={{ fill: "#ffa500", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

export default AnalyticsStudents;
