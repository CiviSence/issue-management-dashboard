import axios from "../Utils/axios";
import React, { useEffect, useState } from "react";
import SideNav from "./Templates/SideNav";

const user = {
    id: 5,
    email: "admin@ab.c",
    name: "Vaibhav Raj Harsh",
    role: "Admin",
    avatar_url:"https://media.licdn.com/dms/image/v2/D5603AQEvjgujjUtqPQ/profile-displayphoto-scale_200_200/B56ZqQ2ufPJwAY-/0/1763366859843?e=2147483647&v=beta&t=qivP75_URCJDzjIwOiVVSl8pfJFpEE6-9FDuu2RyVtc",
    created_at: "2026-01-30T14:53:32.723Z",
    email_verified: true,
    registration_number: "23105165025",
    gender: "male",
    date_of_birth: "2005-09-13",
    phone_number: "+91 9876543210",
    pincode: "823003",
    department: "CSE",
    course: "Btech",
    year: 3,
    semester: 5,
    designation: "Student",
    is_hosteler: true,
    hostel_name: "Boys Hostel",
    room_number: "100",
    verification_status: "unverified",
    verified_at: "2026-01-30T14:53:32.723Z",
    can_verify_others: true,
    reputation_points: 0,
  };

  const InfoCard = ({ title, children }) => (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
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
  
  const [issues, setIssues] = useState([]);
  const getIssues = async () => {
    try {
      const { data } = await axios.get(`/auth/me`);
      console.log(data);
      if (data.results.length > 0) {
        setIssues((prevState) => [...prevState, ...data.results]);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    getIssues();
  }, [issues]);
  return (
    <>
      <SideNav />
      <div className=" mx-auto w-full  shadow-lg overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-r from-indigo-600 to-purple-600 p-5 lg:p-15 text-white">
          <img
            src={user.avatar_url || "https://i.pravatar.cc/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="opacity-90">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-white/20">
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PERSONAL INFO */}
          <InfoCard title="Personal Information">
            <Info label="Gender" value={user.gender} />
            <Info
              label="Date of Birth"
              value={formatDate(user.date_of_birth)}
            />
            <Info label="Phone" value={user.phone_number} />
            <Info label="Pincode" value={user.pincode} />
          </InfoCard>

          {/* ACADEMIC INFO */}
          <InfoCard title="Academic Details">
            <Info label="Registration No" value={user.registration_number} />
            <Info label="Department" value={user.department} />
            <Info label="Course" value={user.course} />
            <Info
              label="Year / Semester"
              value={`${user.year} / ${user.semester}`}
            />
          </InfoCard>

          {/* HOSTEL INFO */}
          <InfoCard title="Hostel Details">
            <Info label="Hosteler" value={user.is_hosteler ? "Yes" : "No"} />
            {user.is_hosteler && (
              <>
                <Info label="Hostel Name" value={user.hostel_name} />
                <Info label="Room Number" value={user.room_number} />
              </>
            )}
          </InfoCard>

          {/* ACCOUNT INFO */}
          <InfoCard title="Account Status">
            <Info
              label="Email Verified"
              value={user.email_verified ? "Yes" : "No"}
            />
            <Info
              label="Verification Status"
              value={user.verification_status}
            />
            <Info label="Reputation Points" value={user.reputation_points} />
            <Info
              label="Verified At"
              value={user.verified_at ? formatDate(user.verified_at) : "—"}
            />
          </InfoCard>
        </div>
      </div>
    </>
  );
};

export default Profile;
