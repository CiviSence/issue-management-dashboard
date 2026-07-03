import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useUser } from "../Context/ProfileContext";
import TopBar from "./Templates/TopBar";
import AdminSideNav from "./Dashboards/Admin/AdminSideNav";
import StudentSideNav from "./Dashboards/Student/StudentSideNav";
import StaffSideNav from "./Dashboards/Staff/StaffSideNav";
import BottomNav from "./Templates/BottomNav";
import StudentBottomNav from "./Dashboards/Student/StudentBottomNav";
import { deleteAccount } from "../Utils/auth-api";
import { clearSession } from "../Utils/auth-utils";

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
        err.message || "Failed to delete account. Please check your password."
      );
      setIsDeletingAccount(false);
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

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ label, description, icon, iconColor, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-violet-200/60 transition-all group">
      <div className="flex items-start gap-3.5 pr-4">
        <div className={`p-2.5 rounded-xl ${iconColor || "bg-violet-100 text-violet-600"} shrink-0 mt-0.5 transition-transform group-hover:scale-110`}>
          <i className={`${icon} text-lg`}></i>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm sm:text-base">{label}</p>
          {description && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">{description}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
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
  );

  // Define the master list of settings categories
  const categories = [
    {
      id: "account",
      title: "Account Settings",
      subtitle: "Personal profile details, email address, role information, and organization membership.",
      icon: "ri-user-settings-line",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: "appearance",
      title: "Appearance & Display",
      subtitle: "Color theme preferences (Light default), table density, micro-animations, and contrast.",
      icon: "ri-palette-line",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      subtitle: "Email summaries, real-time push alerts, interactive sound effects, and digest frequency.",
      icon: "ri-notification-3-line",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      id: "security",
      title: "Security & Privacy",
      subtitle: "Two-Factor Authentication (2FA), active device login sessions, and public profile visibility.",
      icon: "ri-shield-keyhole-line",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      id: "workflow",
      title: "Workflow & Preferences",
      subtitle: "Default start screen, live issue auto-refreshing, language selector, and default sorting.",
      icon: "ri-flow-chart",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      id: "data",
      title: "Data & Storage",
      subtitle: "Clear temporary application cache, download your CSV activity archive, or reset defaults.",
      icon: "ri-database-2-line",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: "legal",
      title: "Help & Legal Links",
      subtitle: "Terms of Use, Privacy Policy, Trust Center documentation, and version information.",
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

        <div>
          {/* ── VIEW 1: SETTINGS OVERVIEW MENU LIST ── */}
          {currentCategory === "list" && (
            <div className="space-y-6">
              {/* Clickable Settings List */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden divide-y divide-gray-100">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => navigateToCategory(cat.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-violet-50/40 transition-all group"
                  >
                    <div className="flex items-center gap-4 sm:gap-5 pr-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs transition-transform group-hover:scale-110 ${cat.color}`}>
                        <i className={`${cat.icon} text-2xl`}></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-violet-600 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 leading-relaxed">
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-violet-100 flex items-center justify-center text-gray-400 group-hover:text-violet-600 shrink-0 transition-all">
                      <i className="ri-arrow-right-s-line text-2xl group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Info Footer Card */}
              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <i className="ri-information-line text-xl text-violet-600"></i>
                  <p className="text-xs sm:text-sm text-violet-900 font-medium">
                    All preference changes are automatically saved to your local session and synced with your account.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── VIEW 2: INDIVIDUAL SETTING CATEGORY PAGES ── */}
          {currentCategory !== "list" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Back Navigation Bar */}
              <div className="flex items-center justify-between">
                
                
              </div>
              {/* ── CATEGORY 1: ACCOUNT SETTINGS ── */}
              {currentCategory === "account" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                  <button
                  type="button"
                  onClick={navigateToList}
                  className="inline-flex  text-gray-700 hover:bg-violet-50 hover:text-violet-600  font-bold text-sm transition active:scale-95"
                >
                  <i className="ri-arrow-left-line text-lg"></i>
                  
                </button>
                    Personal Information & Membership
                  </h3>

                  {/* Profile Overview Card */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-violet-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                        {profileData?.name ? profileData.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{profileData?.name || "Member Account"}</h4>
                        <p className="text-sm text-gray-500">{profileData?.email || "user@organization.edu"}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-violet-100 text-violet-700 text-xs font-bold capitalize">
                          {profileData?.role || "Student"} Member
                        </span>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition text-center shadow-xs"
                    >
                      Edit Profile Details
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase">Organization / Campus</p>
                      <p className="text-sm font-bold text-gray-800">Global Tech Institute of Sciences</p>
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                        <i className="ri-verified-badge-fill"></i> Verified Campus Member
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase">Account Status</p>
                      <p className="text-sm font-bold text-gray-800">Active & In Good Standing</p>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        Member since January 2026
                      </p>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Communication Preferences
                  </h3>

                  <ToggleSwitch
                    label="Organizational Announcements"
                    description="Receive important broadcasts regarding system maintenance and campus-wide issue updates."
                    icon="ri-megaphone-line"
                    iconColor="bg-blue-100 text-blue-600"
                    checked={settings.orgAnnouncements}
                    onChange={(val) => updateSetting("orgAnnouncements", val)}
                  />

                  <ToggleSwitch
                    label="Monthly Feature News & Tips"
                    description="Get occasional emails highlighting new dashboard features and issue tracking best practices."
                    icon="ri-mail-star-line"
                    iconColor="bg-purple-100 text-purple-600"
                    checked={settings.marketingEmails}
                    onChange={(val) => updateSetting("marketingEmails", val)}
                  />

                  {/* Danger Zone: Permanently Delete Account */}
                  <div className="mt-8 p-6 rounded-2xl border border-red-200 bg-red-50/40 space-y-4">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
                      <i className="ri-error-warning-fill text-xl text-red-600"></i>
                      <h4>Delete Account</h4>
                    </div>

                    <div className="p-4 rounded-xl bg-red-100/60 border border-red-200 text-red-800 text-xs sm:text-sm leading-relaxed">
                      <span className="font-bold">Warning: This action cannot be undone!</span> All user data including issues, comments, and votes will be preserved but attributed to a deleted user.
                    </div>

                    <p className="text-xs sm:text-sm text-red-700 font-medium">
                      Delete user account permanently. Please enter your current password for verification.
                    </p>

                    <form onSubmit={handleDeleteAccount} className="space-y-3 max-w-md pt-1">
                      <div>
                        <label className="text-xs font-bold text-red-800 uppercase block mb-1">
                          Current Password (for verification)
                        </label>
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => {
                            setDeletePassword(e.target.value);
                            if (deleteError) setDeleteError("");
                          }}
                          placeholder="Enter your current password"
                          className="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-xs"
                        />
                      </div>

                      {deleteError && (
                        <div className="p-3 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-2">
                          <i className="ri-alert-line text-sm"></i>
                          <span>{deleteError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isDeletingAccount || !deletePassword}
                        className={`px-5 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                          isDeletingAccount || !deletePassword
                            ? "bg-red-300 text-white cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white active:scale-95 shadow-red-200"
                        }`}
                      >
                        {isDeletingAccount ? (
                          <>
                            <i className="ri-loader-4-line animate-spin text-lg"></i>
                            Deleting Account...
                          </>
                        ) : (
                          <>
                            <i className="ri-delete-bin-7-line text-lg"></i>
                            Delete Account Permanently
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* ── CATEGORY 2: APPEARANCE & DISPLAY ── */}
              {currentCategory === "appearance" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Color Theme & Visual Style
                  </h3>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-800 block">Select Color Theme</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: "light", name: "Light Mode", desc: "Active Default", icon: "ri-sun-line", color: "bg-amber-100 text-amber-600" },
                        { id: "dark", name: "Dark Mode", desc: "Night viewing", icon: "ri-moon-clear-line", color: "bg-slate-800 text-slate-200" },
                        { id: "system", name: "System Sync", desc: "Match device OS", icon: "ri-computer-line", color: "bg-blue-100 text-blue-600" },
                      ].map((themeOpt) => (
                        <button
                          key={themeOpt.id}
                          type="button"
                          onClick={() => updateSetting("theme", themeOpt.id)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between relative ${
                            settings.theme === themeOpt.id
                              ? "border-violet-600 bg-violet-50/40 shadow-sm"
                              : "border-gray-100 hover:border-gray-200 bg-gray-50/30"
                          }`}
                        >
                          {settings.theme === themeOpt.id && (
                            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
                              <i className="ri-check-line font-bold"></i>
                            </span>
                          )}
                          <div className={`w-10 h-10 rounded-xl ${themeOpt.color} flex items-center justify-center mb-3 shadow-xs`}>
                            <i className={`${themeOpt.icon} text-xl`}></i>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-base">{themeOpt.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{themeOpt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-violet-600 font-medium flex items-center gap-1.5 pt-1">
                      <i className="ri-information-line"></i>
                      Light mode is active by default as per your primary workspace preference.
                    </p>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Layout Density & Geometry
                  </h3>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-800 block">Table & Issue Card Spacing</label>
                    <div className="grid grid-cols-2 gap-4 max-w-lg">
                      {[
                        { id: "comfortable", label: "Comfortable", desc: "Spacious padding & large badges" },
                        { id: "compact", label: "Compact", desc: "Dense rows to fit more items" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateSetting("density", opt.id)}
                          className={`p-4 rounded-xl border text-left font-bold transition ${
                            settings.density === opt.id
                              ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <p className="text-sm">{opt.label}</p>
                          <span className={`block text-xs font-normal mt-1 ${settings.density === opt.id ? "text-violet-200" : "text-gray-400"}`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Motion & Accessibility
                  </h3>

                  <ToggleSwitch
                    label="Interface Animations & Transitions"
                    description="Enable smooth micro-animations, card hover scales, and pull-to-refresh physics."
                    icon="ri-magic-line"
                    iconColor="bg-pink-100 text-pink-600"
                    checked={settings.animations}
                    onChange={(val) => updateSetting("animations", val)}
                  />

                  <ToggleSwitch
                    label="High Contrast Text Mode"
                    description="Increase typography font weights and border darkness for enhanced readability."
                    icon="ri-contrast-drop-line"
                    iconColor="bg-slate-100 text-slate-700"
                    checked={settings.highContrast}
                    onChange={(val) => updateSetting("highContrast", val)}
                  />

                  <ToggleSwitch
                    label="Modern Rounded Corners"
                    description="Display soft rounded corners on cards, buttons, and navigation sidebars."
                    icon="ri-shape-line"
                    iconColor="bg-teal-100 text-teal-600"
                    checked={settings.roundedCorners}
                    onChange={(val) => updateSetting("roundedCorners", val)}
                  />
                </div>
              )}

              {/* ── CATEGORY 3: NOTIFICATIONS & ALERTS ── */}
              {currentCategory === "notifications" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Alert Delivery Channels
                  </h3>

                  <ToggleSwitch
                    label="Email Alerts"
                    description="Receive email notifications whenever an issue is assigned to you or solved."
                    icon="ri-mail-send-line"
                    iconColor="bg-blue-100 text-blue-600"
                    checked={settings.emailAlerts}
                    onChange={(val) => updateSetting("emailAlerts", val)}
                  />

                  <ToggleSwitch
                    label="Real-time Browser Push Notifications"
                    description="Get instant pop-up banners on your screen when new comments or status updates occur."
                    icon="ri-broadcast-line"
                    iconColor="bg-emerald-100 text-emerald-600"
                    checked={settings.pushNotifications}
                    onChange={(val) => updateSetting("pushNotifications", val)}
                  />

                  <ToggleSwitch
                    label="Interactive Sound Effects"
                    description="Play a subtle audio chime when a reported issue is officially marked as resolved."
                    icon="ri-volume-up-line"
                    iconColor="bg-violet-100 text-violet-600"
                    checked={settings.soundEffects}
                    onChange={(val) => updateSetting("soundEffects", val)}
                  />

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Timing & Frequency
                  </h3>

                  <div className="space-y-2 max-w-lg">
                    <label className="text-sm font-bold text-gray-800 block">Activity Summary Digest</label>
                    <select
                      value={settings.digestFrequency}
                      onChange={(e) => updateSetting("digestFrequency", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                    >
                      <option value="realtime">Instant (Notify me immediately)</option>
                      <option value="daily">Daily Digest (Delivered every morning at 8:00 AM)</option>
                      <option value="weekly">Weekly Summary (Delivered on Monday mornings)</option>
                      <option value="never">Never send summary digests</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    label="Do Not Disturb (DND) Schedule"
                    description="Silence all audio chimes and push banners during evenings (6:00 PM - 8:00 AM) and weekends."
                    icon="ri-moon-line"
                    iconColor="bg-indigo-100 text-indigo-600"
                    checked={settings.dndSchedule}
                    onChange={(val) => updateSetting("dndSchedule", val)}
                  />
                </div>
              )}

              {/* ── CATEGORY 4: SECURITY & PRIVACY ── */}
              {currentCategory === "security" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Authentication & Account Protection
                  </h3>

                  <ToggleSwitch
                    label="Two-Factor Authentication (2FA)"
                    description="Require a secondary verification code via email or authenticator app when signing in."
                    icon="ri-key-2-line"
                    iconColor="bg-red-100 text-red-600"
                    checked={settings.twoFactorAuth}
                    onChange={(val) => updateSetting("twoFactorAuth", val)}
                  />

                  <ToggleSwitch
                    label="Unrecognized Login Alerts"
                    description="Send an instant email alert if your account is accessed from a new IP address or device."
                    icon="ri-alarm-warning-line"
                    iconColor="bg-amber-100 text-amber-600"
                    checked={settings.loginAlerts}
                    onChange={(val) => updateSetting("loginAlerts", val)}
                  />

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                        <i className="ri-lock-password-line text-2xl"></i>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">Password & Credentials</p>
                        <p className="text-xs text-gray-500">Last changed 45 days ago • Encrypted with bcrypt</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerToast("Password reset link sent to your registered email")}
                      className="px-4 py-2.5 bg-white border border-gray-300 hover:border-violet-500 hover:text-violet-600 font-bold text-xs rounded-xl transition shadow-xs"
                    >
                      Change Password
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Community Privacy
                  </h3>

                  <ToggleSwitch
                    label="Public Profile Visibility"
                    description="Allow other students and staff to view your email and solved issues count on the leaderboards."
                    icon="ri-eye-line"
                    iconColor="bg-teal-100 text-teal-600"
                    checked={settings.publicProfile}
                    onChange={(val) => updateSetting("publicProfile", val)}
                  />

                  <ToggleSwitch
                    label="Show Reputation Points & Badges"
                    description="Display your earned reputation points and campus badges publicly next to your name."
                    icon="ri-award-line"
                    iconColor="bg-purple-100 text-purple-600"
                    checked={settings.showReputation}
                    onChange={(val) => updateSetting("showReputation", val)}
                  />

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Active Login Sessions
                  </h3>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <i className="ri-computer-line text-xl text-emerald-600"></i>
                        <div>
                          <p className="font-bold text-sm text-gray-900">Windows PC • Chrome Browser</p>
                          <p className="text-xs text-emerald-600 font-medium">Current Active Session • IP: 192.168.1.45</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        Online Now
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CATEGORY 5: WORKFLOW & PREFERENCES ── */}
              {currentCategory === "workflow" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Navigation & Live Sync
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 block">Default Landing Screen</label>
                      <select
                        value={settings.landingPage}
                        onChange={(e) => updateSetting("landingPage", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                      >
                        <option value="dashboard">My Dashboard (Analytics Overview)</option>
                        <option value="feed">Issue Feed (All campus reports)</option>
                        <option value="my-issues">My Issues (Personal history)</option>
                        <option value="leaderboard">Leaderboard & Standings</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 block">Default Issue Sorting</label>
                      <select
                        value={settings.defaultSort}
                        onChange={(e) => updateSetting("defaultSort", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                      >
                        <option value="newest">Newest First (Most recently reported)</option>
                        <option value="priority">Highest Priority First</option>
                        <option value="upvotes">Most Upvoted / Supported</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  <ToggleSwitch
                    label="Auto-Refresh Live Issue Feed"
                    description="Automatically check and synchronize new issue reports in the background without reloading the page."
                    icon="ri-refresh-line"
                    iconColor="bg-cyan-100 text-cyan-600"
                    checked={settings.autoRefresh}
                    onChange={(val) => updateSetting("autoRefresh", val)}
                  />

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Localization & Time
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 block">Language & Region</label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting("language", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                      >
                        <option value="en-US">English (United States)</option>
                        <option value="en-UK">English (United Kingdom)</option>
                        <option value="es-ES">Español (Spanish)</option>
                        <option value="fr-FR">Français (French)</option>
                        <option value="de-DE">Deutsch (German)</option>
                        <option value="hi-IN">हिन्दी (Hindi)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-800 block">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting("timezone", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition"
                      >
                        <option value="UTC-8">UTC-8 (Pacific Time - US & Canada)</option>
                        <option value="UTC-6">UTC-6 (Central Time - US & Canada)</option>
                        <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time - US & Canada)</option>
                        <option value="UTC+0">UTC+0 (London, Edinburgh, Dublin)</option>
                        <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CATEGORY 6: DATA & STORAGE ── */}
              {currentCategory === "data" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Local Device Storage & Cache
                  </h3>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <i className="ri-hard-drive-2-line text-violet-600 text-lg"></i>
                        Application Cache Size: ~14.8 MB
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Includes cached issue images, offline drafts, and user preferences stored locally.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearCache}
                      disabled={isClearingCache || cacheCleared}
                      className={`px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
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

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Data Portability & Archives
                  </h3>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                        <i className="ri-file-download-line text-violet-600 text-lg"></i>
                        Download Activity Report
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Get a complete CSV or JSON file containing your reported issues, comments, and reputation log.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportData}
                      disabled={isExporting || exported}
                      className={`px-5 py-3 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 ${
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

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Factory Reset
                  </h3>

                  <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-amber-900 text-base">Reset All Preferences to Defaults</h4>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Restores Light theme, daily digest notifications, comfortable density, and default sorting.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      disabled={isResetting}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-xs shrink-0 active:scale-95"
                    >
                      {isResetting ? "Resetting..." : "Reset Preferences"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── CATEGORY 7: HELP & LEGAL ── */}
              {currentCategory === "legal" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">
                    Legal Documentation & Compliance
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/privacy-policy"
                      className="p-5 rounded-2xl border border-gray-200/80 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                          <i className="ri-file-shield-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-violet-600 transition-colors">Privacy Policy</h4>
                          <p className="text-xs text-gray-500 mt-0.5">How we handle your data</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-up-line text-xl text-gray-400 group-hover:text-violet-600 transition-colors"></i>
                    </Link>

                    <Link
                      to="/terms"
                      className="p-5 rounded-2xl border border-gray-200/80 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <i className="ri-file-text-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">Terms of Use</h4>
                          <p className="text-xs text-gray-500 mt-0.5">User guidelines & rules</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-up-line text-xl text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                    </Link>

                    <Link
                      to="/trust-center"
                      className="p-5 rounded-2xl border border-gray-200/80 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <i className="ri-shield-star-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-emerald-600 transition-colors">Trust Center</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Security & ISO compliance</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-up-line text-xl text-gray-400 group-hover:text-emerald-600 transition-colors"></i>
                    </Link>

                    <Link
                      to="/help-support"
                      className="p-5 rounded-2xl border border-gray-200/80 hover:border-violet-300 hover:bg-violet-50/30 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <i className="ri-customer-service-2-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-amber-600 transition-colors">Help & Support</h4>
                          <p className="text-xs text-gray-500 mt-0.5">FAQs & contact desk</p>
                        </div>
                      </div>
                      <i className="ri-arrow-right-up-line text-xl text-gray-400 group-hover:text-amber-600 transition-colors"></i>
                    </Link>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3 pt-4">
                    Application Information
                  </h3>

                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200/70 flex items-center justify-between text-xs sm:text-sm text-gray-600 font-medium">
                    <span>Issue Management Dashboard (Pro Edition)</span>
                    <span className="font-bold text-violet-600">v2.4.0 (Build 2026.07)</span>
                  </div>
                </div>
              )}

              {/* Bottom Back Button inside category view */}
              <div className="pt-4 flex justify-start">
                <button
                  type="button"
                  onClick={navigateToList}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 font-bold text-sm shadow-xs transition active:scale-95"
                >
                  <i className="ri-arrow-left-line text-lg"></i>
                  Return to Settings Menu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Universal Footer */}
        <div className="flex justify-center items-center space-x-3 py-6 text-xs font-medium text-gray-400 border-t border-gray-200/60 mt-12 mx-6 md:mx-auto max-w-4xl">
          <Link to="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-violet-600 transition-colors">Terms of Use</Link>
          <span>&bull;</span>
          <Link to="/trust-center" className="hover:text-violet-600 transition-colors">Trust Center</Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
