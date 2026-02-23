import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useIssues } from "../../../Context/IssueContext";
import { useState } from "react";
import { deleteIssue } from "../../../Utils/issues";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";

const IssueDetails = () => {
  const { id } = useParams();
  const { issues } = useIssues();
  const issue = issues.find((i) => i.id === Number(id));
  console.log(issue);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priority, setPriority] = useState("all");
  const { resolvedIssues, setResolvedIssues } = useIssues();

  const handleDeleteIssue = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;

    const previousIssues = resolvedIssues;
    setResolvedIssues((prev) => prev.filter((issue) => issue.id !== id));

    try {
      await deleteIssue(id);
      toast.success("Issue deleted successfully!");
    } catch (error) {
      setResolvedIssues(previousIssues);
      toast.error(error.message || "Failed to delete issue");
    }
  };

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
            <h1 className="text-l sm:text-xl  font-semibold text-white">
              details
            </h1>
            <Searchbar />
          </div>
        </div>
        <div className=" mx-auto p-4 sm:p-6 lg:p-8">
          {/* Admin Action Bar - Sticky Top */}
          <div className="sticky top-4 z-50 mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold flex items-center gap-1.5">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Admin View
                </span>
                <span className="text-sm text-gray-500">Issue #{issue.id}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick Actions */}
                <button
                  //   onClick={() => handleMarkSpam()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    issue.is_spam
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                  }`}
                >
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {issue.is_spam ? "Marked as Spam" : "Mark as Spam"}
                </button>

                <button
                  //   onClick={() => handleDelete()}
                  className="px-4 py-2 bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                >
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Manage
                </button>
              </div>
            </div>

            {/* Expandable Admin Panel */}
            {showAdminPanel && (
              <div className="mt-3 bg-white rounded-xl shadow-lg border border-gray-200 p-5 animate-in slide-in-from-top-2">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status Management */}
                  <div>
                    <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                      Update Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "new",
                        "acknowledged",
                        "in_progress",
                        "resolved",
                        "closed",
                      ].map((status) => (
                        <button
                          key={status}
                          //   onClick={() => handleStatusChange(status)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      Set Priority
                    </label>
                    <div className="flex gap-2">
                      {["low", "medium", "high", "critical"].map((priority) => (
                        <button
                          key={priority}
                          //   onClick={() => handlePriorityChange(priority)}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
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
                      ))}
                    </div>
                  </div>

                  {/* Assignment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Assign To
                    </label>
                    <select
                      //   onChange={(e) => handleAssign(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Unassigned</option>
                      <option value="team_a">Maintenance Team A</option>
                      <option value="team_b">Maintenance Team B</option>
                      <option value="security">Security Team</option>
                      <option value="admin">Admin Team</option>
                    </select>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                      Internal Notes
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add note..."
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resolution Section for Admin */}
                {issue.status === "resolved" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Resolution Details
                    </label>
                    <textarea
                      placeholder="Add resolution notes..."
                      defaultValue={issue.resolution_notes || ""}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    />
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Resolution
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Upload Resolution Photos
                      </button>
                    </div>
                  </div>
                )}
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
            {issue.is_spam && (
              <div className="bg-orange-100 border-b border-orange-200 px-6 py-3 flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-orange-600"
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
                <span className="text-sm font-medium text-orange-800">
                  This issue has been marked as spam
                </span>
                <button
                  //   onClick={() => handleMarkSpam(false)}
                  className="ml-auto text-sm text-orange-700 hover:text-orange-900 underline"
                >
                  Undo
                </button>
              </div>
            )}

            {/* Image Gallery */}
            {/* Image Gallery Section */}
            {issue.media_urls?.length > 0 && (
              <div className="bg-gray-900">
                {/* Main Image Display */}
                <div className="relative aspect-[16/9] overflow-hidden group">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
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
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
                      {(currentImageIndex || 0) + 1} / {issue.media_urls.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails Strip - Show when multiple images */}
                {issue.media_urls.length > 1 && (
                  <div className="flex gap-2 p-3 bg-gray-800 overflow-x-auto">
                    {issue.media_urls.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-200 ${
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

            <div className="p-6 sm:p-8">
              {/* Title & Meta */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1
                    className={`text-2xl sm:text-3xl font-bold leading-tight ${
                      issue.is_spam
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {issue.title}
                  </h1>

                  {/* Quick Stats */}
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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-violet-100 text-violet-700 border border-violet-200">
                    {issue.main_category}
                  </span>
                  <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                    {issue.sub_category}
                  </span>

                  {/* Status with Admin Edit Indicator */}
                  <button
                    onClick={() => setShowAdminPanel(true)}
                    className={`group px-3 py-1.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all hover:shadow-md ${
                      issue.status === "new"
                        ? "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
                        : issue.status === "acknowledged"
                          ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                          : issue.status === "in_progress"
                            ? "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200"
                            : issue.status === "resolved"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        issue.status === "new"
                          ? "bg-amber-500"
                          : issue.status === "acknowledged"
                            ? "bg-blue-500"
                            : issue.status === "in_progress"
                              ? "bg-orange-500"
                              : issue.status === "resolved"
                                ? "bg-emerald-500"
                                : "bg-gray-500"
                      }`}
                    />
                    {issue.status.replace("_", " ")}
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>

                  {/* Priority Badge */}
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                      issue.priority === "critical"
                        ? "bg-red-100 text-red-700 border-red-200"
                        : issue.priority === "high"
                          ? "bg-orange-100 text-orange-700 border-orange-200"
                          : issue.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    {issue.priority.charAt(0).toUpperCase() +
                      issue.priority.slice(1)}{" "}
                    Priority
                  </span>

                  {issue.is_verified && (
                    <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Reporter Info Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                <img
                  src={issue.user_avatar}
                  alt={issue.user_name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {issue.user_name}
                    </p>
                    {issue.user_verification_status === "verified" && (
                      <svg
                        className="w-4 h-4 text-sky-500"
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
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View User History"
                  >
                    <svg
                      className="w-5 h-5"
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
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Block User"
                  >
                    <svg
                      className="w-5 h-5"
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
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {issue.location_address || "No address provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-indigo-600"
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
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Building
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {issue.location_building}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-violet-500 rounded-full" />
                  Description
                </h2>
                <div
                  className={`p-4 rounded-xl border ${
                    issue.is_spam
                      ? "bg-orange-50/50 border-orange-100 text-gray-500"
                      : "bg-gray-50 border-gray-100 text-gray-700"
                  }`}
                >
                  <p className="leading-relaxed">
                    {issue.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <svg
                      className="w-5 h-5"
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
                    <span className="font-semibold">{issue.upvotes}</span>
                    <span className="text-sm text-emerald-600">upvotes</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg">
                    <svg
                      className="w-5 h-5"
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
                    <span className="font-semibold">{issue.downvotes}</span>
                    <span className="text-sm text-rose-600">downvotes</span>
                  </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <svg
                    className="w-5 h-5"
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
                  <span className="font-medium">{issue.comments_count}</span>
                  <span className="text-sm text-gray-500">comments</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity Log - Admin Only */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
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
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Status changed to{" "}
                    <span className="font-semibold">Acknowledged</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By Admin • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Issue created by{" "}
                    <span className="font-semibold">{issue.user_name}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(issue.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueDetails;
