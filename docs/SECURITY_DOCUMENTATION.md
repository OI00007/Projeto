# Documentação de Segurança - Sistema ARGOM v3.1

## Visão Geral

Este documento descreve as medidas de segurança implementadas no Sistema ARGOM, uma plataforma de gestão agrícola inteligente com 11 tabelas protegidas por RLS, validação em duas camadas (client + server) e auditoria automática.

## Índice

1. [Autenticação e Autorização](#autenticação-e-autorização)
2. [Validação de Entrada](#validação-de-entrada)
3. [Validação Server-Side](#validação-server-side)
4. [Proteção de API](#proteção-de-api)
5. [Segurança de Dados](#segurança-de-dados)
6. [Integridade de Dados no Banco](#integridade-de-dados-no-banco)
7. [Melhores Práticas](#melhores-práticas)
8. [Checklist de Segurança](#checklist-de-segurança)

---

## Autenticação e Autorização

### Sistema de Autenticação

O sistema utiliza **Supabase Auth** com os seguintes recursos:

- **JWT (JSON Web Tokens)** para autenticação stateless
- **Refresh tokens** automáticos
- **OAuth 2.0** para login social (Google)
- **Verificação de email** obrigatória
- **Recuperação de senha** segura

### Implementação

```typescript
import { useAuth } from "@/hooks/useAuth";
const { user, session, loading, signOut } = useAuth();
```

### Rotas Protegidas

Todas as rotas sensíveis são protegidas pelo componente `ProtectedRoute`:

```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Row Level Security (RLS)

**11 tabelas** com políticas RLS completas:

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `farms` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `profiles` | user_id = auth.uid() AND deleted_at IS NULL | user_id = auth.uid() | user_id = auth.uid() | ❌ (bloqueado) |
| `financial_transactions` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `tasks` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `sensors` | via farms (JOIN) | via farms (JOIN) | via farms (JOIN) | via farms (JOIN) |
| `budgets` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `equipment` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `alerts` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `crop_fields` | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() | user_id = auth.uid() |
| `audit_logs` | user_id = auth.uid() OR admin | ❌ (apenas triggers) | ❌ (bloqueado) | ❌ (bloqueado) |
| `user_roles` | user_id = auth.uid() | admin only | admin only | admin only |

### Roles e Permissões

Roles armazenadas em **tabela separada** `user_roles` (nunca em profiles):

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'manager');

-- Verificação segura sem recursão RLS
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

---

## Validação de Entrada (Client-Side)

### Schemas Zod

| Schema | Uso | Validações |
|--------|-----|------------|
| `emailSchema` | Emails | Formato, máximo 255 chars |
| `passwordSchema` | Senhas | Mín. 8 chars, maiúscula, minúscula, número |
| `strongPasswordSchema` | Senhas fortes | + caractere especial |
| `nameSchema` | Nomes | 2-100 chars, apenas letras |
| `transactionSchema` | Transações | Tipo, categoria, valor > 0, data |
| `taskSchema` | Tarefas | Título, descrição, prioridade |

### Sanitização

```typescript
import { sanitizeText, sanitizeUrlParam } from '@/lib/security';

const safeText = sanitizeText(userInput);     // Previne XSS
const safeParam = sanitizeUrlParam(searchQuery); // Seguro para URLs
```

---

## Validação Server-Side (Triggers PL/pgSQL)

Validação em **6 tabelas** via triggers `BEFORE INSERT OR UPDATE`:

### Transações Financeiras

```sql
-- validate_financial_transaction()
- amount > 0
- type IN ('income', 'expense')
- category NOT empty
```

### Tarefas

```sql
-- validate_task()
- title NOT empty
- priority IN ('low', 'medium', 'high')
- status IN ('pending', 'in_progress', 'completed')
- completed_at auto-set quando status = 'completed'
```

### Sensores

```sql
-- validate_sensor()
- name NOT empty
- type NOT empty
```

### Orçamentos

```sql
-- validate_budget()
- amount > 0
- end_date > start_date
```

### Equipamentos (Novo v3.1)

```sql
-- validate_equipment()
- name NOT empty
- type IN ('tractor', 'irrigacao', 'drone', 'colheitadeira', 
           'caminhao', 'pulverizador', 'outro')
- status IN ('active', 'maintenance', 'offline', 'retired')
- hours_used >= 0
```

### Alertas (Novo v3.1)

```sql
-- validate_alert()
- title NOT empty
- type IN ('info', 'warning', 'critical', 'weather', 
           'sensor', 'maintenance', 'financial')
- severity IN ('low', 'medium', 'high', 'critical')
```

### Campos de Cultivo (Novo v3.1)

```sql
-- validate_crop_field()
- name NOT empty
- crop_type NOT empty
- status IN ('planejado', 'plantado', 'crescimento', 'floracao', 
             'frutificacao', 'colheita', 'pos_colheita')
- area_hectares > 0
```

---

## Proteção de API

### Edge Functions Seguras

Todas as Edge Functions implementam:

1. **Autenticação JWT obrigatória** (exceto weather e commodities)
2. **Validação de entrada**
3. **CORS headers**
4. **Tratamento de erros seguro** (mensagens genéricas)

### Rate Limiting

```typescript
import { RateLimiter } from '@/lib/security';

const limiter = new RateLimiter(10, 60000); // 10 req/min

if (!limiter.canMakeRequest()) {
  throw new Error('Limite excedido');
}
```

### Hook de API Seguro

```typescript
import { useSecureApi } from '@/hooks/useSecureApi';

const { data, error, loading, execute } = useSecureApi({
  retries: 3,
  timeout: 30000,
  rateLimit: {
    maxRequests: 30,
    windowMs: 60000
  }
});
```

---

## Segurança de Dados

### Proteção de Informações Sensíveis

1. **Nunca exponha erros técnicos** ao usuário
2. **Log seguro** sem dados sensíveis
3. **Sanitização** de todas as saídas

```typescript
import { secureLog } from '@/lib/security';

// Remove automaticamente campos sensíveis
secureLog('error', 'Failed login', {
  email: 'user@example.com',
  password: 'secret123' // Será [REDACTED]
});
```

---

## Integridade de Dados no Banco

### Índices Compostos (v3.1)

**~30 índices** otimizados para consultas frequentes:

| Tabela | Índices Compostos |
|--------|-------------------|
| `financial_transactions` | (user_id, transaction_date), (user_id, type, date), (user_id, category), (user_id, status) |
| `tasks` | (user_id, status), (user_id, priority), (user_id, due_date), (user_id, category) |
| `sensors` | (farm_id), (farm_id, type) |
| `budgets` | (user_id, period), (user_id, category) |
| `equipment` | (user_id), (user_id, status), (farm_id), (next_maintenance) |
| `alerts` | (user_id), (user_id, is_read), (user_id, severity), (created_at DESC) |
| `crop_fields` | (user_id), (farm_id), (user_id, status) |
| `audit_logs` | (user_id), (created_at) |

### Auditoria Automática

Todas as tabelas de dados possuem triggers de auditoria via `audit_trigger_function()`:

- Registra INSERT, UPDATE e DELETE
- Armazena dados antigos e novos (JSONB)
- Compatível com signup (fallback para `NEW.user_id`)
- Inserção via `insert_audit_log()` SECURITY DEFINER

### Defaults Seguros

| Tabela | Campo | Default |
|--------|-------|---------|
| `financial_transactions` | status | `'completed'` |
| `tasks` | status | `'pending'` |
| `tasks` | priority | `'medium'` |
| `equipment` | status | `'active'` |
| `equipment` | type | `'outro'` |
| `equipment` | hours_used | `0` |
| `alerts` | type | `'info'` |
| `alerts` | severity | `'low'` |
| `alerts` | is_read | `false` |
| `alerts` | is_resolved | `false` |
| `crop_fields` | status | `'planejado'` |
| `budgets` | alert_threshold | `80.00` |

---

## Melhores Práticas

### 1. Formulários Seguros

```typescript
import { useSecureForm } from '@/hooks/useSecureForm';
import { loginSchema } from '@/lib/security';

const form = useSecureForm({
  initialValues: { email: '', password: '' },
  schema: loginSchema,
  onSubmit: async (values) => { /* valores já validados */ }
});
```

### 2. Nunca Confie em Dados do Cliente

- Sempre valide no servidor (triggers + Edge Functions)
- Use RLS no banco de dados
- Sanitize todas as entradas

### 3. Princípio do Menor Privilégio

```sql
-- Usuários só acessam seus próprios dados
CREATE POLICY "Users own data" ON public.tasks
USING (auth.uid() = user_id);
```

### 4. Proteção CSRF

```typescript
import { csrfManager } from '@/lib/security';
const token = csrfManager.generateToken();
```

---

## Checklist de Segurança

### Autenticação
- [x] JWT com expiração curta
- [x] Refresh tokens automáticos
- [x] Verificação de email
- [x] Proteção contra força bruta (rate limiting)
- [x] Logout seguro

### Autorização
- [x] Row Level Security em **11 tabelas**
- [x] Verificação de permissões no servidor
- [x] Roles separadas em tabela dedicada
- [x] Security Definer Functions (has_role, insert_audit_log, audit_trigger)

### Validação
- [x] Validação client-side com Zod
- [x] **Validação server-side com triggers PL/pgSQL em 6 tabelas**
- [x] Sanitização de texto (XSS)
- [x] Validação de uploads
- [x] Limites de tamanho

### APIs
- [x] Autenticação obrigatória em Edge Functions
- [x] CORS headers configurados
- [x] Rate limiting
- [x] Timeout em requisições
- [x] Erros genéricos para clientes

### Dados
- [x] Logs sem dados sensíveis
- [x] Criptografia em trânsito (HTTPS)
- [x] Backup automático (Supabase)
- [x] **~30 índices compostos para performance**
- [x] Defaults seguros em todas as tabelas
- [x] Auditoria automática compatível com signup

---

## Contatos de Segurança

Para reportar vulnerabilidades de segurança:

- **Email**: security@argom.com.br
- **Responsável**: Equipe de Segurança ARGOM

---

*Última atualização: Março 2026 — v3.1*
