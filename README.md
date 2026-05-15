# 🌾 ARGOM - Sistema de Gestão Inteligente de Propriedades Rurais

<div align="center">

![Version](https://img.shields.io/badge/version-3.1.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ecf8e.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8.svg)

**Plataforma completa para gestão agrícola moderna, integrando monitoramento ambiental em tempo real, controle financeiro, gestão de tarefas, equipamentos, campos de cultivo e inteligência artificial.**

[🚀 Demo ao Vivo](https://yewgfoxm-sparkle.lovable.app) • [📖 Documentação](./docs/README.md) • [🐛 Reportar Bug](../../issues) • [✨ Sugerir Feature](../../issues)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Arquitetura](#️-arquitetura)
- [Banco de Dados](#️-banco-de-dados)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Segurança](#-segurança)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **ARGOM** é um sistema de gestão inteligente desenvolvido para modernizar a administração de propriedades rurais. Com uma interface intuitiva e recursos avançados de análise, o sistema permite que produtores rurais tomem decisões baseadas em dados em tempo real.

### Problema Resolvido

- ❌ Gestão fragmentada em planilhas e sistemas desconectados
- ❌ Falta de visibilidade sobre condições ambientais
- ❌ Controle financeiro manual e propenso a erros
- ❌ Dificuldade no planejamento e rastreamento de atividades
- ❌ Ausência de controle de equipamentos e campos de cultivo

### Nossa Solução

- ✅ Dashboard unificado com todas as métricas em tempo real
- ✅ Monitoramento meteorológico e ambiental integrado
- ✅ Controle financeiro automatizado com orçamentos e relatórios
- ✅ Sistema de tarefas com subtarefas e progresso visual
- ✅ Gestão de equipamentos com controle de manutenção
- ✅ Campos de cultivo com ciclo completo de produção
- ✅ Sistema de alertas inteligentes por severidade
- ✅ Assistente de IA para insights e recomendações agrícolas

---

## ✨ Funcionalidades

### 🏠 Dashboard Principal
- Métricas em tempo real (temperatura, umidade, receitas)
- Gráficos interativos de produção e ambiente (Recharts)
- Alertas inteligentes e notificações por severidade
- Ações rápidas para operações comuns

### 🌤️ Monitoramento Meteorológico
- Condições climáticas atuais com sensação térmica
- Previsão horária e semanal
- Alertas de eventos extremos (geada, tempestade)
- Índice UV e qualidade do ar

### 💰 Gestão Financeira
- Controle de receitas e despesas com categorização
- Planejamento orçamentário com alertas de threshold
- Análise de fluxo de caixa e rentabilidade
- Relatórios exportáveis (PDF/Excel/CSV)
- Insights financeiros via IA (Edge Function)

### ✅ Gerenciamento de Tarefas
- Tarefas com subtarefas e categorias agrícolas
- Priorização (alta, média, baixa)
- Progresso automático calculado
- Filtros e busca avançada

### 🚜 Gestão de Equipamentos
- Cadastro com modelo, fabricante e número de série
- Status (ativo, manutenção, offline, aposentado)
- Controle de horas de uso e manutenções
- Agendamento de próximas manutenções

### 🌱 Campos de Cultivo
- Cadastro de campos com tipo de cultura e área
- Acompanhamento do ciclo (planejado → colheita → pós-colheita)
- Rendimento esperado vs. realizado
- Tipo de solo e irrigação

### 🔔 Sistema de Alertas
- Alertas por tipo (clima, sensor, manutenção, financeiro)
- Severidade (baixa, média, alta, crítica)
- Marcar como lido/resolvido
- Integração com sensores

### 📦 Controle de Estoque
- Inventário de insumos e produtos
- Alertas de estoque baixo
- Histórico de movimentações

### 🤖 Assistente de IA
- Chat inteligente (streaming SSE)
- Análises preditivas e recomendações
- Insights financeiros automáticos

### 📊 Cotações de Commodities
- Preços em tempo real de commodities agrícolas
- Histórico e variações (24h, 7d)

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.3.1 | Biblioteca de UI |
| TypeScript | 5.x | Tipagem estática |
| Vite | 6.x | Build tool ultrarrápido |
| Tailwind CSS | 3.x | Framework CSS utilitário |
| shadcn/ui + Radix UI | Latest | Componentes acessíveis |
| Recharts | 2.x | Gráficos e visualizações |
| Framer Motion | 12.x | Animações declarativas |
| TanStack React Query | 5.x | Cache e sincronização de dados |
| React Router DOM | 6.x | Roteamento SPA |
| Zod | 3.x | Validação de schemas |

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| Supabase | Backend-as-a-Service (Auth, Database, Realtime, Edge Functions) |
| PostgreSQL 15 | Banco de dados relacional com RLS |
| Edge Functions (Deno) | Funções serverless para IA e APIs externas |

### Qualidade e Testes
| Tecnologia | Descrição |
|------------|-----------|
| Vitest | Test runner compatível com Vite |
| Testing Library | Renderização e queries de componentes |
| ESLint | Linting de código |

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │   Pages     │ │  Components │ │       Hooks         ││
│  │  Dashboard  │ │  UI Base    │ │  useAuth            ││
│  │  Financial  │ │  Dashboard  │ │  useSecureApi       ││
│  │  Tasks      │ │  Financial  │ │  useTheme           ││
│  │  Equipment  │ │  Layout     │ │  useCommodities     ││
│  │  Monitoring │ │  Auth/SEO   │ │  useWeatherApi      ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                   Business Logic Layer                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │   Services  │ │  Validators │ │      Utilities      ││
│  │  Sensor     │ │  security   │ │  exportUtils        ││
│  │  Financial  │ │  validation │ │  formatters         ││
│  │  Commodity  │ │  validators │ │  cache              ││
│  └─────────────┘ └─────────────┘ └─────────────────────┘│
└────────────────────────────┬────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│                    Data Access Layer                     │
│  ┌──────────────────┐ ┌─────────────────────────────────┐│
│  │ Supabase Client  │ │      Edge Functions             ││
│  │  Auth (JWT)      │ │  ai-chat (SSE streaming)        ││
│  │  Database (RLS)  │ │  weather                        ││
│  │  Realtime        │ │  financial-insights             ││
│  │  Storage         │ │  commodities                    ││
│  └──────────────────┘ └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Banco de Dados

### Schema (v3.1)

| Tabela | Descrição | RLS | Triggers | Índices |
|--------|-----------|-----|----------|---------|
| `farms` | Propriedades rurais | ✅ | updated_at, audit | user_id |
| `profiles` | Perfis de usuário | ✅ | updated_at, audit | user_id |
| `financial_transactions` | Transações financeiras | ✅ | validate, updated_at, audit | user+date, user+type+date, user+category, user+status |
| `tasks` | Tarefas e atividades | ✅ | validate, updated_at, audit | user+status, user+priority, user+due_date, user+category |
| `sensors` | Leituras de sensores | ✅ | validate, audit | farm_id, farm+type |
| `budgets` | Orçamentos | ✅ | validate, updated_at, audit | user+period, user+category |
| `equipment` | Equipamentos e maquinário | ✅ | validate, updated_at, audit | user_id, user+status, farm_id, next_maintenance |
| `alerts` | Alertas do sistema | ✅ | validate, audit | user_id, user+read, user+severity, created_at |
| `crop_fields` | Campos de cultivo | ✅ | validate, updated_at, audit | user_id, farm_id, user+status |
| `audit_logs` | Log de auditoria | ✅ | — | user_id, created_at |
| `user_roles` | Papéis (admin/user/manager) | ✅ | — | — |

### Integridade

- **Validações server-side** via triggers PL/pgSQL em todas as tabelas de dados
- **Índices compostos** para consultas frequentes (user+filtro)
- **RLS** em 100% das tabelas
- **Auditoria automática** via `audit_trigger_function()`
- **Defaults seguros** em status, tipo e prioridade

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18.0.0+
- **npm** 9.0.0+ (ou bun)
- **Git**

### Passo a Passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/argom.git
cd argom

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor
npm run dev
```

Acesse `http://localhost:5173`

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

### Edge Functions Secrets (Supabase Dashboard)

| Secret | Descrição |
|--------|-----------|
| `LOVABLE_API_KEY` | Chave da API Lovable para IA |

---

## 💻 Uso

### Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run preview      # Visualizar build
npm run lint         # Linting
npx vitest run       # Testes
```

### Rotas

| Rota | Descrição | Protegida |
|------|-----------|-----------|
| `/` | Landing page | Não |
| `/auth` | Login/Registro | Não |
| `/dashboard` | Dashboard principal | Sim |
| `/financial` | Gestão financeira | Sim |
| `/tasks` | Tarefas | Sim |
| `/monitoring` | Monitoramento ambiental | Sim |
| `/equipment` | Equipamentos | Sim |
| `/fleet` | Frota | Sim |
| `/costs-fields` | Custos e campos | Sim |
| `/ai-insights` | IA e insights | Sim |
| `/profile` | Perfil do usuário | Sim |

---

## 📁 Estrutura do Projeto

```
argom/
├── docs/                      # 📚 Documentação completa
│   ├── README.md              # Índice da documentação
│   ├── TECHNICAL_OVERVIEW.md  # Visão técnica geral
│   ├── TECHNICAL_DOCUMENTATION.md  # Documentação técnica detalhada
│   ├── API_DOCUMENTATION.md   # Documentação de API
│   ├── COMPONENT_DOCUMENTATION.md  # Componentes React
│   ├── SECURITY_DOCUMENTATION.md   # Segurança
│   ├── USER_MANUAL.md         # Manual do usuário
│   ├── DEPLOY.md              # Guia de deploy
│   ├── database-model.puml    # Diagrama ER (PlantUML)
│   └── *.puml                 # Outros diagramas UML
├── src/
│   ├── assets/               # Imagens e mídia
│   ├── components/
│   │   ├── ui/               # ~50 componentes base (shadcn/ui)
│   │   ├── dashboard/        # Widgets do dashboard
│   │   ├── financial/        # Módulo financeiro
│   │   ├── layout/           # Header, Footer
│   │   ├── auth/             # Autenticação
│   │   ├── feedback/         # Estados de erro e vazio
│   │   ├── navigation/       # Navegação e transições
│   │   ├── accessibility/    # Skip links, a11y
│   │   └── seo/              # SEO
│   ├── contexts/             # Providers (Auth, FarmData)
│   ├── hooks/                # ~20 hooks customizados
│   ├── integrations/         # Supabase client + tipos
│   ├── lib/                  # Utilitários, segurança, cache
│   ├── pages/                # ~12 páginas da aplicação
│   ├── services/             # Serviços de dados (SOLID)
│   ├── types/                # Tipos TypeScript (farm, commodities)
│   ├── App.tsx               # Componente raiz com rotas
│   ├── main.tsx              # Entry point
│   └── index.css             # Design tokens e estilos globais
├── supabase/
│   ├── functions/            # 4 Edge Functions (Deno)
│   │   ├── ai-chat/          # Chat com IA (streaming SSE)
│   │   ├── weather/          # Dados meteorológicos
│   │   ├── financial-insights/  # Insights financeiros
│   │   └── commodities/      # Cotações de commodities
│   └── migrations/           # Migrations SQL do banco
├── tailwind.config.ts        # Design system tokens
├── vite.config.ts            # Configuração Vite
├── vitest.config.ts          # Configuração de testes
└── package.json
```

---

## 🧪 Testes

### Stack

- **Vitest** — Test runner (compatível com Vite)
- **@testing-library/react** — Renderização e queries
- **@testing-library/jest-dom** — Matchers customizados
- **jsdom** — Ambiente de navegador simulado

### Cobertura (13 testes)

| Módulo | Testes | Cenários |
|--------|--------|----------|
| `useAuth` | 4 | Contexto obrigatório, loading inicial, listener auth, signOut |
| `FarmDataContext` | 9 | Contexto obrigatório, valores padrão, fetch Supabase, realtime, hooks utilitários |

```bash
npx vitest run             # Executar todos
npx vitest                 # Watch mode
npx vitest run --coverage  # Com cobertura
```

---

## 🚀 Deploy

### Via Lovable (Recomendado)

1. Acesse o projeto no [Lovable](https://lovable.dev)
2. Clique em **Publish** → **Update**
3. App disponível em `*.lovable.app`

### Manual

```bash
npm run build
vercel deploy --prod    # ou netlify deploy --prod --dir=dist
```

Para detalhes completos, veja [docs/DEPLOY.md](./docs/DEPLOY.md)

---

## 🔐 Segurança

| Camada | Implementação |
|--------|---------------|
| Autenticação | JWT via Supabase Auth + refresh automático |
| Autorização | Row Level Security (RLS) em 11 tabelas |
| Validação | Zod schemas + triggers PL/pgSQL server-side |
| Sanitização | Proteção XSS via `sanitizeText()` |
| Rate Limiting | Client-side + Edge Functions |
| Auditoria | `audit_logs` automático via triggers |
| Roles | Tabela separada `user_roles` + `has_role()` SECURITY DEFINER |

Para detalhes completos, veja [docs/SECURITY_DOCUMENTATION.md](./docs/SECURITY_DOCUMENTATION.md)

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Padrões de Código

- TypeScript estrito (sem `any`)
- Componentes funcionais com hooks
- Design tokens semânticos (sem cores hardcoded)
- Validação server-side + client-side
- Documentação de funções e componentes complexos

---

## 📄 Licença

MIT License — Veja [LICENSE](LICENSE) para detalhes.

---

## 📞 Contato

**Equipe ARGOM**

- 🌐 Website: [argom.com.br](https://argom.com.br)
- 📧 Email: contato@argom.com.br

---

<div align="center">

**Feito com 💚 para o Agronegócio Brasileiro**

[⬆ Voltar ao topo](#-argom---sistema-de-gestão-inteligente-de-propriedades-rurais)

</div>
