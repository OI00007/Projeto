# Visão Geral Técnica — Sistema ARGOM v3.1

> **Plataforma de Gestão Inteligente de Propriedades Rurais**  
> Última atualização: Março 2026

---

## 1. Resumo Executivo

O ARGOM é uma aplicação web full-stack para gestão de propriedades rurais que integra monitoramento ambiental em tempo real, gestão financeira, controle de tarefas, equipamentos, campos de cultivo, sistema de alertas e assistente de IA. Desenvolvido com React 18, TypeScript, Supabase e Tailwind CSS, seguindo princípios SOLID e Clean Architecture.

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | React + TypeScript | 18.3.1 / 5.x |
| **Build** | Vite | 6.x |
| **Estilização** | Tailwind CSS + shadcn/ui | 3.x |
| **Animações** | Framer Motion | 12.x |
| **Estado** | TanStack React Query + Context API | 5.x |
| **Backend** | Supabase (PostgreSQL 15 + Edge Functions) | 2.x |
| **Testes** | Vitest + Testing Library | 3.x |
| **Validação** | Zod | 3.x |
| **Roteamento** | React Router DOM | 6.x |

---

## 3. Arquitetura

### 3.1 Camadas

```
┌─────────────────────────────────────────────────┐
│ ErrorBoundary (captura erros de renderização)    │
├─────────────────────────────────────────────────┤
│ BrowserRouter → AnimatedRoutes (Suspense + Lazy) │
├─────────────────────────────────────────────────┤
│ Providers: Auth → FarmData → QueryClient         │
├─────────────────────────────────────────────────┤
│ Pages: Dashboard, Financial, Monitoring, Tasks,  │
│        Equipment, Fleet, CostsFields, AIInsights │
├─────────────────────────────────────────────────┤
│ Components: ui/, dashboard/, financial/, layout/  │
├─────────────────────────────────────────────────┤
│ Services: SensorData, FinancialData, Commodities │
├─────────────────────────────────────────────────┤
│ Hooks: useAuth, useSecureApi, useSecureForm,     │
│        useCommodities, useWeatherApi             │
├─────────────────────────────────────────────────┤
│ Lib: security, validation, constants, formatters │
├─────────────────────────────────────────────────┤
│ Supabase: Auth, Database (RLS), Edge Functions,  │
│          Realtime Subscriptions                  │
└─────────────────────────────────────────────────┘
```

### 3.2 Hierarquia de Providers

```
ErrorBoundary
  └── BrowserRouter
      └── QueryClientProvider (staleTime: 5min, retry inteligente)
          └── AuthProvider (Supabase Auth, JWT)
              └── FarmDataProvider (realtime subscriptions)
                  └── TooltipProvider
                      ├── Toaster + Sonner
                      ├── AnimatedRoutes (lazy loading)
                      └── AIChatAssistant
```

### 3.3 QueryClient — Retry Inteligente

```typescript
retry: (failureCount, error) => {
  // Não retenta erros de autenticação (401/403)
  if (error.message.includes("401") || error.message.includes("403")) {
    return false;
  }
  return failureCount < 2;
}
```

---

## 4. Módulos do Sistema

### 4.1 Dashboard Principal
- Métricas em tempo real (MetricCard)
- Gráficos ambientais e financeiros (Recharts)
- Widget de clima avançado
- Alertas inteligentes com severidade

### 4.2 Gestão Financeira
- CRUD de transações (income/expense) com validação server-side
- Planejamento orçamentário com alertas de threshold
- Análise de fluxo de caixa e rentabilidade
- Insights financeiros via IA (Edge Function)

### 4.3 Monitoramento Ambiental
- Sensores em tempo real (temperatura, umidade, pH, etc.)
- Previsão meteorológica via Edge Function
- Saúde do solo e mapa interativo

### 4.4 Gerenciamento de Tarefas
- Tarefas com subtarefas e categorias agrícolas
- Prioridades (low/medium/high) com validação server-side
- Status (pending/in_progress/completed)
- Completed_at automático via trigger

### 4.5 Gestão de Equipamentos
- Cadastro com modelo, fabricante, número de série
- Status (active/maintenance/offline/retired) validado por trigger
- Controle de horas de uso e valor de compra
- Agendamento de manutenção preventiva

### 4.6 Campos de Cultivo
- Cadastro de campos com tipo de cultura e área
- Ciclo completo: planejado → plantado → crescimento → floração → frutificação → colheita → pós-colheita
- Rendimento esperado vs. realizado (kg)
- Tipo de solo e irrigação

