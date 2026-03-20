import React, { useEffect, useState } from "react";
import { Palette } from "lucide-react";

// ── Single source of truth ────────────────────────────────────────────────────
const ALL_THEMES = [
  "dark",
  "light",
  "latte",
  "nord",
  "vaporwave",
  "obsidian",
] as const;

type Theme = (typeof ALL_THEMES)[number];

// ── Grouping ──────────────────────────────────────────────────────────────────
const DARK_THEMES: Theme[] = [
  "dark", // High contrast dark (OLED/Neon)
  "obsidian", // Professional dark
  "nord", // Soft dark
  "vaporwave", // Vibe
];

const LIGHT_THEMES: Theme[] = [
  "light", // High contrast light
  "latte", // Soft light
];

// ── Display metadata ──────────────────────────────────────────────────────────
const THEME_LABELS: Record<Theme, string> = {
  dark: "Neon",
  light: "Light",
  latte: "Latte",
  nord: "Nord",
  vaporwave: "Vaporwave",
  obsidian: "Obsidian",
};

const THEME_DOT: Record<Theme, string> = {
  dark: "bg-cyan-400",
  light: "bg-blue-500",
  latte: "bg-amber-400",
  nord: "bg-sky-300",
  vaporwave: "bg-fuchsia-400",
  obsidian: "bg-black ring-1 ring-white",
};

// ── Component ─────────────────────────────────────────────────────────────────
export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "nord";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    ALL_THEMES.forEach((t) => root.classList.remove(t));
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("theme-change", { detail: theme }));
  }, [theme]);

  const handleSelect = (t: Theme) => {
    setTheme(t);
    setIsOpen(false);
  };

  const renderGroup = (label: string, themes: Theme[]) => (
    <>
      <div className="px-4 pt-3 pb-1">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-40 text-text-primary">
          {label}
        </span>
      </div>
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => handleSelect(t)}
          className={`group flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors
            ${
              theme === t
                ? "text-primary bg-primary/20 font-semibold"
                : "text-text-primary hover:bg-primary/20 hover:text-primary"
            }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full flex-shrink-0 ${THEME_DOT[t]}`}
          />
          {THEME_LABELS[t]}
          {theme === t && <span className="ml-auto text-xs opacity-50">✓</span>}
        </button>
      ))}
    </>
  );

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-primary bg-transparent hover:bg-primary/20 p-2"
        title="Change Theme"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-md glass-panel shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
          <div className="pb-2">
            {renderGroup("🌙 Dark", DARK_THEMES)}
            <div className="my-1 mx-4 border-t border-border opacity-20" />
            {renderGroup("☀️ Light", LIGHT_THEMES)}
          </div>
        </div>
      )}
    </div>
  );
};
