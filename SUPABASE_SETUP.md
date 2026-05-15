
## 7. Tabela farm_members (múltiplos usuários por fazenda)

```sql
-- Membros de cada fazenda (co-proprietários, administradores, visualizadores)
CREATE TABLE IF NOT EXISTS farm_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id     UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role        TEXT NOT NULL DEFAULT 'viewer',
  custom_role_id UUID,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active','pending','revoked')),
  invited_by  UUID REFERENCES auth.users(id),
  joined_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(farm_id, email)
);

ALTER TABLE farm_members ENABLE ROW LEVEL SECURITY;

-- Membros podem ver outros membros da mesma fazenda
CREATE POLICY "farm_members_view" ON farm_members
  USING (
    farm_id IN (
      SELECT id FROM farms WHERE user_id = auth.uid()
      UNION
      SELECT farm_id FROM farm_members WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Apenas o dono (farms.user_id) pode inserir/remover membros
CREATE POLICY "farm_members_manage" ON farm_members
  FOR INSERT WITH CHECK (
    farm_id IN (SELECT id FROM farms WHERE user_id = auth.uid())
  );
```

## 8. Trigger: Aceitar convite ao primeiro login

```sql
-- Quando um usuário convidad faz login, atualiza farm_members com seu user_id
CREATE OR REPLACE FUNCTION handle_member_join()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE farm_members
  SET user_id = NEW.id, status = 'active', joined_at = NOW()
  WHERE email = NEW.email AND status = 'pending';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_member_login ON auth.users;
CREATE TRIGGER on_member_login
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_member_join();
```

## 9. Arquitetura SaaS (Planos, Auditoria e RBAC Din�mico)

```sql
-- Adiciona CPF no profile existente
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cpf TEXT;

CREATE TABLE IF NOT EXISTS farm_subscriptions (
  farm_id     UUID PRIMARY KEY REFERENCES farms(id) ON DELETE CASCADE,
  plan_tier   TEXT NOT NULL DEFAULT 'basic' CHECK (plan_tier IN ('basic', 'moderate', 'complete')),
  status      TEXT NOT NULL DEFAULT 'active',
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS custom_roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id     UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id     UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE farm_members ADD CONSTRAINT fk_custom_role FOREIGN KEY (custom_role_id) REFERENCES custom_roles(id) ON DELETE SET NULL;
```
