
-- =========================================================
-- ARGOM v3.1 — Melhorias de Banco de Dados
-- Novas tabelas, índices compostos e validações
-- =========================================================

-- ==================== NOVAS TABELAS ====================

-- 1. Tabela de Equipamentos
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'outro',
  status TEXT NOT NULL DEFAULT 'active',
  location TEXT,
  model TEXT,
  manufacturer TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_value NUMERIC(12,2),
  hours_used NUMERIC(10,1) DEFAULT 0,
  last_maintenance DATE,
  next_maintenance DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabela de Alertas
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
  sensor_id UUID REFERENCES public.sensors(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'info',
  severity TEXT NOT NULL DEFAULT 'low',
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabela de Campos de Cultivo
CREATE TABLE IF NOT EXISTS public.crop_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  area_hectares NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'planejado',
  planting_date DATE,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  expected_yield_kg NUMERIC(12,2),
  actual_yield_kg NUMERIC(12,2),
  soil_type TEXT,
  irrigation_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== RLS POLICIES ====================

-- Equipment RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own equipment" ON public.equipment
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own equipment" ON public.equipment
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own equipment" ON public.equipment
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own equipment" ON public.equipment
  FOR DELETE USING (auth.uid() = user_id);

-- Alerts RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own alerts" ON public.alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Crop Fields RLS
ALTER TABLE public.crop_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crop fields" ON public.crop_fields
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own crop fields" ON public.crop_fields
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own crop fields" ON public.crop_fields
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own crop fields" ON public.crop_fields
  FOR DELETE USING (auth.uid() = user_id);

-- ==================== ÍNDICES COMPOSTOS ====================

-- Transações: consultas frequentes por user + date + type
CREATE INDEX IF NOT EXISTS idx_fin_tx_user_date ON public.financial_transactions (user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_fin_tx_user_type_date ON public.financial_transactions (user_id, type, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_fin_tx_user_category ON public.financial_transactions (user_id, category);
CREATE INDEX IF NOT EXISTS idx_fin_tx_user_status ON public.financial_transactions (user_id, status);

-- Tarefas: consultas frequentes por user + status + priority
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks (user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON public.tasks (user_id, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON public.tasks (user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_category ON public.tasks (user_id, category);

-- Sensores: consultas por farm + type
CREATE INDEX IF NOT EXISTS idx_sensors_farm_type ON public.sensors (farm_id, type);

-- Orçamentos: consultas por user + period
CREATE INDEX IF NOT EXISTS idx_budgets_user_period ON public.budgets (user_id, period);
CREATE INDEX IF NOT EXISTS idx_budgets_user_category ON public.budgets (user_id, category);

-- Novos índices para novas tabelas
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON public.equipment (user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_user_status ON public.equipment (user_id, status);
CREATE INDEX IF NOT EXISTS idx_equipment_farm_id ON public.equipment (farm_id);
CREATE INDEX IF NOT EXISTS idx_equipment_next_maint ON public.equipment (next_maintenance);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts (user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_read ON public.alerts (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_user_severity ON public.alerts (user_id, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON public.alerts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crop_fields_user_id ON public.crop_fields (user_id);
CREATE INDEX IF NOT EXISTS idx_crop_fields_farm_id ON public.crop_fields (farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_fields_user_status ON public.crop_fields (user_id, status);

-- Farms: índice para user_id
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms (user_id);

-- Profiles: índice para user_id
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

-- ==================== TRIGGERS PARA NOVAS TABELAS ====================

-- updated_at triggers
CREATE TRIGGER set_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_crop_fields_updated_at
  BEFORE UPDATE ON public.crop_fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit triggers
CREATE TRIGGER audit_equipment_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_alerts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_crop_fields_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.crop_fields
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_function();

-- ==================== VALIDATION TRIGGERS ====================

-- Validação de equipamentos
CREATE OR REPLACE FUNCTION public.validate_equipment()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.name IS NULL OR trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'equipment name cannot be empty';
  END IF;
  IF NEW.type NOT IN ('tractor', 'irrigacao', 'drone', 'colheitadeira', 'caminhao', 'pulverizador', 'outro') THEN
    RAISE EXCEPTION 'invalid equipment type';
  END IF;
  IF NEW.status NOT IN ('active', 'maintenance', 'offline', 'retired') THEN
    RAISE EXCEPTION 'status must be active, maintenance, offline or retired';
  END IF;
  IF NEW.hours_used IS NOT NULL AND NEW.hours_used < 0 THEN
    RAISE EXCEPTION 'hours_used cannot be negative';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_equipment_trigger
  BEFORE INSERT OR UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION public.validate_equipment();

-- Validação de alertas
CREATE OR REPLACE FUNCTION public.validate_alert()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.title IS NULL OR trim(NEW.title) = '' THEN
    RAISE EXCEPTION 'alert title cannot be empty';
  END IF;
  IF NEW.type NOT IN ('info', 'warning', 'critical', 'weather', 'sensor', 'maintenance', 'financial') THEN
    RAISE EXCEPTION 'invalid alert type';
  END IF;
  IF NEW.severity NOT IN ('low', 'medium', 'high', 'critical') THEN
    RAISE EXCEPTION 'severity must be low, medium, high or critical';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_alert_trigger
  BEFORE INSERT OR UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.validate_alert();

-- Validação de campos de cultivo
CREATE OR REPLACE FUNCTION public.validate_crop_field()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.name IS NULL OR trim(NEW.name) = '' THEN
    RAISE EXCEPTION 'crop field name cannot be empty';
  END IF;
  IF NEW.crop_type IS NULL OR trim(NEW.crop_type) = '' THEN
    RAISE EXCEPTION 'crop type cannot be empty';
  END IF;
  IF NEW.status NOT IN ('planejado', 'plantado', 'crescimento', 'floracao', 'frutificacao', 'colheita', 'pos_colheita') THEN
    RAISE EXCEPTION 'invalid crop field status';
  END IF;
  IF NEW.area_hectares IS NOT NULL AND NEW.area_hectares <= 0 THEN
    RAISE EXCEPTION 'area must be greater than 0';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_crop_field_trigger
  BEFORE INSERT OR UPDATE ON public.crop_fields
  FOR EACH ROW EXECUTE FUNCTION public.validate_crop_field();
