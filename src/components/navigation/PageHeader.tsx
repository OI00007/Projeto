import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

// Route configuration for breadcrumbs
const routeConfig: Record<string, { label: string; parent?: string }> = {
  "/dashboard": { label: "Dashboard" },
  "/monitoring": { label: "Monitoramento", parent: "/dashboard" },
  "/financial": { label: "Financeiro", parent: "/dashboard" },
  "/ai-insights": { label: "IA & Insights", parent: "/dashboard" },
  "/equipment": { label: "Equipamentos", parent: "/dashboard" },
  "/costs-fields": { label: "Custos/Talhão", parent: "/dashboard" },
  "/fleet": { label: "Frotas", parent: "/dashboard" },
  "/tasks": { label: "Tarefas", parent: "/dashboard" },
  "/profile": { label: "Perfil", parent: "/dashboard" },
};

export function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = true, 
  actions,
  className 
}: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Build breadcrumb trail
  const buildBreadcrumbs = () => {
    const breadcrumbs: Array<{ path: string; label: string }> = [];
    let path = currentPath;
    
    while (path && routeConfig[path]) {
      breadcrumbs.unshift({ path, label: routeConfig[path].label });
      path = routeConfig[path].parent || "";
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = buildBreadcrumbs();
  const canGoBack = breadcrumbs.length > 1 || window.history.length > 1;
  
  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      navigate(breadcrumbs[breadcrumbs.length - 2].path);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumb Navigation - Fixed structure to avoid li nesting issues */}
      <div className="flex items-center gap-3">
        {showBackButton && canGoBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 shrink-0 rounded-lg hover:bg-muted/60 transition-all duration-300"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {/* Custom breadcrumb without nested li issues */}
        <nav aria-label="breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2">
            <li className="inline-flex items-center">
              <button 
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Início</span>
              </button>
            </li>
            
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path} className="inline-flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <button 
                    onClick={() => navigate(crumb.path)}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      {/* Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-display tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
