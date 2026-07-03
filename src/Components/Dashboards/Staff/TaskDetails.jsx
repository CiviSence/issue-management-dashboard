import { useEffect, useState, useCallback } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import TopBar from "../../Templates/TopBar";
import defaultPfpFemale from "../../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../../assets/default-pfp/default-pfp-male.svg";

const getDefaultAvatar = (gender) => {
  const g = gender?.toLowerCase();
  return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};
import {
  acceptAssignment,
  rejectAssignment,
  completeAssignment,
  getAssignedIssues,
  unassignIssue,
} from "../../../Utils/staffissues";
import { getIssueById } from "../../../Utils/issues";
import { uploadMultipleMedia } from "../../../Utils/issuesStudent";
import Loader from "../../Templates/Loader";
import StatusBadge from "../../Templates/StatusBadge";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  UserCheck,
  Loader2,
} from "lucide-react";

const TaskDetails = () => {
  const { profileData } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'accept', 'reject', 'complete'
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [resolutionPhotos, setResolutionPhotos] = useState([]);
  const [resolutionFiles, setResolutionFiles] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch task details
  const fetchTaskDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    try {
      console.log("Fetching issue with ID:", id, "Type:", typeof id);
      const data = await getIssueById(id);
      console.log("Successfully fetched issue data:", data);

      let assignmentInfo = {};
      try {
        const assignments = await getAssignedIssues();
        const matchingAssignment = assignments.find(
          (a) => String(a.issue_id) === String(id) || String(a.id) === String(id),
        );
        if (matchingAssignment) {
          assignmentInfo = {
            assignment_id: matchingAssignment.assignment_id,
            assignment_status: matchingAssignment.assignment_status,
            assigned_at: matchingAssignment.assigned_at,
          };
          console.log("Found matching assignment info:", assignmentInfo);
        }
      } catch (err) {
        console.error("Failed to fetch matching assignment:", err);
      }

      setTask((prev) => {
        const merged = { ...prev, ...data, ...assignmentInfo };
        console.log("Merged Task Data:", merged);
        return merged;
      });
    } catch (error) {
      console.error("Failed to fetch issue details. ID:", id, "Error:", error);
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
      let uploadedUrls = [];
      if (resolutionFiles.length > 0) {
        uploadedUrls = await uploadMultipleMedia(resolutionFiles);
      }
      
      await completeAssignment(task.assignment_id, notes, uploadedUrls);
      setActiveModal(null);
      setNotes("");
      setResolutionPhotos([]);
      setResolutionFiles([]);
      await fetchTaskDetails();
    } catch (error) {
      console.error("Error completing assignment:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Unassign Task
  const handleUnassign = async () => {
    if (!task?.assignment_id) return;
    setActionLoading(true);
    try {
      await unassignIssue(task.assignment_id);
      setActiveModal(null);
      // Navigate back to the previous page since the task is no longer assigned to us
      navigate(-1);
    } catch (error) {
      console.error("Error unassigning task:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setResolutionPhotos((prev) => [...prev, ...newPhotos]);
    setResolutionFiles((prev) => [...prev, ...files]);
  };

  // Remove uploaded photo
  const removePhoto = (index) => {
    setResolutionPhotos((prev) => prev.filter((_, i) => i !== index));
    setResolutionFiles((prev) => prev.filter((_, i) => i !== index));
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
        <div className="flex-1 h-screen overflow-y-auto pt-0 md:pt-6 pb-24 md:pb-6 px-3 md:px-6 bg-background text-foreground flex items-center justify-center">
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
        <div className="flex-1 h-screen overflow-y-auto pt-0 md:pt-6 pb-24 md:pb-6 px-3 md:px-6 bg-background text-foreground flex items-center justify-center">
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

      <div className="flex-1 h-screen overflow-x-hidden overflow-y-auto pt-0 pb-24 md:pb-6 bg-background text-foreground transition-colors duration-200 w-full lg:w-[calc(100vw-15vw)]">
        <TopBar title="Task Details" />
        <div className="w-full mx-auto p-2 lg:p-4 mt-2">
          <div className="flex items-center gap-3 mb-4 px-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex gap-2 ml-auto">
              <StatusBadge type="status" value={task.status} />
              <StatusBadge type="priority" value={task.priority} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
            {/* Main Content - Left Column */}
            <div className="xl:col-span-2 space-y-4 md:space-y-6">
              {/* Task Title & Description */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-card-foreground mb-3">
                  {task.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Media Gallery */}
              {task.media_urls && Array.isArray(task.media_urls) && task.media_urls.length > 0 && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#6366f1]" />
                    Issue Photos
                  </h3>
                  <div className="space-y-3">
                    {/* Main Image */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/40">
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
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === index
                                ? "border-[#6366f1] ring-2 ring-[#6366f1]/20"
                                : "border-transparent hover:border-border"
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
              <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Task Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50/50 text-[#6366f1] rounded-lg">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium text-card-foreground capitalize">
                        {task.main_category}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {task.sub_category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50/50 text-blue-600 rounded-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-card-foreground">
                        {task.location_address}
                      </p>
                      {task.location_building && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {task.location_building}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50/50 text-emerald-600 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium text-card-foreground">
                        {formatDate(task.created_at)}
                      </p>
                    </div>
                  </div>

                  {task.assigned_at && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-50/50 text-indigo-600 rounded-lg">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned At</p>
                        <p className="font-medium text-card-foreground">
                          {formatDate(task.assigned_at)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50/50 text-amber-600 rounded-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-card-foreground">
                        {formatDate(task.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Engagement
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/40 rounded-xl">
                    <Eye className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-2xl font-bold text-card-foreground">
                      {task.views_count || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50/30 border border-emerald-100/50 text-emerald-600 rounded-xl">
                    <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {task.upvotes || 0}
                    </p>
                    <p className="text-sm opacity-85">Upvotes</p>
                  </div>
                  <div className="text-center p-4 bg-red-50/30 border border-red-100/50 text-red-600 rounded-xl">
                    <ThumbsDown className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {task.downvotes || 0}
                    </p>
                    <p className="text-sm opacity-85">Downvotes</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50/30 border border-blue-100/50 text-blue-600 rounded-xl">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-2xl font-bold">
                      {task.comments_count || 0}
                    </p>
                    <p className="text-sm opacity-85">Comments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Reporter Info */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Reported By
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={task.user_avatar || getDefaultAvatar(task.user_gender)}
                      alt={task.user_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#7E70EB]/20"
                    />
                    {task.user_verification_status === "verified" && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      {task.user_name}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {task.user_verification_status || "Unverified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-3.5 sm:p-5 md:p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {/* Show Accept/Reject for pending tasks */}
                  {task.assignment_status === "pending" &&
                    task.status !== "resolved" && (
                      <>
                        <button
                          onClick={() => setActiveModal("accept")}
                          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm sm:text-base font-medium transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Accept Task
                        </button>
                        <button
                          onClick={() => setActiveModal("reject")}
                          className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-sm sm:text-base font-medium transition-colors cursor-pointer bg-transparent"
                        >
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Reject Task
                        </button>
                      </>
                    )}

                  {/* Show Complete for accepted tasks */}
                  {task.assignment_status === "accepted" && (
                    <>
                      <button
                        onClick={() => setActiveModal("complete")}
                        className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-xl text-sm sm:text-base font-medium transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Mark as Complete
                      </button>
                      <button
                        onClick={() => setActiveModal("unassign")}
                        className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-sm sm:text-base font-medium transition-colors cursor-pointer bg-transparent"
                      >
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Unassign Task (Revert)
                      </button>
                    </>
                  )}

                  {/* Show resolved status */}
                  {task.assignment_status === "completed" && (
                    <div className="text-center p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                      <p className="font-semibold">
                        Task Completed
                      </p>
                      {task.resolved_at && (
                        <p className="text-sm mt-1">
                          {formatDate(task.resolved_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Notes (if resolved) */}
              {task.resolution_notes && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Resolution Notes
                  </h3>
                  <p className="text-muted-foreground">{task.resolution_notes}</p>
                </div>
              )}

              {/* Resolution Photos (if available) */}
              {task.resolution_media_urls && Array.isArray(task.resolution_media_urls) &&
                task.resolution_media_urls.length > 0 && (
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                      Resolution Photos
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {task.resolution_media_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Resolution ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
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
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150 text-card-foreground">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-card-foreground">Accept Task</h3>
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
                className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] outline-none transition-all"
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
                  onClick={handleAccept}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? (
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

        {/* Reject Modal */}
        {activeModal === "reject" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 border border-border animate-in fade-in zoom-in-95 duration-150 text-card-foreground">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-card-foreground">Reject Task</h3>
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
                  onClick={handleReject}
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? (
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

        {/* Complete Modal */}
        {activeModal === "complete" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl max-w-lg w-full p-6 border border-border max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-card-foreground">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-card-foreground">Complete Task</h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Add completion notes and upload resolution photos.
              </p>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Completion Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what was done..."
                  className="w-full p-3 border border-border rounded-xl bg-card text-card-foreground text-sm resize-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] outline-none transition-all"
                  rows={3}
                />
              </div>

              {/* Photo Upload */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Resolution Photos
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {resolutionPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-[#6366f1] hover:bg-muted transition-colors text-muted-foreground">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] mt-1">Add</span>
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
                  className="flex-1 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-[#6366f1] hover:bg-[#5445c9] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Complete Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unassign Modal */}
      {activeModal === "unassign" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-2">Unassign Task</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to unassign yourself from this task? It will be returned to the issue pool.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-muted-foreground font-medium rounded-xl transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUnassign}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Unassign
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default TaskDetails;
