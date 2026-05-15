/**
 * Wizard de onboarding — 3 passos após o cadastro:
 * 1. Boas-vindas (vê demo ou vai configurar)
 * 2. Dados da fazenda (nome, área, localização)
 * 3. Convidar membros (co-proprietários/administradores)
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";
import {
  Leaf, MapPin, Users, ChevronRight, Check,
  Loader2, Mail, Shield, Eye, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function StepWelcome({ onSetup, onDemo }: { onSetup: () => void; onDemo: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <Leaf className="h-10 w-10 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Sistema Argom! 🌿</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Plataforma de gestão agrícola inteligente. Como deseja começar?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
        <button onClick={onSetup} className="p-5 rounded-2xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-left">
          <Leaf className="h-6 w-6 text-primary mb-2" />
          <p className="font-semibold text-sm">Configurar minha fazenda</p>
          <p className="text-xs text-muted-foreground mt-1">Insira os dados reais e comece agora</p>
          <Badge className="mt-3 bg-primary text-primary-foreground text-xs">Recomendado</Badge>
        </button>
        <button onClick={onDemo} className="p-5 rounded-2xl border-2 border-border hover:border-primary/40 hover:bg-muted/30 transition-all text-left">
          <Eye className="h-6 w-6 text-muted-foreground mb-2" />
          <p className="font-semibold text-sm">Explorar demonstração</p>
          <p className="text-xs text-muted-foreground mt-1">Veja o sistema com dados de exemplo</p>
          <Badge variant="outline" className="mt-3 text-xs">Demo</Badge>
        </button>
      </div>
    </div>
  );
}

function StepFarmSetup({ farmName, farmArea, farmLocation, farmDescription, onChange, onBack, onNext, saving }: {
  farmName: string; farmArea: number; farmLocation: string; farmDescription: string;
  onChange: (field: string, value: string | number) => void;
  onBack: () => void; onNext: () => Promise<void>; saving: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
        <h2 className="text-xl font-bold">Dados da sua fazenda</h2>
        <p className="text-sm text-muted-foreground">Pode alterar depois nas Configurações</p>
      </div>
      <div className="space-y-4 max-w-sm mx-auto">
        <div>
          <Label>Nome da Fazenda *</Label>
          <Input value={farmName} onChange={e => onChange("farmName", e.target.value)} placeholder="Ex: Fazenda Santa Clara" className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Área Total (ha)</Label>
            <Input type="number" value={farmArea || ""} onChange={e => onChange("farmArea", Number(e.target.value))} placeholder="Ex: 350" min={0} className="mt-1" />
          </div>
          <div>
            <Label>Estado / Cidade</Label>
            <Input value={farmLocation} onChange={e => onChange("farmLocation", e.target.value)} placeholder="Ex: Paraná, BR" className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Descrição (opcional)</Label>
          <Input value={farmDescription} onChange={e => onChange("farmDescription", e.target.value)} placeholder="Ex: Produção de soja e milho" className="mt-1" />
        </div>
      </div>
      <div className="flex gap-3 max-w-sm mx-auto">
        <Button variant="outline" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={onNext} disabled={!farmName.trim() || saving} className="flex-1 bg-primary text-primary-foreground">
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando…</> : <>Avançar <ChevronRight className="h-4 w-4 ml-1" /></>}
        </Button>
      </div>
    </div>
  );
}

function StepInvite({ onInvite, onFinish, farmName }: {
  onInvite: (email: string, role: "admin" | "viewer") => Promise<{ success: boolean; error?: string }>;
  onFinish: () => void; farmName: string;
}) {
  const { toast } = useToast();
  const [email, setEmail]     = useState("");
  const [role, setRole]       = useState<"admin" | "viewer">("viewer");
  const [invited, setInvited] = useState<Array<{ email: string; role: string }>>([]);
  const [sending, setSending] = useState(false);

  async function handleInvite() {
    if (!email.trim() || !email.includes("@")) { toast({ title: "E-mail inválido", variant: "destructive" }); return; }
    setSending(true);
    const result = await onInvite(email.trim(), role);
    setSending(false);
    if (result.success) {
      setInvited(prev => [...prev, { email: email.trim(), role }]);
      setEmail("");
      toast({ title: "Convite enviado!", description: `${email.trim()} foi convidado como ${role === "admin" ? "Administrador" : "Visualizador"}` });
    } else {
      toast({ title: "Erro ao convidar", description: result.error, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <Users className="h-8 w-8 text-primary mx-auto mb-2" />
        <h2 className="text-xl font-bold">Convidar membros</h2>
        <p className="text-sm text-muted-foreground">Adicione co-proprietários à <strong>{farmName}</strong></p>
      </div>
      <div className="max-w-sm mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {([{ value: "admin", label: "Administrador", desc: "Edita dados e convida membros", icon: Shield }, { value: "viewer", label: "Visualizador", desc: "Só visualiza, não edita", icon: Eye }] as const).map(({ value, label, desc, icon: Icon }) => (
            <button key={value} onClick={() => setRole(value)} className={cn("p-3 rounded-xl border text-left transition-all", role === value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30")}>
              <Icon className={cn("h-4 w-4 mb-1", role === value ? "text-primary" : "text-muted-foreground")} />
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </button>
          ))}
        </div>
        <div>
          <Label>E-mail do membro</Label>
          <div className="flex gap-2 mt-1">
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInvite()} placeholder="nome@email.com" />
            <Button onClick={handleInvite} disabled={sending || !email} size="icon" className="flex-shrink-0">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {invited.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Convites enviados:</p>
            {invited.map((m, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-success/5 border border-success/20">
                <Check className="h-3.5 w-3.5 text-success flex-shrink-0" />
                <span className="text-sm flex-1 truncate">{m.email}</span>
                <Badge variant="outline" className="text-xs">{m.role === "admin" ? "Admin" : "Viewer"}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3 max-w-sm mx-auto">
        <Button onClick={onFinish} className="flex-1 bg-primary text-primary-foreground">
          <Check className="h-4 w-4 mr-1" />{invited.length > 0 ? "Concluir" : "Pular por agora"}
        </Button>
      </div>
    </div>
  );
}

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const { onboarding, goToStep, updateField, completeFarmSetup, skipToDemo, inviteMember } = useOnboarding();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleFarmNext() {
    setSaving(true);
    const result = await completeFarmSetup();
    setSaving(false);
    if (result.success) goToStep("invite");
    else toast({ title: "Erro", description: result.error, variant: "destructive" });
  }

  function handleFinish() { goToStep("complete"); onComplete(); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg shadow-2xl border-2 border-primary/20">
        <CardHeader className="pb-2">
          {onboarding.step !== "welcome" && (
            <div className="flex gap-1.5 mb-4">
              {["farm-setup", "invite"].map((s, i) => (
                <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all", onboarding.step === "invite" && i === 0 ? "bg-primary" : onboarding.step === s ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              {onboarding.step === "welcome" && "Bem-vindo"}
              {onboarding.step === "farm-setup" && "Passo 1 de 2 — Sua Fazenda"}
              {onboarding.step === "invite" && "Passo 2 de 2 — Membros"}
            </CardTitle>
            {onboarding.step === "welcome" && (
              <button onClick={() => { skipToDemo(); onComplete(); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> Pular
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2 pb-6">
          {onboarding.step === "welcome" && <StepWelcome onSetup={() => goToStep("farm-setup")} onDemo={() => { skipToDemo(); onComplete(); }} />}
          {onboarding.step === "farm-setup" && (
            <StepFarmSetup
              farmName={onboarding.farmName} farmArea={onboarding.farmArea}
              farmLocation={onboarding.farmLocation} farmDescription={onboarding.farmDescription}
              onChange={(f, v) => updateField(f as keyof typeof onboarding, v)}
              onBack={() => goToStep("welcome")} onNext={handleFarmNext} saving={saving}
            />
          )}
          {onboarding.step === "invite" && (
            <StepInvite farmName={onboarding.farmName} onInvite={inviteMember} onFinish={handleFinish} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
