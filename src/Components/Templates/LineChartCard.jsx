import { useEffect, useState } from "react";
import axios from "../../Utils/axios";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

const LineChartCard = () => {
  const [trendData, setTrendData] = useState([]);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    totalIssues: 0,
    totalResolved: 0,
  });

  const fetchTrend = async (selectedPeriod) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/analytics/issue-trends?period=${selectedPeriod}`,
      );

      setTrendData(data.data);
      setTotals({
        totalIssues: data.total_issues,
        totalResolved: data.total_resolved,
      });
    } catch (error) {
      console.error("Failed to fetch trend data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend(period);
  }, [period]);

  return (
    <div className="bg-white rounded-xl p-5 w-full h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Issues Trend
        </h2>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="appearance-none bg-white border border-gray-300 text-gray-700 text-xs rounded px-2 py-1  focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Totals */}
      <div className="flex gap-2 text-sm text-gray-600 mb-2">
        <p>
          Total Issues:{" "}
          <span className="font-semibold text-blue-600">
            {totals.totalIssues}
          </span>
        </p>
        <p>
          Resolved:{" "}
          <span className="font-semibold text-green-600">
            {totals.totalResolved}
          </span>
        </p>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-[250px] text-gray-400">
          Loading trend...
        </div>
      ) : (
        <ResponsiveContainer width="90%" height={200}>
          <AreaChart data={trendData}>
            {/* Gradients */}
            <defs>
              <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#40c057" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#40c057" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />

            <YAxis tick={{ fontSize: 11 }} />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="issues"
              stroke="#3b5bdb"
              fillOpacity={1}
              fill="url(#colorIssues)"
              animationDuration={800}
            />

            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#40c057"
              fillOpacity={1}
              fill="url(#colorResolved)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineChartCard;
