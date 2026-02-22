import { useState, useEffect } from "react";
import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { useUser } from "../../../Context/ProfileContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getMyIssues,
  deleteIssue,
} from "../../../Utils/issues";
import ReportIssueModal from "../../Templates/ReportIssueModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const formatSmartTime = (dateString) => {
  // Force UTC by adding Z
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
  const [myIssues, setMyIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  // Modal State
  const [formModal, setFormModal] = useState(null); // null | { mode: 'create'|'edit', issue? }
  const [isDeleting, setIsDeleting] = useState(null); // Track which issue is being deleted

  const fetchMyIssues = async () => {
    try {
      setLoadingIssues(true);
      const data = await getMyIssues(profileData.id);
      setMyIssues(data);
    } catch (error) {
      console.error("Failed to fetch my issues", error);
      toast.error("Failed to fetch issues. Please try again.");
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    if (profileData?.id) {
      fetchMyIssues();
    }
  }, [profileData]);

  const handleSaved = (issue, mode) => {
    if (mode === "create") {
      setMyIssues((prev) => [issue, ...prev]);
    } else {
      setMyIssues((prev) => prev.map((i) => (i.id === issue.id ? issue : i)));
    }
  };

  // Modal components logic moved to templates

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    setIsDeleting(id);
    try {
      await deleteIssue(id);
      setMyIssues((prev) => prev.filter((i) => i.id !== id));
      toast.success("Issue deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete issue");
    } finally {
      setIsDeleting(null);
    }
  };

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
      <BottomNav />

      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        {/* header */}
        <div className="w-full bg-violet-500 p-4 sm:p-5  lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* LEFT */}
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Student Dashboard
              </h1>

              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                Welcome back! Track your reported issues here.
              </p>
            </div>

            {/* View Profile Link - NEW */}
            <a
              href="/profile"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all font-medium text-sm backdrop-blur-sm"
            >
              <i className="ri-user-smile-line text-lg"></i>
              My Profile
            </a>
          </div>
        </div>

        {/* Stats Overview - NEW */}
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
              <p className="text-lg font-bold text-gray-900">{myIssues.filter(i => i.status === 'resolved').length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <i className="ri-copper-coin-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reputation</p>
              <p className="text-lg font-bold text-gray-900">{profileData?.reputation_points || 0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <i className="ri-line-chart-line text-lg"></i>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</p>
              <p className="text-lg font-bold text-gray-900">Active</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
          <div className="lg:col-span-2 space-y-2 lg:space-y-4">
            {/* Quick Action */}
            <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  Have a problem?
                </h2>

                <p className="text-gray-500 text-sm sm:text-base">
                  Report a new issue on campus.
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => setFormModal({ mode: "create" })}
                className="w-full sm:w-auto bg-violet-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-violet-700 transition shadow-md sm:shadow-lg shadow-violet-200 text-sm sm:text-base"
              >
                + Report Issue
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

                        {/* Meta Row: Location + Time + Priority */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-2">
                          {/* Location */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="font-medium text-gray-700">
                              {issue.location_building.replace("-", " ")}
                            </span>
                            {issue.location_address && (
                              <span className="text-gray-400">
                                • {issue.location_address}
                              </span>
                            )}
                          </div>

                          {/* Smart Time */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-3.5 h-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <time
                              dateTime={issue.created_at}
                              className="font-medium text-gray-700"
                            >
                              {formatSmartTime(issue.created_at)}
                            </time>
                          </div>

                          {/* Priority Tag */}
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
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              {issue.engagement.upvotes || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                              </svg>
                              {issue.engagement.downvotes || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {issue.engagement.views_count || 0}
                            </span>
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
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
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            disabled={isDeleting === issue.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === issue.id ? (
                              <svg
                                className="w-3.5 h-3.5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l-2.647z"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                            {isDeleting === issue.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>

          <div>
            <UserCard limit={3} />

            <div className="bg-violet-500 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden mt-2 lg:mt-4">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-1">Campus News</h3>
                <p className="text-violet-200 text-sm">
                  Stay updated with latest announcements.
                </p>
                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-xs">Exam schedule released!</p>
                </div>
              </div>
              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
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
