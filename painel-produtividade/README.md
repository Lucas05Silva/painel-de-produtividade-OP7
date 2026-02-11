# 📊 Painel de Produtividade - Agência

Sistema interno completo para controle de demandas e produtividade de funcionários em agência de marketing.

## 🎯 Características

### ✨ Sistema de Autenticação
- Registro de novos usuários
- Login seguro com JWT
- Dois tipos de usuário: Comum e Diretor (Admin)
- Gerenciamento de perfil com upload de avatar
- Alteração de senha segura

### 📊 Dashboard Inteligente
- Estatísticas em tempo real
- Gráficos de produtividade semanal
- Análise por tipo de demanda
- Indicadores de desempenho
- Barra de progresso de meta diária
- Alertas de produtividade

### 📋 Gerenciamento de Demandas
- Registro de novas demandas com:
  - Tipo (Design, Copy, Tráfego Pago, Automação, Reunião, Suporte, Outro)
  - Cliente
  - Descrição detalhada
  - Tempo gasto em minutos
  - Status (Pendente, Em andamento, Finalizado)
- Listagem com filtros por categoria e status
- Edição e exclusão de demandas

### 🏆 Sistema de Ranking
- Ranking completo da equipe
- Filtros por período (semana, mês, ano)
- Visualização de sua posição no ranking
- Diferença em relação aos líderes

### 📊 Painel do Diretor
- Visão completa de todos os usuários
- Filtros avançados por data, usuário e categoria
- Estatísticas globais da agência
- Tabela detalhada de todas as demandas
- Exportação de dados em CSV

### 🎨 Visualização Kanban
- Arraste as demandas entre os status
- Visualização intuitiva do fluxo de trabalho
- Atualização automática de status
- Design moderno com cores por categoria

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Interface de usuário
- **Vite** - Build tool rápido
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones
- **Chart.js** - Gráficos
- **Axios** - HTTP client
- **React Router** - Roteamento

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **CORS** - Compartilhamento de recursos

## 📋 Requisitos

- Node.js (v18+)
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone <seu-repo>
cd painel-produtividade
```

### 2. Instalar dependências do Backend

```bash
cd backend
npm install
```

### 3. Instalar dependências do Frontend

```bash
cd ../frontend
npm install
```

### 4. Executar o Backend

```bash
cd backend
npm run dev
```

O servidor backend estará rodando em `http://localhost:3000`

### 5. Executar o Frontend (em outro terminal)

```bash
cd frontend
npm run dev
```

O frontend estará acessível em `http://localhost:5173`

## 🔐 Contas de Teste

### Diretor (Admin)
- **Email**: admin@agencia.com
- **Senha**: 123456

### Usuário Comum
- **Email**: usuario@agencia.com
- **Senha**: 123456

## 📁 Estrutura do Projeto

```
painel-produtividade/
├── backend/
│   ├── src/
│   │   └── server.js          # Servidor Express principal
│   ├── package.json
│   └── database.db            # Banco SQLite (gerado automaticamente)
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DemandasPage.jsx
│   │   │   ├── NovaDemandasPage.jsx
│   │   │   ├── RankingPage.jsx
│   │   │   ├── PerfilPage.jsx
│   │   │   ├── AdminPage.jsx
│   │   │   └── KanbanPage.jsx
│   │   ├── context/          # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── utils/            # Utilitários
│   │   ├── hooks/            # Custom hooks
│   │   ├── App.jsx           # Componente raiz
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## 🎨 Design e Visual

### Paleta de Cores
- **Primário**: #2563eb (Azul)
- **Dark**: #0f172a (Preto)
- **Light**: #f8fafc (Branco)
- **Card Dark**: #1e293b (Cinza escuro)

### Recursos de UX
- Tema Dark Mode
- Animações suaves e transições
- Ícones do Lucide React
- Cards com sombras suaves
- Cantos levemente arredondados
- Layout responsivo (mobile + desktop)

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual (requer token)
- `PUT /api/auth/profile` - Atualizar perfil (requer token)

### Demandas
- `GET /api/demandas` - Listar demandas do usuário
- `POST /api/demandas` - Criar nova demanda
- `PATCH /api/demandas/:id` - Atualizar demanda
- `DELETE /api/demandas/:id` - Deletar demanda

### Dashboard
- `GET /api/dashboard/stats` - Obter estatísticas do usuário

### Ranking
- `GET /api/ranking` - Obter ranking da equipe

### Admin
- `GET /api/admin/users` - Listar todos os usuários
- `GET /api/admin/demandas` - Listar todas as demandas

## 🔄 Fluxo de Dados

```
Frontend (React)
    ↓
  Axios (HTTP)
    ↓
Backend (Express)
    ↓
SQLite Database
    ↓
Backend (Express)
    ↓
  Axios (JSON)
    ↓
Frontend (React - State Update)
```

## 🌐 CORS

O backend está configurado para aceitar requisições do frontend em qualquer origin durante desenvolvimento. Em produção, configure os origins específicos:

```javascript
app.use(cors({
  origin: 'https://seu-frontend.com',
  credentials: true
}));
```

## 📊 Métricas e Indicadores

### Dashboard
- Total de demandas do dia
- Total de demandas da semana
- Índice de produtividade
- Ranking pessoal
- Progresso em relação à meta (480 min = 8h)

### Análises
- Gráfico de produtividade semanal
- Distribuição por tipo de demanda
- Status de tarefas
- Comparativo com média da equipe

## 🚀 Construir para Produção

### Frontend
```bash
cd frontend
npm run build
# Arquivos em dist/
```

### Backend
O backend está pronto para produção. Adicione variáveis de ambiente:

```bash
PORT=3000
JWT_SECRET=sua_chave_muito_secreta_aqui
NODE_ENV=production
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` no backend:

```
PORT=3000
JWT_SECRET=sua_chave_secreta_super_segura_2024
DATABASE_PATH=./database.db
NODE_ENV=development
```

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Banco de dados não inicia
```bash
# Deletar banco e deixar ser recriado
rm database.db
```

## 📚 Documentação Adicional

Consulte os comentários no código para mais detalhes sobre cada função e componente.

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido como sistema interno para agências de marketing.

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

---

**Versão**: 1.0.0  
**Última atualização**: Fevereiro 2026
