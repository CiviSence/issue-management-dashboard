import { useState, useEffect } from "react";
import StudentSideNav from "./StudentSideNav";
import StudentBottomNav from "./StudentBottomNav";
import UserCard from "../../Templates/UserCard";
import { useUser } from "../../../Context/ProfileContext";
import { useIssues } from "../../../Context/IssuesContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteIssue } from "../../../Utils/issues";
import ReportIssueModal from "../../Templates/ReportIssueModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "../../../Utils/axios";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatSmartTime = (dateString) => {
  const date = new Date(dateString + "Z");
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInSeconds < 60) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  if (diffInHours < 24)
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StudentDashboard = () => {
  const { profileData } = useUser();
  const { issues: myIssues, campusStats, loading: loadingIssues, addIssue, updateIssue, removeIssue } = useIssues();
  const [formModal, setFormModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notifications/my-notifications");
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => n.is_unread).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: [notificationId],
      });
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_unread: false, status: "read" } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => n.is_unread).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: unreadIds,
      });
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_unread: false, status: "read" }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSaved = (issue, mode) => {
    if (mode === "create") {
      addIssue(issue);
    } else {
      updateIssue(issue);
    }
  };

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    setIsDeleting(id);
    try {
      await deleteIssue(id);
      removeIssue(id);
      toast.success("Issue deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete issue");
    } finally {
      setIsDeleting(null);
    }
  };

  const firstName = profileData?.name?.split(" ")[0] || "there";
  const resolvedCount = myIssues.filter(i => i.status === "resolved").length;
  const pendingCount = myIssues.filter(i => i.status !== "resolved" && i.status !== "closed").length;

  // Get the most recent activity highlight
  const latestResolved = myIssues.find(i => i.status === "resolved");
  const latestInProgress = myIssues.find(i => i.status === "in_progress");

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <StudentSideNav />
      <StudentBottomNav />

      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        {/* Desktop Header */}
        <div className="hidden sm:block w-full bg-violet-500 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                {getGreeting()}, {firstName}
              </h1>
              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                {myIssues.length === 0
                  ? "Start by reporting your first campus issue."
                  : pendingCount > 0
                    ? `You have ${pendingCount} issue${pendingCount !== 1 ? "s" : ""} awaiting resolution.`
                    : "All your issues are resolved. Nice work."}
              </p>
            </div>
            <a
              href="/profile"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all font-medium text-sm backdrop-blur-sm"
            >
              <i className="ri-user-smile-line text-lg"></i>
              My Profile
            </a>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{getGreeting()}</p>
              <h1 className="text-lg font-bold text-gray-900">{firstName}</h1>
            </div>
            <button
              onClick={() => setFormModal({ mode: "create" })}
              className="bg-violet-500 text-white px-3.5 py-2 rounded-xl font-semibold text-xs hover:bg-violet-600 transition shadow-md shadow-violet-200"
            >
              + Report
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-lg">
              <i className="ri-file-list-3-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Reports</p>
              <p className="text-lg font-bold text-gray-900">{myIssues.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <i className="ri-checkbox-circle-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Resolved</p>
              <p className="text-lg font-bold text-gray-900">{resolvedCount}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <i className="ri-time-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Pending</p>
              <p className="text-lg font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <i className="ri-copper-coin-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reputation</p>
              <p className="text-lg font-bold text-gray-900">{profileData?.reputation_points || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
          <div className="lg:col-span-2 space-y-2 lg:space-y-4">
            {/* Quick Action — upgraded */}
            <div className="hidden sm:flex bg-gradient-to-r from-violet-500 to-purple-600 p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md items-center justify-between gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-10" />
              <div className="relative z-10">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  Spotted something on campus?
                </h2>
                <p className="text-violet-200 text-sm mt-1">
                  Help your community by reporting the issue. We'll take it from here.
                </p>
              </div>
              <button
                onClick={() => setFormModal({ mode: "create" })}
                className="relative z-10 shrink-0 bg-white text-violet-600 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:bg-violet-50 transition shadow-lg text-sm sm:text-base"
              >
                Report Issue
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-3 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 min-h-75">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Recent Reports
              </h3>

              {loadingIssues ? (
                <Skeleton count={5} height={90} className="mb-3" />
              ) : myIssues.length > 0 ? (
                <div className="space-y-3">
                  {myIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-md ${issue.status === "resolved"
                        ? "border-emerald-200 bg-emerald-50/30"
                        : issue.status === "in_progress"
                          ? "border-blue-200 bg-blue-50/30"
                          : "border-gray-200 hover:border-blue-300"
                        } ${isDeleting === issue.id ? "opacity-50" : ""}`}
                    >
                      {/* Status Indicator Strip */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${issue.status === "resolved"
                          ? "bg-emerald-500"
                          : issue.status === "in_progress"
                            ? "bg-blue-500"
                            : issue.status === "open"
                              ? "bg-amber-500"
                              : "bg-gray-400"
                          }`}
                      />

                      <div className="p-5 pl-6">
                        {/* Header: Title + Status Badge */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                              {issue.title}
                            </h4>
                            <p className="mt-1.5 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {issue.description}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${{
                              new: "bg-violet-50 text-violet-600 border-violet-200",
                              open: "bg-amber-50 text-amber-700 border-amber-200",
                              in_progress: "bg-blue-50 text-blue-700 border-blue-200",
                              resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
                              closed: "bg-gray-100 text-gray-600 border-gray-200",
                            }[issue.status] || "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${issue.status === "resolved"
                                ? "bg-emerald-600"
                                : issue.status === "in_progress"
                                  ? "bg-blue-600"
                                  : issue.status === "open"
                                    ? "bg-amber-600"
                                    : "bg-gray-600"
                                }`}
                            />
                            {issue.status.replace("_", " ")}
                          </span>
                        </div>

                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1.5">
                            <i className="ri-map-pin-line text-gray-400" />
                            <span className="font-medium text-gray-700">
                              {issue.location_building.replace("-", " ")}
                            </span>
                            {issue.location_address && (
                              <span className="text-gray-400">
                                · {issue.location_address}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="ri-time-line text-gray-400" />
                            <time
                              dateTime={issue.created_at}
                              className="font-medium text-gray-700"
                            >
                              {formatSmartTime(issue.created_at)}
                            </time>
                          </div>
                          <span
                            className={`ml-auto px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${{
                              low: "bg-gray-50 text-gray-600 border-gray-200",
                              medium: "bg-orange-50 text-orange-700 border-orange-200",
                              high: "bg-rose-50 text-rose-700 border-rose-200",
                              critical: "bg-red-50 text-red-700 border-red-200",
                            }[issue.priority] || "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                          >
                            {issue.priority}
                          </span>
                        </div>

                        {/* Engagement stats */}
                        {issue.engagement && (
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <i className="ri-thumb-up-fill text-emerald-500 text-sm" />
                              {issue.engagement.upvotes || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <i className="ri-thumb-down-fill text-rose-500 text-sm" />
                              {issue.engagement.downvotes || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <i className="ri-eye-line text-gray-400 text-sm" />
                              {issue.engagement.views_count || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <i className="ri-chat-3-line text-violet-400 text-sm" />
                              {issue.engagement.comment_count ?? 0}
                            </span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => setFormModal({ mode: "edit", issue })}
                            disabled={isDeleting === issue.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors disabled:opacity-50"
                          >
                            <i className="ri-edit-line text-sm" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            disabled={isDeleting === issue.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === issue.id ? (
                              <i className="ri-loader-4-line text-sm animate-spin" />
                            ) : (
                              <i className="ri-delete-bin-6-line text-sm" />
                            )}
                            {isDeleting === issue.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State — clean */
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                    <i className="ri-file-search-line text-3xl text-violet-400" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-800 mb-1">No reports yet</h4>
                  <p className="text-sm text-gray-400 max-w-xs mb-5">
                    You haven't reported any campus issues. When you do, they'll show up right here.
                  </p>
                  <button
                    onClick={() => setFormModal({ mode: "create" })}
                    className="bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-600 transition shadow-md shadow-violet-200"
                  >
                    Report your first issue
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <UserCard limit={3} />

            {/* Notifications Panel */}
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mt-2 lg:mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <i className="ri-notification-3-line text-violet-500" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {loadingNotifications ? (
                <Skeleton count={3} height={50} className="mb-2 rounded-lg" />
              ) : notifications.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => notif.is_unread && handleMarkAsRead(notif.id)}
                      className={`relative p-3 rounded-xl border transition-all cursor-pointer ${notif.is_unread
                        ? "bg-violet-50/60 border-violet-200 hover:bg-violet-50"
                        : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                        }`}
                    >
                      {notif.is_unread && (
                        <span className="absolute top-3 right-3 w-2 h-2 bg-violet-500 rounded-full" />
                      )}
                      <p className={`text-xs font-semibold leading-snug mb-0.5 pr-4 ${notif.is_unread ? "text-gray-900" : "text-gray-600"
                        }`}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatSmartTime(notif.sent_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-2">
                    <i className="ri-notification-off-line text-xl text-violet-300" />
                  </div>
                  <p className="text-xs text-gray-400">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Activity Highlights */}
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mt-2 lg:mt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i className="ri-pulse-line text-violet-500" />
                Activity Highlights
              </h3>
              <div className="space-y-2.5">
                {latestResolved ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">Recently Resolved</p>
                    <p className="text-xs text-emerald-900 font-medium line-clamp-1">{latestResolved.title}</p>
                  </div>
                ) : null}
                {latestInProgress ? (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wide mb-0.5">In Progress</p>
                    <p className="text-xs text-blue-900 font-medium line-clamp-1">{latestInProgress.title}</p>
                  </div>
                ) : null}
                {!latestResolved && !latestInProgress && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 text-center">No activity highlights yet.</p>
                  </div>
                )}
                <div className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide">Reputation</p>
                    <p className="text-sm font-bold text-violet-700">{profileData?.reputation_points || 0} pts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Overview */}
            {campusStats && (
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mt-2 lg:mt-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="ri-bar-chart-2-line text-violet-500" />
                  Campus Overview
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Total campus issues</span>
                    <span className="text-sm font-bold text-gray-800">{campusStats.issues?.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Reported today</span>
                    <span className="text-sm font-bold text-gray-800">{campusStats.issues?.today || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">This week</span>
                    <span className="text-sm font-bold text-gray-800">{campusStats.issues?.this_week || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-500">Resolution rate</span>
                    <span className="text-sm font-bold text-emerald-600">{campusStats.issues?.resolution_rate || 0}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support Shortcut */}
            <div className="bg-violet-600 text-white p-5 rounded-2xl shadow-lg mt-4 relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = "/help-support"}>
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <i className="ri-customer-service-2-fill" />
                  Help & Support
                </h3>
                <p className="text-violet-100 text-xs mb-3">Facing issues? Our support team is here to help you 24/7.</p>
                <button className="bg-white text-violet-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors">
                  Contact Support
                </button>
              </div>
              <i className="ri-question-line absolute -right-4 -bottom-4 text-8xl text-white/10 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Issue Modal */}
      {formModal && (
        <ReportIssueModal
          initial={formModal.mode === "edit" ? formModal.issue : null}
          onClose={() => setFormModal(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default StudentDashboard;
