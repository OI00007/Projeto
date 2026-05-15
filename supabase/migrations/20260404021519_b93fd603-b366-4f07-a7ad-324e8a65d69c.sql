-- Add missing foreign keys (only if not already present)

-- alerts -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'alerts_farm_id_fkey') THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- alerts -> sensors
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'alerts_sensor_id_fkey') THEN
    ALTER TABLE public.alerts ADD CONSTRAINT alerts_sensor_id_fkey FOREIGN KEY (sensor_id) REFERENCES public.sensors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- budgets -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'budgets_farm_id_fkey') THEN
    ALTER TABLE public.budgets ADD CONSTRAINT budgets_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- crop_fields -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'crop_fields_farm_id_fkey') THEN
    ALTER TABLE public.crop_fields ADD CONSTRAINT crop_fields_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- equipment -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'equipment_farm_id_fkey') THEN
    ALTER TABLE public.equipment ADD CONSTRAINT equipment_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- financial_transactions -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'financial_transactions_farm_id_fkey') THEN
    ALTER TABLE public.financial_transactions ADD CONSTRAINT financial_transactions_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- tasks -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'tasks_farm_id_fkey') THEN
    ALTER TABLE public.tasks ADD CONSTRAINT tasks_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;
  END IF;
END $$;

-- sensors -> farms
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sensors_farm_id_fkey') THEN
    ALTER TABLE public.sensors ADD CONSTRAINT sensors_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE CASCADE;
  END IF;
END $$;

-- user_roles unique constraint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'user_roles_user_id_role_key') THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
END $$;

-- Partial indexes for common queries
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON public.alerts (user_id, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_tasks_pending ON public.tasks (user_id, due_date) WHERE status IN ('pending', 'in_progress');
CREATE INDEX IF NOT EXISTS idx_fin_tx_recent ON public.financial_transactions (user_id, transaction_date DESC) WHERE status = 'completed';