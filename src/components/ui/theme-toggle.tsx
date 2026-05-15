import { useState } from "react";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light"  as const, label: "Claro",  desc: "Sempre claro",              icon: Sun,     color: "text-yellow-500" },
  { value: "dark"   as const, label: "Escuro", desc: "Sempre escuro",             icon: Moon,    color: "text-blue-400"   },
  { value: "system" as const, label: "Sistema",desc: "Segue o dispositivo", icon: Monitor, color: "text-muted-foreground" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, isDark, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const current = OPTIONS.find(o => o.value === theme) ?? OPTIONS[2];
  const Icon = current.icon;

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Selecionar tema"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-background hover:bg-muted text-sm font-medium transition-all"
      >
        <Icon className={cn("h-4 w-4 flex-shrink-0", current.color)} />
        <span className="hidden sm:block">{current.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 z-[100] w-52 bg-background border rounded-2xl shadow-xl overflow-hidden">
            <div className="px-3 pt-3 pb-2 border-b">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Aparência</p>
            </div>
            <div className="p-1.5 space-y-0.5">
              {OPTIONS.map(({ value, label, desc, icon: Ico, color }) => {
                const active = theme === value;
                return (
                  <button key={value} onClick={() => { setTheme(value); setOpen(false); }}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                      active ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground")}>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", active ? "bg-primary/20" : "bg-muted")}>
                      <Ico className={cn("h-4 w-4", active ? "text-primary" : color)} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-medium", active && "text-primary")}>{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {active && <span className="ml-auto text-primary">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground text-center">
              {isDark ? "🌙 Tema escuro ativo" : "☀️ Tema claro ativo"}
              {theme === "system" && " · sistema"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
