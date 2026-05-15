import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Thermometer,
  Droplets,
  Wind,
  Bug,
  Zap,
  Bell,
  Filter,
  Archive,
  MoreHorizontal
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  category: "weather" | "soil" | "irrigation" | "pest" | "equipment" | "maintenance";
  location: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  actions?: Array<{ label: string; action: string; }>;
}

const mockAlerts: Alert[] = [
  {
    id: "alert1",
    title: "Temperatura Crítica",
    description: "Temperatura acima de 35°C detectada no Talhão Norte. Risco de estresse térmico nas plantas.",
    severity: "critical",
    category: "weather",
    location: "Talhão Norte",
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    acknowledged: false,
    resolved: false,
    actions: [
      { label: "Ativar Irrigação", action: "irrigation" },
      { label: "Abrir Válvulas", action: "valves" }
    ]
  },
  {
    id: "alert2",
    title: "Baixa Umidade do Solo",
    description: "Umidade do solo abaixo de 40% no Talhão Central. Irrigação recomendada.",
    severity: "warning",
    category: "soil",
    location: "Talhão Central",
    timestamp: new Date(Date.now() - 900000), // 15 min ago
    acknowledged: true,
    resolved: false,
    actions: [
      { label: "Programar Irrigação", action: "schedule_irrigation" },
      { label: "Verificar Sensores", action: "check_sensors" }
    ]
  },
  {
    id: "alert3",
    title: "Manutenção Preventiva",
    description: "Sistema de irrigação setor 3 necessita manutenção preventiva programada.",
    severity: "info",
    category: "maintenance",
    location: "Setor 3",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    acknowledged: true,
    resolved: false,
    actions: [
      { label: "Agendar Manutenção", action: "schedule_maintenance" }
    ]
  },
  {
    id: "alert4",
    title: "Falha no Sensor",
    description: "Sensor de umidade S-07 não está respondendo. Verificação necessária.",
    severity: "warning",
    category: "equipment",
    location: "Talhão Sul",
    timestamp: new Date(Date.now() - 1800000), // 30 min ago
    acknowledged: false,
    resolved: false,
    actions: [
      { label: "Verificar Conectividade", action: "check_connectivity" },
      { label: "Reiniciar Sensor", action: "restart_sensor" }
    ]
  },
  {
    id: "alert5",
    title: "Previsão de Geada",
    description: "Previsão de temperatura abaixo de 2°C nas próximas 6 horas.",
    severity: "critical",
    category: "weather",
    location: "Toda a propriedade",
    timestamp: new Date(Date.now() - 600000), // 10 min ago
    acknowledged: false,
    resolved: false,
    actions: [
      { label: "Ativar Proteção", action: "frost_protection" },
      { label: "Notificar Equipe", action: "notify_team" }
    ]
  }
];

const categoryIcons = {
  weather: Wind,
  soil: Droplets,
  irrigation: Droplets,
  pest: Bug,
  equipment: Zap,
  maintenance: CheckCircle
};

const severityConfig = {
  critical: {
    color: "destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    icon: AlertTriangle
  },
  warning: {
    color: "warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    icon: AlertCircle
  },
  info: {
    color: "info",
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
    icon: Info
  }
};

export function SmartAlerts() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const [showResolved, setShowResolved] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.resolved) return false;
    if (filter === "all") return true;
    return alert.severity === filter;
  });

  const criticalCount = alerts.filter(a => a.severity === "critical" && !a.resolved).length;
  const warningCount = alerts.filter(a => a.severity === "warning" && !a.resolved).length;
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged && !a.resolved).length;

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const executeAction = (alertId: string, action: string) => {
    console.log(`Executing action: ${action} for alert: ${alertId}`);
    // Here you would implement the actual action logic
    acknowledgeAlert(alertId);
  };

  const getTimeAgo = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h atrás`;
    return `${minutes}min atrás`;
  };

  return (
    <Card className="glass-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary animate-float" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Central de Alertas Inteligente</h3>
            <p className="text-sm text-muted-foreground">Monitoramento proativo da fazenda</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <StatusBadge status="error">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {unacknowledgedCount} não reconhecidos
            </StatusBadge>
          )}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "critical" | "warning" | "info")} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">
            Todos ({filteredAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="critical" className="text-destructive">
            Críticos ({criticalCount})
          </TabsTrigger>
          <TabsTrigger value="warning" className="text-warning">
            Alertas ({warningCount})
          </TabsTrigger>
          <TabsTrigger value="info">
            Informativos
          </TabsTrigger>
        </TabsList>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Críticos Ativos</p>
                <p className="text-2xl font-bold text-destructive">
                  <AnimatedCounter value={criticalCount} />
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </Card>
          
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                <p className="text-2xl font-bold text-warning">
                  <AnimatedCounter value={warningCount} />
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-warning" />
            </div>
          </Card>
          
          <Card className="p-4 bg-info/5 border-info/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Não Reconhecidos</p>
                <p className="text-2xl font-bold text-info">
                  <AnimatedCounter value={unacknowledgedCount} />
                </p>
              </div>
              <Bell className="w-8 h-8 text-info" />
            </div>
          </Card>
        </div>

        <TabsContent value={filter} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAlerts.length} alertas encontrados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResolved(!showResolved)}
              >
                <Archive className="w-4 h-4 mr-2" />
                {showResolved ? "Ocultar Resolvidos" : "Mostrar Resolvidos"}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const config = severityConfig[alert.severity];
              const CategoryIcon = categoryIcons[alert.category];
              const SeverityIcon = config.icon;
              
              return (
                <Card 
                  key={alert.id} 
                  className={`p-4 border-l-4 ${config.borderColor} ${config.bgColor} ${
                    alert.resolved ? "opacity-60" : ""
                  } hover:bg-muted/20 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <SeverityIcon className={`w-5 h-5 text-${config.color}`} />
                        <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-foreground">{alert.title}</h4>
                          {alert.resolved && (
                            <Badge variant="outline" className="text-success border-success/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Resolvido
                            </Badge>
                          )}
                          {alert.acknowledged && !alert.resolved && (
                            <Badge variant="outline" className="text-info border-info/30">
                              Reconhecido
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(alert.timestamp)}</span>
                          </div>
                        </div>
                        
                        {alert.actions && !alert.resolved && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {alert.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => executeAction(alert.id, action.action)}
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {!alert.acknowledged && !alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reconhecer
                        </Button>
                      )}
                      
                      {!alert.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h4 className="text-lg font-semibold mb-2">Nenhum alerta encontrado</h4>
              <p className="text-sm">
                {filter === "all" 
                  ? "Não há alertas no momento. Tudo funcionando perfeitamente!"
                  : `Não há alertas do tipo "${filter}" ativos.`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}