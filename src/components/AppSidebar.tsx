import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getCurrentHarvestYear } from "@/lib/dateTime";
import { 
  BarChart3, 
  MonitorSpeaker, 
  DollarSign, 
  Brain, 
  Wrench, 
  Calculator, 
  Truck,
  Map,
  Sprout,
  CircleDot,
  LogOut,
  User,
  Settings,
  ListTodo,
  FileText
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: BarChart3,
    description: "Visão geral" 
  },
  { 
    title: "Monitoramento", 
    url: "/monitoring", 
    icon: MonitorSpeaker,
    description: "Tempo real" 
  },
  { 
    title: "💰 Financeiro", 
    url: "/financial", 
    icon: DollarSign,
    description: "PRIORITÁRIO - Receitas e custos" 
  },
  { 
    title: "Tarefas", 
    url: "/tasks", 
    icon: ListTodo,
    description: "Gestão de atividades" 
  },
  { 
    title: "Relatórios", 
    url: "/reports", 
    icon: FileText,
    description: "Gerar e baixar PDFs" 
  },
  { 
    title: "IA & Insights", 
    url: "/ai-insights", 
    icon: Brain,
    description: "Análises inteligentes" 
  },
  { 
    title: "Equipamentos", 
    url: "/equipment", 
    icon: Wrench,
    description: "Gestão de máquinas" 
  },
  { 
    title: "Custos/Talhão", 
    url: "/costs-fields", 
    icon: Calculator,
    description: "Análise por área" 
  },
  { 
    title: "Frotas", 
    url: "/fleet", 
    icon: Truck,
    description: "Veículos e logística" 
  },
  { 
    title: "Mapa do Sistema", 
    url: "/sitemap", 
    icon: Map,
    description: "Visão geral dos módulos" 
  },
  { 
    title: "Planos & Admin", 
    url: "/admin", 
    icon: Settings,
    description: "Gestão de assinaturas" 
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isOwner = !!user?.user_metadata?.cpf;
  
  const filteredMenuItems = menuItems.filter(item => {
    if (item.url === '/admin' && !isOwner) return false;
    return true;
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className={cn("transition-all duration-500 ease-out", collapsed ? "w-16" : "w-72")}>
      <SidebarContent className="custom-scrollbar">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6 group">
            <div className="p-2.5 rounded-xl gradient-primary text-primary-foreground shadow-glow transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
              <Sprout className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="entrance-fade">
                <h2 className="text-xl font-bold text-gradient tracking-tight">Argom</h2>
                <div className="flex items-center gap-1.5">
                  <CircleDot className="h-3 w-3 text-success animate-pulse-gentle" />
                  <span className="text-xs text-success font-semibold">Online</span>
                </div>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-primary/15 shadow-soft hover:shadow-medium transition-all duration-500 hover:border-primary/25 entrance-scale">
              <div className="text-sm font-bold text-foreground mb-1">Fazenda São João</div>
              <div className="text-xs text-muted-foreground mb-3">300 hectares • 4 culturas</div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs rounded-full px-3">
                  {getCurrentHarvestYear()}
                </Badge>
                <div className="text-xs text-success font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  98% ativo
                </div>
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider px-4">
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {filteredMenuItems.map((item, index) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 0.05}s` }} className="entrance-fade">
                     <SidebarMenuButton asChild>
                       <NavLink 
                        to={item.url} 
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-500 ease-out group relative overflow-hidden",
                          active 
                            ? "gradient-primary text-primary-foreground shadow-glow" 
                            : "hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/40 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-all duration-500",
                          active ? "text-primary-foreground scale-110" : "group-hover:scale-110 group-hover:text-primary"
                        )} />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm">{item.title}</div>
                            <div className="text-xs opacity-70 truncate">{item.description}</div>
                          </div>
                        )}
                        {active && (
                          <div className="absolute right-3 w-2 h-2 rounded-full bg-primary-foreground/80 animate-pulse"></div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto p-4">
            <div className="p-4 rounded-xl bg-gradient-card border border-primary/10 shadow-soft">
              <div className="text-xs font-semibold text-foreground mb-3">Status do Sistema</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sensores ativos</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse-gentle"></div>
                    <span className="text-success font-medium">24/24</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Sincronização</span>
                  <span className="text-foreground font-medium">2 min atrás</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="text-success font-medium">Ótima</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        {!collapsed && (
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground">Agricultor</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/profile')}
            className={cn(
              "transition-smooth hover:bg-gradient-card",
              collapsed ? 'px-2' : 'w-full justify-start'
            )}
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Configurações</span>}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSignOut}
            className={cn(
              "transition-smooth hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30",
              collapsed ? 'px-2' : 'w-full justify-start'
            )}
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}