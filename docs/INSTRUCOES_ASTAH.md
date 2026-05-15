# 📐 Instruções para Criar Diagramas no Astah UML

## Formato dos Diagramas para Astah

Os diagramas foram projetados para serem recriados no **Astah UML**. Este documento contém as instruções detalhadas para replicar cada diagrama.

---

## 🎯 Diagrama 1: Casos de Uso

### Configuração Inicial
1. Abra o Astah UML
2. Crie um novo projeto: `File > New > UML Model`
3. Crie um diagrama de casos de uso: `Diagram > Use Case Diagram`

### Elementos do Diagrama

#### Atores
1. **Usuário Produtor** (stick figure - à esquerda)
2. **Sistema Externo** (stick figure - à direita)

#### Sistema
- Nome: "Sistema de Gestão Financeira Agrícola"
- Use a ferramenta de System Boundary (retângulo grande)

#### Pacotes (dentro do sistema)
1. **Gestão de Transações**
2. **Análise Financeira**
3. **Planejamento**
4. **Fluxo de Caixa**

### Casos de Uso por Pacote

#### Pacote: Gestão de Transações
- UC1: Registrar Transação
- UC2: Editar Transação
- UC3: Excluir Transação
- UC4: Consultar Transações
- UC1.1: Validar Dados (extend de UC1)
- UC1.2: Categorizar Automaticamente (extend de UC1)

#### Pacote: Análise Financeira
- UC5: Visualizar Dashboard
- UC6: Gerar Relatórios
- UC7: Analisar Rentabilidade
- UC8: Comparar Culturas
- UC5.1: Calcular Métricas (extend de UC5)
- UC5.2: Aplicar Filtros (extend de UC5)

#### Pacote: Planejamento
- UC9: Criar Orçamento
- UC10: Monitorar Gastos
- UC11: Definir Alertas
- UC12: Exportar Dados
- UC11.1: Notificar Limite (extend de UC11)

#### Pacote: Fluxo de Caixa
- UC13: Projetar Fluxo
- UC14: Analisar Tendências
- UC15: Identificar Riscos

### Relacionamentos

#### Associações (Usuário → Casos de Uso)
Conecte o ator "Usuário Produtor" a todos os casos de uso (UC1 a UC15)

#### Relacionamentos Extend
- UC1 ← UC1.1 (linha tracejada com <<extend>>)
- UC1 ← UC1.2 (linha tracejada com <<extend>>)
- UC5 ← UC5.1 (linha tracejada com <<extend>>)
- UC5 ← UC5.2 (linha tracejada com <<extend>>)
- UC11 ← UC11.1 (linha tracejada com <<extend>>)

#### Relacionamentos Include
- UC6 → UC4 (linha tracejada com <<include>>)
- UC7 → UC4 (linha tracejada com <<include>>)
- UC8 → UC7 (linha tracejada com <<include>>)
- UC10 → UC9 (linha tracejada com <<include>>)
- UC14 → UC13 (linha tracejada com <<include>>)

#### Associações com Sistema Externo
- UC12 → Sistema Externo
- UC11.1 → Sistema Externo

### Notas (Notes)
Adicione 3 notas com as seguintes informações:

**Nota 1** (próxima a UC1):
```
Aplicação do padrão Strategy
para diferentes tipos de
validação e categorização
```

**Nota 2** (próxima a UC5):
```
Padrão Observer para
atualizações em tempo real
das métricas
```

**Nota 3** (próxima a UC11):
```
Padrão Chain of Responsibility
para processamento de alertas
```

---

## 🏗️ Diagrama 2: Classes (SOLID & Design Patterns)

### Configuração Inicial
1. Crie um novo diagrama de classes: `Diagram > Class Diagram`
2. Configure o layout em camadas (top-down)

### Camada 1: Interfaces (topo)

#### ITransactionRepository
```
<<interface>>
ITransactionRepository
-----------------
+create(transaction: Transaction): Promise<Transaction>
+update(id: string, data: Partial<Transaction>): Promise<Transaction>
+delete(id: string): Promise<void>
+findById(id: string): Promise<Transaction>
+findByFilters(filters: TransactionFilters): Promise<Transaction[]>
```

