import { DashboardLayout } from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, MonitorSpeaker, DollarSign, Brain, Wrench, Calculator, Truck,
  Home, Shield, User, ListTodo, LogIn, Sprout, Thermometer, Droplets,
  Wind, MapPin, TrendingUp, TrendingDown, PieChart, Wallet, FileText,
  AlertTriangle, Cog, Database, Cpu, Cloud, Bot, Eye, Bell,
  ChevronRight, Settings, Calendar, Package, Fuel, Search, ZoomIn, ZoomOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useRef, useMemo } from "react";

interface MapNode {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  route?: string;
  children?: MapNode[];
}

const siteStructure: MapNode = {
  id: "root",
  label: "ARGOM",
  icon: Sprout,
  color: "hsl(140, 68%, 32%)",
  children: [
    {
      id: "public",
      label: "Páginas Públicas",
      icon: Home,
      color: "hsl(42, 88%, 58%)",
      children: [
        { id: "landing", label: "Landing Page", icon: Home, color: "hsl(42, 88%, 58%)", route: "/" },
        { id: "auth", label: "Autenticação", icon: LogIn, color: "hsl(42, 75%, 50%)", route: "/auth",
          children: [
            { id: "login", label: "Login", icon: Shield, color: "hsl(42, 65%, 45%)" },
            { id: "signup", label: "Cadastro", icon: User, color: "hsl(42, 65%, 45%)" },
          ]
        },
      ]
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      color: "hsl(140, 68%, 32%)",
      route: "/dashboard",
      children: [
        { id: "metrics", label: "Métricas Real-time", icon: TrendingUp, color: "hsl(140, 55%, 42%)" },
        { id: "weather-widget", label: "Clima", icon: Cloud, color: "hsl(200, 65%, 50%)" },
        { id: "production", label: "Produção", icon: PieChart, color: "hsl(140, 55%, 42%)" },
        { id: "alerts-card", label: "Alertas", icon: Bell, color: "hsl(0, 72%, 52%)" },
      ]
    },
    {
      id: "monitoring",
      label: "Monitoramento",
      icon: MonitorSpeaker,
      color: "hsl(200, 65%, 50%)",
      route: "/monitoring",
      children: [
        { id: "sensors", label: "Sensores IoT", icon: Cpu, color: "hsl(200, 55%, 45%)",
          children: [
            { id: "temp", label: "Temperatura", icon: Thermometer, color: "hsl(0, 60%, 55%)" },
            { id: "humidity", label: "Umidade", icon: Droplets, color: "hsl(200, 70%, 55%)" },
            { id: "wind", label: "Vento", icon: Wind, color: "hsl(180, 50%, 50%)" },
          ]
        },
        { id: "farm-map", label: "Mapa Interativo", icon: MapPin, color: "hsl(200, 55%, 45%)" },
        { id: "env-chart", label: "Gráficos Ambientais", icon: BarChart3, color: "hsl(200, 55%, 45%)" },
      ]
    },
    {
      id: "financial",
      label: "Financeiro",
      icon: DollarSign,
      color: "hsl(118, 48%, 45%)",
      route: "/financial",
      children: [
        { id: "transactions", label: "Transações", icon: Wallet, color: "hsl(118, 40%, 40%)",
          children: [
            { id: "income", label: "Receitas", icon: TrendingUp, color: "hsl(118, 50%, 50%)" },
            { id: "expense", label: "Despesas", icon: TrendingDown, color: "hsl(0, 60%, 55%)" },
          ]
        },
        { id: "budget", label: "Orçamento", icon: Calculator, color: "hsl(118, 40%, 40%)" },
        { id: "cashflow", label: "Fluxo de Caixa", icon: TrendingUp, color: "hsl(118, 40%, 40%)" },
        { id: "profitability", label: "Rentabilidade", icon: PieChart, color: "hsl(118, 40%, 40%)" },
        { id: "fin-insights", label: "Insights IA", icon: Brain, color: "hsl(270, 55%, 55%)" },
      ]
    },
    {
      id: "ai-insights",
      label: "IA & Insights",
      icon: Brain,
      color: "hsl(270, 55%, 55%)",
      route: "/ai-insights",
      children: [
        { id: "predictions", label: "Predições", icon: Eye, color: "hsl(270, 45%, 50%)" },
        { id: "recommendations", label: "Recomendações", icon: Bot, color: "hsl(270, 45%, 50%)" },
        { id: "chat-assistant", label: "Chat IA", icon: Bot, color: "hsl(270, 45%, 50%)" },
      ]
    },
    {
      id: "tasks",
      label: "Tarefas",
      icon: ListTodo,
      color: "hsl(32, 85%, 52%)",
      route: "/tasks",
      children: [
        { id: "task-list", label: "Lista", icon: ListTodo, color: "hsl(32, 70%, 45%)" },
        { id: "task-priority", label: "Prioridades", icon: AlertTriangle, color: "hsl(32, 70%, 45%)" },
        { id: "task-calendar", label: "Calendário", icon: Calendar, color: "hsl(32, 70%, 45%)" },
      ]
    },
    {
      id: "equipment",
      label: "Equipamentos",
      icon: Wrench,
      color: "hsl(210, 50%, 50%)",
      route: "/equipment",
      children: [
        { id: "machinery", label: "Maquinário", icon: Cog, color: "hsl(210, 40%, 45%)" },
        { id: "maintenance", label: "Manutenção", icon: Settings, color: "hsl(210, 40%, 45%)" },
      ]
    },
    {
      id: "costs-fields",
      label: "Custos/Talhão",
      icon: Calculator,
      color: "hsl(340, 55%, 50%)",
      route: "/costs-fields",
      children: [
        { id: "cost-analysis", label: "Análise de Custos", icon: PieChart, color: "hsl(340, 45%, 45%)" },
        { id: "field-mgmt", label: "Gestão de Talhões", icon: MapPin, color: "hsl(340, 45%, 45%)" },
      ]
    },
    {
      id: "fleet",
      label: "Frotas",
      icon: Truck,
      color: "hsl(160, 50%, 42%)",
      route: "/fleet",
      children: [
        { id: "vehicles", label: "Veículos", icon: Truck, color: "hsl(160, 40%, 38%)" },
        { id: "fuel-control", label: "Combustível", icon: Fuel, color: "hsl(160, 40%, 38%)" },
      ]
    },
    {
      id: "infra",
      label: "Infraestrutura",
      icon: Database,
      color: "hsl(0, 0%, 45%)",
      children: [
        { id: "supabase", label: "Supabase", icon: Database, color: "hsl(150, 55%, 40%)",
          children: [
            { id: "auth-svc", label: "Auth (JWT)", icon: Shield, color: "hsl(150, 45%, 35%)" },
            { id: "rls", label: "RLS", icon: Shield, color: "hsl(150, 45%, 35%)" },
            { id: "edge-fn", label: "Edge Functions", icon: Cpu, color: "hsl(150, 45%, 35%)" },
          ]
        },
        { id: "export", label: "Exportação", icon: FileText, color: "hsl(0, 0%, 45%)" },
        { id: "commodities", label: "Commodities", icon: TrendingUp, color: "hsl(0, 0%, 45%)" },
      ]
    },
    {
      id: "profile",
      label: "Perfil",
      icon: User,
      color: "hsl(28, 45%, 45%)",
      route: "/profile",
      children: [
        { id: "user-data", label: "Dados Pessoais", icon: User, color: "hsl(28, 35%, 40%)" },
        { id: "preferences", label: "Preferências", icon: Settings, color: "hsl(28, 35%, 40%)" },
      ]
    },
  ]
};

