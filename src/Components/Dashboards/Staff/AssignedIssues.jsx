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
import StatusBadge from "../../Templates/StatusBadge";

const AssignedIssues = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
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

      <div className="flex-1 h-screen overflow-y-auto pb-24 md:pb-6 p-3 md:p-6">
        <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                Assigned Issues
              </h1>
              <p className="text-indigo-100/90 text-sm sm:text-base md:text-lg mt-1 tracking-wide">
                Issues assigned to you
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
                  {assignedIssues.map((issue) => {
                    const isPending = issue.assignment_status === "pending";
                    const isLoading = actionLoading === issue.assignment_id;
                    const isOpen = openDropdown === issue.assignment_id;

                    return (
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

                          {/* Dropdown trigger */}
                          <div
                            className="relative shrink-0"
                            ref={(el) => {
                              dropdownRefs.current[issue.assignment_id] = el;
                            }}
                          >
                            <button
                              onClick={() => toggleDropdown(issue.assignment_id)}
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

                                {isPending && (
                                  <>
                                    <div className="border-t border-border" />
                                    <button
                                      onClick={() => handleAccept(issue.assignment_id)}
                                      disabled={isLoading}
                                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Accept</span>
                                    </button>
                                    <button
                                      onClick={() => handleReject(issue.assignment_id)}
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
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge type="priority" value={issue?.priority || "low"} />
                          <StatusBadge type="status" value={issue?.status} />
                          <StatusBadge type="status" value={issue?.assignment_status} />
                        </div>
                      </div>
                    );
                  })}
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
                              <StatusBadge type="priority" value={issue?.priority || "low"} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge type="status" value={issue?.status} />
                            </td>

                            <td className="px-6 py-4">
                              <StatusBadge type="status" value={issue?.assignment_status} />
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

                                    {isPending && (
                                      <>
                                        <div className="border-t border-border" />
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
