import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Play
} from "lucide-react";

interface DataPoint {
  id: string;
  timestamp: Date;
  sensor: string;
  type: "temperature" | "humidity" | "soil_moisture" | "wind" | "solar" | "alert";
  value: number | string;
  unit?: string;
  status: "normal" | "warning" | "critical";
  location: string;
}

const generateMockData = (): DataPoint => {
  const sensors = [
    { name: "Sensor Temp-01", location: "Setor A - Norte" },
    { name: "Sensor Umid-02", location: "Setor B - Sul" },
    { name: "Sensor Solo-03", location: "Setor C - Oeste" },
    { name: "Estação Meteo-01", location: "Central" }
  ];

  const types: DataPoint["type"][] = ["temperature", "humidity", "soil_moisture", "wind", "solar"];
  const randomSensor = sensors[Math.floor(Math.random() * sensors.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];

  let value: number | string;
  let unit: string;
  let status: DataPoint["status"] = "normal";

  switch (randomType) {
    case "temperature":
      value = Math.round((Math.random() * 20 + 15) * 10) / 10;
      unit = "°C";
      if (value > 30) status = "warning";
      if (value > 35) status = "critical";
      break;
    case "humidity":
      value = Math.round(Math.random() * 40 + 40);
      unit = "%";
      if (value < 50 || value > 85) status = "warning";
      break;
    case "soil_moisture":
      value = Math.round(Math.random() * 30 + 50);
      unit = "%";
      if (value < 60) status = "warning";
      if (value < 40) status = "critical";
      break;
    case "wind":
      value = Math.round(Math.random() * 20 + 5);
      unit = "km/h";
      if (value > 25) status = "warning";
      break;
    case "solar":
      value = Math.round(Math.random() * 800 + 200);
      unit = "W/m²";
      break;
    default:
      value = 0;
      unit = "";
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    sensor: randomSensor.name,
    type: randomType,
    value,
    unit,
    status,
    location: randomSensor.location
  };
};

export function LiveDataFeed() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const newDataPoint = generateMockData();
      setDataPoints(prev => [newDataPoint, ...prev.slice(0, 19)]); // Keep last 20 items
      
      // Simulate occasional connection issues
      if (Math.random() < 0.05) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getIcon = (type: DataPoint["type"]) => {
    switch (type) {
      case "temperature": return <Thermometer className="h-4 w-4" />;
      case "humidity": return <Droplets className="h-4 w-4" />;
      case "soil_moisture": return <Droplets className="h-4 w-4" />;
      case "wind": return <Wind className="h-4 w-4" />;
      case "solar": return <Sun className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: DataPoint["status"]) => {
    switch (status) {
      case "normal": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getTypeLabel = (type: DataPoint["type"]) => {
    switch (type) {
      case "temperature": return "Temperatura";
      case "humidity": return "Umidade Ar";
      case "soil_moisture": return "Umidade Solo";
      case "wind": return "Vento";
      case "solar": return "Radiação Solar";
      default: return type;
    }
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Feed de Dados em Tempo Real</h3>
            <p className="text-sm text-muted-foreground">Dados ao vivo dos sensores</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-success" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-96 custom-scrollbar">
        <div className="space-y-2">
          {dataPoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aguardando dados dos sensores...</p>
            </div>
          ) : (
            dataPoints.map((dataPoint) => (
              <div 
                key={dataPoint.id} 
                className="p-3 rounded-lg border border-border hover:bg-muted/5 transition-all animate-fade-in interactive-scale focus-ring"
                tabIndex={0}
                role="button"
                aria-label={`Dados do sensor ${dataPoint.sensor}: ${dataPoint.value}${dataPoint.unit}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${getStatusColor(dataPoint.status)} bg-current/10`}>
                      {getIcon(dataPoint.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {getTypeLabel(dataPoint.type)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {dataPoint.sensor}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        {dataPoint.location}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {dataPoint.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      {dataPoint.value}{dataPoint.unit}
                    </div>
                    <div className="flex items-center gap-1">
                      {dataPoint.status === "normal" ? (
                        <CheckCircle className="h-3 w-3 text-success" />
                      ) : (
                        <AlertTriangle className={`h-3 w-3 ${getStatusColor(dataPoint.status)}`} />
                      )}
                      <span className={`text-xs ${getStatusColor(dataPoint.status)}`}>
                        {dataPoint.status === "normal" ? "Normal" : 
                         dataPoint.status === "warning" ? "Atenção" : "Crítico"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {isPaused && (
        <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <div className="flex items-center gap-2 text-warning">
            <Pause className="h-4 w-4" />
            <span className="text-sm font-medium">Feed pausado</span>
          </div>
        </div>
      )}
    </Card>
  );
}