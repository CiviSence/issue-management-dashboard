import {
  PieChart as RePieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PieChartCard = () => {
  const categoryData = [
    { name: "Maintenance", value: 45, color: "#3b5bdb" },
    { name: "Cleanliness", value: 25, color: "#40c057" },
    { name: "Security", value: 15, color: "#fa5252" },
    { name: "Facilities", value: 10, color: "#fab005" },
    { name: "Other", value: 5, color: "#6c757d" },
  ];

  return (
    <div className="bg-white rounded-xl  p-4 w-full h-[300px] ">
      <h2 className="text-lg font-semibold text-gray-700">
        Issue Distribution
      </h2>
      <div className="flex">
        <ResponsiveContainer width="70%" height={250}>
          <RePieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        </ResponsiveContainer>
        <div className="flex flex-col flex-wrap justify-center gap-3 mt-4">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
