import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Zap, CheckCircle2, AlertTriangle, Users, Cpu } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type PlanTier = 'basic' | 'moderate' | 'complete';

interface PlanDetails {
  name: string;
  price: number;
  maxAdmins: number;
  maxSensors: number;
  features: string[];
}

const PLAN_LIMITS: Record<PlanTier, PlanDetails> = {
  basic: {
    name: "Básico",
    price: 199,
    maxAdmins: 1,
    maxSensors: 5,
    features: ["Acesso ao Dashboard", "Previsão do Tempo", "Suporte Email"]
  },
  moderate: {
    name: "Moderado",
    price: 499,
    maxAdmins: 3,
    maxSensors: 20,
    features: ["Acesso ao Dashboard", "IA e Relatórios", "Suporte Prioritário", "Gestão de Tarefas"]
  },
  complete: {
    name: "Completo",
    price: 999,
    maxAdmins: 999, // unlimited
    maxSensors: 9999, // unlimited
    features: ["Tudo do Moderado", "Sensores Ilimitados", "Admins Ilimitados", "Integração via API", "Gerente de Conta"]
  }
};

const AdminHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isOwner = !!user?.user_metadata?.cpf;

  // Simulated data for now, ideally fetched from Supabase `subscriptions` and `metrics`
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('basic');
  const [currentAdmins, setCurrentAdmins] = useState(1);
  const [currentSensors, setCurrentSensors] = useState(3);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const planInfo = PLAN_LIMITS[currentPlan];

  const adminUsagePercent = planInfo.maxAdmins === 999 ? 0 : (currentAdmins / planInfo.maxAdmins) * 100;
  const sensorUsagePercent = planInfo.maxSensors === 9999 ? 0 : (currentSensors / planInfo.maxSensors) * 100;

  const handleChangePlan = (plan: PlanTier) => {
    setIsChangingPlan(true);
    // Simulate API Call
    setTimeout(() => {
      setCurrentPlan(plan);
      setIsChangingPlan(false);
      toast({
        title: "Plano Alterado",
        description: `Seu plano foi atualizado para o pacote ${PLAN_LIMITS[plan].name}.`,
      });
    }, 1500);
  };

  return (
    <DashboardLayout 
      title="Admin Hub & Assinatura" 
      subtitle="Gerencie o plano da sua fazenda e limites de uso"
    >
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Current Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Zap className="h-5 w-5 text-warning" />
                    Plano Atual: {planInfo.name}
                  </CardTitle>
                  <CardDescription>Gerencie seus limites de uso mensais</CardDescription>
                </div>
                <Badge variant={currentPlan === 'complete' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                  R$ {planInfo.price}<span className="text-sm font-normal">/mês</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Users className="h-4 w-4" /> Administradores / Sub-donos
                  </span>
                  <span className={adminUsagePercent >= 100 ? "text-destructive font-bold" : "text-muted-foreground"}>
                    {currentAdmins} / {planInfo.maxAdmins === 999 ? 'Ilimitado' : planInfo.maxAdmins}
                  </span>
                </div>
                {planInfo.maxAdmins !== 999 && (
                  <Progress value={adminUsagePercent} className={`h-2 ${adminUsagePercent >= 100 ? 'bg-destructive/20' : ''}`} />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Cpu className="h-4 w-4" /> Sensores Ativos
                  </span>
                  <span className={sensorUsagePercent >= 100 ? "text-destructive font-bold" : "text-muted-foreground"}>
                    {currentSensors} / {planInfo.maxSensors === 9999 ? 'Ilimitado' : planInfo.maxSensors}
                  </span>
                </div>
                {planInfo.maxSensors !== 9999 && (
                  <Progress value={sensorUsagePercent} className={`h-2 ${sensorUsagePercent >= 100 ? 'bg-destructive/20' : ''}`} />
                )}
              </div>

              {(adminUsagePercent >= 100 || sensorUsagePercent >= 100) && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-start gap-2 border border-destructive/20">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <p>Você atingiu o limite do seu plano atual. Faça o upgrade para continuar expandindo sua operação.</p>
                </div>
              )}

            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Permissões & Segurança
              </CardTitle>
              <CardDescription>Sua credencial de acesso atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Titular da Conta</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-none">
                  Owner (Proprietário)
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Apenas o Proprietário pode alterar planos de assinatura e visualizar dados de auditoria profunda. 
                Use a página de Perfil para convidar membros e delegar permissões (Sub-donos e Admins).
              </p>
            </CardContent>
          </Card>
        </div>

        {!isOwner ? (
          <Card className="glass-card border-destructive/20 bg-destructive/5 mt-8">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
              <p className="text-muted-foreground max-w-md">
                Você não possui privilégios de Proprietário para gerenciar as assinaturas e limites desta fazenda.
                Caso precise de mais capacidade, entre em contato com o Titular da conta.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* Upgrade Plans Grid */
          <div className="pt-6">
          <h3 className="text-2xl font-bold font-display mb-6">Mudar de Plano</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(PLAN_LIMITS) as [PlanTier, PlanDetails][]).map(([key, plan]) => {
              const isCurrent = currentPlan === key;
              return (
                <Card key={key} className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${isCurrent ? 'border-primary shadow-medium bg-primary/5' : 'hover:-translate-y-1'}`}>
                  {isCurrent && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <Badge className="bg-primary text-primary-foreground">Plano Atual</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold">R$ {plan.price}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="font-medium">{plan.maxAdmins === 999 ? 'Ilimitados' : plan.maxAdmins} Administradores</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="font-medium">{plan.maxSensors === 9999 ? 'Ilimitados' : plan.maxSensors} Sensores</span>
                      </li>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button 
                      className="w-full" 
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || isChangingPlan}
                      onClick={() => handleChangePlan(key)}
                    >
                      {isChangingPlan && !isCurrent ? 'Processando...' : isCurrent ? 'Plano Atual' : 'Fazer Upgrade'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminHub;
