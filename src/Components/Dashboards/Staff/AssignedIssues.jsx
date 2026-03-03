import { useEffect, useState, useCallback, useRef } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import {
  getAssignedIssues,
  acceptAssignment,
  rejectAssignment,
} from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import { MoreVertical, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

const AssignedIssues = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  const fetchAssigned = useCallback(async () => {
    if (!profileData?.id) return;
    setLoading(true);
    try {
      const data = await getAssignedIssues(profileData.id);
      setAssignedIssues(data);
      console.log("Issue Assigned to me : ", data);
    } catch (error) {
      console.error("Error fetching assigned issues:", error);
    } finally {
      setLoading(false);
    }
  }, [profileData?.id]);

  useEffect(() => {
    fetchAssigned();
  }, [fetchAssigned]);

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

  const handleAccept = async (assignmentId) => {
    setActionLoading(assignmentId);
    try {
      await acceptAssignment(assignmentId, "");
      await fetchAssigned();
    } catch (error) {
      console.error("Error accepting assignment:", error);
    } finally {
      setActionLoading(null);
      setOpenDropdown(null);
    }
  };

  const handleReject = async (assignmentId) => {
    setActionLoading(assignmentId);
    try {
      await rejectAssignment(assignmentId, "Staff rejected this assignment");
      await fetchAssigned();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setActionLoading(null);
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (assignmentId) => {
    setOpenDropdown(openDropdown === assignmentId ? null : assignmentId);
  };

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen overflow-y-auto transition-colors duration-200">
        <div className="w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Assigned Issues
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
              <div className="overflow-x-auto">
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
                    {assignedIssues.map((issue) => {
                      const isPending = issue.assignment_status === "pending";
                      const isLoading = actionLoading === issue.assignment_id;
                      const isOpen = openDropdown === issue.assignment_id;

                      return (
                        <tr
                          key={issue.assignment_id}
                          className="hover:bg-muted/40 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-card-foreground">
                              {issue?.title || "Untitled Issue"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              #{issue.issue_id}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                                issue?.priority === "critical"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : issue?.priority === "high"
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : issue?.priority === "medium"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  issue?.priority === "critical"
                                    ? "bg-red-500 animate-pulse"
                                    : issue?.priority === "high"
                                      ? "bg-orange-500"
                                      : issue?.priority === "medium"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                }`}
                              />
                              {issue?.priority || "low"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border`}
                            >
                              {issue?.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                                issue?.assignment_status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : issue?.assignment_status === "accepted"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : issue?.assignment_status === "rejected"
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-gray-50 text-gray-700 border-gray-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  issue?.assignment_status === "pending"
                                    ? "bg-yellow-500"
                                    : issue?.assignment_status === "accepted"
                                      ? "bg-blue-500"
                                      : issue?.assignment_status === "rejected"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                              />
                              {issue?.assignment_status}
                            </span>
                          </td>

                          {/* Dropdown Actions */}
                          <td className="px-6 py-4 text-right">
                            <div
                              className="relative inline-block"
                              ref={(el) => {
                                dropdownRefs.current[issue.assignment_id] = el;
                              }}
                            >
                              <button
                                onClick={() =>
                                  toggleDropdown(issue.assignment_id)
                                }
                                disabled={isLoading}
                                className="p-2 rounded-lg hover:bg-muted active:bg-muted/80 transition disabled:opacity-50"
                              >
                                {isLoading ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : (
                                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                                )}
                              </button>

                              {isOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border z-50 text-sm overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                  {/* View Details - Always Available */}
                                  <button
                                    onClick={() => {
                                      navigate(`/tasks/${issue.issue_id}`, {
                                        state: issue,
                                      });
                                      setOpenDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                    <span>View Details</span>
                                  </button>

                                  {/* Accept/Reject - Only for Pending */}
                                  {isPending && (
                                    <>
                                      <div className="border-t border-border" />

                                      {/* ✅ FIXED: Proper onClick handler for Accept */}
                                      <button
                                        onClick={() =>
                                          handleAccept(issue.assignment_id)
                                        }
                                        disabled={isLoading}
                                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Accept</span>
                                      </button>

                                      {/* ✅ FIXED: Proper onClick handler for Reject */}
                                      <button
                                        onClick={() =>
                                          handleReject(issue.assignment_id)
                                        }
                                        disabled={isLoading}
                                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        <span>Reject</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default AssignedIssues;
