-- Força reload do schema cache do PostgREST
NOTIFY pgrst, 'reload schema';

-- Garante que os índices críticos existem para performance
CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id 
  ON public.financial_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_date 
  ON public.financial_transactions(transaction_date DESC);

CREATE INDEX IF NOT EXISTS idx_financial_transactions_type 
  ON public.financial_transactions(type);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id 
  ON public.tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status 
  ON public.tasks(status);

CREATE INDEX IF NOT EXISTS idx_sensors_farm_id 
  ON public.sensors(farm_id);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id 
  ON public.budgets(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id 
  ON public.audit_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
  ON public.audit_logs(created_at DESC);

-- Garante NOT NULL em colunas críticas de integridade
ALTER TABLE public.financial_transactions 
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN type SET NOT NULL,
  ALTER COLUMN amount SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'completed';

ALTER TABLE public.tasks
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN priority SET DEFAULT 'medium',
  ALTER COLUMN status SET DEFAULT 'pending';

-- Garante que os valores de status são válidos via constraint
ALTER TABLE public.financial_transactions 
  DROP CONSTRAINT IF EXISTS chk_transaction_type,
  ADD CONSTRAINT chk_transaction_type CHECK (type IN ('income', 'expense'));

ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS chk_task_priority,
  DROP CONSTRAINT IF EXISTS chk_task_status,
  ADD CONSTRAINT chk_task_priority CHECK (priority IN ('low', 'medium', 'high')),
  ADD CONSTRAINT chk_task_status CHECK (status IN ('pending', 'in_progress', 'completed'));
