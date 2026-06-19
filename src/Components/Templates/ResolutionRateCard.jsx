import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const ResolutionRateCard = ({ resolved = 0, total = 0 }) => {
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const chartData = [
    { name: "bg", value: 100, fill: "#E1E4F3" },
    { name: "Resolution", value: rate, fill: rate >= 70 ? "#10b981" : rate >= 40 ? "#f59e0b" : "#ef4444" },
  ];

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs flex flex-col items-center">
      <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2 self-start">
        <i className="ri-donut-chart-line text-[#7E70EB] text-lg"></i>
        Resolution Rate
      </h3>

      <div className="relative w-full flex justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="90%"
            startAngle={225}
            endAngle={-45}
            data={chartData}
            barSize={14}
          >
            <RadialBar
              background={false}
              dataKey="value"
              cornerRadius={10}
              animationDuration={1200}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-4xl font-extrabold"
            style={{
              color: rate >= 70 ? "#10b981" : rate >= 40 ? "#f59e0b" : "#ef4444",
            }}
          >
            {rate}%
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">
            Issues Resolved
          </span>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex gap-6 mt-1">
        <div className="text-center">
          <span className="text-xs text-muted-foreground block">Resolved</span>
          <span className="text-lg font-bold text-emerald-600">{resolved}</span>
        </div>
        <div className="w-px bg-border"></div>
        <div className="text-center">
          <span className="text-xs text-muted-foreground block">Total</span>
          <span className="text-lg font-bold text-card-foreground">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default ResolutionRateCard;