/* ─── Whimsical-style Node ─── */
function WhimsicalNode({
  node,
  depth = 0,
  onNavigate,
}: {
  node: MapNode;
  depth?: number;
  onNavigate: (route: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon;
  const isRoot = depth === 0;

  const handleClick = useCallback(() => {
    if (node.route) {
      onNavigate(node.route);
    } else if (hasChildren) {
      setExpanded(prev => !prev);
    }
  }, [node.route, hasChildren, onNavigate]);

  return (
    <div className={`flex items-start ${isRoot ? '' : 'ml-1'}`}>
      {/* Horizontal connector */}
      {depth > 0 && (
        <svg width="28" height="40" className="shrink-0 -mr-px" style={{ marginTop: isRoot ? 0 : 2 }}>
          <path
            d="M0,20 C14,20 14,20 28,20"
            stroke={node.color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      )}

      <div className="flex flex-col">
        {/* The node bubble */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: depth * 0.03, duration: 0.25, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.06, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className={`
            relative flex items-center gap-2 rounded-xl
            border-2 transition-shadow duration-200 cursor-pointer
            text-left whitespace-nowrap select-none
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
            ${isRoot
              ? 'px-5 py-3 text-base font-bold shadow-lg'
              : depth === 1
                ? 'px-3.5 py-2 text-sm font-semibold shadow-md'
                : 'px-2.5 py-1.5 text-xs font-medium shadow-sm'
            }
          `}
          style={{
            borderColor: node.color,
            backgroundColor: `${node.color}12`,
            color: node.color,
            boxShadow: isRoot
              ? `0 8px 32px ${node.color}25, 0 2px 8px ${node.color}15`
              : depth === 1
                ? `0 4px 16px ${node.color}18`
                : `0 2px 8px ${node.color}10`,
          }}
          title={node.route ? `Ir para ${node.label}` : hasChildren ? 'Expandir/Recolher' : node.label}
        >
          <div
            className={`shrink-0 rounded-lg flex items-center justify-center ${isRoot ? 'w-8 h-8' : depth === 1 ? 'w-6 h-6' : 'w-5 h-5'}`}
            style={{ backgroundColor: `${node.color}20` }}
          >
            <Icon className={`${isRoot ? 'h-5 w-5' : depth === 1 ? 'h-3.5 w-3.5' : 'h-3 w-3'}`} style={{ color: node.color }} />
          </div>
          <span>{node.label}</span>
          {hasChildren && (
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
              style={{ color: node.color }}
            />
          )}
          {node.route && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-bold"
              style={{ backgroundColor: node.color, color: 'white' }}
            >
              ↗
            </span>
          )}
        </motion.button>

        {/* Children with animated vertical branch */}
        <AnimatePresence>
          {hasChildren && expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="relative mt-0.5"
            >
              {/* Vertical branch line */}
              <svg
                className="absolute left-4 top-0"
                width="4"
                height="100%"
                style={{ zIndex: 0 }}
              >
                <line
                  x1="2" y1="0" x2="2" y2="100%"
                  stroke={node.color}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.25"
                />
              </svg>

              <div className="flex flex-col gap-1 pl-3 pt-1">
                {node.children!.map((child, i) => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <WhimsicalNode
                      node={child}
                      depth={depth + 1}
                      onNavigate={onNavigate}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Grid Card ─── */
function ModuleCard({ module, onNavigate }: { module: MapNode; onNavigate: (r: string) => void }) {
  const Icon = module.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${module.color}20` }}
      transition={{ duration: 0.3 }}
      onClick={() => module.route && onNavigate(module.route)}
      className={`bg-card rounded-2xl border-2 p-5 transition-all duration-300 ${module.route ? 'cursor-pointer' : ''}`}
      style={{ borderColor: `${module.color}35` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="p-2.5 rounded-xl"
          style={{ backgroundColor: `${module.color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: module.color }} />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-sm">{module.label}</h3>
          {module.route && (
            <span className="text-[10px] text-muted-foreground">{module.route}</span>
          )}
        </div>
      </div>
      {module.children && (
        <ul className="space-y-1.5">
          {module.children.map((child) => {
            const ChildIcon = child.icon;
            return (
              <li key={child.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: child.color }}
                />
                <ChildIcon className="h-3 w-3 shrink-0 opacity-60" style={{ color: child.color }} />
                <span>{child.label}</span>
                {child.children && (
                  <span className="text-[9px] opacity-40 bg-muted px-1 rounded">
                    +{child.children.length}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

/* ─── Search + Filter Bar ─── */
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Buscar módulo..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
  );
}

/* ─── Main Page ─── */
export default function SiteMap() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Filter tree for search
  const filteredStructure = useMemo(() => {
    if (!search.trim()) return siteStructure;

    const filterNode = (node: MapNode): MapNode | null => {
      const matchesSelf = node.label.toLowerCase().includes(search.toLowerCase());
      const filteredChildren = node.children?.map(filterNode).filter(Boolean) as MapNode[] | undefined;

      if (matchesSelf || (filteredChildren && filteredChildren.length > 0)) {
        return { ...node, children: filteredChildren || node.children };
      }
      return null;
    };

    return filterNode(siteStructure) || siteStructure;
  }, [search]);

  const totalNodes = useMemo(() => {
    let count = 0;
    const countNodes = (node: MapNode) => {
      count++;
      node.children?.forEach(countNodes);
    };
    countNodes(siteStructure);
    return count;
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-5 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              Mapa do Sistema
            </h1>
            <p className="text-muted-foreground text-sm mt-1 ml-[52px]">
              Arquitetura completa do ARGOM — {totalNodes} componentes
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SearchBar value={search} onChange={setSearch} />
            
            {/* Zoom controls (tree only) */}
            {viewMode === 'tree' && (
              <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                <button
                  onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground w-10 text-center font-medium">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* View mode toggle */}
            <div className="flex bg-card border border-border rounded-xl p-1">
              {(['tree', 'grid'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {mode === 'tree' ? 'Árvore' : 'Grade'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-card/50 border border-border/50 rounded-xl px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary flex items-center justify-center text-[7px] text-primary-foreground font-bold">↗</span>
            Navegável
          </span>
          <span className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            Expandível
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-muted-foreground/30 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 3px, transparent 3px, transparent 6px)' }} />
            Subnível
          </span>
        </div>

        {viewMode === 'tree' ? (
          <div
            ref={containerRef}
            className="bg-card rounded-2xl border border-border p-6 md:p-8 overflow-auto shadow-sm min-h-[400px]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 1px 1px, hsl(var(--border) / 0.3) 1px, transparent 0)
              `,
              backgroundSize: '24px 24px',
            }}
          >
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s ease' }}
            >
              <WhimsicalNode node={filteredStructure} onNavigate={handleNavigate} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {siteStructure.children
              ?.filter(m => !search || m.label.toLowerCase().includes(search.toLowerCase()) ||
                m.children?.some(c => c.label.toLowerCase().includes(search.toLowerCase())))
              .map((module) => (
                <ModuleCard key={module.id} module={module} onNavigate={handleNavigate} />
              ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Módulos", value: siteStructure.children?.length || 0, color: "hsl(140, 68%, 32%)" },
            { label: "Páginas", value: 11, color: "hsl(200, 65%, 50%)" },
            { label: "Edge Functions", value: 4, color: "hsl(270, 55%, 55%)" },
            { label: "Tabelas (DB)", value: 8, color: "hsl(118, 48%, 45%)" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-card rounded-xl border border-border p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
