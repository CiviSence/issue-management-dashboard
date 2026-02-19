import { createContext, useContext, useEffect, useState } from "react";
import axios from "../Utils/axios";
import { getUserData, setSession, clearSession } from "../Utils/auth-utils";

const ProfileContext = createContext();

export const ProfileDataProvider = ({ children }) => {
  // Lazy initialization ensures this only runs once on mount
  const [profileData, setProfileData] = useState(() => getUserData());

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
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
  
// useUser.js add a new file using the following code: or you can uncomment the code below and place it here
//i just did it here to reduce the number of files disabled by eslint
// import { useContext } from "react";
// import { UserContext } from "./UserContext";

// export const useUser = () => useContext(UserContext);
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(ProfileContext);
