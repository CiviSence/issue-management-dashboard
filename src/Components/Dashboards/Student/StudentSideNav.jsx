import { useState, useRef, useEffect } from "react";
import { getMyIssues } from "../../../Utils/issuesStudent";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../Context/ProfileContext";
import { clearSession } from "../../../Utils/auth-utils";
import {
    logoutUser as logoutUserApi,
    logoutAllSessions,
} from "../../../Utils/auth-api";
import defaultPfpFemale from "../../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../../assets/default-pfp/default-pfp-male.svg";
import logoImg from "../../../assets/logo/logowhite.png";

const getDefaultAvatar = (gender) => {
    const g = gender?.toLowerCase();
    return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};

// sidebar links  config
const NAV_ITEMS = [
    { to: "/feed", icon: "ri-rss-line", iconActive: "ri-rss-fill", label: "Issue Feed" },
    { to: "/dashboard", icon: "ri-dashboard-line", iconActive: "ri-dashboard-fill", label: "My Dashboard" },
    { to: "/my-issues", icon: "ri-file-list-3-line", iconActive: "ri-file-list-3-fill", label: "My Issues" },
    { to: "/trust-center", icon: "ri-shield-check-line", iconActive: "ri-shield-check-fill", label: "Trust Center" },
    { to: "/help-support", icon: "ri-customer-service-2-line", iconActive: "ri-customer-service-2-fill", label: "Help & Support" },
];

// Individual menu link
const NavItem = ({ to, icon, iconActive, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
       ${isActive
                ? "bg-white text-violet-600 font-semibold shadow-sm"
                : "text-violet-100 hover:bg-violet-400/60 hover:text-white"
            }`
        }
    >
        {({ isActive }) => (
            <>
                <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all
            ${isActive ? "bg-violet-100" : "bg-violet-400/30 group-hover:bg-violet-400/50"}`}
                >
                    <i className={`${isActive ? (iconActive || icon) : icon} text-lg`} />
                </span>
                <span className="hidden lg:block text-sm font-medium truncate">{label}</span>
            </>
        )}
    </NavLink>
);

