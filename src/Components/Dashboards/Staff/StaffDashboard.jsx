import { useEffect, useState } from "react";
import StaffSideNav from "./StaffSideNav";
import BottomNav from "../../Templates/BottomNav";
import { useUser } from "../../../Context/ProfileContext";
import { getAssignedIssues, mySummary } from "../../../Utils/staffissues";
import Loader from "../../Templates/Loader";
import IssueCard from "../../Templates/IssueCard";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../Templates/StatusBadge";
import defaultProfile from "../../../assets/default-avatar.jpg";

const StaffDashboard = () => {
  const { profileData } = useUser();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({});
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Generate notifications based on assigned issues
  useEffect(() => {
    if (assignedIssues.length > 0) {
      const generatedNotifs = [
        {
          id: 1,
          text: `New task assigned: "${assignedIssues[0].title || "Untitled"}"`,
          time: "Just now",
          read: false,
          icon: "ri-task-line"
        },
        ...assignedIssues.slice(1, 3).map((issue, idx) => ({
          id: idx + 2,
          text: `Task update pending for: "${issue.title || "Untitled"}"`,
          time: "1 hour ago",
          read: false,
          icon: "ri-time-line"
        })),
        {
          id: 10,
          text: "Welcome to your Staff Dashboard!",
          time: "1 day ago",
          read: true,
          icon: "ri-dashboard-line"
        }
      ];
      setNotifications(generatedNotifs);
    } else {
      setNotifications([
        {
          id: 10,
          text: "Welcome to your Staff Dashboard!",
          time: "1 day ago",
          read: true,
          icon: "ri-dashboard-line"
        }
      ]);
    }
  }, [assignedIssues]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Close notifications dropdown on click outside
  useEffect(() => {
    const handleCloseNotif = (e) => {
      if (!e.target.closest(".notif-container")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleCloseNotif);
    return () => document.removeEventListener("mousedown", handleCloseNotif);
  }, []);

  const fetchAssigned = async () => {
    if (profileData?.id) {
      try {
        const data = await getAssignedIssues(profileData.id);
        setAssignedIssues(data);
        console.log("Issue Assigned to me : ", data);
      } catch (error) {
        console.error("Error fetching assigned issues:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchSummary = async () => {
    if (profileData?.id) {
      try {
        const data = await mySummary(profileData.id);
        setSummary(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }
  };

  useEffect(() => {
    fetchAssigned();
    fetchSummary();
  }, [profileData?.id]);

  const stats = [
    {
      name: "Assigned Issues",
      count: summary.total_assigned,
      description: "All assigned issues",
      color: "from-[#6366f1] to-[#8b5cf6]",
      color2: "bg-[#6366f1]",
    },
    {
      name: "Pending Issues",
      count: summary.pending_count,
      description: "Pending",
      color: "from-[#f59e0b] to-[#fbbf24]",
      color2: "bg-[#f59e0b]",
    },
    {
      name: "In Progress",
      count: summary.accepted_count,
      description: "Accepted & In Progress",
      color: "from-[#3b82f6] to-[#60a5fa]",
      color2: "bg-[#3b82f6]",
    },
    {
      name: "Completed",
      count: summary.completed_count,
      description: "Issues Fixed",
      color: "from-[#10b981] to-[#34d399]",
      color2: "bg-[#10b981]",
    },
  ];

  return (
    <>
      <StaffSideNav />
      <BottomNav />
      <div className="w-full pt-0 pb-20 md:pb-2 lg:p-4 lg:w-[calc(100vw-15vw)] overflow-x-auto">
        <div className="w-full mx-auto">
          {/* header */}
          <div className="w-full bg-linear-to-r from-[#7E70EB] to-[#5A50A6] p-4 sm:p-5 lg:p-6 rounded-b-4xl lg:rounded-2xl md:rounded-3xl text-white shadow-lg mb-4 md:mb-6 border border-white/10">
            <div className="flex items-center justify-between gap-4">
              {/* LEFT */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                  Your Dashboard
                </h1>

                <p className="text-violet-100 text-xs sm:text-sm md:text-base mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold">{profileData?.name || summary.staff_name || "staff"}</span>!
                </p>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {/* Notification Bell */}
                <div className="relative notif-container">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all relative cursor-pointer border border-white/10 hover:scale-105"
                  >
                    <i className="ri-notification-3-line text-lg sm:text-xl text-white"></i>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-[#7E70EB] animate-pulse"></span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 text-gray-800 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <span className="font-bold text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-indigo-600 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 text-xs transition-colors hover:bg-gray-50 flex gap-2 ${
                                notif.read ? "opacity-70" : "bg-indigo-50/30"
                              }`}
                            >
                              <div className="mt-0.5 text-indigo-500">
                                <i className={notif.icon + " text-base"}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 leading-snug">
                                  {notif.text}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center text-gray-400">
                            <i className="ri-notification-off-line text-2xl block mb-1"></i>
                            <p>No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pic */}
                <button
                  onClick={() => navigate("/profile")}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-white/20 hover:border-white/50 transition-all hover:scale-105 cursor-pointer shrink-0"
                >
                  <img
                    src={profileData?.avatar_url || defaultProfile}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full gap-2 flex flex-wrap justify-center bg-[#F3F1FF] p-4 rounded-2xl border border-indigo-50">
            {stats?.map((item, index) => (
              <IssueCard key={index} issue={item} />
            ))}
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm p-6 ">
            <div className="flex justify-between items-center mb-6"></div>

            {loading ? (
              <Loader />
            ) : assignedIssues?.length > 0 ? (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Recently Assigned</h2>

                  <a
                    href="/assigned-issues"
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    View All →
                  </a>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-border">
                  {assignedIssues.slice(0, 5).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 hover:bg-muted/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-card-foreground truncate">
                            {issue?.title || "Untitled Issue"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            #{issue.issue_id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <StatusBadge type="priority" value={issue?.priority || "low"} />
                        <StatusBadge type="status" value={issue?.assignment_status || "pending"} />
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/tasks/${issue.issue_id}`, {
                            state: issue,
                          })
                        }
                        className="w-full px-4 py-2 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-xs uppercase text-left">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Issue</th>
                        <th className="px-6 py-4 font-semibold">Priority</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {assignedIssues.slice(0, 5).map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-t border-border hover:bg-muted/40 transition-all duration-200"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium">
                              {issue?.title || "Untitled Issue"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{issue.issue_id}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge type="priority" value={issue?.priority || "low"} />
                          </td>

                          <td className="px-6 py-4">
                            <StatusBadge type="status" value={issue?.assignment_status || "pending"} />
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                navigate(`/tasks/${issue.issue_id}`, {
                                  state: issue,
                                })
                              }
                              className="inline-block px-4 py-1.5 text-xs font-bold text-white bg-[#6366f1] rounded-lg hover:bg-[#5445c9] transition shadow-md shadow-indigo-500/20 active:scale-95"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/30">
                <div className="text-4xl mb-2">📭</div>

                <p className="font-semibold text-muted-foreground">
                  No assigned issues
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;
