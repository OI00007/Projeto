import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tractor,
  Wrench,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  Plus,
  Download,
  Edit,
  Trash2,
  MapPin,
  Fuel
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useToast } from "@/hooks/use-toast";

interface EquipmentItem {
  id: number;
  name: string;
  type: string;
  status: "online" | "maintenance" | "warning" | "offline";
  health: number;
  hours: number;
  nextMaintenance: string;
  location: string;
  fuelLevel: number;
}

const Equipment = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentItem | null>(null);
  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    {
      id: 1,
      name: "Trator John Deere 6155M",
      type: "Trator",
      status: "online",
      health: 92,
      hours: 1247,
      nextMaintenance: "15 dias",
      location: "Talhão A-3",
      fuelLevel: 78,
    },
    {
      id: 2,
      name: "Colheitadeira Case IH 8250",
      type: "Colheitadeira",
      status: "maintenance",
      health: 65,
      hours: 3421,
      nextMaintenance: "Manutenção",
      location: "Oficina",
      fuelLevel: 45,
    },
    {
      id: 3,
      name: "Pulverizador Jacto Uniport 3030",
      type: "Pulverizador",
      status: "online",
      health: 88,
      hours: 856,
      nextMaintenance: "7 dias",
      location: "Talhão B-1",
      fuelLevel: 92,
    },
    {
      id: 4,
      name: "Plantadeira Semeato PSE 8",
      type: "Plantadeira",
      status: "warning",
      health: 71,
      hours: 2134,
      nextMaintenance: "3 dias",
      location: "Galpão",
      fuelLevel: 60,
    },
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "Trator",
    location: "",
    hours: 0,
    fuelLevel: 100,
    health: 100
  });

  const maintenanceSchedule = [
    { equipment: "Trator John Deere", date: "15/11/2024", type: "Preventiva", status: "scheduled" },
    { equipment: "Colheitadeira Case", date: "Em andamento", type: "Corretiva", status: "in_progress" },
    { equipment: "Pulverizador Jacto", date: "22/11/2024", type: "Preventiva", status: "scheduled" },
    { equipment: "Plantadeira Semeato", date: "12/11/2024", type: "Preventiva", status: "overdue" },
  ];

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.location) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome e localização do equipamento.",
        variant: "destructive"
      });
      return;
    }

    const newItem: EquipmentItem = {
      id: Date.now(),
      name: newEquipment.name,
      type: newEquipment.type,
      status: "online",
      health: newEquipment.health,
      hours: newEquipment.hours,
      nextMaintenance: "30 dias",
      location: newEquipment.location,
      fuelLevel: newEquipment.fuelLevel,
    };

    setEquipment(prev => [...prev, newItem]);
    setNewEquipment({ name: "", type: "Trator", location: "", hours: 0, fuelLevel: 100, health: 100 });
    setIsDialogOpen(false);
    
    toast({
      title: "Equipamento adicionado",
      description: `${newItem.name} foi cadastrado com sucesso.`,
    });
  };

  const handleStartMaintenance = (id: number) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, status: "maintenance" as const, location: "Oficina" } : item
    ));
    toast({
      title: "Manutenção iniciada",
      description: "O equipamento foi enviado para manutenção.",
    });
  };

  const handleCompleteMaintenance = (id: number) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, status: "online" as const, health: 100, nextMaintenance: "30 dias" } : item
    ));
    toast({
      title: "Manutenção concluída",
      description: "O equipamento está operacional novamente.",
    });
  };

  const handleDeleteEquipment = (id: number) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Equipamento removido",
      description: "O equipamento foi excluído do sistema.",
    });
  };

  return (
    <DashboardLayout 
      title="Gestão de Equipamentos" 
      subtitle="Monitore e gerencie toda a frota de máquinas agrícolas"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Relatório
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Equipamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Nome do Equipamento *</Label>
                  <Input
                    placeholder="Ex: Trator John Deere 6155M"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Select 
                      value={newEquipment.type}
                      onValueChange={(v) => setNewEquipment(prev => ({ ...prev, type: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Trator">Trator</SelectItem>
                        <SelectItem value="Colheitadeira">Colheitadeira</SelectItem>
                        <SelectItem value="Pulverizador">Pulverizador</SelectItem>
                        <SelectItem value="Plantadeira">Plantadeira</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Localização *</Label>
                    <Input
                      placeholder="Ex: Talhão A-1"
                      value={newEquipment.location}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Horas de Uso</Label>
                    <Input
                      type="number"
                      value={newEquipment.hours}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, hours: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Nível de Combustível (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newEquipment.fuelLevel}
                      onChange={(e) => setNewEquipment(prev => ({ ...prev, fuelLevel: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEquipment} className="w-full gradient-primary text-white">
                  Cadastrar Equipamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Fleet Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Equipamentos
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Tractor className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={24} />
              </div>
              <StatusBadge status="online">20 Operacionais</StatusBadge>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Em Operação
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">
                <AnimatedCounter value={16} />
              </div>
              <p className="text-xs text-muted-foreground">67% da frota ativa</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Manutenção
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning mb-2">
                <AnimatedCounter value={4} />
              </div>
              <p className="text-xs text-muted-foreground">2 preventivas, 2 corretivas</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxa de Disponibilidade
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={94.5} suffix="%" decimals={1} />
              </div>
              <StatusBadge status="online">Excelente</StatusBadge>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Fleet */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Frota de Equipamentos</CardTitle>
            <CardDescription>Status e monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {equipment.map((item) => (
                <Card key={item.id} className="border-2 hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.type}</CardDescription>
                      </div>
                      <StatusBadge status={item.status}>
                        {item.status === "online" ? "Operacional" : 
                         item.status === "maintenance" ? "Manutenção" : "Atenção"}
                      </StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Health Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Saúde do Equipamento</span>
                        <span className="font-medium">{item.health}%</span>
                      </div>
                      <Progress value={item.health} className="h-2" />
                    </div>

                    {/* Fuel Level */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Nível de Combustível</span>
                        <span className="font-medium">{item.fuelLevel}%</span>
                      </div>
                      <Progress value={item.fuelLevel} className="h-2" />
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Horas de Uso
                        </p>
                        <p className="font-medium">{item.hours}h</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Próxima Manutenção
                        </p>
                        <p className="font-medium">{item.nextMaintenance}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDeleteEquipment(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                      {item.status === "maintenance" ? (
                        <Button 
                          size="sm" 
                          className="flex-1 bg-success hover:bg-success/90"
                          onClick={() => handleCompleteMaintenance(item.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Finalizar
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartMaintenance(item.id)}
                        >
                          <Wrench className="h-4 w-4 mr-2" />
                          Manutenção
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Agenda de Manutenção</CardTitle>
            <CardDescription>Próximas manutenções programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {maintenanceSchedule.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.status === "in_progress" ? "bg-warning/10" :
                      item.status === "overdue" ? "bg-destructive/10" : "bg-info/10"
                    }`}>
                      {item.status === "in_progress" ? (
                        <Wrench className="h-5 w-5 text-warning" />
                      ) : item.status === "overdue" ? (
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Calendar className="h-5 w-5 text-info" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.equipment}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.date}</p>
                    <Badge className={
                      item.status === "in_progress" ? "bg-warning/10 text-warning" :
                      item.status === "overdue" ? "bg-destructive/10 text-destructive" : 
                      "bg-info/10 text-info"
                    }>
                      {item.status === "in_progress" ? "Em Andamento" :
                       item.status === "overdue" ? "Atrasada" : "Agendada"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Equipment;
