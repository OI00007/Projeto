import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap,
  Users,
  Clock,
  Target,
  Award
} from "lucide-react";

const metrics = [
  {
    id: 1,
    name: "Eficiência Operacional",
    value: 87,
    target: 90,
    trend: "up",
    change: "+5%",
    status: "good",
    description: "Performance geral das operações"
  },
  {
    id: 2,
    name: "Produtividade por Hectare",
    value: 92,
    target: 85,
    trend: "up",
    change: "+12%",
    status: "excellent",
    description: "Rendimento das culturas"
  },
  {
    id: 3,
    name: "Uso de Recursos",
    value: 78,
    target: 80,
    trend: "down",
    change: "-3%",
    status: "warning",
    description: "Otimização de insumos"
  },
  {
    id: 4,
    name: "Satisfação da Equipe",
    value: 94,
    target: 90,
    trend: "up",
    change: "+7%",
    status: "excellent",
    description: "Índice de satisfação dos trabalhadores"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "text-success bg-success/10 border-success/30";
    case "good": return "text-info bg-info/10 border-info/30";
    case "warning": return "text-warning bg-warning/10 border-warning/30";
    default: return "text-muted-foreground bg-muted border-border";
  }
};

const getIcon = (name: string) => {
  if (name.includes("Eficiência")) return <Activity className="h-4 w-4" />;
  if (name.includes("Produtividade")) return <Target className="h-4 w-4" />;
  if (name.includes("Recursos")) return <Zap className="h-4 w-4" />;
  if (name.includes("Satisfação")) return <Users className="h-4 w-4" />;
  return <Award className="h-4 w-4" />;
};

export function DashboardMetrics() {
  return (
    <Card className="backdrop-blur-sm bg-card/95 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Métricas de Performance
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Tempo real
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(metric.name)}
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${
                  metric.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  {metric.change}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{metric.description}</span>
                <span>{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Meta: {metric.target}%
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(metric.status)}`}
                >
                  {metric.status === "excellent" && "Excelente"}
                  {metric.status === "good" && "Bom"}
                  {metric.status === "warning" && "Atenção"}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}