import { useEffect, useState } from "react";
import { useUsers } from "../../Context/UserContext";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const UserCard = ({ limit }) => {
  const { leaderboard, fetchLeaderboard } = useUsers();
  const periods = [
    { label: "All Time", value: "all" },
    { label: "Weekly", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Yearly", value: "year" },
   
  ];

  const [timePeriod, setTimePeriod] = useState("month");
  

  useEffect(() => {
    fetchLeaderboard(timePeriod);
  }, [timePeriod]);

  const displayedUsers = limit ? leaderboard.slice(0, limit) : leaderboard;

  return (
    <div className="bg-white rounded-xl p-4 w-full">
      <div className="inline-flex bg-gray-200 rounded-xl p-1">
        {periods.map((item) => (
          <button
            key={item.value}
            onClick={() => setTimePeriod(item.value)}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${
            timePeriod === item.value
              ? "bg-violet-500 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-300"
          }
        `}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-3 px-4 text-sm font-medium text-gray-500 w-[80px]">
                Rank
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Name
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500 w-[100px] shrink-0">
                Reputation
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500 w-[100px] shrink-0">
                Total Issues
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500 w-[100px] shrink-0">
                Resolved Issues
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500 w-[140px]">
                Success Rate
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {displayedUsers.map((item) => {
              const { rank, statistics, user } = item;

              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Rank */}
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    #{rank}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#243b8c] text-white flex items-center justify-center text-xs font-semibold">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <span className="font-medium text-gray-900 truncate">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-700">
                    {user.reputation_points}
                  </td>

                  {/* Issues */}
                  <td className="py-3 px-4 text-gray-700">
                    {statistics.total_issues}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {statistics.resolved_issues}
                  </td>

                  {/* Success Rate */}
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {statistics.success_rate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCard;
