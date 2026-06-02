import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Mail,
  ShieldCheck,
  History,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mocks para simular a base de dados
const MOCK_TEAM = [
  {
    id: 1,
    email: "joao.silva@fazenda.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    email: "maria.souza@fazenda.com",
    role: "operador_maquinas",
    status: "active",
    joinedAt: "2024-02-10",
  },
  {
    id: 3,
    email: "pedro.tecnico@agronomia.com",
    role: "agronomo",
    status: "pending",
    joinedAt: "-",
  },
];

const MOCK_ROLES = [
  { id: "admin", name: "Administrador Geral" },
  { id: "operador_maquinas", name: "Operador de Máquinas" },
  { id: "agronomo", name: "Engenheiro Agrônomo" },
  { id: "co_owner", name: "Co-Dono (Acesso Total)" },
];

const MOCK_LOGS = [
  {
    id: 1,
    user: "joao.silva@fazenda.com",
    action: "Adicionou novo trator",
    date: "Hoje, 14:30",
  },
  {
    id: 2,
    user: "Dono (Você)",
    action: "Criou cargo 'Engenheiro Agrônomo'",
    date: "Ontem, 09:15",
  },
  {
    id: 3,
    user: "Sistema",
    action: "Alerta Crítico: Geada",
    date: "12/05/2024, 02:00",
  },
];

const AVAILABLE_PERMISSIONS = [
  { id: "manage_users", label: "Gerenciar Equipe" },
  { id: "view_finance", label: "Visualizar Finanças" },
  { id: "manage_finance", label: "Gerenciar Finanças" },
  { id: "manage_equipment", label: "Gerenciar Equipamentos" },
  { id: "manage_tasks", label: "Criar/Editar Tarefas" },
];

interface TeamManagementProps {
  role?: "owner" | "manager" | "worker";
  currentUserEmail?: string;
}

