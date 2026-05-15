import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useZoneData } from "@/contexts/FarmDataContext";
import { 
  Wheat, 
  Tractor, 
  Calendar, 
  MapPin,
  TrendingUp,
  Clock,
  AlertCircle
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "bg-success/10 text-success border-success/30";
    case "good": return "bg-info/10 text-info border-info/30";
    case "warning": return "bg-warning/10 text-warning border-warning/30";
    case "critical": return "bg-destructive/10 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent": 
    case "good": return <TrendingUp className="h-3 w-3" />;
    case "warning": return <Clock className="h-3 w-3" />;
    case "critical": return <AlertCircle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

const statusLabels: Record<string, string> = {
  excellent: "Excelente",
  good: "Bom",
  warning: "Atenção",
  critical: "Crítico",
};

// Production stages mapped to zones
const productionStages: Record<string, { stage: string; progress: number; harvest: string; yield: string }> = {
  'Milho': { stage: 'Floração', progress: 75, harvest: '2024-03-15', yield: '3.2 ton/ha' },
  'Soja': { stage: 'Enchimento de grãos', progress: 65, harvest: '2024-04-20', yield: '8.5 ton/ha' },
  'Café': { stage: 'Desenvolvimento vegetativo', progress: 45, harvest: '2024-05-10', yield: '1.8 ton/ha' },
  'Pastagem': { stage: 'Crescimento', progress: 85, harvest: 'Contínuo', yield: 'N/A' },
};

export function ProductionOverview() {
  // Use shared zone data from context
  const { zones } = useZoneData();

  const totalArea = zones.reduce((sum, zone) => sum + zone.area, 0);
  const avgProgress = Math.round(
    zones.reduce((sum, zone) => {
      const production = productionStages[zone.crop];
      return sum + (production?.progress || zone.health);
    }, 0) / zones.length
  );

  return (
    <Card className="backdrop-blur-sm bg-card/95 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wheat className="h-4 w-4 text-primary" />
          Visão Geral da Produção
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            {totalArea} ha total
          </Badge>
          <Badge variant="outline" className="text-xs">
            {avgProgress}% progresso médio
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {zones.map((zone) => {
          const production = productionStages[zone.crop] || {
            stage: 'Em desenvolvimento',
            progress: zone.health,
            harvest: 'A definir',
            yield: 'A calcular',
          };
          
          return (
            <div key={zone.id} className="space-y-3 p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-primary" />
                  <span className="font-medium">{zone.crop}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(zone.status)}`}
                  >
                    {getStatusIcon(zone.status)}
                    {statusLabels[zone.status] || zone.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {zone.area} ha
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Tractor className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Estágio:</span>
                  <span>{production.stage}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Colheita:</span>
                  <span>
                    {production.harvest === 'Contínuo' 
                      ? 'Contínuo' 
                      : new Date(production.harvest).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Rendimento:</span>
                  <span>{production.yield}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Local:</span>
                  <span>{zone.name.split(' - ')[0]}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progresso do ciclo</span>
                  <span className="font-medium">{production.progress}%</span>
                </div>
                <Progress value={production.progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}