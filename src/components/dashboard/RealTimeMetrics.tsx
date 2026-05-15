import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useFarmData } from "@/contexts/FarmDataContext";
import { Activity, Cpu, Database, Wifi } from "lucide-react";

export function RealTimeMetrics() {
  // Use shared context data
  const { metrics, sensors, lastUpdated } = useFarmData();
  
  // Calculate percentages from metrics
  const totalSensors = sensors.length || 1;
  const cpuUsage = Math.round((metrics.activeSensors / totalSensors) * 100) || 45;
  const memoryUsage = 62;
  const storageUsage = 78;
  const networkUsage = sensors.length > 0 ? Math.round((metrics.activeSensors / sensors.length) * 100) : 95;
  const uptime = 99.9;

  return (
    <Card className="glass-elevated p-6 animate-bounce-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Sistema em Tempo Real</h3>
        <StatusBadge status="online">
          <Activity className="w-3 h-3 mr-1" />
          Ativo
        </StatusBadge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <div className="flex flex-col items-center space-y-3">
          <ProgressRing 
            progress={cpuUsage} 
            variant={cpuUsage > 70 ? "warning" : "success"}
            size="md"
          >
            <Cpu className="w-5 h-5 text-primary" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">CPU</p>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={cpuUsage} suffix="%" />
            </p>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="flex flex-col items-center space-y-3">
          <ProgressRing 
            progress={memoryUsage} 
            variant={memoryUsage > 80 ? "warning" : "info"}
            size="md"
          >
            <Database className="w-5 h-5 text-info" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Memória</p>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={memoryUsage} suffix="%" />
            </p>
          </div>
        </div>

        {/* Storage */}
        <div className="flex flex-col items-center space-y-3">
          <ProgressRing 
            progress={storageUsage} 
            variant="warning"
            size="md"
          >
            <Database className="w-5 h-5 text-warning" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Armazenamento</p>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={storageUsage} suffix="%" />
            </p>
          </div>
        </div>

        {/* Network */}
        <div className="flex flex-col items-center space-y-3">
          <ProgressRing 
            progress={networkUsage} 
            variant="success"
            size="md"
          >
            <Wifi className="w-5 h-5 text-success" />
          </ProgressRing>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Rede</p>
            <p className="text-xs text-muted-foreground">
              <AnimatedCounter value={networkUsage} suffix="%" />
            </p>
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Tempo de Atividade</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-success">
              <AnimatedCounter value={uptime} decimals={1} suffix="%" />
            </span>
            <StatusBadge status="online" showDot={false}>
              Excelente
            </StatusBadge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Última atualização: {lastUpdated?.toLocaleTimeString() || new Date().toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
}