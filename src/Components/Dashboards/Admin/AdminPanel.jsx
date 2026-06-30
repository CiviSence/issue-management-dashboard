import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import TopBar from "../../Templates/TopBar";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../../Utils/axios";
import noProfile from "../../../assets/default-avatar.jpg";
import {
  adminGetAllRequests,
  adminGetUnverifiedUsers,
  adminGetUserDetailed,
  adminReviewDocument,
  adminManualVerify,
  adminRevokeVerification,
  adminBanUser,
  adminUnbanUser,
} from "../../../Utils/verification";
import {
  Users,
  Shield,
  Ban,
  Search,
  Filter,
  LayoutGrid,
  List,
  Table2,
  CheckSquare,
  Eye,
  CheckCircle,
  Award,
  Building,
  Briefcase,
  Calendar,
  Download,
  UserCheck,
  UserX,
  Bell,
  XCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Send,
  TrendingUp,
  Activity,
  MoreVertical,
  RefreshCw,
  Trash2,
  Edit3,
  Clock,
  TrendingDown,
  Star,
  X,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  CheckCircle2,
  BarChart3,
  ThumbsUp,
  Vote,
  MessageCircle,
  User,
  Home,
  History,
  Settings,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";

const NotificationsTab = ({
  notificationType,
  setNotificationType,
  notificationForm,
  setNotificationForm,
  handleSendNotification,
  loading,
  notificationStats,
  sentNotifications,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Send Notification Panel */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <Send className="w-5 h-5 mr-2 text-violet-500" />
            Send Notification
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { id: "custom", label: "Custom", icon: Edit3 },
              { id: "broadcast", label: "Broadcast", icon: Mail },
              { id: "role", label: "To Role", icon: Users },
              { id: "user", label: "To User", icon: UserCheck },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setNotificationType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                  notificationType === type.id
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 hover:border-violet-200"
                }`}
              >
                <type.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    title: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                placeholder="Enter notification title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={notificationForm.message}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    message: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all h-32 resize-none"
                placeholder="Enter your message..."
                required
              />
            </div>

            {notificationType === "role" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <select
                  value={notificationForm.role}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      role: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                >
                  <option value="student">Students</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admins</option>
                  <option value="developer">Developers</option>
                </select>
              </div>
            )}

            {notificationType === "user" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={notificationForm.userId}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      userId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none"
                  placeholder="Enter user ID..."
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-4">
                {["low", "normal", "high", "urgent"].map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={notificationForm.priority === priority}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          priority: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                    />
                    <span
                      className={`text-sm capitalize ${
                        priority === "urgent"
                          ? "text-red-600 font-medium"
                          : priority === "high"
                            ? "text-orange-600"
                            : "text-gray-600"
                      }`}
                    >
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6366f1] text-white rounded-xl font-semibold hover:bg-[#5445c9] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notification Stats
          </h3>
          {notificationStats ? (
            <div className="space-y-4">
              <div className="p-4 bg-violet-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Total Sent</p>
                <p className="text-2xl font-bold text-violet-700">
                  {notificationStats.total_sent || 0}
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-amber-700">
                  {notificationStats.total_pending || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Delivery Rate</p>
                <p className="text-2xl font-bold text-green-700">
                  {notificationStats.delivery_rate || 0}%
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Read Rate</p>
                <p className="text-2xl font-bold text-blue-700">
                  {notificationStats.read_rate || 0}%
                </p>
              </div>
            </div>
          ) : (
            <Skeleton count={3} height={80} className="rounded-xl" />
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Sent
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sentNotifications?.map((notif, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl text-sm">
                <p className="font-medium text-gray-800 truncate">
                  {notif.title}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Sent to : {notif.recipient_type} • on{" "}
                  {notif.created_at.split("T")[0]}
                </p>
              </div>
            ))}
            {sentNotifications.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">
                No notifications sent yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton components for loading states
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton height={28} width={220} />
        <Skeleton height={16} width={180} className="mt-2" />
      </div>
      <Skeleton height={36} width={100} borderRadius={8} />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
          <Skeleton height={12} width={80} />
          <Skeleton height={32} width={60} className="mt-2" />
          <Skeleton height={12} width={50} className="mt-1" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <Skeleton height={20} width={180} />
        </div>
        <div className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton circle height={48} width={48} />
                <div>
                  <Skeleton height={14} width={120} />
                  <Skeleton height={12} width={100} className="mt-1" />
                </div>
              </div>
              <Skeleton height={32} width={70} borderRadius={8} />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <Skeleton height={20} width={160} />
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <Skeleton height={12} width={60} />
                <Skeleton height={24} width={40} className="mt-1" />
              </div>
            ))}
          </div>
          <Skeleton height={8} borderRadius={4} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
          <Skeleton circle height={36} width={36} />
          <Skeleton height={14} width={100} />
        </div>
      ))}
    </div>
  </div>
);

const UsersTableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <Skeleton height={28} width={150} />
        <Skeleton height={16} width={100} className="mt-1" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton height={32} width={120} borderRadius={20} />
        <Skeleton height={32} width={110} borderRadius={20} />
        <Skeleton height={36} width={180} borderRadius={8} />
        <Skeleton height={36} width={80} borderRadius={8} />
      </div>
    </div>
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["#", "User", "Status", "Role", "Department", "Reputation", "Joined", "Actions"].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton height={12} width={i === 1 ? 50 : 70} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(8)].map((_, i) => (
              <tr key={i}>
                <td className="px-4 py-3"><Skeleton height={16} width={16} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton circle height={36} width={36} />
                    <div>
                      <Skeleton height={14} width={120} />
                      <Skeleton height={12} width={160} className="mt-1" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><Skeleton height={24} width={80} borderRadius={12} /></td>
                <td className="px-4 py-3"><Skeleton height={24} width={60} borderRadius={12} /></td>
                <td className="px-4 py-3"><Skeleton height={14} width={90} /></td>
                <td className="px-4 py-3"><Skeleton height={14} width={40} /></td>
                <td className="px-4 py-3"><Skeleton height={14} width={80} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <Skeleton circle height={28} width={28} />
                    <Skeleton circle height={28} width={28} />
                    <Skeleton circle height={28} width={28} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const UnverifiedSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <Skeleton height={36} width={280} borderRadius={12} />
    </div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton height={24} width={180} />
        <Skeleton height={14} width={220} className="mt-1" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton height={36} width={200} borderRadius={8} />
        <Skeleton height={36} width={70} borderRadius={8} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Skeleton circle height={48} width={48} />
              <div>
                <Skeleton height={16} width={100} />
                <Skeleton height={12} width={140} className="mt-1" />
              </div>
            </div>
            <Skeleton height={16} width={16} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Skeleton height={14} width={80} />
            <Skeleton height={14} width={60} />
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton height={36} borderRadius={8} className="flex-1" />
            <Skeleton height={36} width={40} borderRadius={8} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BannedSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <Skeleton height={24} width={200} />
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton circle height={48} width={48} />
              <div>
                <Skeleton height={16} width={140} />
                <Skeleton height={14} width={180} className="mt-1" />
                <div className="flex items-center space-x-2 mt-1">
                  <Skeleton height={20} width={120} borderRadius={10} />
                  <Skeleton height={14} width={150} />
                </div>
              </div>
            </div>
            <Skeleton height={40} width={100} borderRadius={12} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  const navigate = useNavigate();
  // States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);

  const [sentNotifications, setSentNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState(null);
  const [notificationType, setNotificationType] = useState("custom");
  const [loading, setLoading] = useState(false);

  // Loading states for skeleton loaders
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingUnverified, setLoadingUnverified] = useState(true);
  const [loadingBanned, setLoadingBanned] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [userDetails, setUserDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [verificationRequests, setVerificationRequests] = useState([]);
  
  // Reports states
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [actioningReportId, setActioningReportId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewAction, setReviewAction] = useState("delete_content");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reportsSearchQuery, setReportsSearchQuery] = useState("");
  const [reportsStatusFilter, setReportsStatusFilter] = useState("all");

  const [banReason, setBanReason] = useState("");
  const [deleteContent, setDeleteContent] = useState(false);
  const [notifyUser, setNotifyUser] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    bannedUsers: 0,
    trustedUsers: 0,
    pendingReports: 0,
  });

  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    role: "student",
    userId: "",
    priority: "normal",
  });

  // Fetch initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchUnverifiedUsers();
    fetchVerificationRequests();
    fetchBannedUsers();
    fetchSentNotifications();
    fetchNotificationStats();
  }, []);

  // Fetch reports when tab or status filter changes
  useEffect(() => {
    fetchReports(reportsStatusFilter);
  }, [reportsStatusFilter, activeTab]);

  // API Functions
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("/admin/all-users");
      console.log("all users : ", response);
      const data = response.data;
      const usersList = data.users || [];
      console.log("all users data", usersList);
      setUsers(usersList);
      setStats((prev) => ({
        ...prev,
        totalUsers: usersList.length,
        verifiedUsers: usersList.filter(
          (u) => u.verification_status === "verified",
        ).length,
        trustedUsers: usersList.filter((u) => u.isTrusted).length,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const data = await adminGetUnverifiedUsers();
      console.log("unverified users : ", data);
      setUnverifiedUsers(data);
      setStats((prev) => ({ ...prev, unverifiedUsers: data.length }));
    } catch (error) {
      console.error("Error fetching unverified users:", error);
    } finally {
      setLoadingUnverified(false);
    }
  };

  const fetchVerificationRequests = async () => {
    try {
      const data = await adminGetAllRequests();
      console.log("verification requests : ", data);
      const requests = Array.isArray(data) ? data : data?.requests || data?.data || [];
      console.log("Request statuses:", [...new Set(requests.map(r => r.status))]);
      setVerificationRequests(requests);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchBannedUsers = async () => {
    try {
      const response = await axios.get("/admin/banned-users");
      const data = response.data.banned_users || [];
      console.log("Banned Users : ", data);
      setBannedUsers(data);
      setStats((prev) => ({ ...prev, bannedUsers: data.length }));
    } catch (error) {
      console.error("Error fetching banned users:", error);
    } finally {
      setLoadingBanned(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const data = await adminGetUserDetailed(userId);
      console.log("user details", data);
      setUserDetails(data);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  //Notifications and notification Stats
  const fetchSentNotifications = async () => {
    try {
      const response = await axios.get("/notifications/admin/sent");
      console.log("Sent Notification", response);
      setSentNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    }
  };
  //stats
  const fetchNotificationStats = async () => {
    try {
      const response = await axios.get("/notifications/admin/stats");
      console.log("notification stats : ", response);
      setNotificationStats(response.data);
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      toast.error(
        error.response?.data?.detail || "Failed to fetch notification stats",
      );
    }
  };

  const fetchReports = async (status = "all") => {
    setLoadingReports(true);
    try {
      const response = await axios.get(`/reports/admin/all?status=${status}`);
      const reportsList = response.data.reports || [];
      setReports(reportsList);
      
      // Update stats badge count
      if (status === "pending") {
        setStats((prev) => ({
          ...prev,
          pendingReports: response.data.total || reportsList.length,
        }));
      } else if (status === "all") {
        setStats((prev) => ({
          ...prev,
          pendingReports: reportsList.filter((r) => r.status !== "reviewed" && r.status !== "dismissed").length,
        }));
      } else {
        const pendingResponse = await axios.get("/reports/admin/all?status=pending");
        const pendingCount = pendingResponse.data.total || (pendingResponse.data.reports || []).length;
        setStats((prev) => ({
          ...prev,
          pendingReports: pendingCount,
        }));
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleReviewReport = (report) => {
    setSelectedReport(report);
    setReviewAction("delete_content");
    setReviewNotes("");
    setShowReviewModal(true);
  };

  const confirmReviewReport = async () => {
    if (!selectedReport) return;
    setActioningReportId(selectedReport.id);
    try {
      await axios.patch(`/reports/admin/${selectedReport.id}/review`, {
        action: reviewAction,
        admin_notes: reviewNotes,
      });
      toast.success("Report reviewed successfully");
      setShowReviewModal(false);
      fetchReports(reportsStatusFilter);
    } catch (error) {
      console.error("Error reviewing report:", error);
      toast.error(error.response?.data?.message || error.response?.data?.detail || "Failed to submit review");
    } finally {
      setActioningReportId(null);
    }
  };

  const handleDismissReport = async (reportId) => {
    setActioningReportId(reportId);
    try {
      await axios.delete(`/reports/admin/${reportId}/dismiss`);
      toast.success("Report dismissed successfully");
      fetchReports(reportsStatusFilter);
    } catch (error) {
      console.error("Error dismissing report:", error);
      toast.error(error.response?.data?.message || error.response?.data?.detail || "Failed to dismiss report");
    } finally {
      setActioningReportId(null);
    }
  };

  // Action Handlers

  //verify user(by admin)
  const handleVerifyUser = async (userId) => {
    try {
      await adminManualVerify(userId);
      toast.success("User verified successfully");
      fetchUnverifiedUsers();
      fetchDashboardStats();
    } catch (error) {
      toast.error(error.message || "Failed to verify user");
    }
  };

  //Revoke Verification
  const handleRevokeVerification = async (userId) => {
    try {
      await adminRevokeVerification(userId);
      toast.success("Verification revoked");
      fetchDashboardStats();
      if (userDetails) fetchUserDetails(userId);
    } catch (error) {
      console.error("Error revoking verification:", error);
      toast.error(error.message || "Failed to revoke verification");
    }
  };

  //promote to trusted
  const handlePromoteToTrusted = async (userId) => {
    try {
      const response = await axios.post(`/admin/promote-to-trusted/${userId}`);
      console.log("Promote to trusted : ", response);
      if (response.status === 200) {
        toast.success("User promoted to trusted");
        fetchDashboardStats();
        if (userDetails) fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    }
  };

  //add reputation points
  const handleAddReputation = async (userId, points) => {
    const reason = window.prompt(
      `Enter reason for ${points >= 0 ? "adding" : "removing"} ${Math.abs(points)} points:`,
    );
    if (!reason) return;
    try {
      const response = await axios.post(`/admin/add-reputation/${userId}`, {
        points,
        reason,
      });
      if (response.status === 200) {
        toast.success(
          response.data.message || `Reputation updated successfully`,
        );
        if (userDetails) fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error updating reputation:", error);
      toast.error(
        error.response?.data?.detail || "Failed to update reputation",
      );
    }
  };

  const openBanModal = (userId) => {
    setSelectedUserId(userId);
    setBanReason("");
    setDeleteContent(false);
    setNotifyUser(true);
    setShowBanModal(true);
  };

  const confirmBanUser = async () => {
    if (!banReason || banReason.length < 10) {
      toast.error("Reason must be at least 10 characters long.");
      return;
    }
    try {
      await adminBanUser(selectedUserId, {
        reason: banReason,
        delete_content: deleteContent,
        notify_user: notifyUser,
      });

      toast.success("User banned successfully!");
      setShowBanModal(false);
      fetchDashboardStats();
      fetchBannedUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error(error.message || "Failed to ban user.");
    }
  };

  //Unban User
  const handleUnbanUser = async (userId) => {
    try {
      await adminUnbanUser(userId);
      toast.success("User unbanned successfully");
      fetchBannedUsers();
      fetchDashboardStats();
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error(error.message || "Failed to unban user");
    }
  };

  //BanUser function for direct calls
  const handleBanUser = async (userId, reason) => {
    try {
      await adminBanUser(userId, {
        reason: reason || "Violation of terms",
        delete_content: false,
        notify_user: true,
      });
      toast.success("User banned successfully");
      fetchDashboardStats();
      fetchBannedUsers();
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error(error.message || "Failed to ban user");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);

    let endpoint;
    let payload;

    // Build payload according to API specs
    switch (notificationType) {
      case "custom":
        endpoint = "/notifications/custom";
        payload = {
          title: notificationForm.title,
          message: notificationForm.message,
          recipient_type: "all",
          recipient_filter: {},
          channels: ["in_app"],
          priority: notificationForm.priority,
          scheduled_for: new Date().toISOString(),
        };
        break;

      case "broadcast":
        endpoint = "/notifications/broadcast";
        payload = {
          title: notificationForm.title,
          message: notificationForm.message,
          channels: ["in_app", "email"],
        };
        break;

      case "role":
        endpoint = "/notifications/send-to-role";
        payload = {
          title: notificationForm.title,
          message: notificationForm.message,
          role: notificationForm.role === 'student' ? 'citizen' : notificationForm.role === 'staff' ? 'official' : notificationForm.role,
          channels: ["in_app"],
        };
        break;

      case "user":
        endpoint = "/notifications/send-to-user";
        payload = {
          title: notificationForm.title,
          message: notificationForm.message,
          user_id: notificationForm.userId,
          channels: ["in_app"],
        };
        break;

      default:
        endpoint = "/notifications/custom";
        payload = {};
    }

    try {
      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Notification sent successfully");
        setNotificationForm({
          title: "",
          message: "",
          role: "student",
          userId: "",
          priority: "normal",
        });
        fetchSentNotifications();
        fetchNotificationStats();
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  // Filtered users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

// Quick stat card component
const QuickStat = ({ title, value, icon: Icon, color, trend, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-gray-200/40 transition-all duration-300 cursor-pointer group relative overflow-hidden"
  >
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {value?.toLocaleString() || 0}
        </p>
        {trend && (
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}
          >
            {trend.startsWith("+") ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend}
          </p>
        )}
      </div>

      <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
    </div>
  </div>
);

const DashboardTab = ({
  loadingUsers,
  fetchDashboardStats,
  fetchUnverifiedUsers,
  unverifiedUsers,
  handleVerifyUser,
  notificationStats,
  stats,
  setActiveTab,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboardStats(), fetchUnverifiedUsers()]);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {loadingUsers ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Dashboard Overview
              </h2>
              <p className="text-sm text-gray-500">
                Quick insights and recent activity
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStat
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="bg-blue-500"
              trend="+12%"
              onClick={() => setActiveTab("users")}
            />
            <QuickStat
              title="Verified"
              value={stats.verifiedUsers}
              icon={UserCheck}
              color="bg-green-500"
              trend="+8%"
            />
            <QuickStat
              title="Pending"
              value={stats.unverifiedUsers}
              icon={Shield}
              color="bg-yellow-500"
              trend={
                stats.unverifiedUsers > 0
                  ? `${stats.unverifiedUsers} new`
                  : undefined
              }
              onClick={() => setActiveTab("unverified")}
            />
            <QuickStat
              title="Banned"
              value={stats.bannedUsers}
              icon={Ban}
              color="bg-red-500"
              onClick={() => setActiveTab("banned")}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Verifications */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-semibold text-gray-900">
                    Pending Verifications
                  </h3>
                </div>
                {stats.unverifiedUsers > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    {stats.unverifiedUsers} pending
                  </span>
                )}
              </div>

              <div className="divide-y divide-gray-100">
                {unverifiedUsers.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || noProfile}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                      />{" "}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Awaiting verification
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifyUser(user.id)}
                        className="px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ))}

                {unverifiedUsers.length === 0 && (
                  <div className="p-8 text-center">
                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">All users verified!</p>
                  </div>
                )}

                {unverifiedUsers.length > 5 && (
                  <button
                    onClick={() => setActiveTab("unverified")}
                    className="w-full py-2.5 text-sm text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-medium transition-colors"
                  >
                    View all {unverifiedUsers.length} pending →
                  </button>
                )}
              </div>
            </div>

            {/* Notification Overview */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-violet-500" />
                  <h3 className="font-semibold text-gray-900">
                    Notification Stats
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                >
                  Manage →
                </button>
              </div>

              {notificationStats ? (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">
                        Total Sent
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {notificationStats.total_sent}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 font-medium">
                        Delivered
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {notificationStats.delivery_rate}%
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-yellow-600 font-medium">
                        Pending
                      </p>
                      <p className="text-lg font-bold text-yellow-900">
                        {notificationStats.total_pending}
                      </p>
                    </div>
                    <div className="p-3 bg-violet-50 rounded-lg">
                      <p className="text-xs text-violet-600 font-medium">
                        Read Rate
                      </p>
                      <p className="text-lg font-bold text-violet-900">
                        {notificationStats.read_rate}%
                      </p>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Delivery Progress</span>
                      <span>{notificationStats.delivery_rate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${notificationStats.delivery_rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 space-y-3">
                  <Skeleton height={60} className="rounded-lg" />
                  <Skeleton height={60} className="rounded-lg" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "View All Users",
                icon: Users,
                tab: "users",
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Send Notification",
                icon: Send,
                tab: "notifications",
                color: "text-violet-600 bg-violet-50",
              },
              {
                label: "Banned List",
                icon: Ban,
                tab: "banned",
                color: "text-red-600 bg-red-50",
              },
              {
                label: "System Logs",
                icon: Activity,
                action: () => {},
                color: "text-gray-600 bg-gray-50",
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() =>
                  action.tab ? setActiveTab(action.tab) : action.action?.()
                }
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

  const UsersTab = () => {
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("table"); // 'table', 'grid', 'list'
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [filters, setFilters] = useState({
      status: "all", // 'all', 'verified', 'unverified'
      role: "all",
      sortBy: "newest", // 'newest', 'name', 'reputation', 'oldest'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort logic
    const filteredUsers = users
      .filter((user) => {
        const matchesSearch =
          user.name?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(localSearchQuery.toLowerCase());

        const matchesStatus =
          filters.status === "all" ||
          user.verification_status === filters.status;

        const matchesRole =
          filters.role === "all" || user.role === filters.role;

        return matchesSearch && matchesStatus && matchesRole;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "name":
            return a.name?.localeCompare(b.name);
          case "reputation":
            return (b.reputation_points || 0) - (a.reputation_points || 0);
          case "oldest":
            return new Date(a.created_at) - new Date(b.created_at);
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });

    const toggleSelectAll = () => {
      if (selectedUsers.length === filteredUsers.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(filteredUsers.map((u) => u.id));
      }
    };

    const toggleSelectUser = (userId) => {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    };

    const handleBulkAction = async (action) => {
      if (!selectedUsers.length) return;

      switch (action) {
        case "verify":
          // Bulk verify logic
          toast.success(`Verified ${selectedUsers.length} users`);
          break;
        case "ban":
          // Bulk ban logic
          toast.success(`Banned ${selectedUsers.length} users`);
          break;
        case "export":
          // Export logic
          toast.success(`Exported ${selectedUsers.length} users`);
          break;
      }
      setSelectedUsers([]);
    };

    const getStatusColor = (status) => {
      switch (status) {
        case "verified":
          return "bg-green-100 text-green-700 border-green-200";
        case "unverified":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "banned":
          return "bg-red-100 text-red-700 border-red-200";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    const getRoleColor = (role) => {
      switch (role?.toLowerCase()) {
        case "admin":
          return "bg-purple-100 text-purple-700 border-purple-200";
        case "moderator":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "trusted":
          return "bg-indigo-100 text-indigo-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    // User Card Component
    const UserCard = ({ user }) => (
      <div className="group bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar_url || noProfile}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />

                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${
                    user.verification_status === "verified"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {user.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleSelectUser(user.id)}
              className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
            />
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.verification_status)}`}
            >
              {user.verification_status === "verified"
                ? "Verified"
                : "Unverified"}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
            >
              {user.role || "User"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {user.department && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.department}</span>
              </div>
            )}
            {user.designation && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.designation}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-gray-600">
              <Award className="w-3.5 h-3.5 text-yellow-500" />
              <span>{user.reputation_points || 0} pts</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => fetchUserDetails(user.id)}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          {user.verification_status !== "verified" && (
            <button
              onClick={() => handleVerifyUser(user.id)}
              className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              title="Verify"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => openBanModal(user.id)}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Ban"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    // Compact List Item
    const UserListItem = ({ user }) => (
      <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={() => toggleSelectUser(user.id)}
            className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500 shrink-0"
          />

          <div className="relative shrink-0">
            <img
              src={user.avatar_url || noProfile}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap pl-17 sm:pl-0">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.verification_status)}`}
          >
            {user.verification_status}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {user.role || "User"}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600">
            <Award className="w-3.5 h-3.5 text-yellow-500" />
            {user.reputation_points || 0}
          </span>
        </div>

        <div className="flex items-center gap-1 pl-17 sm:pl-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => fetchUserDetails(user.id)}
            className="p-2 text-gray-400 hover:text-violet-600"
          >
            <Eye className="w-4 h-4" />
          </button>
          {user.verification_status !== "verified" && (
            <button
              onClick={() => handleVerifyUser(user.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => openBanModal(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    if (loadingUsers) return <UsersTableSkeleton />;

    return (
      <div className="space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-500" />
              All Users
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Filter Chips */}
            <button
              onClick={() => setActiveTab("unverified")}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium hover:bg-yellow-200 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Pending ({stats.unverifiedUsers})
            </button>
            <button
              onClick={() => setActiveTab("banned")}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
            >
              <Ban className="w-4 h-4" />
              Banned ({stats.bannedUsers})
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1" />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-48"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { mode: "table", icon: Table2 },
                { mode: "grid", icon: LayoutGrid },
                { mode: "list", icon: List },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded ${viewMode === mode ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
                  title={`${mode} view`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase mb-2 block">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="reputation">Reputation</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-violet-50 border border-violet-200 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-violet-900">
              <CheckSquare className="w-4 h-4" />
              <span className="font-medium">
                {selectedUsers.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedUsers([])}
                className="px-3 py-1.5 text-sm text-violet-700 hover:text-violet-900"
              >
                Clear
              </button>
              <button
                onClick={() => handleBulkAction("export")}
                className="px-3 py-1.5 bg-white border border-violet-300 text-violet-700 text-sm font-medium rounded-lg hover:bg-violet-50"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
              <button
                onClick={() => handleBulkAction("verify")}
                className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Verify
              </button>
              <button
                onClick={() => handleBulkAction("ban")}
                className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                <Ban className="w-4 h-4 inline mr-1" />
                Ban
              </button>
            </div>
          </div>
        )}

        {/* Users Display */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredUsers.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </div>
        )}

        {viewMode === "table" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Reputation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || noProfile}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.verification_status)}`}
                        >
                          {user.verification_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                        >
                          {user.role || "User"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {user.department || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Award className="w-4 h-4 text-yellow-500" />
                          {user.reputation_points || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}{" "}
                        {new Date(user.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="Details"
                            onClick={() => fetchUserDetails(user.id)}
                            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.verification_status !== "verified" ? (
                            <button
                              title="Verify User"
                              onClick={() => handleVerifyUser(user.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              title="Revoke Verification"
                              onClick={() => handleRevokeVerification(user.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            title="Ban User"
                            onClick={() => openBanModal(user.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            {localSearchQuery ||
            filters.status !== "all" ||
            filters.role !== "all" ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() => {
                    setLocalSearchQuery("");
                    setFilters({
                      status: "all",
                      role: "all",
                      sortBy: "newest",
                    });
                  }}
                  className="mt-4 text-violet-600 hover:text-violet-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users yet</p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const UnverifiedTab = () => {
    const [subTab, setSubTab] = useState("users"); // 'users' or 'requests'
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [reviewingId, setReviewingId] = useState(null);

    // Filter and sort users
    const filteredUsers = unverifiedUsers
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          user.department
            ?.toLowerCase()
            .includes(localSearchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name?.localeCompare(b.name);
        if (sortBy === "reputation")
          return (b.reputation_points || 0) - (a.reputation_points || 0);
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });

    const handleReview = async (requestId, action) => {
      setReviewingId(requestId);
      try {
        await adminReviewDocument(requestId, action);
        toast.success(`Request ${action}ed successfully`);
        fetchVerificationRequests();
        fetchUnverifiedUsers();
        fetchDashboardStats();
      } catch (error) {
        toast.error(error.message || "Failed to review request");
      } finally {
        setReviewingId(null);
      }
    };

    const toggleSelectAll = () => {
      if (selectedUsers.length === filteredUsers.length) {
        setSelectedUsers([]);
      } else {
        setSelectedUsers(filteredUsers.map((u) => u.id));
      }
    };

    const toggleSelectUser = (userId) => {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId],
      );
    };

    const handleBulkVerify = async () => {
      if (!selectedUsers.length) return;
      toast.success(`Verified ${selectedUsers.length} users`);
      setSelectedUsers([]);
    };

    const UserCard = ({ user }) => (
      <div className="group bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar_url || noProfile}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {user.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {user.email || "No email"}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleSelectUser(user.id)}
              className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {user.department && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.department}</span>
              </div>
            )}
            {user.designation && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.designation}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-gray-600">
              <Star className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.reputation_points || 0} pts</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => handleVerifyUser(user.id)}
            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Verify
          </button>
          <button
            onClick={() => fetchUserDetails(user.id)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    const RequestCard = ({ req }) => (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {req.requesting_user_avatar ? (
              <img
                src={req.requesting_user_avatar}
                alt={req.requesting_user_name}
                className="w-10 h-10 rounded-full object-cover border-2 border-violet-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                {req.requesting_user_name?.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {req.requesting_user_name || "Unknown User"}
              </h4>
              <p className="text-xs text-gray-500 capitalize">
                {req.verification_type} Request
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
              req.status === "pending"
                ? "bg-amber-50 text-amber-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {req.status}
          </span>
        </div>

        {req.target_user_name && (
          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>Vouching for: <span className="font-semibold text-gray-700">{req.target_user_name}</span></span>
          </div>
        )}

        {req.message && (
          <p className="text-sm text-gray-600 mb-4 italic">"{req.message}"</p>
        )}

        {req.documents && req.documents.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Attached Proofs
            </p>
            <div className="flex flex-wrap gap-2">
              {req.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url || doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {doc.name || `Proof ${i + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="text-[11px] text-gray-400 mb-3">
          Submitted {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString()}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleReview(req.id, "reject")}
            disabled={reviewingId === req.id}
            className="flex-1 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => handleReview(req.id, "approve")}
            disabled={reviewingId === req.id}
            className="flex-1 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-1"
          >
            {reviewingId === req.id ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Approve
          </button>
        </div>
      </div>
    );

    if (loadingUnverified && loadingRequests) return <UnverifiedSkeleton />;

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-white/50 p-1 rounded-xl border border-gray-100 w-fit">
            <button
              onClick={() => setSubTab("users")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${subTab === "users" ? "bg-violet-600 text-white shadow-md" : "text-gray-500 hover:bg-white"}`}
            >
              Unverified Users
            </button>
            <button
              onClick={() => setSubTab("requests")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${subTab === "requests" ? "bg-violet-600 text-white shadow-md" : "text-gray-500 hover:bg-white"}`}
            >
              Review Requests{" "}
              {verificationRequests.filter((r) => r.status?.toLowerCase() === "pending").length > 0 && (
                <span className="ml-1 px-1.5 bg-white text-violet-600 rounded-md text-[10px]">
                  {verificationRequests.filter((r) => r.status?.toLowerCase() === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>

        {subTab === "users" ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  Manual Overrides
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Directly verify users without requests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
                  />
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500 shrink-0"
                      />
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar_url || noProfile}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-400 border-2 border-white rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {user.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || "No email"}
                        </p>
                      </div>
                      {user.department && (
                        <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 ml-2 shrink-0">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          {user.department}
                        </span>
                      )}
                      <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500 ml-2 shrink-0">
                        <Star className="w-3.5 h-3.5 text-gray-400" />
                        {user.reputation_points || 0} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <button
                        onClick={() => handleVerifyUser(user.id)}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verify
                      </button>
                      <button
                        onClick={() => fetchUserDetails(user.id)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-20" />
                <p className="text-gray-500 font-medium">
                  No unverified users found
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verificationRequests
              .filter((r) => r.status?.toLowerCase() === "pending")
              .map((req) => (
                <RequestCard key={req.id} req={req} />
              ))}
            {verificationRequests.filter((r) => r.status?.toLowerCase() === "pending")
              .length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No Pending Requests
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  All verification applications have been reviewed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const BannedTab = () => {
  if (loadingBanned) return <BannedSkeleton />;

  return (
    <div className="space-y-6">
    {/* Users List */}
      {bannedUsers.length > 0 ? (
        <div className="grid gap-5">
          {bannedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <UserX className="w-6 h-6 text-red-500" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name}
                      </h3>

                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                        Banned
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm">{user.email}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                         {new Date(user.banned_at).toLocaleDateString()}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs">
                         {user.ban_reason || "Violation of terms"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleUnbanUser(user.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Unban</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-20 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-5">
            <Shield className="w-10 h-10 text-green-500" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800">
            No banned users
          </h3>

          <p className="text-gray-500 mt-2">
            Your community is healthy and safe!
          </p>
        </div>
      )}
    </div>
  );
};

  const ReportsTab = () => {
    // filter reports by search query
    const filteredReports = reports.filter((report) => {
      // search match
      const query = reportsSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        report.reporter_name?.toLowerCase().includes(query) ||
        report.reported_user_name?.toLowerCase().includes(query) ||
        report.reason?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.issue_title?.toLowerCase().includes(query);

      return matchesSearch;
    });

    if (loadingReports) {
      return (
        <div className="w-full space-y-4 animate-fade-in">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton height={24} width={120} />
                <Skeleton height={20} width={80} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton height={40} />
                <Skeleton height={40} />
                <Skeleton height={40} />
              </div>
              <Skeleton height={60} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            {[
              { id: "all", label: "All Reports" },
              { id: "pending", label: "Pending" },
              { id: "reviewed", label: "Reviewed" },
              { id: "dismissed", label: "Dismissed" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setReportsStatusFilter(filter.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  reportsStatusFilter === filter.id
                    ? "bg-[#6366f1] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by reporter, reported user, reason..."
              value={reportsSearchQuery}
              onChange={(e) => setReportsSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50/50"
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isPending = report.status !== "reviewed" && report.status !== "dismissed";
            const isReviewed = report.status === "reviewed";
            const isDismissed = report.status === "dismissed";

            return (
              <div
                key={report.id}
                className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-md ${
                  isPending ? "border-amber-100 hover:border-amber-200" : "border-gray-200"
                }`}
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      isPending ? "bg-amber-50 text-amber-600" :
                      isReviewed ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">Report #{report.id}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Created on {new Date(report.created_at).toLocaleDateString()} at {new Date(report.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        isPending
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : isReviewed
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Parties involved */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reporter</p>
                      <p className="font-semibold text-gray-800 text-sm">{report.reporter_name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{report.reporter_user_id}</p>
                    </div>

                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Reported User</p>
                      <p className="font-semibold text-gray-800 text-sm">{report.reported_user_name}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{report.reported_user_id}</p>
                    </div>

                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Report Reason</p>
                      <span className="inline-block px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-lg border border-violet-100 capitalize mt-1">
                        {report.reason?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Reported Item Link */}
                  {(report.issue_id || report.comment_id) && (
                    <div className="bg-linear-to-r from-violet-50/30 to-indigo-50/30 p-3 rounded-xl border border-indigo-50 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs text-gray-600">
                          Reported Item:{" "}
                          <span className="font-bold text-gray-900">
                            {report.comment_id ? "Comment" : "Issue"}
                          </span>
                        </span>
                      </div>
                      {report.issue_id && (
                        <button
                          onClick={() => navigate(`/issues/${report.issue_id}`)}
                          className="px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-200 transition-colors shadow-xs cursor-pointer"
                        >
                          View Issue: "{report.issue_title || `ID: ${report.issue_id}`}"
                        </button>
                      )}
                    </div>
                  )}

                  {/* Report Description */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 italic text-gray-700 text-sm">
                      "{report.description || "No description provided."}"
                    </div>
                  </div>

                  {/* Resolution Details for Reviewed Reports */}
                  {isReviewed && (
                    <div className="mt-4 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 space-y-2 animate-fade-in">
                      <div className="flex justify-between text-xs text-emerald-700 font-bold uppercase tracking-wider">
                        <span>Resolution Details</span>
                        {report.resolved_at && (
                          <span>
                            Resolved on: {new Date(report.resolved_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-bold text-emerald-800">Action:</span>{" "}
                        <span className="capitalize font-medium">{report.action || "Reviewed"}</span>
                      </div>
                      {report.admin_notes && (
                        <div className="text-sm text-gray-700">
                          <span className="font-bold text-emerald-800">Admin Notes:</span>{" "}
                          <span className="italic">"{report.admin_notes}"</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resolution Details for Dismissed Reports */}
                  {isDismissed && report.resolved_at && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500">
                      Dismissed on {new Date(report.resolved_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                {isPending && (
                  <div className="px-5 py-4 bg-gray-50/50 rounded-b-2xl border-t border-gray-50 flex justify-end gap-3">
                    <button
                      onClick={() => handleDismissReport(report.id)}
                      disabled={actioningReportId === report.id}
                      className="px-4 py-2 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {actioningReportId === report.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReviewReport(report)}
                      disabled={actioningReportId === report.id}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {actioningReportId === report.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      Review & Act
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-25" />
              <p className="text-gray-500 font-bold">No reports found</p>
              <p className="text-sm text-gray-400 mt-1">Excellent! No matching reports to display.</p>
            </div>
          )}
        </div>
      </div>
    );
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

      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20">
        <TopBar title="Admin Control Panel" />
        <div className="p-2 lg:p-4 w-full min-h-screen">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-2 lg:mb-6 gap-2 px-2 md:px-0 ">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "users", label: "All Users", icon: Users },
            {
              id: "unverified",
              label: "Pending",
              icon: Shield,
              badge: stats.unverifiedUsers,
            },
            {
              id: "banned",
              label: "Banned",
              icon: Ban,
              badge: stats.bannedUsers,
            },
            { id: "notifications", label: "Notifications", icon: Bell },
            {
              id: "reports",
              label: "Reports",
              icon: AlertTriangle,
              badge: stats.pendingReports,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#7E70EB] text-white shadow-lg shadow-indigo-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <p className="text-sm md:text-m">{tab.label}</p>
              {tab.badge > 0 && (
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-white text-violet-600"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-fade-in md:bg-[#F3F1FF] p-2 sm:p-2 md:p-4 rounded-2xl min-h-[500px]">
          {activeTab === "dashboard" && (
            <DashboardTab
              loadingUsers={loadingUsers}
              fetchDashboardStats={fetchDashboardStats}
              fetchUnverifiedUsers={fetchUnverifiedUsers}
              unverifiedUsers={unverifiedUsers}
              handleVerifyUser={handleVerifyUser}
              notificationStats={notificationStats}
              stats={stats}
              setActiveTab={setActiveTab}
              fetchSentNotifications={fetchSentNotifications}
              fetchNotificationStats={fetchNotificationStats}
            />
          )}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "unverified" && <UnverifiedTab />}
          {activeTab === "banned" && <BannedTab />}
          {activeTab === "notifications" && (
            <NotificationsTab
              notificationType={notificationType}
              setNotificationType={setNotificationType}
              notificationForm={notificationForm}
              setNotificationForm={setNotificationForm}
              handleSendNotification={handleSendNotification}
              loading={loading}
              notificationStats={notificationStats}
              sentNotifications={sentNotifications}
            />
          )}
          {activeTab === "reports" && <ReportsTab />}
        </div>

        {showReviewModal && selectedReport && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100 mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Review Report #{selectedReport.id}
              </h2>
              
              <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
                <div>
                  <span className="font-bold text-gray-700">Reporter:</span> {selectedReport.reporter_name}
                </div>
                <div>
                  <span className="font-bold text-gray-700">Reported User:</span> {selectedReport.reported_user_name}
                </div>
                <div>
                  <span className="font-bold text-gray-700">Reason:</span> <span className="capitalize">{selectedReport.reason?.replace(/_/g, " ")}</span>
                </div>
              </div>

              {/* Action Dropdown */}
              <div className="mb-4 relative">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Select Action
                </label>
                <select
                  value={reviewAction}
                  onChange={(e) => setReviewAction(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-200 cursor-pointer"
                >
                  <option value="delete_content">Delete Content (delete_content)</option>
                  <option value="keep_content">Keep Content (keep_content)</option>
                  <option value="warn_user">Warn User (warn_user)</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Admin Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                  rows="4"
                  placeholder="Enter details about why this action was taken..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  disabled={actioningReportId === selectedReport.id}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmReviewReport}
                  disabled={actioningReportId === selectedReport.id}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {actioningReportId === selectedReport.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        )}

        {showBanModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold mb-4">Ban User</h2>

              {/* Reason */}
              <label className="block text-sm font-medium mb-1">
                Ban Reason (min 10 characters)
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                rows="3"
                placeholder="Enter reason for banning..."
              />

              {/* Delete Content Checkbox */}
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={deleteContent}
                  onChange={(e) => setDeleteContent(e.target.checked)}
                  className="mr-2"
                />
                <label>Delete all user's content</label>
              </div>

              {/* Notify User Checkbox */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={notifyUser}
                  onChange={(e) => setNotifyUser(e.target.checked)}
                  className="mr-2"
                />
                <label>Notify user via email</label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmBanUser}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Ban
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/5">
              {/* Header */}
              <div className="relative bg-linear-to-r from-violet-600 to-purple-700 p-6 sm:p-8 text-white">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                >
                  <XCircle className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold ring-4 ring-white/30">
                      <img
                        src={userDetails.user.avatar_url || noProfile}
                        alt={userDetails.user?.name}
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </div>
                    {userDetails.user?.is_active && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-bold truncate">
                      {userDetails.user?.name}
                    </h3>
                    <p className="text-violet-100 text-sm sm:text-base flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {userDetails.user?.email}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {userDetails.user?.verification_status === "verified" ? (
                        <span className="px-3 py-1 bg-green-400/20 text-green-100 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-green-400/30">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-400/20 text-gray-200 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-gray-400/30">
                          <Shield className="w-3.5 h-3.5" /> Unverified
                        </span>
                      )}

                      {userDetails.user?.is_banned ? (
                        <span className="px-3 py-1 bg-red-400/20 text-red-100 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-red-400/30">
                          <Ban className="w-3.5 h-3.5" /> Banned
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-400/20 text-blue-100 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-blue-400/30">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      )}

                      <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold capitalize border border-white/30">
                        {userDetails.user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Academic Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Academic Information
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Course</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.course || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Department</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.department || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Year</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.year || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Semester</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.semester || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Registration No
                      </p>
                      <p className="font-semibold text-gray-800 font-mono text-sm">
                        {userDetails.user?.registration_number || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Designation</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.designation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Hosteler</p>
                      <p className="font-semibold text-gray-800">
                        {userDetails.user?.is_hosteler ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <Home className="w-3 h-3" /> Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-linear-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-violet-600" />
                      <span className="text-xs font-medium text-violet-600">
                        Reputation
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userDetails.user?.reputation_points || 0}
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">
                        Total Issues
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userDetails.activity?.total_issues || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userDetails.activity?.active_issues || 0} active
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        Resolved
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userDetails.activity?.resolved_issues || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userDetails.activity?.success_rate || 0}% success
                    </p>
                  </div>

                  <div className="bg-linear-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-amber-600" />
                      <span className="text-xs font-medium text-amber-600">
                        Activity
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      {userDetails.activity?.total_activity || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userDetails.activity?.total_comments || 0} comments
                    </p>
                  </div>
                </div>

                {/* Detailed Activity */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" /> Activity
                      Breakdown
                    </h4>
                  </div>
                  <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" /> Total Votes
                      </span>
                      <span className="font-semibold text-gray-800">
                        {userDetails.activity?.total_votes || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Vote className="w-4 h-4" /> Poll Votes
                      </span>
                      <span className="font-semibold text-gray-800">
                        {userDetails.activity?.total_poll_votes || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Comments
                      </span>
                      <span className="font-semibold text-gray-800">
                        {userDetails.activity?.total_comments || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" /> Personal Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Gender</span>
                        <span className="font-medium text-gray-800 capitalize">
                          {userDetails.user?.gender?.replace(/_/g, " ") ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date of Birth</span>
                        <span className="font-medium text-gray-800">
                          {userDetails.user?.date_of_birth
                            ? new Date(
                                userDetails.user.date_of_birth,
                              ).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone</span>
                        <span className="font-medium text-gray-800">
                          {userDetails.user?.phone_number || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Account Info
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium text-gray-800">
                          {new Date(
                            userDetails.user?.created_at,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Verifications Given
                        </span>
                        <span className="font-medium text-gray-800">
                          {userDetails.user?.verifications_given_count || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Can Verify Others</span>
                        <span
                          className={`font-medium ${userDetails.user?.can_verify_others ? "text-green-600" : "text-gray-500"}`}
                        >
                          {userDetails.user?.can_verify_others ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ban Info (if banned) */}
                {userDetails.user?.is_banned && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h5 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" /> Ban Information
                    </h5>
                    <div className="space-y-1 text-sm text-red-700">
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {userDetails.user?.ban_reason || "No reason provided"}
                      </p>
                      <p>
                        <span className="font-medium">Banned At:</span>{" "}
                        {userDetails.user?.banned_at
                          ? new Date(
                              userDetails.user.banned_at,
                            ).toLocaleString()
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Banned By:</span>{" "}
                        {userDetails.user?.banned_by || "System"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recent Issues */}
                {userDetails.recent_issues &&
                  userDetails.recent_issues.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                          <History className="w-4 h-4 text-gray-500" /> Recent
                          Issues
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {userDetails.recent_issues.map((issue, idx) => (
                          <div
                            key={idx}
                            className="p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                  {issue.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {issue.status} •{" "}
                                  {new Date(
                                    issue.created_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  issue.priority === "critical"
                                    ? "bg-red-100 text-red-700"
                                    : issue.priority === "high"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {issue.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Quick Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Admin Actions
                  </h5>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {userDetails.user?.verification_status !== "verified" ? (
                      <button
                        onClick={() => {
                          handleVerifyUser(userDetails.user?.id);
                          setShowUserModal(false);
                        }}
                        className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm">Verify</span>
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleRevokeVerification(userDetails.user?.id)
                        }
                        className="py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Shield className="w-5 h-5" />
                        <span className="text-sm">Revoke</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const points = prompt(
                          "Enter reputation points to add:",
                          "10",
                        );
                        if (points)
                          handleAddReputation(
                            userDetails.user?.id,
                            parseInt(points),
                          );
                      }}
                      className="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm">+ Reputation</span>
                    </button>

                    {userDetails.user?.is_banned ? (
                      <button
                        onClick={() => {
                          handleUnbanUser(userDetails.user?.id);
                          setShowUserModal(false);
                        }}
                        className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span className="text-sm">Unban</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = prompt(
                            "Enter ban reason (min 10 chars):",
                            "Violation of terms",
                          );
                          if (reason && reason.length >= 10) {
                            handleBanUser(userDetails.user?.id, reason);
                            setShowUserModal(false);
                          } else if (reason) {
                            toast.error(
                              "Reason must be at least 10 characters",
                            );
                          }
                        }}
                        className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      >
                        <Ban className="w-5 h-5" />
                        <span className="text-sm">Ban User</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setNotificationForm({
                        ...notificationForm,
                        userId: userDetails.user?.id,
                      });
                      setShowUserModal(false);
                      setActiveTab("notifications");
                      setNotificationType("user");
                    }}
                    className="w-full py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Notification</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
