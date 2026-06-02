import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Building,
  Shield,
  Bell,
  Lock,
  Save,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { TeamManagement } from "@/components/profile/TeamManagement";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isOwner = !!user?.user_metadata?.cpf;
  const isManager =
    user?.email === "joao.silva@fazenda.com" || user?.email?.includes("admin"); // MOCK
  const currentRole: "owner" | "manager" | "worker" = isOwner
    ? "owner"
    : isManager
      ? "manager"
      : "worker";

  // Form states
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setProfile(data);
          setFullName(data.full_name || "");
          setCompany(data.company || "");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError("");

    try {
      const profileData = {
        user_id: user.id,
        full_name: fullName,
        company,
      };

      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) throw error;

      setProfile((prev) => ({ ...prev!, ...profileData }));

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos de senha são obrigatórios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("A nova senha e confirmação não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Perfil do Usuário"
      subtitle="Gerencie suas informações pessoais e configurações"
    >
      <div className="max-w-4xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full h-auto grid-cols-4">
            <TabsTrigger value="profile" className="py-3 text-xs sm:text-sm">
              <User className="w-4 h-4 mr-2 hidden sm:inline" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="team" className="py-3 text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-2 hidden sm:inline" />
              Gerenciamento de Pessoal
            </TabsTrigger>
            <TabsTrigger value="security" className="py-3 text-xs sm:text-sm">
              <Lock className="w-4 h-4 mr-2 hidden sm:inline" />
              Segurança
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="py-3 text-xs sm:text-sm"
            >
              <Bell className="w-4 h-4 mr-2 hidden sm:inline" />
              Notificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-slide-up">
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {fullName?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>
                      Atualize suas informações de perfil
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      O email não pode ser alterado por segurança
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company">Empresa/Fazenda</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Nome da sua propriedade"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Status da Conta</h3>
                    <p className="text-sm text-muted-foreground">
                      Informações sobre sua conta
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={updateProfile}
                  disabled={saving}
                  className="w-full md:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="animate-slide-up">
            <TeamManagement
              role={currentRole}
              currentUserEmail={user?.email || ""}
            />
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-slide-up">
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Configurações de Segurança
                </CardTitle>
                <CardDescription>
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite sua senha atual"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                    />
                    <PasswordStrengthIndicator password={newPassword} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                </div>

                <Button
                  onClick={updatePassword}
                  disabled={
                    saving ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  variant="outline"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {saving ? "Atualizando..." : "Atualizar Senha"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="notifications"
            className="space-y-6 animate-slide-up"
          >
            <Card className="shadow-soft hover:shadow-medium transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificação
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações por Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Receba atualizações importantes por email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Push</h4>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações em tempo real no navegador
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas Climáticos</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre condições meteorológicas
                      </p>
                    </div>
                    <Switch
                      checked={weatherAlerts}
                      onCheckedChange={setWeatherAlerts}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alertas do Sistema</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificações sobre sensores e equipamentos
                      </p>
                    </div>
                    <Switch
                      checked={systemAlerts}
                      onCheckedChange={setSystemAlerts}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full md:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
