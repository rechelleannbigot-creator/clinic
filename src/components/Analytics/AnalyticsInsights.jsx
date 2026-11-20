import { TrendingUp, Lightbulb } from "lucide-react";

function AnalyticsInsights({ insights }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="analytics-card">
        <div className="analytics-card-header">
          <div>
            <h2>Analytics Insights</h2>
            <p>Key findings and trends</p>
          </div>
          <Lightbulb size={21} />
        </div>
        <div className="insights-empty">
          <p>No significant insights available. More data may be needed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div>
          <h2>Analytics Insights</h2>
          <p>Key findings and trends from clinic data</p>
        </div>
        <Lightbulb size={21} />
      </div>

      <div className="insights-list">
        {insights.map((insight, index) => (
          <div key={index} className="insight-item">
            <div className="insight-icon">
              <TrendingUp size={18} />
            </div>
            <div className="insight-content">
              <p>{insight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsInsights;
