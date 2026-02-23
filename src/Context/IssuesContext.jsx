import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "./ProfileContext";
import { getMyIssues } from "../Utils/issuesStudent";
import { getStats } from "../Utils/issues";

const IssuesContext = createContext();

export const useIssues = () => useContext(IssuesContext);

export const IssuesProvider = ({ children }) => {
    const { profileData } = useUser();
    const [issues, setIssues] = useState([]);
    const [campusStats, setCampusStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastFetched, setLastFetched] = useState(null);

    const fetchIssues = useCallback(async (force = false) => {
        if (!profileData?.id) return;

        // Skip if fetched within the last 1 hour (unless forced)
        if (!force && lastFetched && Date.now() - lastFetched < 7200000) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getMyIssues(profileData.id);
            setIssues(data);
            setLastFetched(Date.now());
        } catch (err) {
            console.error("Failed to fetch issues", err);
        } finally {
            setLoading(false);
        }
    }, [profileData, lastFetched]);

    // Fetch campus stats once (background, non-blocking)
    useEffect(() => {
        if (profileData?.id && !campusStats) {
            getStats().then(s => setCampusStats(s)).catch(() => { });
        }
    }, [profileData]);

    // Initial fetch
    useEffect(() => {
        if (profileData?.id) {
            fetchIssues();
        }
    }, [profileData]);

    // Mutation helpers — update local cache immediately
    const addIssue = useCallback((issue) => {
        setIssues(prev => [issue, ...prev]);
    }, []);

    const updateIssue = useCallback((updated) => {
        setIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
    }, []);

    const removeIssue = useCallback((id) => {
        setIssues(prev => prev.filter(i => i.id !== id));
    }, []);

    return (
        <IssuesContext.Provider value={{
            issues,
            campusStats,
            loading,
            fetchIssues,
            addIssue,
            updateIssue,
            removeIssue,
        }}>
            {children}
        </IssuesContext.Provider>
    );
};
