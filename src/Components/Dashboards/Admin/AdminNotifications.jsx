import { useEffect, useState } from "react";
import AdminSideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useIssues } from "../../../Context/IssueContext.js";
import Loader from "../../Templates/Loader";
import { useNavigate } from "react-router-dom";
import TopBar from "../../Templates/TopBar";
import axios from "../../../Utils/axios";
import { toast, ToastContainer } from "react-toastify";

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { issues, loadingIssues } = useIssues();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all"); // all, role, individual
  const [recipientRole, setRecipientRole] = useState("citizen"); // citizen, official, admin, developer
  const [recipientUserId, setRecipientUserId] = useState("");
  const [channels, setChannels] = useState(["in_app", "push"]); // in_app, push, email, websocket
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (issues && issues.length > 0) {
      const items = issues.slice(0, 15).map((issue) => {
        let title = `New issue reported: ${issue.title || "Untitled"}`;
        let description = `A new issue has been reported in category "${issue.main_category}" at ${issue.location_building || "location"}.`;
        let icon = "ri-alert-line";
        let read = issue.status !== "new";

        if (issue.priority?.toLowerCase() === "high" || issue.priority?.toLowerCase() === "critical") {
          title = `⚠️ High Priority: ${issue.title || "Untitled"}`;
          icon = "ri-error-warning-line";
        } else if (issue.status === "resolved") {
          title = `✅ Resolved: ${issue.title || "Untitled"}`;
          description = `Issue #${issue.id} has been marked as resolved by staff.`;
          icon = "ri-checkbox-circle-line";
          read = true;
        }

        return {
          id: issue.id,
          title,
          description,
          time: new Date(issue.created_at || Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          read,
          icon,
          link: `/issues/${issue.id}`,
          state: issue
        };
      });

      setNotifications(items);
    }
  }, [issues]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleChannelChange = (channel) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (channels.length === 0) {
      toast.error("At least one communication channel must be selected");
      return;
    }

    setIsSending(true);
    try {
      let endpoint = "/notifications/custom";
      let payload = {
        title: modalTitle,
        message: modalMessage,
        channels: channels,
      };

      if (recipientType === "all") {
        payload.recipient_type = "all";
      } else if (recipientType === "role") {
        payload.recipient_type = "role";
        payload.recipient_filter = { role: recipientRole };
      } else if (recipientType === "individual") {
        payload.recipient_type = "individual";
        if (!recipientUserId.trim()) {
          toast.error("User ID is required for individual notifications");
          setIsSending(false);
          return;
        }
        payload.recipient_filter = { user_id: recipientUserId.trim() };
      }

      const response = await axios.post(endpoint, payload);
      toast.success("Notification broadcast scheduled successfully!");
      
      // Reset form & close modal
      setModalTitle("");
      setModalMessage("");
      setRecipientType("all");
      setRecipientUserId("");
      setChannels(["in_app", "push"]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to send notification:", error);
      const errMsg = error.response?.data?.detail || error.response?.data?.message || "Failed to broadcast notification";
      toast.error(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <>
      <AdminSideNav />
      <BottomNav />
      <ToastContainer />
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20">
        <TopBar title="Notifications" />
        <div className="p-2 lg:p-4 w-full min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">System Bulletins</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <i className="ri-send-plane-fill"></i>
                Send Notification
              </button>
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold transition-all cursor-pointer"
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

            {loadingIssues ? (
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
                      notif.read ? "bg-gray-100 text-gray-500" : "bg-[#7e70eb]/15 text-[#7e70eb]"
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
                        <button
                          onClick={() => navigate(notif.link, { state: notif.state })}
                          className="text-xs font-bold text-[#6366f1] hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
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
      </div>

      {/* Modern Send Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 bg-[#6366f1] text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <i className="ri-send-plane-2-line"></i>
                Create Notification Broadcast
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-white/80 hover:text-white transition cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Notification Title</label>
                <input
                  type="text"
                  placeholder="e.g. Server Maintenance Notice"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-all"
                  required
                />
              </div>

              {/* Message Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">Message Body</label>
                <textarea
                  placeholder="Enter details of your message here..."
                  value={modalMessage}
                  onChange={(e) => setModalMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1] transition-all resize-none"
                  required
                />
              </div>

              {/* Recipient Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "All Users" },
                    { id: "role", label: "By Role" },
                    { id: "individual", label: "Single User" }
                  ].map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setRecipientType(target.id)}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition cursor-pointer ${
                        recipientType === target.id
                          ? "bg-[#6366f1]/10 border-[#6366f1] text-[#6366f1]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>

                {recipientType === "role" && (
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">Select Role</label>
                    <select
                      value={recipientRole}
                      onChange={(e) => setRecipientRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                    >
                      <option value="citizen">Student (Citizen)</option>
                      <option value="official">Staff (Official)</option>
                      <option value="admin">Administrator</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>
                )}

                {recipientType === "individual" && (
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">Target User ID (UUID)</label>
                    <input
                      type="text"
                      placeholder="e.g. 71ecdac0-c479-4ab7-9ce6-4f117bbed2f5"
                      value={recipientUserId}
                      onChange={(e) => setRecipientUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                    />
                  </div>
                )}
              </div>

              {/* Delivery Channels */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block">Communication Channels</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "in_app", label: "In-App Notification", icon: "ri-notification-badge-line" },
                    { id: "push", label: "Push Notification (FCM)", icon: "ri-smartphone-line" },
                    { id: "email", label: "Email (SMTP)", icon: "ri-mail-line" },
                    { id: "websocket", label: "Live WebSocket alert", icon: "ri-flashlight-line" }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleChannelChange(ch.id)}
                      className={`flex items-center gap-2 py-2 px-3 border rounded-xl text-xs font-bold transition cursor-pointer text-left ${
                        channels.includes(ch.id)
                          ? "bg-[#6366f1]/10 border-[#6366f1] text-[#6366f1]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <i className={ch.icon}></i>
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white disabled:bg-gray-300 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  {isSending ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Broadcasting...
                    </>
                  ) : (
                    <>
                      <i className="ri-send-plane-line"></i>
                      Send Bulletin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNotifications;
