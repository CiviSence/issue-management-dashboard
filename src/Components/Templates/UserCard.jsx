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
  const [loading, setLoading] = useState(false);
  const periods = [
    { label: "All Time", value: "all" },
    { label: "Weekly", value: "week" },
    { label: "This Month", value: "month" },
    { label: "Yearly", value: "year" },
  ];

  const [timePeriod, setTimePeriod] = useState("month");

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);

      await fetchLeaderboard(timePeriod);

      setLoading(false);
    };

    loadLeaderboard();
  }, [timePeriod]);

  const displayedUsers = limit ? leaderboard.slice(0, limit) : leaderboard;
  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="py-4 px-4">
        <div className="h-4 w-10 bg-gray-300 rounded"></div>
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </td>

      <td className="py-4 px-4">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </td>

      <td className="py-4 px-4">
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </td>

      <td className="py-4 px-4">
        <div className="h-4 w-12 bg-gray-300 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl p-4 w-full">
      {/* PERIOD BUTTONS */}
      <div className="flex overflow-x-auto">
        <div className="inline-flex bg-gray-200 rounded-xl p-1 min-w-max">
          {periods.map((item) => (
            <button
              key={item.value}
              onClick={() => setTimePeriod(item.value)}
              className={`px-3 md:px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap
          ${
            timePeriod === item.value
              ? "bg-violet-500 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-300"
          }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className=" overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Rank
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Name
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Reputation
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Total Issues
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Resolved
              </th>

              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Success Rate
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading
              ? Array.from({ length: displayedUsers.length }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : displayedUsers.map((item) => {
                  const { rank, statistics, user } = item;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 font-semibold">#{rank}</td>

                      {/* USER */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#243b8c] text-white flex items-center justify-center text-xs font-semibold">
                                {getInitials(user.name)}
                              </div>
                            )}
                          </div>

                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">{user.reputation_points}</td>

                      <td className="py-3 px-4">{statistics.total_issues}</td>

                      <td className="py-3 px-4">
                        {statistics.resolved_issues}
                      </td>

                      <td className="py-3 px-4 font-medium">
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