#### ITransactionValidator
```
<<interface>>
ITransactionValidator
-----------------
+validate(transaction: Transaction): ValidationResult
+sanitizeInput(data: any): Transaction
```

#### IFinancialCalculator
```
<<interface>>
IFinancialCalculator
-----------------
+calculateTotal(transactions: Transaction[]): number
+calculateProfit(revenue: number, costs: number): number
+calculateMargin(profit: number, revenue: number): number
+calculateROI(profit: number, investment: number): number
```

#### IReportGenerator
```
<<interface>>
IReportGenerator
-----------------
+generateReport(data: ReportData): Report
+exportToFormat(report: Report, format: ExportFormat): Blob
```

#### ICategoryStrategy
```
<<interface>>
ICategoryStrategy
-----------------
+categorize(transaction: Transaction): string
+getSubcategories(category: string): string[]
```

#### IAlertObserver
```
<<interface>>
IAlertObserver
-----------------
+update(alert: Alert): void
+getAlertLevel(): AlertLevel
```

### Camada 2: Classes Abstratas

#### BaseTransaction
```
<<abstract>>
BaseTransaction
-----------------
#id: string
#userId: string
#farmId: string
#amount: number
#date: Date
#description: string
#createdAt: Date
#updatedAt: Date
-----------------
+{abstract} getType(): TransactionType
+{abstract} validate(): boolean
+getId(): string
+getAmount(): number
+setAmount(amount: number): void
+toJSON(): object
```

#### BaseValidator
```
<<abstract>>
BaseValidator
-----------------
#rules: ValidationRule[]
-----------------
+{abstract} defineRules(): ValidationRule[]
+validate(data: any): ValidationResult
+addRule(rule: ValidationRule): void
#checkRule(rule: ValidationRule, data: any): boolean
```

#### FinancialMetric
```
<<abstract>>
FinancialMetric
-----------------
#name: string
#value: number
#unit: string
-----------------
+{abstract} calculate(data: any): number
+{abstract} format(): string
+getValue(): number
+compare(other: FinancialMetric): number
```

### Camada 3: Classes Concretas - Transações

#### Transaction (herda de BaseTransaction)
```
Transaction
-----------------
-type: TransactionType
-category: string
-subcategory: string
-paymentMethod: string
-referenceNumber: string
-tags: string[]
-status: TransactionStatus
-----------------
+getType(): TransactionType
+validate(): boolean
+setCategory(category: string): void
+addTag(tag: string): void
+updateStatus(status: TransactionStatus): void
```

#### Income (herda de BaseTransaction)
```
Income
-----------------
-source: string
-cropType: string
-----------------
+getType(): TransactionType
+validate(): boolean
+setSource(source: string): void
```

#### Expense (herda de BaseTransaction)
```
Expense
-----------------
-supplier: string
-invoiceNumber: string
-----------------
+getType(): TransactionType
+validate(): boolean
+setSupplier(supplier: string): void
```

### Camada 4: Validadores

#### TransactionValidator (herda de BaseValidator)
```
TransactionValidator
-----------------
-schema: ValidationSchema
-----------------
+defineRules(): ValidationRule[]
+validateAmount(amount: number): boolean
+validateDate(date: Date): boolean
+validateCategory(category: string): boolean
```

#### BudgetValidator (herda de BaseValidator)
```
BudgetValidator
-----------------
+defineRules(): ValidationRule[]
+validatePeriod(start: Date, end: Date): boolean
+validateAlertThreshold(threshold: number): boolean
```

### Camada 5: Strategy Pattern

#### ExpenseCategoryStrategy (implementa ICategoryStrategy)
```
ExpenseCategoryStrategy
-----------------
-categories: Map<string, string[]>
-----------------
+categorize(transaction: Transaction): string
+getSubcategories(category: string): string[]
+addCategory(category: string, subs: string[]): void
```

