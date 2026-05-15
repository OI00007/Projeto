-- =====================================================
-- MELHORIA DE SEGURANÇA E QUALIDADE DO BANCO DE DADOS
-- =====================================================

-- 1. BUDGETS: Remover política ALL e criar políticas granulares
DROP POLICY IF EXISTS "Users can manage their own budgets" ON public.budgets;

CREATE POLICY "Users can view their own budgets" 
ON public.budgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" 
ON public.budgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" 
ON public.budgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" 
ON public.budgets 
FOR DELETE 
USING (auth.uid() = user_id);

-- 2. FARMS: Remover política redundante e criar granulares
DROP POLICY IF EXISTS "Users can manage their own farms" ON public.farms;
DROP POLICY IF EXISTS "Users can view their own farms" ON public.farms;

CREATE POLICY "Users can view their own farms" 
ON public.farms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms" 
ON public.farms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms" 
ON public.farms 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms" 
ON public.farms 
FOR DELETE 
USING (auth.uid() = user_id);

-- 3. SENSORS: Remover política redundante e criar granulares
DROP POLICY IF EXISTS "Users can manage sensors from their farms" ON public.sensors;
DROP POLICY IF EXISTS "Users can view sensors from their farms" ON public.sensors;

CREATE POLICY "Users can view sensors from their farms" 
ON public.sensors 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM farms 
  WHERE farms.id = sensors.farm_id 
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can insert sensors to their farms" 
ON public.sensors 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM farms 
  WHERE farms.id = sensors.farm_id 
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can update sensors from their farms" 
ON public.sensors 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM farms 
  WHERE farms.id = sensors.farm_id 
  AND farms.user_id = auth.uid()
));

CREATE POLICY "Users can delete sensors from their farms" 
ON public.sensors 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM farms 
  WHERE farms.id = sensors.farm_id 
  AND farms.user_id = auth.uid()
));

-- 4. Criar tabela de tarefas com segurança adequada
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas granulares para tasks
CREATE POLICY "Users can view their own tasks" 
ON public.tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_date 
ON public.financial_transactions(user_id, transaction_date);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_category 
ON public.financial_transactions(category);

CREATE INDEX IF NOT EXISTS idx_budgets_user_period 
ON public.budgets(user_id, period);

CREATE INDEX IF NOT EXISTS idx_sensors_farm_id ON public.sensors(farm_id);

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 6. Adicionar constraints de validação
ALTER TABLE public.financial_transactions 
ADD CONSTRAINT chk_amount_positive CHECK (amount >= 0);

ALTER TABLE public.budgets 
ADD CONSTRAINT chk_budget_amount_positive CHECK (amount >= 0);

ALTER TABLE public.budgets 
ADD CONSTRAINT chk_alert_threshold_valid CHECK (alert_threshold >= 0 AND alert_threshold <= 100);

-- 7. Criar tabela de logs de auditoria para ações críticas
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver todos os logs, usuários veem seus próprios
CREATE POLICY "Users can view their own audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Sistema pode inserir logs (via service role)
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Ninguém pode atualizar ou deletar logs
CREATE POLICY "Audit logs cannot be updated" 
ON public.audit_logs 
FOR UPDATE 
USING (false);

CREATE POLICY "Audit logs cannot be deleted" 
ON public.audit_logs 
FOR DELETE 
USING (false);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);