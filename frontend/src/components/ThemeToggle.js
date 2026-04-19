import React, { useEffect, useState } from "react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }
  }, []);

  const toggleMode = () => {
    const body = document.body;
    body.classList.toggle("dark-mode");

    const isDark = body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    setDarkMode(isDark);
  };

  return (
    <button className="mode-toggle" onClick={toggleMode}>
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;