### 4.7 Sistema de Alertas
- Tipos: info, warning, critical, weather, sensor, maintenance, financial
- Severidade: low, medium, high, critical
- Integração com sensores (sensor_id)
- Marcar como lido/resolvido com timestamp

### 4.8 IA & Insights
- Chat com assistente de IA (streaming SSE)
- Recomendações agrícolas contextualizadas
- Análises preditivas financeiras

### 4.9 Cotações de Commodities
- Preços em tempo real via Edge Function
- Histórico e variações (24h, 7d, 52w)

---

## 5. Banco de Dados

### 5.1 Tabelas (v3.1)

| Tabela | Descrição | RLS | Validação Server-Side |
|--------|-----------|-----|----------------------|
| `farms` | Propriedades rurais | ✅ | — |
| `profiles` | Perfis de usuário | ✅ | — |
| `financial_transactions` | Transações financeiras | ✅ | `validate_financial_transaction()` |
| `tasks` | Tarefas e atividades | ✅ | `validate_task()` |
| `sensors` | Leituras de sensores | ✅ | `validate_sensor()` |
| `budgets` | Orçamentos | ✅ | `validate_budget()` |
| `equipment` | Equipamentos e maquinário | ✅ | `validate_equipment()` |
| `alerts` | Alertas do sistema | ✅ | `validate_alert()` |
| `crop_fields` | Campos de cultivo | ✅ | `validate_crop_field()` |
| `audit_logs` | Log de auditoria | ✅ | — |
| `user_roles` | Papéis (admin/user/manager) | ✅ | — |

### 5.2 Índices de Performance (v3.1)

| Tabela | Índice | Colunas |
|--------|--------|---------|
| `financial_transactions` | idx_fin_tx_user_date | (user_id, transaction_date DESC) |
| `financial_transactions` | idx_fin_tx_user_type_date | (user_id, type, transaction_date DESC) |
| `financial_transactions` | idx_fin_tx_user_category | (user_id, category) |
| `financial_transactions` | idx_fin_tx_user_status | (user_id, status) |
| `tasks` | idx_tasks_user_status | (user_id, status) |
| `tasks` | idx_tasks_user_priority | (user_id, priority) |
| `tasks` | idx_tasks_user_due_date | (user_id, due_date) |
| `tasks` | idx_tasks_user_category | (user_id, category) |
| `sensors` | idx_sensors_farm_type | (farm_id, type) |
| `budgets` | idx_budgets_user_period | (user_id, period) |
| `budgets` | idx_budgets_user_category | (user_id, category) |
| `equipment` | idx_equipment_user_status | (user_id, status) |
| `equipment` | idx_equipment_next_maint | (next_maintenance) |
| `alerts` | idx_alerts_user_read | (user_id, is_read) |
| `alerts` | idx_alerts_user_severity | (user_id, severity) |
| `alerts` | idx_alerts_created | (created_at DESC) |
| `crop_fields` | idx_crop_fields_user_status | (user_id, status) |
| `audit_logs` | idx_audit_user_id | (user_id) |
| `audit_logs` | idx_audit_created_at | (created_at) |

### 5.3 Triggers Ativos

| Tabela | Trigger | Função |
|--------|---------|--------|
| Todas (com updated_at) | `set_*_updated_at` | `update_updated_at_column()` |
| Todas (dados) | `audit_*_trigger` | `audit_trigger_function()` |
| `financial_transactions` | validate | `validate_financial_transaction()` |
| `tasks` | validate | `validate_task()` |
| `sensors` | validate | `validate_sensor()` |
| `budgets` | validate | `validate_budget()` |
| `equipment` | validate | `validate_equipment()` |
| `alerts` | validate | `validate_alert()` |
| `crop_fields` | validate | `validate_crop_field()` |

### 5.4 Funções de Segurança

| Função | Tipo | Descrição |
|--------|------|-----------|
| `has_role(uuid, app_role)` | SECURITY DEFINER | Verifica role sem recursão RLS |
| `insert_audit_log(...)` | SECURITY DEFINER | Insere log de auditoria (bypassa RLS) |
| `audit_trigger_function()` | SECURITY DEFINER | Trigger de auditoria com fallback para signup |
| `handle_new_user()` | SECURITY DEFINER | Cria perfil automaticamente no signup |

---

## 6. Segurança

### 6.1 Camadas de Proteção

