import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';
const USER_PREVIEW_KEY = 'user_preview'; // For fast load from cookies

/**
 * Saves the session data (token and user info)
 * @param {string} accessToken - The JWT access token
 * @param {object} user - The user object
 * @param {string} refreshToken - The JWT refresh token
 */
export const setSession = (accessToken, user, refreshToken) => {
  if (accessToken) {
    Cookies.set(AUTH_TOKEN_KEY, accessToken, {
      expires: 30, // 30 days
      secure: window.location.protocol === 'https:',
      priority: 'High',
      sameSite: 'Strict'
    });
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      expires: 30, // 30 days
      secure: window.location.protocol === 'https:',
      priority: 'High',
      sameSite: 'Strict'
    });
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    // Save full data to localStorage (persist) non sensitive like
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

    // Save essential preview data to Cookies for faster/SSR-like access
    // Keep it small to avoid cookie size limits
    const preview = {
      name: user.name,
      avatar_url: user.avatar_url,
      role: user.role,
      email: user.email
    };
    Cookies.set(USER_PREVIEW_KEY, JSON.stringify(preview), {
      expires: 30,
      secure: window.location.protocol === 'https:',
      sameSite: 'Strict'
    });
  }
};

/**
 * Retrieves the access token from cookies
 * @returns {string|undefined} The access token or undefined
 */
export const getAccessToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY) || undefined;
};

/**
 * Retrieves the refresh token from cookies
 * @returns {string|undefined} The refresh token or undefined
 */
export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY) || localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
};

/**
 * Retrieves the stored user data from Cookies (fast) or localStorage (full)
 * @returns {object|null} The user object or null
 */
export const getUserData = () => {
  // Try to get quick preview from cookies first
  const cookiePreview = Cookies.get(USER_PREVIEW_KEY);
  if (cookiePreview) {
    try {
      const previewData = JSON.parse(cookiePreview);
      // Try to merge with full data if available
      const localDataStr = localStorage.getItem(USER_DATA_KEY);
      if (localDataStr) {
        return { ...JSON.parse(localDataStr), ...previewData };
      }
      return previewData;
    } catch (e) {
      console.error("Error parsing user cookie", e);
    }
  }

  // Fallback to localStorage
  const userStr = localStorage.getItem(USER_DATA_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Clears the session data (token and user info)
 */
export const clearSession = () => {
  localStorage.removeItem("registered_fcm_token");
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_PREVIEW_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
