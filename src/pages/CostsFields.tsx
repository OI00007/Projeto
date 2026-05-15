import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  MapPinned,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Droplets,
  Sprout,
  Plus,
  Download,
  BarChart3
} from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const CostsFields = () => {
  const fields = [
    {
      id: 1,
      name: "Talhão A-1",
      area: 150,
      crop: "Soja",
      costs: {
        seeds: 45000,
        fertilizers: 38000,
        pesticides: 22000,
        labor: 35000,
        irrigation: 18000,
        total: 158000,
      },
      revenue: 280000,
      profit: 122000,
      roi: 77.2,
      productivity: 4.5,
    },
    {
      id: 2,
      name: "Talhão A-2",
      area: 100,
      crop: "Milho",
      costs: {
        seeds: 28000,
        fertilizers: 32000,
        pesticides: 18000,
        labor: 25000,
        irrigation: 15000,
        total: 118000,
      },
      revenue: 180000,
      profit: 62000,
      roi: 52.5,
      productivity: 6.2,
    },
    {
      id: 3,
      name: "Talhão B-1",
      area: 80,
      crop: "Algodão",
      costs: {
        seeds: 35000,
        fertilizers: 28000,
        pesticides: 25000,
        labor: 30000,
        irrigation: 22000,
        total: 140000,
      },
      revenue: 200000,
      profit: 60000,
      roi: 42.9,
      productivity: 3.8,
    },
    {
      id: 4,
      name: "Talhão B-2",
      area: 50,
      crop: "Feijão",
      costs: {
        seeds: 18000,
        fertilizers: 15000,
        pesticides: 12000,
        labor: 20000,
        irrigation: 10000,
        total: 75000,
      },
      revenue: 95000,
      profit: 20000,
      roi: 26.7,
      productivity: 2.1,
    },
  ];

  const totalArea = fields.reduce((sum, field) => sum + field.area, 0);
  const totalCosts = fields.reduce((sum, field) => sum + field.costs.total, 0);
  const totalRevenue = fields.reduce((sum, field) => sum + field.revenue, 0);
  const totalProfit = totalRevenue - totalCosts;
  const avgROI = fields.reduce((sum, field) => sum + field.roi, 0) / fields.length;

  const costCategories = [
    { name: "Sementes", total: fields.reduce((s, f) => s + f.costs.seeds, 0), icon: Sprout, color: "text-primary" },
    { name: "Fertilizantes", total: fields.reduce((s, f) => s + f.costs.fertilizers, 0), icon: Droplets, color: "text-success" },
    { name: "Defensivos", total: fields.reduce((s, f) => s + f.costs.pesticides, 0), icon: Sprout, color: "text-warning" },
    { name: "Mão de Obra", total: fields.reduce((s, f) => s + f.costs.labor, 0), icon: DollarSign, color: "text-info" },
    { name: "Irrigação", total: fields.reduce((s, f) => s + f.costs.irrigation, 0), icon: Droplets, color: "text-accent" },
  ];

  return (
    <DashboardLayout 
      title="Custos por Talhão" 
      subtitle="Análise detalhada de rentabilidade por área de cultivo"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm" className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Talhão
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Overview Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Área Total
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPinned className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={totalArea} suffix=" ha" />
              </div>
              <p className="text-xs text-muted-foreground">{fields.length} talhões</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Custo Total
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={totalCosts / 1000} prefix="R$ " suffix="k" decimals={1} />
              </div>
              <p className="text-xs text-muted-foreground">R$ {(totalCosts / totalArea).toFixed(0)}/ha</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Total
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">
                <AnimatedCounter value={totalProfit / 1000} prefix="R$ " suffix="k" decimals={1} />
              </div>
              <p className="text-xs text-muted-foreground">Margem: {((totalProfit / totalRevenue) * 100).toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                ROI Médio
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedCounter value={avgROI} suffix="%" decimals={1} />
              </div>
              <p className="text-xs text-muted-foreground">Retorno sobre investimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
            <CardDescription>Análise por categoria de despesa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {costCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <category.icon className={`h-4 w-4 ${category.color}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold">R$ {(category.total / 1000).toFixed(0)}k</p>
                  <Progress value={(category.total / totalCosts) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {((category.total / totalCosts) * 100).toFixed(1)}% do total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fields Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <Card key={field.id} className="glass-card hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <MapPinned className="h-5 w-5 text-primary" />
                      {field.name}
                    </CardTitle>
                    <CardDescription>
                      {field.area} hectares • {field.crop}
                    </CardDescription>
                  </div>
                  <Badge className={
                    field.roi > 60 ? "bg-success/10 text-success" :
                    field.roi > 40 ? "bg-info/10 text-info" :
                    "bg-warning/10 text-warning"
                  }>
                    ROI: {field.roi}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground">Custo Total</p>
                    <p className="text-lg font-bold text-destructive">
                      R$ {(field.costs.total / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Receita</p>
                    <p className="text-lg font-bold text-foreground">
                      R$ {(field.revenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lucro</p>
                    <p className="text-lg font-bold text-success">
                      R$ {(field.profit / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Detalhamento de Custos</p>
                  {Object.entries(field.costs).filter(([key]) => key !== 'total').map(([key, value]) => {
                    const labels: Record<string, string> = {
                      seeds: "Sementes",
                      fertilizers: "Fertilizantes",
                      pesticides: "Defensivos",
                      labor: "Mão de Obra",
                      irrigation: "Irrigação"
                    };
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{labels[key]}</span>
                          <span className="font-medium">R$ {(value / 1000).toFixed(1)}k</span>
                        </div>
                        <Progress value={(value / field.costs.total) * 100} className="h-1" />
                      </div>
                    );
                  })}
                </div>

                {/* Productivity */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Produtividade</span>
                  <span className="text-sm font-bold">{field.productivity} ton/ha</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CostsFields;
