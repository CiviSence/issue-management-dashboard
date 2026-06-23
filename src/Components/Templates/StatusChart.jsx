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
    <div className="bg-white border border-border p-5 rounded-2xl shadow-xs  w-full min-h-[340px]  shadow-gray-200/40 hover:-translate-y-1 transition-all duration-300 ease-in-out group relative overflow-hidden flex flex-col">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Location Distribution
        </h2>
        <p className="text-xs text-gray-500 mt-1">Location distribution of issues</p>
      </div>
      
      <div className="flex-1 relative z-10 w-full outline-none focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -15, right: 10, top: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#f3f4f6"
              horizontal={false}
            />
            <XAxis 
              type="number" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              height={20}
            />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
              width={80}
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                fontWeight: 500
              }}
              itemStyle={{ color: '#1f2937' }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 8, 8, 0]} 
              maxBarSize={32}
              animationDuration={1500}
            >
              {data?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className="hover:brightness-110 transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;
