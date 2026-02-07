import axios from "../Utils/axios";

/**
 * Get public user profile by user ID
 * GET /api/users/{user_id}
 */
export const getUserById = async (userId) => {
  try {
    const { data } = await axios.get(`/users/${userId}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user"
    );
  }
};

/**
 * Get top contributors leaderboard
 * GET /api/users/leaderboard/top-contributors
 */
export const getTopContributors = async () => {
  try {
    const { data } = await axios.get(
      "/users/leaderboard/top-contributors"
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch leaderboard"
    );
  }
};
