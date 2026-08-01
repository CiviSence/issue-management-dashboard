import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { useNotifications } from "../../../Components/NotificationProvider";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import axios from "../../../Utils/axios";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";
import { toast, ToastContainer } from "react-toastify";
import { handleMarkAllRead as markAllReadUtils } from "../../../Utils/Notifications/notifications";

const StaffNotifications = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const { fetchUnreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const formatSmartTime = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInSeconds < 60) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
    if (diffInHours < 24)
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    return date.toLocaleDateString();
  };

  const fetchNotifications = async () => {
    if (!profileData?.id) return;
    try {
      const response = await axios.get("/notifications/my-notifications");
      const items = response.data.map((notif) => {
        let icon = "ri-notification-3-line";
        if (notif.title?.toLowerCase().includes("assign")) {
          icon = "ri-clipboard-line";
        } else if (notif.title?.toLowerCase().includes("accept")) {
          icon = "ri-loader-4-line";
        } else if (
          notif.title?.toLowerCase().includes("complete") ||
          notif.title?.toLowerCase().includes("resolve")
        ) {
          icon = "ri-checkbox-circle-line";
        }

        return {
          id: notif.id,
          title: notif.title,
          description: notif.message,
          time: formatSmartTime(notif.sent_at),
          read: !notif.is_unread,
          icon,
          link: notif.action_url || notif.link,
          state: null,
        };
      });
      setNotifications(items);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [profileData?.id]);

  const handleMarkAllRead = async () => {
    await markAllReadUtils(notifications, setNotifications, toast);
    fetchUnreadCount();
  };

  const handleToggleRead = async (id, currentRead) => {
    if (!currentRead) {
      try {
        await axios.patch("/notifications/mark-as-read", {
          notification_ids: [id],
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        toast.success("Notification marked as read");
        fetchUnreadCount();
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
      }
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
      );
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <ToastContainer />
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="staffNotifsScroll">
        <TopBar title="Notifications" />
        <PullToRefresh scrollContainerId="staffNotifsScroll" onRefresh={fetchNotifications}>
          <div className="w-full mx-auto p-2 lg:p-4">
        <div className="p-2 md:p-0">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-150 px-4 py-3 gap-3 bg-gray-50/50 dark:bg-dark-elevated/50">
              <div className="flex items-center gap-2">
                {["all", "unread", "read"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                      filter === type
                        ? "bg-[#6366f1] text-white shadow-md shadow-indigo-500/20"
                        : "text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-elevated dark:bg-dark-elevated"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {notifications.some((n) => !n.read) && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-8">
                <Loader />
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-dark-border/50">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex gap-4 transition hover:bg-gray-50 dark:bg-dark-elevated dark:hover:bg-dark-elevated/50 dark:bg-dark-elevated/50 relative ${
                      notif.read ? "opacity-75" : "bg-indigo-50/20"
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6366f1] rounded-r-md" />
                    )}
                    <div
                      className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ${
                        notif.read
                          ? "bg-gray-100 dark:bg-dark-elevated text-gray-500 dark:text-dark-text-secondary"
                          : "bg-indigo-100 text-[#6366f1] dark:text-indigo-400"
                      }`}
                    >
                      <i className={`${notif.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-dark-text text-sm leading-snug">
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 dark:text-dark-text-muted shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-dark-text-secondary text-xs mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex gap-3 mt-3">
                        {notif.link && (
                          <button
                            onClick={() =>
                              navigate(notif.link, { state: notif.state })
                            }
                            className="text-xs font-bold text-[#6366f1] dark:text-indigo-400 hover:underline cursor-pointer"
                          >
                            View Details
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleRead(notif.id, notif.read)}
                          className="text-xs font-semibold text-gray-400 dark:text-dark-text-muted hover:text-gray-600 dark:text-dark-text-secondary transition cursor-pointer"
                        >
                          {notif.read ? "Mark as unread" : "Mark as read"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 dark:text-dark-text-muted">
                <div className="text-4xl mb-2">📭</div>
                <p className="font-bold text-sm">No notifications found</p>
              </div>
            )}
          </div>
          </div>
        </div>
        </PullToRefresh>
      </div>
    </>
  );
};

export default StaffNotifications;
