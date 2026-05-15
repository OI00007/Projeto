
-- ============================================
-- TRIGGERS: Validação de dados (já existem as funções, faltam os triggers)
-- ============================================

-- Validação de transações financeiras
CREATE TRIGGER trg_validate_financial_transaction
  BEFORE INSERT OR UPDATE ON public.financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_financial_transaction();

-- Validação de tarefas
CREATE TRIGGER trg_validate_task
  BEFORE INSERT OR UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_task();

-- Validação de sensores
CREATE TRIGGER trg_validate_sensor
  BEFORE INSERT OR UPDATE ON public.sensors
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_sensor();

-- Validação de orçamentos
CREATE TRIGGER trg_validate_budget
  BEFORE INSERT OR UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_budget();

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================

CREATE TRIGGER trg_updated_at_farms
  BEFORE UPDATE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_financial_transactions
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_updated_at_budgets
  BEFORE UPDATE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- TRIGGERS: Auditoria automática
-- ============================================

CREATE TRIGGER trg_audit_farms
  AFTER INSERT OR UPDATE OR DELETE ON public.farms
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER trg_audit_financial_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER trg_audit_tasks
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER trg_audit_sensors
  AFTER INSERT OR UPDATE OR DELETE ON public.sensors
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER trg_audit_budgets
  AFTER INSERT OR UPDATE OR DELETE ON public.budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER trg_audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();
