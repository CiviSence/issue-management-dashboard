import axios from "../Utils/axios";

/**
 * Get issues (admin / filtered list)
 * GET /api/issues/
 * @param {object} params - status, priority, location, skip, limit
 */
export const getAllIssues = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues", {
      params,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch issues"
    );
  }
};
/**
 * Get Resolved Issues
 * GET /api/issues/?status=resolved
 * @param {object} params - status, priority, location, skip, limit
 */
export const getResolvedIssues = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues/?limit=50&status=resolved", {
      params,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch issues"
    );
  }
};

/**
 * Get social feed issues
 * GET /api/issues/feed
 * @param {object} params - skip, limit
 */
export const getIssuesFeed = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues/feed", {
      params,
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch issues feed"
    );
  }
};

/**
 * Get single issue by ID
 * GET /api/issues/{issue_id}
 */
export const getIssueById = async (issueId) => {
  try {
    const { data } = await axios.get(`/issues/${issueId}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch issue"
    );
  }
};

/**
 * Create a new issue
 * POST /api/issues/
 */
export const createIssue = async (issueData) => {
  try {
    const { data } = await axios.post("/issues", issueData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create issue"
    );
  }
};

/**
 * Update issue
 * PATCH /api/issues/{issue_id}
 */
export const updateIssue = async (issueId, updates) => {
  try {
    const { data } = await axios.patch(`/issues/${issueId}`, updates);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update issue"
    );
  }
};

/**
 * Delete issue
 * DELETE /api/issues/{issue_id}
 */
export const deleteIssue = async (issueId) => {
  try {
    const { data } = await axios.delete(`/issues/${issueId}`);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete issue"
    );
  }
};
