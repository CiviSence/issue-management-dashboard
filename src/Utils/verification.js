import instance from "./axios";

/**
 * Searches for verified users (neighbors) by query.
 * @param {string} query - Name, email, or registration number
 */
export const searchVerifiedUsers = async (query = "") => {
    try {
        const { data } = await instance.get("/verification/search-verified-users", {
            params: { query }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to search verified users");
    }
};

/**
 * Sends a request for a peer vouch.
 * @param {string} targetUserId - The ID of the user to request from
 */
export const requestVouch = async (targetUserId) => {
    try {
        const { data } = await instance.post("/verification/request", {
            verification_type: "peer",
            target_user_id: targetUserId // Removing String() coercion
        });
        console.log("Vouch request response:", data);
        return data;
    } catch (error) {
        console.error("Vouch Request Error:", error.response?.data);
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to request vouch");
    }
};

/**
 * Uploads a verification document file.
 * @param {File} file - The file to upload
 * @returns {Promise<object>} - { url: "..." }
 */
export const uploadVerificationDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append("verification_proof", file);
        const { data } = await instance.post("/upload/verification-document", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return {
            url: data.url || data.fileUrl || data.secure_url || data.data?.url || data
        };
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to upload document");
    }
};

/**
 * Submits an official document-based verification request.
 */
export const submitVerificationRequest = async (documentUrls, message = "Applying for official verification") => {
    try {
        const { data } = await instance.post("/verification/request", {
            verification_type: "document",
            message: message,
            document_urls: documentUrls
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to submit verification request");
    }
};

/**
 * Responds to a verification request (Approve/Reject).
 * @param {number} requestId - The ID of the request
 * @param {string} action - 'approve' or 'reject'
 */
export const respondToVerificationRequest = async (requestId, action) => {
    try {
        const { data } = await instance.post(`/verification/respond/${requestId}`, {
            action: action
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to respond to request");
    }
};

/**
 * Fetches verification stats for the current user.
 */
export const getVerificationStats = async () => {
    try {
        const { data } = await instance.get("/verification/stats");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to fetch verification stats");
    }
};

/**
 * Fetches requests received BY the current user (to vouch for others).
 */
export const getReceivedRequests = async () => {
    try {
        const { data } = await instance.get("/verification/requests/received");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to fetch received requests");
    }
};

/**
 * Fetches requests sent BY the current user (own applications).
 */
export const getSentRequests = async () => {
    try {
        const { data } = await instance.get("/verification/requests/sent");
        console.log("Sent requests raw data:", data);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || error.response?.data?.message || "Failed to fetch sent requests");
    }
};

// --- Admin Endpoints ---

export const adminGetAllRequests = async () => {
    try {
        const { data } = await instance.get("/verification/admin/all-requests");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to fetch all requests");
    }
};

export const adminGetUnverifiedUsers = async () => {
    try {
        const { data } = await instance.get("/admin/unverified-users");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to fetch unverified users");
    }
};

export const adminGetUserDetailed = async (userId) => {
    try {
        const { data } = await instance.get(`/admin/users/${userId}/detailed`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to fetch user audit details");
    }
};

export const adminReviewDocument = async (requestId, action) => {
    try {
        const { data } = await instance.post(`/verification/admin/review-document/${requestId}`, {
            action: action
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to review document");
    }
};

export const adminManualVerify = async (userId) => {
    try {
        const { data } = await instance.post(`/verification/admin/manual-verify/${userId}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to manually verify user");
    }
};

/**
 * Revokes a user's verification status.
 * @param {string} userId - The ID of the user to revoke verification for
 */
export const adminRevokeVerification = async (userId) => {
    try {
        const { data } = await instance.post(`/admin/revoke-verification/${userId}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to revoke verification");
    }
};



/**
 * Bans a user with a reason and optional content deletion.
 * @param {string} userId - The ID of the user to ban
 * @param {object} options - { reason, delete_content, notify_user }
 */
export const adminBanUser = async (userId, options = {}) => {
    try {
        const { data } = await instance.post(`/admin/ban-user/${userId}`, {
            reason: options.reason || "Violation of terms",
            delete_content: options.delete_content ?? false,
            notify_user: options.notify_user ?? true
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to ban user");
    }
};

/**
 * Unbans a user.
 * @param {string} userId - The ID of the user to unban
 * @param {boolean} notifyUser - Whether to notify the user via email/notification
 */
export const adminUnbanUser = async (userId, notifyUser = true) => {
    try {
        const { data } = await instance.post(`/admin/unban-user/${userId}`, {
            notify_user: notifyUser
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Admin: Failed to unban user");
    }
};
