# 🏗️ Arquitetura do Projeto

## Visão Geral

O Painel de Produtividade segue uma arquitetura **cliente-servidor** com separação clara de responsabilidades.

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Pages (Login, Dashboard, Demandas, etc)        │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Components (Sidebar, Navbar, Cards, etc)       │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Context (Auth) + Hooks + Utils                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕ (Axios)
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Routes (/auth, /demandas, /admin, etc)         │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Middleware (Auth, CORS)                        │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Controllers & Business Logic                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Database Layer (SQLite)                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           ↕
            ┌───────────────────────────┐
            │   SQLite Database        │
            │  (database.db)           │
            └───────────────────────────┘
```

## Fluxo de Autenticação

```
1. Usuário preenche login
   ↓
2. Frontend envia POST /api/auth/login com email + senha
   ↓
3. Backend valida credenciais
   ↓
4. Backend gera JWT token
   ↓
5. Frontend armazena token em memory + localStorage
   ↓
6. Todas próximas requisições incluem Authorization: Bearer <token>
   ↓
7. Backend valida token antes de processar requisição
   ↓
8. Se tudo OK → resposta com dados
   Se token inválido → 403 Forbidden
```

## Estrutura de Pastas Frontend

```
frontend/src/
├── App.jsx                    # Componente raiz com rotas
├── main.jsx                   # Entry point
├── index.css                  # Estilos globais
│
├── pages/                     # Páginas completas
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── DemandasPage.jsx
│   ├── NovaDemandasPage.jsx
│   ├── RankingPage.jsx
│   ├── PerfilPage.jsx
│   ├── AdminPage.jsx
│   └── KanbanPage.jsx
│
├── components/                # Componentes reutilizáveis
│   ├── Layout.jsx            # Wrapper principal
│   ├── Sidebar.jsx           # Menu lateral
│   ├── Navbar.jsx            # Barra superior
│   ├── LoadingScreen.jsx     # Tela de carregamento
│   ├── Modal.jsx             # Modal genérico
│   ├── Alert.jsx             # Alertas
│   ├── Button.jsx            # Botão customizado
│   ├── Card.jsx              # Card reutilizável
│   ├── Badge.jsx             # Badge para labels
│   ├── StatCard.jsx          # Card de estatística
│   └── ProgressBar.jsx       # Barra de progresso
│
├── context/                   # Context API
│   └── AuthContext.jsx       # Contexto de autenticação
│
├── hooks/                     # Custom hooks
│   └── useCustom.js          # useLocalStorage, useDebounce, etc
│
└── utils/                     # Funções utilitárias
    ├── helpers.js            # formatDate, formatTime, etc
    └── constants.js          # Constantes da app
```

## Estrutura de Pastas Backend

```
backend/src/
└── server.js                  # Todo o backend em um arquivo

Inclui:
- Configuração Express
- Iniciação do SQLite
- Funções helper (async wrappers)
- Seed de dados de demo
- Middleware de autenticação
- Todas as rotas e lógica
```

## Fluxo de Dados - Exemplo: Criar Demanda

```
Frontend:
1. Usuário preenche formulário
2. handleSubmit validar dados
3. axios.post('/api/demandas', formData, headers)
4. Aguarda resposta
5. Se sucesso → redireciona
6. Se erro → mostra mensagem

Backend:
1. POST /api/demandas recebido
2. Middleware authenticateToken valida JWT
3. req.user preenchido com dados do token
4. Destructuring de categoria, cliente, etc
5. Validações
6. INSERT na tabela demandas
7. SELECT para retornar o registro criado
8. res.status(201).json(demanda)

Frontend:
1. Recebe resposta com status 201
2. Redireciona para /demandas
3. Página carrega as demandas atualizadas
```

## Gerenciamento de Estado

### Context API (Auth)
```javascript
// AuthContext armazena:
- user (objeto do usuário logado)
- token (JWT)
- loading (estado de carregamento)

// Funções:
- login(email, password)
- register(name, email, password)
- logout()
- updateProfile(data)
```

### Estado Local (useState)
- Cada página gerencia seu próprio estado
- Exemplos: formulários, filtros, modais

### LocalStorage
```javascript
// Armazena:
- token (para persistência entre sessões)
```

## Segurança

### JWT Token
- Gerado no backend com chave secreta
- Expira em 30 dias
- Armazenado no localStorage
- Validado em cada requisição

### Validação de Senha
```javascript
// Criação:
const hashedPassword = bcryptjs.hash(password, 10)

// Validação:
const isValid = bcryptjs.compare(inputPassword, hashedPassword)
```

### Verificação de Propriedade
```
// Apenas o dono pode ver/editar suas demandas
SELECT * FROM demandas 
WHERE id = ? AND userId = ?
```

### CORS
- Habilitado para localhost:5173 (frontend)
- Em produção, especificar domain exato

## Performance

### Frontend
- **Code Splitting**: React Router lazy load
- **Bundling**: Vite com modo otimizado
- **Lazy Loading**: Imagens carregadas conforme necessário
- **Memoization**: React.memo para componentes pesados

### Backend
- **Database Indexing**: PK em id, FK em userId
- **Queries Otimizadas**: SELECT apenas campos necessários
- **Paginação**: Implementar em listagens grandes

## Escalabilidade

### Próximas Melhorias
1. **Banco de Dados**: Migrar para PostgreSQL
2. **Cache**: Implementar Redis
3. **Autenticação**: OAuth2, Google/GitHub login
4. **WebSockets**: Notificações em tempo real
5. **Arquivo**: S3 para armazenar avatares
6. **Email**: SendGrid para notificações
7. **Logs**: Sentry para monitoring
8. **CI/CD**: GitHub Actions para deploy

## Padrões de Código

### Componentes (React)
```javascript
// Sempre functional components
// Props bem definidas
// Props drilling mínimo (usar Context quando necessário)
// Comentários para lógica complexa
```

### API Calls
```javascript
// Sempre usar try/catch
// Passar token no header
// Validar response.data
// Mostrar erro ao usuário
```

### Validação
```javascript
// Frontend: Validação rápida de UX
// Backend: Validação rigorosa de segurança
// Ambos: trim() e type checking
```

## Debugging

### Frontend
1. **DevTools do Navegador**: F12
2. **React DevTools**: Inspecionar componentes
3. **Network Tab**: Verificar requisições
4. **Console**: Ver logs e erros

### Backend
```javascript
// Logs no console
console.log('Debug:', variável);
```

## Testing (Não implementado, mas recomendado)

### Frontend
- Jest + React Testing Library
- Testar componentes, hooks, pages

### Backend
- Jest + Supertest
- Testar endpoints e validações

---

**Entendendo a arquitetura você consegue:**
✓ Estender funcionalidades
✓ Debugar problemas
✓ Otimizar performance
✓ Escalar a aplicação
