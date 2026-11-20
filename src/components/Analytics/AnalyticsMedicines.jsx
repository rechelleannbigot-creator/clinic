import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Pill, AlertTriangle, Calendar } from "lucide-react";

const COLORS = ["#1677c8", "#16a05d", "#ffa500", "#c5192d", "#7c3aed", "#ec4899"];

function AnalyticsMedicines({ data }) {
  const medicineStockData = data.medicines.stockDistribution
    .slice(0, 15)
    .map((med) => ({
      name: med.name,
      quantity: med.quantity,
    }));

  const issuanceData = Object.entries(data.medicines.monthlyIssuances)
    .map(([month, quantity]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      quantity: quantity,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const mostIssuedData = Object.entries(data.medicines.mostIssuedMedicines)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([medicine, quantity]) => ({
      name: medicine,
      quantity: quantity,
    }));

  // Medicine inventory status
  const inventoryStatus = [
    {
      name: "In Stock",
      value: data.medicines.stockDistribution.filter(
        (m) => m.quantity > m.reorderLevel && m.quantity > 0
      ).length,
    },
    {
      name: "Low Stock",
      value: data.medicines.stockDistribution.filter(
        (m) => m.quantity > 0 && m.quantity <= m.reorderLevel
      ).length,
    },
    {
      name: "Out of Stock",
      value: data.medicines.stockDistribution.filter((m) => m.quantity === 0)
        .length,
    },
  ];

  const expiringData = data.medicines.expiringMedicines.slice(0, 10).map((med) => ({
    name: med.name,
    expiry: med.expirationDate,
    quantity: med.quantity,
  }));

  return (
    <>
      {/* Medicine Inventory Overview */}
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Medicine Inventory Overview</h2>
            <p>Current inventory status</p>
          </div>
          <Pill size={21} />
        </div>

        <div className="inventory-overview-grid">
          <div className="stat-box">
            <strong>Total Types</strong>
            <span className="stat-value">{data.overview.totalMedicineTypes}</span>
          </div>
          <div className="stat-box">
            <strong>Total Quantity</strong>
            <span className="stat-value">{data.overview.totalMedicineQuantity}</span>
          </div>
          <div className="stat-box">
            <strong>Low Stock</strong>
            <span className="stat-value alert">{data.overview.lowStockMedicines}</span>
          </div>
          <div className="stat-box">
            <strong>Out of Stock</strong>
            <span className="stat-value alert">{data.overview.outOfStockMedicines}</span>
          </div>
          <div className="stat-box">
            <strong>Expired</strong>
            <span className="stat-value alert">{data.overview.expiredMedicines}</span>
          </div>
          <div className="stat-box">
            <strong>Expiring Soon</strong>
            <span className="stat-value warn">{data.overview.expiringMedicines}</span>
          </div>
        </div>
      </div>

      {/* Medicine Stock Distribution */}
      {medicineStockData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Medicine Stock Levels</h2>
              <p>Top 15 medicines by quantity</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={medicineStockData} layout="vertical">
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
              <Bar dataKey="quantity" fill="#1677c8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Inventory Status */}
      {inventoryStatus.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Inventory Status</h2>
              <p>Medicines by stock status</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Medicine Issuance Trends */}
      {issuanceData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Monthly Medicine Issuance Trends</h2>
              <p>Total quantity of medicines issued per month</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={issuanceData}>
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
                dataKey="quantity"
                stroke="#16a05d"
                strokeWidth={2}
                dot={{ fill: "#16a05d", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Most Frequently Issued Medicines */}
      {mostIssuedData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Most Frequently Issued Medicines</h2>
              <p>Top 10 medicines by issuance volume</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mostIssuedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5edf5" />
              <XAxis dataKey="name" stroke="#718096" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#718096" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5edf5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="quantity" fill="#ffa500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Medicines Approaching Expiration */}
      {expiringData.length > 0 && (
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h2>Medicines Approaching Expiration</h2>
              <p>Top 10 medicines expiring within 30 days</p>
            </div>
            <AlertTriangle size={21} />
          </div>

          <div className="expiring-medicines-list">
            {expiringData.map((med, index) => (
              <div key={index} className="expiring-item">
                <div className="expiring-info">
                  <strong>{med.name}</strong>
                  <div className="expiry-date">
                    <Calendar size={14} />
                    Expires: {new Date(med.expiry).toLocaleDateString()}
                  </div>
                </div>
                <div className="expiry-quantity">
                  <span>{med.quantity} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default AnalyticsMedicines;
