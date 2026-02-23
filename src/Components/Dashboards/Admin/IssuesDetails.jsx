import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  assignIssue,
  deleteIssue,
  getIssueById,
  updateIssue,
} from "../../../Utils/issues";
import Loader from "../../Templates/Loader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../../../Context/UserContext";
const IssueDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const navigate = useNavigate();
  const [issue, setIssue] = useState(location.state || null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { staff, fetchStaff } = useUsers();

  const fetchIssue = async () => {
    try {
      const data = await getIssueById(id);
      console.log(data);
      setIssue(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch issue details");
    }
  };

  const markSpam = async (issueId) => {
    const previousStatus = issue.status;

    setIssue((prev) => ({
      ...prev,
      status: "spam",
    }));

    try {
      await updateIssue(issueId, { status: "spam" });
      toast.success("Issue marked as spam!");
    } catch (error) {
      console.log(error);
      setIssue((prev) => ({
        ...prev,
        status: previousStatus,
      }));
      toast.error("Failed to mark issue as spam.");
    }
  };

  const undoSpam = async (issueId) => {
    const previousStatus = issue.status;

    setIssue((prev) => ({
      ...prev,
      status: "new",
    }));

    try {
      await updateIssue(issueId, { status: "new" });
      toast.success("Issue removed from spam!");
    } catch (error) {
      console.log(error);

      setIssue((prev) => ({
        ...prev,
        status: previousStatus,
      }));
      toast.error("Failed to remove from spam");
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;

    setIsDeleting(true);

    try {
      await deleteIssue(issueId);
      toast.success("Issue deleted!");
      navigate("/reported-issues", { replace: true });
    } catch (error) {
      console.log(error.message || "Delete Error:", error);
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssign = async () => {
    // Validation
    if (!selectedStaff) {
      toast.error("Please select a staff member");
      return;
    }
    setIsAssigning(true);
    try {
      const data = await assignIssue(issue.id, selectedStaff, internalNote);
      console.log("Assignment successful:", data);

      // Update local state
      setIssue((prev) => ({
        ...prev,
        assigned_to: selectedStaff,
        assigned_staff_name: staff.find((s) => s.id === selectedStaff)?.name,
        assignment_notes: internalNote,
        status: prev.status === "new" ? "acknowledged" : prev.status,
      }));
      toast.success("Staff assigned successfully!");
      // Clear form
      setSelectedStaff("");
      setInternalNote("");
    } catch (error) {
      console.error(
        "Assignment failed:",
        error.response?.data?.detail || error.message || error,
      );
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to assign staff",
      );
    } finally {
      setIsAssigning(false);
    }
  };

  //status handler to change status of issue
  const handleSetStatus = async (issueId, newStatus) => {
    //update UI instantly
    setIssue((prev) =>
      prev.id === issueId ? { ...prev, status: newStatus } : prev,
    );

    try {
      await updateIssue(issueId, { status: newStatus });
      toast.success("Issue status updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update issue status.");
    }
  };

  //set priority of the issue
  const handleSetPriority = async (issueId, newPriority) => {
    setIssue((prev) =>
      prev.id === issueId ? { ...prev, priority: newPriority } : prev,
    );

    try {
      await updateIssue(issueId, { priority: newPriority });
      toast.success("Priority updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update priority.");
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchIssue();
  }, [id]);

  const categoryColor = {
    security: "bg-blue-100 text-blue-800",
    maintenance: "bg-red-100 text-red-800",
    infrastructure: "bg-amber-100 text-amber-800",
    cleanliness: "bg-emerald-100 text-emerald-800",
    facilities: "bg-purple-100 text-purple-800",
    other: "bg-gray-100 text-gray-800",
  };

  const priorityColor = {
    critical: "bg-red-300 text-red-800",
    high: "bg-red-100 text-red-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-emerald-100 text-emerald-800",
    new: "bg-sky-100 text-sky-800",
  };

  const statusColor = {
    new: "bg-sky-100 text-sky-800",
    acknowledged: "bg-indigo-100 text-indigo-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-emerald-100 text-emerald-800",
    closed: "bg-zinc-200 text-zinc-800",
    spam: "bg-yellow-100 text-yellow-800",
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
      <SideNav />
      <BottomNav />

      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)]  overflow-x-auto ">
        <div className="w-full bg-violet-500 p-4 rounded-2xl">
          <div
            className="
      flex
      flex-col
      sm:flex-row
      sm:items-center
      sm:justify-between
      gap-2
    "
          >
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Issue Details
            </h1>
            <Searchbar />
          </div>
        </div>
        {issue ? (
          <>
            <div className="mx-auto p-1 sm:p-2 lg:p-3 xl:p-5 w-full">
              {/* Admin Action Bar - Sticky Top */}
              <div className="sticky top-0 sm:top-4 z-20 mb-4 sm:mb-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 sm:p-3 flex  sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 justify-between sm:justify-start">
                    <span className="hidden  px-2 sm:px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs sm:text-sm font-semibold sm:flex items-center gap-1.5">
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Control Panel</span>
                    </span>
                    <span className="text-sm sm:text-m text-gray-500">
                      Issue #{issue.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                    {/* Quick Actions */}
                    <button
                      className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                        issue.status === "spam"
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span
                        onClick={() => markSpam(issue.id)}
                        className="hidden sm:inline"
                      >
                        {issue.status === "spam"
                          ? "Marked as Spam"
                          : "Mark as Spam"}
                      </span>
                      <span
                        onClick={() => markSpam(issue.id)}
                        className="sm:hidden"
                      >
                        {issue.status === "spam" ? "Spam" : "Mark Spam"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDelete(issue.id)}
                      disabled={isDeleting}
                      className={
                        isDeleting
                          ? "opacity-50 px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap cursor-not-allowed"
                          : "px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                      }
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                      <span className="hidden sm:inline">
                        {isDeleting ? "Deleting..." : "Delete"}
                      </span>
                    </button>

                    <div className="hidden sm:block w-px h-6 bg-gray-300 mx-1" />

                    <button
                      onClick={() => setShowAdminPanel(!showAdminPanel)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Manage</span>
                    </button>
                  </div>
                </div>

                {/* Expandable Admin Panel */}
                {showAdminPanel && (
                  <div className="mt-2 sm:mt-3 bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-5 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Status Management */}
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          Update Status
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                          {[
                            "new",
                            "acknowledged",
                            "in_progress",
                            "resolved",
                            "closed",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                handleSetStatus(issue.id, status);
                              }}
                              className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all duration-200 ${
                                issue.status === status
                                  ? "bg-gray-900 text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {status.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Priority Management */}
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                          Set Priority
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["low", "medium", "high", "critical"].map(
                            (priority) => (
                              <button
                                key={priority}
                                onClick={() => {
                                  handleSetPriority(issue.id, priority);
                                }}
                                className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all duration-200 ${
                                  issue.priority === priority
                                    ? priority === "critical"
                                      ? "bg-red-600 text-white"
                                      : priority === "high"
                                        ? "bg-orange-500 text-white"
                                        : priority === "medium"
                                          ? "bg-yellow-500 text-white"
                                          : "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {priority}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Assignment */}

                      <div className="w-full col-span-1 md:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                          {/* Assign To */}
                          <div className="flex-1">
                            <label
                              htmlFor="staff-select"
                              className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              Assign To
                            </label>
                            <select
                              id="staff-select"
                              value={selectedStaff}
                              onChange={(e) => setSelectedStaff(e.target.value)}
                              disabled={isAssigning}
                              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                            >
                              <option value="">Select Staff</option>
                              {staff?.map((person) => (
                                <option key={person.id} value={person.id}>
                                  {person.name} (ID: {person.id})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Internal Notes */}
                          <div className="flex-1">
                            <label
                              htmlFor="internal-note"
                              className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2"
                            >
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                              Internal Notes
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                id="internal-note"
                                type="text"
                                placeholder="Add note..."
                                value={internalNote}
                                onChange={(e) =>
                                  setInternalNote(e.target.value)
                                }
                                disabled={isAssigning}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                              />
                              <button
                                type="button"
                                onClick={handleAssign}
                                disabled={isAssigning || !selectedStaff}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed min-w-20"
                              >
                                {isAssigning ? "..." : "Assign"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content Card */}
              <div
                className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 ${
                  issue.is_spam
                    ? "border-orange-300 bg-orange-50/30"
                    : "border-gray-100"
                }`}
              >
                {/* Spam Warning Banner */}
                {issue.status === "spam" && (
                  <div className="bg-orange-100 border-b border-orange-200 px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-orange-800">
                      This issue has been marked as spam
                    </span>
                    <button
                      onClick={() => undoSpam(issue.id)}
                      className="ml-auto text-xs sm:text-sm text-orange-700 hover:text-orange-900 underline whitespace-nowrap"
                    >
                      Undo
                    </button>
                  </div>
                )}

                {/* all Images */}
                {issue.media_urls?.length > 0 && (
                  <div className="bg-gray-900">
                    {/* Main Image Display */}
                    <div className="relative aspect-video overflow-hidden group">
                      <img
                        src={issue.media_urls[currentImageIndex || 0]}
                        alt={`${issue.title} - Image ${(currentImageIndex || 0) + 1}`}
                        className="w-full h-full object-contain bg-gray-800"
                      />

                      {/* Navigation Arrows - Show when multiple images */}
                      {issue.media_urls.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === 0
                                  ? issue.media_urls.length - 1
                                  : (prev || 0) - 1,
                              )
                            }
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                          >
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                (prev) =>
                                  ((prev || 0) + 1) % issue.media_urls.length,
                              )
                            }
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                          >
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Image Counter */}
                      {issue.media_urls.length > 1 && (
                        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
                          {(currentImageIndex || 0) + 1} /{" "}
                          {issue.media_urls.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnails Strip */}
                    {issue.media_urls.length > 1 && (
                      <div className="flex gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-700 overflow-x-auto scrollbar-hide">
                        {issue.media_urls.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                              (currentImageIndex || 0) === index
                                ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-gray-800"
                                : "opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {(currentImageIndex || 0) === index && (
                              <div className="absolute inset-0 bg-violet-500/20" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Title & Meta */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <h1
                        className={`text-xl sm:text-2xl lg:text-3xl font-bold leading-tight ${
                          issue.status === "spam"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {issue.title}
                      </h1>

                      {/* Quick Stats */}
                      <div className="flex sm:hidden items-center gap-3 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg self-start">
                        <span className="flex items-center gap-1">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {issue.views_count}
                        </span>
                        <span className="w-px h-3 bg-gray-300" />
                        <span className="font-medium text-gray-900">
                          Score: {issue.net_score}
                        </span>
                      </div>

                      <div className="hidden sm:flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          {issue.views_count}
                        </span>
                        <span className="w-px h-4 bg-gray-300" />
                        <span className="font-medium text-gray-900">
                          Score: {issue.net_score}
                        </span>
                      </div>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full ${categoryColor[issue.main_category]}`}
                      >
                        {issue.main_category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded-full">
                        : {issue.sub_category}
                      </span>
                      <span
                        className={`hidden sm:inline px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded-full ${statusColor[issue.status]}`}
                      >
                        {issue.status}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold rounded-full  ${
                          priorityColor[issue.priority]
                        }`}
                      >
                        priority : {issue.priority}
                      </span>

                      {issue.is_verified && (
                        <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1">
                          <svg
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reporter Info Card */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 sm:mb-6">
                    <img
                      src={issue.user_avatar}
                      alt={issue.user_name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {issue.user_name}
                        </p>
                        {issue.user_verification_status === "verified" && (
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(issue.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Admin Actions on User */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <button
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="View User History"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
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
                      </button>
                      <button
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Block User"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
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
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-medium">
                          Location
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {issue.location_address || "No address provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg shrink-0">
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-medium">
                          Building
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {issue.location_building}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="w-6 sm:w-8 h-0.5 bg-violet-500 rounded-full" />
                      Description
                    </h2>
                    <div
                      className={`p-3 sm:p-4 rounded-xl border ${
                        issue.is_spam
                          ? "bg-orange-50/50 border-orange-100 text-gray-500"
                          : "bg-gray-50 border-gray-100 text-gray-700"
                      }`}
                    >
                      <p className="text-sm sm:text-base leading-relaxed">
                        {issue.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-start">
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        <span className="font-semibold text-sm sm:text-base">
                          {issue.upvotes}
                        </span>
                        <span className="text-xs sm:text-sm text-emerald-600 hidden sm:inline">
                          upvotes
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-rose-50 text-rose-700 rounded-lg">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                          />
                        </svg>
                        <span className="font-semibold text-sm sm:text-base">
                          {issue.downvotes}
                        </span>
                        <span className="text-xs sm:text-sm text-rose-600 hidden sm:inline">
                          downvotes
                        </span>
                      </div>
                    </div>

                    <button className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="font-medium text-sm sm:text-base">
                        {issue.comments_count}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        comments
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity Log - Admin Only */}
              <div className="mt-4 sm:mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Activity Log
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900">
                        Status changed to{" "}
                        <span className="font-semibold">Acknowledged</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                        By Admin • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full mt-1.5 sm:mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900">
                        Issue created by{" "}
                        <span className="font-semibold">{issue.user_name}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                        {new Date(issue.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default IssueDetails;
