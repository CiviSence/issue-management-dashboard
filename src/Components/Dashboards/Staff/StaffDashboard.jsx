import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";
import { useUser } from "../../../Context/ProfileContext";
import {
  getAssignedIssues,
  mySummary,
  acceptAssignment,
  rejectAssignment,
} from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import IssueCard from "../../Templates/IssueCard";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../Templates/StatusBadge";
import axios from "../../../Utils/axios";
import {
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Clock,
  ArrowRight,
  ClipboardList,
  Hourglass,
} from "lucide-react";

const StaffDashboard = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({});
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Modals state & Action loading
  const [actionLoading, setActionLoading] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notifications/my-notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: [notificationId],
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_unread: false } : n,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => n.is_unread).map((n) => n.id);
    if (unreadIds.length === 0) return;
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: unreadIds,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_unread: false })));
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.is_unread) {
      handleMarkAsRead(notif.id);
    }
    let targetUrl = notif.action_url || notif.link;
    if (!targetUrl && notif.issue_id) {
      targetUrl = `/tasks/${notif.issue_id}`;
    }
    if (targetUrl) {
      if (targetUrl.startsWith("/issues/")) {
        targetUrl = targetUrl.replace("/issues/", "/tasks/");
      }
      navigate(targetUrl);
      setShowNotifications(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.is_unread).length;

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleCloseNotif = (e) => {
      if (!e.target.closest(".notif-container")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleCloseNotif);
    return () => document.removeEventListener("mousedown", handleCloseNotif);
  }, []);

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

  const fetchSummary = async () => {
    if (profileData?.id) {
      try {
        const data = await mySummary(profileData.id);
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchSummary();
  }, [profileData?.id]);

  const handleRefresh = async () => {
    try {
      await Promise.all([
        fetchAssigned(),
        fetchSummary(),
        fetchNotifications(),
      ]);
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  };

  const submitAcceptModal = async () => {
    if (!selectedAssignmentId) return;
    setActionLoading(selectedAssignmentId);
    try {
      await acceptAssignment(selectedAssignmentId, notes);
      setNotes("");
      setActiveModal(null);
      await fetchAssigned();
      await fetchSummary();
    } catch (error) {
      console.error("Error accepting assignment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const submitRejectModal = async () => {
    if (!selectedAssignmentId) return;
    setActionLoading(selectedAssignmentId);
    try {
      await rejectAssignment(
        selectedAssignmentId,
        rejectionReason || "Staff rejected this assignment",
      );
      setRejectionReason("");
      setActiveModal(null);
      await fetchAssigned();
      await fetchSummary();
    } catch (error) {
      console.error("Error rejecting assignment:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingIssues = assignedIssues.filter(
    (issue) => issue.assignment_status === "pending",
  );

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

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      name: "Assigned Issues",
      count: summary.total_assigned,
      description: "All assigned issues",
      color: "from-[#6366f1] to-[#8b5cf6]",
      color2: "bg-[#6366f1]",
      icon: "ri-clipboard-line",
    },
    {
      name: "Pending Issues",
      count: summary.pending_count,
      description: "Pending",
      color: "from-[#f59e0b] to-[#fbbf24]",
      color2: "bg-[#f59e0b]",
      icon: "ri-time-line",
    },
    {
      name: "In Progress",
      count: summary.accepted_count,
      description: "Accepted & In Progress",
      color: "from-[#3b82f6] to-[#60a5fa]",
      color2: "bg-[#3b82f6]",
      icon: "ri-loader-4-line",
    },
    {
      name: "Completed",
      count: summary.completed_count,
      description: "Issues Fixed",
      color: "from-[#10b981] to-[#34d399]",
      color2: "bg-[#10b981]",
      icon: "ri-checkbox-circle-line",
    },
  ];

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="staffDashboardScroll">
        <TopBar title="Your Dashboard" />
        <PullToRefresh scrollContainerId="staffDashboardScroll" onRefresh={handleRefresh}>
          <div className="w-full mx-auto p-2 lg:p-4">
          <div className="w-full gap-2 flex flex-wrap justify-center p-4 rounded-2xl ">
            {stats?.map((item, index) => (
              <IssueCard key={index} issue={item} />
            ))}
          </div>

          {/* Dashboard Main Content sections */}
          <div className="flex flex-col gap-2 px-2 md:gap-6 md:p-4">
            {loading ? (
              <Loader />
            ) : assignedIssues?.length > 0 ? (
              <>
                {/* ── Pending Issues Table/Cards ── */}
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-card-foreground">
                        Pending Issues
                      </h2>
                      {pendingIssues.length > 0 && (
                        <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {pendingIssues.length}
                        </span>
                      )}
                    </div>
                  </div>

                  {pendingIssues.length > 0 ? (
                    <>
                      {/* Mobile Card View for Pending */}
                      <div className="md:hidden divide-y divide-border">
                        {pendingIssues.map((issue) => {
                          const isLoading =
                            actionLoading === issue.assignment_id;
                          return (
                            <div
                              key={issue.assignment_id || issue.id}
                              className="p-4 hover:bg-muted/40 transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0 flex-1">
                                  <div
                                    className="font-semibold text-card-foreground hover:text-primary transition-colors cursor-pointer text-sm"
                                    onClick={() =>
                                      navigate(
                                        `/tasks/${issue.issue_id || issue.id}`,
                                        {
                                          state: issue,
                                        },
                                      )
                                    }
                                  >
                                    {issue?.title || "Untitled Issue"}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    Assigned:{" "}
                                    {formatDateShort(issue.assigned_at)}
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono shrink-0">
                                  #{issue.issue_id}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <StatusBadge
                                  type="priority"
                                  value={issue?.priority || "low"}
                                />
                                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border bg-amber-50 text-amber-700 border-amber-200">
                                  Pending
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedAssignmentId(
                                      issue.assignment_id,
                                    );
                                    setActiveModal("accept");
                                  }}
                                  disabled={actionLoading !== null}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  {isLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  )}
                                  Accept
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAssignmentId(
                                      issue.assignment_id,
                                    );
                                    setActiveModal("reject");
                                  }}
                                  disabled={actionLoading !== null}
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Table View for Pending */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-muted/50">
                              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Issue
                              </th>
                              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Priority
                              </th>
                              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Assigned
                              </th>
                              <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {pendingIssues.map((issue) => {
                              const isLoading =
                                actionLoading === issue.assignment_id;
                              return (
                                <tr
                                  key={issue.assignment_id || issue.id}
                                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/tasks/${issue.issue_id || issue.id}`,
                                      {
                                        state: issue,
                                      },
                                    )
                                  }
                                >
                                  <td className="px-5 py-3.5">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-sm text-card-foreground line-clamp-1">
                                        {issue?.title || "Untitled Issue"}
                                      </span>
                                      <span className="text-xs text-muted-foreground font-mono mt-0.5">
                                        #{issue.issue_id}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <StatusBadge
                                      type="priority"
                                      value={issue?.priority || "low"}
                                    />
                                  </td>
                                  <td className="px-5 py-3.5">
                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-700 border-amber-200">
                                      Pending
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDateShort(issue.assigned_at)}
                                  </td>
                                  <td
                                    className="px-5 py-3.5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedAssignmentId(
                                            issue.assignment_id,
                                          );
                                          setActiveModal("accept");
                                        }}
                                        disabled={actionLoading !== null}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                      >
                                        {isLoading ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <CheckCircle className="w-3 h-3" />
                                        )}
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedAssignmentId(
                                            issue.assignment_id,
                                          );
                                          setActiveModal("reject");
                                        }}
                                        disabled={actionLoading !== null}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                                      >
                                        <XCircle className="w-3 h-3" />
                                        Reject
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 bg-muted/10">
                      <p className="text-sm font-semibold text-muted-foreground">
                        No pending issues
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-0.5">
                        You have accepted or resolved all assigned tasks!
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Recently Assigned Table/Cards (Keep here) ── */}
                <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border">
                    <h2 className="text-lg font-bold text-card-foreground">
                      Recently Assigned
                    </h2>

                    <a
                      href="/assigned-issues"
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
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
                            <div
                              className="font-semibold text-card-foreground text-sm cursor-pointer hover:text-primary transition-colors"
                              onClick={() =>
                                navigate(
                                  `/tasks/${issue.issue_id || issue.id}`,
                                  {
                                    state: issue,
                                  },
                                )
                              }
                            >
                              {issue?.title || "Untitled Issue"}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Assigned: {formatDateShort(issue.assigned_at)}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            #{issue.issue_id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <StatusBadge
                            type="priority"
                            value={issue?.priority || "low"}
                          />
                          <StatusBadge
                            type="status"
                            value={issue?.assignment_status || "pending"}
                          />
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/tasks/${issue.issue_id || issue.id}`, {
                              state: issue,
                            })
                          }
                          className="w-full px-4 py-2 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          View Details
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Issue
                          </th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Assigned
                          </th>
                          <th className="text-right px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {assignedIssues.slice(0, 5).map((issue) => (
                          <tr
                            key={issue.id}
                            className="hover:bg-muted/40 transition-all duration-200 cursor-pointer"
                            onClick={() =>
                              navigate(`/tasks/${issue.issue_id || issue.id}`, {
                                state: issue,
                              })
                            }
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex flex-col">
                                <span className="font-medium text-sm text-card-foreground line-clamp-1">
                                  {issue?.title || "Untitled Issue"}
                                </span>
                                <span className="text-xs text-muted-foreground font-mono mt-0.5">
                                  #{issue.issue_id}
                                </span>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              <StatusBadge
                                type="priority"
                                value={issue?.priority || "low"}
                              />
                            </td>

                            <td className="px-5 py-3.5">
                              <StatusBadge
                                type="status"
                                value={issue?.assignment_status || "pending"}
                              />
                            </td>

                            <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                              {formatDateShort(issue.assigned_at)}
                            </td>

                            <td
                              className="px-5 py-3.5 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() =>
                                  navigate(
                                    `/tasks/${issue.issue_id || issue.id}`,
                                    {
                                      state: issue,
                                    },
                                  )
                                }
                                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95"
                              >
                                View Details
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
        </PullToRefresh>
      </div>

      {/* ── Accept Modal ── */}
      {activeModal === "accept" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150 text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground">
                  Accept Task
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to accept this task? Add any notes below.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitAcceptModal}
                disabled={actionLoading !== null}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ── */}
      {activeModal === "reject" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150 text-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground">
                  Reject Task
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this task.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition-all"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRejectModal}
                disabled={actionLoading !== null || !rejectionReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffDashboard;