#### IncomeCategoryStrategy (implementa ICategoryStrategy)
```
IncomeCategoryStrategy
-----------------
-categories: Map<string, string[]>
-----------------
+categorize(transaction: Transaction): string
+getSubcategories(category: string): string[]
+identifySource(transaction: Transaction): string
```

#### AutoCategorizer
```
AutoCategorizer
-----------------
-strategy: ICategoryStrategy
-----------------
+setStrategy(strategy: ICategoryStrategy): void
+categorizeTransaction(transaction: Transaction): void
+learnFromHistory(transactions: Transaction[]): void
```

### Camada 6: Factory Pattern

#### TransactionFactory
```
<<Singleton>>
TransactionFactory
-----------------
-{static} instance: TransactionFactory
-----------------
-constructor()
+{static} getInstance(): TransactionFactory
+createTransaction(type: TransactionType, data: any): BaseTransaction
+createIncome(data: any): Income
+createExpense(data: any): Expense
```

### Camada 7: Services

#### FinancialService
```
FinancialService
-----------------
-repository: ITransactionRepository
-validator: ITransactionValidator
-calculator: IFinancialCalculator
-categorizer: AutoCategorizer
-----------------
+constructor(repo: ITransactionRepository, validator: ITransactionValidator, calculator: IFinancialCalculator)
+addTransaction(data: any): Promise<Transaction>
+updateTransaction(id: string, data: any): Promise<Transaction>
+deleteTransaction(id: string): Promise<void>
+getTransactions(filters: TransactionFilters): Promise<Transaction[]>
+calculateMetrics(filters: TransactionFilters): Promise<FinancialMetrics>
```

#### CalculatorService (implementa IFinancialCalculator)
```
CalculatorService
-----------------
+calculateTotal(transactions: Transaction[]): number
+calculateProfit(revenue: number, costs: number): number
+calculateMargin(profit: number, revenue: number): number
+calculateROI(profit: number, investment: number): number
+calculateGrowth(current: number, previous: number): number
+aggregateByPeriod(transactions: Transaction[], period: Period): Map<string, number>
```

#### ReportService (implementa IReportGenerator)
```
ReportService
-----------------
-calculator: IFinancialCalculator
-formatter: ReportFormatter
-----------------
+generateReport(data: ReportData): Report
+exportToFormat(report: Report, format: ExportFormat): Blob
+scheduleReport(config: ReportConfig): void
```

### Camada 8: Repository

#### SupabaseTransactionRepository (implementa ITransactionRepository)
```
SupabaseTransactionRepository
-----------------
-client: SupabaseClient
-tableName: string
-----------------
+create(transaction: Transaction): Promise<Transaction>
+update(id: string, data: Partial<Transaction>): Promise<Transaction>
+delete(id: string): Promise<void>
+findById(id: string): Promise<Transaction>
+findByFilters(filters: TransactionFilters): Promise<Transaction[]>
-mapToEntity(data: any): Transaction
-mapToDatabase(transaction: Transaction): any
```

### Camada 9: Observer Pattern

#### BudgetMonitor
```
BudgetMonitor
-----------------
-observers: IAlertObserver[]
-budgets: Budget[]
-transactions: Transaction[]
-----------------
+addObserver(observer: IAlertObserver): void
+removeObserver(observer: IAlertObserver): void
+notifyObservers(alert: Alert): void
+checkBudgetLimits(): void
+evaluateSpending(budget: Budget): void
```

#### EmailAlertObserver (implementa IAlertObserver)
```
EmailAlertObserver
-----------------
-emailService: EmailService
-threshold: number
-----------------
+update(alert: Alert): void
+getAlertLevel(): AlertLevel
-sendEmail(alert: Alert): void
```

#### NotificationAlertObserver (implementa IAlertObserver)
```
NotificationAlertObserver
-----------------
-notificationService: NotificationService
-----------------
+update(alert: Alert): void
+getAlertLevel(): AlertLevel
-showNotification(alert: Alert): void
```

### Camada 10: Value Objects

