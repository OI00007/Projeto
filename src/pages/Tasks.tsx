import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Filter,
  Search,
  Tractor,
  Droplets,
  Bug,
  Leaf,
  Wrench,
  Users,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

const categoryIcons: Record<string, LucideIcon> = {
  irrigacao: Droplets,
  manutencao: Wrench,
  defensivos: Bug,
  colheita: Tractor,
  plantio: Leaf,
  gestao: Users,
};

const categoryLabels: Record<string, string> = {
  irrigacao: "Irrigação",
  manutencao: "Manutenção",
  defensivos: "Defensivos",
  colheita: "Colheita",
  plantio: "Plantio",
  gestao: "Gestão",
};

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-warning/10 text-warning border-warning/30",
  low: "bg-info/10 text-info border-info/30",
};

const priorityLabels: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  in_progress: "Em Progresso",
  completed: "Concluída",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "irrigacao",
    due_date: "",
    assigned_to: "",
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        toast({
          title: "Erro ao carregar tarefas",
          description: message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, toast]);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "todas" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: tasks.length,
    pendentes: tasks.filter((t) => t.status === "pending").length,
    emProgresso: tasks.filter((t) => t.status === "in_progress").length,
    concluidas: tasks.filter((t) => t.status === "completed").length,
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const completedAt =
      newStatus === "completed" ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: newStatus,
          completed_at: completedAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                completed_at: completedAt,
                updated_at: new Date().toISOString(),
              }
            : task,
        ),
      );

      toast({
        title: "Status atualizado",
        description: `Tarefa marcada como ${statusLabels[newStatus].toLowerCase()}.`,
      });
    } catch (err: unknown) {
      toast({
        title: "Erro ao atualizar",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.due_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e data de vencimento.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description || null,
        category: newTask.category,
        priority: newTask.priority,
        status: "pending",
        due_date: newTask.due_date,
        assigned_to: newTask.assigned_to || null,
        user_id: user?.id,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;

      setTasks((prev) => [data, ...prev]);
      resetForm();
      setIsDialogOpen(false);

      toast({
        title: "Tarefa criada",
        description: "Nova tarefa adicionada com sucesso!",
      });
    } catch (err: unknown) {
      toast({
        title: "Erro ao criar tarefa",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateTask = async () => {
    if (!editingTask || !newTask.title || !newTask.due_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e data de vencimento.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: newTask.title,
          description: newTask.description || null,
          category: newTask.category,
          priority: newTask.priority,
          due_date: newTask.due_date,
          assigned_to: newTask.assigned_to || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTask.id);

      if (error) throw error;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: newTask.title,
                description: newTask.description || null,
                category: newTask.category,
                priority: newTask.priority,
                due_date: newTask.due_date,
                assigned_to: newTask.assigned_to || null,
                updated_at: new Date().toISOString(),
              }
            : task,
        ),
      );

      resetForm();
      setIsDialogOpen(false);
      setEditingTask(null);

      toast({
        title: "Tarefa atualizada",
        description: "Alterações salvas com sucesso!",
      });
    } catch (err: unknown) {
      toast({
        title: "Erro ao atualizar",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi removida com sucesso.",
      });
    } catch (err: unknown) {
      toast({
        title: "Erro ao excluir",
        description: err instanceof Error ? err.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "irrigacao",
      due_date: "",
      assigned_to: "",
    });
    setEditingTask(null);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category || "irrigacao",
      due_date: task.due_date || "",
      assigned_to: task.assigned_to || "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <DashboardLayout title="Gestão de Tarefas" subtitle="Carregando...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Gestão de Tarefas"
      subtitle="Organize e acompanhe as atividades da fazenda"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 entrance-slide-up">
          <Card className="bg-card/80 backdrop-blur-sm border-primary/10">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-warning/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendentes}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-info/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.emProgresso}</p>
                <p className="text-sm text-muted-foreground">Em Progresso</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-success/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.concluidas}</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between entrance-fade"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white gap-2">
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Editar Tarefa" : "Criar Nova Tarefa"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Título *</Label>
                  <Input
                    placeholder="Ex: Irrigação do talhão norte"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Detalhes da tarefa..."
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(v) =>
                        setNewTask((prev) => ({ ...prev, category: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prioridade</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(v) =>
                        setNewTask((prev) => ({ ...prev, priority: v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Vencimento *</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          due_date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Responsável</Label>
                    <Input
                      placeholder="Nome"
                      value={newTask.assigned_to}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          assigned_to: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={editingTask ? updateTask : addTask}
                  className="w-full gradient-primary text-white"
                  disabled={saving}
                >
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingTask ? "Salvar Alterações" : "Criar Tarefa"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks List */}
        <Card className="entrance-scale" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Lista de Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {tasks.length === 0
                      ? "Nenhuma tarefa cadastrada"
                      : "Nenhuma tarefa encontrada"}
                  </p>
                  <p className="text-sm mt-2">
                    Clique em "Nova Tarefa" para começar
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => {
                  const CategoryIcon =
                    categoryIcons[task.category || "gestao"] || Circle;
                  const isOverdue =
                    task.due_date &&
                    new Date(task.due_date) < new Date() &&
                    task.status !== "completed";

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 hover:shadow-soft group entrance-fade",
                        task.status === "completed"
                          ? "bg-muted/30 opacity-70"
                          : "bg-card hover:bg-muted/20",
                        isOverdue && "border-destructive/30 bg-destructive/5",
                      )}
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={task.status === "completed"}
                          onCheckedChange={() =>
                            toggleTaskStatus(task.id, task.status)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4
                                className={cn(
                                  "font-semibold text-foreground transition-all",
                                  task.status === "completed" &&
                                    "line-through text-muted-foreground",
                                )}
                              >
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={cn(
                                  "shrink-0",
                                  priorityColors[task.priority],
                                )}
                              >
                                {priorityLabels[task.priority] || task.priority}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                onClick={() => openEditDialog(task)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Excluir tarefa?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação não pode ser desfeita. A tarefa
                                      será permanentemente removida.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteTask(task.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <CategoryIcon className="w-4 h-4" />
                              <span>
                                {categoryLabels[task.category || ""] || "Geral"}
                              </span>
                            </div>
                            {task.due_date && (
                              <div
                                className={cn(
                                  "flex items-center gap-1.5",
                                  isOverdue
                                    ? "text-destructive"
                                    : "text-muted-foreground",
                                )}
                              >
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(task.due_date).toLocaleDateString(
                                    "pt-BR",
                                  )}
                                </span>
                                {isOverdue && (
                                  <span className="text-xs">(Atrasada)</span>
                                )}
                              </div>
                            )}
                            {task.assigned_to && (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Users className="w-4 h-4" />
                                <span>{task.assigned_to}</span>
                              </div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {statusLabels[task.status] || task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
