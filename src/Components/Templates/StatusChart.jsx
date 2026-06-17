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


const StatusChart = ({data}) => {
  return (
    <div className="bg-white p-3 sm:p-4 w-full h-75 border border-border  rounded-2xl shadow-xs">
  <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
    Status Distribution
  </h2>
  <div className="h-full outline-none focus:outline-none">
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          horizontal={false}
        />
        <XAxis 
          type="number" 
          tick={{ fontSize: 11 }}
          height={30}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 11 }}
          width={70}
          interval={0}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '8px', 
            border: 'none', 
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={40}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
  );
};

export default StatusChart;