#### Money
```
<<Value Object>>
Money
-----------------
-amount: number
-currency: string
-----------------
+constructor(amount: number, currency: string)
+add(other: Money): Money
+subtract(other: Money): Money
+multiply(factor: number): Money
+equals(other: Money): boolean
+toString(): string
```

#### DateRange
```
<<Value Object>>
DateRange
-----------------
-startDate: Date
-endDate: Date
-----------------
+constructor(start: Date, end: Date)
+contains(date: Date): boolean
+getDays(): number
+equals(other: DateRange): boolean
```

### Camada 11: Decorators

#### CachedTransactionRepository (implementa ITransactionRepository)
```
<<Decorator>>
CachedTransactionRepository
-----------------
-repository: ITransactionRepository
-cache: Cache
-ttl: number
-----------------
+constructor(repository: ITransactionRepository, cache: Cache)
+create(transaction: Transaction): Promise<Transaction>
+findById(id: string): Promise<Transaction>
+findByFilters(filters: TransactionFilters): Promise<Transaction[]>
-invalidateCache(key: string): void
```

#### LoggedTransactionRepository (implementa ITransactionRepository)
```
<<Decorator>>
LoggedTransactionRepository
-----------------
-repository: ITransactionRepository
-logger: Logger
-----------------
+constructor(repository: ITransactionRepository, logger: Logger)
+create(transaction: Transaction): Promise<Transaction>
+update(id: string, data: Partial<Transaction>): Promise<Transaction>
+delete(id: string): Promise<void>
-log(operation: string, data: any): void
```

### Enumerações

#### EquipmentType
```
<<enumeration>>
EquipmentType
-----------------
TRACTOR
HARVESTER
IRRIGATION
DRONE
```

#### Status
```
<<enumeration>>
Status
-----------------
ACTIVE
INACTIVE
MAINTENANCE
ERROR
```

#### TaskStatus
```
<<enumeration>>
TaskStatus
-----------------
PENDING
IN_PROGRESS
COMPLETED
CANCELLED
```

#### Priority
```
<<enumeration>>
Priority
-----------------
LOW
MEDIUM
HIGH
URGENT
```

### Relacionamentos no Astah

#### Implementações (realize - linha tracejada com triângulo vazio)
- SupabaseTransactionRepository --|> ITransactionRepository
- TransactionValidator --|> ITransactionValidator
- CalculatorService --|> IFinancialCalculator
- ReportService --|> IReportGenerator
- ExpenseCategoryStrategy --|> ICategoryStrategy
- IncomeCategoryStrategy --|> ICategoryStrategy
- EmailAlertObserver --|> IAlertObserver
- NotificationAlertObserver --|> IAlertObserver
- CachedTransactionRepository --|> ITransactionRepository
- LoggedTransactionRepository --|> ITransactionRepository

#### Heranças (generalization - linha sólida com triângulo vazio)
- Transaction --|> BaseTransaction
- Income --|> BaseTransaction
- Expense --|> BaseTransaction
- TransactionValidator --|> BaseValidator
- BudgetValidator --|> BaseValidator

#### Composições (filled diamond - rombo cheio)
- FinancialService <>-- ITransactionRepository
- FinancialService <>-- ITransactionValidator
- FinancialService <>-- IFinancialCalculator
- FinancialService <>-- AutoCategorizer
- AutoCategorizer <>-- ICategoryStrategy
- BudgetMonitor <>-- IAlertObserver
- ReportService <>-- IFinancialCalculator

#### Agregações (hollow diamond - rombo vazio)
- BudgetMonitor o-- Transaction
- CachedTransactionRepository o-- ITransactionRepository
- LoggedTransactionRepository o-- ITransactionRepository

#### Dependências (linha tracejada com seta)
- TransactionFactory ..> Transaction
- TransactionFactory ..> Income
- TransactionFactory ..> Expense
- Transaction ..> Money
- Transaction ..> DateRange

### Notas no Diagrama

Adicione estas notas conectadas às classes relevantes:

**Nota 1** (ITransactionRepository):
```
Dependency Inversion Principle:
Dependência de abstrações,
não de implementações concretas
```

