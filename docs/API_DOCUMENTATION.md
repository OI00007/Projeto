# Documentação de API - Sistema ARGOM

## Visão Geral

Esta documentação descreve todas as APIs disponíveis no Sistema ARGOM, incluindo endpoints do Supabase e Edge Functions.

---

## 📋 Índice

1. [Autenticação](#autenticação)
2. [Base URLs](#base-urls)
3. [Edge Functions](#edge-functions)
4. [Database API](#database-api)
5. [Real-time Subscriptions](#real-time-subscriptions)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Rate Limits](#rate-limits)
8. [Exemplos de Código](#exemplos-de-código)

---

## 🔐 Autenticação

Todas as requisições autenticadas devem incluir o header:

```http
Authorization: Bearer {access_token}
```

### Obtendo Token

```typescript
import { supabase } from '@/integrations/supabase/client';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'senha123'
});

// Token de acesso
const accessToken = data.session?.access_token;
```

### Refresh Token

O token é renovado automaticamente pelo cliente Supabase. Para renovação manual:

```typescript
const { data, error } = await supabase.auth.refreshSession();
```

---

## 🌐 Base URLs

| Ambiente | URL |
|----------|-----|
| API Supabase | `https://{project-id}.supabase.co` |
| Edge Functions | `https://{project-id}.supabase.co/functions/v1` |
| Auth | `https://{project-id}.supabase.co/auth/v1` |

---

## ⚡ Edge Functions

### 1. AI Chat - Assistente Inteligente

Endpoint para interação com o assistente de IA da fazenda.

**Endpoint**: `POST /functions/v1/ai-chat`

**Autenticação**: Requerida (JWT)

#### Request

```typescript
interface AIChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    farmName?: string;
    currentPage?: string;
    additionalInfo?: Record<string, unknown>;
  };
}
```

**Exemplo**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Como posso melhorar a produtividade da minha lavoura de soja?"
    }
  ],
  "context": {
    "farmName": "Fazenda Santa Maria",
    "currentPage": "dashboard"
  }
}
```

#### Response

Streaming SSE (Server-Sent Events):

```
data: {"choices":[{"delta":{"content":"Para melhorar"}}]}
data: {"choices":[{"delta":{"content":" a produtividade"}}]}
data: {"choices":[{"delta":{"content":"..."}}]}
data: [DONE]
```

#### Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso (streaming) |
| 401 | Não autorizado |
| 402 | Créditos insuficientes |
| 429 | Rate limit excedido |
| 500 | Erro interno |

#### Exemplo de Uso

```typescript
const response = await fetch('/functions/v1/ai-chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Qual a previsão do tempo?' }]
  })
});

const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = new TextDecoder().decode(value);
  console.log(text);
}
```

---

### 2. Weather - Dados Meteorológicos

Obtém dados climáticos e previsões.

**Endpoint**: `GET /functions/v1/weather`

**Autenticação**: Opcional

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `lat` | number | Sim | Latitude |
| `lon` | number | Sim | Longitude |
| `units` | string | Não | `metric` (padrão) ou `imperial` |

#### Response

```typescript
interface WeatherResponse {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    uvIndex: number;
    visibility: number;
    description: string;
    icon: string;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    precipitation: number;
    icon: string;
  }>;
  daily: Array<{
    date: string;
    high: number;
    low: number;
    precipitation: number;
    description: string;
  }>;
  alerts: Array<{
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    validUntil: string;
  }>;
}
```

#### Exemplo

```bash
GET /functions/v1/weather?lat=-23.5505&lon=-46.6333&units=metric
```

```json
{
  "current": {
    "temperature": 28,
    "feelsLike": 30,
    "humidity": 65,
    "windSpeed": 12,
    "description": "Ensolarado",
    "icon": "sun"
  },
  "hourly": [
    { "time": "12:00", "temperature": 28, "precipitation": 0 },
    { "time": "13:00", "temperature": 29, "precipitation": 0 }
  ],
  "alerts": []
}
```

---

### 3. Financial Insights - Análises Financeiras

Gera insights financeiros com IA.

**Endpoint**: `POST /functions/v1/financial-insights`

**Autenticação**: Requerida

#### Request

```typescript
interface FinancialInsightsRequest {
  type: 'summary' | 'forecast' | 'recommendations' | 'analysis';
  period?: {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
  };
  categories?: string[];
  farmId?: string;
}
```

#### Response

```typescript
interface FinancialInsightsResponse {
  insights: Array<{
    type: string;
    title: string;
    description: string;
    value?: number;
    trend?: 'up' | 'down' | 'stable';
    priority: 'high' | 'medium' | 'low';
  }>;
  recommendations: string[];
  metrics: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
  };
  generatedAt: string;
}
```

---

## 🗃️ Database API

### Farms (Propriedades)

#### Listar Propriedades

```typescript
const { data, error } = await supabase
  .from('farms')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Criar Propriedade

