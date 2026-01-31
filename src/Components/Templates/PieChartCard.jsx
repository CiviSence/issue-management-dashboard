import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#F6DE4B", "#3081CA", "#4ABC33"];
const PieChartCard = () => {
const data = [
  { name: "Open", value: 80 },
  { name: "In Progress", value: 40 },
  { name: "Resolved", value: 30 },
];

  return (
    <div className="bg-white rounded-xl  p-4 w-full h-[300px] ">
      <h2 className="text-lg font-semibold text-gray-700">
        Issue Distribution
      </h2>

      <ResponsiveContainer width="70%" height="95%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartCard;
