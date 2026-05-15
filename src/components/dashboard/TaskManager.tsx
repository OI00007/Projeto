import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  User,
  Clock,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle,
  Play,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  dueDate: string;
  category: string;
  progress: number;
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

const tasksData: Task[] = [
  {
    id: "1",
    title: "Aplicação de Fertilizante - Setor A",
    description: "Aplicar fertilizante NPK no setor A conforme cronograma",
    priority: "high",
    status: "in_progress",
    assignee: {
      name: "João Silva",
      initials: "JS",
    },
    dueDate: "2024-01-20",
    category: "Fertilização",
    progress: 65,
    subtasks: [
      { id: "1-1", title: "Preparar equipamentos", completed: true },
      { id: "1-2", title: "Calibrar aplicador", completed: true },
      { id: "1-3", title: "Aplicar fertilizante", completed: false },
      { id: "1-4", title: "Limpeza dos equipamentos", completed: false },
    ],
  },
  {
    id: "2",
    title: "Monitoramento de Pragas - Toda Propriedade",
    description: "Inspeção quinzenal para identificação de pragas",
    priority: "medium",
    status: "pending",
    assignee: {
      name: "Maria Santos",
      initials: "MS",
    },
    dueDate: "2024-01-18",
    category: "Monitoramento",
    progress: 0,
    subtasks: [
      { id: "2-1", title: "Preparar checklist", completed: false },
      { id: "2-2", title: "Inspeção Setor A", completed: false },
      { id: "2-3", title: "Inspeção Setor B", completed: false },
      { id: "2-4", title: "Relatório de inspeção", completed: false },
    ],
  },
  {
    id: "3",
    title: "Manutenção Preventiva - Trator John Deere",
    description: "Manutenção programada do trator conforme manual",
    priority: "urgent",
    status: "pending",
    assignee: {
      name: "Pedro Costa",
      initials: "PC",
    },
    dueDate: "2024-01-17",
    category: "Manutenção",
    progress: 0,
    subtasks: [
      { id: "3-1", title: "Troca de óleo", completed: false },
      { id: "3-2", title: "Verificar filtros", completed: false },
      { id: "3-3", title: "Teste de funcionamento", completed: false },
    ],
  },
];

export function TaskManager() {
  const [tasks, setTasks] = useState(tasksData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "in_progress":
        return <Play className="h-4 w-4 text-primary" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em Andamento";
      case "completed":
        return "Concluída";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus as Task["status"] }
        : task
    ));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            ),
            progress: Math.round(
              (task.subtasks.filter(st => st.id === subtaskId ? !st.completed : st.completed).length / 
               task.subtasks.length) * 100
            )
          }
        : task
    ));
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length,
    overdue: tasks.filter(t => 
      new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length,
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Gerenciador de Tarefas
          </h3>
          <p className="text-muted-foreground">
            Organize e acompanhe todas as atividades da fazenda
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" placeholder="Ex: Aplicação de defensivos..." />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" placeholder="Detalhes da tarefa..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Data Limite</Label>
                  <Input id="dueDate" type="date" />
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">Criar Tarefa</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">Em Andamento</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Concluídas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
          <div className="text-sm text-muted-foreground">Atrasadas</div>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">{task.title}</h4>
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                    {task.priority.toUpperCase()}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(task.status)}
                    <span className="text-sm text-muted-foreground">
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={task.assignee.avatar} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {task.assignee.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              </div>
              <div className="text-sm font-medium">
                {task.progress}% concluído
              </div>
            </div>

            {/* Progress Steps */}
            <ProgressIndicator
              steps={task.subtasks.map((subtask, index) => ({
                id: subtask.id,
                title: subtask.title,
                status: subtask.completed 
                  ? "completed" 
                  : index === task.subtasks.findIndex(st => !st.completed)
                    ? "current"
                    : "pending"
              }))}
              orientation="horizontal"
              showLabels={false}
              className="mb-4"
            />

            {/* Action Buttons */}
            <div className="flex gap-2">
              {task.status === "pending" && (
                <Button 
                  size="sm" 
                  onClick={() => updateTaskStatus(task.id, "in_progress")}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Iniciar
                </Button>
              )}
              {task.status === "in_progress" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateTaskStatus(task.id, "completed")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Concluir
                </Button>
              )}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setSelectedTask(task)}
              >
                Ver Detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Task Detail Dialog */}
      <Dialog 
        open={selectedTask !== null} 
        onOpenChange={() => setSelectedTask(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedTask.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedTask.status)}
                      <span>{getStatusLabel(selectedTask.status)}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Prioridade</Label>
                    <div className="mt-1">
                      <Badge variant={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Subtarefas</Label>
                  <div className="space-y-2 mt-2">
                    {selectedTask.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSubtask(selectedTask.id, subtask.id)}
                          className="h-auto p-1"
                        >
                          {subtask.completed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                        <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}