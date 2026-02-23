import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
