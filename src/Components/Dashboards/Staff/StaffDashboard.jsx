import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues, mySummary } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import IssueCard from "../../Templates/IssueCard";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../Templates/StatusBadge";

const StaffDashboard = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({});
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssigned = async () => {
    if (profileData?.id) {
      try {
        const data = await getAssignedIssues(profileData.id);
        setAssignedIssues(data);
        console.log("Issue Assigned to me : ", data);
      } catch (error) {
        console.error("Error fetching assigned issues:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSummary = async () => {
    if (profileData?.id) {
      try {
        const data = await mySummary(profileData.id);
        setSummary(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchSummary();
  }, [profileData?.id]);

  const stats = [
    {
      name: "Assigned Issues",
      count: summary.total_assigned,
      description: "All assigned issues",
      color: "from-[#6366f1] to-[#8b5cf6]",
      color2: "bg-[#6366f1]",
    },
    {
      name: "Pending Issues",
      count: summary.pending_count,
      description: "Pending",
      color: "from-[#f59e0b] to-[#fbbf24]",
      color2: "bg-[#f59e0b]",
    },
    {
      name: "In Progress",
      count: summary.accepted_count,
      description: "Accepted & In Progress",
      color: "from-[#3b82f6] to-[#60a5fa]",
      color2: "bg-[#3b82f6]",
    },
    {
      name: "Completed",
      count: summary.completed_count,
      description: "Issues Fixed",
      color: "from-[#10b981] to-[#34d399]",
      color2: "bg-[#10b981]",
    },
  ];

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <div className="w-full pb-20 md:pb-2 p-2 lg:p-4 lg:w-[calc(100vw-15vw)]  overflow-x-auto">
        <div className="w-full mx-auto">
          {/* header */}
          <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* LEFT */}
              <div>
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                  Your Dashboard
                </h1>

                <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                  Welcome back,{" "}
                  {profileData?.name || summary.staff_name || "staff"}!
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-2 gap-2 flex flex-wrap justify-center bg-[#F3F1FF] p-4 rounded-2xl border border-indigo-50">
            {stats?.map((item, index) => (
              <IssueCard key={index} issue={item} />
            ))}
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm p-6 ">
            <div className="flex justify-between items-center mb-6"></div>

            {loading ? (
              <Loader />
            ) : assignedIssues?.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Recently Assigned</h2>

                  <a
                    href="/assigned-issues"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View All →
                  </a>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border">
                  {assignedIssues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 hover:bg-muted/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-card-foreground truncate">
                            {issue?.title || "Untitled Issue"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            #{issue.issue_id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <StatusBadge type="priority" value={issue?.priority || "low"} />
                        <StatusBadge type="status" value={issue?.assignment_status || "pending"} />
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/tasks/${issue.issue_id}`, {
                            state: issue,
                          })
                        }
                        className="w-full px-4 py-2 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-xs uppercase text-left">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Issue</th>
                        <th className="px-6 py-4 font-semibold">Priority</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignedIssues.slice(0, 5).map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-t border-border hover:bg-muted/40 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium">
                              {issue?.title || "Untitled Issue"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{issue.issue_id}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge type="priority" value={issue?.priority || "low"} />
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge type="status" value={issue?.assignment_status || "pending"} />
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                navigate(`/tasks/${issue.issue_id}`, {
                                  state: issue,
                                })
                              }
                              className="inline-block px-4 py-1.5 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
                <div className="text-4xl mb-2">📭</div>

                <p className="font-semibold text-muted-foreground">
                  No assigned issues
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
