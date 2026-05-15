import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Bug, CloudSnow, Settings, Droplets, Clock, 
  AlertTriangle, CheckCircle, X, Bell, BellOff,
  Filter, Search, MapPin, Calendar, User
} from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "Praga",
    title: "Lagarta Detectada",
    message: "Lagarta detectada no talhão 3 - Setor Norte",
    description: "Análise de imagem por drone identificou presença de lagartas em aproximadamente 15% da área. Recomenda-se aplicação imediata de defensivo.",
    time: "2h atrás",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    severity: "critical",
    icon: Bug,
    location: "Talhão 3 - Setor Norte",
    responsible: "João Silva",
    resolved: false,
    actions: ["Aplicar defensivo", "Monitorar evolução", "Agendar nova inspeção"]
  },
  {
    id: 2,
    type: "Clima", 
    title: "Alerta de Geada",
    message: "Previsão de geada para amanhã",
    description: "Temperatura mínima prevista de -2°C. Alto risco para culturas sensíveis. Medidas preventivas devem ser implementadas.",
    time: "4h atrás",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    severity: "warning",
    icon: CloudSnow,
    location: "Toda propriedade",
    responsible: "Maria Santos",
    resolved: false,
    actions: ["Ativar sistema anti-geada", "Cobrir culturas sensíveis", "Monitorar temperatura"]
  },
  {
    id: 3,
    type: "Equipamento",
    title: "Manutenção Preventiva",
    message: "Drone 02 precisa de manutenção",
    description: "Tempo de voo acumulado atingiu limite para manutenção preventiva. Verificar hélices, bateria e câmera.",
    time: "1d atrás",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    severity: "info",
    icon: Settings,
    location: "Hangar",
    responsible: "Carlos Tech",
    resolved: false,
    actions: ["Agendar manutenção", "Verificar peças", "Atualizar log"]
  },
  {
    id: 4,
    type: "Irrigação",
    title: "Umidade Baixa",
    message: "Umidade baixa no setor B",
    description: "Sensores indicam umidade do solo em 35%, abaixo do ideal (45-65%). Verificar sistema de irrigação.",
    time: "6h atrás",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    severity: "warning",
    icon: Droplets,
    location: "Setor B",
    responsible: "Ana Campos",
    resolved: false,
    actions: ["Ativar irrigação", "Verificar bicos", "Calibrar sensores"]
  },
];

export function AlertsCard() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === "all" || alert.severity === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const warningCount = alerts.filter(a => a.severity === "warning").length;
  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  const getSeverityIcon = (severity: string) => {
    if (severity === "critical") return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (severity === "warning") return <AlertTriangle className="h-4 w-4 text-warning" />;
    return <AlertTriangle className="h-4 w-4 text-primary" />;
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "border-l-destructive bg-destructive/5 hover:bg-destructive/10",
      warning: "border-l-warning bg-warning/5 hover:bg-warning/10",
      info: "border-l-primary bg-primary/5 hover:bg-primary/10",
    };
    return colors[severity as keyof typeof colors];
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">Sistema de Alertas</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="p-2"
          >
            {notificationsEnabled ? 
              <Bell className="h-4 w-4 text-primary" /> : 
              <BellOff className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            {criticalCount} críticos
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            {warningCount} avisos
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="critical">Críticos</SelectItem>
            <SelectItem value="warning">Avisos</SelectItem>
            <SelectItem value="info">Informativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/5 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{unresolvedCount}</div>
          <div className="text-xs text-muted-foreground">Não Resolvidos</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{filteredAlerts.length}</div>
          <div className="text-xs text-muted-foreground">Total Visível</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{alerts.length}</div>
          <div className="text-xs text-muted-foreground">Total Geral</div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.map((alert) => {
          const IconComponent = alert.icon;
          
          return (
            <Dialog key={alert.id}>
              <DialogTrigger asChild>
                <div className={`border-l-4 pl-4 py-3 rounded-r-lg cursor-pointer transition-all ${getSeverityColor(alert.severity)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{alert.title}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {alert.responsible}
                        </div>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Badge variant="outline">
                        Pendente
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {alert.title}
                    {getSeverityIcon(alert.severity)}
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="actions">Ações</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/5 rounded-lg">
                        <h4 className="font-medium mb-2">Descrição Completa</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Localização</label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {alert.location}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Responsável</label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {alert.responsible}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Data/Hora</label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {alert.timestamp.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Severidade</label>
                          <Badge className={alert.severity === 'critical' ? 'bg-destructive/10 text-destructive' : 
                                          alert.severity === 'warning' ? 'bg-warning/10 text-warning' : 
                                          'bg-primary/10 text-primary'}>
                            {alert.severity === 'critical' ? 'Crítico' : 
                             alert.severity === 'warning' ? 'Aviso' : 'Informativo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="actions" className="space-y-4">
                    <div className="space-y-4">
                      <h4 className="font-medium">Ações Recomendadas</h4>
                      <div className="space-y-2">
                        {alert.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/5 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm flex-1">{action}</span>
                            <Button variant="outline" size="sm">
                              Executar
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Marcar como resolvido</label>
                          <Switch />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Observações</label>
                          <Textarea placeholder="Adicione observações sobre a resolução..." />
                        </div>
                        
                        <Button className="w-full">
                          Salvar Progresso
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </Card>
  );
}