import instance from "./axios";

export const searchVerifiedUsers = async () => {
    try {
        const { data } = await instance.get("/verification/search-verified-users");
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to search verified users");
    }
};

export const requestVouch = async (targetUserId) => {
    try {
        const { data } = await instance.post("/verification/request", {
            verification_type: "peer",
            target_user_id: targetUserId
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to request vouch");
    }
};

export const uploadID = async (documentUrl) => {
    try {
        const { data } = await instance.post("/verification/request", {
            verification_type: "document",
            document_url: documentUrl
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to submit ID for verification");
    }
};
