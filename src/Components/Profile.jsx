import { useUser } from "../Context/UserContext";
import SideNav from "./Templates/SideNav";
import BottomNav from "./Templates/BottomNav";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState } from "react";
import ProfileEditForm from "./Inputs/ProfileEditForm";
import { updateMyProfile } from "../Utils/profile-api";

const InfoCard = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-lg p-4 h-full">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800 text-right">{value || "—"}</span>
  </div>
);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Profile = () => {
  const { profileData, setProfileData } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = async (updates) => {
    try {
      const updatedProfile = await updateMyProfile(updates);
      // If setProfileData is available in context, use it to update global state
      // Otherwise we might need to rely on the page refreshing or context refetching
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
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-violet-600/10 p-5 lg:p-15 border-b border-violet-100">
          <Skeleton circle width={128} height={128} className="shadow-lg" />
          <div className="flex flex-col gap-3 items-center md:items-start w-full max-w-sm">
            <Skeleton width={240} height={36} />
            <Skeleton width={180} height={20} />
            <Skeleton width={100} height={28} borderRadius={20} />
          </div>
        </div>

        {/* Body Skeletons */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 md:pb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white shadow-md rounded-lg p-5 h-55">
              <Skeleton width={160} height={28} className="mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between"><Skeleton width={80} /><Skeleton width={120} /></div>
                <div className="flex justify-between"><Skeleton width={100} /><Skeleton width={140} /></div>
                <div className="flex justify-between"><Skeleton width={70} /><Skeleton width={110} /></div>
                <div className="flex justify-between"><Skeleton width={90} /><Skeleton width={130} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );

  return (
    <>
      <SideNav />
      <BottomNav />

      {profileData ? (
        <div className="mx-auto w-full shadow-lg overflow-y-auto bg-gray-50 min-h-screen">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-r from-violet-600 to-violet-500 p-5 lg:p-15 text-white shadow-md relative">
            <img
              src={profileData.avatar_url || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white/30 object-cover shadow-2xl"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold tracking-tight">{profileData.name}</h1>
              <p className="opacity-90 text-lg mt-1">{profileData.email}</p>
              <span className="inline-block mt-3 px-4 py-1.5 text-sm font-semibold tracking-wide rounded-full bg-white/20 backdrop-blur-md border border-white/30 capitalize">
                {profileData.role}
              </span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-5 right-5 md:static md:ml-auto bg-white/20 hover:bg-white/30 p-2 rounded-full md:px-4 md:py-2 md:rounded-lg border border-white/30 transition shadow-lg backdrop-blur-sm"
            >
              <i className="ri-edit-line md:mr-2"></i>
              <span className="hidden md:inline">Edit Profile</span>
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 pb-24 md:pb-12">
            <InfoCard title="Personal Information">
              <Info label="Gender" value={profileData.gender} />
              <Info
                label="Date of Birth"
                value={profileData.date_of_birth ? formatDate(profileData.date_of_birth) : null}
              />
              <Info label="Phone" value={profileData.phone_number} />
              <Info label="Pincode" value={profileData.pincode} />
            </InfoCard>

            <InfoCard title="Academic Details">
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

            <InfoCard title="Hostel Details">
              <Info
                label="Hosteler"
                value={profileData.is_hosteler ? "Yes" : "No"}
              />
              {profileData.is_hosteler && (
                <>
                  <Info label="Hostel Name" value={profileData.hostel_name} />
                  <Info label="Room Number" value={profileData.room_number} />
                </>
              )}
            </InfoCard>

            <InfoCard title="Account Status">
              <Info
                label="Email Verified"
                value={profileData.email_verified ? "Yes" : "No"}
              />
              <Info
                label="Verification Status"
                value={profileData.verification_status}
              />
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
          </div>

          {/* Mobile Logout Button Section */}
          <div className="md:hidden px-6 pb-24">
            <button
              onClick={async () => {
                try {
                  const { logoutUser } = await import("../Utils/auth-api");
                  const { clearSession } = await import("../Utils/auth-utils");
                  await logoutUser();
                  clearSession();
                  window.location.href = "/";
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <LoadingSkeleton />
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

export default Profile;
