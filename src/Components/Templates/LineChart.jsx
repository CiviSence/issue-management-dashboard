import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export default function UserChart({ data }) {
  return (
    <div className="w-full lg:w-[48%] h-[300px] sm:h-[400px] bg-white p-4 rounded-xl">
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
