import instance from "./axios";

// Fetch all issues for the current user
export const getMyIssues = async (userId) => {
    try {
        const { data } = await instance.get("/issues", {
            params: { user_id: userId },
        });
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch your issues"
        );
    }
};

// Create a new issue
export const createMyIssue = async (payload) => {
    try {
        const { data } = await instance.post("/issues", payload);
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Failed to create issue"
        );
    }
};

// Update an existing issue
export const updateMyIssue = async (issueId, updates) => {
    try {
        const { data } = await instance.patch(`/issues/${issueId}`, updates);
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to update issue"
        );
    }
};

// Delete an issue
export const deleteMyIssue = async (issueId) => {
    try {
        await instance.delete(`/issues/${issueId}`);
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Failed to delete issue"
        );
    }
};

// Media uploads

// Upload a single media file
export const uploadIssueMedia = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await instance.post("/upload/issue", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
};

// Upload multiple media files
export const uploadMultipleMedia = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const { data } = await instance.post("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    // API returns [{ url, public_id }, ...]
    return data.map((item) => item.url);
};

// Upload user avatar
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await instance.post("/upload/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
};

