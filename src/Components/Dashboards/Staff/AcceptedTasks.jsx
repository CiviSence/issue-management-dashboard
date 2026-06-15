import { useEffect, useState, useCallback, useRef } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import { MoreVertical, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import StatusBadge from "../../Templates/StatusBadge";

const AcceptedTasks = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAcceptedTasks = useCallback(async () => {
    if (!profileData?.id) return;
    setLoading(true);
    try {
      const response = await getAssignedIssues(profileData.id);
      const data = response.filter(
        (item) => item.assignment_status === "accepted",
      );
      setAssignedIssues(data);
      console.log("Issue Assigned to me : ", data);
    } catch (error) {
      console.error("Error fetching assigned issues:", error);
    } finally {
      setLoading(false);
    }
  }, [profileData?.id]);

  useEffect(() => {
    fetchAcceptedTasks();
  }, [fetchAcceptedTasks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target),
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="flex-1 h-screen overflow-y-auto pb-24 md:pb-6 p-3 md:p-6">
        <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Accepted Tasks
              </h1>
              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                Issues assigned to you!!
              </p>
            </div>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : assignedIssues?.length > 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border">
              {assignedIssues.map((issue) => (
                <div
                  key={issue.assignment_id}
                  className="p-3 sm:p-4 hover:bg-muted/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-card-foreground truncate">
                        {issue?.title || "Untitled Issue"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>#{issue.issue_id}</span>
                        {issue.assigned_at && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <span>Assigned: {formatDate(issue.assigned_at)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <StatusBadge
                      type="priority"
                      value={issue?.priority || "low"}
                    />
                    <StatusBadge type="status" value={issue?.status} />
                    <StatusBadge
                      type="status"
                      value={issue?.assignment_status}
                    />
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/tasks/${issue.issue_id || issue.id}`, {
                        state: issue,
                      })
                    }
                    className="w-full px-4 py-2 text-xs font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition shadow-sm"
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
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Issue
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Priority
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Issue Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-muted-foreground text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {assignedIssues.map((issue) => (
                    <tr
                      key={issue.assignment_id}
                      className="hover:bg-muted/40 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-card-foreground">
                          {issue?.title || "Untitled Issue"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span>#{issue.issue_id}</span>
                          {issue.assigned_at && (
                            <>
                              <span className="text-muted-foreground/50">•</span>
                              <span>Assigned: {formatDate(issue.assigned_at)}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          type="priority"
                          value={issue?.priority || "low"}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge type="status" value={issue?.status} />
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          type="status"
                          value={issue?.assignment_status}
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(`/tasks/${issue.issue_id || issue.id}`, {
                              state: issue,
                            })
                          }
                          className="inline-block px-4 py-1.5 text-xs font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition shadow-sm"
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
    </>
  );
};

export default AcceptedTasks;
