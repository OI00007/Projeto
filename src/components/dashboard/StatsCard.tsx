import { ReactNode, useState } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, BarChart3, History } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  variant?: "default" | "success" | "warning" | "info" | "premium";
  className?: string;
  target?: number;
  historical?: Array<{ period: string; value: number }>;
  details?: {
    description: string;
    metrics?: Array<{ label: string; value: string | number; status?: "good" | "warning" | "critical" }>;
  };
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
  className,
  target,
  historical = [],
  details,
}: StatsCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Convert trend string to trend object for MetricCard
  const trendData = trend ? {
    value: parseFloat(trend.replace(/[^\d.-]/g, '')) || 0,
    period: trend.includes('ontem') ? 'desde ontem' : 'vs período anterior'
  } : undefined;

  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  const targetProgress = target && numericValue ? (numericValue / target) * 100 : 0;

  const getStatusBadge = (status: string) => {
    const variants = {
      good: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      critical: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return variants[status as keyof typeof variants] || "";
  };

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogTrigger asChild>
        <div className="cursor-pointer transition-transform hover:scale-105">
          <MetricCard
            title={title}
            value={value}
            subtitle={subtitle}
            icon={icon}
            trend={trendData}
            variant={variant}
            className={className}
            animated={true}
          />
        </div>
      </DialogTrigger>
      
      {details && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {icon}
              {title} - Detalhes
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="target">Meta</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="text-center p-6 bg-muted/5 rounded-lg">
                <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
                <p className="text-sm text-muted-foreground">{details.description}</p>
                {trendData && (
                  <div className={`flex items-center justify-center gap-1 mt-2 ${
                    trendData.value >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {trendData.value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="text-sm font-medium">{Math.abs(trendData.value)}% {trendData.period}</span>
                  </div>
                )}
              </div>
              
              {details.metrics && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Métricas Detalhadas</h4>
                  {details.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{metric.value}</span>
                        {metric.status && (
                          <Badge className={getStatusBadge(metric.status)}>
                            {metric.status === 'good' ? 'Bom' : metric.status === 'warning' ? 'Atenção' : 'Crítico'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="target" className="space-y-4">
              {target ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-medium">Meta: {target}</span>
                    </div>
                    <Badge variant={targetProgress >= 100 ? "default" : targetProgress >= 80 ? "secondary" : "outline"}>
                      {targetProgress.toFixed(1)}%
                    </Badge>
                  </div>
                  <Progress value={Math.min(targetProgress, 100)} className="h-3" />
                  <div className="text-center text-sm text-muted-foreground">
                    {targetProgress >= 100 ? 'Meta alcançada!' : 
                     targetProgress >= 80 ? 'Próximo da meta' : 
                     'Progresso em andamento'}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma meta definida para esta métrica</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              {historical.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="h-5 w-5 text-primary" />
                    <span className="font-medium">Histórico dos Últimos Períodos</span>
                  </div>
                  {historical.map((period, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/5 rounded-lg">
                      <span className="text-sm text-muted-foreground">{period.period}</span>
                      <span className="font-medium text-foreground">{period.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Dados históricos não disponíveis</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      )}
    </Dialog>
  );
}