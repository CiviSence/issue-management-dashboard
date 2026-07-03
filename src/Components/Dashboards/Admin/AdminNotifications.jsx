import { useEffect, useState } from "react";
import AdminSideNav from "./AdminSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import Loader from "../../Templates/Loader";
import TopBar from "../../Templates/TopBar";
import PullToRefresh from "../../Templates/PullToRefresh";
import axios from "../../../Utils/axios";
import {
  fetchNotifications,
  handleMarkAllRead as markAllReadUtils,
  broadcastNotification,
  sendRoleNotification,
  sendUserNotification,
  createCustomNotification,
} from "../../../Utils/Notifications/notifications";
import { toast, ToastContainer } from "react-toastify";

const AdminNotifications = () => {
  const { profileData } = useUser();
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  console.log(notifications);

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all"); // all, role, individual, custom
  const [recipientRole, setRecipientRole] = useState("citizen"); // citizen, official, admin, developer
  const [recipientUserId, setRecipientUserId] = useState("");
  const [customRecipientType, setCustomRecipientType] = useState("all"); // all, role, individual, custom
  const [customRoles, setCustomRoles] = useState(["citizen"]); // all, citizen, official, admin
  const [customUserId, setCustomUserId] = useState("");
  const [customPriority, setCustomPriority] = useState("normal"); // normal, low, high, urgent
  const [selectedChannels, setSelectedChannels] = useState([
    "in_app",
    "email",
    "push",
  ]);
  const [isSending, setIsSending] = useState(false);

  //fetch notification - src/utils/notifications.js
  const loadNotifications = async () => {
    if (!profileData?.id) return;
    setLoadingNotifications(true);
    try {
      const items = await fetchNotifications("/admin/issues");
      setNotifications(items);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [profileData?.id]);

  //mark all as read - src/utils/notifications.js
  const handleMarkAllRead = () =>
    markAllReadUtils(notifications, setNotifications, toast);

  const handleToggleRead = async (id, currentRead) => {
    if (!currentRead) {
      try {
        await axios.patch("/notifications/mark-as-read", {
          notification_ids: [id],
        });
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  //toggle role - admin/official/citizen/all
  const handleCustomRoleToggle = (r) => {
    if (customRoles.includes(r)) {
      setCustomRoles(customRoles.filter((item) => item !== r));
    } else {
      setCustomRoles([...customRoles, r]);
    }
  };

  //toggle channel - in_app/push/email
  const handleChannelToggle = (ch) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  //notification validator
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!modalTitle.trim() || !modalMessage.trim()) {
      toast.error("Title and message are required");
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error("Please select at least one delivery channel");
      return;
    }

    setIsSending(true);
    try {
      if (recipientType === "all") {
        await broadcastNotification({
          title: modalTitle,
          message: modalMessage,
          channels: selectedChannels,
        });
      } else if (recipientType === "role") {
        await sendRoleNotification({
          title: modalTitle,
          message: modalMessage,
          role: recipientRole === "officials" ? "official" : recipientRole,
          channels: selectedChannels,
        });
      } else if (recipientType === "individual") {
        if (!recipientUserId.trim()) {
          toast.error("User ID is required for individual notifications");
          setIsSending(false);
          return;
        }
        await sendUserNotification({
          title: modalTitle,
          message: modalMessage,
          user_id: recipientUserId.trim(),
          channels: selectedChannels,
        });
      } else if (recipientType === "custom") {
        let rFilter = {};
        if (customRecipientType === "role") {
          if (customRoles.length === 0) {
            toast.error(
              "Please select at least one role for custom notification",
            );
            setIsSending(false);
            return;
          }
          rFilter = {
            roles: customRoles,
            role: customRoles.length === 1 ? customRoles[0] : customRoles,
          };
          customRoles.forEach((r) => {
            rFilter[r] = true;
          });
        } else if (customRecipientType === "individual") {
          if (!customUserId.trim()) {
            toast.error(
              "User ID is required for custom individual notification",
            );
            setIsSending(false);
            return;
          }
          rFilter = {
            user_id: customUserId.trim(),
            userId: customUserId.trim(),
          };
        } else if (customRecipientType === "all") {
          rFilter = { all: true };
        }

        await createCustomNotification({
          title: modalTitle,
          message: modalMessage,
          recipient_type: customRecipientType,
          recipient_filter: rFilter,
          channels: selectedChannels,
          priority: customPriority,
          scheduled_for: new Date().toISOString(),
        });
      }

      toast.success("Notification sent successfully");
      loadNotifications();

      // Reset form & close modal
      setModalTitle("");
      setModalMessage("");
      setRecipientType("all");
      setRecipientUserId("");
      setCustomRecipientType("all");
      setCustomRoles(["citizen"]);
      setCustomUserId("");
      setCustomPriority("normal");
      setSelectedChannels(["in_app", "email", "push"]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to send notification:", error);
      let errMsg = "Failed to send notification";
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errMsg = error.response.data.detail
            .map((err) => `${err.loc?.slice(-1)[0] || "field"}: ${err.msg}`)
            .join(", ");
        } else if (typeof error.response.data.detail === "string") {
          errMsg = error.response.data.detail;
        } else {
          errMsg = JSON.stringify(error.response.data.detail);
        }
      } else if (error.response?.data?.message) {
        errMsg = error.response.data.message;
      }
      toast.error(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <>
      <AdminSideNav />
      <BottomNav />
      <ToastContainer />
      <div className="w-full lg:w-[calc(100vw-15vw)] bg-[#FDFDFF] overflow-x-hidden overflow-y-auto h-screen pb-20" id="adminNotifsScroll">
        <TopBar title="Notifications" />
        <PullToRefresh scrollContainerId="adminNotifsScroll" onRefresh={loadNotifications}>
          <div className="p-2 lg:p-4 w-full min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Filters and Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-150 px-4 py-3 gap-3 bg-gray-50/50">
              <div className="flex items-center gap-2">
                {["all", "unread"].map((type) => (
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer capitalize"
                >
                  <i className="ri-send-plane-fill"></i>
                  <span>
                    Send<span className="hidden lg:inline"> Notifications</span>
                  </span>
                </button>
                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={handleMarkAllRead}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {loadingNotifications ? (
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
                          : "bg-[#7e70eb]/15 text-[#7e70eb]"
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
                        {/* <button
                          onClick={() =>
                            navigate(notif.link, { state: notif.state })
                          }
                          className="text-xs font-bold text-[#6366f1] hover:underline cursor-pointer"
                        >
                          View Details
                        </button> */}
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
        </PullToRefresh>
      </div>

      {/* Modern Send Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 bg-linear-to-br from-[#5A50A6] to-[#7E70EB] text-white">
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
              <div>
                <label className="pb-1 text-xs font-bold text-gray-600 block">
                  Target Audience
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "all", label: "Broadcast" },
                    { id: "role", label: "By Role" },
                    { id: "individual", label: "Single User" },
                    { id: "custom", label: "Custom" },
                  ].map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setRecipientType(target.id)}
                      className={`py-2 px-2 border rounded-xl text-xs font-bold transition cursor-pointer truncate ${
                        recipientType === target.id
                          ? "bg-[#6366f1]/10 border-[#6366f1] text-[#6366f1]"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600 block">
                  Notification Title
                </label>
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
                <label className="text-xs font-bold text-gray-600 block">
                  Message Body
                </label>
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
                {recipientType === "role" && (
                  <div className="mt-3 space-y-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 block">
                        Recipient Group
                      </label>
                      <select
                        value={recipientRole}
                        onChange={(e) => setRecipientRole(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                      >
                        <option value="all">All Users</option>
                        <option value="citizen">Citizens (Students)</option>
                        <option value="official">Officials (Staff)</option>
                        <option value="admin">Administrators</option>
                      </select>
                    </div>
                  </div>
                )}

                {recipientType === "individual" && (
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 block">
                      Target User ID (UUID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 71ecdac0-c479-4ab7-9ce6-4f117bbed2f5"
                      value={recipientUserId}
                      onChange={(e) => setRecipientUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                    />
                  </div>
                )}

                {recipientType === "custom" && (
                  <div className="mt-3 space-y-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    {/* Recipient Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 block">
                        Recipient Type
                      </label>
                      <select
                        value={customRecipientType}
                        onChange={(e) => setCustomRecipientType(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                      >
                        <option value="all">All Users</option>
                        <option value="role">By Role</option>
                        <option value="individual">Single Individual</option>
                        <option value="custom">Custom Criteria</option>
                      </select>
                    </div>

                    {/* Filter Option for Role */}
                    {customRecipientType === "role" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 block">
                          Select Target Roles
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: "all", label: "All Users" },
                            { id: "citizen", label: "Citizens" },
                            { id: "official", label: "Officials" },
                            { id: "admin", label: "Admins" },
                          ].map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => handleCustomRoleToggle(r.id)}
                              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize border transition cursor-pointer truncate ${
                                customRoles.includes(r.id)
                                  ? "bg-[#6366f1] border-[#6366f1] text-white shadow-sm shadow-indigo-500/20"
                                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filter Option for Individual */}
                    {customRecipientType === "individual" && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 block">
                          Target User ID (UUID)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 71ecdac0-c479-4ab7-9ce6-4f117bbed2f5"
                          value={customUserId}
                          onChange={(e) => setCustomUserId(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#6366f1]/25 focus:border-[#6366f1]"
                        />
                      </div>
                    )}

                    {/* Priority */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 block">
                        Priority Level
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {["normal", "low", "high", "urgent"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setCustomPriority(p)}
                            className={`py-1.5 px-2 rounded-lg text-[10px] font-bold capitalize border transition cursor-pointer truncate ${
                              customPriority === p
                                ? "bg-[#6366f1] border-[#6366f1] text-white shadow-sm shadow-indigo-500/20"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Channels */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 block">
                  Delivery Channels
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "in_app",
                      label: "In-App",
                      icon: "ri-notification-badge-line",
                    },
                    { id: "email", label: "Email", icon: "ri-mail-line" },
                    { id: "push", label: "Push", icon: "ri-smartphone-line" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleChannelToggle(ch.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        selectedChannels.includes(ch.id)
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
