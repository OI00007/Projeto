
-- ============================================================
-- 1. TRIGGERS: updated_at automático
-- ============================================================

DROP TRIGGER IF EXISTS set_updated_at_farms ON public.farms;
CREATE TRIGGER set_updated_at_farms
  BEFORE UPDATE ON public.farms FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_financial_transactions ON public.financial_transactions;
CREATE TRIGGER set_updated_at_financial_transactions
  BEFORE UPDATE ON public.financial_transactions FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_tasks ON public.tasks;
CREATE TRIGGER set_updated_at_tasks
  BEFORE UPDATE ON public.tasks FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_budgets ON public.budgets;
CREATE TRIGGER set_updated_at_budgets
  BEFORE UPDATE ON public.budgets FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. TRIGGERS: Auditoria automática
-- ============================================================

DROP TRIGGER IF EXISTS audit_financial_transactions ON public.financial_transactions;
CREATE TRIGGER audit_financial_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_tasks ON public.tasks;
CREATE TRIGGER audit_tasks
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_sensors ON public.sensors;
CREATE TRIGGER audit_sensors
  AFTER INSERT OR UPDATE OR DELETE ON public.sensors FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_farms ON public.farms;
CREATE TRIGGER audit_farms
  AFTER INSERT OR UPDATE OR DELETE ON public.farms FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

DROP TRIGGER IF EXISTS audit_budgets ON public.budgets;
CREATE TRIGGER audit_budgets
  AFTER INSERT OR UPDATE OR DELETE ON public.budgets FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================================
-- 3. ÍNDICES de performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON public.budgets(period, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_sensors_type ON public.sensors(type);
CREATE INDEX IF NOT EXISTS idx_fin_tx_category ON public.financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_fin_tx_status ON public.financial_transactions(status);

-- ============================================================
-- 4. TRIGGERS de validação de dados
-- ============================================================

CREATE OR REPLACE FUNCTION public.validate_financial_transaction()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.amount IS NULL OR NEW.amount <= 0 THEN
    RAISE EXCEPTION 'amount must be greater than 0';
  END IF;
  IF NEW.type NOT IN ('income', 'expense') THEN
    RAISE EXCEPTION 'type must be income or expense';
  END IF;
  IF NEW.category IS NULL OR trim(NEW.category) = '' THEN
    RAISE EXCEPTION 'category cannot be empty';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_financial_transaction_before ON public.financial_transactions;
CREATE TRIGGER validate_financial_transaction_before
  BEFORE INSERT OR UPDATE ON public.financial_transactions FOR EACH ROW
  EXECUTE FUNCTION public.validate_financial_transaction();

CREATE OR REPLACE FUNCTION public.validate_task()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.title IS NULL OR trim(NEW.title) = '' THEN
    RAISE EXCEPTION 'title cannot be empty';
  END IF;
  IF NEW.priority NOT IN ('low', 'medium', 'high') THEN
    RAISE EXCEPTION 'priority must be low, medium or high';
  END IF;
  IF NEW.status NOT IN ('pending', 'in_progress', 'completed') THEN
    RAISE EXCEPTION 'status must be pending, in_progress or completed';
  END IF;
  IF NEW.status = 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_task_before ON public.tasks;
CREATE TRIGGER validate_task_before
  BEFORE INSERT OR UPDATE ON public.tasks FOR EACH ROW
  EXECUTE FUNCTION public.validate_task();

CREATE OR REPLACE FUNCTION public.validate_sensor()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.name IS NULL OR trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'sensor name cannot be empty';
  END IF;
  IF NEW.type IS NULL OR trim(NEW.type) = '' THEN
    RAISE EXCEPTION 'sensor type cannot be empty';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_sensor_before ON public.sensors;
CREATE TRIGGER validate_sensor_before
  BEFORE INSERT OR UPDATE ON public.sensors FOR EACH ROW
  EXECUTE FUNCTION public.validate_sensor();

CREATE OR REPLACE FUNCTION public.validate_budget()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.amount IS NULL OR NEW.amount <= 0 THEN
    RAISE EXCEPTION 'budget amount must be greater than 0';
  END IF;
  IF NEW.end_date <= NEW.start_date THEN
    RAISE EXCEPTION 'end_date must be after start_date';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_budget_before ON public.budgets;
CREATE TRIGGER validate_budget_before
  BEFORE INSERT OR UPDATE ON public.budgets FOR EACH ROW
  EXECUTE FUNCTION public.validate_budget();
