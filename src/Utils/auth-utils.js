import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Saves the session data (token and user info)
 * @param {string} accessToken - The JWT access token
 * @param {object} user - The user object
 */
export const setSession = (accessToken, user) => {
  if (accessToken) {
    Cookies.set(AUTH_TOKEN_KEY, accessToken, { 
      expires: 30, // 30 days
      secure: window.location.protocol === 'https:', // Secure only on HTTPS to allow localhost
      sameSite: 'Strict' 
    });
  }
  if (user) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }
};

/**
 * Retrieves the access token from cookies
 * @returns {string|undefined} The access token or undefined
 */
export const getAccessToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

/**
 * Retrieves the stored user data from localStorage
 * @returns {object|null} The user object or null
 */
export const getUserData = () => {
  const userStr = localStorage.getItem(USER_DATA_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Clears the session data (token and user info)
 */
export const clearSession = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
