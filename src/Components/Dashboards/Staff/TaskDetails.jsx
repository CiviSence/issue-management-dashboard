import { useEffect, useState, useCallback } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import {
  acceptAssignment,
  rejectAssignment,
  completeAssignment,
} from "../../../Utils/staffissues";
import { getIssueById } from "../../../Utils/issues";
import Loader from "../../Templates/Loader";
import StatusBadge from "../../Templates/StatusBadge";
import { useParams, useLocation } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Calendar,
  Flag,
  AlertCircle,
  Camera,
  Upload,
  X,
  ChevronLeft,
  Clock,
  Building2,
  Tag,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

const TaskDetails = () => {
  const { profileData } = useUser();
  const { id } = useParams();
  const location = useLocation();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'accept', 'reject', 'complete'
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [resolutionPhotos, setResolutionPhotos] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch task details
  const fetchTaskDetails = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    
    try {
      console.log("Fetching issue with ID:", id, "Type:", typeof id);
      const data = await getIssueById(id);
      console.log("Successfully fetched issue data:", data);
      
      setTask((prev) => {
        const merged = { ...prev, ...data };
        console.log("Merged Task Data:", merged);
        return merged;
      });
    } catch (error) {
      console.error("Failed to fetch issue details. ID:", id, "Error:", error);
      // If we already have partial data from state, we can still show the page
      // but maybe show a small warning that full details couldn't be loaded
      if (!task && !location.state) {
        setTask(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // If we have state from navigation, use it as initial data
    // but don't stop loading yet because we need the full details
    if (location.state && !task) {
      setTask(location.state);
    }
    fetchTaskDetails();
  }, [fetchTaskDetails]); // Removed location.state from deps to avoid re-runs on state changes

  // Handle Accept Task
  const handleAccept = async () => {
    if (!task?.assignment_id) return;
    setActionLoading(true);
    try {
      await acceptAssignment(task.assignment_id, notes);
      setActiveModal(null);
      setNotes("");
      await fetchTaskDetails();
    } catch (error) {
      console.error("Error accepting assignment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject Task
  const handleReject = async () => {
    if (!task?.assignment_id) return;
    setActionLoading(true);
    try {
      await rejectAssignment(task.assignment_id, rejectionReason);
      setActiveModal(null);
      setRejectionReason("");
      await fetchTaskDetails();
    } catch (error) {
      console.error("Error rejecting assignment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Complete Task
  const handleComplete = async () => {
    if (!task?.assignment_id) return;
    setActionLoading(true);
    try {
      await completeAssignment(task.assignment_id, notes, resolutionPhotos);
      setActiveModal(null);
      setNotes("");
      setResolutionPhotos([]);
      await fetchTaskDetails();
    } catch (error) {
      console.error("Error completing assignment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setResolutionPhotos((prev) => [...prev, ...newPhotos]);
  };

  // Remove uploaded photo
  const removePhoto = (index) => {
    setResolutionPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Format date
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

  // Format date

  if (loading) {
    return (
      <>
        <StaffSideNav />
        <BottomNav />
        <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <StaffSideNav />
        <BottomNav />
        <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">
              Task Not Found
            </h2>
            <p className="text-gray-500 mt-2">
              The requested task could not be loaded.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StaffSideNav />
      <BottomNav />

      <div className="w-full p-4 lg:w-[calc(100vw-15vw)] bg-background text-foreground min-h-screen overflow-y-auto transition-colors duration-200">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-violet-500 to-purple-600 p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  Task Details
                </h1>
                <p className="text-violet-100 text-sm sm:text-base mt-1">
                  ID: #{task.id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <StatusBadge type="status" value={task.status} />
              <StatusBadge type="priority" value={task.priority} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content - Left Column */}
          <div className="xl:col-span-2 space-y-4 md:space-y-6">
            {/* Task Title & Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {task.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Media Gallery */}
            {task.media_urls && task.media_urls.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-violet-500" />
                  Issue Photos
                </h3>
                <div className="space-y-3">
                  {/* Main Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={task.media_urls[activeImageIndex]}
                      alt={`Issue photo ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnail Grid */}
                  {task.media_urls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {task.media_urls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            activeImageIndex === index
                              ? "border-violet-500 ring-2 ring-violet-200"
                              : "border-transparent hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Task Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Task Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Tag className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {task.main_category}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {task.sub_category}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {task.location_address}
                    </p>
                    {task.location_building && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {task.location_building}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(task.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(task.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Engagement
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Eye className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {task.views_count || 0}
                  </p>
                  <p className="text-sm text-gray-500">Views</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <ThumbsUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">
                    {task.upvotes || 0}
                  </p>
                  <p className="text-sm text-gray-500">Upvotes</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <ThumbsDown className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {task.downvotes || 0}
                  </p>
                  <p className="text-sm text-gray-500">Downvotes</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {task.comments_count || 0}
                  </p>
                  <p className="text-sm text-gray-500">Comments</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Reporter Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reported By
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={task.user_avatar || "/default-avatar.png"}
                    alt={task.user_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-violet-200"
                  />
                  {task.user_verification_status === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {task.user_name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {task.user_verification_status || "Unverified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {/* Show Accept/Reject for pending/new tasks */}
                {(task.status === "new" || task.status === "pending") && (
                  <>
                    <button
                      onClick={() => setActiveModal("accept")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Accept Task
                    </button>
                    <button
                      onClick={() => setActiveModal("reject")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Task
                    </button>
                  </>
                )}

                {/* Show Complete for in-progress tasks */}
                {(task.status === "in_progress" ||
                  task.status === "accepted") && (
                  <button
                    onClick={() => setActiveModal("complete")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </button>
                )}

                {/* Show resolved status */}
                {task.status === "resolved" && (
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="font-semibold text-green-700">
                      Task Completed
                    </p>
                    {task.resolved_at && (
                      <p className="text-sm text-green-600 mt-1">
                        {formatDate(task.resolved_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resolution Notes (if resolved) */}
            {task.resolution_notes && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resolution Notes
                </h3>
                <p className="text-gray-600">{task.resolution_notes}</p>
              </div>
            )}

            {/* Resolution Photos (if available) */}
            {task.resolution_media_urls &&
              task.resolution_media_urls.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resolution Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {task.resolution_media_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Resolution ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Accept Modal */}
      {activeModal === "accept" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Accept Task</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to accept this task? Add any notes below.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)..."
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Accept
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {activeModal === "reject" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Reject Task</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this task.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {activeModal === "complete" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Complete Task</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Add completion notes and upload resolution photos.
            </p>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what was done..."
                className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Photos
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {resolutionPhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Upload ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Task
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

export default TaskDetails;
