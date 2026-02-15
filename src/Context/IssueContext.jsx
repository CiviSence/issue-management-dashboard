import { createContext, useContext, useEffect, useState } from "react";
import { getAllIssues } from "../Utils/issues";

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIssues = async () => {
    if (issues.length) return;

    try {
      setLoading(true);
      const data = await getAllIssues({ skip: 0, limit: 50 });
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <IssueContext.Provider value={{ issues, setIssues, fetchIssues, loading }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => useContext(IssueContext);