export function TeamManagement({
  role = "worker",
  currentUserEmail = "",
}: TeamManagementProps) {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("operador_maquinas");
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCoOwner, setIsCoOwner] = useState(false);

  const isOwner = role === "owner";
  const isManager = role === "manager";
  const isWorker = role === "worker";
  const canInvite = isOwner || isManager;
  const canCreateRole = isOwner;
  const canEditRoles = isOwner;
  const canRemoveMembers = isOwner;
  const availableInviteRoles = isOwner
    ? MOCK_ROLES
    : MOCK_ROLES.filter(
        (role) => role.id !== "admin" && role.id !== "co_owner",
      );
  const roleLabel = isOwner
    ? "Proprietário"
    : isManager
      ? "Gerente"
      : "Trabalhador";

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canInvite) {
      toast({
        title: "Acesso negado",
        description:
          "Somente proprietários ou gerentes podem convidar novos membros.",
      });
      return;
    }

    if (!inviteEmail) return;

    toast({
      title: "Convite Enviado!",
      description: `Um email foi enviado para ${inviteEmail} para se juntar à fazenda.`,
    });
    setInviteEmail("");
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

  const handleCoOwnerToggle = (checked: boolean) => {
    setIsCoOwner(checked);
    if (checked) {
      setSelectedPermissions(AVAILABLE_PERMISSIONS.map((p) => p.id));
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateRole) {
      toast({
        title: "Acesso negado",
        description: "Somente o proprietário pode criar cargos personalizados.",
      });
      return;
    }

    if (!newRoleName) return;
    toast({
      title: "Cargo Criado",
      description: `O cargo "${newRoleName}" foi criado com as permissões selecionadas.`,
    });
    setNewRoleName("");
    setIsCoOwner(false);
    setSelectedPermissions([]);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {isWorker ? "Minha Equipe" : "Membros da Fazenda"}
          </CardTitle>
          <CardDescription>
            {isOwner
              ? "Convide funcionários e parceiros para acessar o sistema"
              : isManager
                ? "Gerencie a equipe com permissões limitadas pelo proprietário"
                : "Veja as pessoas que trabalham na fazenda e as permissões que você possui"}
          </CardDescription>
          <div className="mt-3">
            <Badge
              variant="secondary"
              className="uppercase text-[11px] tracking-[0.24em] text-muted-foreground"
            >
              {roleLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {canInvite ? (
            <form
              onSubmit={handleInvite}
              className="flex gap-4 items-end flex-wrap sm:flex-nowrap"
            >
              <div className="flex-1 space-y-2 min-w-[200px]">
                <Label htmlFor="inviteEmail">E-mail do novo membro</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="funcionario@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/3 space-y-2">
                <Label>Cargo Inicial</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableInviteRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="gap-2 w-full sm:w-auto">
                <Mail className="w-4 h-4" /> Convidar
              </Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/80 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Acesso restrito</p>
              <p>
                Você não pode convidar novos membros. Peça ao proprietário para
                conceder mais acesso ou adicionar colaboradores.
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              Membros Atuais
            </h4>
            {MOCK_TEAM.map((member) => {
              const isSelf = member.email === currentUserEmail;
              const canEditRole = canEditRoles && !isSelf;
              const canDelete = canRemoveMembers && !isSelf;
              const memberRole =
                MOCK_ROLES.find((item) => item.id === member.role)?.name ||
                member.role;

              return (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card shadow-sm gap-4"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.email}</p>
                      {isSelf && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-primary/5"
                        >
                          Você
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      Desde: {member.joinedAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isWorker ? (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                        {memberRole}
                      </span>
                    ) : (
                      <Select
                        disabled={!canEditRole}
                        defaultValue={member.role}
                      >
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_ROLES.map((role) => (
                            <SelectItem
                              key={role.id}
                              value={role.id}
                              className="text-xs"
                            >
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {member.status === "pending" ? (
                      <Badge
                        variant="secondary"
                        className="bg-warning/10 text-warning hidden sm:inline-flex"
                      >
                        Pendente
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-success/10 text-success hidden sm:inline-flex"
                      >
                        Ativo
                      </Badge>
                    )}

                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Gestão de Cargos e Permissões
          </CardTitle>
          <CardDescription>
            {canCreateRole
              ? "Crie cargos personalizados com permissões específicas para sua equipe"
              : "Somente o proprietário pode criar cargos e alterar permissões avançadas."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {canCreateRole ? (
            <form onSubmit={handleCreateRole} className="space-y-6">
              <div className="space-y-2 max-w-md">
                <Label htmlFor="roleName">Nome do Novo Cargo</Label>
                <Input
                  id="roleName"
                  placeholder="Ex: Operador de Silo, Co-Dono"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base">Permissões Específicas</Label>

                <div className="p-3 border border-primary/20 bg-primary/5 rounded-md flex items-center space-x-2">
                  <Checkbox
                    id="coOwner"
                    checked={isCoOwner}
                    onCheckedChange={(checked) =>
                      handleCoOwnerToggle(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="coOwner"
                    className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Acesso Total / Co-Dono (Marca todas as opções)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={perm.id}
                        checked={selectedPermissions.includes(perm.id)}
                        onCheckedChange={() => togglePermission(perm.id)}
                        disabled={isCoOwner}
                      />
                      <label
                        htmlFor={perm.id}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {perm.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" variant="default" className="gap-2">
                <PlusCircle className="w-4 h-4" /> Criar Cargo e Permissões
              </Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/80 p-4 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Acesso restrito</p>
              <p>
                Somente o proprietário pode criar cargos personalizados e
                definir permissões avançadas.
              </p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <Label>Cargos Existentes no Sistema</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {MOCK_ROLES.map((role) => (
                <Badge
                  key={role.id}
                  variant="secondary"
                  className="px-3 py-1 text-sm bg-muted text-foreground border shadow-sm"
                >
                  {role.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Logs de Auditoria
          </CardTitle>
          <CardDescription>
            Registro de acessos e mudanças importantes feitas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_LOGS.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    Por: {log.user}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground mt-2 sm:mt-0 bg-muted/50 px-2 py-1 rounded">
                  {log.date}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
