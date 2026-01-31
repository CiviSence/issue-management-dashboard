import axios from "../Utils/axios";
import React, { useEffect, useState } from "react";
import SideNav from "./Templates/SideNav";
import Loader from "./Templates/Loader";
import BottomNav from "./Templates/BottomNav";

// const user = {
//     id: 5,
//     email: "admin@ab.c",
//     name: "Vaibhav Raj Harsh",
//     role: "Admin",
//     avatar_url:"https://media.licdn.com/dms/image/v2/D5603AQEvjgujjUtqPQ/profile-displayphoto-scale_200_200/B56ZqQ2ufPJwAY-/0/1763366859843?e=2147483647&v=beta&t=qivP75_URCJDzjIwOiVVSl8pfJFpEE6-9FDuu2RyVtc",
//     created_at: "2026-01-30T14:53:32.723Z",
//     email_verified: true,
//     registration_number: "23105165025",
//     gender: "male",
//     date_of_birth: "2005-09-13",
//     phone_number: "+91 9876543210",
//     pincode: "823003",
//     department: "CSE",
//     course: "Btech",
//     year: 3,
//     semester: 5,
//     designation: "Student",
//     is_hosteler: true,
//     hostel_name: "Boys Hostel",
//     room_number: "100",
//     verification_status: "unverified",
//     verified_at: "2026-01-30T14:53:32.723Z",
//     can_verify_others: true,
//     reputation_points: 0,
//   };

  const InfoCard = ({ title, children }) => (
    <div className=" bg-white shadow-md rounded-lg p-4">
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
  
 const [ProfileData, setProfileData] = useState(null);

const getProfileData = async () => {
  try {
    const { data } = await axios.get("/auth/me");
    console.log(data)
    setProfileData(data);
  } catch (error) {
    console.log("Error:", error);
  }
};

useEffect(() => {
  getProfileData();
}, []);

  return (
    <>
      <SideNav />
      <BottomNav/>
      {ProfileData? (<div className=" mx-auto w-full  shadow-lg overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-r from-violet-600 to-violet-500 p-5 lg:p-15 text-white">
          <img
            src={"https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{ProfileData.name}</h1>
            <p className="opacity-90">{ProfileData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-white/20">
              {ProfileData.role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERSONAL INFO */}
          <InfoCard title="Personal Information">
            <Info label="Gender" value={ProfileData.gender} />
            <Info
              label="Date of Birth"
              value={formatDate(ProfileData.date_of_birth)}
            />
            <Info label="Phone" value={ProfileData.phone_number} />
            <Info label="Pincode" value={ProfileData.pincode} />
          </InfoCard>

          {/* ACADEMIC INFO */}
          <InfoCard title="Academic Details">
            <Info label="Registration No" value={ProfileData.registration_number} />
            <Info label="Department" value={ProfileData.department} />
            <Info label="Course" value={ProfileData.course} />
            <Info
              label="Year / Semester"
              value={`${ProfileData.year} / ${ProfileData.semester}`}
            />
          </InfoCard>

          {/* HOSTEL INFO */}
          <InfoCard title="Hostel Details">
            <Info label="Hosteler" value={ProfileData.is_hosteler ? "Yes" : "No"} />
            {ProfileData.is_hosteler && (
              <>
                <Info label="Hostel Name" value={ProfileData.hostel_name} />
                <Info label="Room Number" value={ProfileData.room_number} />
              </>
            )}
          </InfoCard>

          {/* ACCOUNT INFO */}
          <InfoCard title="Account Status">
            <Info
              label="Email Verified"
              value={ProfileData.email_verified ? "Yes" : "No"}
            />
            <Info
              label="Verification Status"
              value={ProfileData.verification_status}
            />
            <Info label="Reputation Points" value={ProfileData.reputation_points} />
            <Info
              label="Verified At"
              value={ProfileData.verified_at ? formatDate(ProfileData.verified_at) : "—"}
            />
          </InfoCard>
        </div>
      </div>): (<Loader/>)}
    </>
  );
};

export default Profile;
