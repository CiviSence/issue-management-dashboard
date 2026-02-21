import { createContext, useContext } from "react";

export const ProfileContext = createContext();

// Hook to use the profile context
export const useUser = () => useContext(ProfileContext);
