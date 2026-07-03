import { useEffect, useState } from "react";
import { useUsers } from "../../Context/UserContext";
import defaultPfpFemale from "../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../assets/default-pfp/default-pfp-male.svg";

const getDefaultAvatar = (gender) => {
  const g = gender?.toLowerCase();
  return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};

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

  const [timePeriod, setTimePeriod] = useState("all");

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
      <td className="py-3 px-2 sm:px-4">
        <div className="h-3 sm:h-4 w-6 sm:w-10 bg-gray-300 rounded"></div>
      </td>
      <td className="py-3 px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-300 rounded-full"></div>
          <div className="h-3 sm:h-4 w-20 sm:w-32 bg-gray-300 rounded"></div>
        </div>
      </td>
      <td className="py-3 px-2 sm:px-4">
        <div className="h-3 sm:h-4 w-10 sm:w-16 bg-gray-300 rounded"></div>
      </td>
      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
        <div className="h-3 sm:h-4 w-10 sm:w-16 bg-gray-300 rounded"></div>
      </td>
      <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
        <div className="h-3 sm:h-4 w-10 sm:w-16 bg-gray-300 rounded"></div>
      </td>
      <td className="py-3 px-2 sm:px-4">
        <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gray-300 rounded"></div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-3 sm:p-4 w-full   rounded-2xl shadow-xs">
      {/* filter buttons */}
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="inline-flex bg-gray-200 rounded-xl p-1 min-w-max">
          {periods.map((item) => (
            <button
              key={item.value}
              onClick={() => setTimePeriod(item.value)}
              className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap
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

      {/* TABLE CONTAINER - Horizontal scroll on mobile */}
      <div className="overflow-x-auto mt-3 sm:mt-4 -mx-3 sm:mx-0 px-3 sm:px-0">
        <table className="w-full border-collapse min-w-150 sm:min-w-0">
          {/* HEADER*/}
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 w-12 sm:w-16">
                Rank
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                Rep
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 ">
                Issues
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 ">
                Resolved
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                Rate
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading
              ? Array.from({ length: displayedUsers.length || 5 }).map(
                  (_, i) => <SkeletonRow key={i} />,
                )
              : displayedUsers.map((item) => {
                  const { rank, statistics, user } = item;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm">
                        #{rank}
                      </td>

                      {/* USER - Compact on mobile */}
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0">
                            <img
                              src={user.avatar_url || getDefaultAvatar(user.gender)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-xs sm:text-sm truncate max-w-25 sm:max-w-none">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                        {statistics.resolved_issues * 10 + " " + "points"}
                      </td>

                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm ">
                        {statistics.total_issues}
                      </td>

                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm ">
                        {statistics.resolved_issues}
                      </td>

                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm">
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
