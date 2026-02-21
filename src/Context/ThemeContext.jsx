import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ThemeContext } from "./ThemeContext.js";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(Cookies.get("theme") || "light");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        Cookies.set("theme", theme, { expires: 365 });
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ThemeContext.js contains the useTheme hook and the Context object.
