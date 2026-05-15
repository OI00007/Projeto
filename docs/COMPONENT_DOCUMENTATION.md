# Documentação de Componentes - Sistema Argom

## Visão Geral

Este documento descreve todos os componentes React disponíveis no Sistema Argom, incluindo props, variantes e exemplos de uso.

---

## Índice

1. [Componentes de UI Base](#componentes-de-ui-base)
2. [Componentes Animados](#componentes-animados)
3. [Componentes de Layout](#componentes-de-layout)
4. [Componentes de Dashboard](#componentes-de-dashboard)
5. [Componentes Financeiros](#componentes-financeiros)
6. [Componentes de Acessibilidade](#componentes-de-acessibilidade)
7. [Componentes SEO](#componentes-seo)

---

## Componentes de UI Base

### Button

Botão base do shadcn/ui com variantes.

**Arquivo**: `src/components/ui/button.tsx`

```tsx
import { Button } from "@/components/ui/button";

// Variantes
<Button variant="default">Padrão</Button>
<Button variant="destructive">Destrutivo</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="default">Padrão</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button size="icon">🔍</Button>
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | string | "default" | Estilo visual |
| `size` | string | "default" | Tamanho do botão |
| `asChild` | boolean | false | Renderiza como child |
| `disabled` | boolean | false | Desabilita o botão |

---

### Card

Container com estilização consistente.

**Arquivo**: `src/components/ui/card.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo aqui</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

---

### Dialog

Modal para ações e formulários.

**Arquivo**: `src/components/ui/dialog.tsx`

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>
        Descrição do que o modal faz.
      </DialogDescription>
    </DialogHeader>
    <div>Conteúdo do modal</div>
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Toast / Sonner

Notificações temporárias.

**Arquivo**: `src/components/ui/sonner.tsx`

```tsx
import { toast } from "sonner";

// Tipos de toast
toast("Mensagem padrão");
toast.success("Operação realizada com sucesso!");
toast.error("Ocorreu um erro");
toast.warning("Atenção!");
toast.info("Informação importante");

// Com ação
toast("Item deletado", {
  action: {
    label: "Desfazer",
    onClick: () => undoDelete(),
  },
});

// Com descrição
toast.success("Fazenda criada", {
  description: "A fazenda foi criada com sucesso.",
});
```

---

## Componentes Animados

### AnimatedButton

Botão com animações premium (ripple, shimmer, loading).

**Arquivo**: `src/components/ui/animated-button.tsx`

```tsx
import { AnimatedButton } from "@/components/ui/animated-button";

// Variantes
<AnimatedButton variant="gradient">Gradient</AnimatedButton>
<AnimatedButton variant="premium">Premium</AnimatedButton>
<AnimatedButton variant="success">Sucesso</AnimatedButton>
<AnimatedButton variant="outline">Outline</AnimatedButton>

// Com loading
<AnimatedButton loading>Salvando...</AnimatedButton>

// Sem ripple
<AnimatedButton ripple={false}>Sem Ripple</AnimatedButton>

// Tamanhos
<AnimatedButton size="sm">Pequeno</AnimatedButton>
<AnimatedButton size="lg">Grande</AnimatedButton>
<AnimatedButton size="xl">Extra Grande</AnimatedButton>
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | string | "default" | Estilo visual |
| `size` | string | "default" | Tamanho |
| `loading` | boolean | false | Mostra spinner |
| `ripple` | boolean | true | Efeito ripple no clique |

---

### AnimatedCard

Card com animações de entrada e hover.

**Arquivo**: `src/components/ui/animated-card.tsx`

```tsx
import {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardTitle,
  AnimatedCardDescription,
  AnimatedCardContent,
  AnimatedCardFooter,
} from "@/components/ui/animated-card";

// Variantes
<AnimatedCard variant="default">Padrão</AnimatedCard>
<AnimatedCard variant="glass">Efeito Glass</AnimatedCard>
<AnimatedCard variant="gradient">Com Gradiente</AnimatedCard>
<AnimatedCard variant="interactive">Interativo</AnimatedCard>
<AnimatedCard variant="premium">Premium</AnimatedCard>

// Tipos de hover
<AnimatedCard hover="lift">Levanta</AnimatedCard>
<AnimatedCard hover="glow">Brilha</AnimatedCard>
<AnimatedCard hover="scale">Escala</AnimatedCard>
<AnimatedCard hover="border">Borda</AnimatedCard>
<AnimatedCard hover="none">Sem hover</AnimatedCard>

// Com delay de animação
<AnimatedCard delay={200}>Com delay de 200ms</AnimatedCard>
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `variant` | string | "default" | Estilo visual |
| `hover` | string | "lift" | Efeito no hover |
| `delay` | number | 0 | Delay da animação (ms) |

---

### AnimatedProgress

Barra de progresso com animação suave.

**Arquivo**: `src/components/ui/progress-animated.tsx`

```tsx
import { AnimatedProgress } from "@/components/ui/progress-animated";

// Básico
<AnimatedProgress value={75} />

// Com valor visível
<AnimatedProgress value={75} showValue />

// Variantes de cor
<AnimatedProgress value={75} variant="success" />
<AnimatedProgress value={50} variant="warning" />
<AnimatedProgress value={25} variant="info" />
<AnimatedProgress value={90} variant="gradient" />

// Tamanhos
<AnimatedProgress value={75} size="sm" />
<AnimatedProgress value={75} size="default" />
<AnimatedProgress value={75} size="lg" />

// Sem animação
<AnimatedProgress value={75} animate={false} />
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | number | 0 | Valor (0-100) |
| `showValue` | boolean | false | Mostra porcentagem |
| `variant` | string | "default" | Cor da barra |
| `size` | string | "default" | Altura da barra |
| `animate` | boolean | true | Anima a entrada |

---

### StatCard

Card de estatísticas com ícone e trend.

**Arquivo**: `src/components/ui/stat-card.tsx`

```tsx
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, Users, TrendingUp } from "lucide-react";

<StatCard
  title="Receita Total"
  value="R$ 150.000"
  subtitle="este mês"
  icon={DollarSign}
  trend={{ value: 12.5, label: "vs mês anterior" }}
  variant="premium"
/>

<StatCard
  title="Usuários Ativos"
  value="1.234"
  icon={Users}
  trend={{ value: -5.2 }}
  variant="warning"
/>

// Tamanhos
<StatCard size="sm" title="Pequeno" value="100" />
<StatCard size="default" title="Padrão" value="100" />
<StatCard size="lg" title="Grande" value="100" />
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | string | - | Título do stat |
| `value` | string/number | - | Valor principal |
| `subtitle` | string | - | Texto auxiliar |
| `icon` | LucideIcon | - | Ícone do card |
| `trend` | object | - | { value: number, label?: string } |
| `variant` | string | "default" | Estilo visual |
| `size` | string | "default" | Tamanho do card |
| `delay` | number | 0 | Delay da animação |

---

## Componentes de Layout

### Header

Navegação principal com menu mobile e tema toggle.

**Arquivo**: `src/components/layout/Header.tsx`

```tsx
import { Header } from "@/components/layout/Header";

// Uso simples (geralmente no layout principal)
<Header />
```

**Features**:
- Navegação responsiva
- Menu mobile animado
- Toggle de tema (claro/escuro)
- Dropdown para mais opções
- Scroll-aware (muda estilo ao rolar)
- Acessível com teclado

---

### Footer

Rodapé com links, contato e redes sociais.

**Arquivo**: `src/components/layout/Footer.tsx`

```tsx
import { Footer } from "@/components/layout/Footer";

// Uso simples
<Footer />
```

**Features**:
- Links organizados por categoria
- Informações de contato
- Redes sociais com hover animado
- Botão "voltar ao topo"
- Acessível e semântico

---

### DashboardLayout

Layout padrão para páginas internas.

**Arquivo**: `src/components/DashboardLayout.tsx`

```tsx
import { DashboardLayout } from "@/components/DashboardLayout";

<DashboardLayout
  title="Dashboard"
  subtitle="Visão geral da fazenda"
>
  <div>Conteúdo da página</div>
</DashboardLayout>
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | string | - | Título da página |
| `subtitle` | string | - | Subtítulo |
| `children` | ReactNode | - | Conteúdo |

---

## Componentes de Dashboard

### StatsCard

Card de estatísticas do dashboard.

**Arquivo**: `src/components/dashboard/StatsCard.tsx`

```tsx
import { StatsCard } from "@/components/dashboard/StatsCard";

<StatsCard
  title="Temperatura"
  value="28°C"
  trend="+2°C desde ontem"
  icon={<Thermometer />}
  variant="warning"
  target={30}
  historical={[
    { period: "Ontem", value: 26 },
    { period: "Semana passada", value: 24 }
  ]}
  details={{
    description: "Temperatura ambiente",
    metrics: [
      { label: "Máxima", value: "32°C", status: "warning" },
      { label: "Mínima", value: "18°C", status: "good" }
    ]
  }}
/>
```

---

### WeatherCard

Widget de clima simplificado.

**Arquivo**: `src/components/dashboard/WeatherCard.tsx`

```tsx
import { WeatherCard } from "@/components/dashboard/WeatherCard";

<WeatherCard />
```

---

### EnhancedWeatherWidget

Widget de clima avançado com previsão.

**Arquivo**: `src/components/dashboard/EnhancedWeatherWidget.tsx`

```tsx
import { EnhancedWeatherWidget } from "@/components/dashboard/EnhancedWeatherWidget";

<EnhancedWeatherWidget />
```

---

### TaskManager

Gerenciador de tarefas completo.

**Arquivo**: `src/components/dashboard/TaskManager.tsx`

```tsx
import { TaskManager } from "@/components/dashboard/TaskManager";

<TaskManager />
```

**Features**:
- Lista de tarefas com filtros
- Criação e edição de tarefas
- Subtarefas
- Prioridades e status
- Progresso automático

---

### InventoryManagement

Gestão de inventário/estoque.

**Arquivo**: `src/components/dashboard/InventoryManagement.tsx`

```tsx
import { InventoryManagement } from "@/components/dashboard/InventoryManagement";

<InventoryManagement />
```

---

## Componentes Financeiros

### FinancialChart

Gráfico de receitas vs despesas.

**Arquivo**: `src/components/dashboard/FinancialChart.tsx`

```tsx
import { FinancialChart } from "@/components/dashboard/FinancialChart";

<FinancialChart />
```

---

### FinancialOverview

Visão geral financeira.

**Arquivo**: `src/components/financial/FinancialOverview.tsx`

```tsx
import { FinancialOverview } from "@/components/financial/FinancialOverview";

<FinancialOverview />
```

---

### TransactionManager

Gerenciador de transações.

**Arquivo**: `src/components/financial/TransactionManager.tsx`

```tsx
import { TransactionManager } from "@/components/financial/TransactionManager";

<TransactionManager />
```

---

## Componentes de Acessibilidade

### SkipLink

Link para pular para conteúdo principal.

**Arquivo**: `src/components/accessibility/SkipLink.tsx`

```tsx
import { SkipLink } from "@/components/accessibility/SkipLink";

// No início do body/layout
<SkipLink />

// Target no main
<main id="main-content">...</main>
```

---

## Componentes SEO

### SEOHead

Gerenciador de meta tags dinâmicas.

**Arquivo**: `src/components/seo/SEOHead.tsx`

```tsx
import { SEOHead } from "@/components/seo/SEOHead";

<SEOHead
  title="Dashboard - Sistema Argom"
  description="Painel de controle completo para gestão da sua fazenda"
  keywords="dashboard, fazenda, gestão rural"
  image="/og-dashboard.jpg"
  url="/dashboard"
  type="website"
/>

// Para páginas que não devem ser indexadas
<SEOHead
  title="Área Restrita"
  noindex={true}
/>
```

**Props**:
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | string | "Sistema Argom..." | Título da página |
| `description` | string | "Sistema completo..." | Meta description |
| `keywords` | string | "gestão rural..." | Meta keywords |
| `image` | string | "/og-image.jpg" | Imagem Open Graph |
| `url` | string | "/" | URL canônica |
| `type` | string | "website" | Tipo Open Graph |
| `noindex` | boolean | false | Bloqueia indexação |

---

## Hooks Customizados

### useAuth

Hook de autenticação.

**Arquivo**: `src/hooks/useAuth.tsx`

```tsx
import { useAuth } from "@/hooks/useAuth";

function Component() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <LoginForm />;

  return <Dashboard user={user} />;
}
```

---

### useTheme

Hook de tema (claro/escuro).

**Arquivo**: `src/hooks/useTheme.ts`

```tsx
import { useTheme } from "@/hooks/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

### useMobile

Detecta dispositivo mobile.

**Arquivo**: `src/hooks/use-mobile.tsx`

```tsx
import { useIsMobile } from "@/hooks/use-mobile";

function Component() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

### useIntersection

Intersection Observer para lazy loading.

**Arquivo**: `src/hooks/useIntersection.ts`

```tsx
import { useIntersection } from "@/hooks/useIntersection";

function LazyComponent() {
  const { ref, isVisible } = useIntersection({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div ref={ref}>
      {isVisible ? <HeavyComponent /> : <Placeholder />}
    </div>
  );
}
```

---

## Classes CSS Utilitárias

### Animações de Entrada

```css
.entrance-fade      /* Fade in suave */
.entrance-slide-up  /* Slide de baixo para cima */
.entrance-scale     /* Scale com bounce */
```

### Efeitos de Hover

```css
.card-hover         /* Lift + shadow */
.micro-bounce       /* Bounce no hover */
.micro-float        /* Float suave */
.micro-glow         /* Glow effect */
.interactive-scale  /* Scale sutil */
.interactive-lift   /* Lift maior */
```

### Gradientes

```css
.gradient-primary   /* Verde floresta */
.gradient-secondary /* Dourado */
.gradient-forest    /* Verde intenso */
.gradient-earth     /* Tons terrosos */
.gradient-sunset    /* Pôr do sol */
```

### Texto

```css
.text-gradient          /* Texto com gradiente */
.gradient-text-primary  /* Gradiente primário */
.underline-animate      /* Underline animado */
```

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024
