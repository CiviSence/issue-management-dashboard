import { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "../Context/ThemeContext";
import { useEffect, useState } from "react";

const GlobalSkeletonTheme = ({ children }) => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    // Initial check
    checkTheme();
    
    // Observer to watch for class changes on html tag
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <SkeletonTheme
      baseColor={isDark ? "#1e293b" : "#ebebeb"} 
      highlightColor={isDark ? "#334155" : "#f5f5f5"} 
    >
      {children}
    </SkeletonTheme>
  );
};

export default GlobalSkeletonTheme;
