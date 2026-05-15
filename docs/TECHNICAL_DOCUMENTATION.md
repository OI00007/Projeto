# Documentação Técnica - Sistema ARGOM

## 📋 Índice

1. [Arquitetura do Sistema](#arquitetura-do-sistema)
2. [Estrutura de Componentes](#estrutura-de-componentes)
3. [Design System](#design-system)
4. [Gerenciamento de Estado](#gerenciamento-de-estado)
5. [Performance e Otimizações](#performance-e-otimizações)
6. [Acessibilidade](#acessibilidade)
7. [Testes e Qualidade](#testes-e-qualidade)
8. [Padrões de Código](#padrões-de-código)

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

O sistema ARGOM foi desenvolvido seguindo uma arquitetura **Component-Based** com React, aplicando princípios de **Clean Architecture** e **Separation of Concerns**.

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────┐  │
│  │     Pages       │ │   Components    │ │      Hooks        │  │
│  │  ─────────────  │ │  ─────────────  │ │  ───────────────  │  │
│  │  Dashboard      │ │  ui/            │ │  useAuth          │  │
│  │  Financial      │ │  dashboard/     │ │  useSecureApi     │  │
│  │  Monitoring     │ │  financial/     │ │  useTheme         │  │
│  │  Tasks          │ │  layout/        │ │  useMobile        │  │
│  └─────────────────┘ └─────────────────┘ └───────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────┐  │
│  │    Services     │ │   Validators    │ │    Utilities      │  │
│  │  ─────────────  │ │  ─────────────  │ │  ───────────────  │  │
│  │  mockData.ts    │ │  security.ts    │ │  utils.ts         │  │
│  │                 │ │  validation.ts  │ │  exportUtils.ts   │  │
│  └─────────────────┘ └─────────────────┘ └───────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌─────────────────────────┐ ┌──────────────────────────────┐   │
│  │    Supabase Client      │ │      Edge Functions          │   │
│  │  ─────────────────────  │ │  ──────────────────────────  │   │
│  │  Auth                   │ │  ai-chat                     │   │
│  │  Database               │ │  weather                     │   │
│  │  Realtime               │ │  financial-insights          │   │
│  │  Storage                │ │                              │   │
│  └─────────────────────────┘ └──────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios Detalhada

```
src/
├── assets/                     # Recursos estáticos
│   ├── hero-farm.jpg          # Imagens da aplicação
│   └── dashboard-preview.jpg
│
├── components/
│   ├── ui/                    # Componentes base reutilizáveis
│   │   ├── button.tsx         # Botão com variantes
│   │   ├── card.tsx           # Container Card
│   │   ├── dialog.tsx         # Modal Dialog
│   │   ├── animated-button.tsx # Botão com animações
│   │   ├── animated-card.tsx   # Card animado
│   │   ├── metric-card.tsx     # Card de métricas
│   │   ├── data-table.tsx      # Tabela de dados
│   │   ├── progress-ring.tsx   # Progresso circular
│   │   └── ...                 # Outros componentes UI
│   │
│   ├── dashboard/             # Componentes específicos do dashboard
│   │   ├── AdvancedWeatherWidget.tsx
│   │   ├── DashboardMetrics.tsx
│   │   ├── InventoryManagement.tsx
│   │   ├── TaskManager.tsx
│   │   ├── FinancialChart.tsx
│   │   └── ...
│   │
│   ├── financial/             # Componentes do módulo financeiro
│   │   ├── TransactionManager.tsx
│   │   ├── BudgetPlanner.tsx
│   │   ├── CashFlowAnalysis.tsx
│   │   └── ...
│   │
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── auth/                  # Componentes de autenticação
│   │   ├── SecureAuthForm.tsx
│   │   └── PasswordStrengthIndicator.tsx
│   │
│   └── seo/                   # Componentes de SEO
│       └── SEOHead.tsx
│
├── hooks/                     # Hooks customizados
│   ├── useAuth.tsx            # Autenticação
│   ├── useSecureApi.ts        # API segura
│   ├── useSecureForm.ts       # Formulários seguros
│   ├── useTheme.ts            # Tema (claro/escuro)
│   ├── useMobile.tsx          # Detecção mobile
│   └── useIntersection.ts     # Intersection Observer
│
├── integrations/
│   └── supabase/
│       ├── client.ts          # Cliente Supabase
│       └── types.ts           # Tipos gerados
│
├── lib/                       # Utilitários
│   ├── utils.ts               # Funções utilitárias
│   ├── security.ts            # Validação e segurança
│   ├── validation.ts          # Schemas de validação
│   ├── exportUtils.ts         # Exportação de dados
│   └── mockData.ts            # Dados de demonstração
│
├── pages/                     # Páginas da aplicação
│   ├── Index.tsx              # Landing page
│   ├── Auth.tsx               # Login/Registro
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── Financial.tsx          # Módulo financeiro
│   ├── Monitoring.tsx         # Monitoramento
│   ├── Tasks.tsx              # Tarefas
│   ├── Equipment.tsx          # Equipamentos
│   ├── Profile.tsx            # Perfil do usuário
│   └── NotFound.tsx           # Página 404
│
├── App.tsx                    # Componente raiz com rotas
├── main.tsx                   # Entry point
└── index.css                  # Estilos globais e tokens
```

---

## 🧩 Estrutura de Componentes

### Hierarquia de Componentes

```
ErrorBoundary (captura erros de renderização)
└── BrowserRouter
    └── QueryClientProvider (retry inteligente, staleTime 5min)
        └── AuthProvider (autenticação via Supabase Auth)
            └── FarmDataProvider (dados em tempo real)
                └── TooltipProvider
                    ├── Toaster / Sonner
                    ├── AIChatAssistant (global)
                    └── AnimatedRoutes (AnimatePresence + Suspense)
                        ├── Index (Landing Page)
                        │   ├── Header
                        │   ├── Hero Section
                        │   ├── Features Section
                        │   └── Footer
                        │
                        ├── Auth
                        │   └── SecureAuthForm
                        │       └── PasswordStrengthIndicator
                        │
                        └── ProtectedRoute
                            └── SidebarProvider
                                └── Dashboard
                                    ├── AppSidebar
                                    ├── DashboardMetrics
                                    │   └── MetricCard[]
                                    ├── ChartsRow
                                    │   ├── EnvironmentalChart
                                    │   └── FinancialChart
                                    └── WidgetsGrid
                                        ├── AdvancedWeatherWidget
                                        ├── InventoryManagement
                                        │   └── DataTable
                                        └── TaskManager
                                            ├── TaskItem[]
                                            └── SubtaskItem[]
```

### Componentes Base (UI)

#### MetricCard
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    period: string;
  };
  variant?: "default" | "success" | "warning" | "info" | "premium";
  animated?: boolean;
  className?: string;
}
```

**Responsabilidades**:
- Exibir métricas importantes com formatação consistente
- Suportar indicadores de tendência com animações
- Implementar múltiplas variantes visuais
- Fornecer feedback visual através de hover effects

#### DataTable
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}
```

**Recursos**:
- Ordenação por colunas
- Busca global
- Paginação automática
- Seleção múltipla
- Responsividade completa

#### ProgressRing
```typescript
interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
}
```

---

## 🎨 Design System

### Tokens de Design

#### Cores Semânticas

```css
:root {
  /* Primary - Verde Agrícola */
  --primary: 142 76% 36%;
  --primary-foreground: 355 20% 98%;
  --primary-glow: 142 76% 46%;
  
  /* Semantic Colors */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  --info: 199 89% 48%;
  
  /* Neutral Palette */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 46.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --border: 214 32% 91%;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 142 70% 45%;
  --muted: 240 3.7% 15.9%;
  /* ... outras variáveis dark mode */
}
```

#### Tipografia

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Font Sizes - Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

#### Espaçamento

```css
/* Tailwind Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */

/* Border Radius */
--radius: 0.5rem;
--radius-sm: calc(var(--radius) - 4px);
--radius-md: calc(var(--radius) - 2px);
--radius-lg: var(--radius);
--radius-xl: calc(var(--radius) + 4px);
```

### Sistema de Variantes

#### Button Variants (CVA)
```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Animações e Microinterações

#### Keyframes Customizados

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

#### Classes Utilitárias de Animação

```css
/* Entrada */
.animate-fade-in { animation: fade-in 0.3s ease-out; }
.animate-scale-in { animation: scale-in 0.2s ease-out; }

/* Hover Effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px hsla(var(--foreground), 0.1);
}

.interactive-scale {
  transition: transform 0.15s ease;
}
.interactive-scale:hover {
  transform: scale(1.02);
}
.interactive-scale:active {
  transform: scale(0.98);
}

/* Glass Effect */
.glass-card {
  backdrop-filter: blur(8px);
  background: hsla(var(--background), 0.8);
  border: 1px solid hsla(var(--border), 0.5);
}

/* Acessibilidade - Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ⚡ Gerenciamento de Estado

### React Query (TanStack Query)

```typescript
// Configuração do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30,   // 30 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Hook de exemplo
const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
```

### Estado Local com useState

```typescript
// Estado de componente
const [isOpen, setIsOpen] = useState(false);
const [selectedItems, setSelectedItems] = useState<string[]>([]);

// Estado derivado com useMemo
const filteredItems = useMemo(() => {
  return items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [items, searchTerm]);
```

### Context API para Estado Global

```typescript
// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

---

## 🚀 Performance e Otimizações

### Code Splitting

```typescript
// Lazy loading de páginas
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Financial = lazy(() => import('@/pages/Financial'));
const Monitoring = lazy(() => import('@/pages/Monitoring'));

// Suspense wrapper
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/financial" element={<Financial />} />
  </Routes>
</Suspense>
```

### Memoização

```typescript
// Componentes
export const MetricCard = memo(({ title, value, icon }: Props) => {
  // Componente só re-renderiza se props mudarem
});

// Callbacks
const handleSubmit = useCallback(async (data: FormData) => {
  await processData(data);
}, [processData]);

// Valores computados
const totalExpenses = useMemo(() => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);
```

### Otimização de Imagens

```typescript
// Componente OptimizedImage
export const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height,
  priority = false 
}: Props) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
};
```

### Bundle Optimization

```typescript
// Imports específicos (tree-shaking)
import { format } from 'date-fns/format';
import { addDays } from 'date-fns/addDays';

// Ao invés de:
// import { format, addDays } from 'date-fns';
```

---

## ♿ Acessibilidade

### ARIA Labels e Roles

```typescript
<button
  aria-label="Adicionar nova tarefa"
  aria-describedby="task-help-text"
  role="button"
  tabIndex={0}
>
  <Plus className="h-4 w-4" />
</button>

<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Progresso: ${progress}%`}
>
  <ProgressRing progress={progress} />
</div>
```

### Navegação por Teclado

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      onSelect();
      break;
    case 'Escape':
      onClose();
      break;
    case 'ArrowDown':
      event.preventDefault();
      focusNext();
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusPrevious();
      break;
  }
};
```

### Skip Links

```typescript
export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
  >
    Pular para o conteúdo principal
  </a>
);
```

### Contraste e Cores

```css
/* Garantindo contraste mínimo 4.5:1 */
.text-foreground { color: hsl(240 10% 3.9%); }       /* #0a0a0b */
.text-muted-foreground { color: hsl(215 16% 46.9%); } /* #64748b */

/* Focus rings visíveis */
.focus-visible:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

---

## 🧪 Testes e Qualidade

### Estratégia de Testes

```typescript
// Testes Unitários
describe('MetricCard', () => {
  it('renders title and value correctly', () => {
    render(
      <MetricCard
        title="Temperature"
        value="28°C"
        icon={<Thermometer />}
      />
    );
    
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('28°C')).toBeInTheDocument();
  });

  it('shows trend indicator when provided', () => {
    render(
      <MetricCard
        title="Revenue"
        value="$1000"
        icon={<DollarSign />}
        trend={{ value: 12, period: 'vs last month' }}
      />
    );
    
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });
});

// Testes de Integração
describe('Task Management Flow', () => {
  it('allows creating and completing tasks', async () => {
    render(<TaskManager />);
    
    // Criar tarefa
    await userEvent.click(screen.getByLabelText('Adicionar tarefa'));
    await userEvent.type(screen.getByLabelText('Título'), 'Nova tarefa');
    await userEvent.click(screen.getByText('Salvar'));
    
    expect(screen.getByText('Nova tarefa')).toBeInTheDocument();
    
    // Completar tarefa
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
```

### Linting e Formatação

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
```

### Performance Monitoring

```typescript
// Web Vitals
import { onCLS, onFID, onLCP } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
  }
};
```

---

## 📝 Padrões de Código

### Convenções de Nomenclatura

```typescript
// Componentes - PascalCase
const MetricCard = () => { ... }

// Hooks - camelCase com prefixo "use"
const useAuth = () => { ... }

// Utilities - camelCase
const formatCurrency = (value: number) => { ... }

// Constantes - UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 10;

// Tipos/Interfaces - PascalCase
interface UserProfile { ... }
type ButtonVariant = 'default' | 'outline';

// Arquivos de componente - PascalCase.tsx
// MetricCard.tsx, TaskManager.tsx

// Arquivos utilitários - camelCase.ts
// utils.ts, formatters.ts
```

### Estrutura de Componentes

```typescript
// 1. Imports
import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';

// 2. Types/Interfaces
interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

// 3. Component
export const TaskItem = memo(({ task, onComplete, onDelete }: TaskItemProps) => {
  // 3.1 Hooks
  const [isEditing, setIsEditing] = useState(false);
  
  // 3.2 Handlers
  const handleComplete = useCallback(() => {
    onComplete(task.id);
  }, [task.id, onComplete]);
  
  // 3.3 Render
  return (
    <div className="flex items-center gap-2 p-4 rounded-lg border">
      <Checkbox checked={task.completed} onCheckedChange={handleComplete} />
      <span className={cn(task.completed && 'line-through')}>
        {task.title}
      </span>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';
```

### Tratamento de Erros

```typescript
// Com try-catch
const fetchData = async () => {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    toast.error('Erro ao carregar tarefas. Tente novamente.');
    return [];
  }
};

// Com React Query
const { data, error, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  onError: (error) => {
    toast.error('Erro ao carregar tarefas');
  },
});
```

---

## 🛡️ ErrorBoundary

O sistema utiliza um `ErrorBoundary` global que envolve toda a aplicação, capturando erros de renderização e exibindo uma UI de fallback amigável:

```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Log em desenvolvimento, monitoramento em produção
  }
}
```

**Funcionalidades**:
- Previne "tela branca" em erros não tratados
- Botão "Tentar novamente" (reset do estado)
- Botão "Recarregar página" (fallback final)
- Exibe stack trace apenas em desenvolvimento
- Aceita `fallback` customizado via props

---

## 🧪 Infraestrutura de Testes

### Configuração

- **Runner**: Vitest (compatível com Vite)
- **Ambiente**: jsdom
- **Assertivas**: `@testing-library/jest-dom`
- **Renderização**: `@testing-library/react`

### Testes Implementados (13)

| Hook/Contexto | Testes | Cobertura |
|----------------|--------|-----------|
| `useAuth` | 4 | Contexto, loading, listener, signOut |
| `FarmDataContext` | 9 | Contexto, defaults, fetch, realtime, hooks |

```bash
# Executar testes
npx vitest run
```

---

## 📊 Métricas de Qualidade

### Performance Targets

| Métrica | Target | Descrição |
|---------|--------|-----------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTI | < 3.5s | Time to Interactive |
| Bundle Size | < 500KB | Gzipped |

### Integridade de Dados

| Recurso | Implementação |
|---------|---------------|
| Índices | `financial_transactions`, `tasks`, `sensors`, `audit_logs` |
| CHECK constraints | Tipo de transação (`income`/`expense`), prioridade e status de tarefas |
| NOT NULL | Campos críticos: `status`, `type`, `priority` |
| Defaults | `status = 'pending'`, `priority = 'medium'`, `type = 'expense'` |

---

*Última atualização: Fevereiro 2026*
