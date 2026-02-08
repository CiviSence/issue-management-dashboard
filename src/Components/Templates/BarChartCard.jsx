import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#4ABC33","#F6DE4B", "#3081CA","#E34A4D"];

const BarChartCard = ({data}) => {
  return (
    <div className="bg-white rounded-xl  p-4 pb-10 w-full h-[300px]">
      <h2 className="text-lg pb-2 font-semibold text-gray-700">Issues by Priority</h2>

      <ResponsiveContainer width="90%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip  />
          <Bar
            stroke="none"
  activeBar={{
    stroke: "none",
    fillOpacity: 1,
  }}
            dataKey="count"
            radius={[6, 6, 0, 0]}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
