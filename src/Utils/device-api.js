import axios from "./axios";

/**
 * Register or update an FCM token on the backend
 * @param {object} deviceData - { fcm_token, device_type, device_name, app_name }
 */
export const registerDevice = async (deviceData) => {
  try {
    const { data } = await axios.post("/devices/register", deviceData);
    return data;
  } catch (error) {
    console.error("Device registration error:", error);
    throw new Error(error.response?.data?.detail || "Device registration failed");
  }
};

/**
 * Unregister/deactivate an FCM token on the backend
 * @param {string} fcmToken
 */
export const unregisterDevice = async (fcmToken) => {
  try {
    const { data } = await axios.post("/devices/unregister", { fcm_token: fcmToken });
    return data;
  } catch (error) {
    console.error("Device unregistration error:", error);
    throw new Error(error.response?.data?.detail || "Device unregistration failed");
  }
};
