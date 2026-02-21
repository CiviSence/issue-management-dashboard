import { createContext, useContext } from "react";

export const UserContext = createContext();

export const useUsers = () => useContext(UserContext);
