import { useEffect, useState } from "react";
import axios from "../Utils/axios";
import { getUserData, getAccessToken, setSession, clearSession } from "../Utils/auth-utils";
import { ProfileContext } from "./ProfileContext.js"; // Explicitly import the JS file

export const ProfileDataProvider = ({ children }) => {
  // Lazy initialization ensures this only runs once on mount
  const [profileData, setProfileData] = useState(() => getUserData());

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const { data } = await axios.get("/auth/me");
        if (isMounted) {
          setProfileData(data);
        }
      } catch (err) {
        // If fetch fails with 401, clear everything
        if (isMounted && err.response && err.response.status === 401) {
          setProfileData(null);
          clearSession();
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync profile data changes to persistent storage
  useEffect(() => {
    if (profileData) {
      setSession(null, profileData);
    }
  }, [profileData]);

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
};

// ProfileContext.js contains the useUser hook and the Context object.
// This file only exports the Provider component to keep Vite HMR happy.
