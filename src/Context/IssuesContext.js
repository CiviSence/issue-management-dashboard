import { createContext, useContext } from "react";

export const IssuesContext = createContext();

export const useIssues = () => useContext(IssuesContext);
