import { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { ThemeContext } from "./ThemeContext.js";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(Cookies.get("theme") || "light");

    // Resolve the effective theme (handles "system" mode)
    const getEffectiveTheme = useCallback((themeValue) => {
        if (themeValue === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        }
        return themeValue;
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        const effective = getEffectiveTheme(theme);
        root.classList.remove("light", "dark");
        root.classList.add(effective);
        Cookies.set("theme", theme, { expires: 365 });
    }, [theme, getEffectiveTheme]);

    // Listen for OS theme changes when in "system" mode
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(mediaQuery.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// ThemeContext.js contains the useTheme hook and the Context object.
