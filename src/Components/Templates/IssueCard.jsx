import { Link } from "react-router-dom";

const IssueCard = ({ issue }) => {
  return (
    <Link
      to={issue.link}
      key={issue.id}
      className={`
        relative overflow-hidden
        w-[calc(50%-6px)]
        sm:w-[calc(50%-6px)]
        md:w-[calc(50%-8px)]
        lg:w-[calc(33.333%-14px)]
        xl:w-[calc(25%-12px)]
        2xl:w-[calc(25%-12px)]
        p-3 sm:p-4 lg:p-5
        rounded-xl
        transition-all duration-300
        hover:shadow-lg hover:scale-[1.02]
        group
      `}
    >
      <div 
        className={`absolute inset-0 bg-linear-to-r ${issue.color} opacity-90 group-hover:opacity-100 dark:opacity-70 dark:group-hover:opacity-100 transition-opacity duration-300`}
      />
      
      <div className="relative z-10 flex flex-col gap-4 sm:gap-2 h-full justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            {issue.icon && (
              <i
                className={`${issue.icon} text-white/90 text-sm sm:text-base`}
              ></i>
            )}
            <span className="text-white/90 text-sm sm:text-base font-medium">
              {issue.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h3 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
            {issue.count}
          </h3>
          {issue.trend && (
            <span 
              className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${
                issue.trend.isPositive 
                  ? 'bg-green-500/30 text-green-100' 
                  : 'bg-red-500/30 text-red-100'
              }`}
            >
              {issue.trend.value}% 
              {issue.trend.isPositive ? (
                <i className="ri-arrow-right-up-line text-xs sm:text-sm"></i>
              ) : (
                <i className="ri-arrow-right-down-line text-xs sm:text-sm"></i>
              )}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;
