import { createContext, useContext, useState } from "react";
import {
  getUserById,
  getTopContributors,
} from "../Utils/users";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usersCache, setUsersCache] = useState({}); // { userId: userData }
  const [leaderboard, setLeaderboard] = useState([]);
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
  const fetchLeaderboard = async () => {
    if (leaderboard.length) return;

    try {
      setLoading(true);
      const data = await getTopContributors();
      setLeaderboard(data.leaderboard);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
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
        fetchUserById,
        fetchLeaderboard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
