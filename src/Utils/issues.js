import instance from "../Utils/axios";

// Alias for convenience writing axios every time nononono
const axios = instance;

// Fetch dashboard stats (admin)
export const getStats = async () => {
  try {
    const { data } = await axios.get("/analytics/dashboard-stats");
    console.log(data);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch issues");
  }
};
// Fetch all issues
export const getAllIssues = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch issues");
  }
};

// Fetch issues reported by a specific user
export const getMyIssues = async (userId) => {
  try {
    const { data } = await axios.get("/issues", { params: { user_id: userId } });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch your issues");
  }
};

// Fetch resolved issues
export const getResolvedIssues = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues/?limit=50&status=resolved", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch issues");
  }
};

// Fetch social feed
export const getIssuesFeed = async (params = {}) => {
  try {
    const { data } = await axios.get("/issues/feed", { params });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch issues feed");
  }
};

// Fetch a single issue by ID
export const getIssueById = async (issueId) => {
  try {
    const { data } = await axios.get(`/issues/${issueId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch issue");
  }
};

// Create a new issue
export const createIssue = async (issueData) => {
  try {
    const { data } = await instance.post("/issues", issueData);
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to create issue"
    );
  }
};

// Upload image for an issue
export const issueImage = async (issueId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const { data } = await instance.post(
      `/upload/issue?issue_id=${issueId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload image");
  }
};

// Update issue details
export const updateIssue = async (issueId, updates) => {
  try {
    const { data } = await axios.patch(`/issues/${issueId}`, updates);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update issue");
  }
};

// Delete an issue
export const deleteIssue = async (issueId) => {
  try {
    const { data } = await axios.delete(`/issues/${issueId}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete issue");
  }
};

// Fetch issues assigned to me (staff)
export const getAssignedIssues = async () => {
  try {
    const { data } = await axios.get("assignments/my-tasks");
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch assigned issues");
  }
};

// Assign issue to staff
export const assignIssue = async (issueId, staffId, notes = "") => {
  try {
    const { data } = await instance.post("/assignments", {
      issue_id: issueId,
      staff_user_id: staffId,
      notes,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to assign staff to issue");
  }
};

// Upvote an issue
export const upvoteIssue = async (issueId) => {
  try {
    const { data } = await instance.post(`/issues/${issueId}/upvote`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upvote issue");
  }
};

// Downvote an issue
export const downvoteIssue = async (issueId) => {
  try {
    const { data } = await instance.post(`/issues/${issueId}/downvote`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to downvote issue");
  }
};

// Remove a vote
export const removeVote = async (issueId) => {
  try {
    const { data } = await instance.delete(`/issues/${issueId}/vote`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to remove vote");
  }
};

// Fetch comments for an issue
export const fetchComments = async (issueId) => {
  try {
    const { data } = await instance.get(`/issues/${issueId}/comments`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch comments");
  }
};

// Post a new comment
export const addComment = async (issueId, text) => {
  try {
    const { data } = await instance.post(`/issues/${issueId}/comments`, { text });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add comment");
  }
};


