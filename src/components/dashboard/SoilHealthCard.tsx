import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, MapPin } from "lucide-react";

export function SoilHealthCard() {
  const soilData = {
    ph: 6.8,
    temperature: 24,
    nutrients: {
      nitrogen: { value: 15, unit: "ppm", percentage: 75, trend: "up" },
      phosphorus: { value: 8, unit: "ppm", percentage: 60, trend: "down" },
      potassium: { value: 22, unit: "ppm", percentage: 85, trend: "up" },
    },
    moisture: { value: 65, percentage: 65, status: "ideal" },
    organicMatter: { value: 3.2, percentage: 80, status: "good" }
  };

  const fieldAnalysis = [
    { field: "Talhão A", ph: 6.9, moisture: 68, nutrients: 78, status: "excellent" },
    { field: "Talhão B", ph: 6.5, moisture: 62, nutrients: 65, status: "good" },
    { field: "Talhão C", ph: 7.1, moisture: 71, nutrients: 82, status: "excellent" },
    { field: "Talhão D", ph: 6.3, moisture: 58, nutrients: 55, status: "attention" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-success";
      case "good": return "text-primary";
      case "attention": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Saúde do Solo</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Histórico
          </Button>
          <Button variant="ghost" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            Mapa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="fields">Por Talhão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          {/* Main metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">pH do Solo</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Ideal
                </Badge>
              </div>
              <div className="text-2xl font-bold text-success mt-1">{soilData.ph}</div>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Temperatura</span>
                <span className="text-xs text-muted-foreground">°C</span>
              </div>
              <div className="text-2xl font-bold text-primary mt-1">{soilData.temperature}°C</div>
            </div>
          </div>
          
          {/* Nutrients */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Nutrientes (NPK)</h4>
            
            {Object.entries(soilData.nutrients).map(([key, nutrient]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    {key.charAt(0).toUpperCase()}: {nutrient.value} {nutrient.unit}
                    {nutrient.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-warning" />
                    )}
                  </span>
                  <span className="text-foreground font-medium">{nutrient.percentage}%</span>
                </div>
                <Progress value={nutrient.percentage} className="h-2" />
              </div>
            ))}
          </div>

          {/* Additional metrics */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Umidade</span>
                <span className="text-foreground">{soilData.moisture.value}%</span>
              </div>
              <Progress value={soilData.moisture.percentage} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Matéria Orgânica</span>
                <span className="text-foreground">{soilData.organicMatter.value}%</span>
              </div>
              <Progress value={soilData.organicMatter.percentage} className="h-2" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="fields" className="space-y-3">
          {fieldAnalysis.map((field, index) => (
            <div key={index} className="p-3 rounded-lg border bg-muted/5 hover:bg-muted/10 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">{field.field}</span>
                <Badge variant="outline" className={getStatusColor(field.status)}>
                  {field.status === "excellent" ? "Excelente" : 
                   field.status === "good" ? "Bom" : "Atenção"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground">pH</div>
                  <div className="font-bold">{field.ph}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Umidade</div>
                  <div className="font-bold">{field.moisture}%</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Nutrientes</div>
                  <div className="font-bold">{field.nutrients}%</div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
}