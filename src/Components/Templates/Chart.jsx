import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";



export default function UsersChart({data}) {
  return (
    <div className="h-115 w-[40%] bg-white p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
