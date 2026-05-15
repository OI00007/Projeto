import { StatsCard } from "@/components/dashboard/StatsCard";
import { EnhancedWeatherWidget } from "@/components/dashboard/EnhancedWeatherWidget";
import { SoilHealthCard } from "@/components/dashboard/SoilHealthCard";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { ProductivityCard } from "@/components/dashboard/ProductivityCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { NotificationSystem } from "@/components/dashboard/NotificationSystem";
import { ReportGenerator } from "@/components/dashboard/ReportGenerator";
import { AutomationPanel } from "@/components/dashboard/AutomationPanel";
import { RealTimeMetrics } from "@/components/dashboard/RealTimeMetrics";
import { SmartAlerts } from "@/components/dashboard/SmartAlerts";
import { CropMonitoringCard } from "@/components/dashboard/CropMonitoringCard";
import { LiveDataFeed } from "@/components/dashboard/LiveDataFeed";
import { CommoditiesWidget } from "@/components/dashboard/CommoditiesWidget";
import { InventoryManagement } from "@/components/dashboard/InventoryManagement";
import { TaskManager } from "@/components/dashboard/TaskManager";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { ProductionOverview } from "@/components/dashboard/ProductionOverview";
import { MachineryStatus } from "@/components/dashboard/MachineryStatus";
import {
  useFarmData,
  useSensorData,
  useFinancialData,
} from "@/contexts/FarmDataContext";
import { Thermometer, Droplets, DollarSign, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  // Use shared context data
  const { metrics, lastUpdated } = useFarmData();
  const { temperatureSensor, humiditySensor, sensors } = useSensorData();
  const { financial } = useFinancialData();

  // Calculate totals from shared financial data
  const totalReceita = financial.revenue;
  const totalLucro = financial.profit;
  const margemLucro = financial.profitMargin;
  const criticalAlerts = sensors.filter((s) => s.status === "critical").length;
  const warningAlerts = sensors.filter((s) => s.status === "warning").length;

  return (
    <DashboardLayout
      title="Dashboard da Fazenda"
      subtitle="Gestão Inteligente de Propriedades Rurais"
    >
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Quick Actions - Mobile First */}
        <div className="hidden sm:block">
          <QuickActions />
        </div>

        {/* Enhanced Stats Grid with Real Data - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in transition-all duration-500">
          <StatsCard
            title="Temperatura Atual"
            value={`${temperatureSensor?.value || 28}°C`}
            trend={`${temperatureSensor?.status === "normal" ? "+" : ""}2°C desde ontem`}
            icon={<Thermometer className="h-6 w-6" />}
            variant={
              temperatureSensor?.status === "warning" ? "warning" : "default"
            }
            target={30}
            historical={[
              {
                period: "Ontem",
                value: Number(temperatureSensor?.value || 28) - 2,
              },
              {
                period: "Semana passada",
                value: Number(temperatureSensor?.value || 28) - 4,
              },
              {
                period: "Mês passado",
                value: Number(temperatureSensor?.value || 28) - 5,
              },
            ]}
            details={{
              description:
                "Temperatura ambiente registrada pelos sensores distribuídos pela propriedade",
              metrics: [
                {
                  label: "Temperatura Máxima (24h)",
                  value: `${Number(temperatureSensor?.value || 28) + 4}°C`,
                  status: "good",
                },
                {
                  label: "Temperatura Mínima (24h)",
                  value: `${Number(temperatureSensor?.value || 28) - 10}°C`,
                  status: "good",
                },
                { label: "Variação Diária", value: "14°C", status: "warning" },
                { label: "Zona de Conforto", value: "85%", status: "good" },
              ],
            }}
          />
          <StatsCard
            title="Umidade do Solo"
            value={`${humiditySensor?.value || 65}%`}
            subtitle={
              humiditySensor?.status === "critical"
                ? "Crítica - Irrigar"
                : "Ideal para a cultura"
            }
            icon={<Droplets className="h-6 w-6" />}
            variant={
              humiditySensor?.status === "critical" ? "warning" : "success"
            }
            target={70}
            historical={[
              {
                period: "Ontem",
                value: Number(humiditySensor?.value || 65) - 2,
              },
              {
                period: "Semana passada",
                value: Number(humiditySensor?.value || 65) - 7,
              },
              {
                period: "Mês passado",
                value: Number(humiditySensor?.value || 65) - 10,
              },
            ]}
            details={{
              description:
                "Nível de umidade do solo medido por sensores em diferentes profundidades",
              metrics: [
                {
                  label: "Umidade Superficial (0-10cm)",
                  value: `${Number(humiditySensor?.value || 65) + 3}%`,
                  status: "good",
                },
                {
                  label: "Umidade Média (10-30cm)",
                  value: `${humiditySensor?.value || 65}%`,
                  status: "good",
                },
                {
                  label: "Umidade Profunda (30-60cm)",
                  value: `${Number(humiditySensor?.value || 65) - 3}%`,
                  status: "warning",
                },
                { label: "Capacidade de Campo", value: "92%", status: "good" },
              ],
            }}
          />
          <StatsCard
            title="Receita Mensal"
            value={`R$ ${(financial.revenue / 12).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`}
            trend={`+${financial.profitMargin.toFixed(1)}% margem de lucro`}
            icon={<DollarSign className="h-6 w-6" />}
            variant="premium"
            target={75000}
            historical={financial.monthlyData.slice(-3).map((month) => ({
              period: month.month,
              value: month.receita,
            }))}
            details={{
              description: "Receita total gerada pela propriedade no período",
              metrics: [
                {
                  label: "Receita Total",
                  value: `R$ ${financial.revenue.toLocaleString("pt-BR")}`,
                  status: "good",
                },
                {
                  label: "Custos Totais",
                  value: `R$ ${financial.expenses.toLocaleString("pt-BR")}`,
                  status: "good",
                },
                {
                  label: "Lucro Líquido",
                  value: `R$ ${financial.profit.toLocaleString("pt-BR")}`,
                  status: "good",
                },
                {
                  label: "Margem de Lucro",
                  value: `${financial.profitMargin.toFixed(1)}%`,
                  status: financial.profitMargin > 20 ? "good" : "warning",
                },
              ],
            }}
          />
          <StatsCard
            title="Alertas Ativos"
            value={`${criticalAlerts + warningAlerts}`}
            subtitle={`${criticalAlerts} críticos, ${warningAlerts} avisos`}
            icon={<AlertTriangle className="h-6 w-6" />}
            variant={criticalAlerts > 0 ? "warning" : "default"}
            target={0}
            historical={[
              { period: "Ontem", value: criticalAlerts + warningAlerts - 1 },
              {
                period: "Semana passada",
                value: Math.max(0, criticalAlerts + warningAlerts - 2),
              },
              {
                period: "Mês passado",
                value: criticalAlerts + warningAlerts + 1,
              },
            ]}
            details={{
              description:
                "Sistema de monitoramento de alertas e notificações da fazenda",
              metrics: [
                {
                  label: "Alertas Críticos",
                  value: `${criticalAlerts}`,
                  status: criticalAlerts > 0 ? "critical" : "good",
                },
                {
                  label: "Alertas de Aviso",
                  value: `${warningAlerts}`,
                  status: warningAlerts > 0 ? "warning" : "good",
                },
                {
                  label: "Tempo Médio de Resolução",
                  value: "2.5h",
                  status: "good",
                },
                { label: "Taxa de Resolução", value: "95%", status: "good" },
              ],
            }}
          />
        </div>

        {/* Priority Financial Section - Enhanced for Mobile */}
        <div className="mb-8 p-4 sm:p-6 rounded-xl gradient-primary text-primary-foreground animate-slide-up shadow-medium hover:shadow-large transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display">
                🏆 Seção Financeira Prioritária
              </h2>
              <p className="opacity-90 text-sm sm:text-base">
                Gestão completa das finanças da sua propriedade
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/financial")}
              className="bg-white/20 hover:bg-white/30 border-white/30 touch-target mobile-tap-highlight w-full sm:w-auto"
            >
              Ver Detalhes Completos
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Receita Anual
              </h3>
              <p className="text-xl sm:text-2xl font-bold font-display">
                R$ {(totalReceita / 1000).toFixed(0)}k
              </p>
              <p className="text-xs sm:text-sm opacity-75">
                +12.5% vs ano anterior
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Lucro Líquido
              </h3>
              <p className="text-xl sm:text-2xl font-bold font-display">
                R$ {(totalLucro / 1000).toFixed(0)}k
              </p>
              <p className="text-xs sm:text-sm opacity-75">
                Margem: {margemLucro.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                ROI Médio
              </h3>
              <p className="text-xl sm:text-2xl font-bold font-display">
                43.8%
              </p>
              <p className="text-xs sm:text-sm opacity-75">Acima da meta</p>
            </div>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 animate-fade-in">
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Receita Total
            </p>
            <p className="text-xl font-bold text-success">
              R$ {(financial.revenue / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              +12.5% vs anterior
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Custos Totais
            </p>
            <p className="text-xl font-bold text-destructive">
              R$ {(financial.expenses / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">Sob controle</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Lucro Líquido
            </p>
            <p className="text-xl font-bold text-primary">
              R$ {(financial.profit / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Margem {financial.profitMargin.toFixed(1)}%
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Temperatura
            </p>
            <p className="text-xl font-bold text-foreground">
              {temperatureSensor?.value || 28}°C
            </p>
            <p className="text-xs text-muted-foreground mt-1">Sensor ativo</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Umidade Solo
            </p>
            <p className="text-xl font-bold text-foreground">
              {humiditySensor?.value || 65}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Nível ideal</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:-translate-y-1 transition-all">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Eficiência
            </p>
            <p className="text-xl font-bold text-foreground">92%</p>
            <p className="text-xs text-muted-foreground mt-1">Meta: 90%</p>
          </div>
        </div>

        {/* Commodities + Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CommoditiesWidget />
          <EnhancedWeatherWidget />
        </div>

        {/* Enhanced Secondary Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <RealTimeMetrics />
        </div>

        {/* Specialized Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SoilHealthCard />
          <ProductivityCard />
        </div>

        {/* Advanced Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AutomationPanel />
          <ReportGenerator />
        </div>

        {/* Advanced Monitoring Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CropMonitoringCard />
          <LiveDataFeed />
        </div>

        {/* Intelligent Alerts System */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <SmartAlerts />
        </div>

        {/* Advanced Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DashboardMetrics />
          <ProductionOverview />
          <MachineryStatus />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <TaskManager />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <InventoryManagement />
        </div>

        {/* Bottom Grid - Legacy Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
