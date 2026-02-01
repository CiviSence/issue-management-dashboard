import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area,
} from "recharts";

const LineChartCard = () => {
 const data = [
  { day: 'Mon', issues: 12, resolved: 8 },
  { day: 'Tue', issues: 19, resolved: 12 },
  { day: 'Wed', issues: 15, resolved: 10 },
  { day: 'Thu', issues: 22, resolved: 15 },
  { day: 'Fri', issues: 28, resolved: 20 },
  { day: 'Sat', issues: 18, resolved: 14 },
  { day: 'Sun', issues: 14, resolved: 11 },
];

  return (
    <div className="bg-white rounded-xl  p-4 pb-10 w-full h-[300px]">
      <h2 className="text-lg pb-2 font-semibold text-gray-700">
        Issues Trend
      </h2>

      <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b5bdb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b5bdb" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#40c057" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#40c057" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="issues" stroke="#3b5bdb" fillOpacity={1} fill="url(#colorIssues)" />
                      <Area type="monotone" dataKey="resolved" stroke="#40c057" fillOpacity={1} fill="url(#colorResolved)" />
                    </AreaChart>
                  </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
