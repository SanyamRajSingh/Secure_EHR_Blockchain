import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("ehr-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ehr-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] hover:bg-[color:var(--border-color)] transition-all duration-300 flex items-center justify-center shadow-sm border border-[color:var(--border-color)]"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <FaSun className="text-yellow-400 text-lg animate-pulse" />
      ) : (
        <FaMoon className="text-slate-600 text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle;
