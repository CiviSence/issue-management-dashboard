import { useState } from "react";
import { getUserById, getTopContributors, getStaff } from "../Utils/users";
import { UserContext } from "./UserContext.js";

export const UserProvider = ({ children }) => {
  const [usersCache, setUsersCache] = useState({}); // { userId: userData }
  const [leaderboard, setLeaderboard] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch public user profile (cached)
   */
  const fetchUserById = async (userId) => {
    if (usersCache[userId]) return usersCache[userId];

    try {
      setLoading(true);
      const data = await getUserById(userId);
      setUsersCache((prev) => ({
        ...prev,
        [userId]: data,
      }));
      return data;
    } catch (err) {
      console.error("Failed to fetch user", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch leaderboard (cached)
   */
  const fetchLeaderboard = async (timePeriod = "all") => {
    try {
      setLoading(true);
      const data = await getTopContributors(timePeriod);
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    if (staff?.length) return;
    try {
      setLoading(true);
      const data = await getStaff();
      // console.log("Staff data:", data);
      setStaff(data.users);
    } catch (err) {
      console.error("Failed to fetch staff", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        usersCache,
        leaderboard,
        loading,
        staff,
        fetchStaff,
        fetchUserById,
        fetchLeaderboard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// UserContext.js contains the useUsers hook and the Context object.
