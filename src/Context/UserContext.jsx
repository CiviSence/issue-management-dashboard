import { createContext, useContext, useEffect, useState } from "react";
import axios from "../Utils/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/auth/me");
      setProfileData(data);
    } catch (err) {
      setProfileData(null);
    } 
  };

  useEffect(() => {
    fetchProfile(); // 
  }, []);

  return (
    <UserContext.Provider value={{ profileData, setProfileData}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
