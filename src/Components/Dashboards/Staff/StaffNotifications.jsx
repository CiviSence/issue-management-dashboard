import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";

const StaffNotifications = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profileData?.id) return;
      try {
        const data = await getAssignedIssues(profileData.id);
        
        const items = data.map((issue) => {
          let statusText = "New task assigned";
          let icon = "ri-task-line";
          let description = `You have been assigned the task: "${issue.title || "Untitled Issue"}". Please check the details.`;
          
          if (issue.assignment_status === "completed") {
            statusText = "Task completed";
            icon = "ri-checkbox-circle-line";
            description = `The task "${issue.title || "Untitled Issue"}" has been marked as completed.`;
          } else if (issue.assignment_status === "accepted") {
            statusText = "Task accepted & in progress";
            icon = "ri-time-line";
            description = `You accepted the task "${issue.title || "Untitled Issue"}". Status is now In Progress.`;
          }

          return {
            id: issue.assignment_id || issue.id,
            title: statusText,
            description,
            time: new Date(issue.updated_at || issue.created_at || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            read: issue.assignment_status !== "pending",
            icon,
            link: `/tasks/${issue.issue_id}`,
            state: issue
          };
        });

        // Add welcome notification
        items.push({
          id: "welcome",
          title: "Welcome to Notifications",
          description: "All notifications related to your assigned complaints and task updates will appear here.",
          time: "Recently",
          read: true,
          icon: "ri-notification-3-line",
          link: "/dashboard"
        });

        setNotifications(items);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [profileData?.id]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
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
      <div className="flex-1 h-screen overflow-y-auto pb-24 md:pb-6 p-3 md:p-6 bg-[#F0EEFF]">
        <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 sm:p-5 lg:p-6 rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6 border border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                Notifications
              </h1>
              <p className="text-violet-100 text-xs sm:text-sm mt-1">
                Updates on your assigned tasks
              </p>
            </div>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

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
                  <div className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ${
                    notif.read ? "bg-gray-100 text-gray-500" : "bg-indigo-100 text-[#6366f1]"
                  }`}>
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
                          onClick={() => navigate(notif.link, { state: notif.state })}
                          className="text-xs font-bold text-[#6366f1] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleRead(notif.id)}
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
    </>
  );
};

export default StaffNotifications;
