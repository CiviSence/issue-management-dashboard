import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusData = [
  { name: "Open", value: 200, color: "#F6D04D" },
  { name: "Pending", value: 5, color: "#fab005" },
  { name: "In Progress", value: 100, color: "#3086D5" },
  { name: "Resolved", value: 56, color: "#40c057" },
  { name: "Closed", value: 70, color: "#E34A4D" },
];
const StatusChart = () => {
  return (
    <div className="bg-white rounded-xl  p-4 pb-10 w-full h-[300px]">
      <h2 className="text-lg pb-2 font-semibold text-gray-700">
        Status Distribution
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={statusData} layout="vertical">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            horizontal={false}
          />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusChart;
