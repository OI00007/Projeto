import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

// SECURITY: Input validation schema to prevent injection attacks and data corruption
const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], { required_error: "Tipo de transação é obrigatório" }),
  category: z.string().min(1, "Categoria é obrigatória").max(100, "Categoria muito longa"),
  amount: z.number()
    .positive("Valor deve ser maior que zero")
    .max(999999999, "Valor muito alto"),
  description: z.string().max(1000, "Descrição muito longa").optional().or(z.literal('')),
  transaction_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  payment_method: z.enum(['cash', 'debit', 'credit', 'pix', 'transfer', 'check'], {
    required_error: "Forma de pagamento é obrigatória"
  })
});

const EXPENSE_CATEGORIES = [
  "Sementes", "Fertilizantes", "Defensivos", "Combustível", 
  "Mão de obra", "Manutenção", "Energia", "Água", "Outros"
];

const INCOME_CATEGORIES = [
  "Venda de produtos", "Subsídios", "Serviços", "Arrendamento", "Outros"
];

export function TransactionManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
    transaction_date: new Date().toISOString().split('T')[0],
    payment_method: "cash"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // SECURITY: Validate input data before submission
      const validatedData = transactionSchema.parse({
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description || '',
        transaction_date: formData.transaction_date,
        payment_method: formData.payment_method
      });

      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          user_id: user.id,
          type: validatedData.type,
          category: validatedData.category,
          amount: validatedData.amount,
          description: validatedData.description || null,
          transaction_date: validatedData.transaction_date,
          payment_method: validatedData.payment_method,
          status: 'completed'
        });

      if (error) throw error;

      toast({
        title: "Transação registrada",
        description: "A transação foi salva com sucesso.",
      });

      setOpen(false);
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        transaction_date: new Date().toISOString().split('T')[0],
        payment_method: "cash"
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
      
      // SECURITY: Display user-friendly error messages without exposing internal details
      let errorMessage = "Não foi possível salvar a transação.";
      
      if (error instanceof z.ZodError) {
        errorMessage = error.errors[0]?.message || "Dados inválidos. Verifique os campos.";
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="button-premium gap-2">
          <Plus className="w-4 h-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Registrar Transação Financeira
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "income" | "expense") => 
                  setFormData({ ...formData, type: value, category: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-destructive" />
                      Despesa
                    </div>
                  </SelectItem>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      Receita
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.transaction_date}
                onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="debit">Débito</SelectItem>
                <SelectItem value="credit">Crédito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Textarea
              placeholder="Detalhes adicionais..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 button-premium" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Transação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}