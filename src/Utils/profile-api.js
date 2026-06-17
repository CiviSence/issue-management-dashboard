import axios from '../Utils/axios';

/**
 * Fetches the current user's profile
 * @returns {Promise<object>}
 */
export const getMyProfile = async () => {
    try {
        const { data } = await axios.get('/auth/me');
        return data;
    } catch (error) {
        throw new Error('Failed to fetch profile', error);
    }
};

/**
 * Updates the current user's profile
 * @param {object} updates - Filtered updates
 * @returns {Promise<object>}
 */
export const updateMyProfile = async (updates) => {
    try {
        const { data } = await axios.patch('/auth/profile', updates);
        return data;
    } catch (error) {
        throw new Error('Failed to update profile', error);
    }
};

/**
 * Uploads a new avatar image
 * @param {File} file - Image file to upload
 * @returns {Promise<object>} - Response containing the new image URL
 */
export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const { data } = await axios.post('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Upload failed');
    }
};

/**
 * Fetches the user's active organization details
 * @returns {Promise<object>}
 */
export const getMyOrganization = async () => {
    try {
        const { data } = await axios.get('/organizations/my');
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || 'Failed to fetch organization');
    }
};
