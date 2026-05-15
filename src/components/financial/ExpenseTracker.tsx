import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EnhancedCard } from "@/components/ui/enhanced-card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Filter, Search, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, DollarSign, Calendar, Tag, BarChart3, Target
} from "lucide-react";

const expenseCategories = [
  { id: 1, category: "Insumos Agrícolas", budget: 85000, spent: 72350, remaining: 12650, variance: -14.9, subcategories: [
    { name: "Sementes", budget: 25000, spent: 23500 }, { name: "Fertilizantes", budget: 35000, spent: 31200 }, { name: "Defensivos", budget: 25000, spent: 17650 }
  ]},
  { id: 2, category: "Combustível", budget: 18000, spent: 19850, remaining: -1850, variance: 10.3, subcategories: [
    { name: "Diesel", budget: 12000, spent: 13500 }, { name: "Gasolina", budget: 4000, spent: 4200 }, { name: "Lubrificantes", budget: 2000, spent: 2150 }
  ]},
  { id: 3, category: "Manutenção", budget: 22000, spent: 18750, remaining: 3250, variance: -14.8, subcategories: [
    { name: "Peças", budget: 12000, spent: 9800 }, { name: "Mão de obra", budget: 8000, spent: 7200 }, { name: "Oficina", budget: 2000, spent: 1750 }
  ]},
  { id: 4, category: "Mão de Obra", budget: 45000, spent: 42800, remaining: 2200, variance: -4.9, subcategories: [
    { name: "Salários", budget: 35000, spent: 35000 }, { name: "Encargos", budget: 7000, spent: 6300 }, { name: "Extras", budget: 3000, spent: 1500 }
  ]}
];

const monthlyExpenses = [
  { month: "Jan", total: 125000, target: 130000 },
  { month: "Fev", total: 118000, target: 130000 },
  { month: "Mar", total: 142000, target: 130000 },
  { month: "Abr", total: 135000, target: 130000 },
  { month: "Mai", total: 128000, target: 130000 },
  { month: "Jun", total: 153000, target: 130000 }
];

const recentExpenses = [
  { id: 1, date: "2024-01-15", description: "Fertilizante NPK - 50 sacas", category: "Insumos Agrícolas", amount: 8500, status: "approved" },
  { id: 2, date: "2024-01-14", description: "Combustível - Abastecimento mensal", category: "Combustível", amount: 3200, status: "approved" },
  { id: 3, date: "2024-01-13", description: "Manutenção trator John Deere", category: "Manutenção", amount: 2800, status: "pending" },
  { id: 4, date: "2024-01-12", description: "Sementes de soja - 100 kg", category: "Insumos Agrícolas", amount: 1200, status: "approved" },
  { id: 5, date: "2024-01-11", description: "Horas extras colheita", category: "Mão de Obra", amount: 1500, status: "pending" }
];

