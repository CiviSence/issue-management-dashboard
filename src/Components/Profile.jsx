import axios from "../Utils/axios";
import React, { useEffect } from "react";
import { useUser } from "../Context/UserContext";
import SideNav from "./Templates/SideNav";
import Loader from "./Templates/Loader";
import BottomNav from "./Templates/BottomNav";

const InfoCard = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-2">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value || "—"}</span>
  </div>
);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Profile = () => {
  const { profileData } = useUser();



  return (
    <>
      <SideNav />
      <BottomNav />

      {profileData ? (
        <div className="mx-auto w-full shadow-lg overflow-y-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-r from-violet-600 to-violet-500 p-5 lg:p-15 text-white">
            <img
              src={profileData.avatar_url || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="opacity-90">{profileData.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-white/20">
                {profileData.role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* BODY */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Personal Information">
              <Info label="Gender" value={profileData.gender} />
              <Info
                label="Date of Birth"
                value={formatDate(profileData.date_of_birth)}
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
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Profile;
