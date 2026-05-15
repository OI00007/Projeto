import { ReactNode } from "react";
import { PageHeader } from "@/components/navigation/PageHeader";
import { getCurrentYear } from "@/lib/dateTime";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  showBackButton?: boolean;
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  actions,
  showBackButton = true 
}: DashboardLayoutProps) {
  return (
    <>
      {/* Page Header with Breadcrumbs and Back Navigation */}
      {title && (
        <div className="border-b bg-gradient-to-r from-muted/30 via-muted/20 to-transparent backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <PageHeader 
              title={title} 
              subtitle={subtitle} 
              actions={actions}
              showBackButton={showBackButton}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 p-4 sm:p-6 overflow-auto custom-scrollbar">
        <div className="entrance-slide-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 px-4 sm:px-6 py-4 sm:py-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <p className="font-medium">© {getCurrentYear()} Sistema Argom. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-y-[-2px]">Suporte</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-y-[-2px]">Documentação</a>
            <a href="#" className="hover:text-primary transition-all duration-300 hover:translate-y-[-2px]">Privacidade</a>
          </div>
        </div>
      </footer>
    </>
  );
}
