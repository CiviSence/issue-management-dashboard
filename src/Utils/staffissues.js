import axios from "../Utils/axios";

//fetch all issues assigned to me (staff)
export const getAssignedIssues = async () => {
  try {
    const { data } = await axios.get("/assignments/my-tasks");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned issues",
    );
  }
};

//get my assigned issues stats (staff)
export const mySummary = async () => {
  try {
    const { data } = await axios.get("/assignments/my-summary");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned issues",
    );
  }
};

// Accept assignment (staff)
export const acceptAssignment = async (id, notes = "") => {
  try {
    const { data } = await axios.post(`/assignments/${id}/accept`, {
      notes,
    });
    return data;
  } catch (error) {
    
    throw new Error(error);
  }
};

// Reject assignment (staff)
export const rejectAssignment = async (id, rejection_reason = "") => {
  const payload = {
    rejection_reason: rejection_reason || "No reason provided",
  };

  try {
    const { data } = await axios.post(`/assignments/${id}/reject`, payload);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};


export const allAssignments = async () => {
  try {
    const { data } = await axios.get("/assignments/all");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned issues",
    );
  }
};

export const completeAssignment = async (assignmentId, staffNotes = "", resolutionPhotos = []) => {
  try{
    const {data} = await axios.post(`/assignments/${assignmentId}/complete`, {
      staff_notes: staffNotes,
      resolution_photos: resolutionPhotos,
    });
    return data;
  } catch (error){
    throw new Error(error);
  }
};

export const getAssignmentStats = async () => {
  try {
    const { data } = await axios.get("/assignments/stats");
    return data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assignment stats",
    );
  }
};

// Self-assign an unassigned issue (staff)
export const selfAssignIssue = async (issueId) => {
  try {
    const { data } = await axios.post(`/assignments/${issueId}/self-assign`, {});
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to self-assign issue");
  }
};
export const unassignIssue = async (assignmentId) => {
  try {
    const { data } = await axios.post(`/assignments/${assignmentId}/unassign`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to unassign issue");
  }
};