// Profile popup shown on click
const ProfilePopup = ({ profileData, onLogout, onClose }) => {
    const navigate = useNavigate();
    const [reportCount, setReportCount] = useState(0);

    useEffect(() => {
        if (profileData?.id) {
            getMyIssues(profileData.id)
                .then((issues) => setReportCount(issues.length))
                .catch(() => { });
        }
    }, [profileData]);

    const items = [
        {
            icon: "ri-user-3-line",
            label: "View Profile",
            action: () => { navigate("/profile"); onClose(); },
        },
        {
            icon: "ri-file-list-3-line",
            label: "My Issues",
            action: () => { navigate("/my-issues"); onClose(); },
        },
        {
            icon: "ri-settings-3-line",
            label: "Settings",
            action: () => { navigate("/profile"); onClose(); },
        },
    ];

    return (
        <div className="absolute bottom-[calc(100%+8px)] left-0 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100">
            {/* Profile hero */}
            <div className="bg-linear-to-br from-violet-500 to-purple-600 px-5 py-5">
                <div className="flex items-center gap-4">
                    {/* Square avatar */}
                    <div className="w-14 h-14 rounded-xl border-2 border-white/40 overflow-hidden shrink-0 shadow-lg">
                        <img
                            src={profileData?.avatar_url || getDefaultAvatar(profileData?.gender)}
                            alt={profileData?.name}
                            onError={(e) => { e.target.src = getDefaultAvatar(profileData?.gender); }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-base leading-tight truncate">
                            {profileData?.name || "Student"}
                        </p>
                        <p className="text-violet-200 text-xs mt-0.5 truncate">
                            {profileData?.email || ""}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-[10px] font-semibold rounded-full capitalize tracking-wide">
                            {profileData?.role || "student"}
                        </span>
                    </div>
                </div>

                {/* Extra details */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {profileData?.department && (
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-violet-200 uppercase tracking-wide">Department</p>
                            <p className="text-xs text-white font-medium truncate">{profileData.department}</p>
                        </div>
                    )}
                    {(profileData?.student_id || profileData?.roll_number || profileData?.registration_number) && (
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-violet-200 uppercase tracking-wide">Reg. No.</p>
                            <p className="text-xs text-white font-medium truncate">
                                {profileData.registration_number || profileData.student_id || profileData.roll_number}
                            </p>
                        </div>
                    )}
                    <div className="bg-white/10 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-violet-200 uppercase tracking-wide">Residence</p>
                        <p className="text-xs text-white font-medium truncate">
                            {profileData?.is_hosteler ? (profileData.hostel_name || "Hosteler") : "Day Scholar"}
                        </p>
                    </div>
                    {profileData?.is_hosteler && profileData?.room_number && (
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                            <p className="text-[10px] text-violet-200 uppercase tracking-wide">Room</p>
                            <p className="text-xs text-white font-medium truncate">{profileData.room_number}</p>
                        </div>
                    )}
                </div>
                {/* Gender + Role capsules */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {profileData?.gender && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 text-white text-[11px] font-medium rounded-full capitalize">
                            <i className={`${profileData.gender.toLowerCase() === 'female' ? 'ri-women-line' :
                                profileData.gender.toLowerCase() === 'male' ? 'ri-men-line' : 'ri-user-line'
                                } text-xs`} />
                            {profileData.gender}
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 text-white text-[11px] font-medium rounded-full capitalize">
                        <i className="ri-shield-user-line text-xs" />
                        {profileData?.role || "student"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 text-white text-[11px] font-medium rounded-full">
                        <i className="ri-file-list-3-line text-xs" />
                        {reportCount} Reports
                    </span>
                </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
                {items.map(({ icon, label, action }) => (
                    <button
                        key={label}
                        onClick={action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all text-left"
                    >
                        <i className={`${icon} text-base w-5 text-center`} />
                        {label}
                    </button>
                ))}
            </div>

            <div className="h-px bg-gray-100 mx-3" />

            {/* Logout */}
            <div className="p-2">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                    <i className="ri-logout-box-r-line text-base w-5 text-center" />
                    Log out
                </button>
            </div>
        </div>
    );
};

// Logout confirmation
const LogoutModal = ({ onClose }) => {
    const [input, setInput] = useState("");
    const [type, setType] = useState("current");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (input.toLowerCase() !== "logout") return;
        setLoading(true);
        try {
            if (type === "all") await logoutAllSessions();
            else await logoutUserApi();
        } catch (e) {
            console.error(e);
        } finally {
            clearSession();
            window.location.href = "/";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-100">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-logout-box-r-line text-2xl text-red-500" />
                </div>
                <h3 className="text-center font-bold text-gray-900 text-lg mb-1">Confirm Logout</h3>
                <p className="text-center text-sm text-gray-500 mb-5">Choose which sessions to end</p>

                <div className="space-y-2 mb-5">
                    {[
                        { val: "current", label: "This device only", sub: "Logout from current session", accent: "violet" },
                        { val: "all", label: "All devices", sub: "Logout from all active sessions", accent: "red" },
                    ].map(({ val, label, sub, accent }) => (
                        <label
                            key={val}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                ${type === val
                                    ? accent === "red" ? "border-red-400 bg-red-50" : "border-violet-400 bg-violet-50"
                                    : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <input
                                type="radio"
                                value={val}
                                checked={type === val}
                                onChange={() => setType(val)}
                                className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                ${type === val
                                    ? accent === "red" ? "border-red-500" : "border-violet-500"
                                    : "border-gray-300"}`}
                            >
                                {type === val && (
                                    <div className={`w-2 h-2 rounded-full ${accent === "red" ? "bg-red-500" : "bg-violet-500"}`} />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{label}</p>
                                <p className="text-xs text-gray-400">{sub}</p>
                            </div>
                        </label>
                    ))}
                </div>

                <p className="text-xs text-gray-500 text-center mb-2">
                    Type <span className="font-bold text-red-500">logout</span> to confirm
                </p>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="logout"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-center text-sm font-medium text-red-500 focus:outline-none focus:border-red-400 transition mb-4"
                />

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={input.toLowerCase() !== "logout" || loading}
                        className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-40 transition shadow-lg shadow-red-200"
                    >
                        {loading ? "Logging out…" : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sidebar component
const StudentSideNav = () => {
    const { profileData } = useUser();
    const [showPopup, setShowPopup] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const popupRef = useRef(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShowPopup(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const initials = profileData?.name
        ? profileData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "??";

    return (
        <aside className="bg-violet-500 hidden md:flex flex-col justify-between w-20 lg:w-[17vw] shrink-0 h-screen z-40 p-3 lg:p-5 text-white relative">
            {/* Top: Logo + Nav */}
            <div className="flex flex-col items-center lg:items-start w-full">
                {/* Logo / Brand */}
                <div className="mb-6 px-1 w-full">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 overflow-hidden p-1">
                            <img src={logoImg} alt="CSM Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-bold text-white leading-tight">CSM</p>
                            <p className="text-[10px] text-violet-200 leading-tight">Issue Dashboard</p>
                        </div>
                    </Link>
                </div>

                {/* Section label */}
                <p className="hidden lg:block text-[10px] font-semibold text-violet-300 uppercase tracking-widest mb-2 px-1">
                    Navigation
                </p>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 w-full">
                    {NAV_ITEMS.map((item) => (
                        <NavItem key={item.to} {...item} />
                    ))}
                </nav>


            </div>

            {/* Legal Links Footer */}
            <div className="hidden lg:flex px-2 mb-4 space-x-3 text-[10px] font-medium text-violet-300">
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>&bull;</span>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            </div>

            {/* Profile Card */}
            <div className="relative" ref={popupRef}>
                {/* Popup */}
                {showPopup && (
                    <ProfilePopup
                        profileData={profileData}
                        onClose={() => setShowPopup(false)}
                        onLogout={() => {
                            setShowPopup(false);
                            setShowLogoutModal(true);
                        }}
                    />
                )}

                {/* Square profile card trigger */}
                <button
                    onClick={() => setShowPopup((v) => !v)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all duration-200 group
            ${showPopup
                            ? "bg-white/20 border-white/40"
                            : "bg-violet-400/30 border-transparent hover:bg-violet-400/50 hover:border-white/20"
                        }`}
                >
                    {/* Square avatar */}
                    <div className="w-10 h-10 rounded-xl border-2 border-white/30 overflow-hidden shrink-0 shadow-md">
                        <img
                            src={profileData?.avatar_url || getDefaultAvatar(profileData?.gender)}
                            alt={profileData?.name || "Profile"}
                            onError={(e) => { e.target.src = getDefaultAvatar(profileData?.gender); }}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Name + role (desktop) */}
                    <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate w-full text-left leading-tight">
                            {profileData?.name || "Student"}
                        </p>
                        <p className="text-[11px] text-violet-200 capitalize leading-tight">
                            {profileData?.role || "student"}
                        </p>
                    </div>

                    {/* Chevron */}
                    <i className={`ri-arrow-up-s-line hidden lg:block text-violet-200 transition-transform duration-200 ${showPopup ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Logout Confirm Modal */}
            {showLogoutModal && (
                <LogoutModal onClose={() => setShowLogoutModal(false)} />
            )}
        </aside>
    );
};

export default StudentSideNav;
