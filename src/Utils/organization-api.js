import axios from "./axios";

/**
 * Fetches the user's active organization details
 * @returns {Promise<object>}
 */
export const getMyOrganization = async () => {
  try {
    const { data } = await axios.get("/organizations/my");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch organization",
    );
  }
};

/**
 * Updates organization settings (Org Admin only)
 * Endpoint: PATCH /api/organizations/{org_id}/settings
 * @param {string|number} orgId - ID of the organization
 * @param {object} settings - Object containing updated settings, e.g. { require_verified_feed: boolean }
 * @returns {Promise<object>} - Updated organization object
 */
export const updateOrgSettings = async (orgId, settings) => {
  try {
    const { data } = await axios.patch(
      `/organizations/${orgId}/settings`,
      settings,
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update organization settings",
    );
  }
};

/**
 * Submits a request to switch or join an organization
 * Endpoint: POST /api/organizations/change-request
 * @param {object} requestData - Payload containing target org info and reason, e.g. { organization_id, reason } or { target_organization_id, reason }
 * @returns {Promise<object>} - Created change request response
 */
export const submitOrgChangeRequest = async (requestData) => {
  try {
    const { data } = await axios.post(
      "/organizations/change-request",
      requestData,
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "Failed to submit organization change request",
    );
  }
};

/**
 * Creates a new organization with optional settings
 * Endpoint: POST /api/organizations/
 * @param {object} orgData - Organization payload (including optional require_verified_feed)
 * @returns {Promise<object>} - Response containing created organization
 */
export const createOrganization = async (orgData) => {
  try {
    const { data } = await axios.post("/organizations/", orgData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create organization",
    );
  }
};
