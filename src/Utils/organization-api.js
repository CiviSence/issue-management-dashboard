import axios from "./axios";

/**
 * Public Endpoint: List all active organizations.
 * @param {number} skip
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const listOrganizations = async (skip = 0, limit = 100) => {
  try {
    const { data } = await axios.get(`/organizations?skip=${skip}&limit=${limit}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch active organizations"
    );
  }
};

/**
 * Fetches all organizations the user belongs to, along with their per-org roles.
 * Endpoint: GET /api/organizations/my
 * @returns {Promise<Array>}
 */
export const getMyOrganization = async () => {
  try {
    const { data } = await axios.get("/organizations/my");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch user organizations"
    );
  }
};

export const getMyOrganizations = getMyOrganization;

/**
 * Switches the active organization context for the authenticated user.
 * Returns a new set of JWT tokens (access_token & refresh_token).
 * Endpoint: POST /api/organizations/switch
 * @param {string} organizationId - UUID of target organization
 * @returns {Promise<object>} - Token payload { access_token, token_type, refresh_token, expires_in }
 */
export const switchOrganization = async (organizationId) => {
  try {
    const { data } = await axios.post("/organizations/switch", {
      organization_id: organizationId,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to switch organization context"
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
      settings
    );
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to update organization settings"
    );
  }
};

/**
 * Submits a request to switch or join an organization
 * Endpoint: POST /api/organizations/request-change
 * @param {object} requestData - Payload containing target org info and reason
 * @returns {Promise<object>} - Created change request response
 */
export const submitOrgChangeRequest = async (requestData) => {
  try {
    const endpoint = "/organizations/request-change";
    const payload = {
      new_organization_id:
        requestData.new_organization_id ||
        requestData.target_organization_id ||
        requestData.organization_id,
      reason: requestData.reason || "Requesting organization change/transfer",
    };
    const { data } = await axios.post(endpoint, payload);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
        "Failed to submit organization change request"
    );
  }
};

/**
 * Creates a new organization with optional settings
 * Endpoint: POST /api/organizations/
 * @param {object} orgData - Organization payload
 * @returns {Promise<object>} - Response containing created organization
 */
export const createOrganization = async (orgData) => {
  try {
    const { data } = await axios.post("/organizations/", orgData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to create organization"
    );
  }
};

/**
 * Joins an organization via invite token or organization ID
 * Endpoint: POST /api/organizations/join
 * @param {object} joinData - { token?, organization_id? }
 * @returns {Promise<object>}
 */
export const joinOrganization = async (joinData) => {
  try {
    const { data } = await axios.post("/organizations/join", joinData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to join organization"
    );
  }
};

/**
 * Leaves an organization
 * Endpoint: DELETE /api/organizations/{org_id}/leave
 * @param {string} orgId
 * @returns {Promise<object>}
 */
export const leaveOrganization = async (orgId) => {
  try {
    const { data } = await axios.delete(`/organizations/${orgId}/leave`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to leave organization"
    );
  }
};

/**
 * Generates an invite token for an organization
 * Endpoint: POST /api/organizations/invite
 * @param {object} inviteData - { role_to_grant, expires_in_days }
 * @returns {Promise<object>}
 */
export const inviteUserToOrg = async (inviteData) => {
  try {
    const { data } = await axios.post("/organizations/invite", inviteData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to generate invite"
    );
  }
};

/**
 * Gets pending role requests for an organization (Org Admin only)
 * Endpoint: GET /api/organizations/{org_id}/role-requests
 * @param {string} orgId
 * @returns {Promise<Array>}
 */
export const getRoleRequests = async (orgId) => {
  try {
    const { data } = await axios.get(`/organizations/${orgId}/role-requests`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to fetch role requests"
    );
  }
};

/**
 * Approves a role request
 * Endpoint: POST /api/organizations/{org_id}/role-requests/{req_id}/approve
 * @param {string} orgId
 * @param {string} reqId
 * @returns {Promise<object>}
 */
export const approveRoleRequest = async (orgId, reqId) => {
  try {
    const { data } = await axios.post(`/organizations/${orgId}/role-requests/${reqId}/approve`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to approve role request"
    );
  }
};

/**
 * Rejects a role request
 * Endpoint: POST /api/organizations/{org_id}/role-requests/{req_id}/reject
 * @param {string} orgId
 * @param {string} reqId
 * @param {string} reason
 * @returns {Promise<object>}
 */
export const rejectRoleRequest = async (orgId, reqId, reason) => {
  try {
    const { data } = await axios.post(`/organizations/${orgId}/role-requests/${reqId}/reject`, { reason });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || "Failed to reject role request"
    );
  }
};

/**
 * Platform Endpoint: List all organizations (Platform Admin)
 * Endpoint: GET /api/platform/organizations/
 */
export const listPlatformOrganizations = async () => {
  try {
    const { data } = await axios.get("/platform/organizations/");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch platform organizations");
  }
};

/**
 * Platform Endpoint: Suspend an organization
 * Endpoint: POST /api/platform/organizations/{org_id}/suspend
 */
export const suspendPlatformOrganization = async (orgId, reason) => {
  try {
    const { data } = await axios.post(`/platform/organizations/${orgId}/suspend`, { reason });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to suspend organization");
  }
};

/**
 * Platform Endpoint: Get all org change requests
 * Endpoint: GET /api/platform/organizations/change-requests
 */
export const getPlatformOrgChangeRequests = async () => {
  try {
    const { data } = await axios.get("/platform/organizations/change-requests");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch change requests");
  }
};

/**
 * Platform Endpoint: Approve org change request
 * Endpoint: POST /api/platform/organizations/change-requests/{req_id}/approve
 */
export const approvePlatformOrgChangeRequest = async (reqId) => {
  try {
    const { data } = await axios.post(`/platform/organizations/change-requests/${reqId}/approve`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to approve change request");
  }
};

/**
 * Platform Endpoint: Reject org change request
 * Endpoint: POST /api/platform/organizations/change-requests/{req_id}/reject
 */
export const rejectPlatformOrgChangeRequest = async (reqId, reason) => {
  try {
    const { data } = await axios.post(`/platform/organizations/change-requests/${reqId}/reject`, { reason });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to reject change request");
  }
};

/**
 * Developer Endpoint: Get organization request campaigns
 * Endpoint: GET /api/developer/organization-requests
 */
export const getDeveloperOrgRequests = async () => {
  try {
    const { data } = await axios.get("/developer/organization-requests");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to fetch developer organization requests");
  }
};

/**
 * Developer Endpoint: Approve organization request campaign
 * Endpoint: POST /api/developer/organization-requests/{request_id}/approve
 */
export const approveDeveloperOrgRequest = async (requestId) => {
  try {
    const { data } = await axios.post(`/developer/organization-requests/${requestId}/approve`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to approve organization request");
  }
};

/**
 * Developer Endpoint: Reject organization request campaign
 * Endpoint: POST /api/developer/organization-requests/{request_id}/reject
 */
export const rejectDeveloperOrgRequest = async (requestId, reason) => {
  try {
    const { data } = await axios.post(`/developer/organization-requests/${requestId}/reject`, { reason });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to reject organization request");
  }
};

/**
 * Developer Endpoint: Merge organization request campaign into an existing organization
 * Endpoint: POST /api/developer/organization-requests/{request_id}/merge
 */
export const mergeDeveloperOrgRequest = async (requestId, targetOrgId) => {
  try {
    const { data } = await axios.post(`/developer/organization-requests/${requestId}/merge`, { target_organization_id: targetOrgId });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Failed to merge organization request");
  }
};

