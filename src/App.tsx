import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { FarmDataProvider } from "@/contexts/FarmDataContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NetworkStatusBanner } from "@/components/feedback/NetworkStatusBanner";
import { Suspense, lazy } from "react";
import { DashboardShell } from "@/components/DashboardShell";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Monitoring = lazy(() => import("./pages/Monitoring"));
const Financial = lazy(() => import("./pages/Financial"));
const Equipment = lazy(() => import("./pages/Equipment"));
const CostsFields = lazy(() => import("./pages/CostsFields"));
const Fleet = lazy(() => import("./pages/Fleet"));
const SiteMap = lazy(() => import("./pages/SiteMap"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Reports = lazy(() => import("./pages/Reports"));
const AdminHub = lazy(() => import("./pages/AdminHub"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        )
          return false;
        return failureCount < 2;
      },
    },
    mutations: { retry: 0 },
  },
});

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FarmDataProvider>
            <TooltipProvider>
              <NetworkStatusBanner />
              <Toaster />
              <Sonner />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />

                  {/* Rotas protegidas — dentro do shell com sidebar */}
                  <Route element={<DashboardShell />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/monitoring" element={<Monitoring />} />
                    <Route path="/financial" element={<Financial />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/costs-fields" element={<CostsFields />} />
                    <Route path="/fleet" element={<Fleet />} />
                    <Route path="/sitemap" element={<SiteMap />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/admin" element={<AdminHub />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </TooltipProvider>
          </FarmDataProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
