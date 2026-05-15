import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Zap, 
  Droplets, 
  Thermometer, 
  Sprout, 
  Shield,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface AutomationConditions {
  soilMoisture?: number[];
  temperature?: number[];
  schedule?: string;
  interval?: number;
}

interface AutomationActions {
  irrigationDuration?: number;
  alert?: boolean;
  protection?: boolean;
  fertilizer?: string;
  dosage?: number;
  preventiveTreatment?: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  type: 'irrigation' | 'climate' | 'fertilizer' | 'pesticide';
  icon: LucideIcon;
  description: string;
  active: boolean;
  conditions: AutomationConditions;
  actions: AutomationActions;
  lastTriggered?: Date;
}

export function AutomationPanel() {
  const { toast } = useToast();
  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Irrigação Automática',
      type: 'irrigation',
      icon: Droplets,
      description: 'Ativa irrigação quando umidade do solo < 40%',
      active: true,
      conditions: { soilMoisture: [40] },
      actions: { irrigationDuration: 2 },
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: 'Proteção Térmica',
      type: 'climate',
      icon: Thermometer,
      description: 'Alerta quando temperatura < 5°C (risco de geada)',
      active: true,
      conditions: { temperature: [5] },
      actions: { alert: true, protection: true }
    },
    {
      id: '3',
      name: 'Fertirrigação Semanal',
      type: 'fertilizer',
      icon: Sprout,
      description: 'Aplica nutrientes automaticamente toda segunda-feira',
      active: false,
      conditions: { schedule: 'weekly' },
      actions: { fertilizer: 'NPK 10-10-10', dosage: 200 }
    },
    {
      id: '4',
      name: 'Monitoramento de Pragas',
      type: 'pesticide',
      icon: Shield,
      description: 'Alerta para aplicação preventiva a cada 15 dias',
      active: true,
      conditions: { interval: 15 },
      actions: { preventiveTreatment: true }
    }
  ]);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, active: !rule.active }
        : rule
    ));
    
    const rule = rules.find(r => r.id === id);
    toast({
      title: `Automação ${rule?.active ? 'desativada' : 'ativada'}`,
      description: `${rule?.name} foi ${rule?.active ? 'pausada' : 'iniciada'}.`,
    });
  };

  const updateRuleCondition = (id: string, field: string, value: unknown) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, conditions: { ...rule.conditions, [field]: value } }
        : rule
    ));
  };

  const runManualTest = (rule: AutomationRule) => {
    toast({
      title: "Teste executado",
      description: `${rule.name} foi testada manualmente com sucesso.`,
    });
  };

  const getStatusColor = (active: boolean) => {
    return active ? 'bg-success' : 'bg-muted-foreground';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'irrigation': return 'text-primary';
      case 'climate': return 'text-warning';
      case 'fertilizer': return 'text-success';
      case 'pesticide': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Central de Automação</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {rules.filter(r => r.active).length} ativas
          </Badge>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => {
          const IconComponent = rule.icon;
          return (
            <div key={rule.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <IconComponent className={`h-5 w-5 ${getTypeColor(rule.type)}`} />
                    <div 
                      className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getStatusColor(rule.active)}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    {rule.lastTriggered && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Última execução: {rule.lastTriggered.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </div>

              {rule.active && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/10 rounded-lg">
                  {/* Irrigation specific controls */}
                  {rule.type === 'irrigation' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Umidade mínima (%)</label>
                        <Slider
                          value={rule.conditions.soilMoisture}
                          onValueChange={(value) => updateRuleCondition(rule.id, 'soilMoisture', value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground">
                          Atual: {rule.conditions.soilMoisture[0]}%
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Duração (horas)</label>
                        <Select value={rule.actions.irrigationDuration?.toString()}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 hora</SelectItem>
                            <SelectItem value="2">2 horas</SelectItem>
                            <SelectItem value="3">3 horas</SelectItem>
                            <SelectItem value="4">4 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Climate specific controls */}
                  {rule.type === 'climate' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperatura mínima (°C)</label>
                        <Slider
                          value={rule.conditions.temperature}
                          onValueChange={(value) => updateRuleCondition(rule.id, 'temperature', value)}
                          min={-5}
                          max={20}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground">
                          Atual: {rule.conditions.temperature[0]}°C
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ação de proteção</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar ação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alert">Apenas alerta</SelectItem>
                            <SelectItem value="sprinkler">Ativar micro aspersores</SelectItem>
                            <SelectItem value="heater">Ativar aquecedores</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Action buttons */}
                  <div className="md:col-span-2 flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runManualTest(rule)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Testar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      Histórico
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Resetar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
        <div className="text-center">
          <div className="text-lg font-bold text-success">12</div>
          <div className="text-xs text-muted-foreground">Execuções hoje</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">98.5%</div>
          <div className="text-xs text-muted-foreground">Taxa de sucesso</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-warning">2.3h</div>
          <div className="text-xs text-muted-foreground">Tempo economizado</div>
        </div>
      </div>
    </Card>
  );
}