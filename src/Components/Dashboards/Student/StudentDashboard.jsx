import { useState, useEffect } from "react";
import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { useUser } from "../../../Context/ProfileContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {

  createIssue,
  getMyIssues,
  updateIssue,
  deleteIssue,
} from "../../../Utils/issues";
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [myIssues, setMyIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  // Edit Mode State
  const [editMode, setEditMode] = useState(false);
  const [editIssueId, setEditIssueId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null); // Track which issue is being deleted

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [main_category, setMainCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [location_address, setLocationAddress] = useState("");
  const [location_building, setLocationBuilding] = useState("");
  const [location_ward, setLocationWard] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(myIssues);

  // Status styles
  const getStatusStyle = (status) =>
    ({
      open: "bg-amber-50 text-amber-700 border border-amber-200",
      in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
      resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      closed: "bg-gray-100 text-gray-600 border border-gray-200",
    })[status] || "bg-gray-100 text-gray-600";

  // Priority styles
  const getPriorityStyle = (priority) =>
    ({
      low: "bg-gray-50 text-gray-600 border border-gray-200",
      medium: "bg-orange-50 text-orange-700 border border-orange-200",
      high: "bg-rose-50 text-rose-700 border border-rose-200",
      critical: "bg-red-50 text-red-700 border border-red-200 animate-pulse",
    })[priority] || "bg-gray-50 text-gray-600";

  useEffect(() => {
    if (profileData?.id) {
      fetchMyIssues();
    }
  }, [profileData]);

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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMainCategory("");
    setSubCategory("");
    setLocationAddress("");
    setLocationBuilding("");
    setLocationWard("");
    setEditMode(false);
    setEditIssueId(null);
  };

  const handleCloseModal = () => {
    setShowReportModal(false);
    resetForm();
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!title.trim()) {
      toast.warning("Please enter an issue title");
      return;
    }
    if (!description.trim() || description.length < 10) {
      // Adjust min length as needed
      toast.warning("Description must be at least 10 characters");
      return;
    }
    if (!location_building) {
      toast.warning("Please select a building");
      return;
    }

    try {
      setIsSubmitting(true);

      const issuePayload = {
        title: title.trim(),
        description: description.trim(), // Make sure it's not empty
        main_category: main_category,
        sub_category: sub_category || "general",
        location_address: location_address || "spnrec campus",
        location_building: location_building,
        location_ward: location_ward || "",
        media_urls: ["string"], // just for testing, replace with actual media handling logic
      };

      console.log("Payload:", issuePayload); // Debug

      if (editMode) {
        setIsEditing(true);
        const updated = await updateIssue(editIssueId, issuePayload);
        setMyIssues((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i)),
        );
        toast.success("Issue updated successfully!");
      } else {
        await createIssue(issuePayload);
        await fetchMyIssues();
        toast.success("Issue reported successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
    }
  };

  const handleEditIssue = (issue) => {
    setEditMode(true);
    setEditIssueId(issue.id);
    setTitle(issue.title);
    setDescription(issue.description);
    setMainCategory(issue.main_category);
    setSubCategory(issue.sub_category);
    setLocationAddress(issue.location_address);
    setLocationBuilding(issue.location_building);
    setLocationWard(issue.location_ward);
    setShowReportModal(true);
  };

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

      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        <div className="w-full bg-violet-600 p-6 rounded-3xl text-white shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-violet-100">
            Welcome back! Track your reported issues here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-3">
            {/* Quick Action */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Have a problem?
                </h2>
                <p className="text-gray-500">Report a new issue on campus.</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowReportModal(true);
                }}
                className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition shadow-lg shadow-violet-200"
              >
                + Report Issue
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
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
                      className={`group relative overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:shadow-md ${
                        issue.status === "resolved"
                          ? "border-emerald-200 bg-emerald-50/30"
                          : issue.status === "in_progress"
                            ? "border-blue-200 bg-blue-50/30"
                            : "border-gray-200 hover:border-blue-300"
                      } ${isDeleting === issue.id ? "opacity-50" : ""}`}
                    >
                      {/* Status Indicator Strip */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                          issue.status === "resolved"
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
                            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(issue.status)}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                issue.status === "resolved"
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
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
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
                              {issue.location_address}
                            </span>
                            {issue.location_building && (
                              <span className="text-gray-400">
                                • {issue.location_building}
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
                            className={`ml-auto px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${getPriorityStyle(issue.priority)}`}
                          >
                            {issue.priority}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEditIssue(issue)}
                            disabled={isEditing || isDeleting === issue.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors disabled:opacity-50"
                          >
                            {isEditing && editIssueId === issue.id ? (
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
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            )}
                            {isEditing && editIssueId === issue.id
                              ? "Saving..."
                              : "Edit"}
                          </button>

                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            disabled={isDeleting === issue.id || isEditing}
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

          <div className="space-y-2">
            <p className="text-2xl font-semibold">Top Reporters</p>
            <UserCard />

            <div className="bg-violet-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
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
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editMode ? "Edit Issue" : "Report New Issue"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  placeholder="e.g. Broken projector in Room 301"
                  required
                />
              </div>

              {/* Main Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category
                </label>
                <select
                  value={main_category}
                  onChange={(e) => setMainCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="security">Security</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="facilities">Facilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category
                </label>
                <input
                  value={sub_category}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  placeholder="e.g. Leakage, Fan not working"
                  required
                />
              </div>

              {/* Location Building */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Building
                </label>
                <select
                  value={location_building}
                  onChange={(e) => setLocationBuilding(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  required
                >
                  <option value="">Select Building</option>
                  <option value="boys-hostel">Boys Hostel</option>
                  <option value="girls-hostel">Girls Hostel</option>
                  <option value="admin-building">Admin Building</option>
                  <option value="faculty-building">Faculty Building</option>
                  <option value="campus">Campus</option>
                  <option value="other">other</option>
                </select>
              </div>

              {/* Location Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  value={location_building}
                  onChange={(e) => setLocationBuilding(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  placeholder="e.g. Block A"
                  required
                />
              </div>

              {/* Location Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward / Floor
                </label>
                <input
                  value={location_ward}
                  onChange={(e) => setLocationWard(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-500 outline-none"
                  placeholder="e.g. 3rd Floor"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description{" "}
                  <span className="text-gray-400 text-xs">(min 10 chars)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 resize-none focus:border-violet-500 outline-none"
                  placeholder="Describe the issue in detail..."
                  required
                  minLength={10}
                />
                <p
                  className={`text-xs mt-1 ${description.length < 10 ? "text-red-500" : "text-green-500"}`}
                >
                  {description.length} characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium disabled:opacity-50"
                >
                  {isSubmitting
                    ? editMode
                      ? "Updating..."
                      : "Submitting..."
                    : editMode
                      ? "Update Issue"
                      : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;
