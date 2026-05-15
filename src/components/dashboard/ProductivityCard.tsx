import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

const crops = [
  { 
    name: "Soja", 
    yield: 30, 
    area: 120, 
    total: 3600, 
    unit: "ton/ha", 
    color: "success",
    trend: "+8%",
    lastYear: 28,
    efficiency: 95,
    plantingDate: "2024-10-15",
    harvestDate: "2025-03-15"
  },
  { 
    name: "Milho", 
    yield: 60, 
    area: 80, 
    total: 4800, 
    unit: "ton/ha", 
    color: "warning",
    trend: "+12%",
    lastYear: 55,
    efficiency: 88,
    plantingDate: "2024-09-20",
    harvestDate: "2025-02-20"
  },
  { 
    name: "Algodão", 
    yield: 30, 
    area: 60, 
    total: 1800, 
    unit: "ton/ha", 
    color: "info",
    trend: "-3%",
    lastYear: 32,
    efficiency: 82,
    plantingDate: "2024-12-01",
    harvestDate: "2025-06-01"
  },
  { 
    name: "Feijão", 
    yield: 20, 
    area: 40, 
    total: 800, 
    unit: "ton/ha", 
    color: "primary",
    trend: "+15%",
    lastYear: 18,
    efficiency: 92,
    plantingDate: "2024-11-10",
    harvestDate: "2025-04-10"
  },
];

const monthlyData = [
  { month: "Jan", soja: 0, milho: 800, algodao: 0, feijao: 0 },
  { month: "Fev", soja: 0, milho: 1200, algodao: 0, feijao: 0 },
  { month: "Mar", soja: 1800, milho: 0, algodao: 0, feijao: 0 },
  { month: "Abr", soja: 1800, milho: 0, algodao: 0, feijao: 800 },
  { month: "Mai", soja: 0, milho: 0, algodao: 0, feijao: 0 },
  { month: "Jun", soja: 0, milho: 0, algodao: 1800, feijao: 0 },
];

export function ProductivityCard() {
  const maxTotal = Math.max(...crops.map(crop => crop.total));
  const totalProduction = crops.reduce((sum, crop) => sum + crop.total, 0);
  const averageEfficiency = crops.reduce((sum, crop) => sum + crop.efficiency, 0) / crops.length;

  return (
    <Card className="glass-elevated p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary animate-float" />
          <h3 className="text-lg font-semibold text-foreground">Produtividade & Performance</h3>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          <TrendingUp className="w-3 h-3 mr-1" />
          +8.5% vs ano anterior
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes por Cultura</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produção Total</p>
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={totalProduction} suffix=" ton" />
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Eficiência Média</p>
                  <p className="text-2xl font-bold text-foreground">
                    <AnimatedCounter value={averageEfficiency} suffix="%" decimals={1} />
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-success" />
              </div>
            </div>
          </div>

          {/* Crops Progress */}
          <div className="space-y-4">
            {crops.map((crop, index) => {
              const percentage = (crop.total / maxTotal) * 100;
              const isPositiveTrend = crop.trend.startsWith('+');
              
              return (
                <div key={index} className="space-y-3 p-4 rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-${crop.color} animate-pulse-gentle`}></div>
                      <span className="font-medium text-foreground">{crop.name}</span>
                      <Badge variant="outline" className={isPositiveTrend ? "text-success" : "text-warning"}>
                        {isPositiveTrend ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {crop.trend}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        <AnimatedCounter value={crop.yield} suffix={` ${crop.unit}`} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {crop.area} ha • {crop.total.toLocaleString()} ton total
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Progress value={percentage} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Eficiência: {crop.efficiency}%</span>
                      <span>{percentage.toFixed(1)}% da produção total</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {crops.map((crop, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${crop.color}`}></div>
                  {crop.name}
                </h4>
                <Badge variant="outline">
                  Eficiência: {crop.efficiency}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Rendimento Atual</p>
                  <p className="font-semibold text-foreground">{crop.yield} {crop.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ano Anterior</p>
                  <p className="font-semibold text-foreground">{crop.lastYear} {crop.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Área Plantada</p>
                  <p className="font-semibold text-foreground">{crop.area} hectares</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Produção Total</p>
                  <p className="font-semibold text-foreground">{crop.total.toLocaleString()} ton</p>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {crops.map((crop, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${crop.color}`}></div>
                    {crop.name}
                  </h4>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <div>
                      <p className="text-muted-foreground">Plantio</p>
                      <p className="font-medium text-foreground">
                        {new Date(crop.plantingDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <div>
                      <p className="text-muted-foreground">Colheita Prevista</p>
                      <p className="font-medium text-foreground">
                        {new Date(crop.harvestDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Progresso da safra</span>
                    <span className="text-xs text-muted-foreground">{crop.efficiency}%</span>
                  </div>
                  <Progress value={crop.efficiency} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}