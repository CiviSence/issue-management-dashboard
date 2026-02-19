import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues } from "../../../Utils/issues";

const StaffDashboard = () => {
  const { profileData } = useUser();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssigned = async () => {
      if (profileData?.id) {
        try {
          const data = await getAssignedIssues(profileData.id);
          setAssignedIssues(data);
        } catch (error) {
          console.error("Error fetching assigned issues:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssigned();
  }, [profileData?.id]);

  const stats = {
    pending: assignedIssues.filter((i) => i.status === "pending").length,
    inProgress: assignedIssues.filter((i) => i.status === "in_progress").length,
    completedToday: assignedIssues.filter((i) => {
      if (i.status !== "resolved") return false;
      const updatedAt = new Date(i.updated_at);
      const today = new Date();
      return updatedAt.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] min-h-screen overflow-y-auto">
        <div className="w-full mx-auto">
          {/* header */}
          <div className="w-full bg-violet-500 p-4 sm:p-5  lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* LEFT */}
              <div>
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  Your Dashboard
                </h1>

                <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                  Welcome back, {profileData?.name || "Staff Member"}!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground text-sm">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-primary">
                {stats?.pending ?? 0}
              </h3>
            </div>

            <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground text-sm">In Progress</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {stats?.inProgress ?? 0}
              </h3>
            </div>
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground text-sm">Completed Today</p>{" "}
              <h3 className="text-2xl font-bold text-green-600">
                {" "}
                {stats?.completedToday ?? 0}{" "}
              </h3>{" "}
            </div>

            <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
              <p className="text-muted-foreground text-sm">Total Assigned</p>
              <h3 className="text-2xl font-bold text-amber-500">
                {assignedIssues?.length ?? 0}
              </h3>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-card-foreground">
                Recent Assignments
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : assignedIssues?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignedIssues.slice(0, 5).map((issue) => (
                      <tr
                        key={issue.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-4 font-medium">
                          {issue?.title || "No Title"}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold

                        ${
                          issue?.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : issue?.priority === "medium"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                        }
                      `}
                          >
                            {issue?.priority || "low"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold

                        ${
                          issue?.status === "pending"
                            ? "bg-muted text-muted-foreground"
                            : issue?.status === "in_progress"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                        }
                      `}
                          >
                            {issue?.status
                              ? issue.status.replace("_", " ")
                              : "pending"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <a
                            href="/assigned-issues"
                            className="text-primary font-bold hover:underline"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-xl border border-dashed border-border">
                No tasks assigned currently.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
