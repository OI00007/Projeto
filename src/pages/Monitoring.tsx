import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFarmData, useSensorData, useZoneData } from "@/contexts/FarmDataContext";
import { 
  Activity, 
  Camera, 
  Wifi, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  Eye,
  Radio,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const sensorIcons: Record<string, LucideIcon> = {
  temperature: Thermometer,
  soil_moisture: Droplets,
  wind: Wind,
  uv: Sun,
  rain: CloudRain,
  camera: Camera,
};

// SRP: Helper para resolver classes de cor sem classes dinâmicas do Tailwind
function getColorClasses(color: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    success: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
    warning: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
    destructive: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20" },
    info: { bg: "bg-info/10", text: "text-info", border: "border-info/20" },
  };
  return map[color] || map.success;
}

function getStatusColor(status: string): string {
  if (status === "online") return "success";
  if (status === "warning") return "warning";
  return "destructive";
}

export default function Monitoring() {
  const { metrics } = useFarmData();
  const { sensors } = useSensorData();
  const { zones } = useZoneData();

  const displaySensors = sensors.map(sensor => ({
    id: sensor.id,
    name: sensor.name,
    status: sensor.status,
    value: typeof sensor.value === 'number' ? `${sensor.value}${sensor.unit}` : sensor.value,
    trend: sensor.status === 'online' ? '+2%' : '-',
    icon: sensorIcons[sensor.type] || Activity,
    color: getStatusColor(sensor.status),
  }));

  const overviewStats = [
    { label: "Sensores Online", value: `${metrics.activeSensors}/${sensors.length}`, icon: Radio, color: "success" as const },
    { label: "Câmeras Ativas", value: `${sensors.filter(s => s.type === "camera" && s.status === "online").length}`, icon: Camera, color: "info" as const },
    { label: "Alertas Ativos", value: `${metrics.alertsCount}`, icon: AlertCircle, color: "warning" as const },
    { label: "Cobertura Rede", value: `${sensors.length > 0 ? Math.round((metrics.activeSensors / sensors.length) * 100) : 0}%`, icon: Wifi, color: "success" as const },
  ];

  return (
    <DashboardLayout
      title="Monitoramento em Tempo Real"
      subtitle="Acompanhe sensores IoT, câmeras e alertas da sua propriedade"
      actions={
        <div className="flex gap-3">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Histórico
          </Button>
          <Button className="gradient-primary text-white">
            <Eye className="w-4 h-4 mr-2" />
            Ver Mapa ao Vivo
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            return (
              <Card key={index} className="p-6 glass-card hover:scale-105 transition-all duration-500 border-primary/10 animate-fade-in shadow-soft hover:shadow-medium" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <Badge variant={stat.color === "success" ? "default" : stat.color === "warning" ? "secondary" : "outline"} className="animate-pulse-gentle">
                    <span className="w-2 h-2 rounded-full bg-current mr-1.5 inline-block"></span>
                    Ao Vivo
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1 font-display">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Sensors Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Sensores e Dispositivos</h2>
            <Badge className="gradient-primary text-white">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Atualizando
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySensors.map((sensor, index) => {
              const Icon = sensor.icon;
              const statusColor = getStatusColor(sensor.status);
              const statusColors = getColorClasses(statusColor);
              const sensorColors = getColorClasses(sensor.color);

              return (
                <Card key={sensor.id} className={`p-6 glass-card hover:scale-105 transition-all duration-500 ${statusColors.border} animate-slide-up shadow-soft hover:shadow-medium`} style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${sensorColors.bg} shadow-inner`}>
                      <Icon className={`w-6 h-6 ${sensorColors.text}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${statusColors.bg.replace('/10', '')} ${sensor.status === 'online' ? 'animate-pulse-gentle' : ''}`}></div>
                      <span className={`text-xs font-medium ${statusColors.text}`}>
                        {sensor.status === "online" ? "Online" : sensor.status === "warning" ? "Aviso" : "Offline"}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{sensor.name}</h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-foreground font-display">{sensor.value}</span>
                    <span className={`text-sm font-medium ${sensor.trend.startsWith('+') ? 'text-success' : sensor.trend.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {sensor.trend}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Última atualização: agora</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Zones Health */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Saúde por Zona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone, index) => (
              <Card key={zone.id} className="p-6 glass-card hover:scale-105 transition-all duration-500 animate-fade-in shadow-soft hover:shadow-medium" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{zone.name}</h3>
                    <p className="text-sm text-muted-foreground">{zone.sensors} sensores ativos</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground mb-1">{zone.health}%</div>
                    {zone.status === "excellent" && (
                      <Badge variant="default" className="bg-success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Excelente
                      </Badge>
                    )}
                    {zone.status === "good" && (
                      <Badge variant="secondary">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Bom
                      </Badge>
                    )}
                    {zone.status === "warning" && (
                      <Badge variant="outline" className="border-warning text-warning">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Atenção
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Progress value={zone.health} className="h-2 mb-3" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Alertas ativos:</span>
                  <span className={`font-semibold ${zone.alerts > 0 ? 'text-warning' : 'text-success'}`}>
                    {zone.alerts}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Feed Section */}
        <Card className="p-6 border-primary/20 shadow-medium">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Feed ao Vivo</h3>
                <p className="text-sm text-muted-foreground">Câmeras de monitoramento 24/7</p>
              </div>
            </div>
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse-gentle mr-2"></span>
              REC
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((cam) => (
              <div key={cam} className="aspect-video bg-muted rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer border border-border">
                <div className="text-center">
                  <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Câmera {cam}</p>
                  <Badge variant="outline" className="mt-2">
                    <Activity className="w-3 h-3 mr-1" />
                    Ao Vivo
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
