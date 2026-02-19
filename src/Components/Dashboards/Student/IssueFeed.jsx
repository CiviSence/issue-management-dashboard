import StudentSideNav from "./StudentSideNav";
import BottomNav from "../../Templates/BottomNav";
import UserCard from "../../Templates/UserCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { createIssue, getIssuesFeed } from "../../../Utils/issues";
import Loader from "../../Templates/Loader";

const IssueFeed = () => {
  const [issues, setIssues] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const fetchIssues = async () => {
    try {
      const newIssues = await getIssuesFeed({
        skip,
        limit,
        sort: "created_at",
        order: "desc",
      });

      setIssues((prev) => [...prev, ...newIssues]);

      setSkip((prev) => prev + limit);

      if (newIssues.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  console.log("Issues:", issues);

  // Edit Mode State
  const [editMode, setEditMode] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [main_category, setMainCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [location_address, setLocationAddress] = useState("");
  const [location_building, setLocationBuilding] = useState("");
  const [location_ward, setLocationWard] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editIssueId, setEditIssueId] = useState(null);

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
        description: description.trim(),
        main_category: main_category,
        sub_category: sub_category || "general",
        location_address: location_address,
        location_building: location_building,
        location_ward: location_ward || "",
        media_urls: ["string"], // just for testing, replace with actual media handling logic
      };

      if (editMode) {
        toast.success("Issue updated successfully!");
      } else {
        await createIssue(issuePayload);

        toast.success("Issue reported successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <>
      <StudentSideNav />
      <BottomNav />
      <div className="w-full p-2 lg:p-4 lg:w-[calc(100vw-15vw)] bg-[#F0EEFF] overflow-y-auto h-screen">
        {/* header */}
        <div className="w-full bg-violet-500 p-4 sm:p-5  lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-md mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            {/* LEFT */}
            <div>
              <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Issue Feed
              </h1>

              <p className="text-violet-100 text-sm sm:text-base md:text-lg mt-1">
                Explore through your college issues.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6">
          <div
            id="leftscroll"
            className="lg:col-span-2 space-y-2 lg:space-y-4 h-[calc(100vh-150px)]
 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
"
          >
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
                onClick={() => {
                  resetForm();
                  setShowReportModal(true);
                }}
                className="w-full sm:w-auto bg-violet-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-violet-700 transition shadow-md sm:shadow-lg shadow-violet-200 text-sm sm:text-base"
              >
                + Report Issue
              </button>
            </div>
            <div className="bg-white p-3 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Social Feed
              </h3>
              <div>
                <InfiniteScroll
                  dataLength={issues.length}
                  next={fetchIssues}
                  hasMore={hasMore}
                  loader={<Loader />}
                  scrollableTarget="leftScroll"
                  endMessage={
                    <p style={{ textAlign: "center" }}>No more issues</p>
                  }
                >
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 hover:shadow-lg transition-all duration-300"
                    >
                      {/* HEADER - User Info & Meta */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={issue.user.avatar_url}
                            alt={issue.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-50"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {issue.user.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>
                                {new Date(issue.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                              <span>•</span>
                              <span className="capitalize">
                                {issue.location_address}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            issue.status === "new"
                              ? "bg-blue-50 text-blue-600"
                              : issue.status === "in_progress"
                                ? "bg-yellow-50 text-yellow-600"
                                : issue.status === "resolved"
                                  ? "bg-green-50 text-green-600"
                                  : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium uppercase tracking-wide">
                            {issue.main_category}
                          </span>
                          {issue.priority === "high" && (
                            <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-md font-medium">
                              High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                          {issue.title}
                        </h3>

                        <p className="text-gray-600 text-sm leading-relaxed">
                          {issue.description}
                        </p>
                      </div>

                      {/* MEDIA GRID */}
                      {issue.media_urls?.length > 0 &&
                        issue.media_urls[0] !== "string" && (
                          <div className="grid grid-cols-2 gap-2 mb-4 rounded-xl overflow-hidden">
                            {issue.media_urls.slice(0, 4).map((url, idx) => (
                              <div
                                key={idx}
                                className={`relative bg-gray-100 ${
                                  issue.media_urls.length === 1
                                    ? "col-span-2 h-64"
                                    : issue.media_urls.length === 2
                                      ? "h-48"
                                      : "h-32"
                                }`}
                              >
                                <img
                                  src={url}
                                  alt=""
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                                {idx === 3 && issue.media_urls.length > 4 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                                    +{issue.media_urls.length - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {/* ENGAGEMENT BAR */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          {/* Vote Group */}
                          <div className="flex items-center bg-gray-50 rounded-lg p-1">
                            <button
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                                issue.engagement.user_voted === "up"
                                  ? "bg-white text-green-600 shadow-sm"
                                  : "text-gray-500 hover:text-green-600 hover:bg-white"
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              <span className="text-sm font-semibold">
                                {issue.engagement.upvotes || 0}
                              </span>
                            </button>

                            <div className="w-px h-4 bg-gray-300 mx-1" />

                            <button
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                                issue.engagement.user_voted === "down"
                                  ? "bg-white text-red-600 shadow-sm"
                                  : "text-gray-500 hover:text-red-600 hover:bg-white"
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                              </svg>
                              <span className="text-sm font-semibold">
                                {issue.engagement.downvotes || 0}
                              </span>
                            </button>
                          </div>

                          {/* Comments */}
                          <button className="flex items-center gap-2 text-gray-500 hover:text-violet-600 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-violet-50 transition-colors">
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
                            </div>
                            <span className="text-sm font-medium">
                              {issue.engagement.comment_count || 0}
                            </span>
                          </button>

                          {/* Share */}
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
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
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                            </div>
                          </button>
                        </div>

                        {/* Net Score */}
                        <div className="flex items-center gap-1.5 text-sm">
                         
                          
                            
                          
                        </div>
                      </div>

                      {/* Recent Comments Preview */}
                      {issue.recent_comments?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          {issue.recent_comments
                            .slice(0, 2)
                            .map((comment, idx) => (
                              <div key={idx} className="flex gap-2 text-sm">
                                <span className="font-semibold text-gray-900">
                                  {comment.user_name}:
                                </span>
                                <span className="text-gray-600 line-clamp-1">
                                  {comment.text}
                                </span>
                              </div>
                            ))}
                          {issue.recent_comments.length > 2 && (
                            <button className="text-violet-600 text-sm font-medium hover:underline">
                              View all {issue.recent_comments.length} comments
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  value={location_address}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-violet-600 outline-none"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 resize-none focus:border-violet-600 outline-none"
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
                  className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-700 font-medium disabled:opacity-50"
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

export default IssueFeed;
