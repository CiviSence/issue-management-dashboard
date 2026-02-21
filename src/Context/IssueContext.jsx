import { useEffect, useState } from "react";
import { getAllIssues, getResolvedIssues, getStats } from "../Utils/issues";
import { IssueContext } from "./IssueContext.js";

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [allstats, setAllStats] = useState(null);

  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch all Issues
  const fetchIssues = async () => {
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
  };

  const fetchResolvedIssues = async () => {
    try {
      const data = await getResolvedIssues();

      setResolvedIssues(data?.issues || data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);

      const data = await getStats();

      setAllStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load both on first app load
  useEffect(() => {
    fetchIssues();
    (fetchResolvedIssues(), fetchStats());
  }, []);

  return (
    <IssueContext.Provider
      value={{
        issues,
        resolvedIssues,
        allstats,


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
