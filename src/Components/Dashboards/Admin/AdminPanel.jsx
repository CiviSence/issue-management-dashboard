import { useState, useEffect } from "react";
import SideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import Searchbar from "../../Templates/Searchbar";
import "react-loading-skeleton/dist/skeleton.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../../Utils/axios";
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
} from "lucide-react";
import Skeleton from "react-loading-skeleton";

const AdminPanel = () => {
  // States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [notificationStats, setNotificationStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationType, setNotificationType] = useState("custom");
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
    bannedUsers: 0,
    trustedUsers: 0,
  });

  // Notification Form State
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    role: "user",
    userId: "",
    priority: "normal",
  });

  // Fetch initial data
  useEffect(() => {
    fetchDashboardStats();
    fetchUnverifiedUsers();
    fetchBannedUsers();
    fetchSentNotifications();
    fetchNotificationStats();
  }, []);

  // API Functions
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("/admin/all-users");
      console.log("response", response);
      const data = response.data;
      console.log(data.users);
      setUsers(data.users);
      setStats((prev) => ({
        ...prev,
        totalUsers: data.users.length,
        verifiedUsers: data.users.filter((u) => u.isVerified).length,
        trustedUsers: data.users.filter((u) => u.isTrusted).length,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      // toast.error("Failed to fetch users");
    }
  };

  const fetchUnverifiedUsers = async () => {
    try {
      const response = await axios.get("/admin/unverified-users");
      const data = response.data;
      console.log(data);
      setUnverifiedUsers(data);
      setStats((prev) => ({ ...prev, unverifiedUsers: data.length }));
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      // toast.error("Failed to fetch unverified users");
    }
  };

  const fetchBannedUsers = async () => {
    try {
      const response = await axios.get("/admin/banned-users");
      const data = response.data.banned_users;
      console.log(data);
      setBannedUsers(data);
      setStats((prev) => ({ ...prev, bannedUsers: data.length }));
    } catch (error) {
      console.error("Error fetching banned users:", error);
      // toast.error("Failed to fetch banned users");
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/admin/users/${userId}/detailed`);
      console.log("userdetails", response);
      setUserDetails(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

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

  const fetchNotificationStats = async () => {
    try {
      const response = await axios.get("/notifications/admin/stats");
      console.log("notification", response);
      setNotificationStats(response.data);
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      // toast.error("Failed to fetch notification stats");
    }
  };

  // Action Handlers
  const handleVerifyUser = async (userId) => {
    try {
      const response = await axios.post(`/admin/verify-user/${userId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("User verified successfully");
        fetchUnverifiedUsers();
        fetchDashboardStats();
      }
    } catch (error) {
      // 🔍 COMPREHENSIVE ERROR LOGGING
      console.group("🔴 Verification Error Debug");

      // Check if it's an Axios error
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        console.log("📡 Server Error Response:", error.response);
        console.log("📄 Status:", error.response.status);
        console.log("📨 Data:", error.response.data);
        console.log("📝 Headers:", error.response.headers);
      } else if (error.request) {
        // Request made but no response received
        console.log("📡 No Response Received");
        console.log("📨 Request:", error.request);
      } else {
        // Something else happened
        console.log("⚠️ Non-Request Error");
        console.log("💬 Message:", error.message);
      }

      // Always log these
      console.log("🔧 Error Config:", error.config);
      console.log("❌ Full Error:", error);
      console.log("🆔 Error Code:", error.code); // ECONNABORTED, ENETUNREACH, etc.
      console.groupEnd();

      // Better user feedback
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify user";
      toast.error(errorMsg);
    }
  };

  const handlePromoteToTrusted = async (userId) => {
    try {
      const response = await axios.post(`/admin/promote-to-trusted/${userId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("User promoted to trusted");
        fetchDashboardStats();
        if (selectedUser) fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error("Failed to promote user");
    }
  };

  const handleRevokeVerification = async (userId) => {
    try {
      const response = await axios.post(`/admin/revoke-verification/${userId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Verification revoked");
        fetchDashboardStats();
        if (selectedUser) fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error revoking verification:", error);
      toast.error("Failed to revoke verification");
    }
  };

  const handleAddReputation = async (userId, points) => {
    try {
      const response = await axios.post(`/admin/add-reputation/${userId}`, {
        points,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success(`Added ${points} reputation points`);
        if (selectedUser) fetchUserDetails(userId);
      }
    } catch (error) {
      console.error("Error adding reputation:", error);
      toast.error("Failed to add reputation");
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm("Are you sure? This will ban the user.")) return;

    try {
      // Call your API to ban the user
      await fetch(`/api/admin/unban-user/${userId}`, {
        method: "POST",
      });
      toast.success("User banned successfully!");
    } catch (error) {
      toast.error("Failed to ban user.");
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      const response = await axios.post(`/admin/unban-user/${userId}`);
      if (response.status === 200) {
        toast.success("User unbanned successfully");
        fetchBannedUsers();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error("Failed to unban user");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);

    let endpoint = "/notifications/custom";
    let payload = {
      title: notificationForm.title,
      message: notificationForm.message,
      priority: notificationForm.priority,
    };

    if (notificationType === "broadcast") {
      endpoint = "/notifications/broadcast";
    } else if (notificationType === "role") {
      endpoint = "/notifications/send-to-role";
      payload.role = notificationForm.role;
    } else if (notificationType === "user") {
      endpoint = "/notifications/send-to-user";
      payload.userId = notificationForm.userId;
    }

    try {
      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        toast.success("Notification sent successfully");
        setShowNotificationModal(false);
        setNotificationForm({
          title: "",
          message: "",
          role: "user",
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

  // Stats Cards Component
  const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <p className="text-sm text-green-500 flex items-center mt-2">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-8 h-8 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  // Tab Components
  const DashboardTab = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
      setIsRefreshing(true);
      await Promise.all([fetchDashboardStats(), fetchUnverifiedUsers()]);
      setIsRefreshing(false);
    };

    // Quick stat card component
    const QuickStat = ({ title, value, icon: Icon, color, trend, onClick }) => (
      <div
        onClick={onClick}
        className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
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
          <div
            className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}
          >
            <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
          </div>
        </div>
      </div>
    );

    return (
      <div className="space-y-6 animate-fade-in">
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
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
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
      </div>
    );
  };

  const UsersTab = () => {
    const [searchQuery, setSearchQuery] = useState("");
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
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase());

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
            return (b.reputation || 0) - (a.reputation || 0);
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
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-12 h-12 rounded-full bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                  style={{ display: user.avatar_url ? "none" : "flex" }}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
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
              <span>{user.reputation || 0} pts</span>
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
            onClick={() => handleBanUser(user.id)}
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
      <div className="group flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => toggleSelectUser(user.id)}
          className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
        />

        <div className="relative shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-5 gap-4 items-center">
          <div className="col-span-2">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.verification_status)}`}
            >
              {user.verification_status}
            </span>
          </div>
          <div className="text-sm text-gray-600">{user.role || "User"}</div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Award className="w-4 h-4 text-yellow-500" />
            {user.reputation || 0}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            onClick={() => handleBanUser(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
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
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                          )}
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
                          {user.reputation || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => fetchUserDetails(user.id)}
                            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.verification_status !== "verified" && (
                            <button
                              onClick={() => handleVerifyUser(user.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleBanUser(user.id)}
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
            {searchQuery ||
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
                    setSearchQuery("");
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");

    // Filter and sort users
    const filteredUsers = unverifiedUsers
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name?.localeCompare(b.name);
        if (sortBy === "reputation")
          return (b.reputation_points || 0) - (a.reputation_points || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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

    const handleBulkVerify = async () => {
      if (!selectedUsers.length) return;
      // Add your bulk verify logic here
      toast.success(`Verified ${selectedUsers.length} users`);
      setSelectedUsers([]);
    };

    const UserCard = ({ user }) => (
      <div className="group bg-white rounded-xl border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all overflow-hidden">
        {/* Card Header with Avatar */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.className = "hidden";
                      e.target.nextSibling.className =
                        "w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg";
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg ${user.avatar_url ? "hidden" : ""}`}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full"
                  title="Pending Verification"
                />
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

          {/* User Details Grid */}
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
            {user.course && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.course}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-gray-600">
              <Star className="w-3.5 h-3.5 text-gray-400" />
              <span>{user.reputation_points || 0} pts</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    const UserRow = ({ user }) => (
      <div className="group flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => toggleSelectUser(user.id)}
          className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
        />

        <div className="relative shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 border-2 border-white rounded-full" />
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 items-center">
          <div>
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="text-sm text-gray-600">{user.department || "—"}</div>
          <div className="text-sm text-gray-600">
            {user.designation || user.course || "—"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {user.reputation_points || 0} pts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleVerifyUser(user.id)}
            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Verify
          </button>
          <button
            onClick={() => fetchUserDetails(user.id)}
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    return (
      <div className="space-y-4 animate-fade-in">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Pending Verifications
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}{" "}
              awaiting approval
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="reputation">Reputation</option>
            </select>

            {/* View Toggle */}
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
                onClick={handleBulkVerify}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Verify Selected
              </button>
            </div>
          </div>
        )}

        {/* Users Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === filteredUsers.length &&
                  filteredUsers.length > 0
                }
                onChange={toggleSelectAll}
                className="w-4 h-4 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
              />
              <div className="flex-1 grid grid-cols-4 gap-4">
                <span>User</span>
                <span>Department</span>
                <span>Role/Course</span>
                <span>Reputation</span>
              </div>
              <span className="w-24 text-right">Actions</span>
            </div>

            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  All caught up!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  No pending verifications at the moment
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const BannedTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Ban className="w-5 h-5 mr-2" />
            Banned Users ({bannedUsers.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {bannedUsers.map((user) => (
            <div
              key={user.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{user.name}</h4>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                      Banned on {new Date(user.bannedAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Reason: {user.banReason || "Violation of terms"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUnbanUser(user.id)}
                className="px-6 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Unban</span>
              </button>
            </div>
          ))}

          {bannedUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
              <p className="text-lg font-medium">No banned users</p>
              <p className="text-sm">Your community is healthy!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
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
                    <option value="user">All Users</option>
                    <option value="trusted">Trusted Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="moderator">Moderators</option>
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
                className="w-full py-3 bg-violet-500 text-white rounded-xl font-semibold hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                  <p className="text-sm text-gray-600 mb-1">Total Sent (24h)</p>
                  <p className="text-2xl font-bold text-violet-700">
                    {notificationStats.last24Hours || 0}
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">
                    Successful Deliveries
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {notificationStats.successful || 0}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Open Rate</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {notificationStats.openRate || 0}%
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
              {sentNotifications.map((notif, idx) => (
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

      <div className="w-full pb-20 md:pb-2 p-2 lg:p-4 lg:w-[calc(100vw-15vw)] overflow-x-auto min-h-screen bg-gray-50">
        {/* Header */}
        <div className="w-full bg-linear-to-r from-violet-500 to-purple-600 p-4 rounded-2xl mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Admin Control Panel
              </h1>
              <p className="text-violet-100 text-sm mt-1">
                Manage users, verifications, and system notifications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-violet-200 border border-white/30 focus:bg-white/30 focus:outline-none transition-all w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
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
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-200"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
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
        <div className="animate-fade-in">
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "unverified" && <UnverifiedTab />}
          {activeTab === "banned" && <BannedTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>

        {/* User Details Modal */}
        {showUserModal && userDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl">
                <h3 className="text-xl font-bold text-gray-800">
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {userDetails.user.name?.[0]}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {userDetails.user.name}
                    </h4>
                    <p className="text-gray-500">{userDetails.user.email}</p>
                    <div className="flex gap-2 mt-2">
                      {userDetails.user.verification_status === "verified" && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                      {userDetails.user.is_active && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center">
                          <Award className="w-3 h-3 mr-1" /> Trusted
                        </span>
                      )}
                      {userDetails.user.is_banned && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center">
                          <Ban className="w-3 h-3 mr-1" /> Banned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Reputation</p>
                    <p className="text-2xl font-bold text-gray-800 flex items-center">
                      <Award className="w-6 h-6 text-yellow-500 mr-2" />
                      {userDetails.reputation || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Joined</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(userDetails.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-800">Quick Actions</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {!userDetails.isVerified ? (
                      <button
                        onClick={() => {
                          handleVerifyUser(userDetails.id);
                          setShowUserModal(false);
                        }}
                        className="py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Verify User</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevokeVerification(userDetails.id)}
                        className="py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <AlertTriangle className="w-5 h-5" />
                        <span>Revoke Verification</span>
                      </button>
                    )}

                    {!userDetails.isTrusted ? (
                      <button
                        onClick={() => handlePromoteToTrusted(userDetails.id)}
                        className="py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Award className="w-5 h-5" />
                        <span>Promote to Trusted</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevokeVerification(userDetails.id)}
                        className="py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <UserX className="w-5 h-5" />
                        <span>Remove Trusted</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const points = prompt(
                          "Enter reputation points to add:",
                          "10",
                        );
                        if (points)
                          handleAddReputation(userDetails.id, parseInt(points));
                      }}
                      className="py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <TrendingUp className="w-5 h-5" />
                      <span>Add Reputation</span>
                    </button>

                    {userDetails.isBanned ? (
                      <button
                        onClick={() => {
                          handleUnbanUser(userDetails.id);
                          setShowUserModal(false);
                        }}
                        className="py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Unban User</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const reason = prompt(
                            "Enter ban reason:",
                            "Violation of terms",
                          );
                          if (reason) {
                            handleBanUser(userDetails.id, reason);
                            setShowUserModal(false);
                          }
                        }}
                        className="py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Ban className="w-5 h-5" />
                        <span>Ban User</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setNotificationForm({
                        ...notificationForm,
                        userId: userDetails.id,
                      });
                      setShowUserModal(false);
                      setActiveTab("notifications");
                      setNotificationType("user");
                    }}
                    className="w-full py-3 bg-violet-500 text-white rounded-xl font-medium hover:bg-violet-600 transition-colors flex items-center justify-center space-x-2"
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AdminPanel;
