import { Link } from "react-router-dom";
import TopBar from "./Templates/TopBar";
import { useUser } from "../Context/ProfileContext";
import AdminSideNav from "./Dashboards/Admin/AdminSideNav";
import StudentSideNav from "./Dashboards/Student/StudentSideNav";
import StaffSideNav from "./Dashboards/Staff/StaffSideNav";
import StudentProfile from "./Dashboards/Student/StudentProfile";
import BottomNav from "./Templates/BottomNav";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileEditForm from "../Components/Inputs/ProfileEditForm";
import { updateMyProfile, getMyOrganization } from "../Utils/profile-api";

import StatusBadge from "./Templates/StatusBadge";
import defaultPfpFemale from "../assets/default-pfp/default-pfp-female.svg";
import defaultPfpMale from "../assets/default-pfp/default-pfp-male.svg";
import { useEffect, useState } from "react";

const getDefaultAvatar = (gender) => {
  const g = gender?.toLowerCase();
  return g === "female" || g === "f" || g === "woman" ? defaultPfpFemale : defaultPfpMale;
};

// ─── Reusable Sub-components ────────────────────────────────────────────────

const InfoCard = ({ title, children, icon, className = "" }) => (
  <div
    className={`bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    <h2 className="text-sm font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 uppercase tracking-wider">
      {icon && <i className={`${icon} text-violet-600 text-lg`}></i>}
      {title}
    </h2>
    <div className="space-y-3 sm:space-y-4">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-2.5 sm:py-3 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="font-semibold text-gray-800 wrap-break-word sm:text-right break-words">
      {value || "—"}
    </span>
  </div>
);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });



// ─── Organization Card ──────────────────────────────────────────────────────

const OrganizationCard = ({ orgData, loadingOrg }) => {
  if (loadingOrg) {
    return (
      <InfoCard title="Organization" icon="ri-community-line">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </InfoCard>
    );
  }

  const orgItem = Array.isArray(orgData) 
    ? (orgData.find(item => item.status === 'approved' || item.is_active || (item.organization && item.organization.is_active)) || orgData[0]) 
    : orgData;
  if (!orgItem) return null;
  const org = orgItem.organization || orgItem;

  return (
    <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-sm font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 uppercase tracking-wider">
        <i className="ri-community-line text-violet-600 text-lg"></i>
        Organization
      </h2>

      {/* Org banner */}
      <div className="bg-linear-to-br from-violet-50 to-purple-50 rounded-xl p-4 mb-5 border border-violet-100">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-200 shrink-0">
            <i className="ri-building-2-line text-xl"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-black text-gray-900 truncate">
              {org.name}
            </p>
            {org.code && (
              <p className="text-xs font-bold text-violet-600 mt-0.5 uppercase tracking-wider">
                {org.code}
              </p>
            )}
            {org.description && (
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                {org.description}
              </p>
            )}
          </div>
          {org.status && (
            <span
              className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                org.is_active
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
            >
              {org.status}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {org.official_email && (
          <Info label="Official Email" value={org.official_email} />
        )}
        {org.phone && <Info label="Phone" value={org.phone} />}
        {org.address && <Info label="Address" value={org.address} />}
        {orgItem.role && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 font-medium">Your Role</span>
            <StatusBadge
              type="profile"
              value={orgItem.role}
              showDot={false}
            />
          </div>
        )}
        {orgItem.joined_at && (
          <Info label="Joined At" value={formatDate(orgItem.joined_at)} />
        )}
      </div>
    </div>
  );
};

// ─── Main Profile Component ─────────────────────────────────────────────────

const Profile = () => {
  const { profileData, setProfileData } = useUser();
  const [isEditing, setIsEditing] = useState(false);

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

  const role = profileData?.role?.toLowerCase();

  // Students use their own specialized profile
  if (role === "student") {
    return <StudentProfile />;
  }

  const renderSideNav = () => {
    if (role === "staff") return <StaffSideNav />;
    return <AdminSideNav />;
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

  const handleToggleAvailable = async () => {
    const newVal = !profileData?.available_to_work;
    // Optimistic UI update
    setProfileData((prev) => ({ ...prev, available_to_work: newVal }));
    try {
      await updateMyProfile({ available_to_work: newVal });
    } catch (error) {
      console.error("Failed to update availability", error);
      // Revert on error
      setProfileData((prev) => ({ ...prev, available_to_work: !newVal }));
    }
  };

  // ── Loading Skeleton ────────────────────────────────────────────────────

  const LoadingSkeleton = () => (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="w-full h-full overflow-hidden bg-[#F8F9FF]">
        <div className="bg-white border-b border-gray-100 px-6 py-10 lg:px-20 lg:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Skeleton
              circle
              width={144}
              height={144}
              className="shadow-lg"
            />
            <div className="flex flex-col gap-3 items-center md:items-start w-full max-w-sm">
              <Skeleton width={260} height={40} />
              <Skeleton width={200} height={22} />
              <Skeleton width={110} height={30} borderRadius={20} />
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-6"
            >
              <Skeleton width={160} height={20} className="mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex justify-between">
                    <Skeleton width={80} />
                    <Skeleton width={120} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      {renderSideNav()}
      <BottomNav />

      <div className="mx-auto w-full overflow-y-auto bg-[#F8F9FF] min-h-screen">
        <TopBar title="Profile" />
        {profileData ? (
          <>
            

          {/* ── BODY ──────────────────────────────────────────────── */}
          <div className="px-3 py-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-28 md:pb-32">
            {/* ── PROFILE HEADER ────────────────────────────────────── */}
            <div className="bg-[#7E70EB]  border-b rounded-3xl border-gray-100 shadow-sm px-6 py-10 lg:px-20 lg:py-16 relative overflow-hidden">
             
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={profileData?.avatar_url || getDefaultAvatar(profileData?.gender)}
                  alt="Profile"
                  className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-xl ring-1 ring-white transition-transform group-hover:scale-[1.02]"
                />
                
              </div>

              {/* Name / Email / Role */}
              <div className="text-center md:text-left flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
                  <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {profileData.name}
                  </h1>
                  <StatusBadge
                    type="profile"
                    value={profileData.role}
                    className="mx-auto md:mx-0 bg-white"
                    showDot={false}
                  />
                </div>
                <p className="text-white/70 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                  <i className="ri-mail-line text-white/70"></i>
                  {profileData.email}
                </p>
                {profileData.created_at && (
                  <p className="text-white/70 text-sm flex items-center justify-center md:justify-start gap-1.5">
                    <i className="ri-calendar-line text-white/70"></i>
                    Member since {formatDate(profileData.created_at)}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 md:mt-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none justify-center bg-white text-[#7E70EB] font-bold px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-[#eaeaea] transition shadow-lg active:scale-95 flex items-center gap-1.5 sm:gap-2"
                >
                  <i className="ri-edit-circle-line text-base sm:text-lg"></i>
                  Edit Profile
                </button>
                <Link
                  to="/settings"
                  className="flex-1 sm:flex-none justify-center bg-white text-[#7E70EB] font-bold px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-xl sm:rounded-2xl hover:bg-[#eaeaea] transition shadow-lg active:scale-95 flex items-center gap-1.5 sm:gap-2"
                >
                  <i className="ri-settings-2-line text-base sm:text-lg"></i>
                  Setting
                </Link>

              </div>
            </div>
          </div>
            {/* ── Quick Stats ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-violet-50 text-violet-600 rounded-lg sm:rounded-xl">
                  <i className="ri-shield-check-line text-lg sm:text-xl"></i>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">
                    Verification
                  </p>
                  <p className="text-sm sm:text-base font-black text-gray-900 capitalize truncate">
                    {profileData.verification_status || "Pending"}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-600 rounded-lg sm:rounded-xl">
                  <i className="ri-checkbox-circle-line text-lg sm:text-xl"></i>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">
                    Role Verified
                  </p>
                  <p className="text-sm sm:text-base font-black text-gray-900 truncate">
                    {profileData.role_verified ? "✓ Yes" : "✗ No"}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-amber-50 text-amber-600 rounded-lg sm:rounded-xl">
                  <i className="ri-copper-coin-line text-lg sm:text-xl"></i>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">
                    Reputation
                  </p>
                  <p className="text-base sm:text-xl font-black text-gray-900 truncate">
                    {profileData.reputation_points || 0}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl">
                  <i className="ri-mail-check-line text-lg sm:text-xl"></i>
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 truncate">
                    Email
                  </p>
                  <p className="text-sm sm:text-base font-black text-gray-900 truncate">
                    {profileData.email_verified ? "✓ Verified" : "✗ Unverified"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Info Cards Grid ─────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Personal Information */}
              <InfoCard title="Personal Information" icon="ri-user-3-line">
                <Info label="Name" value={profileData.name} />
                <Info label="Email" value={profileData.email} />
                <Info label="Phone" value={profileData.phone_number} />
                {profileData.gender && (
                  <Info label="Gender" value={profileData.gender} />
                )}
                {profileData.date_of_birth && (
                  <Info
                    label="Date of Birth"
                    value={formatDate(profileData.date_of_birth)}
                  />
                )}
                {profileData.address && (
                  <Info label="Address" value={profileData.address} />
                )}
                {profileData.pincode && (
                  <Info label="Pincode" value={profileData.pincode} />
                )}
              </InfoCard>

              {/* Role-specific Cards */}
              {role === "staff" && (
                <InfoCard
                  title="Professional Details"
                  icon="ri-briefcase-4-line"
                >
                  <Info
                    label="Designation"
                    value={profileData.designation}
                  />
                  {profileData.department && (
                    <Info
                      label="Department"
                      value={profileData.department}
                    />
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 font-medium">
                      Available to Work
                    </span>
                    <label className="relative inline-flex items-center cursor-not-allowed opacity-60">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={profileData?.available_to_work || false}
                        onChange={handleToggleAvailable}
                        disabled
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500 font-medium">
                      Role Verified
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        profileData.role_verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          profileData.role_verified
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {profileData.role_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </InfoCard>
              )}

              {role === "admin" && (
                <InfoCard title="Admin Privileges" icon="ri-admin-line">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">
                      Role Verified
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        profileData.role_verified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          profileData.role_verified
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {profileData.role_verified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50">
                    <span className="text-gray-500 font-medium">
                      Can Verify Others
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                        profileData.can_verify_others
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          profileData.can_verify_others
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {profileData.can_verify_others ? "Yes" : "No"}
                    </span>
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
              )}

              {/* Account Status */}
              <InfoCard title="Account Status" icon="ri-verified-badge-line">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1 sm:gap-4 py-3 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">
                    Verification Status
                  </span>
                  <StatusBadge
                    type="profile"
                    value={profileData.verification_status || "unverified"}
                    showDot={true}
                  />
                </div>
                <Info
                  label="Email Verified"
                  value={profileData.email_verified ? "Yes" : "No"}
                />
                {role === "staff" && (
                  <>
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
                  </>
                )}
                {role === "admin" && (
                  <Info
                    label="Verification Status"
                    value={profileData.verification_status}
                  />
                )}
              </InfoCard>

              {/* Organization Details */}
              <OrganizationCard orgData={orgData} loadingOrg={loadingOrg} />


            </div>
          </div>


        </>
      ) : (
        <LoadingSkeleton />
      )}
      </div>



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

export default Profile;
