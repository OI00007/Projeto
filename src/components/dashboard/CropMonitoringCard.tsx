import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sprout, 
  Leaf, 
  BarChart3, 
  Droplets, 
  Thermometer,
  Sun,
  AlertTriangle,
  TrendingUp,
  Camera,
  Calendar
} from "lucide-react";

const cropData = [
  {
    id: "milho-a1",
    name: "Milho - Área A1",
    stage: "Floração",
    progress: 75,
    health: "Excelente",
    expectedHarvest: "15 Mar 2024",
    area: "12.5 ha",
    variety: "Pioneer 30F53",
    plantingDate: "15 Nov 2023"
  },
  {
    id: "soja-b2",
    name: "Soja - Área B2", 
    stage: "Enchimento de Grãos",
    progress: 60,
    health: "Bom",
    expectedHarvest: "25 Fev 2024",
    area: "8.3 ha",
    variety: "Monsoy M6410",
    plantingDate: "20 Set 2023"
  },
  {
    id: "feijao-c1",
    name: "Feijão - Área C1",
    stage: "Germinação",
    progress: 15,
    health: "Atenção",
    expectedHarvest: "10 Mai 2024",
    area: "5.2 ha",
    variety: "Carioca Precoce",
    plantingDate: "05 Jan 2024"
  }
];

const healthMetrics = [
  {
    metric: "Índice de Vegetação (NDVI)",
    value: 0.82,
    status: "excellent",
    trend: "+5%"
  },
  {
    metric: "Cobertura do Solo",
    value: 95,
    status: "good",
    trend: "+2%"
  },
  {
    metric: "Densidade Populacional",
    value: 87,
    status: "good", 
    trend: "stable"
  },
  {
    metric: "Estresse Hídrico",
    value: 15,
    status: "warning",
    trend: "+8%"
  }
];

const recentActivities = [
  {
    date: "Hoje 14:30",
    activity: "Aplicação de defensivo",
    area: "Milho - Área A1",
    status: "completed"
  },
  {
    date: "Ontem 09:15",
    activity: "Irrigação programada",
    area: "Soja - Área B2", 
    status: "completed"
  },
  {
    date: "25 Jan 16:45",
    activity: "Adubação de cobertura",
    area: "Feijão - Área C1",
    status: "scheduled"
  }
];

export function CropMonitoringCard() {
  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excelente": return "text-success";
      case "Bom": return "text-primary";
      case "Atenção": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "success";
      case "good": return "default";
      case "warning": return "warning";
      default: return "secondary";
    }
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Sprout className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Monitoramento de Culturas</h3>
            <p className="text-sm text-muted-foreground">Acompanhe o desenvolvimento das plantações</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Imagens Drone
        </Button>
      </div>

      <Tabs defaultValue="crops" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crops">Culturas</TabsTrigger>
          <TabsTrigger value="health">Saúde</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="space-y-4 mt-6">
          {cropData.map((crop) => (
            <div key={crop.id} className="p-4 rounded-lg border border-border hover:bg-muted/5 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{crop.name}</h4>
                  <p className="text-sm text-muted-foreground">{crop.variety} • {crop.area}</p>
                </div>
                <Badge variant="outline" className={getHealthColor(crop.health)}>
                  {crop.health}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Estágio Atual</p>
                  <p className="text-sm font-medium">{crop.stage}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Previsão Colheita</p>
                  <p className="text-sm font-medium">{crop.expectedHarvest}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do Ciclo</span>
                  <span className="font-medium">{crop.progress}%</span>
                </div>
                <Progress value={crop.progress} className="h-2" />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="health" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground">{metric.metric}</h4>
                  <Badge variant={getStatusColor(metric.status) as "default" | "secondary" | "destructive" | "outline"}>
                    {metric.status === "excellent" ? "Excelente" : 
                     metric.status === "good" ? "Bom" : 
                     metric.status === "warning" ? "Atenção" : "Regular"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">
                    {typeof metric.value === "number" ? 
                      (metric.value < 1 ? metric.value.toFixed(2) : `${metric.value}%`) : 
                      metric.value}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend.includes('+') ? 'text-success' : 
                    metric.trend.includes('-') ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {metric.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4 mt-6">
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === "completed" ? "bg-success" : "bg-warning"
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{activity.activity}</p>
                    <Badge variant={activity.status === "completed" ? "default" : "secondary"}>
                      {activity.status === "completed" ? "Concluído" : "Agendado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.area}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Calendário Completo
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
}