# 📚 Guia de Iniciação Rápida

## ⚡ Instalação em 5 minutos

### Opção 1: Script Automático (Recomendado)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Opção 2: Manual

#### 1. Backend
```bash
cd backend
npm install
npm run dev
```

#### 2. Frontend (em outro terminal)
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🔐 Fazer Login

Use uma das contas de demo:

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@agencia.com | 123456 |
| Usuário | usuario@agencia.com | 123456 |

## 📁 Estrutura de Pastas

```
painel-produtividade/
├── backend/          # Node.js + Express + SQLite
├── frontend/         # React + Vite + TailwindCSS
├── README.md         # Documentação completa
├── setup.bat         # Script de setup (Windows)
├── setup.sh          # Script de setup (Linux/Mac)
└── docker-compose.yml # Configuração Docker (opcional)
```

## 🚀 Principais Recursos

### ✅ Funcionalidades Implementadas

- [x] Autenticação com JWT
- [x] Dashboard com gráficos
- [x] Registro de demandas
- [x] Sistema de ranking
- [x] Painel administrativo
- [x] Kanban visual
- [x] Perfil de usuário
- [x] Tema Dark Mode
- [x] Responsivo (mobile + desktop)

### 📊 Permissões por Tipo de Usuário

**Usuário Comum:**
- ✓ Ver seu dashboard
- ✓ Registrar demandas
- ✓ Ver seu ranking
- ✓ Usar Kanban pessoal
- ✓ Atualizar perfil

**Admin (Director):**
- ✓ Tudo que usuário comum faz
- ✓ Ver todos os usuários
- ✓ Ver todas as demandas
- ✓ Filtros avançados
- ✓ Exportar dados

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18
- Vite (build tool)
- TailwindCSS (estilização)
- Axios (HTTP)
- Chart.js (gráficos)
- Lucide Icons

### Backend
- Node.js
- Express
- SQLite (banco de dados)
- JWT (autenticação)
- bcryptjs (criptografia)

## 💾 Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução:

```
backend/database.db
```

**Tabelas:**
- `users` - Usuários do sistema
- `demandas` - Registro de demandas
- `sessions` - Sessões JWT

## 🔄 API Endpoints

### Autenticação
```
POST   /api/auth/register      # Criar conta
POST   /api/auth/login         # Fazer login
GET    /api/auth/me            # Dados do usuário
PUT    /api/auth/profile       # Atualizar perfil
```

### Demandas
```
GET    /api/demandas           # Listar demandas
POST   /api/demandas           # Criar demanda
PATCH  /api/demandas/:id       # Atualizar demanda
DELETE /api/demandas/:id       # Deletar demanda
```

### Dashboard
```
GET    /api/dashboard/stats    # Estatísticas
```

### Ranking
```
GET    /api/ranking            # Ranking da equipe
```

### Admin
```
GET    /api/admin/users        # Listar usuários
GET    /api/admin/demandas     # Listar todas demandas
```

## ⚙️ Variáveis de Ambiente

Copie os arquivos de exemplo:

```bash
# Backend
cp backend/.env.example backend/.env.local

# Frontend
cp frontend/.env.example frontend/.env.local
```

## 🐛 Troubleshooting

### Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Dependências não instaladas
```bash
rm -rf node_modules package-lock.json
npm install
```

### Banco de dados corrompido
```bash
rm database.db
# Será recriado na próxima execução
```

## 💡 Dicas Úteis

1. **Live Reload**: O Vite já has hot module replacement
2. **Nodemon**: Backend usa --watch (reinicia automaticamente)
3. **DevTools**: React DevTools disponível no browser
4. **Banco de Dados**: Dados de demo inseridos automaticamente
5. **CORS**: Já configurado para desenvolvimento local

## 📝 Criando uma Nova Conta

1. Clique em "Criar conta" na página de login
2. Preencha nome, email e senha
3. Você será redirecionado ao dashboard
4. Configure seu perfil e adicione uma foto

## 🎨 Personalizando as Cores

Edite `frontend/tailwind.config.js`:

```javascript
colors: {
  'primary': '#2563eb',      // Azul principal
  'dark': '#0f172a',         // Fundo
  'light': '#f8fafc',        // Texto
  'slate-dark': '#1e293b',   // Cards
}
```

## 🚢 Deploy

### Heroku
```bash
heroku create seu-app
git push heroku main
```

### Vercel (Frontend)
```bash
vercel
```

### Railway/Render (Backend)
Conectar o repositório e fazer deploy automático

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique o console do navegador (DevTools)
2. Verifique os logs do backend
3. Consulte a documentação no README.md
4. Crie uma issue no repositório

## 🎓 Próximos Passos

1. Personalize as cores e logos
2. Adicione mais campos de demandas
3. Implemente notificações em tempo real
4. Adicione integração com calendário
5. Crie relatórios em PDF

---

**Precisando de ajuda?** Verifique o README.md para documentação completa!
