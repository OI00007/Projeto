/**
 * Hook de tema — gerencia claro/escuro/sistema com persistência no localStorage.
 * O tema "system" segue a preferência do sistema operacional em tempo real.
 */
import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [saved, setSaved] = useLocalStorage<Theme>("argom-theme", "system");
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const isDark = saved === "dark" || (saved === "system" && systemDark);

  // Aplica classe "dark" no <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Escuta mudanças no SO
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme  = useCallback((t: Theme) => setSaved(t), [setSaved]);
  const toggleTheme = useCallback(() => setSaved(isDark ? "light" : "dark"), [isDark, setSaved]);

  return { theme: saved, isDark, setTheme, toggleTheme };
}
