import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DataTable, DataTableColumn } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Package,
  Plus,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastUpdated: string;
  supplier: string;
  cost: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
}

const inventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Fertilizante NPK 20-10-10",
    category: "Fertilizantes",
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    unit: "kg",
    lastUpdated: "2024-01-15",
    supplier: "AgriCorp",
    cost: 2.50,
    status: "in_stock",
  },
  {
    id: "2",
    name: "Sementes de Milho Premium",
    category: "Sementes",
    currentStock: 25,
    minStock: 50,
    maxStock: 200,
    unit: "sacos",
    lastUpdated: "2024-01-14",
    supplier: "SemenTech",
    cost: 180.00,
    status: "low_stock",
  },
  {
    id: "3",
    name: "Herbicida Glifosato",
    category: "Defensivos",
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    unit: "L",
    lastUpdated: "2024-01-10",
    supplier: "ChemAgro",
    cost: 45.00,
    status: "out_of_stock",
  },
  {
    id: "4",
    name: "Calcário Dolomítico",
    category: "Corretivos",
    currentStock: 2500,
    minStock: 1000,
    maxStock: 2000,
    unit: "kg",
    lastUpdated: "2024-01-16",
    supplier: "MinerCal",
    cost: 0.35,
    status: "overstock",
  },
];

export function InventoryManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_stock":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "overstock":
        return <TrendingUp className="h-4 w-4 text-info" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "in_stock":
        return "default";
      case "low_stock":
        return "secondary";
      case "out_of_stock":
        return "destructive";
      case "overstock":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_stock":
        return "Em Estoque";
      case "low_stock":
        return "Estoque Baixo";
      case "out_of_stock":
        return "Sem Estoque";
      case "overstock":
        return "Excesso";
      default:
        return status;
    }
  };

  const getStockPercentage = (current: number, min: number, max: number) => {
    return Math.min(100, (current / max) * 100);
  };

  const columns: DataTableColumn<InventoryItem>[] = [
    {
      key: "name",
      header: "Item",
      accessorKey: "name",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.category}</div>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Estoque",
      sortable: true,
      cell: (item) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {item.currentStock} {item.unit}
            </span>
            {getStatusIcon(item.status)}
          </div>
          <Progress 
            value={getStockPercentage(item.currentStock, item.minStock, item.maxStock)}
            className="h-2"
          />
          <div className="text-xs text-muted-foreground">
            Min: {item.minStock} | Max: {item.maxStock}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (item) => (
        <Badge variant={getStatusVariant(item.status)}>
          {getStatusLabel(item.status)}
        </Badge>
      ),
    },
    {
      key: "cost",
      header: "Custo Unit.",
      accessorKey: "cost",
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-medium">R$ {item.cost.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">
            Total: R$ {(item.cost * item.currentStock).toFixed(2)}
          </div>
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Fornecedor",
      accessorKey: "supplier",
      sortable: true,
    },
    {
      key: "lastUpdated",
      header: "Atualizado",
      accessorKey: "lastUpdated",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(item.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      ),
    },
  ];

  const stats = {
    totalItems: inventoryData.length,
    lowStock: inventoryData.filter(item => item.status === "low_stock").length,
    outOfStock: inventoryData.filter(item => item.status === "out_of_stock").length,
    totalValue: inventoryData.reduce((acc, item) => acc + (item.cost * item.currentStock), 0),
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Gestão de Inventário
          </h3>
          <p className="text-muted-foreground">
            Controle completo do estoque de insumos agrícolas
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Item</Label>
                <Input id="name" placeholder="Ex: Fertilizante NPK..." />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input id="category" placeholder="Ex: Fertilizantes" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="current">Estoque Atual</Label>
                  <Input id="current" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="min">Estoque Mín.</Label>
                  <Input id="min" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="max">Estoque Máx.</Label>
                  <Input id="max" type="number" placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-1">Salvar</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <div className="text-sm text-muted-foreground">Total de Itens</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.lowStock}</div>
              <div className="text-sm text-muted-foreground">Estoque Baixo</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.outOfStock}</div>
              <div className="text-sm text-muted-foreground">Sem Estoque</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Truck className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                R$ {stats.totalValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Inventory Table */}
      <DataTable 
        data={inventoryData}
        columns={columns}
        searchable={true}
        filterable={true}
        exportable={true}
        emptyMessage="Nenhum item no inventário"
      />
    </Card>
  );
}