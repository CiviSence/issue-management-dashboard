import { useMemo, useState, useEffect, useRef } from "react";
import { useIssues } from "../../Context/IssueContext.js";
import { useUser } from "../../Context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Utils/axios";
import defaultPfpFemale from "../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../assets/default-pfp/default-pfp-male.svg";

const TopBar = ({ title }) => {
  const { profileData } = useUser();
  const { issues } = useIssues();
  const navigate = useNavigate();
  console.log(profileData);

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const notificationRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notifications
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      // Close search results
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get("/notifications/unread-count");
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Fetch notifications - always fetch all
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get("/notifications/my-notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    if (newState) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: [notificationId],
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_unread: false } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter((n) => n.is_unread)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;

      await axios.patch("/notifications/mark-as-read", {
        notification_ids: unreadIds,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_unread: false })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Filter issues
  const filteredIssues = useMemo(() => {
    if (!query.trim()) return [];

    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.description?.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, issues]);

  const handleSelect = (issue) => {
    setQuery("");
    setShowResults(false);
    navigate(`/issues/${issue.id}`, { state: issue });
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (notification.is_unread) {
      markAsRead(notification.id);
    }

    const targetUrl = notification.action_url || notification.link;
    if (targetUrl) {
      navigate(targetUrl);
      setShowNotifications(false);
    }
  };

  return (
    <div className="relative sticky top-0 z-50 w-full bg-linear-to-br from-[#5A50A6] to-[#7E70EB] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
      {/* Page Title */}
      <div className="shrink-0 mr-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight hidden sm:block">
          {title}
        </h1>
        <h1 className="text-lg font-bold text-white tracking-tight sm:hidden">
          {title?.length > 15 ? title.substring(0, 15) + "..." : title}
        </h1>
      </div>

      {/* Right Side: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="sm:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
        >
          <i className="ri-search-line text-xl"></i>
        </button>

        {/* Search Input Container */}
        <div
          ref={searchRef}
          className={`w-full max-w-sm ${isMobileSearchOpen ? "absolute inset-0 z-50 flex items-center bg-gradient-to-r from-[#7E70EB] to-[#5A50A6] px-4" : "hidden sm:block relative"}`}
        >
          {isMobileSearchOpen && (
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setQuery("");
              }}
              className="mr-3 text-white shrink-0 p-1 hover:bg-white/10 rounded-full"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
          )}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search issues..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              className="w-full bg-white/10 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 text-sm text-white placeholder:text-white/70"
            />

            {/* Search Results Dropdown */}
            {showResults && query && (
              <div className="absolute top-12 left-0 right-0 bg-white shadow-lg rounded-xl max-h-60 overflow-y-auto z-50 border border-gray-100">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => handleSelect(issue)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                    >
                      <p className="font-medium text-sm text-gray-900">
                        {issue.title}
                      </p>
                      <p className="text-gray-500 text-xs truncate mt-0.5">
                        {issue.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No issues found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Icon */}
        <button
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center text-white"
          title="Refresh Page"
          aria-label="Refresh"
        >
          <i className="ri-refresh-line text-xl"></i>
        </button>

        {/* Notification Icon */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
            aria-label="Notifications"
          >
            <i className="ri-notification-3-line text-xl text-white"></i>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center border border-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-notification-off-line text-3xl mb-2 block text-gray-300"></i>
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${
                        notification.is_unread
                          ? "bg-violet-50/50 border-l-4 border-l-violet-500"
                          : ""
                      }`}
                    >
                      <div className="shrink-0 mt-1.5">
                        {notification.is_unread && (
                          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            notification.is_unread
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-xs mt-0.5 line-clamp-2 ${
                            notification.is_unread
                              ? "text-gray-600"
                              : "text-gray-500"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            notification.is_unread
                              ? "text-violet-500 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {getRelativeTime(notification.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          className="shrink-0 rounded-full bg-white/20 h-9 w-9 text-center overflow-hidden hover:ring-2 hover:ring-white/50 transition-all ml-1 flex items-center justify-center"
        >
          <img
            src={
              profileData?.avatar_url ||
              (profileData?.gender?.toLowerCase() === "female" ||
              profileData?.gender?.toLowerCase() === "f" ||
              profileData?.gender?.toLowerCase() === "woman"
                ? defaultPfpFemale
                : defaultPfpMale)
            }
            alt="Profile"
            className="w-full h-full rounded-full border border-violet-600 object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
