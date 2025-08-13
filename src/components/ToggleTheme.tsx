"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
    >
      {/* Sun and Moon icons positioned absolutely (non-moving) */}
      <FiSun className="absolute left-1.5 h-4 w-4 text-yellow-500 opacity-100 dark:opacity-0 transition-opacity duration-200" />
      <FiMoon className="absolute right-1.5 h-4 w-4 text-blue-400 opacity-0 dark:opacity-100 transition-opacity duration-200" />

      {/* Moving indicator */}
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`absolute flex items-center justify-center w-6 h-6 rounded-full shadow-sm ${
          theme === "dark" ? "bg-gray-900" : "bg-black"
        }`}
        style={{
          left: theme === "dark" ? "calc(100% - 1.5rem - 2px)" : "2px",
        }}
      >
        {theme === "dark" ? (
          <FiMoon className="text-white text-xs" />
        ) : (
          <FiSun className="text-white text-xs" />
        )}
      </motion.span>
    </button>
  );
}