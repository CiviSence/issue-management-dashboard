import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import axios from "../../../Utils/axios";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";

const StaffNotifications = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
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
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    try {
      await axios.patch("/notifications/mark-as-read", {
        notification_ids: unreadIds,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
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
      } catch (error) {
        console.error("Error marking notification as read:", error);
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
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="staffNotifsScroll">
        <TopBar title="Notifications" />
        <PullToRefresh scrollContainerId="staffNotifsScroll" onRefresh={fetchNotifications}>
          <div className="w-full mx-auto p-2 lg:p-4">
        <div className="p-2 md:p-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filters */}
            <div className="flex border-b border-gray-150 px-4 py-3 gap-2 bg-gray-50/50">
              {["all", "unread", "read"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    filter === type
                      ? "bg-[#6366f1] text-white shadow-md shadow-indigo-500/20"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="p-8">
                <Loader />
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 flex gap-4 transition hover:bg-gray-50/50 relative ${
                      notif.read ? "opacity-75" : "bg-indigo-50/20"
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#6366f1] rounded-r-md" />
                    )}
                    <div
                      className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ${
                        notif.read
                          ? "bg-gray-100 text-gray-500"
                          : "bg-indigo-100 text-[#6366f1]"
                      }`}
                    >
                      <i className={`${notif.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex gap-3 mt-3">
                        {notif.link && (
                          <button
                            onClick={() =>
                              navigate(notif.link, { state: notif.state })
                            }
                            className="text-xs font-bold text-[#6366f1] hover:underline cursor-pointer"
                          >
                            View Details
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleRead(notif.id, notif.read)}
                          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        >
                          {notif.read ? "Mark as unread" : "Mark as read"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
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
