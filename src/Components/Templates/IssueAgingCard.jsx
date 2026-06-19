import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const AGING_COLORS = ["#10b981", "#f59e0b", "#f97316", "#ef4444"];
const AGING_LABELS = ["< 24 hrs", "1–3 days", "3–7 days", "> 7 days"];

const IssueAgingCard = ({ issues = [] }) => {
  const agingData = useMemo(() => {
    const now = Date.now();
    const buckets = [0, 0, 0, 0]; // <24h, 1-3d, 3-7d, >7d

    issues.forEach((issue) => {
      const status = issue.status?.toLowerCase();
      if (status === "resolved" || status === "closed") return;

      const created = new Date(issue.created_at).getTime();
      const ageHours = (now - created) / (1000 * 60 * 60);

      if (ageHours < 24) buckets[0]++;
      else if (ageHours < 72) buckets[1]++;
      else if (ageHours < 168) buckets[2]++;
      else buckets[3]++;
    });

    return AGING_LABELS.map((label, i) => ({
      name: label,
      count: buckets[i],
      color: AGING_COLORS[i],
    }));
  }, [issues]);

  const totalOpen = agingData.reduce((s, d) => s + d.count, 0);
  const overdue = agingData[2].count + agingData[3].count;

  return (
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <i className="ri-hourglass-line text-amber-500 text-lg"></i>
          Issue Aging
        </h3>
        {overdue > 0 && (
          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-rose-500/10 text-rose-600 flex items-center gap-1">
            <i className="ri-error-warning-line text-sm"></i>
            {overdue} overdue
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {totalOpen} open issues by age
      </p>

      <ResponsiveContainer width="100%" height={190}>
        <BarChart
          data={agingData}
          layout="vertical"
          margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            width={68}
            interval={0}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value} issues`, "Count"]}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28} animationDuration={900}>
            {agingData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssueAgingCard;
