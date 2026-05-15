import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Eye, 
  AlertTriangle, CloudSnow, Gauge, Umbrella,
  Sunrise, Sunset, CloudLightning, RefreshCw, Loader2, MapPin, Search
} from "lucide-react";
import { useWeatherApi, getWeatherCondition, getWeatherDescription, getWindDirection } from "@/hooks/useWeatherApi";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface CitySuggestion {
  id: number;
  name: string;
  admin1: string; // Estado
}

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function getConditionIcon(condition: string, size: string = "h-6 w-6") {
  const iconMap: Record<string, React.ReactNode> = {
    sunny: <Sun className={`${size} text-warning`} />,
    cloudy: <Cloud className={`${size} text-muted-foreground`} />,
    rainy: <CloudRain className={`${size} text-primary`} />,
    stormy: <CloudLightning className={`${size} text-destructive`} />,
    frost: <CloudSnow className={`${size} text-info`} />,
    drizzle: <CloudRain className={`${size} text-primary`} />,
  };
  return iconMap[condition] || <Cloud className={`${size} text-muted-foreground`} />;
}

function getConditionLabel(condition: string) {
  const labels: Record<string, string> = {
    sunny: "Ensolarado", cloudy: "Nublado", rainy: "Chuvoso",
    stormy: "Tempestade", frost: "Geada", drizzle: "Garoa",
  };
  return labels[condition] || "Indefinido";
}

