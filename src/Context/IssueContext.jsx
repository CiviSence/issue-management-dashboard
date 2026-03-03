import { useEffect, useState, useCallback } from "react";
import { getAllIssues, getResolvedIssues, getStats } from "../Utils/issues";
import { useUser } from "./ProfileContext";
import { IssueContext } from "./IssueContext.js";

export const IssueProvider = ({ children }) => {
  const { profileData } = useUser();
  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [allstats, setAllStats] = useState(null);

  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingResolved, setLoadingResolved] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch all Issues
  const fetchIssues = useCallback(async () => {
    try {
      setLoadingIssues(true);

      const data = await getAllIssues({
        skip: 0,
        limit: 50,
      });

      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoadingIssues(false);
    }
  }, []);

  const fetchResolvedIssues = useCallback(async () => {
    try {
      setLoadingResolved(true);
      const data = await getResolvedIssues();

      setResolvedIssues(data?.issues || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResolved(false);
    }
  }, []);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);

      const data = await getStats();

      setAllStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Load data when profile is available
  useEffect(() => {
    const role = profileData?.role?.toLowerCase();
    if (role === "admin" || role === "institute") {
      fetchIssues();
      fetchResolvedIssues();
      fetchStats();
    } else {
      setLoadingIssues(false);
      setLoadingResolved(false);
      setLoadingStats(false);
    }
  }, [profileData, fetchIssues, fetchResolvedIssues, fetchStats]);

  return (
    <IssueContext.Provider
      value={{
        issues,
        resolvedIssues,
        allstats,
        loadingIssues,
        loadingResolved,
        loadingStats,

        fetchIssues,
        fetchResolvedIssues,
        fetchStats,

        setIssues,
        setResolvedIssues,
        setAllStats,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

// IssueContext.js contains the useIssues hook and the Context object.
