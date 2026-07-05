import axios from "../axios";

// Format time
export const formatSmartTime = (dateString) => {
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

// Fetch notifications
export const fetchNotifications = async (defaultLink = "/admin/issues") => {
  try {
    const response = await axios.get("/notifications/my-notifications");
    const items = (response.data || []).map((notif) => {
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
      } else if (
        notif.title?.toLowerCase().includes("report") ||
        notif.title?.toLowerCase().includes("new") ||
        notif.title?.toLowerCase().includes("issue")
      ) {
        icon = "ri-alert-line";
      }

      return {
        id: notif.id,
        title: notif.title,
        description: notif.message,
        time: formatSmartTime(notif.sent_at),
        read: !notif.is_unread,
        icon,
        link: notif.action_url || notif.link || defaultLink,
        state: null,
      };
    });
    return items;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark all notifications as read
export const handleMarkAllRead = async (
  notifications,
  setNotifications,
  toast,
) => {
  const unreadIds = (notifications || [])
    .filter((n) => !n.read)
    .map((n) => n.id);
  if (unreadIds.length === 0) return;
  try {
    await axios.patch("/notifications/mark-as-read", {
      notification_ids: unreadIds,
    });
    if (setNotifications) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
    if (toast) {
      toast.success("All notifications marked as read");
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    if (toast) {
      toast.error("Failed to mark notifications as read");
    }
  }
};

// Create custom notification (Admin/Developer only)
export const createCustomNotification = async (payload) => {
  try {
    const { data } = await axios.post("/notifications/custom", payload);
    return data;
  } catch (error) {
    console.error("Error creating custom notification:", error);
    throw error;
  }
};

// Broadcast notification to all users (Admin/Developer only)
export const broadcastNotification = async (payload) => {
  try {
    const { data } = await axios.post("/notifications/broadcast", payload);
    return data;
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    throw error;
  }
};

// Send notification to a specific role (Admin/Developer only)
export const sendRoleNotification = async (payload) => {
  try {
    const { data } = await axios.post("/notifications/send-to-role", payload);
    return data;
  } catch (error) {
    console.error("Error sending role notification:", error);
    throw error;
  }
};

// Send notification to a specific user (Admin/Developer only)
export const sendUserNotification = async (payload) => {
  try {
    const { data } = await axios.post("/notifications/send-to-user", payload);
    return data;
  } catch (error) {
    console.error("Error sending user notification:", error);
    throw error;
  }
};

