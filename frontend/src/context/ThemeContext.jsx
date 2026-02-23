import { createContext, useContext } from "react";

const ThemeContext = createContext(null);

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext;
