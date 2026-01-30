import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const IssuesBarChart = ({ issuesData = [] }) => {
  if (!issuesData.length) return null;

  return (
    <div className="w-full h-[400px]"> {/* 👈 REQUIRED */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={issuesData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {issuesData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IssuesBarChart;
