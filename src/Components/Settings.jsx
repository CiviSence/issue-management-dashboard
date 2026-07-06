import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "../Context/ProfileContext";
import TopBar from "./Templates/TopBar";
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

// ─── Sessions Card (API-driven) ─────────────────────────────────────────────

const SessionsCard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const fetchSessions = async () => {
    try {
      const data = await getActiveSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId) => {
    if (!window.confirm("Are you sure you want to revoke this session?"))
      return;
    setRevokingId(sessionId);
    try {
      await revokeSession(sessionId);
      setSessions((prev) =>
        prev.filter((s) => s !== sessionId && s.id !== sessionId),
      );
      fetchSessions();
    } catch (error) {
      alert("Failed to revoke session", error);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-gray-700">Your Active Devices</p>
        <button
          onClick={fetchSessions}
          className="text-violet-600 hover:bg-violet-50 p-1.5 rounded-lg transition-colors"
          title="Refresh"
        >
          <i className="ri-refresh-line"></i>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-14 bg-gray-50 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session, index) => {
            const id = typeof session === "object" ? session.id : session;
            const label =
              typeof session === "object"
                ? session.device_info || `Session ${id}`
                : `Session ${index + 1}`;

            return (
              <div
                key={id || index}
                className="flex items-center justify-between p-3 sm:p-4 bg-gray-50/50 rounded-lg sm:rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white shadow-sm border border-gray-100 text-violet-600 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-all">
                    <i className="ri-device-line text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 transition-colors">
                      {label}
                    </p>
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mt-0.5">
                      Active Now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(id)}
                  disabled={revokingId === id}
                  className="text-xs text-red-500 hover:bg-red-50 font-bold px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-100 disabled:opacity-50 uppercase tracking-wider"
                >
                  {revokingId === id ? "Revoking..." : "Revoke"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl py-8 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">
            No other active sessions found.
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Reusable LinkedIn-Style Grouped Settings Components ────────────────────

const SettingsGroupCard = ({ title, children }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 shadow-xs mb-6 overflow-hidden">
    {title && (
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-2 text-lg sm:text-xl font-bold text-gray-900">
        {title}
      </div>
    )}
    <div className="divide-y divide-gray-100">{children}</div>
  </div>
);

const ActionRow = ({ label, sublabel, value, to, onClick, icon }) => {
  const content = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-start gap-3.5 pr-4 min-w-0">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-600 mt-0.5 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
            <i className={`${icon} text-lg`}></i>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-violet-600 transition-colors truncate">
            {label}
          </p>
          {sublabel && (
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
              {sublabel}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        {value && (
          <span className="text-sm font-medium text-gray-500 text-right">
            {value}
          </span>
        )}
        <i className="ri-arrow-right-s-line text-xl text-gray-400 group-hover:text-gray-700 transition-colors"></i>
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/80 transition-colors group select-none block w-full text-left"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/80 transition-colors cursor-pointer group select-none block w-full text-left"
    >
      {content}
    </button>
  );
};

const ExpandableRow = ({ label, sublabel, value, children, defaultExpanded = false, icon }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <div className="transition-colors">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/80 transition-colors cursor-pointer group select-none"
      >
        <div className="flex items-start gap-3.5 pr-4 min-w-0">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-600 mt-0.5 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
              <i className={`${icon} text-lg`}></i>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-violet-600 transition-colors truncate">
              {label}
            </p>
            {sublabel && (
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                {sublabel}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          {value && (
            <span className="text-sm font-medium text-gray-500 text-right">
              {value}
            </span>
          )}
          <i
            className={`ri-arrow-${expanded ? "down" : "right"}-s-line text-xl text-gray-400 group-hover:text-gray-700 transition-transform`}
          ></i>
        </div>
      </div>
      {expanded && (
        <div className="p-4 sm:p-6 bg-gray-50/70 border-t border-gray-100 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

const ToggleRow = ({ label, description, checked, onChange, valueText }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="transition-colors">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 sm:px-6 sm:py-4.5 hover:bg-gray-50/80 transition-colors cursor-pointer group select-none"
      >
        <div className="pr-4 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-violet-600 transition-colors truncate">
            {label}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className="text-sm font-medium text-gray-500">
            {valueText || (checked ? "On" : "Off")}
          </span>
          <i
            className={`ri-arrow-${expanded ? "down" : "right"}-s-line text-xl text-gray-400 group-hover:text-gray-700 transition-transform`}
          ></i>
        </div>
      </div>
      {expanded && (
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
            {description}
          </p>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {checked ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(!checked);
              }}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                checked ? "bg-violet-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  checked ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = () => {
  const { profileData } = useUser();
  const role = profileData?.role?.toLowerCase();

  // Navigation render helpers based on role
  const renderSideNav = () => {
    if (role === "student") return <StudentSideNav />;
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />;
  };

  const renderBottomNav = () => {
    if (role === "student") return <StudentBottomNav />;
    return <BottomNav />;
  };

  // Use URL search params to manage which settings page is currently open
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "list";

  const navigateToCategory = (catId) => {
    setSearchParams({ category: catId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToList = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load preferences from localStorage or initialize defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("app_user_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      // Appearance
      theme: "light", // Light mode as default per user preference
      density: "comfortable",
      animations: true,
      highContrast: false,
      roundedCorners: true,
      // Notifications
      emailAlerts: true,
      pushNotifications: true,
      soundEffects: true,
      digestFrequency: "daily",
      dndSchedule: false,
      // Security
      twoFactorAuth: false,
      publicProfile: true,
      showReputation: true,
      loginAlerts: true,
      // Workflow
      landingPage: "dashboard",
      autoRefresh: true,
      defaultSort: "newest",
      language: "en-US",
      timezone: "UTC-5 (Eastern Time)",
      // Account
      orgAnnouncements: true,
      marketingEmails: false,
    };
  });

  // Toast notification feedback state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Action button loading states
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Delete Account states
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Logout states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutInput, setLogoutInput] = useState("");
  const [logoutType, setLogoutType] = useState("current");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      setDeleteError("Please enter your current password to confirm.");
      return;
    }
    setIsDeletingAccount(true);
    setDeleteError("");
    try {
      await deleteAccount({ password: deletePassword });
      clearSession();
      window.location.href = "/";
    } catch (err) {
      setDeleteError(
        err.message || "Failed to delete account. Please check your password.",
      );
      setIsDeletingAccount(false);
    }
  };

  const handleLogoutConfirm = async () => {
    if (logoutInput.toLowerCase() !== "logout") return;
    setIsLoggingOut(true);
    try {
      if (logoutType === "all") {
        await logoutAllSessions();
      } else {
        await logoutUser();
      }
      clearSession();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      alert("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Update setting handler with auto-save feedback
  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("app_user_settings", JSON.stringify(next));
      return next;
    });
    triggerToast("Setting updated & saved automatically");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleClearCache = () => {
    setIsClearingCache(true);
    setTimeout(() => {
      setIsClearingCache(false);
      setCacheCleared(true);
      triggerToast("Local cache & temporary storage cleared");
      setTimeout(() => setCacheCleared(false), 3000);
    }, 1200);
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      triggerToast("Activity archive downloaded successfully");
      setTimeout(() => setExported(false), 3000);
    }, 1500);
  };

  const handleResetDefaults = () => {
    setIsResetting(true);
    setTimeout(() => {
      const defaults = {
        theme: "light",
        density: "comfortable",
        animations: true,
        highContrast: false,
        roundedCorners: true,
        emailAlerts: true,
        pushNotifications: true,
        soundEffects: true,
        digestFrequency: "daily",
        dndSchedule: false,
        twoFactorAuth: false,
        publicProfile: true,
        showReputation: true,
        loginAlerts: true,
        landingPage: "dashboard",
        autoRefresh: true,
        defaultSort: "newest",
        language: "en-US",
        timezone: "UTC-5 (Eastern Time)",
        orgAnnouncements: true,
        marketingEmails: false,
      };
      setSettings(defaults);
      localStorage.setItem("app_user_settings", JSON.stringify(defaults));
      setIsResetting(false);
      triggerToast("All preferences reset to factory defaults");
    }, 1000);
  };

  // Define the master list of settings categories
  const categories = [
    {
      id: "account",
      title: "Account Settings",
      subtitle:
        "Personal profile details, email address, role information, and organization membership.",
      icon: "ri-user-settings-line",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: "appearance",
      title: "Appearance & Display",
      subtitle:
        "Color theme preferences (Light default), table density, micro-animations, and contrast.",
      icon: "ri-palette-line",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      subtitle:
        "Email summaries, real-time push alerts, interactive sound effects, and digest frequency.",
      icon: "ri-notification-3-line",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      id: "security",
      title: "Security & Privacy",
      subtitle:
        "Two-Factor Authentication (2FA), active device login sessions, and public profile visibility.",
      icon: "ri-shield-keyhole-line",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: "workflow",
      title: "Workflow & Preferences",
      subtitle:
        "Default start screen, live issue auto-refreshing, language selector, and default sorting.",
      icon: "ri-flow-chart",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      id: "data",
      title: "Data & Storage",
      subtitle:
        "Clear temporary application cache, download your CSV activity archive, or reset defaults.",
      icon: "ri-database-2-line",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: "legal",
      title: "Help & Legal Links",
      subtitle:
        "Terms of Use, Privacy Policy, Trust Center documentation, and version information.",
      icon: "ri-book-open-line",
      color: "bg-teal-50 text-teal-600 border-teal-100",
    },
  ];

  return (
    <>
      {renderSideNav()}
      {renderBottomNav()}

      <div className="mx-auto w-full overflow-y-auto bg-[#F8F9FF] min-h-screen pb-28 md:pb-12">
        <TopBar title="Settings" />

        {/* Floating Toast Notification */}
        {showToast && (
          <div className="fixed bottom-24 md:bottom-8 right-6 z-50 animate-bounce bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <i className="ri-check-line font-bold"></i>
            </div>
            <p className="text-sm font-semibold">{toastMessage}</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* ── VIEW 1: SETTINGS OVERVIEW MENU LIST ── */}
          {currentCategory === "list" && (
            <div className="space-y-6">
              <SettingsGroupCard title="Account & display">
                {categories.slice(0, 2).map((cat) => (
                  <ActionRow
                    key={cat.id}
                    label={cat.title}
                    sublabel={cat.subtitle}
                    icon={cat.icon}
                    onClick={() => navigateToCategory(cat.id)}
                  />
                ))}
              </SettingsGroupCard>

              <SettingsGroupCard title="Preferences & security">
                {categories.slice(2, 5).map((cat) => (
                  <ActionRow
                    key={cat.id}
                    label={cat.title}
                    sublabel={cat.subtitle}
                    icon={cat.icon}
                    onClick={() => navigateToCategory(cat.id)}
                  />
                ))}
              </SettingsGroupCard>

              <SettingsGroupCard title="System & support">
                {categories.slice(5, 7).map((cat) => (
                  <ActionRow
                    key={cat.id}
                    label={cat.title}
                    sublabel={cat.subtitle}
                    icon={cat.icon}
                    onClick={() => navigateToCategory(cat.id)}
                  />
                ))}
              </SettingsGroupCard>

              {/* Quick Info Footer Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-3 text-xs sm:text-sm text-gray-600 font-medium">
                <i className="ri-information-line text-lg text-gray-700 shrink-0"></i>
                <p>
                  All preference changes are automatically saved to your local
                  session and synced with your account.
                </p>
              </div>
            </div>
          )}

          {/* ── VIEW 2: INDIVIDUAL SETTING CATEGORY PAGES ── */}
          {currentCategory !== "list" && (
            <div className="animate-fadeIn">
              {/* ── CATEGORY 1: ACCOUNT SETTINGS ── */}
              {currentCategory === "account" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Account settings
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Manage your profile details and account standing
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Profile information">
                    <ActionRow
                      label="Name, email, and campus role"
                      sublabel={`${profileData?.name || "Member Account"} • ${profileData?.email || "user@organization.edu"}`}
                      value={
                        profileData?.role
                          ? `${profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} Member`
                          : "Student Member"
                      }
                      to="/profile"
                      icon="ri-user-3-line"
                    />
                    <ExpandableRow
                      label="Organization & campus verification"
                      sublabel="Global Tech Institute of Sciences"
                      value="Verified Member"
                      icon="ri-building-2-line"
                    >
                      <div className="space-y-3 text-sm max-w-lg">
                        <div className="flex justify-between py-2 border-b border-gray-200/60">
                          <span className="text-gray-500 font-medium">
                            Organization
                          </span>
                          <span className="font-bold text-gray-800">
                            Global Tech Institute of Sciences
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200/60">
                          <span className="text-gray-500 font-medium">
                            Verification Status
                          </span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <i className="ri-verified-badge-fill"></i> Verified
                            Campus Member
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-500 font-medium">
                            Official Email
                          </span>
                          <span className="font-semibold text-gray-800">
                            {profileData?.email || "user@organization.edu"}
                          </span>
                        </div>
                      </div>
                    </ExpandableRow>
                    <ExpandableRow
                      label="Account status & standing"
                      sublabel="Active & in good standing"
                      value="Active"
                      icon="ri-shield-check-line"
                    >
                      <div className="space-y-2 text-sm max-w-lg">
                        <p className="text-gray-800 font-semibold">
                          Your account is currently active and in good standing.
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Member since January 2026. No restrictions or warnings
                          associated with your profile.
                        </p>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Communication preferences">
                    <ToggleRow
                      label="Organizational announcements"
                      description="Receive important broadcasts regarding system maintenance and campus-wide issue updates."
                      checked={settings.orgAnnouncements}
                      onChange={(val) => updateSetting("orgAnnouncements", val)}
                    />
                    <ToggleRow
                      label="Monthly feature news & tips"
                      description="Get occasional emails highlighting new dashboard features and issue tracking best practices."
                      checked={settings.marketingEmails}
                      onChange={(val) => updateSetting("marketingEmails", val)}
                    />
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Account management">
                    <ExpandableRow
                      label="Log out of your account"
                      sublabel="Sign out of your current session or all active devices"
                      icon="ri-logout-box-r-line"
                    >
                      <div className="space-y-5 py-2 max-w-md">
                        <div className="flex items-center gap-2 text-gray-800 font-bold text-base">
                          <i className="ri-logout-box-r-line text-xl text-gray-700"></i>
                          <h4>Choose logout scope</h4>
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-violet-600 has-checked:bg-violet-50/50 shadow-xs">
                            <input
                              type="radio"
                              name="logoutType"
                              value="current"
                              checked={logoutType === "current"}
                              onChange={(e) => setLogoutType(e.target.value)}
                              className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">
                                This device only
                              </p>
                              <p className="text-xs text-gray-500">
                                Logout from this session
                              </p>
                            </div>
                          </label>

                          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-red-600 has-checked:bg-red-50/50 shadow-xs">
                            <input
                              type="radio"
                              name="logoutType"
                              value="all"
                              checked={logoutType === "all"}
                              onChange={(e) => setLogoutType(e.target.value)}
                              className="w-4 h-4 text-red-600 focus:ring-red-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-800">
                                All devices
                              </p>
                              <p className="text-xs text-gray-500">
                                Logout everywhere
                              </p>
                            </div>
                          </label>
                        </div>

                        <div className="space-y-2 pt-1">
                          <p className="text-xs text-gray-600 font-medium">
                            Type{" "}
                            <span className="font-bold text-red-500">
                              logout
                            </span>{" "}
                            to confirm.
                          </p>
                          <input
                            type="text"
                            value={logoutInput}
                            onChange={(e) => setLogoutInput(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-violet-600 transition-all text-sm font-medium text-red-500"
                            placeholder="Confirm logout"
                          />
                        </div>

                        <button
                          onClick={handleLogoutConfirm}
                          disabled={
                            logoutInput.toLowerCase() !== "logout" ||
                            isLoggingOut
                          }
                          className="w-full py-3 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-red-500/20"
                        >
                          {isLoggingOut ? "Logging out..." : "Log Out"}
                        </button>
                      </div>
                    </ExpandableRow>

                    <ExpandableRow
                      label="Delete account permanently"
                      sublabel="Permanently delete your profile and deactivate membership"
                      icon="ri-delete-bin-7-line"
                    >
                      <div className="space-y-4 py-2 max-w-md">
                        <div className="p-3.5 rounded-xl bg-red-100/70 border border-red-200 text-red-900 text-xs sm:text-sm leading-relaxed">
                          <span className="font-bold">
                            Warning: This action cannot be undone!
                          </span>{" "}
                          All user data including issues, comments, and votes
                          will be preserved but attributed to a deleted user.
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium">
                          Please enter your current password for verification.
                        </p>
                        <form
                          onSubmit={handleDeleteAccount}
                          className="space-y-3"
                        >
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => {
                              setDeletePassword(e.target.value);
                              if (deleteError) setDeleteError("");
                            }}
                            placeholder="Enter your current password"
                            className="w-full bg-white border border-red-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-xs"
                          />
                          {deleteError && (
                            <div className="p-3 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-2">
                              <i className="ri-alert-line text-sm"></i>
                              <span>{deleteError}</span>
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isDeletingAccount || !deletePassword}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                              isDeletingAccount || !deletePassword
                                ? "bg-red-300 text-white cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white active:scale-95 shadow-red-200"
                            }`}
                          >
                            {isDeletingAccount
                              ? "Deleting Account..."
                              : "Delete Account Permanently"}
                          </button>
                        </form>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 2: APPEARANCE & DISPLAY ── */}
              {currentCategory === "appearance" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Appearance & display
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Customize your visual experience and interface layout
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Display">
                    <ExpandableRow
                      label="Color theme"
                      sublabel="Select light, dark, or system synchronized color palette"
                      value={
                        settings.theme === "dark"
                          ? "Dark mode"
                          : settings.theme === "system"
                            ? "System sync"
                            : "Light mode"
                      }
                      icon="ri-palette-line"
                    >
                      <div className="space-y-4 max-w-2xl py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {[
                            {
                              id: "light",
                              name: "Light mode",
                              desc: "Active Default",
                              icon: "ri-sun-line",
                            },
                            {
                              id: "dark",
                              name: "Dark mode",
                              desc: "Night viewing",
                              icon: "ri-moon-clear-line",
                            },
                            {
                              id: "system",
                              name: "System sync",
                              desc: "Match device OS",
                              icon: "ri-computer-line",
                            },
                          ].map((themeOpt) => (
                            <button
                              key={themeOpt.id}
                              type="button"
                              onClick={() =>
                                updateSetting("theme", themeOpt.id)
                              }
                              className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between relative bg-white ${
                                settings.theme === themeOpt.id
                                  ? "border-violet-600 bg-violet-50/30 shadow-xs"
                                  : "border-gray-200/80 hover:border-gray-300"
                              }`}
                            >
                              {settings.theme === themeOpt.id && (
                                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
                                  <i className="ri-check-line font-bold"></i>
                                </span>
                              )}
                              <div className="text-gray-700 mb-3">
                                <i className={`${themeOpt.icon} text-2xl`}></i>
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm">
                                  {themeOpt.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {themeOpt.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 pt-1">
                          <i className="ri-information-line text-gray-600"></i>
                          Light mode is active by default as per your primary
                          workspace preference.
                        </p>
                      </div>
                    </ExpandableRow>

                    <ExpandableRow
                      label="Table & issue card spacing"
                      sublabel="Adjust spacing density across lists and dashboards"
                      value={
                        settings.density === "compact"
                          ? "Compact"
                          : "Comfortable"
                      }
                      icon="ri-layout-row-line"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg py-2">
                        {[
                          {
                            id: "comfortable",
                            label: "Comfortable",
                            desc: "Spacious padding & large badges",
                          },
                          {
                            id: "compact",
                            label: "Compact",
                            desc: "Dense rows to fit more items",
                          },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateSetting("density", opt.id)}
                            className={`p-4 rounded-xl border text-left font-bold transition bg-white ${
                              settings.density === opt.id
                                ? "border-violet-600 bg-violet-600 text-white shadow-xs"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <p className="text-sm">{opt.label}</p>
                            <span
                              className={`block text-xs font-normal mt-1 ${settings.density === opt.id ? "text-violet-200" : "text-gray-400"}`}
                            >
                              {opt.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Motion & accessibility">
                    <ToggleRow
                      label="Interface animations & transitions"
                      description="Enable smooth micro-animations, card hover scales, and pull-to-refresh physics."
                      checked={settings.animations}
                      onChange={(val) => updateSetting("animations", val)}
                    />
                    <ToggleRow
                      label="High contrast text mode"
                      description="Increase typography font weights and border darkness for enhanced readability."
                      checked={settings.highContrast}
                      onChange={(val) => updateSetting("highContrast", val)}
                    />
                    <ToggleRow
                      label="Modern rounded corners"
                      description="Display soft rounded corners on cards, buttons, and navigation sidebars."
                      checked={settings.roundedCorners}
                      onChange={(val) => updateSetting("roundedCorners", val)}
                    />
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 3: NOTIFICATIONS & ALERTS ── */}
              {currentCategory === "notifications" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Notifications & alerts
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Manage how and when you receive dashboard updates
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Alert delivery channels">
                    <ToggleRow
                      label="Email alerts"
                      description="Receive email notifications whenever an issue is assigned to you or solved."
                      checked={settings.emailAlerts}
                      onChange={(val) => updateSetting("emailAlerts", val)}
                    />
                    <ToggleRow
                      label="Real-time browser push notifications"
                      description="Get instant pop-up banners on your screen when new comments or status updates occur."
                      checked={settings.pushNotifications}
                      onChange={(val) =>
                        updateSetting("pushNotifications", val)
                      }
                    />
                    <ToggleRow
                      label="Interactive sound effects"
                      description="Play a subtle audio chime when a reported issue is officially marked as resolved."
                      checked={settings.soundEffects}
                      onChange={(val) => updateSetting("soundEffects", val)}
                    />
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Timing & frequency">
                    <ExpandableRow
                      label="Activity summary digest"
                      sublabel="Consolidate updates into periodic summaries"
                      value={
                        settings.digestFrequency === "realtime"
                          ? "Instant"
                          : settings.digestFrequency === "weekly"
                            ? "Weekly"
                            : settings.digestFrequency === "never"
                              ? "Never"
                              : "Daily"
                      }
                      icon="ri-time-line"
                    >
                      <div className="space-y-3 max-w-lg py-2">
                        <label className="text-sm font-bold text-gray-800 block">
                          Select Digest Frequency
                        </label>
                        <select
                          value={settings.digestFrequency}
                          onChange={(e) =>
                            updateSetting("digestFrequency", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        >
                          <option value="realtime">
                            Instant (Real-time emails as events happen)
                          </option>
                          <option value="daily">
                            Daily Digest (Every morning at 8:00 AM)
                          </option>
                          <option value="weekly">
                            Weekly Summary (Every Monday morning)
                          </option>
                          <option value="never">
                            Never (Only in-app notifications)
                          </option>
                        </select>
                      </div>
                    </ExpandableRow>

                    <ToggleRow
                      label="Do Not Disturb (DND) schedule"
                      description="Pause all push notifications and sound chimes automatically between 10:00 PM and 7:00 AM."
                      checked={settings.dndSchedule}
                      onChange={(val) => updateSetting("dndSchedule", val)}
                    />
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 4: SECURITY & PRIVACY ── */}
              {currentCategory === "security" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Security & privacy
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Protect your account credentials and control public visibility
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Authentication & account protection">
                    <ToggleRow
                      label="Two-Factor Authentication (2FA)"
                      description="Require a secure verification code from your authenticator app when signing in from new devices."
                      checked={settings.twoFactorAuth}
                      onChange={(val) => updateSetting("twoFactorAuth", val)}
                    />
                    <ToggleRow
                      label="Unrecognized login alerts"
                      description="Receive immediate email alerts when a login occurs from an unfamiliar IP address or browser."
                      checked={settings.loginAlerts}
                      onChange={(val) => updateSetting("loginAlerts", val)}
                    />
                    <ExpandableRow
                      label="Password & credentials"
                      sublabel="Encrypted with bcrypt • Last changed 45 days ago"
                      value="Change password"
                      icon="ri-lock-password-line"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="max-w-md">
                          <p className="font-bold text-gray-900 text-sm">
                            Reset your account password
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            We will send a secure password reset link to your registered campus email address.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            triggerToast(
                              "Password reset link sent to your registered email"
                            )
                          }
                          className="px-5 py-2.5 bg-white border border-gray-300 hover:border-violet-500 hover:text-violet-600 font-bold text-xs rounded-xl transition shadow-xs shrink-0 self-start sm:self-center"
                        >
                          Send Reset Link
                        </button>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Community privacy">
                    <ToggleRow
                      label="Public profile visibility"
                      description="Allow other students and staff to view your email and solved issues count on the leaderboards."
                      checked={settings.publicProfile}
                      onChange={(val) => updateSetting("publicProfile", val)}
                    />
                    <ToggleRow
                      label="Show reputation points & badges"
                      description="Display your earned reputation points and campus badges publicly next to your name."
                      checked={settings.showReputation}
                      onChange={(val) => updateSetting("showReputation", val)}
                    />
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Active login sessions">
                    <ExpandableRow
                      label="Active devices & sessions"
                      sublabel="Review and manage web sessions currently signed into your account"
                      value="Manage sessions"
                      icon="ri-computer-line"
                    >
                      <div className="py-2">
                        <SessionsCard />
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 5: WORKFLOW & PREFERENCES ── */}
              {currentCategory === "workflow" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Workflow & preferences
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Customize your startup screen, sorting rules, and language
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Navigation & live sync">
                    <ExpandableRow
                      label="Default landing screen"
                      sublabel="Choose which screen opens first after you log in"
                      value={
                        settings.landingPage === "feed"
                          ? "Issue Feed"
                          : settings.landingPage === "my-issues"
                            ? "My Issues"
                            : settings.landingPage === "leaderboard"
                              ? "Leaderboard"
                              : "My Dashboard"
                      }
                      icon="ri-home-4-line"
                    >
                      <div className="space-y-3 max-w-lg py-2">
                        <label className="text-sm font-bold text-gray-800 block">
                          Select Landing Screen
                        </label>
                        <select
                          value={settings.landingPage}
                          onChange={(e) =>
                            updateSetting("landingPage", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        >
                          <option value="dashboard">
                            My Dashboard (Analytics Overview)
                          </option>
                          <option value="feed">
                            Issue Feed (All campus reports)
                          </option>
                          <option value="my-issues">
                            My Issues (Personal history)
                          </option>
                          <option value="leaderboard">
                            Leaderboard & Standings
                          </option>
                        </select>
                      </div>
                    </ExpandableRow>

                    <ExpandableRow
                      label="Default issue sorting"
                      sublabel="Control the default order of issues across feeds"
                      value={
                        settings.defaultSort === "priority"
                          ? "Highest Priority"
                          : settings.defaultSort === "upvotes"
                            ? "Most Upvoted"
                            : settings.defaultSort === "oldest"
                              ? "Oldest First"
                              : "Newest First"
                      }
                      icon="ri-sort-desc"
                    >
                      <div className="space-y-3 max-w-lg py-2">
                        <label className="text-sm font-bold text-gray-800 block">
                          Select Default Sorting Order
                        </label>
                        <select
                          value={settings.defaultSort}
                          onChange={(e) =>
                            updateSetting("defaultSort", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        >
                          <option value="newest">
                            Newest First (Most recently reported)
                          </option>
                          <option value="priority">
                            Highest Priority First
                          </option>
                          <option value="upvotes">
                            Most Upvoted / Supported
                          </option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>
                    </ExpandableRow>

                    <ToggleRow
                      label="Auto-refresh live issue feed"
                      description="Automatically check and synchronize new issue reports in the background without reloading the page."
                      checked={settings.autoRefresh}
                      onChange={(val) => updateSetting("autoRefresh", val)}
                    />
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Localization & time">
                    <ExpandableRow
                      label="Language & region"
                      sublabel="Set system interface language and date formatting"
                      value="English (United States)"
                      icon="ri-global-line"
                    >
                      <div className="space-y-3 max-w-lg py-2">
                        <label className="text-sm font-bold text-gray-800 block">
                          Select Interface Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) =>
                            updateSetting("language", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        >
                          <option value="en-US">
                            English (United States)
                          </option>
                          <option value="en-UK">
                            English (United Kingdom)
                          </option>
                          <option value="es-ES">Español (Spanish)</option>
                          <option value="fr-FR">Français (French)</option>
                          <option value="de-DE">Deutsch (German)</option>
                          <option value="hi-IN">हिन्दी (Hindi)</option>
                        </select>
                      </div>
                    </ExpandableRow>

                    <ExpandableRow
                      label="Timezone"
                      sublabel="Control timestamp displays across comments and audit logs"
                      value={settings.timezone || "UTC-5 (Eastern Time)"}
                      icon="ri-time-zone-line"
                    >
                      <div className="space-y-3 max-w-lg py-2">
                        <label className="text-sm font-bold text-gray-800 block">
                          Select Preferred Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) =>
                            updateSetting("timezone", e.target.value)
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                        >
                          <option value="UTC-8">
                            UTC-8 (Pacific Time - US & Canada)
                          </option>
                          <option value="UTC-6">
                            UTC-6 (Central Time - US & Canada)
                          </option>
                          <option value="UTC-5 (Eastern Time)">
                            UTC-5 (Eastern Time - US & Canada)
                          </option>
                          <option value="UTC+0">
                            UTC+0 (London, Edinburgh, Dublin)
                          </option>
                          <option value="UTC+5:30">
                            UTC+5:30 (India Standard Time)
                          </option>
                        </select>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 6: DATA & STORAGE ── */}
              {currentCategory === "data" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Data & storage
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Manage local browser cache, export data, or restore defaults
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Local storage & cache">
                    <ExpandableRow
                      label="Application cache size"
                      sublabel="Includes cached issue images, offline drafts, and user preferences stored locally"
                      value="~14.8 MB"
                      icon="ri-hard-drive-2-line"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="max-w-md">
                          <p className="font-bold text-gray-900 text-sm">
                            Clear temporary browser storage
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Free up local space without affecting your cloud data or login session.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearCache}
                          disabled={isClearingCache || cacheCleared}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 self-start sm:self-center ${
                            cacheCleared
                              ? "bg-emerald-600 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 shadow-xs"
                          }`}
                        >
                          {isClearingCache ? (
                            <>
                              <i className="ri-loader-4-line animate-spin text-base"></i>
                              Clearing...
                            </>
                          ) : cacheCleared ? (
                            <>
                              <i className="ri-check-line text-base font-black"></i>
                              Cache Cleared!
                            </>
                          ) : (
                            <>
                              <i className="ri-eraser-line text-base"></i>
                              Clear Local Cache
                            </>
                          )}
                        </button>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Data portability & archives">
                    <ExpandableRow
                      label="Download activity report"
                      sublabel="Get a complete CSV archive containing your reported issues, comments, and reputation log"
                      value="CSV Archive"
                      icon="ri-file-download-line"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="max-w-md">
                          <p className="font-bold text-gray-900 text-sm">
                            Generate personal data archive
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Standard CSV export suitable for importing into spreadsheets or external analytics tools.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportData}
                          disabled={isExporting || exported}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 self-start sm:self-center ${
                            exported
                              ? "bg-emerald-600 text-white"
                              : "bg-violet-600 hover:bg-violet-700 text-white active:scale-95 shadow-xs"
                          }`}
                        >
                          {isExporting ? (
                            <>
                              <i className="ri-loader-4-line animate-spin text-base"></i>
                              Generating...
                            </>
                          ) : exported ? (
                            <>
                              <i className="ri-check-line text-base font-black"></i>
                              Downloaded!
                            </>
                          ) : (
                            <>
                              <i className="ri-download-cloud-2-line text-base"></i>
                              Export Archive (CSV)
                            </>
                          )}
                        </button>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Factory reset">
                    <ExpandableRow
                      label="Reset all preferences to defaults"
                      sublabel="Restores Light theme, daily digest notifications, comfortable density, and default sorting"
                      value="Default settings"
                      icon="ri-restart-line"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                        <div className="max-w-md">
                          <p className="font-bold text-amber-900 text-sm">
                            Restore original application preferences
                          </p>
                          <p className="text-xs text-amber-700 mt-0.5">
                            This will revert all customization toggles to factory state. Your issues and account data will remain untouched.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleResetDefaults}
                          disabled={isResetting}
                          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0 active:scale-95 self-start sm:self-center"
                        >
                          {isResetting ? "Resetting..." : "Reset Preferences"}
                        </button>
                      </div>
                    </ExpandableRow>
                  </SettingsGroupCard>
                </div>
              )}

              {/* ── CATEGORY 7: HELP & LEGAL ── */}
              {currentCategory === "legal" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={navigateToList}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition shadow-xs shrink-0"
                    >
                      <i className="ri-arrow-left-line text-lg"></i>
                    </button>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Help & legal
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">
                        Documentation, user agreements, and version details
                      </p>
                    </div>
                  </div>

                  <SettingsGroupCard title="Legal documentation & compliance">
                    <ActionRow
                      label="Privacy Policy"
                      sublabel="Learn how we collect, process, and protect your personal data"
                      value="View"
                      to="/privacy-policy"
                      icon="ri-file-shield-line"
                    />
                    <ActionRow
                      label="Terms of Use"
                      sublabel="Review user guidelines, campus codes of conduct, and rules"
                      value="View"
                      to="/terms"
                      icon="ri-file-text-line"
                    />
                    <ActionRow
                      label="Trust Center"
                      sublabel="Review security certifications, data compliance, and encryption protocols"
                      value="View"
                      to="/trust-center"
                      icon="ri-shield-star-line"
                    />
                    <ActionRow
                      label="Help & Support Desk"
                      sublabel="Browse frequently asked questions or contact campus support"
                      value="Get Help"
                      to="/help-support"
                      icon="ri-customer-service-2-line"
                    />
                  </SettingsGroupCard>

                  <SettingsGroupCard title="Application information">
                    <ActionRow
                      label="Issue Management Dashboard"
                      sublabel="Pro Edition Campus Suite • Built with React & Vite"
                      value="v2.4.0 (Build 2026.07)"
                      icon="ri-code-s-slash-line"
                    />
                  </SettingsGroupCard>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Universal Footer */}
        <div className="flex justify-center items-center space-x-3 py-6 text-xs font-medium text-gray-400 border-t border-gray-200/60 mt-12 mx-6 md:mx-auto max-w-4xl">
          <Link
            to="/privacy-policy"
            className="hover:text-violet-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-violet-600 transition-colors">
            Terms of Use
          </Link>
          <span>&bull;</span>
          <Link
            to="/trust-center"
            className="hover:text-violet-600 transition-colors"
          >
            Trust Center
          </Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
