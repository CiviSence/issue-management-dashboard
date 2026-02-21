import { createContext, useContext } from "react";

export const IssueContext = createContext();

export const useIssues = () => useContext(IssueContext);