export function EnhancedWeatherWidget() {
  const [activeTab, setActiveTab] = useState("current");
  const [selectedCity, setSelectedCity] = useState("são paulo");
  const [cityInput, setCityInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const { data, loading, error, lastUpdated, refetch } = useWeatherApi(selectedCity);

  useEffect(() => {
    if (cityInput.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=5&language=pt&format=json`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
        }
      } catch (err) {
        console.error("Erro ao buscar cidades", err);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cityInput]);

  const handleCitySearch = () => {
    if (cityInput.trim()) {
      setSelectedCity(cityInput.trim().toLowerCase());
      setCityInput("");
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: CitySuggestion) => {
    const fullCityName = `${city.name}, ${city.admin1 || ''}`.trim();
    setSelectedCity(fullCityName.toLowerCase());
    setCityInput("");
    setShowSuggestions(false);
  };

  if (loading && !data) {
    return (
      <Card className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando dados meteorológicos...</span>
        </div>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="glass-card p-6 animate-fade-in">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar novamente
          </Button>
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const { current, hourly, daily } = data;
  const currentCondition = getWeatherCondition(current.weatherCode);

  // Generate agricultural insights from real data
  const frostRisk = daily.some(d => d.tempMin < 3) ? 85 : daily.some(d => d.tempMin < 8) ? 40 : 10;
  const plantingConditions = current.humidity > 40 && current.humidity < 80 && current.temperature > 15 && current.temperature < 35
    ? (current.precipitation < 5 ? "excellent" : "good") : "fair";
  const harvestConditions = current.precipitation < 2 && current.windSpeed < 25 ? "good" : "fair";

  // Generate alerts from real data
  const alerts: { type: string; severity: "warning" | "critical"; message: string; validUntil: string }[] = [];
  daily.forEach((day) => {
    if (day.tempMin < 3) {
      alerts.push({ type: "Alerta de Geada", severity: "critical", message: `Temp. mínima de ${day.tempMin.toFixed(0)}°C prevista`, validUntil: day.date });
    }
    if (day.precipitationSum > 40) {
      alerts.push({ type: "Chuva Intensa", severity: "warning", message: `${day.precipitationSum.toFixed(0)}mm previstos`, validUntil: day.date });
    }
  });

  const statusColor = (s: string) => ({ excellent: "text-success", good: "text-primary", fair: "text-warning", poor: "text-destructive" }[s] || "text-muted-foreground");
  const statusLabel = (s: string) => ({ excellent: "Excelente", good: "Bom", fair: "Regular", poor: "Ruim" }[s] || "—");

  // Sunrise/sunset from today's data
  const todaySunrise = daily[0]?.sunrise ? new Date(daily[0].sunrise).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  const todaySunset = daily[0]?.sunset ? new Date(daily[0].sunset).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Estação Meteorológica</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {data.location.city} — em tempo real via Open-Meteo
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {alerts.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {alerts.length} alerta{alerts.length > 1 ? 's' : ''}
            </Badge>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Relatório Meteorológico — {data.location.city}</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="detailed" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="detailed">Detalhado</TabsTrigger>
                  <TabsTrigger value="agricultural">Agrícola</TabsTrigger>
                  <TabsTrigger value="alerts">Alertas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="detailed" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/5 rounded-lg">
                      <Thermometer className="h-8 w-8 mx-auto mb-2 text-warning" />
                      <div className="text-2xl font-bold">{current.temperature.toFixed(1)}°C</div>
                      <div className="text-sm text-muted-foreground">Sensação: {current.apparentTemperature.toFixed(1)}°C</div>
                    </div>
                    <div className="text-center p-4 bg-muted/5 rounded-lg">
                      <Wind className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{current.windSpeed.toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">km/h {getWindDirection(current.windDirection)}</div>
                    </div>
                    <div className="text-center p-4 bg-muted/5 rounded-lg">
                      <Droplets className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold">{current.humidity}%</div>
                      <div className="text-sm text-muted-foreground">Umidade</div>
                    </div>
                    <div className="text-center p-4 bg-muted/5 rounded-lg">
                      <Umbrella className="h-8 w-8 mx-auto mb-2 text-info" />
                      <div className="text-2xl font-bold">{current.precipitation.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">mm precip.</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Vento</h4>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">{current.windSpeed.toFixed(0)} km/h</div>
                        <div className="text-sm text-muted-foreground">Direção: {getWindDirection(current.windDirection)}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Sol</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Sunrise className="h-4 w-4 text-warning" />
                          <span>Nascer: {todaySunrise}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Sunset className="h-4 w-4 text-orange-500" />
                          <span>Pôr: {todaySunset}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="agricultural" className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Condições Atuais</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Temperatura</span>
                          <span className="font-medium">{current.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Umidade</span>
                          <span className="font-medium">{current.humidity}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Precipitação</span>
                          <span className="font-medium">{current.precipitation.toFixed(1)}mm</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Condições Agrícolas</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Plantio</span>
                          <Badge className={statusColor(plantingConditions)}>{statusLabel(plantingConditions)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Colheita</span>
                          <Badge className={statusColor(harvestConditions)}>{statusLabel(harvestConditions)}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Risco de Geada</span>
                          <div className="flex items-center gap-2">
                            <Progress value={frostRisk} className="w-16 h-2" />
                            <span className="text-sm font-medium">{frostRisk}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="alerts" className="space-y-4">
                  {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        alert.severity === "critical" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === "critical" ? "text-destructive" : "text-warning"}`} />
                          <div className="space-y-1">
                            <div className="font-medium">{alert.type}</div>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                            <div className="text-xs text-muted-foreground">Data: {(() => {
                              const [y, m, d] = alert.validUntil.split('-');
                              return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('pt-BR');
                            })()}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground p-8">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum alerta meteorológico ativo</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* City Selector */}
      <div className="mb-6 relative z-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
              placeholder="Buscar outra cidade..."
              className="pl-9 h-9 text-sm focus-ring bg-muted/20"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleCitySearch} className="h-9 w-9 p-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {showSuggestions && cityInput.trim().length >= 3 && (
          <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-xl p-1 z-50">
            {suggestions.length > 0 ? (
              suggestions.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {city.name}{city.admin1 ? `, ${city.admin1}` : ''}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">Procurando...</div>
            )}
          </div>
        )}
      </div>


      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.slice(0, 2).map((alert, index) => (
            <div key={index} className={`flex items-center gap-2 p-3 rounded-lg border ${
              alert.severity === "critical" ? "bg-destructive/5 border-destructive/20" : "bg-warning/5 border-warning/20"
            }`}>
              <AlertTriangle className={`h-4 w-4 ${alert.severity === "critical" ? "text-destructive" : "text-warning"}`} />
              <div className="flex-1">
                <span className="text-sm font-medium">{alert.type}</span>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Atual</TabsTrigger>
          <TabsTrigger value="hourly">Por Hora</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
            <div className="flex items-center justify-center mb-4">
              {getConditionIcon(currentCondition, "h-16 w-16")}
            </div>
            <div className="text-4xl font-bold text-foreground mb-2">
              {current.temperature.toFixed(1)}°C
            </div>
            <div className="text-lg text-muted-foreground mb-1">
              {getWeatherDescription(current.weatherCode)}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              Sensação térmica: {current.apparentTemperature.toFixed(1)}°C
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                <span>Umidade: {current.humidity}%</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>Vento: {current.windSpeed.toFixed(0)}km/h {getWindDirection(current.windDirection)}</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <div className="grid grid-cols-6 gap-2">
            {hourly.slice(0, 6).map((item, index) => {
              const condition = getWeatherCondition(item.weatherCode);
              const hour = new Date(item.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={index} className="text-center p-3 rounded-lg border hover:bg-muted/20 transition-colors">
                  <p className="text-xs font-medium mb-2 text-muted-foreground">{index === 0 ? "Agora" : hour}</p>
                  <div className="flex justify-center mb-2">
                    {getConditionIcon(condition)}
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">{item.temperature.toFixed(0)}°C</p>
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Umbrella className="h-3 w-3 text-primary" />
                    <span>{item.precipitationProbability}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <div className="space-y-2">
            {daily.map((day, index) => {
              const condition = getWeatherCondition(day.weatherCode);
              const isToday = index === 0;
              const [year, month, d] = day.date.split('-');
              const dateObj = new Date(Number(year), Number(month) - 1, Number(d));
              const dayName = isToday ? "Hoje" : DAY_NAMES[dateObj.getDay()];
              
              return (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-muted/20 ${
                  isToday ? "bg-primary/5 border-primary/20" : ""
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-medium min-w-[80px] ${isToday ? "text-primary" : "text-foreground"}`}>
                      {dayName}
                    </div>
                    {getConditionIcon(condition, "h-5 w-5")}
                    <div className="text-sm text-muted-foreground">
                      {getWeatherDescription(day.weatherCode)}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-sm">
                      <Umbrella className="h-3 w-3 text-primary" />
                      <span>{day.precipitationProbability}%</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {day.tempMax.toFixed(0)}° / {day.tempMin.toFixed(0)}°
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
        <span>Atualizado: {lastUpdated?.toLocaleTimeString('pt-BR') || '—'}</span>
        <div className="flex items-center gap-2">
          <span>Open-Meteo API</span>
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={refetch} disabled={loading}>
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
