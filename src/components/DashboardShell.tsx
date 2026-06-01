/**
 * DashboardShell — wrapper de todas as páginas autenticadas.
 * Inclui: sidebar, header com busca e notificações, onboarding e banner demo.
 */
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { NotificationSystem } from "@/components/dashboard/NotificationSystem";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { DemoBanner } from "@/components/onboarding/DemoBanner";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useDebounce } from "@/hooks/useDebounce";
import { AIChatAssistant } from "@/components/AIChatAssistant";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Monitoramento", path: "/monitoring" },
  { label: "Financeiro", path: "/financial" },
  { label: "Equipamentos", path: "/equipment" },
  { label: "Frotas", path: "/fleet" },
  { label: "Tarefas", path: "/tasks" },
  { label: "Relatórios", path: "/reports" },
  { label: "Perfil", path: "/profile" },
  { label: "Planos & Admin", path: "/admin" },
];

export function DashboardShell() {
  const navigate = useNavigate();
  const { onboarding, isLoading, goToStep } = useOnboarding();

  // Mostra wizard ao novo usuário (step === "welcome" e isDemo=true)
  // Usa sessionStorage para não reaparecer ao navegar entre páginas
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    if (!isLoading && onboarding.isDemo && onboarding.step === "welcome") {
      const alreadyShown = sessionStorage.getItem("argom_wizard_shown");
      if (!alreadyShown) {
        setShowWizard(true);
        sessionStorage.setItem("argom_wizard_shown", "1");
      }
    }
  }, [isLoading, onboarding.isDemo, onboarding.step]);

  // Busca no header
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(search, 150);

  const suggestions = debouncedSearch.trim()
    ? NAV_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : [];

  function handleSelect(path: string) {
    setSearch("");
    setShowSuggestions(false);
    navigate(path);
  }

  return (
    <ProtectedRoute>
      {/* Wizard de onboarding — aparece para novos usuários */}
      {showWizard && (
        <OnboardingWizard onComplete={() => setShowWizard(false)} />
      )}

      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-muted/10">
          <AppSidebar />

          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Banner demo — aparece quando VITE_USE_MOCK=true ou sem fazenda configurada */}
            {!isLoading &&
              onboarding.isDemo &&
              onboarding.step !== "welcome" && (
                <DemoBanner
                  onSetupFarm={() => {
                    goToStep("welcome");
                    setShowWizard(true);
                  }}
                />
              )}

            {/* Header fixo */}
            <header className="h-16 border-b bg-background/90 backdrop-blur-2xl flex items-center px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
              <SidebarTrigger className="mr-4 hover:bg-muted/60 transition-all rounded-lg" />

              <div className="flex-1 flex items-center justify-between gap-4">
                {/* Busca com autocomplete */}
                <div className="flex-1 max-w-md hidden sm:block relative">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setSearch("");
                          setShowSuggestions(false);
                        }
                      }}
                      placeholder="Buscar na plataforma… (Ctrl+K)"
                      className="pl-10 bg-muted/40 border-transparent focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 focus-visible:bg-background transition-all rounded-xl"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute top-full mt-1 left-0 w-full bg-background border rounded-xl shadow-xl z-[100] overflow-hidden">
                      {suggestions.map((item) => (
                        <li
                          key={item.path}
                          onMouseDown={() => handleSelect(item.path)}
                          className="px-4 py-2.5 text-sm cursor-pointer hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <span className="text-muted-foreground text-xs">
                            →
                          </span>
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="hidden sm:flex gap-2 px-3 py-1.5 bg-success/10 text-success border-success/20 rounded-full text-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    {onboarding.isDemo ? "Modo Demo" : "Sistema Ativo"}
                  </Badge>
                  <ThemeToggle />
                  <NotificationSystem />
                </div>
              </div>
            </header>

            {/* Conteúdo das páginas */}
            <Outlet />
          </div>

          <AIChatAssistant />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
