import {
  PieChart as RePieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PieChartCard = ({data}) => {
  
 

  return (
    <div className="bg-white w-full h-75 border border-border p-5 rounded-2xl shadow-xs">
      <h2 className="text-lg font-semibold text-gray-700">
        Category Distribution
      </h2>
      <div className="flex">
        <ResponsiveContainer width="70%" height={250}>
          <RePieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        </ResponsiveContainer>
        <div className="flex flex-col flex-wrap justify-center gap-3 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
