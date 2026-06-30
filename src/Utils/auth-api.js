import axios from "./axios";

/**
 * Logs in the user with email and password
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - The response data containing access_token and user info
 */
export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    if (data.user) {
      let roleStr = data.user.role || data.user.intended_role || data.user.userType || data.user.user_type;
      if (roleStr) {
        let normalizedRole = roleStr.toLowerCase();
        if (normalizedRole === 'citizen') normalizedRole = 'student';
        if (normalizedRole === 'official') normalizedRole = 'staff';
        data.user.role = normalizedRole;
      }
    }
    return data;
  } catch (error) {
    if (error.response?.status === 422) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        throw new Error(detail[0]?.msg || "Invalid input data");
      }
    }
    if (error.response?.status === 429) {
      const err = new Error(error.response?.data?.detail || "Too many attempts");
      err.status = 429;
      err.retryAfter = error.response.headers["retry-after"] || error.response.headers["Retry-After"] || 60;
      throw err;
    }
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};

/**
 * Registers a new user
 * @param {object} userData - All registration fields
 * @returns {Promise<object>} - The response data
 */
export const registerUser = async (userData) => {
  try {
    const payload = { ...userData };
    if (payload.userType?.toLowerCase() === 'student') payload.userType = 'citizen';
    if (payload.userType?.toLowerCase() === 'staff') payload.userType = 'official';
    if (payload.role?.toLowerCase() === 'student') payload.role = 'citizen';
    if (payload.role?.toLowerCase() === 'staff') payload.role = 'official';
    if (payload.intended_role?.toLowerCase() === 'student') payload.intended_role = 'citizen';
    if (payload.intended_role?.toLowerCase() === 'staff') payload.intended_role = 'official';
    
    const { data } = await axios.post("/auth/register", payload);
    console.log("data",data)
    return data;
  } catch (error) {
    console.log("reg error",error.response)
    throw new Error(error.response?.data?.detail || "Registration failed");
  }
};

/**
 * Verifies email with OTP
 * @param {object} data - { email, otp }
 * @returns {Promise<object>} - Response data
 */
export const verifyEmail = async (data) => {
  try {
    const { data: responseData } = await axios.post("/auth/verify-email", data);
    return responseData;
  } catch (error) {
    if (error.response?.status === 422) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        throw new Error(detail[0]?.msg || "Invalid OTP format");
      }
    }
    throw new Error(error.response?.data?.detail || "Verification failed");
  }
};

/**
 * Resends OTP to email
 * @param {object} data - { email }
 * @returns {Promise<object>}
 */
export const resendOtp = async (data) => {
  try {
    const { data: responseData } = await axios.post("/auth/resend-otp", data);
    return responseData;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Resend failed");
  }
};



/**
 * Logs out the user on the server side
 */
export const logoutUser = async () => {
  try {
    await axios.post("/auth/logout");
  } catch (error) {
    console.error("Logout failed", error);
    // Continue with local logout even if server fails
  }
};

/**
 * Changes the user's password
 * @param {object} data - { old_password, new_password }
 * @returns {Promise<object>}
 */
export const changePassword = async (data) => {
  try {
    const { data: responseData } = await axios.post(
      "/auth/change-password",
      data,
    );
    return responseData;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to change password",
    );
  }
};

/**
 * send otp to email for forget password reset
 * @param {object} data - { email }
 * @returns {Promise<object>}
 */
export const forgotPassword = async (data) => {
  try {
    const { data: responseData } = await axios.post(
      "/auth/forgot-password",
      data,
    );
    return responseData;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to send reset email",
    );
  }
};

/**
 * Resets the password using a token
 * @param {object} data - { token, new_password }
 * @returns {Promise<object>}
 */
export const resetPassword = async (data) => {
  try {
    const { data: responseData } = await axios.post(
      "/auth/reset-password",
      data,
    );
    return responseData;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Password reset failed");
  }
};

/**
 * Logs out from all active sessions
 * @returns {Promise<object>}
 */
export const logoutAllSessions = async () => {
  try {
    const { data } = await axios.post("/auth/logout-all");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Logout from all sessions failed",
    );
  }
};

/**
 * Gets all active sessions for the current user
 * @returns {Promise<string[]>} - List of session IDs or info
 */
export const getActiveSessions = async () => {
  try {
    const { data } = await axios.get("/auth/sessions");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch active sessions",
    );
  }
};

/**
 * Revokes a specific session
 * @param {number|string} sessionId
 * @returns {Promise<object>}
 */
export const revokeSession = async (sessionId) => {
  try {
    const { data } = await axios.delete(`/auth/sessions/${sessionId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to revoke session");
  }
};

/**
 * Deletes the user account
 * @returns {Promise<object>}
 */
export const deleteAccount = async () => {
  try {
    const { data } = await axios.delete("/auth/account");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to delete account");
  }
};
