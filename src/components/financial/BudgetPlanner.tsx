import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, TrendingUp, Calculator, Save, Edit3, Calendar, DollarSign, BarChart3, AlertTriangle, CheckCircle
} from "lucide-react";

const budgetPlan = {
  year: 2024,
  totalBudget: 1850000,
  categories: [
    { id: 1, name: "Insumos Agrícolas", plannedAmount: 650000, currentSpent: 485000, projectedSpent: 620000, priority: "high",
      subcategories: [{ name: "Sementes", planned: 180000, current: 145000, projected: 175000 }, { name: "Fertilizantes", planned: 280000, current: 210000, projected: 270000 }, { name: "Defensivos", planned: 190000, current: 130000, projected: 175000 }] },
    { id: 2, name: "Mão de Obra", plannedAmount: 420000, currentSpent: 315000, projectedSpent: 410000, priority: "high",
      subcategories: [{ name: "Salários Fixos", planned: 300000, current: 225000, projected: 300000 }, { name: "Temporários", planned: 80000, current: 60000, projected: 75000 }, { name: "Encargos", planned: 40000, current: 30000, projected: 35000 }] },
    { id: 3, name: "Combustível", plannedAmount: 180000, currentSpent: 142000, projectedSpent: 175000, priority: "medium",
      subcategories: [{ name: "Diesel", planned: 130000, current: 105000, projected: 128000 }, { name: "Gasolina", planned: 35000, current: 25000, projected: 32000 }, { name: "Lubrificantes", planned: 15000, current: 12000, projected: 15000 }] },
    { id: 4, name: "Manutenção", plannedAmount: 220000, currentSpent: 165000, projectedSpent: 210000, priority: "medium",
      subcategories: [{ name: "Equipamentos", planned: 150000, current: 115000, projected: 145000 }, { name: "Instalações", planned: 45000, current: 32000, projected: 40000 }, { name: "Veículos", planned: 25000, current: 18000, projected: 25000 }] },
    { id: 5, name: "Investimentos", plannedAmount: 280000, currentSpent: 125000, projectedSpent: 260000, priority: "low",
      subcategories: [{ name: "Equipamentos Novos", planned: 200000, current: 85000, projected: 185000 }, { name: "Tecnologia", planned: 50000, current: 25000, projected: 45000 }, { name: "Infraestrutura", planned: 30000, current: 15000, projected: 30000 }] },
    { id: 6, name: "Administrativo", plannedAmount: 100000, currentSpent: 78000, projectedSpent: 95000, priority: "low",
      subcategories: [{ name: "Escritório", planned: 40000, current: 32000, projected: 38000 }, { name: "Consultoria", planned: 35000, current: 28000, projected: 33000 }, { name: "Seguros", planned: 25000, current: 18000, projected: 24000 }] }
  ]
};

const monthlyProjection = [
  { month: "Jan", planned: 145000, actual: 142000, projected: 145000 },
  { month: "Fev", planned: 135000, actual: 138000, projected: 135000 },
  { month: "Mar", planned: 165000, actual: 168000, projected: 162000 },
  { month: "Abr", planned: 155000, actual: 152000, projected: 155000 },
  { month: "Mai", planned: 175000, actual: 178000, projected: 175000 },
  { month: "Jun", planned: 185000, actual: 182000, projected: 185000 },
  { month: "Jul", planned: 195000, actual: null, projected: 195000 },
  { month: "Ago", planned: 205000, actual: null, projected: 205000 },
  { month: "Set", planned: 185000, actual: null, projected: 185000 },
  { month: "Out", planned: 175000, actual: null, projected: 175000 },
  { month: "Nov", planned: 165000, actual: null, projected: 165000 },
  { month: "Dez", planned: 155000, actual: null, projected: 155000 }
];

const performanceMetrics = [
  { subject: 'Execução', atual: 85, meta: 90 },
  { subject: 'Eficiência', atual: 78, meta: 85 },
  { subject: 'Controle', atual: 92, meta: 95 },
  { subject: 'Planejamento', atual: 88, meta: 90 },
  { subject: 'ROI', atual: 75, meta: 80 }
];