| Camada | Implementação |
|--------|---------------|
| Autenticação | Supabase Auth (JWT + refresh automático) |
| Autorização | Row Level Security (RLS) em 11 tabelas |
| Validação Client | Zod schemas (email, senha, transações, tarefas) |
| Validação Server | Triggers PL/pgSQL de validação em 6 tabelas |
| Sanitização | XSS protection via `sanitizeText()` |
| Rate Limiting | Client-side + Edge Functions |
| Auditoria | `audit_logs` automático via triggers |
| Roles | Tabela separada `user_roles` com `has_role()` |
| ErrorBoundary | Captura erros de renderização |

### 6.2 Rotas Protegidas

Todas as rotas internas são protegidas pelo componente `ProtectedRoute` que verifica autenticação via `useAuth`.

---

## 7. Testes

### 7.1 Stack

- **Vitest** — Test runner (compatível com Vite)
- **@testing-library/react** — Renderização e queries
- **@testing-library/jest-dom** — Matchers customizados
- **jsdom** — Ambiente de navegador simulado

### 7.2 Cobertura (13 testes)

| Módulo | Testes | Cenários |
|--------|--------|----------|
| `useAuth` | 4 | Contexto obrigatório, loading inicial, listener auth, signOut |
| `FarmDataContext` | 9 | Contexto obrigatório, valores padrão, fetch Supabase, realtime, hooks utilitários |

### 7.3 Execução

```bash
npx vitest run          # Executar todos
npx vitest              # Watch mode
npx vitest run --coverage  # Com cobertura
```

---

## 8. Design Patterns & SOLID

### 8.1 Padrões Aplicados

| Padrão | Onde |
|--------|------|
| **Error Boundary** | `ErrorBoundary.tsx` |
| **Provider/Context** | `AuthProvider`, `FarmDataProvider` |
| **Observer** | Supabase Realtime subscriptions |
| **Strategy** | Categorização automática de transações |
| **Factory** | `TransactionFactory` |
| **Repository** | `SupabaseTransactionRepository` |
| **Decorator** | `CachedTransactionRepository`, `LoggedTransactionRepository` |
| **Singleton** | `TransactionFactory.getInstance()` |
| **Lazy Loading** | `React.lazy()` + `Suspense` |

### 8.2 Princípios SOLID

| Princípio | Aplicação |
|-----------|-----------|
| **S** — Single Responsibility | Cada hook/componente tem uma responsabilidade |
| **O** — Open/Closed | Variantes via CVA (class-variance-authority) |
| **L** — Liskov Substitution | `BaseTransaction` → `Income`/`Expense` |
| **I** — Interface Segregation | `ISensorOperations`, `IFinancialOperations`, `ISensorDataService`, `IFinancialDataService` |
| **D** — Dependency Inversion | Services dependem de interfaces, não implementações |

---

## 9. Performance

### 9.1 Otimizações

- **Code Splitting**: Lazy loading de todas as páginas
- **Memoização**: `useMemo`, `useCallback`, `React.memo`
- **Caching**: React Query com staleTime de 5 minutos
- **Debounce**: Busca e filtros com delay configurável
- **Imagens**: Componente `OptimizedImage` com lazy loading
- **Índices compostos**: Queries otimizadas no banco

### 9.2 Targets

| Métrica | Target |
|---------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTI | < 3.5s |

---

## 10. Acessibilidade (WCAG 2.1)

- ✅ Navegação por teclado completa
- ✅ ARIA labels em componentes interativos
- ✅ Contraste mínimo 4.5:1
- ✅ Focus visible
- ✅ Skip links
- ✅ Textos alternativos em imagens
- ✅ `prefers-reduced-motion` respeitado
- ✅ HTML semântico

---

## 11. Edge Functions

| Função | Método | Descrição | Auth |
|--------|--------|-----------|------|
| `ai-chat` | POST | Chat com IA (streaming SSE) | JWT |
| `weather` | GET | Dados meteorológicos | Opcional |
| `financial-insights` | POST | Insights financeiros com IA | JWT |
| `commodities` | GET | Cotações de commodities | Opcional |

---

## 12. Diagramas UML

| Diagrama | Arquivo | Descrição |
|----------|---------|-----------|
| Banco de Dados | `docs/database-model.puml` | ER com constraints e índices |
| Classes Principais | `docs/class-diagrams.puml` | Entidades, enums, providers |
| Arquitetura | `docs/system-architecture.puml` | Camadas e dependências |
| Classes Financeiro | `docs/financial-class-diagram.puml` | SOLID + Design Patterns |
| Sequência Financeiro | `docs/financial-sequence-diagram.puml` | Fluxo de registro de transação |
| Casos de Uso Financeiro | `docs/financial-use-cases.puml` | UC do módulo financeiro |

---

*Documento gerado em Março 2026 — Sistema ARGOM v3.1*