**Nota 2** (AutoCategorizer):
```
Strategy Pattern:
Permite trocar algoritmos de
categorização em tempo de execução
```

**Nota 3** (TransactionFactory):
```
Singleton + Factory Pattern:
Centraliza criação de objetos
e garante instância única
```

**Nota 4** (BudgetMonitor):
```
Observer Pattern:
Notifica múltiplos observadores
sobre mudanças de estado
```

**Nota 5** (CachedTransactionRepository):
```
Decorator Pattern:
Adiciona funcionalidade de cache
sem modificar repository original
```

**Nota 6** (BaseTransaction):
```
Liskov Substitution Principle:
Subclasses podem substituir
classe base sem quebrar código
```

---

## 🔄 Diagrama 3: Sequência

### Configuração Inicial
1. Crie um novo diagrama de sequência: `Diagram > Sequence Diagram`
2. Título: "Registro de Transação Financeira"

### Participantes (lifelines) - da esquerda para direita

1. **Usuário** (actor)
2. **UI Component\nTransactionManager** (object)
3. **FinancialService** (object)
4. **TransactionValidator** (object)
5. **AutoCategorizer** (object)
6. **TransactionFactory** (object)
7. **ITransactionRepository** (object)
8. **BudgetMonitor** (object)
9. **IAlertObserver** (object)
10. **Supabase** (database)

### Sequência de Mensagens

#### Frame 1: Fase 1 - Entrada de Dados
```
ref: Entrada de Dados

1. Usuário -> UI: Preenche formulário de transação
   activate UI
2. UI -> UI: handleChange()
   note right: Atualiza estado local com dados do formulário
3. Usuário -> UI: Clica em "Salvar"
4. UI -> UI: handleSubmit()
```

#### Frame 2: Fase 2 - Validação
```
ref: Validação (Single Responsibility)

5. UI -> TransactionValidator: validate(transactionData)
   activate TransactionValidator
6. TransactionValidator -> TransactionValidator: defineRules()
   note right: Strategy Pattern - Define regras específicas para tipo de transação
7. TransactionValidator -> TransactionValidator: checkRule(rule, data)
   loop: Para cada regra
     8. TransactionValidator -> TransactionValidator: validateAmount()
     9. TransactionValidator -> TransactionValidator: validateDate()
     10. TransactionValidator -> TransactionValidator: validateCategory()
   end loop

alt: Validação Falha
  11. TransactionValidator --> UI: ValidationResult(false, errors)
  12. UI -> Usuário: Exibe toast de erro
  deactivate TransactionValidator
  deactivate UI

else: Validação Sucesso
  13. TransactionValidator --> UI: ValidationResult(true)
  deactivate TransactionValidator
```

#### Frame 3: Fase 3 - Processamento
```
ref: Processamento (Factory + Strategy)

14. UI -> FinancialService: addTransaction(transactionData)
    activate FinancialService
15. FinancialService -> AutoCategorizer: categorizeTransaction(data)
    activate AutoCategorizer
16. AutoCategorizer -> AutoCategorizer: getStrategy(type)
    note right: Strategy Pattern - Seleciona estratégia baseada no tipo

alt: Expense
  17. AutoCategorizer -> AutoCategorizer: ExpenseCategoryStrategy
else: Income
  18. AutoCategorizer -> AutoCategorizer: IncomeCategoryStrategy
end alt

19. AutoCategorizer -> AutoCategorizer: categorize()
20. AutoCategorizer --> FinancialService: category, subcategory
    deactivate AutoCategorizer

21. FinancialService -> TransactionFactory: createTransaction(type, enrichedData)
    activate TransactionFactory
22. TransactionFactory -> TransactionFactory: getInstance()
    note right: Singleton Pattern - Garante instância única

alt: Type = "income"
  23. TransactionFactory -> TransactionFactory: createIncome(data)
  create Income
  24. TransactionFactory -> Income: new Income(data)
else: Type = "expense"
  25. TransactionFactory -> TransactionFactory: createExpense(data)
  create Expense
  26. TransactionFactory -> Expense: new Expense(data)
end alt

27. TransactionFactory --> FinancialService: transaction: BaseTransaction
    deactivate TransactionFactory
```

