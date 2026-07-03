import { Link } from "react-router-dom";
import TopBar from "../../Templates/TopBar";
import { useUser } from "../../../Context/ProfileContext";
import StudentSideNav from "./StudentSideNav";
import StudentBottomNav from "./StudentBottomNav";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileEditForm from "../../Inputs/ProfileEditForm";
import { updateMyProfile, getMyOrganization } from "../../../Utils/profile-api";
import {
    getActiveSessions,
    logoutAllSessions,
    logoutUser,
    revokeSession,
} from "../../../Utils/auth-api";
import defaultPfpFemale from "../../../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../../../assets/default-pfp/default-pfp-male.svg";
import { useEffect, useState } from "react";

const getDefaultAvatar = (gender) => {
    const g = gender?.toLowerCase();
    return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};
import { getMyIssues } from "../../../Utils/issuesStudent";
import { clearSession } from "../../../Utils/auth-utils";
import StatusBadge from "../../Templates/StatusBadge";

const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
            {icon && <i className={`${icon} text-violet-600 text-lg`}></i>}
            {title}
        </h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const Info = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-semibold text-gray-800 break-words">{value || "—"}</span>
    </div>
);

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

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
            alert("Failed to revoke session");
        } finally {
            setRevokingId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition-shadow">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                    <i className="ri-shield-user-line text-violet-600 text-lg"></i>
                    Active Sessions
                </h2>
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
                                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-white transition-all group"
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

const StudentProfile = () => {
    const { profileData, setProfileData } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutInput, setLogoutInput] = useState("");
    const [logoutType, setLogoutType] = useState("current");
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [myIssues, setMyIssues] = useState([]);
    const [orgData, setOrgData] = useState(null);
    const [loadingOrg, setLoadingOrg] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchOrg = async () => {
            try {
                const data = await getMyOrganization();
                if (isMounted) setOrgData(data);
            } catch (err) {
                console.error("Failed to fetch organization:", err);
            } finally {
                if (isMounted) setLoadingOrg(false);
            }
        };
        fetchOrg();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (profileData?.id) {
            getMyIssues(profileData.id)
                .then(setMyIssues)
                .catch(() => { });
        }
    }, [profileData]);

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

    const handleSaveProfile = async (updates) => {
        try {
            const updatedProfile = await updateMyProfile(updates);
            if (setProfileData) {
                setProfileData(updatedProfile);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            throw error;
        }
    };

    const LoadingSkeleton = () => (
        <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
            <div className="w-full h-full overflow-hidden bg-gray-50">
                <div className="flex flex-col md:flex-row items-center gap-6 bg-violet-500/10 p-5 lg:p-15 border-b border-violet-100">
                    <Skeleton circle width={128} height={128} className="shadow-lg" />
                    <div className="flex flex-col gap-3 items-center md:items-start w-full max-sm:items-center">
                        <Skeleton width={240} height={36} />
                        <Skeleton width={180} height={20} />
                        <Skeleton width={100} height={28} borderRadius={20} />
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 md:pb-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white shadow-md rounded-lg p-5">
                            <Skeleton width={160} height={28} className="mb-6" />
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton width={80} />
                                    <Skeleton width={120} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SkeletonTheme>
    );

    return (
        <>
            <StudentSideNav />
            <StudentBottomNav />

            <div className="mx-auto w-full overflow-y-auto bg-[#F8F9FF] min-h-screen">
                <TopBar title="Profile" />
                {profileData ? (
                    <>
                        {/* PROFILE HEADER */}
                        <div className="bg-white border-b border-gray-100 shadow-sm px-6 py-10 lg:px-20 lg:py-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full blur-3xl opacity-40 -ml-10 -mb-10"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                            <div className="relative group">
                                <img
                                    src={profileData?.avatar_url || getDefaultAvatar(profileData?.gender)}
                                    alt="Profile"
                                    className="w-32 h-32 md:w-36 md:h-36 rounded-3xl border-4 border-white object-cover shadow-xl ring-1 ring-violet-100 transition-transform group-hover:scale-[1.02]"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-violet-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                                    <i className="ri-checkbox-circle-fill"></i>
                                </div>
                            </div>

                            <div className="text-center md:text-left flex-1 space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                                        {profileData.name}
                                    </h1>
                                    <StatusBadge type="profile" value={profileData.role} className="mx-auto md:mx-0" showDot={false} />
                                </div>
                                <p className="text-gray-500 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                                    <i className="ri-mail-line text-violet-400"></i>
                                    {profileData.email}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-violet-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-violet-700 transition shadow-lg shadow-violet-200 active:scale-95 flex items-center gap-2"
                                >
                                    <i className="ri-edit-circle-line text-lg"></i>
                                    Edit Profile
                                </button>
                                <Link
                                    to="/settings"
                                    className="bg-white text-violet-600 border border-violet-200 font-bold px-6 py-3 rounded-2xl hover:bg-violet-50 transition shadow-lg shadow-violet-100 active:scale-95 flex items-center gap-2"
                                >
                                    <i className="ri-settings-2-line text-lg"></i>
                                    Setting
                                </Link>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="hidden md:flex bg-white border border-gray-200 text-gray-700 font-bold px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition active:scale-95 flex items-center gap-2"
                                    title="Log Out"
                                >
                                    <i className="ri-logout-box-line text-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 lg:p-8 space-y-6 pb-32">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                                    <i className="ri-file-list-3-line text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reports</p>
                                    <p className="text-xl font-black text-gray-900">{myIssues.length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <i className="ri-checkbox-circle-line text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resolved</p>
                                    <p className="text-xl font-black text-gray-900">{myIssues.filter(i => i.status === 'resolved').length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <i className="ri-copper-coin-line text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reputation</p>
                                    <p className="text-xl font-black text-gray-900">{profileData.reputation_points || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <i className="ri-chat-smile-3-line text-xl"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Impact</p>
                                    <p className="text-xl font-black text-gray-900">
                                        {(profileData.reputation_points || 0) >= 100 ? "🔥 Legend" : (profileData.reputation_points || 0) >= 50 ? "⭐ Great" : (profileData.reputation_points || 0) >= 20 ? "👍 Good" : "🌱 Rising"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoCard title="Personal Information" icon="ri-user-3-line">
                                <Info label="Gender" value={profileData.gender} />
                                <Info
                                    label="Date of Birth"
                                    value={
                                        profileData.date_of_birth
                                            ? formatDate(profileData.date_of_birth)
                                            : null
                                    }
                                />
                                <Info label="Phone" value={profileData.phone_number} />
                                <Info label="Address" value={profileData.address} />
                                <Info label="Pincode" value={profileData.pincode} />
                            </InfoCard>

                            <InfoCard title="Academic Details" icon="ri-graduation-cap-line">
                                <Info
                                    label="Registration No"
                                    value={profileData.registration_number}
                                />
                                <Info label="Department" value={profileData.department} />
                                <Info label="Course" value={profileData.course} />
                                <Info
                                    label="Year / Semester"
                                    value={`${profileData.year} / ${profileData.semester}`}
                                />
                            </InfoCard>

                            <InfoCard title={profileData.is_hosteler ? "Hostel Details" : "Residence"} icon={profileData.is_hosteler ? "ri-hotel-line" : "ri-sun-line"}>
                                {profileData.is_hosteler ? (
                                    <>
                                        <Info label="Status" value="🏠 Hosteler" />
                                        <Info label="Hostel Name" value={profileData.hostel_name} />
                                        <Info label="Room Number" value={profileData.room_number} />
                                    </>
                                ) : (
                                    <>
                                        <Info label="Status" value="Day Scholar" />
                                        <div className="mt-2 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                            <p className="text-xs text-violet-700 font-medium text-center">No hostel drama — just vibes, traffic & tiffin boxes!</p>
                                        </div>
                                    </>
                                )}
                            </InfoCard>

                            <InfoCard title="Account Status" icon="ri-verified-badge-line">
                                <Info
                                    label="Email Verified"
                                    value={profileData.email_verified ? "Yes" : "No"}
                                />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50">
                                    <span className="text-gray-500 font-medium">Verification Status</span>
                                    <StatusBadge type="profile" value={profileData.verification_status || "unverified"} showDot={true} />
                                </div>
                                <Info
                                    label="Reputation Points"
                                    value={profileData.reputation_points}
                                />
                                <Info
                                    label="Verified At"
                                    value={
                                        profileData.verified_at
                                            ? formatDate(profileData.verified_at)
                                            : "—"
                                    }
                                />
                            </InfoCard>

                            <InfoCard title="Account Settings" icon="ri-settings-4-line">
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                                    </label>
                                </div>
                            </InfoCard>

                            <InfoCard title="Security" icon="ri-shield-check-line">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <i className="ri-shield-keyhole-line text-emerald-600"></i>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Password</p>
                                            <p className="text-sm font-bold text-gray-800">Strong</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                        <i className="ri-lock-2-line text-amber-600"></i>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">2FA</p>
                                            <p className="text-sm font-bold text-gray-800">Recommended</p>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Organization Details */}
                            {loadingOrg ? (
                                <InfoCard title="Organization Details" icon="ri-community-line">
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    </div>
                                </InfoCard>
                            ) : (() => {
                                const orgItem = Array.isArray(orgData) 
                                    ? (orgData.find(item => item.status === 'approved' || item.is_active || (item.organization && item.organization.is_active)) || orgData[0]) 
                                    : orgData;
                                if (!orgItem) return null;
                                const org = orgItem.organization || orgItem;
                                return (
                                    <InfoCard title="Organization Details" icon="ri-community-line">
                                        <Info label="Name" value={org.name} />
                                        {org.code && <Info label="Code" value={org.code} />}
                                        {org.description && <Info label="Description" value={org.description} />}
                                        {org.official_email && <Info label="Official Email" value={org.official_email} />}
                                        {org.phone && <Info label="Phone" value={org.phone} />}
                                        {org.address && <Info label="Address" value={org.address} />}
                                        {orgItem.role && <Info label="Your Role" value={orgItem.role} />}
                                        {orgItem.joined_at && (
                                            <Info
                                                label="Joined At"
                                                value={formatDate(orgItem.joined_at)}
                                            />
                                        )}
                                    </InfoCard>
                                );
                            })()}

                            <div className="lg:col-span-3">
                                <SessionsCard />
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden px-6 pb-6 space-y-3">
                        <a
                            href="/help-support"
                            className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <i className="ri-customer-service-2-line text-lg text-violet-600"></i>
                            Help & Support
                        </a>
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Legal Links (Universal: Desktop & Mobile) */}
                    <div className="flex justify-center items-center space-x-3 py-6 pb-28 md:pb-12 text-xs font-medium text-gray-400 border-t border-gray-200/60 mt-6 mx-6 md:mx-auto max-w-6xl">
                        <Link to="/privacy-policy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
                        <span>&bull;</span>
                        <Link to="/terms" className="hover:text-violet-600 transition-colors">Terms of Use</Link>
                    </div>
                </>
            ) : (
                <LoadingSkeleton />
            )}
            </div>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1002]">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                            Confirm Logout
                        </h3>

                        <div className="space-y-3 mb-6">
                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-violet-600 has-checked:bg-violet-50">
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

                            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-red-600 has-checked:bg-red-50">
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
                                    <p className="text-xs text-gray-500">Logout everywhere</p>
                                </div>
                            </label>
                        </div>

                        <p className="mb-2 text-sm text-gray-600 text-center">
                            Type <span className="font-bold text-red-500">logout</span> to
                            confirm.
                        </p>
                        <input
                            type="text"
                            value={logoutInput}
                            onChange={(e) => setLogoutInput(e.target.value)}
                            className="w-full border border-gray-300 rounded-xl px-3 py-3 mb-6 text-center outline-none focus:border-violet-600 transition-all font-medium text-red-500"
                            placeholder="Confirm logout"
                        />

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleLogoutConfirm}
                                disabled={
                                    logoutInput.toLowerCase() !== "logout" || isLoggingOut
                                }
                                className="w-full py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30"
                            >
                                {isLoggingOut ? "Logging out..." : "Log Out"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowLogoutConfirm(false);
                                    setLogoutInput("");
                                    setLogoutType("current");
                                }}
                                disabled={isLoggingOut}
                                className="w-full py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && profileData && (
                <ProfileEditForm
                    profile={profileData}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default StudentProfile;
