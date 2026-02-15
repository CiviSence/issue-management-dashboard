import axios from "../Utils/axios";
import instance from "../Utils/axios";

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
    throw new Error(error.response?.data?.message || "Failed to fetch issues");
  }
};

/**
 * Get issues reported by current user
 * GET /api/issues/?reporter_id={user_id}
 */
export const getMyIssues = async (userId) => {
  try {
    const { data } = await axios.get("/issues", {
      params: { user_id: userId },
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch your issues",
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
    throw new Error(error.response?.data?.message || "Failed to fetch issues");
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
      error.response?.data?.message || "Failed to fetch issues feed",
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
    throw new Error(error.response?.data?.message || "Failed to fetch issue");
  }
};

/**
 * Create a new issue
 * POST /api/issues/
 */
export const createIssue = async (issueData) => {
  try {
    console.log("Sending data:", issueData); // Debug
    const { data } = await instance.post("/issues", issueData);
    return data;
  } catch (error) {
    console.log("Full error:", error);
    console.log("Response status:", error.response?.status);
    console.log("Response data:", error.response?.data);
    console.log("Request URL:", error.config?.url);
    console.log("Request headers:", error.config?.headers);
    throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to create issue");
  }
};

/**
 * Upload image of any issue
 * POST /api/upload/issue
 */
export const issueImage = async (issueId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const { data } = await instance.post(
      `/upload/issue?issue_id=${issueId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
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
    throw new Error(error.response?.data?.message || "Failed to update issue");
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
    throw new Error(error.response?.data?.message || "Failed to delete issue");
  }
};

/**
 * Get issues assigned to a specific staff member
 * GET /api/issues/?assigned_to={staff_id}
 */
export const getAssignedIssues = async (staffId) => {
  try {
    const { data } = await axios.get("/issues", {
      params: { assigned_to: staffId },
    });
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned issues",
    );
  }
};
