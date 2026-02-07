import { useEffect } from "react";
import { useUsers } from "../../Context/UserContext";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const UserCard = () => {
  const { leaderboard, fetchLeaderboard, loading } = useUsers();

  useEffect(() => {
    fetchLeaderboard();
  }, []);


  if (loading) {
    return <div className="bg-white rounded-xl p-4">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl p-4 pb-10 w-full">
      <div className="flex items-center justify-between mb-3">
       
      </div>

      <table className="w-full">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Rank
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Issues
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Status
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
              Resolved
            </th>
          </tr>
        </thead>

        <tbody className="block md:table-row-group">
          {leaderboard.map((item) => {
            const { rank, statistics, user } = item;

            return (
              <tr
                key={user.id}
                className="
          block md:table-row
          border border-gray-200 md:border-0
          rounded-lg md:rounded-none
          mb-4 md:mb-0
          p-3 md:p-0
          hover:bg-gray-50
        "
              >
                {/* Rank */}
                <td className="block md:table-cell py-2 px-2 md:px-4">
                  <span className="md:hidden text-xs text-gray-400 mr-2">
                    Rank
                  </span>
                  <span className="font-semibold">#{rank}</span>
                </td>

                {/* Name */}
                <td className="block md:table-cell py-2 px-2 md:px-4">
                  <span className="md:hidden text-xs text-gray-400">User</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
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

                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.department} • Year {user.year}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Issues */}
                <td className="block md:table-cell py-2 px-2 md:px-4">
                  <span className="md:hidden text-xs text-gray-400 mr-2">
                    Issues
                  </span>
                  {statistics.total_issues}
                </td>

                {/* Status */}
                <td className="block md:table-cell py-2 px-2 md:px-4">
                  <span className="md:hidden text-xs text-gray-400 mr-2">
                    Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statistics.active_issues > 0
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {statistics.active_issues > 0 ? "Active" : "Resolved"}
                  </span>
                </td>

                {/* Success */}
                <td className="block md:table-cell py-2 px-2 md:px-4">
                  <span className="md:hidden text-xs text-gray-400 mr-2">
                    Resolved
                  </span>
                  {statistics.success_rate}%
                </td>
              </tr>
            );
          })}

          {!leaderboard.length && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserCard;
