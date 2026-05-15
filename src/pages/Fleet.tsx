import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Truck,
  MapPin,
  Fuel,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Route,
  Plus,
  Download
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { StatusBadge } from "@/components/ui/status-badge";

const Fleet = () => {
  const vehicles = [
    {
      id: 1,
      name: "Caminhão Mercedes-Benz Actros",
      type: "Caminhão Pesado",
      status: "online",
      location: "Em rota - BR-101 KM 245",
      fuelLevel: 68,
      distance: 1247,
      driver: "João Silva",
      cargo: "Soja - 25 toneladas",
    },
    {
      id: 2,
      name: "Volkswagen Constellation",
      type: "Caminhão Médio",
      status: "offline",
      location: "Galpão Principal",
      fuelLevel: 92,
      distance: 856,
      driver: "Maria Santos",
      cargo: "Vazio",
    },
    {
      id: 3,
      name: "Ford Cargo 2429",
      type: "Caminhão Médio",
      status: "warning",
      location: "Manutenção Preventiva",
      fuelLevel: 45,
      distance: 2134,
      driver: "-",
      cargo: "-",
    },
  ];

  const routes = [
    {
      origin: "Fazenda Central",
      destination: "Armazém Porto",
      distance: "245 km",
      duration: "3h 15min",
      status: "in_progress",
      vehicle: "Mercedes-Benz Actros",
    },
    {
      origin: "Fazenda Sul",
      destination: "Cooperativa",
      distance: "87 km",
      duration: "1h 20min",
      status: "scheduled",
      vehicle: "VW Constellation",
    },
    {
      origin: "Armazém Porto",
      destination: "Fazenda Central",
      distance: "245 km",
      duration: "3h 15min",
      status: "completed",
      vehicle: "Mercedes-Benz Actros",
    },
  ];

  return (
    <DashboardLayout 
      title="Gestão de Frotas" 
      subtitle="Rastreamento e otimização de veículos e rotas"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Button size="sm" className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nova Rota
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Fleet Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Veículos
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={12} />
              </div>
              <StatusBadge status="online">10 Ativos</StatusBadge>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Rota
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <Route className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">
                <AnimatedCounter value={6} />
              </div>
              <p className="text-xs text-muted-foreground">50% da frota</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consumo Médio
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Fuel className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={8.2} suffix=" km/L" decimals={1} />
              </div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingDown className="h-3 w-3" />
                <span>-5.2% vs mês anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Distância Total
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={45.8} suffix="k km" decimals={1} />
              </div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Grid */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Frota de Veículos</CardTitle>
            <CardDescription>Status e localização em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="border-2 hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                        <CardDescription>{vehicle.type}</CardDescription>
                      </div>
                      <StatusBadge status={vehicle.status as "online" | "offline" | "warning"}>
                        {vehicle.status === "online" ? "Em Rota" : 
                         vehicle.status === "offline" ? "Parado" : "Manutenção"}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Localização</p>
                        <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                      </div>
                    </div>

                    {/* Fuel Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Fuel className="h-3 w-3" />
                          Combustível
                        </span>
                        <span className="font-medium">{vehicle.fuelLevel}%</span>
                      </div>
                      <Progress value={vehicle.fuelLevel} className="h-2" />
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Motorista</p>
                        <p className="font-medium">{vehicle.driver}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Distância</p>
                        <p className="font-medium">{vehicle.distance} km</p>
                      </div>
                    </div>

                    {vehicle.cargo !== "-" && (
                      <div className="pt-2">
                        <Badge variant="outline" className="w-full justify-center">
                          {vehicle.cargo}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Routes */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Rotas Recentes</CardTitle>
            <CardDescription>Histórico e planejamento de rotas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {routes.map((route, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      route.status === "in_progress" ? "bg-success/10" :
                      route.status === "scheduled" ? "bg-info/10" : "bg-muted"
                    }`}>
                      {route.status === "in_progress" ? (
                        <Route className="h-5 w-5 text-success" />
                      ) : route.status === "scheduled" ? (
                        <AlertCircle className="h-5 w-5 text-info" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{route.origin} → {route.destination}</p>
                      <p className="text-sm text-muted-foreground">{route.vehicle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{route.distance}</p>
                    <p className="text-xs text-muted-foreground">{route.duration}</p>
                  </div>
                  <Badge className={`ml-4 ${
                    route.status === "in_progress" ? "bg-success/10 text-success" :
                    route.status === "scheduled" ? "bg-info/10 text-info" : 
                    "bg-muted text-muted-foreground"
                  }`}>
                    {route.status === "in_progress" ? "Em Andamento" :
                     route.status === "scheduled" ? "Agendada" : "Concluída"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Fleet;
