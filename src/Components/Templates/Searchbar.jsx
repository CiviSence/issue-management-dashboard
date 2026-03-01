import { useMemo, useState, useEffect, useRef } from "react";
import { useIssues } from "../../Context/IssueContext";
import { useUser } from "../../Context/ProfileContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../Utils/axios";

const Searchbar = () => {
  const { profileData } = useUser();
  const { issues } = useIssues();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const notificationRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
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

  // Fetch notifications
  const fetchNotifications = async (unread = false) => {
    setLoadingNotifications(true);
    try {
      const response = await axios.get("/notifications/my-notifications", {
        params: { unread_only: unread },
      });
      console.log(response);
      const notifs = response.data;
      setNotifications(notifs);
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
      fetchNotifications(unreadOnly);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: [notificationId],
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
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
        .filter((n) => !n.is_read)
        .map((n) => n.id);
      if (unreadIds.length === 0) return;

      await axios.patch("/notifications/mark-as-read", {
        notification_ids: unreadIds,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      const deleted = notifications.find((n) => n.id === notificationId);
      if (deleted && !deleted.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
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

  const handleSelect = (id) => {
    setQuery("");
    setShowResults(false);
    navigate(`/issues/${id}`);
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

  // Get notification icon based on type/priority
  const getNotificationIcon = (notification) => {
    const type = notification.type || notification.notification_type;
    const priority = notification.priority;

    // Priority-based colors
    const getColor = () => {
      if (priority === "urgent") return "text-red-500";
      if (priority === "high") return "text-orange-500";
      if (type === "broadcast") return "text-violet-500";
      return "text-blue-500";
    };

    switch (type) {
      case "issue_update":
        return `ri-file-list-line ${getColor()}`;
      case "comment":
        return `ri-chat-3-line ${getColor()}`;
      case "mention":
        return `ri-at-line ${getColor()}`;
      case "system":
        return `ri-settings-3-line ${getColor()}`;
      case "verification":
        return `ri-shield-check-line ${getColor()}`;
      case "broadcast":
        return `ri-megaphone-line ${getColor()}`;
      case "custom":
        return `ri-notification-3-line ${getColor()}`;
      default:
        return `ri-notification-3-line ${getColor()}`;
    }
  };

  // Handle notification click - navigate if URL provided
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate if action_url or related issue URL exists
    const targetUrl = notification.action_url || notification.link;
    if (targetUrl) {
      navigate(targetUrl);
      setShowNotifications(false);
    }
  };

  return (
    <div
      className="
        bg-white
        relative
        w-full
        sm:w-[90%]
        md:w-[70%]
        lg:w-[50%]
        xl:w-[40%]
        2xl:w-[35%]
        rounded-full
        p-1.5
        sm:p-2
        flex
        items-center
        justify-between
        gap-2
        sm:gap-3
        shadow-sm
        border
        border-gray-100
      "
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search issues"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        className="
          w-full
          bg-[#F0EEFF]
          px-3
          sm:px-4
          py-2
          sm:py-2.5
          rounded-full
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500/20
          text-sm
          placeholder:text-gray-400
        "
      />

      {/* Right Icons */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
        {/* Notification Icon with Dropdown */}
        <div className="relative hidden sm:block" ref={notificationRef}>
          <button
            onClick={toggleNotifications}
            className="relative p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <i className="ri-notification-3-line text-lg sm:text-xl text-[#aaaaaa]"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newUnreadOnly = !unreadOnly;
                      setUnreadOnly(newUnreadOnly);
                      fetchNotifications(newUnreadOnly);
                    }}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      unreadOnly
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {unreadOnly ? "All" : "Unread"}
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notification List */}
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
                        notification.is_unread ? "bg-violet-50/30" : ""
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        <i
                          className={`${getNotificationIcon(notification)} text-lg`}
                        ></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${notification.is_unread ? "font-medium text-gray-900" : "text-gray-700"}`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-gray-400">
                            {getRelativeTime(notification.sent_at)}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={(e) =>
                            deleteNotification(e, notification.id)
                          }
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                          title="Delete"
                        >
                          <i className="ri-delete-bin-line text-xs text-red-400 hover:text-red-600"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* theme toggle icon - hidden on smallest screens */}
        <button
          className="hidden sm:block p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          <i className="ri-moon-line text-lg sm:text-xl text-[#aaaaaa]"></i>
        </button>
        <button
          className=" sm:hidden pr-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          <i className="ri-search-line text-xl text-[#aaaaaa]"></i>
        </button>

        {/* User */}
        <Link
          to="/profile"
          className="hidden sm:block shrink-0 rounded-full bg-amber-300 h-8 w-8 sm:h-9 sm:w-9 text-center overflow-hidden hover:ring-2 hover:ring-violet-500/30 transition-all"
        >
          <img
            src={profileData?.avatar_url}
            alt="Profile"
            className="w-full h-full rounded-full border border-violet-600 object-cover"
          />
        </Link>
      </div>

      {/* Search Results Dropdown */}
      {showResults && query && (
        <div
          className="
            absolute 
            top-12 
            sm:top-14 
            left-0 
            right-0
            sm:right-auto
            sm:w-[80%]
            md:w-[75%]
            bg-white 
            shadow-lg 
            rounded-xl 
            max-h-60 
            overflow-y-auto 
            z-50
            border
            border-gray-100
          "
        >
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => handleSelect(issue.id)}
                className="px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
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
            <p className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-500">
              No issues found
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
