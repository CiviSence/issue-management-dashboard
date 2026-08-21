import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "../Context/ProfileContext";
import { useTheme } from "../Context/ThemeContext.js";
import TopBar from "./Templates/TopBar";
import SEO from "./common/SEO";
import AdminSideNav from "./Dashboards/Admin/AdminSideNav";
import StudentSideNav from "./Dashboards/Student/StudentSideNav";
import StaffSideNav from "./Dashboards/Staff/StaffSideNav";
import BottomNav from "./Templates/BottomNav";
import StudentBottomNav from "./Dashboards/Student/StudentBottomNav";
import {
  deleteAccount,
  getActiveSessions,
  logoutAllSessions,
  logoutUser,
  revokeSession,
} from "../Utils/auth-api";
import { clearSession } from "../Utils/auth-utils";
import {
  getMyOrganization,
  updateOrgSettings,
  getRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
  leaveOrganization,
} from "../Utils/organization-api";
import OrgChangeRequestModal from "./common/OrgChangeRequestModal";
import ChangePasswordModal from "./common/ChangePasswordModal";
import OrgInviteModal from "./common/OrgInviteModal";

// ─── Active Sessions Manager ────────────────────────────────────────────────
const SessionsCard = ({ triggerToast }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await getActiveSessions();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = async (sessionId) => {
    if (!window.confirm("Are you sure you want to revoke this session?")) return;
    setRevokingId(sessionId);
    try {
      await revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s !== sessionId && s.id !== sessionId));
      if (triggerToast) triggerToast("Session revoked successfully");
      fetchSessions();
    } catch (error) {
      alert("Failed to revoke session: " + error.message);
    } finally {
      setRevokingId(null);
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("This will log you out from all devices except this one. Continue?")) return;
    try {
      await logoutAllSessions();
      if (triggerToast) triggerToast("Logged out of all other sessions");
      fetchSessions();
    } catch (err) {
      alert("Failed to logout all sessions: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-dark-text">Active Devices & Sessions</h4>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Devices currently authenticated with your account</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSessions}
            className="p-1.5 text-gray-500 hover:text-violet-600 dark:text-dark-text-secondary dark:hover:text-violet-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-elevated transition"
            title="Refresh sessions"
          >
            <i className="ri-refresh-line text-base"></i>
          </button>
          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleLogoutAll}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg transition"
            >
              Revoke All Others
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-dark-elevated animate-pulse rounded-xl" />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-2.5">
          {sessions.map((session, index) => {
            const id = typeof session === "object" ? session.id : session;
            const label = typeof session === "object" ? session.device_info || `Device #${index + 1}` : `Session #${index + 1}`;
            const isCurrent = index === 0;

            return (
              <div
                key={id || index}
                className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-dark-elevated/60 rounded-xl border border-gray-100 dark:border-dark-border/60 hover:border-violet-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white dark:bg-dark-card shadow-2xs border border-gray-100 dark:border-dark-border/60 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center">
                    <i className="ri-device-line text-base"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 dark:text-dark-text truncate max-w-[200px] sm:max-w-xs">{label}</p>
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mt-0.5">
                      {isCurrent ? "Current Session" : "Active"}
                    </p>
                  </div>
                </div>
                {!isCurrent && (
                  <button
                    type="button"
                    onClick={() => handleRevoke(id)}
                    disabled={revokingId === id}
                    className="text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 font-bold px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
                  >
                    {revokingId === id ? "Revoking..." : "Revoke"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 dark:bg-dark-elevated rounded-xl text-center border border-dashed border-gray-200 dark:border-dark-border text-xs text-gray-500 dark:text-dark-text-secondary">
          No other active device sessions found.
        </div>
      )}
    </div>
  );
};

// ─── Settings Card Wrapper ──────────────────────────────────────────────────
const Card = ({ title, description, children, action }) => (
  <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-2xs p-5 sm:p-6 mb-6">
    {(title || action) && (
      <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-gray-100 dark:border-dark-border/60">
        <div>
          {title && <h3 className="text-base font-bold text-gray-900 dark:text-dark-text">{title}</h3>}
          {description && <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="space-y-4">{children}</div>
  </div>
);

// ─── Switch / Toggle Component ──────────────────────────────────────────────
const Switch = ({ checked, onChange, label, description, disabled = false }) => (
  <div className="flex items-center justify-between py-2.5 gap-4">
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-dark-text">{label}</p>
      {description && <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
        checked ? "bg-violet-600" : "bg-gray-200 dark:bg-dark-border"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

// ─── Main Settings Component ────────────────────────────────────────────────
const Settings = () => {
  const { profileData } = useUser();
  const { theme, setTheme } = useTheme();
  const role = profileData?.role?.toLowerCase();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Organization state & handlers
  const [orgDetails, setOrgDetails] = useState(null);
  const [roleRequests, setRoleRequests] = useState([]);
  const [loadingRoleRequests, setLoadingRoleRequests] = useState(false);
  const [updatingFeedSetting, setUpdatingFeedSetting] = useState(false);
  const [updatingAISetting, setUpdatingAISetting] = useState(false);

  // Local preferences state
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("app_user_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      density: "comfortable",
      animations: true,
      emailAlerts: true,
      pushNotifications: true,
      soundEffects: true,
      digestFrequency: "daily",
      twoFactorAuth: false,
      publicProfile: true,
      autoRefresh: true,
      defaultSort: "newest",
    };
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const updatePreference = (key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("app_user_settings", JSON.stringify(next));
      return next;
    });
    triggerToast("Preference saved automatically");
  };

  // Fetch Organization details
  const fetchOrg = useCallback(async () => {
    try {
      const data = await getMyOrganization();
      setOrgDetails(data);
    } catch (e) {
      console.error("Failed to fetch org details", e);
    }
  }, []);

  useEffect(() => {
    fetchOrg();
  }, [fetchOrg]);

  const activeOrgItem = useMemo(() => {
    if (!orgDetails) return null;
    return Array.isArray(orgDetails)
      ? orgDetails.find((item) => item.status === "approved" || item.is_active || item.organization?.is_active) || orgDetails[0]
      : orgDetails;
  }, [orgDetails]);

  const activeOrg = activeOrgItem?.organization || activeOrgItem;

  const isOrgAdmin =
    role === "admin" ||
    role === "official" ||
    activeOrgItem?.role === "admin" ||
    activeOrgItem?.role === "owner" ||
    activeOrg?.role === "admin";

  // Fetch pending role elevation requests for org admin
  const fetchOrgRoleRequests = useCallback(async () => {
    if (!isOrgAdmin || !activeOrg?.id) return;
    setLoadingRoleRequests(true);
    try {
      const data = await getRoleRequests(activeOrg.id);
      setRoleRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch role requests", e);
    } finally {
      setLoadingRoleRequests(false);
    }
  }, [isOrgAdmin, activeOrg?.id]);

  useEffect(() => {
    if (activeTab === "organization") {
      fetchOrgRoleRequests();
    }
  }, [activeTab, fetchOrgRoleRequests]);

  // Organization policy toggles
  const handleToggleFeedRequirement = async () => {
    if (!activeOrg?.id) return;
    const nextVal = !activeOrg.require_verified_feed;
    setUpdatingFeedSetting(true);
    try {
      await updateOrgSettings(activeOrg.id, { require_verified_feed: nextVal });
      fetchOrg();
      triggerToast(`Feed verification set to ${nextVal ? "Required (Verified Members Only)" : "Open Feed"}`);
    } catch (err) {
      alert(err.message || "Failed to update feed verification setting");
    } finally {
      setUpdatingFeedSetting(false);
    }
  };

  const handleToggleAIVerification = async () => {
    if (!activeOrg?.id) return;
    const currentVal = activeOrg.ai_verification_enabled !== false;
    const nextVal = !currentVal;
    setUpdatingAISetting(true);
    try {
      await updateOrgSettings(activeOrg.id, { ai_verification_enabled: nextVal });
      fetchOrg();
      triggerToast(`AI Verification set to ${nextVal ? "Enabled (AI Auto-Approve)" : "Disabled (Manual Admin Review)"}`);
    } catch (err) {
      alert(err.message || "Failed to update AI verification setting");
    } finally {
      setUpdatingAISetting(false);
    }
  };

  const handleApproveRole = async (reqId) => {
    if (!activeOrg?.id) return;
    try {
      await approveRoleRequest(activeOrg.id, reqId);
      triggerToast("Role request approved");
      fetchOrgRoleRequests();
    } catch (err) {
      alert(err.message || "Failed to approve role request");
    }
  };

  const handleRejectRole = async (reqId) => {
    const reason = window.prompt("Enter optional rejection reason:");
    if (reason === null) return;
    try {
      await rejectRoleRequest(activeOrg.id, reqId, reason);
      triggerToast("Role request rejected");
      fetchOrgRoleRequests();
    } catch (err) {
      alert(err.message || "Failed to reject role request");
    }
  };

  const handleLeaveOrg = async () => {
    if (!activeOrg?.id) return;
    if (!window.confirm(`Are you sure you want to leave ${activeOrg.name}?`)) return;
    try {
      await leaveOrganization(activeOrg.id);
      triggerToast("You have left the organization");
      fetchOrg();
    } catch (err) {
      alert(err.message || "Failed to leave organization");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError("Please enter your current password to confirm deletion.");
      return;
    }
    if (!window.confirm("WARNING: This will permanently delete your account and cannot be undone. Are you sure?")) return;
    setIsDeletingAccount(true);
    setDeleteError("");
    try {
      await deleteAccount({ password: deletePassword });
      clearSession();
      window.location.href = "/";
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account. Please verify your password.");
      setIsDeletingAccount(false);
    }
  };

  // Nav helpers
  const renderSideNav = () => {
    if (role === "student") return <StudentSideNav />;
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />;
  };

  const renderBottomNav = () => {
    if (role === "student") return <StudentBottomNav />;
    return <BottomNav />;
  };

  const TABS = [
    { id: "general", label: "General & Profile", icon: "ri-user-settings-line" },
    { id: "organization", label: "Organization & Policy", icon: "ri-building-2-line", badge: isOrgAdmin ? "Admin" : null },
    { id: "appearance", label: "Appearance & Theme", icon: "ri-palette-line" },
    { id: "notifications", label: "Notifications & Alerts", icon: "ri-notification-3-line" },
    { id: "security", label: "Security & Sessions", icon: "ri-shield-keyhole-line" },
    { id: "data", label: "Data & Storage", icon: "ri-database-2-line" },
    { id: "danger", label: "Danger Zone", icon: "ri-error-warning-line", danger: true },
  ];

  const filteredTabs = useMemo(() => {
    if (!searchQuery) return TABS;
    const q = searchQuery.toLowerCase();
    return TABS.filter(
      (t) => t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      <SEO
        title="Settings - CiviSence"
        description="Configure account settings, organization policies, appearance, notification alerts, and security options."
        keywords="settings, organization settings, verification policy, security"
      />
      {renderSideNav()}
      {renderBottomNav()}

      <div className="mx-auto w-full overflow-y-auto bg-[#F8F9FF] dark:bg-dark-bg min-h-screen pb-24 md:pb-12">
        <TopBar title="Settings" />

        {/* Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-8 right-6 z-50 animate-bounce bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <i className="ri-check-line text-sm"></i>
            </div>
            <p className="text-xs font-semibold">{toastMessage}</p>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* Header & Instant Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-dark-text tracking-tight">
                Account & Workspace Settings
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-secondary mt-0.5">
                Manage your personal identity, campus governance policies, notifications, and security.
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-secondary text-sm"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search settings..."
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-xs sm:text-sm text-gray-800 dark:text-dark-text focus:outline-none focus:border-violet-500 shadow-2xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
                >
                  <i className="ri-close-circle-fill text-sm"></i>
                </button>
              )}
            </div>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Column: Tab Navigation */}
            <div className="lg:col-span-1 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-2.5 shadow-2xs space-y-1 sticky top-6">
              {filteredTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSearchParams({ tab: tab.id })}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                      isActive
                        ? "bg-violet-600 text-white shadow-sm"
                        : tab.danger
                        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        : "text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-elevated"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <i className={`${tab.icon} text-base`}></i>
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Tab Content */}
            <div className="lg:col-span-3">
              {/* ── TAB 1: GENERAL & PROFILE ── */}
              {activeTab === "general" && (
                <div className="animate-fadeIn">
                  <Card
                    title="Profile Information"
                    description="Personal and identity details associated with your CiviSence account"
                    action={
                      <Link
                        to="/profile"
                        className="px-3 py-1.5 bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 hover:bg-violet-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <i className="ri-edit-line"></i> Edit Profile
                      </Link>
                    }
                  >
                    <div className="flex items-center gap-4 p-4 bg-gray-50/70 dark:bg-dark-elevated/60 rounded-xl border border-gray-100 dark:border-dark-border/60">
                      <img
                        src={profileData?.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={profileData?.name || "Avatar"}
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-dark-border shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-black text-gray-900 dark:text-dark-text truncate">
                          {profileData?.name || "Anonymous Member"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary truncate">
                          {profileData?.email || "user@organization.edu"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold rounded-md uppercase">
                            {profileData?.role || "Citizen"}
                          </span>
                          {profileData?.department && (
                            <span className="text-[10px] text-gray-500 dark:text-dark-text-secondary font-medium truncate">
                              • {profileData.department}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 bg-gray-50/50 dark:bg-dark-elevated/40 rounded-xl border border-gray-100 dark:border-dark-border/60">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase block">
                          Phone Number
                        </span>
                        <span className="text-xs font-semibold text-gray-800 dark:text-dark-text mt-0.5 block">
                          {profileData?.phone_number || "Not provided"}
                        </span>
                      </div>
                      <div className="p-3.5 bg-gray-50/50 dark:bg-dark-elevated/40 rounded-xl border border-gray-100 dark:border-dark-border/60">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase block">
                          Registration / Student ID
                        </span>
                        <span className="text-xs font-semibold text-gray-800 dark:text-dark-text mt-0.5 block">
                          {profileData?.registration_number || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ── TAB 2: ORGANIZATION & POLICY ── */}
              {activeTab === "organization" && (
                <div className="animate-fadeIn space-y-6">
                  {/* Org Overview */}
                  <Card
                    title="Active Organization"
                    description="Your current campus or administrative organization context"
                    action={
                      <button
                        onClick={() => setIsOrgModalOpen(true)}
                        className="px-3 py-1.5 bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 hover:bg-violet-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <i className="ri-arrow-left-right-line"></i> Switch / Join Org
                      </button>
                    }
                  >
                    {activeOrg ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-linear-to-r from-violet-50/80 to-purple-50/80 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-100 dark:border-violet-800/30 rounded-xl flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                            <i className="ri-building-2-fill"></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-black text-gray-900 dark:text-dark-text truncate">
                                {activeOrg.name}
                              </h4>
                              {activeOrg.code && (
                                <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold rounded-md uppercase">
                                  {activeOrg.code}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5 truncate">
                              {activeOrg.description || "Campus organization portal"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-gray-100 dark:border-dark-border/60">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase block">
                              Slug Identifier
                            </span>
                            <span className="text-xs font-mono text-gray-800 dark:text-dark-text truncate block mt-0.5">
                              {activeOrg.slug || "—"}
                            </span>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-gray-100 dark:border-dark-border/60">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase block">
                              Official Email
                            </span>
                            <span className="text-xs font-semibold text-gray-800 dark:text-dark-text truncate block mt-0.5">
                              {activeOrg.official_email || "—"}
                            </span>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-dark-elevated rounded-xl border border-gray-100 dark:border-dark-border/60">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase block">
                              Plan & Standing
                            </span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider truncate block mt-0.5">
                              {activeOrg.plan_type || "Basic"} • {activeOrg.status || "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-gray-500">No active organization found.</div>
                    )}
                  </Card>

                  {/* Governance & Policy Settings */}
                  <Card
                    title="Governance Policies"
                    description="Configure document verification methods, feed privacy, and membership invitations"
                    action={
                      isOrgAdmin && (
                        <button
                          type="button"
                          onClick={() => setIsInviteModalOpen(true)}
                          className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <i className="ri-user-add-line"></i> Generate Invite Link
                        </button>
                      )
                    }
                  >
                    <div className="divide-y divide-gray-100 dark:divide-dark-border/60">
                      {/* AI Verification Policy */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-dark-text">
                              AI Document Verification
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                activeOrg?.ai_verification_enabled !== false
                                  ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
                                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                              }`}
                            >
                              {activeOrg?.ai_verification_enabled !== false ? "AI Auto-Approve" : "Manual Admin Review"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">
                            {activeOrg?.ai_verification_enabled !== false
                              ? "Valid student ID uploads are processed and approved instantly by Gemini Vision AI."
                              : "AI auto-approval is disabled. All document submissions are held for manual admin review."}
                          </p>
                        </div>
                        {isOrgAdmin ? (
                          <button
                            type="button"
                            disabled={updatingAISetting || !activeOrg?.id}
                            onClick={handleToggleAIVerification}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 border ${
                              activeOrg?.ai_verification_enabled !== false
                                ? "bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                                : "bg-gray-100 text-gray-700 dark:bg-dark-elevated dark:text-dark-text border-gray-200 dark:border-dark-border hover:bg-gray-200"
                            }`}
                          >
                            {updatingAISetting && <i className="ri-loader-4-line animate-spin mr-1"></i>}
                            {activeOrg?.ai_verification_enabled !== false ? "Disable AI" : "Enable AI"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Admin Only</span>
                        )}
                      </div>

                      {/* Feed Verification Policy */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-dark-text">
                              Feed Verification Gate
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                activeOrg?.require_verified_feed
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                  : "bg-gray-50 text-gray-600 border-gray-200 dark:bg-dark-elevated dark:text-dark-text-secondary dark:border-dark-border"
                              }`}
                            >
                              {activeOrg?.require_verified_feed ? "Verified Only" : "Open Access"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">
                            {activeOrg?.require_verified_feed
                              ? "Only authenticated, verified campus members can view and interact with the feed."
                              : "All joined members can view campus issue discussions."}
                          </p>
                        </div>
                        {isOrgAdmin ? (
                          <button
                            type="button"
                            disabled={updatingFeedSetting || !activeOrg?.id}
                            onClick={handleToggleFeedRequirement}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 border ${
                              activeOrg?.require_verified_feed
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600"
                                : "bg-gray-100 text-gray-700 dark:bg-dark-elevated dark:text-dark-text border-gray-200 dark:border-dark-border hover:bg-gray-200"
                            }`}
                          >
                            {updatingFeedSetting && <i className="ri-loader-4-line animate-spin mr-1"></i>}
                            {activeOrg?.require_verified_feed ? "Make Open" : "Require Verified"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">Admin Only</span>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Role Elevation Requests (For Admins) */}
                  {isOrgAdmin && (
                    <Card
                      title="Pending Role Requests"
                      description="Review student and staff elevation requests for this organization"
                    >
                      {loadingRoleRequests ? (
                        <div className="h-16 bg-gray-50 dark:bg-dark-elevated animate-pulse rounded-xl" />
                      ) : roleRequests.length > 0 ? (
                        <div className="space-y-3">
                          {roleRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-3.5 bg-gray-50/70 dark:bg-dark-elevated/60 rounded-xl border border-gray-100 dark:border-dark-border/60 flex items-center justify-between gap-3"
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-800 dark:text-dark-text">
                                  User ID: {req.user_id.slice(0, 8)}...
                                </p>
                                <p className="text-[11px] text-violet-600 dark:text-violet-400 font-bold uppercase mt-0.5">
                                  Requested Role: {req.requested_role}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleApproveRole(req.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectRole(req.id)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400 rounded-lg text-xs font-bold transition"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-gray-50 dark:bg-dark-elevated rounded-xl text-center border border-dashed border-gray-200 dark:border-dark-border text-xs text-gray-500 dark:text-dark-text-secondary">
                          No pending role elevation requests.
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              )}

              {/* ── TAB 3: APPEARANCE & THEME ── */}
              {activeTab === "appearance" && (
                <div className="animate-fadeIn space-y-6">
                  <Card
                    title="Theme & Visual Appearance"
                    description="Choose your preferred color theme and interface density"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
                          theme === "light"
                            ? "bg-violet-50/60 dark:bg-violet-950/20 border-violet-500 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20"
                            : "bg-gray-50 dark:bg-dark-elevated border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-gray-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
                          <i className="ri-sun-line"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Light Mode</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">Crisp, high-contrast daylight aesthetic</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-xl border text-left transition flex items-center gap-3.5 ${
                          theme === "dark"
                            ? "bg-violet-50/60 dark:bg-violet-950/20 border-violet-500 text-violet-900 dark:text-violet-200 ring-2 ring-violet-500/20"
                            : "bg-gray-50 dark:bg-dark-elevated border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-gray-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-900 text-indigo-200 flex items-center justify-center text-lg shrink-0">
                          <i className="ri-moon-clear-line"></i>
                        </div>
                        <div>
                          <p className="text-sm font-bold">Dark Mode</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-0.5">Sleek, low-light OLED optimized palette</p>
                        </div>
                      </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-dark-border/60">
                      <Switch
                        checked={preferences.animations}
                        onChange={(v) => updatePreference("animations", v)}
                        label="Interface Micro-Animations"
                        description="Enable smooth transitions and interactive micro-animations across all dashboards"
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* ── TAB 4: NOTIFICATIONS & ALERTS ── */}
              {activeTab === "notifications" && (
                <div className="animate-fadeIn space-y-6">
                  <Card
                    title="Notification Channels"
                    description="Control how and when you receive critical campus updates"
                  >
                    <div className="divide-y divide-gray-100 dark:divide-dark-border/60">
                      <Switch
                        checked={preferences.pushNotifications}
                        onChange={(v) => updatePreference("pushNotifications", v)}
                        label="Push Notifications"
                        description="Receive real-time alerts when issue status changes or urgent campus notifications are broadcasted"
                      />
                      <Switch
                        checked={preferences.emailAlerts}
                        onChange={(v) => updatePreference("emailAlerts", v)}
                        label="Email Digests & Alerts"
                        description="Send daily summaries and urgent resolution notes to your registered email address"
                      />
                      <Switch
                        checked={preferences.soundEffects}
                        onChange={(v) => updatePreference("soundEffects", v)}
                        label="Interactive Sound Effects"
                        description="Play subtle audio cues upon actions, status approvals, and notifications"
                      />
                    </div>
                  </Card>
                </div>
              )}

              {/* ── TAB 5: SECURITY & SESSIONS ── */}
              {activeTab === "security" && (
                <div className="animate-fadeIn space-y-6">
                  <Card
                    title="Account Authentication"
                    description="Manage your login credentials and security credentials"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50/70 dark:bg-dark-elevated/60 rounded-xl border border-gray-100 dark:border-dark-border/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center text-lg">
                          <i className="ri-key-line"></i>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-dark-text">Account Password</h4>
                          <p className="text-[11px] text-gray-500 dark:text-dark-text-secondary">Last updated securely via SHA-256 / Bcrypt</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Change Password
                      </button>
                    </div>
                  </Card>

                  <Card>
                    <SessionsCard triggerToast={triggerToast} />
                  </Card>
                </div>
              )}

              {/* ── TAB 6: DATA & STORAGE ── */}
              {activeTab === "data" && (
                <div className="animate-fadeIn space-y-6">
                  <Card
                    title="Data Management & Local Cache"
                    description="Manage locally stored application state and export your activity"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/70 dark:bg-dark-elevated/60 rounded-xl border border-gray-100 dark:border-dark-border/60">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-dark-text">Clear Temporary Storage</p>
                          <p className="text-xs text-gray-500 dark:text-dark-text-secondary">Wipe client cache, pending draft keys, and temporary tokens</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem("app_user_settings");
                            triggerToast("Local storage cache reset");
                          }}
                          className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-dark-elevated dark:hover:bg-dark-border text-gray-700 dark:text-dark-text rounded-xl text-xs font-bold transition"
                        >
                          Clear Cache
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ── TAB 7: DANGER ZONE ── */}
              {activeTab === "danger" && (
                <div className="animate-fadeIn space-y-6">
                  <Card
                    title="Danger Zone"
                    description="Irreversible actions regarding your account and organization memberships"
                  >
                    <div className="space-y-4">
                      {/* Leave Organization */}
                      {activeOrg && (
                        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">Leave {activeOrg.name}</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Revoke your membership and unbind your role from this campus organization</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleLeaveOrg}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shrink-0"
                          >
                            Leave Org
                          </button>
                        </div>
                      )}

                      {/* Delete Account Form */}
                      <form onSubmit={handleDeleteAccount} className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-red-900 dark:text-red-300">Permanently Delete Account</p>
                          <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                            Once deleted, all personal records, vouch scores, and activity history will be erased immediately.
                          </p>
                        </div>
                        {deleteError && <p className="text-xs font-bold text-red-600">{deleteError}</p>}
                        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                          <input
                            type="password"
                            required
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="Enter password to confirm"
                            className="w-full sm:w-64 px-3.5 py-2 bg-white dark:bg-dark-card border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-gray-800 dark:text-dark-text focus:outline-none focus:border-red-500"
                          />
                          <button
                            type="submit"
                            disabled={isDeletingAccount}
                            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 shrink-0"
                          >
                            {isDeletingAccount ? "Deleting..." : "Delete Account"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Modals */}
        <OrgChangeRequestModal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} />
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSuccess={(msg) => triggerToast(msg)}
        />
        <OrgInviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          orgName={activeOrg?.name}
          orgId={activeOrg?.id}
        />
      </div>
    </>
  );
};

export default Settings;