```typescript
const { data, error } = await supabase
  .from('farms')
  .insert({
    name: 'Fazenda Nova',
    description: 'Descrição da fazenda',
    location: 'São Paulo, SP',
    size_hectares: 500,
    user_id: userId
  })
  .select()
  .single();
```

#### Atualizar Propriedade

```typescript
const { data, error } = await supabase
  .from('farms')
  .update({ name: 'Novo Nome' })
  .eq('id', farmId)
  .select()
  .single();
```

#### Deletar Propriedade

```typescript
const { error } = await supabase
  .from('farms')
  .delete()
  .eq('id', farmId);
```

---

### Tasks (Tarefas)

#### Schema

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed_at?: string;
  category?: string;
  assigned_to?: string;
  farm_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

#### Listar Tarefas

```typescript
const { data, error } = await supabase
  .from('tasks')
  .select(`
    *,
    farm:farms(name)
  `)
  .eq('user_id', userId)
  .order('due_date', { ascending: true });
```

#### Filtrar por Status

```typescript
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('status', 'pending')
  .gte('due_date', new Date().toISOString());
```

#### Criar Tarefa

```typescript
const { data, error } = await supabase
  .from('tasks')
  .insert({
    title: 'Irrigar Setor A',
    description: 'Verificar sistema de irrigação',
    priority: 'high',
    status: 'pending',
    due_date: '2025-01-25',
    category: 'irrigacao',
    farm_id: farmId,
    user_id: userId
  })
  .select()
  .single();
```

#### Marcar como Concluída

```typescript
const { data, error } = await supabase
  .from('tasks')
  .update({
    status: 'completed',
    completed_at: new Date().toISOString()
  })
  .eq('id', taskId)
  .select()
  .single();
```

---

### Financial Transactions (Transações)

#### Schema

```typescript
interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  transaction_date: string;
  payment_method?: string;
  reference_number?: string;
  status: 'pending' | 'completed' | 'cancelled';
  tags?: string[];
  farm_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

#### Listar Transações

```typescript
const { data, error } = await supabase
  .from('financial_transactions')
  .select('*')
  .eq('user_id', userId)
  .order('transaction_date', { ascending: false })
  .limit(50);
```

#### Filtrar por Período

```typescript
const { data, error } = await supabase
  .from('financial_transactions')
  .select('*')
  .gte('transaction_date', '2025-01-01')
  .lte('transaction_date', '2025-01-31');
```

#### Somar por Tipo

```typescript
const { data, error } = await supabase
  .from('financial_transactions')
  .select('type, amount')
  .eq('user_id', userId);

const totals = data?.reduce((acc, t) => {
  acc[t.type] = (acc[t.type] || 0) + t.amount;
  return acc;
}, {} as Record<string, number>);

// { income: 50000, expense: 30000 }
```

#### Criar Transação

```typescript
const { data, error } = await supabase
  .from('financial_transactions')
  .insert({
    type: 'income',
    amount: 15000,
    category: 'vendas',
    subcategory: 'soja',
    description: 'Venda de soja - Lote 123',
    transaction_date: '2025-01-20',
    payment_method: 'transferencia',
    status: 'completed',
    tags: ['soja', 'safra-2025'],
    user_id: userId
  })
  .select()
  .single();
```

---

### Sensors (Sensores)

#### Listar Sensores de uma Fazenda

```typescript
const { data, error } = await supabase
  .from('sensors')
  .select('*')
  .eq('farm_id', farmId)
  .order('last_reading', { ascending: false });
```

#### Atualizar Leitura

```typescript
const { data, error } = await supabase
  .from('sensors')
  .update({
    value: 28.5,
    last_reading: new Date().toISOString()
  })
  .eq('id', sensorId)
  .select()
  .single();
```

---

### Budgets (Orçamentos)

#### Listar Orçamentos Ativos

```typescript
const { data, error } = await supabase
  .from('budgets')
  .select('*')
  .eq('user_id', userId)
  .lte('start_date', new Date().toISOString())
  .gte('end_date', new Date().toISOString());
