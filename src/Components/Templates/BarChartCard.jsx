import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Vibrant, modern colors
const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

const BarChartCard = ({ data }) => {
  return (
    <div className="pb-12 w-full min-h-[340px] bg-white dark:bg-dark-card  p-5 rounded-2xl group relative overflow-hidden flex flex-col">

      <div className="mb-6 flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight dark:text-dark-text">
            Issues by Priority
          </h2>
          <p className="text-xs text-gray-500 mt-1 dark:text-dark-text-secondary">
            Breakdown of reported issues
          </p>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="status"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                fontWeight: 500,
              }}
              itemStyle={{ color: "#1f2937" }}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
              animationDuration={1500}
            >
              {data?.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartCard;
