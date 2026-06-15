import { Link } from "react-router-dom";

const IssueCard = ({ issue }) => {
  return (
    <Link
      to={issue.link}
      key={issue.id}
      className={`
        w-full
        sm:w-[calc(50%-6px)]
        lg:w-[calc(33.333%-11px)]
        xl:w-[calc(25%-12px)]
        2xl:w-[calc(25%-12px)]
        bg-linear-to-r ${issue.color} 
        opacity-90 hover:opacity-100
        py-4 sm:py-4 lg:py-6 
        px-4 sm:px-4 lg:px-6 
        rounded-xl
        flex items-center gap-3
        transition-all duration-300
        hover:shadow-lg hover:scale-[1.02]
        group
      `}
    >
      {issue.icon && (
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-white">
          <i className={`${issue.icon} text-base sm:text-lg`}></i>
        </div>
      )}

      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
        <h2 className="text-base sm:text-base lg:text-lg font-bold text-white truncate">
          {issue.name}
        </h2>
        <p className="text-white/95 text-[10px] sm:text-xs md:text-sm mt-0.5 line-clamp-1 sm:line-clamp-2">
          {issue.description}
        </p>
      </div>

      <div className="flex items-center shrink-0">
        <span
          className={`
            ${issue.color2} 
            text-white 
            text-sm sm:text-base lg:text-lg 
            font-bold 
            px-2 sm:px-3 
            py-1 
            rounded-lg
            shadow-sm
            group-hover:scale-110
            transition-transform
          `}
        >
          {issue.count}
        </span>
      </div>
    </Link>
  );
};

export default IssueCard;
