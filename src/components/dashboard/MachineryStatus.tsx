import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Truck, 
  Fuel, 
  Wrench, 
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";

const machineryData = [
  {
    id: 1,
    name: "Trator John Deere 8R",
    type: "Trator",
    status: "active",
    location: "Setor Norte - Talhão 15",
    fuel: 85,
    hoursWorked: 145,
    maintenanceStatus: "ok",
    nextMaintenance: "2024-02-15",
    operator: "João Silva"
  },
  {
    id: 2,
    name: "Colheitadeira Case 9240",
    type: "Colheitadeira",
    status: "maintenance",
    location: "Oficina Central",
    fuel: 30,
    hoursWorked: 520,
    maintenanceStatus: "scheduled",
    nextMaintenance: "2024-01-28",
    operator: "Maria Santos"
  },
  {
    id: 3,
    name: "Pulverizador Apache",
    type: "Pulverizador",
    status: "idle",
    location: "Galpão 3",
    fuel: 95,
    hoursWorked: 89,
    maintenanceStatus: "ok",
    nextMaintenance: "2024-03-10",
    operator: "Carlos Oliveira"
  },
  {
    id: 4,
    name: "Plantadeira Jumil",
    type: "Plantadeira",
    status: "warning",
    location: "Setor Sul - Talhão 8",
    fuel: 45,
    hoursWorked: 203,
    maintenanceStatus: "attention",
    nextMaintenance: "2024-02-05",
    operator: "Ana Costa"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-success/10 text-success border-success/30";
    case "idle": return "bg-info/10 text-info border-info/30";
    case "maintenance": return "bg-warning/10 text-warning border-warning/30";
    case "warning": return "bg-destructive/10 text-destructive border-destructive/30";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle className="h-3 w-3" />;
    case "idle": return <Clock className="h-3 w-3" />;
    case "maintenance": return <Settings className="h-3 w-3" />;
    case "warning": return <AlertTriangle className="h-3 w-3" />;
    default: return <Clock className="h-3 w-3" />;
  }
};

const getMaintenanceColor = (status: string) => {
  switch (status) {
    case "ok": return "text-success";
    case "attention": return "text-warning";
    case "scheduled": return "text-info";
    default: return "text-muted-foreground";
  }
};

export function MachineryStatus() {
  const activeCount = machineryData.filter(m => m.status === "active").length;
  const totalMachinery = machineryData.length;

  return (
    <Card className="backdrop-blur-sm bg-card/95 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          Status das Máquinas
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          {activeCount}/{totalMachinery} ativas
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {machineryData.map((machine) => (
          <div key={machine.id} className="space-y-3 p-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <div>
                  <span className="font-medium text-sm">{machine.name}</span>
                  <p className="text-xs text-muted-foreground">{machine.type}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(machine.status)}`}
              >
                {getStatusIcon(machine.status)}
                {machine.status === "active" && "Ativa"}
                {machine.status === "idle" && "Parada"}
                {machine.status === "maintenance" && "Manutenção"}
                {machine.status === "warning" && "Atenção"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Local:</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Horas:</span>
                <span>{machine.hoursWorked}h</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {machine.location}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Fuel className="h-3 w-3" />
                    Combustível
                  </span>
                  <span className="font-medium">{machine.fuel}%</span>
                </div>
                <Progress value={machine.fuel} className="h-1.5" />
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Manutenção:</span>
                  <span className={getMaintenanceColor(machine.maintenanceStatus)}>
                    {machine.maintenanceStatus === "ok" && "OK"}
                    {machine.maintenanceStatus === "attention" && "Atenção"}
                    {machine.maintenanceStatus === "scheduled" && "Agendada"}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Próxima: {new Date(machine.nextMaintenance).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Operador:</span>
                <span className="font-medium">{machine.operator}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}