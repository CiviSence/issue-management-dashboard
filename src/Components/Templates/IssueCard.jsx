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
        opacity-80 hover:opacity-100
        py-4 sm:py-5 lg:py-6 
        px-4 sm:px-6 lg:px-8 
        rounded-xl sm:rounded-md
        flex justify-between
        items-center
        transition-all duration-300
        hover:shadow-lg hover:scale-[1.02]
        group
      `}
    >
      <div className="flex-1 min-w-0 pr-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white truncate">
          {issue.name}
        </h2>
        <p className="text-white/90 text-xs sm:text-sm mt-1 line-clamp-2">
          {issue.description}
        </p>
      </div>

      <div className="flex items-center shrink-0">
        <span
          className={`
            ${issue.color2} 
            text-white 
            text-lg sm:text-xl lg:text-2xl 
            font-medium 
            px-3 sm:px-4 
            py-1.5 sm:py-2 
            rounded-lg sm:rounded-md
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
