import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const COLORS = ["#1677c8", "#16a05d", "#ffa500", "#c5192d", "#7c3aed", "#ec4899"];

function AnalyticsCharts({ data }) {
  const monthlyData = Object.entries(data.consultations.monthlyTrends)
    .map(([month, count]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      consultations: count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const consultationTypeData = Object.entries(data.consultations.byType).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  const diagnosisData = Object.entries(data.consultations.commonDiagnoses)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([diagnosis, count]) => ({
      name: diagnosis,
      count: count,
    }));

  const dailyData = Object.entries(data.consultations.dailyActivity)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: count,
    }))
    .slice(-30);

  return (
    <>
      {/* Monthly Consultation Trends */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Monthly Consultation Trends</h2>
            <p>Number of consultations per month</p>
          </div>
          <TrendingUp size={21} />
        </div>

        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
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
                dataKey="consultations"
                stroke="#1677c8"
                strokeWidth={2}
                dot={{ fill: "#1677c8", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No consultation data available</div>
        )}
      </div>

      {/* Consultation Types Distribution */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Consultation Types</h2>
            <p>Distribution of consultation types</p>
          </div>
        </div>

        {consultationTypeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={consultationTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {consultationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No consultation type data available</div>
        )}
      </div>

      {/* Common Diagnoses */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Common Diagnoses</h2>
            <p>Top 10 most frequently diagnosed conditions</p>
          </div>
        </div>

        {diagnosisData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diagnosisData} layout="vertical">
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
              <Bar dataKey="count" fill="#16a05d" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">No diagnosis data available</div>
        )}
      </div>

      {/* Daily Consultation Activity */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Daily Consultation Activity</h2>
            <p>Consultations recorded per day (last 30 days)</p>
          </div>
        </div>

        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis dataKey="date" stroke="#718096" />
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
        ) : (
          <div className="chart-empty">No daily activity data available</div>
        )}
      </div>
    </>
  );
}

export default AnalyticsCharts;