```

#### Criar Orçamento

```typescript
const { data, error } = await supabase
  .from('budgets')
  .insert({
    category: 'insumos',
    amount: 50000,
    period: 'monthly',
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    alert_threshold: 80,
    user_id: userId
  })
  .select()
  .single();
```

---

### Profiles (Perfis)

#### Obter Perfil

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();
```

#### Atualizar Perfil

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'João Silva',
    company: 'Fazenda Santa Maria',
    avatar_url: 'https://...'
  })
  .eq('user_id', userId)
  .select()
  .single();
```

---

## 📡 Real-time Subscriptions

### Escutar Mudanças em Sensores

```typescript
const channel = supabase
  .channel('sensors-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'sensors',
      filter: `farm_id=eq.${farmId}`
    },
    (payload) => {
      console.log('Sensor atualizado:', payload.new);
      // Atualizar UI
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

### Escutar Novas Tarefas

```typescript
const channel = supabase
  .channel('new-tasks')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'tasks',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      toast.success('Nova tarefa criada!');
    }
  )
  .subscribe();
```

### Escutar Transações

```typescript
const channel = supabase
  .channel('transactions')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'financial_transactions'
    },
    (payload) => {
      if (payload.eventType === 'INSERT') {
        // Nova transação
      } else if (payload.eventType === 'UPDATE') {
        // Transação atualizada
      } else if (payload.eventType === 'DELETE') {
        // Transação removida
      }
    }
  )
  .subscribe();
```

---

## ⚠️ Tratamento de Erros

### Estrutura de Erro

```typescript
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
```

### Códigos Comuns

| Código | Descrição | Solução |
|--------|-----------|---------|
| `PGRST301` | Row not found | Verifique o ID |
| `23505` | Unique violation | Dado já existe |
| `42501` | Permission denied | Verifique RLS |
| `23503` | Foreign key violation | Referência inválida |
| `22P02` | Invalid input syntax | Formato incorreto |

### Tratamento Padrão

```typescript
const fetchData = async () => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
    
    if (error) {
      console.error('Database error:', error);
      
      switch (error.code) {
        case '42501':
          toast.error('Você não tem permissão para esta ação');
          break;
        case 'PGRST301':
          toast.error('Registro não encontrado');
          break;
        default:
          toast.error('Ocorreu um erro. Tente novamente.');
      }
      return null;
    }
    
    return data;
  } catch (err) {
    toast.error('Erro de conexão');
    return null;
  }
};
```

---

## 🚦 Rate Limits

| Recurso | Limite |
|---------|--------|
| API Requests | 1000/min |
| Auth Requests | 30/min |
| Edge Functions | 100/min |
| Realtime Connections | 200 simultâneas |
| File Uploads | 50MB/arquivo |

### Implementando Rate Limiting

```typescript
import { RateLimiter } from '@/lib/security';

const limiter = new RateLimiter(30, 60000); // 30 req/min

const makeRequest = async () => {
  if (!limiter.canMakeRequest()) {
    toast.error('Muitas requisições. Aguarde um momento.');
    return;
  }
  
  // Fazer requisição
};
```

---

## 💻 Exemplos de Código

### Hook Personalizado para Tarefas

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTasks = (farmId?: string) => {
  const queryClient = useQueryClient();

  const tasks = useQuery({
    queryKey: ['tasks', farmId],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (farmId) {
        query = query.eq('farm_id', farmId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const createTask = useMutation({
    mutationFn: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar tarefa');
    }
  });

  return { tasks, createTask };
};
```

### Componente com Real-time

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const LiveSensorData = ({ sensorId }: { sensorId: string }) => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    // Buscar valor inicial
    const fetchInitial = async () => {
      const { data } = await supabase
        .from('sensors')
        .select('value')
        .eq('id', sensorId)
        .single();
      
      if (data) setValue(data.value);
    };
    
    fetchInitial();

    // Escutar atualizações
    const channel = supabase
      .channel(`sensor-${sensorId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sensors',
          filter: `id=eq.${sensorId}`
        },
        (payload) => {
          setValue(payload.new.value);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sensorId]);

  return <div>Valor atual: {value ?? 'Carregando...'}</div>;
};
```

---

## 📚 SDK / Cliente

### Inicialização

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### Tipos Gerados

Os tipos do banco de dados são gerados automaticamente em:
```
src/integrations/supabase/types.ts
```

Use-os para type-safety:

```typescript
import type { Tables } from '@/integrations/supabase/types';

type Task = Tables<'tasks'>;
type Farm = Tables<'farms'>;
```

---

*Última atualização: Janeiro 2025*
