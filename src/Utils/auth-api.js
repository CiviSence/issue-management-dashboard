import axios from './axios';

/**
 * Logs in the user with email and password
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - The response data containing access_token and user info
 */
export const loginUser = async (credentials) => {
    try {
        const { data } = await axios.post('/auth/login', credentials);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Login failed');
    }
};

/**
 * Registers a new user
 * @param {object} userData - All registration fields
 * @returns {Promise<object>} - The response data
 */
export const registerUser = async (userData) => {
    try {
        const { data } = await axios.post('/auth/register', userData);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

/**
 * Verifies email with OTP
 * @param {object} data - { email, otp }
 * @returns {Promise<object>} - Response data
 */
export const verifyEmail = async (data) => {
    try {
        const { data: responseData } = await axios.post('/auth/verify-email', data);
        return responseData;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Verification failed');
    }
};

/**
 * Resends OTP to email
 * @param {object} data - { email }
 * @returns {Promise<object>}
 */
export const resendOtp = async (data) => {
    try {
        const { data: responseData } = await axios.post('/auth/resend-otp', data);
        return responseData;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Resend failed');
    }
};

/**
 * Logs out the user on the server side
 */
export const logoutUser = async () => {
    try {
        await axios.post('/auth/logout');
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
        const { data: responseData } = await axios.post('/auth/change-password', data);
        return responseData;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to change password');
    }
};

/**
 * Requests a password reset link
 * @param {object} data - { email }
 * @returns {Promise<object>}
 */
export const forgotPassword = async (data) => {
    try {
        const { data: responseData } = await axios.post('/auth/forgot-password', data);
        return responseData;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to send reset email');
    }
};

/**
 * Resets the password using a token
 * @param {object} data - { token, new_password }
 * @returns {Promise<object>}
 */
export const resetPassword = async (data) => {
    try {
        const { data: responseData } = await axios.post('/auth/reset-password', data);
        return responseData;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Password reset failed');
    }
};

/**
 * Deletes the user account
 * @returns {Promise<object>}
 */
export const deleteAccount = async () => {
    try {
        const { data } = await axios.delete('/auth/account');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to delete account');
    }
};
