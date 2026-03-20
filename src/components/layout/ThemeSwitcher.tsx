import React, { useEffect, useState } from "react";
import { Palette } from "lucide-react";

type Theme = "dark" | "light" | "midnight" | "mocha" | "latte" | "cyberpunk";

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "dark";
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    // Explicit removal of all past and present theme classes to avoid stacking
    const allThemes = [
      "dark",
      "light",
      "midnight",
      "mocha",
      "latte",
      "cyberpunk",
      "psyche",
    ];
    allThemes.forEach((t) => root.classList.remove(t));

    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Dispatch custom event so 3D components (like AppBackground) can update
    window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
  }, [theme]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-primary bg-transparent hover:bg-primary/20 p-2"
          title="Change Theme"
        >
          <Palette className="h-5 w-5" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md glass-panel shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          <div className="py-1">
            <button
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Neon (Sci-Fi)
            </button>
            <button
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Light (Clean)
            </button>
            <button
              onClick={() => {
                setTheme("midnight");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Midnight (Indigo)
            </button>
            <button
              onClick={() => {
                setTheme("mocha");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Mocha (Earth)
            </button>
            <button
              onClick={() => {
                setTheme("latte");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Latte (Light Mocha)
            </button>
            <button
              onClick={() => {
                setTheme("cyberpunk");
                setIsOpen(false);
              }}
              className="group flex w-full items-center px-4 py-2 text-sm text-text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Cyberpunk (Yellow)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
