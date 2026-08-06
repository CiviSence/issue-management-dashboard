import { createContext, useContext } from "react";

export const OrganizationContext = createContext();

export const useOrganization = () => useContext(OrganizationContext);
