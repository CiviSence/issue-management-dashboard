import {
  PieChart as RePieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PieChartCard = ({ data }) => {
  return (
    <div className="bg-white dark:bg-dark-card  p-5 rounded-2xl  w-full min-h-[340px] group relative overflow-hidden flex flex-col">
      <div className="mb-2 relative z-10">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight dark:text-dark-text">
          Category Distribution
        </h2>
        <p className="text-xs text-gray-500 mt-1 dark:text-dark-text-secondary">
          Issues spread by category
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 items-center justify-center relative z-10 gap-4">
        <div className="w-full md:w-3/5 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                animationDuration={1500}
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity duration-300 outline-none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  fontWeight: 500,
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-2/5 flex flex-row md:flex-col flex-wrap justify-center gap-3 mt-2 md:mt-0">
          {data?.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 bg-gray-50 dark:bg-dark-elevated/80 dark:bg-dark-elevated/80 px-3 py-2 rounded-xl border border-gray-100 dark:border-dark-border/50 hover:bg-gray-100 dark:hover:bg-dark-elevated dark:bg-dark-elevated hover:shadow-sm transition-all duration-200 cursor-default"
            >
              <div
                className="w-3 h-3 rounded-full shadow-inner"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