export function BudgetPlanner() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalPlanned = budgetPlan.categories.reduce((acc, cat) => acc + cat.plannedAmount, 0);
  const totalSpent = budgetPlan.categories.reduce((acc, cat) => acc + cat.currentSpent, 0);
  const totalProjected = budgetPlan.categories.reduce((acc, cat) => acc + cat.projectedSpent, 0);
  const executionRate = (totalSpent / totalPlanned) * 100;
  const maxPlanned = Math.max(...monthlyProjection.map(m => m.planned));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">Planejamento Orçamentário</h2>
          <p className="text-muted-foreground">Gestão estratégica de recursos financeiros</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-2"><Calendar className="w-4 h-4 mr-2" />Ano {budgetPlan.year}</Badge>
          <Button variant="outline" className="gap-2"><Calculator className="w-4 h-4" />Simular Cenário</Button>
          <Button variant="default" className="gap-2 button-premium"><Save className="w-4 h-4" />Salvar Plano</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Target className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Orçamento Total</p><p className="text-xl font-bold">R$ {(totalPlanned / 1000000).toFixed(1)}M</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-warning/10"><DollarSign className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Executado</p><p className="text-xl font-bold text-warning">R$ {(totalSpent / 1000000).toFixed(1)}M</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-info/10"><TrendingUp className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Projeção</p><p className="text-xl font-bold text-info">R$ {(totalProjected / 1000000).toFixed(1)}M</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-success/10"><BarChart3 className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Taxa Execução</p><p className="text-xl font-bold text-success">{executionRate.toFixed(1)}%</p></div></div>
        </EnhancedCard>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full lg:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="projection">Projeções</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Execução Orçamentária - Barras de progresso */}
            <EnhancedCard variant="floating" className="p-6">
              <CardHeader className="pb-4"><CardTitle>Execução Orçamentária por Categoria</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetPlan.categories.map((cat) => {
                    const exec = (cat.currentSpent / cat.plannedAmount) * 100;
                    return (
                      <div key={cat.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{cat.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">R$ {(cat.currentSpent / 1000).toFixed(0)}k / R$ {(cat.plannedAmount / 1000).toFixed(0)}k</span>
                            <Badge variant={exec > 90 ? "destructive" : "outline"}>{exec.toFixed(0)}%</Badge>
                          </div>
                        </div>
                        <Progress value={Math.min(exec, 100)} className="h-2.5" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </EnhancedCard>

            {/* Distribuição do Orçamento */}
            <EnhancedCard variant="glass" className="p-6">
              <CardHeader className="pb-4"><CardTitle>Distribuição do Orçamento</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {budgetPlan.categories.map((cat) => {
                    const pct = (cat.plannedAmount / totalPlanned) * 100;
                    return (
                      <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <span className="font-medium text-sm">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm font-semibold w-16 text-right">R$ {(cat.plannedAmount / 1000).toFixed(0)}k</span>
                          <Badge variant="outline" className="text-xs">{pct.toFixed(0)}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </EnhancedCard>
          </div>

          {/* Status */}
          <EnhancedCard variant="bordered" className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Status do Orçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {budgetPlan.categories.map((category) => {
                  const execRate = (category.currentSpent / category.plannedAmount) * 100;
                  const projVar = ((category.projectedSpent - category.plannedAmount) / category.plannedAmount) * 100;
                  const isOverBudget = category.projectedSpent > category.plannedAmount;
                  const isOnTrack = execRate >= 50 && execRate <= 85;
                  return (
                    <div key={category.id} className={`p-4 rounded-lg border ${isOverBudget ? 'bg-destructive/10 border-destructive/20' : isOnTrack ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
                      <div className="flex items-start gap-3">
                        {isOverBudget ? <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" /> : isOnTrack ? <CheckCircle className="h-5 w-5 text-success mt-0.5" /> : <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />}
                        <div className="flex-1">
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">{execRate.toFixed(1)}% executado • {projVar > 0 ? '+' : ''}{projVar.toFixed(1)}% vs planejado</p>
                          <Progress value={Math.min(execRate, 100)} className="h-2 mt-2" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetPlan.categories.map((category) => (
              <EnhancedCard key={category.id} variant="glass" className="p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.priority === "high" ? "default" : category.priority === "medium" ? "secondary" : "outline"}
                        className={category.priority === "high" ? "bg-destructive text-destructive-foreground" : ""}>
                        {category.priority === "high" ? "Alta" : category.priority === "medium" ? "Média" : "Baixa"}
                      </Badge>
                      <Button variant="ghost" size="sm"><Edit3 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-sm text-muted-foreground">Planejado</p><p className="font-bold">R$ {(category.plannedAmount / 1000).toFixed(0)}k</p></div>
                      <div><p className="text-sm text-muted-foreground">Executado</p><p className="font-bold text-warning">R$ {(category.currentSpent / 1000).toFixed(0)}k</p></div>
                      <div><p className="text-sm text-muted-foreground">Projetado</p><p className="font-bold text-info">R$ {(category.projectedSpent / 1000).toFixed(0)}k</p></div>
                    </div>
                    <Progress value={(category.currentSpent / category.plannedAmount) * 100} className="h-3" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Subcategorias:</h4>
                      {category.subcategories.map((sub, index) => (
                        <div key={index} className="flex justify-between items-center text-sm p-2 rounded bg-muted/30">
                          <span>{sub.name}</span>
                          <div className="flex items-center gap-2">
                            <span>R$ {(sub.current / 1000).toFixed(0)}k / R$ {(sub.planned / 1000).toFixed(0)}k</span>
                            <Badge variant="outline">{((sub.current / sub.planned) * 100).toFixed(0)}%</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </EnhancedCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          <EnhancedCard variant="floating" className="p-6">
            <CardHeader className="pb-4"><CardTitle>Projeção Mensal vs Planejado</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthlyProjection.map((m) => (
                  <div key={m.month} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors text-sm">
                    <span className="font-medium w-10">{m.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden relative">
                        <div className="h-full rounded-full bg-muted-foreground/20 absolute" style={{ width: `${(m.planned / (maxPlanned * 1.1)) * 100}%` }} />
                        <div className={`h-full rounded-full ${m.actual ? 'bg-primary' : 'bg-success/50'} relative`}
                          style={{ width: `${((m.actual || m.projected) / (maxPlanned * 1.1)) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Plan: R$ {(m.planned / 1000).toFixed(0)}k</span>
                      {m.actual ? (
                        <Badge className="bg-primary text-primary-foreground">Real: R$ {(m.actual / 1000).toFixed(0)}k</Badge>
                      ) : (
                        <Badge variant="outline">Proj: R$ {(m.projected / 1000).toFixed(0)}k</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance como KPIs */}
            <EnhancedCard variant="glass" className="p-6">
              <CardHeader className="pb-4"><CardTitle>Indicadores de Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{metric.atual}%</span>
                          <Badge variant={metric.atual >= metric.meta ? "default" : "secondary"}
                            className={metric.atual >= metric.meta ? "bg-success text-success-foreground" : ""}>
                            Meta: {metric.meta}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.atual} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span><span>Meta: {metric.meta}%</span><span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </EnhancedCard>

            {/* Resumo Geral */}
            <EnhancedCard variant="bordered" className="p-6">
              <CardHeader className="pb-4"><CardTitle>Resumo de Performance</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => {
                    const gap = metric.meta - metric.atual;
                    const onTarget = metric.atual >= metric.meta;
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${onTarget ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {onTarget ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                            <span className="font-medium">{metric.subject}</span>
                          </div>
                          <span className={`font-bold ${onTarget ? 'text-success' : 'text-warning'}`}>
                            {onTarget ? 'Na meta' : `${gap}% abaixo`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </EnhancedCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
