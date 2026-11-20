import { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Pill,
  Activity,
  Calendar,
  BarChart3,
  RefreshCw,
  Download,
  Printer,
  AlertTriangle,
  Loader,
} from "lucide-react";
import "../../styles/Analytics.css";
import AnalyticsCharts from "../../components/Analytics/AnalyticsCharts";
import AnalyticsStudents from "../../components/Analytics/AnalyticsStudents";
import AnalyticsMedicines from "../../components/Analytics/AnalyticsMedicines";
import AnalyticsStaff from "../../components/Analytics/AnalyticsStaff";
import AnalyticsInsights from "../../components/Analytics/AnalyticsInsights";

function Analytics() {
  const [period, setPeriod] = useState("This Month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch analytics on component mount or when filters change
  useEffect(() => {
    const shouldFetch = period !== "Custom" || (customStartDate && customEndDate);
    if (!shouldFetch) return;

    // Calculate date range based on current period state
    const calculateAndFetch = async () => {
      const today = new Date();
      let startDate, endDate;

      endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      switch (period) {
        case "Today":
          startDate = new Date(today);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "This Week":
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay());
          startDate.setHours(0, 0, 0, 0);
          break;
        case "This Month":
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case "This Year":
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        case "Custom":
          startDate = new Date(`${customStartDate}T00:00:00Z`);
          endDate = new Date(`${customEndDate}T23:59:59Z`);
          break;
        default:
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          startDate.setHours(0, 0, 0, 0);
      }

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `/api/admin/analytics?startDate=${startDateStr}&endDate=${endDateStr}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch analytics");
        }

        const analyticsData = await response.json();
        setData(analyticsData);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message || "Failed to load analytics");
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    calculateAndFetch();
  }, [period, customStartDate, customEndDate]);

  // Manual refresh function
  const handleRefresh = async () => {
    const today = new Date();
    let startDate, endDate;

    endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case "Today":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "This Week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "This Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "This Year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case "Custom":
        startDate = new Date(`${customStartDate}T00:00:00Z`);
        endDate = new Date(`${customEndDate}T23:59:59Z`);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `/api/admin/analytics?startDate=${startDateStr}&endDate=${endDateStr}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch analytics");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to load analytics");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Print analytics
  const handlePrint = () => {
    window.print();
  };

  // Download data as CSV
  const handleDownloadCSV = () => {
    if (!data) return;

    let csvContent = "Clinic Analytics Report\n";
    csvContent += `Generated: ${new Date().toLocaleString()}\n`;
    csvContent += `Period: ${data.period.startDate} to ${data.period.endDate}\n\n`;

    csvContent += "OVERVIEW\n";
    csvContent += `Total Students,${data.overview.totalStudents}\n`;
    csvContent += `Total Consultations,${data.overview.totalConsultations}\n`;
    csvContent += `Total Medicine Types,${data.overview.totalMedicineTypes}\n`;
    csvContent += `Total Medicine Quantity,${data.overview.totalMedicineQuantity}\n`;
    csvContent += `Low Stock Medicines,${data.overview.lowStockMedicines}\n`;
    csvContent += `Total Medicines Issued,${data.overview.totalMedicineIssued}\n`;
    csvContent += `Total Staff,${data.overview.totalStaff}\n`;
    csvContent += `Active Staff,${data.overview.activeStaff}\n\n`;

    csvContent += "CONSULTATIONS BY TYPE\n";
    Object.entries(data.consultations.byType).forEach(([type, count]) => {
      csvContent += `${type},${count}\n`;
    });
    csvContent += "\n";

    csvContent += "TOP DIAGNOSES\n";
    Object.entries(data.consultations.commonDiagnoses)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([diagnosis, count]) => {
        csvContent += `"${diagnosis}",${count}\n`;
      });
    csvContent += "\n";

    csvContent += "MOST ISSUED MEDICINES\n";
    Object.entries(data.medicines.mostIssuedMedicines)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([medicine, quantity]) => {
        csvContent += `"${medicine}",${quantity}\n`;
      });

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute("download", `analytics-${new Date().toISOString().split("T")[0]}.csv`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <AlertTriangle size={48} />
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={handleRefresh} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Monitor clinic performance and analyze healthcare activities.</p>
        </div>

        <div className="analytics-controls">
          <div className="analytics-period">
            <Calendar size={17} />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Custom</option>
            </select>
          </div>

          {period === "Custom" && (
            <div className="custom-date-range">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="Start Date"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="End Date"
              />
            </div>
          )}

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn-refresh"
            title="Refresh Analytics"
          >
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
            Refresh
          </button>

          <button
            onClick={handleDownloadCSV}
            disabled={!data || loading}
            className="btn-download"
            title="Download as CSV"
          >
            <Download size={18} />
            Export
          </button>

          <button
            onClick={handlePrint}
            disabled={!data || loading}
            className="btn-print"
            title="Print Analytics"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="analytics-updated">
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="analytics-loading">
          <Loader size={40} className="spinning" />
          <p>Loading analytics data...</p>
        </div>
      )}

      {/* Analytics Content */}
      {data && !loading && (
        <>
          {/* KPI Cards */}
          <AnalyticsOverviewCards data={data} />

          {/* Main Analytics Sections */}
          <div className="analytics-container">
            {/* Consultation Analytics */}
            <AnalyticsCharts data={data} />

            {/* Student Analytics */}
            <AnalyticsStudents data={data} />

            {/* Medicine Inventory Analytics */}
            <AnalyticsMedicines data={data} />

            {/* Clinic Staff Analytics */}
            <AnalyticsStaff data={data} />
          </div>

          {/* Insights */}
          <AnalyticsInsights insights={data.insights} />
        </>
      )}

      {!data && !loading && !error && (
        <div className="analytics-empty">
          <BarChart3 size={48} />
          <p>No analytics data available. Try adjusting the date range.</p>
        </div>
      )}
    </div>
  );
}

function AnalyticsOverviewCards({ data }) {
  const cards = [
    {
      title: "Total Registered Students",
      value: data.overview.totalStudents,
      icon: <Users size={24} />,
      color: "blue",
      subtitle: "Student records",
    },
    {
      title: "Total Consultations",
      value: data.overview.totalConsultations,
      icon: <Stethoscope size={24} />,
      color: "green",
      subtitle: "Consultation records",
    },
    {
      title: "Total Medicines Available",
      value: data.overview.totalMedicineQuantity,
      icon: <Pill size={24} />,
      color: "orange",
      subtitle: `${data.overview.totalMedicineTypes} types`,
    },
    {
      title: "Total Medicines Issued",
      value: data.overview.totalMedicineIssued,
      icon: <Activity size={24} />,
      color: "purple",
      subtitle: "Issuance records",
    },
    {
      title: "Clinic Staff",
      value: data.overview.totalStaff,
      icon: <Users size={24} />,
      color: "red",
      subtitle: `${data.overview.activeStaff} active`,
    },
    {
      title: "Low Stock Alerts",
      value: data.overview.lowStockMedicines,
      icon: <AlertTriangle size={24} />,
      color: "yellow",
      subtitle: "Medicines to restock",
    },
  ];

  return (
    <div className="analytics-kpis">
      {cards.map((card, index) => (
        <div key={index} className="analytics-kpi-card">
          <div className={`kpi-icon ${card.color}`}>{card.icon}</div>
          <div className="kpi-content">
            <span className="kpi-title">{card.title}</span>
            <strong className="kpi-value">{card.value}</strong>
            <div className="kpi-subtitle">{card.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Analytics;
