import React from "react";

const IssueCard = ({ issue }) => {
  return (
    <div
      className={`w-[20%] min-w-70 bg-linear-to-r ${issue.color} opacity-80 py-6 px-8 mt-2 rounded-md  flex  justify-between`}
    >
      <div>
        <h2 className="text-2xl font-semibold text-white">{issue.name}</h2>
        <p className="text-[#ffffff]">{issue.description}</p>
      </div>
      <div className="text-center  h-full flex items-center">
        <span
          className={` ${issue.color2} text-white text-2xl font-medium px-4 py-2  rounded-md `}
        >
          {issue.count}
        </span>
      </div>
    </div>
  );
};

export default IssueCard;
