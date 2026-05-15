import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Plus, 
  Droplets, 
  Sprout, 
  Calendar,
  Truck,
  FileText,
  Zap
} from "lucide-react";

export function QuickActions() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    culture: '',
    area: '',
    plantingDate: '',
    expectedHarvest: '',
    notes: ''
  });

  const handleSubmit = (action: string) => {
    toast({
      title: `${action} agendado com sucesso!`,
      description: "A tarefa foi adicionada ao cronograma.",
    });
  };

  const quickActions = [
    {
      icon: Plus,
      label: "Nova Cultura",
      action: "culture",
      dialog: (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Cultura</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="culture">Tipo de Cultura</Label>
              <Select value={formData.culture} onValueChange={(value) => setFormData({...formData, culture: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cultura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soja">Soja</SelectItem>
                  <SelectItem value="milho">Milho</SelectItem>
                  <SelectItem value="trigo">Trigo</SelectItem>
                  <SelectItem value="algodao">Algodão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="area">Área (hectares)</Label>
              <Input 
                id="area" 
                type="number" 
                placeholder="Ex: 50"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="planting">Data de Plantio</Label>
              <Input 
                id="planting" 
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="harvest">Previsão de Colheita</Label>
              <Input 
                id="harvest" 
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => setFormData({...formData, expectedHarvest: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Notas sobre o plantio..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <Button onClick={() => handleSubmit("Plantio")} className="w-full">
              Cadastrar Cultura
            </Button>
          </div>
        </DialogContent>
      )
    },
    {
      icon: Droplets,
      label: "Irrigação",
      action: "irrigation",
      dialog: (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Irrigação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Talhão</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o talhão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="talhao-a">Talhão A - Soja</SelectItem>
                  <SelectItem value="talhao-b">Talhão B - Milho</SelectItem>
                  <SelectItem value="talhao-c">Talhão C - Trigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Volume (litros/hectare)</Label>
              <Input type="number" placeholder="Ex: 15000" />
            </div>
            <div>
              <Label>Data/Hora</Label>
              <Input type="datetime-local" />
            </div>
            <div>
              <Label>Duração (horas)</Label>
              <Input type="number" placeholder="Ex: 4" />
            </div>
            <Button onClick={() => handleSubmit("Irrigação")} className="w-full">
              Agendar Irrigação
            </Button>
          </div>
        </DialogContent>
      )
    },
    {
      icon: Sprout,
      label: "Defensivos",
      action: "pesticide",
      dialog: (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aplicar Defensivos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Produto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o defensivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="herbicida">Herbicida - Glifosato</SelectItem>
                  <SelectItem value="fungicida">Fungicida - Azoxistrobina</SelectItem>
                  <SelectItem value="inseticida">Inseticida - Imidacloprido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dosagem (L/ha)</Label>
              <Input type="number" step="0.1" placeholder="Ex: 2.5" />
            </div>
            <div>
              <Label>Área de Aplicação</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="talhao-a">Talhão A - 50ha</SelectItem>
                  <SelectItem value="talhao-b">Talhão B - 75ha</SelectItem>
                  <SelectItem value="all">Toda a propriedade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleSubmit("Aplicação de defensivos")} className="w-full">
              Agendar Aplicação
            </Button>
          </div>
        </DialogContent>
      )
    }
  ];

  return (
    <Card className="glass-card p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Ações Rápidas</h2>
        <Button variant="ghost" size="sm">
          <Zap className="h-4 w-4 mr-2" />
          Automação
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
                <action.icon className="h-6 w-6 text-primary" />
                <span className="text-xs">{action.label}</span>
              </Button>
            </DialogTrigger>
            {action.dialog}
          </Dialog>
        ))}
        
        <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xs">Logística</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xs">Relatório</span>
        </Button>
        
        <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xs">Planejamento</span>
        </Button>
      </div>
    </Card>
  );
}