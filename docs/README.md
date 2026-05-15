# 📚 Documentação do Sistema ARGOM v3.1

Bem-vindo à documentação completa do Sistema de Gestão Inteligente de Propriedades Rurais — ARGOM.

---

## 📋 Índice de Documentos

| Documento | Descrição | Público-alvo |
|-----------|-----------|--------------|
| [README Principal](../README.md) | Visão geral, instalação e início rápido | Todos |
| [Visão Técnica](./TECHNICAL_OVERVIEW.md) | Resumo técnico v3.1 com banco, segurança e arquitetura | Desenvolvedores |
| [Documentação Técnica](./TECHNICAL_DOCUMENTATION.md) | Arquitetura detalhada, componentes e performance | Desenvolvedores |
| [Documentação de API](./API_DOCUMENTATION.md) | Endpoints, exemplos e integrações | Desenvolvedores |
| [Documentação de Componentes](./COMPONENT_DOCUMENTATION.md) | Props, variantes e exemplos de uso | Desenvolvedores |
| [Documentação de Segurança](./SECURITY_DOCUMENTATION.md) | Autenticação, autorização e boas práticas | Dev/SecOps |
| [Manual do Usuário](./USER_MANUAL.md) | Guia completo de uso do sistema | Usuários finais |
| [Guia de Deploy](./DEPLOY.md) | Deploy em produção e CI/CD | DevOps |
| [Modelo de Banco de Dados](./database-model.puml) | Diagrama ER completo (PlantUML) | Desenvolvedores |

---

## 🎯 Visão Geral do Sistema

O **ARGOM** é uma plataforma completa para gestão de propriedades rurais que integra:

```
┌─────────────────────────────────────────────────────────────────┐
│                        SISTEMA ARGOM v3.1                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🏠 Dashboard       📊 Monitoramento     💰 Financeiro          │
│  ├─ Métricas        ├─ Clima             ├─ Transações          │
│  ├─ Alertas         ├─ Sensores          ├─ Orçamentos          │
│  └─ Ações rápidas   └─ Previsões         └─ Relatórios          │
│                                                                  │
│  ✅ Tarefas         🚜 Equipamentos      🌱 Campos de Cultivo   │
│  ├─ Subtarefas      ├─ Manutenção        ├─ Ciclo produtivo     │
│  ├─ Prioridades     ├─ Horas de uso      ├─ Rendimento          │
│  └─ Progresso       └─ Status            └─ Solo/irrigação      │
│                                                                  │
│  🔔 Alertas         📦 Estoque           🤖 IA & Insights       │
│  ├─ Por severidade  ├─ Inventário        ├─ Chat IA             │
│  ├─ Por tipo        ├─ Movimentações     ├─ Análises            │
│  └─ Resolução       └─ Alertas           └─ Recomendações       │
│                                                                  │
│  📊 Commodities                                                  │
│  ├─ Cotações                                                     │
│  └─ Histórico                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Arquitetura

### Stack Tecnológico

```
Frontend                    Backend                    Infraestrutura
┌──────────────┐           ┌──────────────┐           ┌──────────────┐
│ React 18     │           │ Supabase     │           │ Lovable      │
│ TypeScript   │  ──────►  │ PostgreSQL   │  ──────►  │ Cloud        │
│ Tailwind CSS │           │ Edge Funcs   │           │ CDN          │
│ Vite 6       │           │ Realtime     │           │ SSL          │
│ shadcn/ui    │           │ Auth (JWT)   │           │              │
└──────────────┘           └──────────────┘           └──────────────┘
```

---

## 🗄️ Banco de Dados (v3.1)

### 11 Tabelas com RLS

| Tabela | Validação Server | Triggers | Índices Compostos |
|--------|:----------------:|:--------:|:-----------------:|
| `farms` | — | 2 | 1 |
| `profiles` | — | 2 | 1 |
| `financial_transactions` | ✅ | 3 | 4 |
| `tasks` | ✅ | 3 | 4 |
| `sensors` | ✅ | 2 | 2 |
| `budgets` | ✅ | 3 | 2 |
| `equipment` | ✅ | 3 | 4 |
| `alerts` | ✅ | 2 | 4 |
| `crop_fields` | ✅ | 3 | 3 |
| `audit_logs` | — | — | 2 |
| `user_roles` | — | — | — |

### Funções de Segurança

- `has_role()` — Verificação de role via SECURITY DEFINER (evita recursão RLS)
- `insert_audit_log()` — Inserção de audit via SECURITY DEFINER
- `audit_trigger_function()` — Auditoria automática com fallback para signup
- `handle_new_user()` — Criação de perfil automática no signup

---

## 🚀 Início Rápido

```bash
git clone https://github.com/seu-usuario/argom.git
cd argom
npm install
npm run dev
```

```
🌐 Desenvolvimento: http://localhost:5173
🌐 Produção: https://yewgfoxm-sparkle.lovable.app
```

---

## 🧪 Testes

```bash
npx vitest run           # 13 testes (useAuth + FarmDataContext)
npx vitest run --coverage
```

---

## 📈 Performance

| Métrica | Target | Status |
|---------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |

---

## ♿ Acessibilidade (WCAG 2.1)

- ✅ Navegação por teclado
- ✅ ARIA labels
- ✅ Contraste 4.5:1
- ✅ Skip links
- ✅ Textos alternativos
- ✅ `prefers-reduced-motion`

---

## 🔐 Segurança

- JWT + refresh automático (Supabase Auth)
- RLS em 11 tabelas
- Validação Zod (client) + triggers PL/pgSQL (server)
- Sanitização XSS
- Rate limiting
- Auditoria automática
- Roles em tabela separada

---

## 📅 Changelog

### v3.1.0 (Março 2026)
- 🗄️ Novas tabelas: `equipment`, `alerts`, `crop_fields`
- 📊 ~30 índices compostos para performance
- 🛡️ Triggers de validação server-side em 6 tabelas
- 📝 Documentação técnica completa atualizada para v3.1
- 📐 Diagrama ER atualizado com todas as tabelas

### v3.0.0 (Fevereiro 2026)
- 🛡️ ErrorBoundary global
- 🔒 Migration de integridade: CHECK constraints, NOT NULL
- 🧪 13 testes unitários (useAuth + FarmDataContext)
- ⚡ QueryClient com retry inteligente
- 🏗️ Eliminação de `any` em módulos críticos

### v2.0.0 (Janeiro 2025)
- ✨ Nova interface com design system completo
- ✨ Integração com IA para insights
- ✨ Sistema de auditoria automático
- 🔒 Segurança: RLS, validação Zod

### v1.0.0 (Novembro 2024)
- 🎉 Lançamento inicial

---

## 📞 Suporte

| Canal | Contato |
|-------|---------|
| 📧 Email | suporte@argom.com.br |
| 🔐 Segurança | security@argom.com.br |

---

<div align="center">

**📚 Documentação ARGOM v3.1**

[README](../README.md) • [Técnico](./TECHNICAL_OVERVIEW.md) • [API](./API_DOCUMENTATION.md) • [Manual](./USER_MANUAL.md) • [Deploy](./DEPLOY.md) • [Segurança](./SECURITY_DOCUMENTATION.md)

</div>
