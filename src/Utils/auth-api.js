import { getAccessToken } from './auth-utils';

const BASE_URL = 'https://csmbsckend.onrender.com/api';

/**
 * Logs in the user with email and password
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - The response data containing access_token and user info
 */
export const loginUser = async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
};

/**
 * Registers a new user
 * @param {object} userData - All registration fields
 * @returns {Promise<object>} - The response data
 */
export const registerUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
};



/**
 * Verifies email with OTP
 * @param {object} data - { email, otp }
 * @returns {Promise<object>} - Response data
 */
export const verifyEmail = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Verification failed');
    }

    return response.json();
};

/**
 * Resends OTP to email
 * @param {object} data - { email }
 * @returns {Promise<object>}
 */
export const resendOtp = async (data) => {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Resend failed');
    }

    return response.json();
};

/**
 * Logs out the user on the server side
 */
export const logoutUser = async () => {
    try {
        const token = getAccessToken();
        if (!token) return;

        await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        console.error("Logout failed", error);
        // Continue with local logout even if server fails
    }
};
