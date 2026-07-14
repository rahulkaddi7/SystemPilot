import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "system"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const dark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.classList.toggle("dark", dark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
};