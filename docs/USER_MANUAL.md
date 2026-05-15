# 📖 Manual do Usuário - Sistema ARGOM

## 🌾 Bem-vindo ao seu Dashboard Agrícola

Este manual irá guiá-lo através de todas as funcionalidades do Sistema de Gestão Inteligente de Propriedades Rurais ARGOM. O sistema foi desenvolvido para centralizar todas as informações importantes da sua fazenda em uma interface moderna e intuitiva.

---

## 📋 Índice

1. [Primeiros Passos](#primeiros-passos)
2. [Navegação Principal](#navegação-principal)
3. [Dashboard Principal](#dashboard-principal)
4. [Monitoramento Meteorológico](#monitoramento-meteorológico)
5. [Gestão de Estoque](#gestão-de-estoque)
6. [Gerenciamento de Tarefas](#gerenciamento-de-tarefas)
7. [Análises Financeiras](#análises-financeiras)
8. [Assistente de IA](#assistente-de-ia)
9. [Perfil e Configurações](#perfil-e-configurações)
10. [Dicas e Truques](#dicas-e-truques)
11. [Solução de Problemas](#solução-de-problemas)

---

## 🚀 1. Primeiros Passos

### Acessando o Sistema

1. Abra seu navegador web (Chrome, Firefox, Safari ou Edge)
2. Digite o endereço: **https://yewgfoxm-sparkle.lovable.app**
3. Faça login com seu email e senha

### Criando uma Conta

1. Na tela de login, clique em **"Criar conta"**
2. Preencha seus dados:
   - Nome completo
   - Email
   - Senha (mínimo 8 caracteres, com letra maiúscula e número)
3. Clique em **"Registrar"**
4. Verifique seu email para confirmar a conta

### Interface Principal

O sistema é composto por:

```
┌─────────────────────────────────────────────────────────────┐
│  🔲 Logo    Navegação                    🔔 👤 ⚙️           │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│  Menu    │            Área de Conteúdo                      │
│  Lateral │                                                   │
│          │     Cards, Gráficos, Tabelas                     │
│  📊 📋   │                                                   │
│  💰 🚜   │                                                   │
│          │                                                   │
└──────────┴──────────────────────────────────────────────────┘
```

- **Barra superior**: Logo, navegação e ações do usuário
- **Menu lateral**: Navegação entre módulos
- **Área central**: Conteúdo da página atual

### Responsividade

O sistema funciona perfeitamente em:
- 💻 **Desktop**: Experiência completa com todas as funcionalidades
- 📱 **Tablet**: Layout adaptado, menu colapsável
- 📱 **Smartphone**: Interface otimizada para toque

---

## 🧭 2. Navegação Principal

### Menu Lateral

| Ícone | Seção | Descrição |
|-------|-------|-----------|
| 🏠 | Dashboard | Visão geral da propriedade |
| 📊 | Monitoramento | Dados ambientais e sensores |
| 💰 | Financeiro | Receitas, despesas e relatórios |
| 🚜 | Equipamentos | Status e manutenções |
| 🌱 | Culturas/Campos | Áreas de plantio |
| ✅ | Tarefas | Gerenciador de atividades |
| 🤖 | IA & Insights | Assistente inteligente |
| 👤 | Perfil | Suas informações |

### Navegação Rápida

- **Clique no logo**: Volta ao Dashboard
- **Menu hamburguer** (📱): Abre/fecha menu em mobile
- **Breadcrumbs**: Mostra onde você está

### Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + /` | Busca rápida |
| `Ctrl + H` | Ir para Dashboard |
| `Ctrl + N` | Nova tarefa |
| `Esc` | Fechar modais |

---

## 🏠 3. Dashboard Principal

### Visão Geral

O dashboard oferece uma visão completa da sua propriedade:

```
┌─────────────────────────────────────────────────────────────┐
│                    MÉTRICAS PRINCIPAIS                       │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ 🌡️ 28°C      │ 💧 65%       │ 💰 R$ 67.000 │ ⚠️ 3 Alertas  │
│ Temperatura  │ Umidade Solo │ Receita Mês  │ Ativos        │
│ +2°C ↗️      │ Ideal ✓      │ +12% ↗️      │ 2 críticos    │
└──────────────┴──────────────┴──────────────┴───────────────┘

┌─────────────────────────┐ ┌─────────────────────────────────┐
│     GRÁFICO AMBIENTAL   │ │      GRÁFICO FINANCEIRO         │
│                         │ │                                  │
│   📈 Temp/Umidade      │ │   📊 Receitas vs Despesas       │
│                         │ │                                  │
└─────────────────────────┘ └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🌤️ CLIMA  │  📦 ESTOQUE  │  ✅ TAREFAS                    │
│            │              │                                  │
└─────────────────────────────────────────────────────────────┘
```

### Cards de Métricas

Cada card mostra:
- **Valor principal**: Dado atual
- **Ícone**: Identificação visual
- **Tendência**: Comparação com período anterior (↗️ subiu, ↘️ desceu)
- **Cor de fundo**: Status (verde = bom, amarelo = atenção, vermelho = crítico)

### Interpretando as Métricas

**🌡️ Temperatura**
| Faixa | Status | Cor |
|-------|--------|-----|
| 18-30°C | Ideal | 🟢 Verde |
| 30-35°C ou 10-18°C | Atenção | 🟡 Amarelo |
| >35°C ou <10°C | Crítico | 🔴 Vermelho |

**💧 Umidade do Solo**
| Faixa | Status | Cor |
|-------|--------|-----|
| 40-70% | Ideal | 🟢 Verde |
| 20-40% | Irrigar | 🟡 Amarelo |
| <20% ou >80% | Crítico | 🔴 Vermelho |

### Ações Rápidas

Na parte inferior do dashboard:
- ➕ **Nova Tarefa**: Criar atividade
- 📊 **Gerar Relatório**: Exportar dados
- 💧 **Irrigação**: Controlar sistema
- 🚨 **Ver Alertas**: Notificações importantes

---

## 🌤️ 4. Monitoramento Meteorológico

### Widget Meteorológico

O widget mostra informações completas do clima:

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Alerta: Possibilidade de chuva às 15h                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│     ☀️ 28°C                    📍 Fazenda Santa Maria       │
│     Ensolarado                 Atualizado há 5 min          │
│     Sensação: 30°C                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  💧 65%     🌬️ 12 km/h NE     📊 1013 hPa     👁️ 10 km    │
│  Umidade    Vento              Pressão         Visibilidade │
├─────────────────────────────────────────────────────────────┤
│  PREVISÃO HORÁRIA                                           │
│  ┌────┬────┬────┬────┬────┬────┐                           │
│  │12h │13h │14h │15h │16h │17h │                           │
│  │☀️  │☀️  │⛅ │🌧️ │🌧️ │⛅ │                           │
│  │28° │29° │27° │24° │23° │25° │                           │
│  └────┴────┴────┴────┴────┴────┘                           │
├─────────────────────────────────────────────────────────────┤
│  ☀️ Índice UV: 7 (Alto) - Use proteção!                     │
└─────────────────────────────────────────────────────────────┘
```

### Alertas Meteorológicos

| Nível | Cor | Exemplos |
|-------|-----|----------|
| 🔵 Informativo | Azul | Previsão de chuva, mudança de temperatura |
| 🟡 Atenção | Amarelo | Ventos fortes, temperatura extrema |
| 🔴 Crítico | Vermelho | Tempestades, granizo, geada |

### Usando as Informações

**Para Irrigação:**
- Umidade < 40% → Programar irrigação
- Chuva prevista → Cancelar irrigação
- Vento forte → Evitar aspersão

**Para Proteção:**
- Geada prevista → Ativar proteção térmica
- UV alto → Proteger mudas
- Granizo → Cobrir estufas

---

## 📦 5. Gestão de Estoque

### Visão do Inventário

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Buscar produtos...                    [+ Nova Entrada]  │
├─────────────────────────────────────────────────────────────┤
│  Produto      │ Categoria    │ Estoque │ Mínimo │ Status   │
├───────────────┼──────────────┼─────────┼────────┼──────────┤
│  Ureia        │ Fertilizante │ 500 kg  │ 100 kg │ 🟢 Normal│
│  Semente Soja │ Sementes     │ 80 kg   │ 100 kg │ 🟡 Baixo │
│  Glifosato    │ Defensivos   │ 10 L    │ 50 L   │ 🔴 Crítico│
│  Diesel       │ Combustível  │ 800 L   │ 200 L  │ 🟢 Normal│
└─────────────────────────────────────────────────────────────┘
```

### Categorias de Produtos

| Ícone | Categoria |
|-------|-----------|
| 🌱 | Sementes |
| 🧪 | Fertilizantes |
| 🛡️ | Defensivos |
| ⛽ | Combustíveis |
| 🔧 | Ferramentas |
| 🚜 | Peças |

### Registrando Movimentações

**Entrada de Produtos:**
1. Clique em **"+ Nova Entrada"**
2. Selecione o produto
3. Informe a quantidade
4. Adicione observações (opcional)
5. Clique em **"Salvar"**

**Saída de Produtos:**
1. Clique no produto desejado
2. Selecione **"Registrar Saída"**
3. Informe quantidade e destino
4. Confirme a operação

### Status dos Produtos

| Status | Significado | Ação |
|--------|-------------|------|
| 🟢 Normal | Estoque adequado | Nenhuma |
| 🟡 Baixo | Próximo ao mínimo | Programar compra |
| 🔴 Crítico | Abaixo do mínimo | Comprar urgente |
| ⚫ Esgotado | Sem estoque | Ação imediata |

---

## ✅ 6. Gerenciamento de Tarefas

### Interface do TaskManager

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ Tarefas                              [+ Adicionar]      │
├─────────────────────────────────────────────────────────────┤
│  Filtros: [Todas ▼] [Prioridade ▼] [Responsável ▼]         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🔴 ALTA PRIORIDADE                                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ☐ Irrigar Setor A                      📅 Hoje         ││
│  │    ├─ ☑ Verificar bomba                                 ││
│  │    ├─ ☐ Ligar sistema                                   ││
│  │    └─ ☐ Verificar cobertura                             ││
│  │    Progresso: ████░░░░░░ 33%                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  🟡 MÉDIA PRIORIDADE                                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ☑ Manutenção do Trator                  📅 Concluída   ││
│  │    Progresso: ██████████ 100%                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Criando uma Tarefa

1. Clique em **"+ Adicionar"**
2. Preencha os campos:
   - **Título**: Nome da tarefa
   - **Descrição**: Detalhes (opcional)
   - **Prioridade**: Alta, Média ou Baixa
   - **Data limite**: Quando deve ser concluída
   - **Responsável**: Quem executará
3. Clique em **"Salvar"**

### Adicionando Subtarefas

1. Clique na tarefa principal
2. Clique em **"+ Subtarefa"**
3. Digite o nome da subtarefa
4. Pressione Enter

### Progresso Automático

- O progresso da tarefa é calculado automaticamente
- Baseado nas subtarefas concluídas
- 2 de 4 subtarefas = 50% de progresso

### Prioridades

| Prioridade | Cor | Quando Usar |
|------------|-----|-------------|
| 🔴 Alta | Vermelho | Urgente, impacto imediato |
| 🟡 Média | Amarelo | Importante, pode aguardar |
| 🟢 Baixa | Verde | Quando possível |

---

## 💰 7. Análises Financeiras

### Dashboard Financeiro

```
┌─────────────────────────────────────────────────────────────┐
│  💰 VISÃO FINANCEIRA - Janeiro 2025                         │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ 💵 Receita   │ 📈 Lucro     │ 💸 Despesas  │ 📊 Margem     │
│ R$ 67.000    │ R$ 23.450    │ R$ 43.550    │ 34.9%         │
│ +12% ↗️      │ +8% ↗️       │ +5% ↗️       │ +2.1% ↗️      │
└──────────────┴──────────────┴──────────────┴───────────────┘
```

### Registrando Transações

1. Clique em **"+ Nova Transação"**
2. Selecione o tipo:
   - **Receita**: Vendas, serviços
   - **Despesa**: Compras, custos
3. Preencha os dados:
   - Valor
   - Categoria
   - Data
   - Descrição
4. Clique em **"Salvar"**

### Categorias Financeiras

**Receitas:**
- Venda de grãos
- Venda de gado
- Arrendamento
- Serviços

**Despesas:**
- Insumos
- Mão de obra
- Combustível
- Manutenção
- Impostos

### Relatórios Disponíveis

| Relatório | Descrição |
|-----------|-----------|
| Mensal | Receitas x Despesas do mês |
| Por Categoria | Detalhamento por tipo |
| Comparativo | Mês atual vs anterior |
| Anual | Visão do ano completo |

### Exportando Dados

1. Clique em **"Exportar"**
2. Escolha o formato:
   - 📄 PDF (visualização)
   - 📊 Excel (análise)
   - 📑 CSV (dados brutos)
3. Selecione o período
4. Clique em **"Baixar"**

---

## 🤖 8. Assistente de IA

### Chat Inteligente

O assistente de IA pode ajudar com:
- Dúvidas sobre o sistema
- Análises de dados
- Recomendações agrícolas
- Planejamento de atividades

### Como Usar

1. Clique no ícone de 🤖 IA
2. Digite sua pergunta
3. Aguarde a resposta

### Exemplos de Perguntas

```
💬 "Como está a previsão do tempo para esta semana?"
🤖 "A previsão indica tempo seco até quinta-feira, com 
    possibilidade de chuvas no fim de semana. 
    Recomendo programar pulverizações para quarta."

💬 "Qual cultura teve melhor rentabilidade este ano?"
🤖 "Analisando seus dados, a soja apresentou ROI de 35%,
    seguida do milho com 28%. A soja também teve menor
    custo por hectare."

💬 "Quando devo fazer a próxima adubação?"
🤖 "Baseado no ciclo da cultura e última aplicação,
    recomendo adubar o Setor B na próxima semana.
    O estoque de ureia está adequado."
```

---

## 👤 9. Perfil e Configurações

### Acessando seu Perfil

1. Clique no ícone do usuário (👤) no canto superior direito
2. Selecione **"Perfil"**

### Informações Editáveis

- Nome completo
- Foto de perfil
- Email
- Empresa/Fazenda
- Telefone

### Configurações do Sistema

**Aparência:**
- 🌞 Modo Claro
- 🌙 Modo Escuro
- 🔄 Automático (segue o sistema)

**Notificações:**
- Alertas de estoque
- Tarefas vencendo
- Alertas meteorológicos
- Resumo diário

**Privacidade:**
- Alterar senha
- Sessões ativas
- Histórico de acesso

---

## 💡 10. Dicas e Truques

### Produtividade

1. **Favoritos**: Marque métricas importantes para acesso rápido
2. **Filtros salvos**: Salve combinações de filtros que usa frequentemente
3. **Modo escuro**: Use à noite para reduzir cansaço visual
4. **Atalhos**: Aprenda os atalhos de teclado principais

### Organização

1. **Nomeie bem as tarefas**: Use verbos de ação (Irrigar, Colher, Verificar)
2. **Use subtarefas**: Quebre tarefas grandes em partes menores
3. **Categorize transações**: Facilita análises futuras
4. **Mantenha estoque atualizado**: Registre movimentações no momento

### Análises

1. **Compare períodos**: Use gráficos comparativos
2. **Exporte regularmente**: Mantenha backup dos dados
3. **Consulte a IA**: Peça insights sobre seus dados
4. **Revise alertas**: Não ignore notificações críticas

---

## 🛠️ 11. Solução de Problemas

### Problemas Comuns

#### Sistema Lento
**Causas possíveis:**
- Conexão de internet instável
- Muitas abas abertas
- Cache cheio

**Soluções:**
1. Verifique sua conexão
2. Feche abas desnecessárias
3. Limpe o cache: `Ctrl+Shift+Del`

#### Dados Não Atualizando
**Verificações:**
1. Verifique a conexão
2. Olhe o horário da última atualização
3. Clique no botão 🔄 Atualizar

#### Gráficos Não Carregando
**Soluções:**
1. Verifique se JavaScript está habilitado
2. Desative bloqueador de anúncios
3. Atualize o navegador

#### Erro ao Salvar
**Verificações:**
1. Todos os campos obrigatórios preenchidos?
2. Dados no formato correto?
3. Conexão ativa?

### Navegadores Suportados

| Navegador | Versão Mínima |
|-----------|---------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Requisitos de Tela

| Dispositivo | Resolução Mínima |
|-------------|------------------|
| Desktop | 1024x768 |
| Tablet | 768x1024 |
| Mobile | 375x667 |

### Contato para Suporte

| Canal | Contato | Horário |
|-------|---------|---------|
| 📧 Email | suporte@argom.com.br | 24h |
| 💬 Chat | No sistema | 8h-18h |
| 📞 Telefone | (11) 9999-9999 | 8h-18h |

---

## 📚 Recursos Adicionais

### Documentação

- [Documentação Técnica](./TECHNICAL_DOCUMENTATION.md)
- [Documentação de API](./API_DOCUMENTATION.md)
- [Guia de Segurança](./SECURITY_DOCUMENTATION.md)

### Vídeos Tutoriais

- 🎬 Primeiros Passos (5 min)
- 🎬 Gerenciando Tarefas (8 min)
- 🎬 Controle Financeiro (10 min)
- 🎬 Usando o Assistente IA (6 min)

### Atualizações

O sistema é atualizado regularmente com:
- Novas funcionalidades
- Correções de bugs
- Melhorias de performance

---

## 📝 Glossário

| Termo | Definição |
|-------|-----------|
| Dashboard | Painel de controle com visão geral |
| Widget | Mini-aplicativo com função específica |
| RLS | Row Level Security - proteção de dados por linha |
| Subtarefa | Tarefa menor dentro de uma tarefa principal |
| Trend | Indicador de tendência (subindo/descendo) |
| Toast | Notificação temporária na tela |
| Trigger | Função automática do banco de dados |
| Edge Function | Função serverless executada na nuvem |
| JWT | JSON Web Token - token de autenticação |
| Commodity | Produto agrícola cotado no mercado |
| Severidade | Nível de gravidade de um alerta |

---

## 🚜 12. Equipamentos

### Gestão de Equipamentos

O módulo permite controlar todo o maquinário da propriedade:

- **Cadastro**: Nome, modelo, fabricante, número de série
- **Status**: Ativo, em manutenção, offline ou aposentado
- **Manutenção**: Última e próxima manutenção agendada
- **Horas de uso**: Controle de desgaste

---

## 🌱 13. Campos de Cultivo

### Gestão de Culturas

Acompanhe o ciclo completo de produção:

1. **Planejado** → Campo registrado
2. **Plantado** → Sementes/mudas inseridas
3. **Crescimento** → Desenvolvimento vegetativo
4. **Floração** → Período de florescimento
5. **Frutificação** → Formação de frutos/grãos
6. **Colheita** → Colheita realizada
7. **Pós-colheita** → Análise de rendimento

**Informações rastreadas:**
- Tipo de cultura e área (hectares)
- Rendimento esperado vs. realizado (kg)
- Tipo de solo e irrigação
- Datas de plantio e colheita

---

## 🔔 14. Alertas

### Sistema de Alertas Inteligentes

Receba notificações por tipo e severidade:

| Tipo | Exemplos |
|------|----------|
| 🌤️ Clima | Geada, tempestade, seca |
| 📡 Sensor | Leitura anormal, sensor offline |
| 🔧 Manutenção | Equipamento próximo de revisão |
| 💰 Financeiro | Orçamento próximo do limite |

| Severidade | Ação |
|------------|------|
| 🔵 Baixa | Informativo |
| 🟡 Média | Atenção recomendada |
| 🟠 Alta | Ação necessária |
| 🔴 Crítica | Ação imediata |

---

<div align="center">

**📖 Manual do Usuário ARGOM**

Versão 3.1 | Março 2026

[⬆ Voltar ao topo](#-manual-do-usuário---sistema-argom)

</div>