export function ExpenseTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const totalBudget = expenseCategories.reduce((acc, cat) => acc + cat.budget, 0);
  const totalSpent = expenseCategories.reduce((acc, cat) => acc + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUtilization = (totalSpent / totalBudget) * 100;
  const maxMonthly = Math.max(...monthlyExpenses.map(m => Math.max(m.total, m.target)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">Controle de Despesas</h2>
          <p className="text-muted-foreground">Gestão inteligente de custos operacionais</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Buscar despesas..." className="pl-10 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" />Filtros</Button>
          <Button variant="default" className="gap-2 button-premium"><Plus className="w-4 h-4" />Nova Despesa</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Orçamento Total</p><p className="text-xl font-bold">R$ {(totalBudget / 1000).toFixed(0)}k</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-warning/10"><TrendingUp className="h-5 w-5 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Gasto Atual</p><p className="text-xl font-bold text-warning">R$ {(totalSpent / 1000).toFixed(0)}k</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-success/10"><Target className="h-5 w-5 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Disponível</p><p className="text-xl font-bold text-success">R$ {(totalRemaining / 1000).toFixed(0)}k</p></div></div>
        </EnhancedCard>
        <EnhancedCard variant="glass" className="p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-info/10"><BarChart3 className="h-5 w-5 text-info" /></div>
            <div><p className="text-sm text-muted-foreground">Utilização</p><p className="text-xl font-bold text-info">{budgetUtilization.toFixed(1)}%</p></div></div>
        </EnhancedCard>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full lg:w-auto grid-cols-4 mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedCard variant="floating" className="p-6">
              <CardHeader className="pb-4"><CardTitle>Progresso Orçamentário</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category) => {
                    const util = (category.spent / category.budget) * 100;
                    const isOver = category.spent > category.budget;
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">R$ {category.spent.toLocaleString()} / R$ {category.budget.toLocaleString()}</span>
                            <Badge variant={isOver ? "destructive" : util > 80 ? "secondary" : "outline"}>{util.toFixed(0)}%</Badge>
                          </div>
                        </div>
                        <Progress value={Math.min(util, 100)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </EnhancedCard>

            <EnhancedCard variant="bordered" className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Alertas de Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.filter(cat => (cat.spent / cat.budget) > 0.8 || cat.spent > cat.budget).map((category) => {
                    const isOver = category.spent > category.budget;
                    return (
                      <div key={category.id} className={`p-4 rounded-lg border ${isOver ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'}`}>
                        <div className="flex items-start gap-3">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${isOver ? 'text-destructive' : 'text-warning'}`} />
                          <div className="flex-1">
                            <h4 className={`font-semibold ${isOver ? 'text-destructive' : 'text-warning'}`}>
                              {isOver ? 'Orçamento Excedido' : 'Atenção: 80% do Orçamento'}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {category.category}: {((category.spent / category.budget) * 100).toFixed(1)}% utilizado
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">Revisar Categoria</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </EnhancedCard>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expenseCategories.map((category) => (
              <EnhancedCard key={category.id} variant="glass" className="p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                    <Badge variant={category.spent > category.budget ? "destructive" : "default"}
                      className={category.variance < 0 ? "bg-success text-success-foreground" : ""}>
                      {category.variance > 0 ? '+' : ''}{category.variance.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div><p className="text-sm text-muted-foreground">Orçado</p><p className="font-bold">R$ {(category.budget / 1000).toFixed(0)}k</p></div>
                      <div><p className="text-sm text-muted-foreground">Gasto</p><p className="font-bold text-warning">R$ {(category.spent / 1000).toFixed(0)}k</p></div>
                      <div><p className="text-sm text-muted-foreground">Restante</p><p className={`font-bold ${category.remaining < 0 ? 'text-destructive' : 'text-success'}`}>R$ {Math.abs(category.remaining / 1000).toFixed(0)}k</p></div>
                    </div>
                    <Progress value={Math.min((category.spent / category.budget) * 100, 100)} className="h-3" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Subcategorias:</h4>
                      {category.subcategories.map((sub, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{sub.name}</span>
                          <div className="flex items-center gap-2">
                            <span>R$ {sub.spent.toLocaleString()}</span>
                            <Badge variant="outline">{((sub.spent / sub.budget) * 100).toFixed(0)}%</Badge>
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

        <TabsContent value="trends" className="space-y-6">
          <EnhancedCard variant="floating" className="p-6">
            <CardHeader className="pb-4"><CardTitle>Evolução Mensal de Despesas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyExpenses.map((m) => {
                  const isOver = m.total > m.target;
                  return (
                    <div key={m.month} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                      <span className="font-medium w-10">{m.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isOver ? 'bg-destructive/70' : 'bg-primary'}`}
                            style={{ width: `${(m.total / maxMonthly) * 100}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={isOver ? "text-destructive font-semibold" : "font-semibold"}>R$ {(m.total / 1000).toFixed(0)}k</span>
                        <span className="text-muted-foreground">/ R$ {(m.target / 1000).toFixed(0)}k</span>
                        {isOver && <Badge variant="destructive" className="text-xs">Acima</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <EnhancedCard variant="bordered" className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Despesas Recentes</CardTitle>
                <Button variant="outline" size="sm"><Calendar className="w-4 h-4 mr-2" />Últimos 30 dias</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted"><Tag className="h-4 w-4" /></div>
                      <div>
                        <h4 className="font-semibold">{expense.description}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{expense.category}</span><span>•</span><span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">R$ {expense.amount.toLocaleString()}</span>
                      <Badge variant={expense.status === "approved" ? "default" : "secondary"}
                        className={expense.status === "approved" ? "bg-success text-success-foreground" : ""}>
                        {expense.status === "approved" ? "Aprovado" : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