#### Frame 4: Fase 4 - Persistência
```
ref: Persistência (Repository Pattern)

28. FinancialService -> ITransactionRepository: create(transaction)
    activate ITransactionRepository
    note right: Decorator Pattern - Pode ser wrapped com CachedRepository, LoggedRepository
29. ITransactionRepository -> ITransactionRepository: mapToDatabase(transaction)
30. ITransactionRepository -> Supabase: INSERT INTO financial_transactions
    activate Supabase
31. Supabase --> ITransactionRepository: Registro criado
    deactivate Supabase
32. ITransactionRepository -> ITransactionRepository: mapToEntity(dbData)
33. ITransactionRepository --> FinancialService: savedTransaction
    deactivate ITransactionRepository
```

#### Frame 5: Fase 5 - Monitoramento
```
ref: Monitoramento (Observer Pattern)

34. FinancialService -> BudgetMonitor: checkBudgetLimits()
    activate BudgetMonitor
35. BudgetMonitor -> BudgetMonitor: evaluateSpending(budget)

alt: Limite Ultrapassado
  36. BudgetMonitor -> BudgetMonitor: notifyObservers(alert)
  
  loop: Para cada Observer
    37. BudgetMonitor -> IAlertObserver: update(alert)
        activate IAlertObserver
    
    alt: EmailAlertObserver
      38. IAlertObserver -> IAlertObserver: sendEmail(alert)
    else: NotificationAlertObserver
      39. IAlertObserver -> IAlertObserver: showNotification(alert)
    end alt
    
    40. IAlertObserver --> BudgetMonitor: Notificação enviada
        deactivate IAlertObserver
  end loop
end alt

41. BudgetMonitor --> FinancialService: Monitoramento completo
    deactivate BudgetMonitor
```

#### Frame 6: Fase 6 - Atualização da Interface
```
ref: Atualização da Interface

42. FinancialService --> UI: savedTransaction
    deactivate FinancialService
43. UI -> UI: resetForm()
44. UI -> UI: invalidateQueries()
    note right: Atualiza cache do React Query para refletir nova transação
45. UI -> Usuário: Toast de sucesso
46. UI -> UI: Re-renderiza lista
    deactivate UI
```

#### Frame Alternativo: Erro de Conexão
```
ref: Fluxo Alternativo - Erro de Conexão

alt: Erro de Rede
  Supabase --> ITransactionRepository: Erro de conexão
  ITransactionRepository --> FinancialService: Error
  FinancialService --> UI: Error
  UI -> Usuário: Toast: "Erro ao salvar. Verifique sua conexão"
end alt
```

---

## 💡 Dicas para o Astah

### Layout e Organização
1. Use **Auto Layout** para organizar automaticamente: `Diagram > Auto Layout`
2. Agrupe elementos relacionados
3. Use cores para destacar patterns:
   - Interfaces: azul claro
   - Classes abstratas: amarelo claro
   - Patterns: verde claro

### Estereótipos
- Para adicionar <<interface>>: Propriedades da classe > Stereotype > "interface"
- Para <<abstract>>: Marcar checkbox "Abstract" nas propriedades
- Para <<Singleton>>, <<Decorator>>: Adicionar como stereotype customizado

### Notas
- Use a ferramenta "Note" para adicionar comentários
- Conecte notes às classes com "Anchor"
- Use cores diferentes para destacar diferentes tipos de informação

### Exportação
1. `File > Export Image`
2. Escolha PNG em alta resolução (300 DPI)
3. Exporte cada diagrama separadamente

---

## 📦 Arquivos de Referência

- `financial-use-cases.puml` - Código PlantUML de referência
- `financial-class-diagram.puml` - Código PlantUML de referência
- `financial-sequence-diagram.puml` - Código PlantUML de referência
- `images/*.png` - Imagens de referência visual

Use estes arquivos como guia durante a criação no Astah.
