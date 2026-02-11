# 🌐 Guia de Deploy para Produção

## 📋 Checklist Pré-Deploy

- [ ] Remover `console.log()` de produção
- [ ] Testar com dados reais
- [ ] Configurar variáveis de ambiente
- [ ] Backup do banco de dados
- [ ] Comprar domínio
- [ ] Configurar HTTPS/SSL
- [ ] Testar autenticação
- [ ] Testar login de muitos usuários
- [ ] Verificar performance
- [ ] Preparar plano de rollback

## 🚀 Opção 1: Railway (⭐ Recomendado)

### Facilidade: ⭐⭐⭐⭐⭐
### Custo: Gratuito (até créditos acabarem)

**Vantagens**:
- Deploy super fácil
- Sem configuração complicada
- Banco de dados incluído
- HTTPS automático

**Passo a Passo**:

1. **Criar conta**:
   - Ir em https://railway.app/
   - Sign up com GitHub

2. **Backend - Railway**:
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```
   - Escolher Node.js
   - Escolher server.js

3. **Frontend - Vercel**:
   - Ir em https://vercel.com/
   - Import seu repositório
   - Deploy automático

4. **Conectar**:
   ```javascript
   // frontend/.env.production
   VITE_API_URL=https://seu-backend.up.railway.app
   ```

## 🌐 Opção 2: Vercel (Frontend) + Railway (Backend)

### Facilidade: ⭐⭐⭐⭐
### Custo: Gratuito

**Vercel (Frontend)**:
```bash
# Instalar
npm i -g vercel

# Fazer deploy
cd frontend
vercel

# Ou conectar GitHub
# https://vercel.com/new
```

**Railway (Backend)**:
- Veja opção 1 acima

## 💎 Opção 3: Heroku (Clássico)

### Facilidade: ⭐⭐⭐⭐
### Custo: $7/mês ou mais

1. **Criar conta**:
   - https://heroku.com/

2. **Instalar CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Backend**:
   ```bash
   cd backend
   heroku create seu-app-backend
   heroku config:set JWT_SECRET=sua_chave_super_secreta
   git push heroku main
   ```

4. **Frontend**:
   ```bash
   cd frontend
   heroku create seu-app-frontend
   vercel --prod  # Ou fazer no Vercel
   ```

5. **Arquivo Procfile** (Backend):
   ```
   web: node src/server.js
   ```

## 🐳 Opção 4: Docker + AWS EC2

### Facilidade: ⭐⭐⭐
### Custo: $5-30/mês

1. **Criar conta AWS**:
   - https://aws.amazon.com/

2. **Criar instância EC2**:
   - AMI: Ubuntu 22.04
   - Tipo: t2.micro (free tier)
   - Security: Abrir portas 80, 443, 3000

3. **No servidor**:
   ```bash
   # Instalar Docker
   sudo apt update
   sudo apt install docker.io docker-compose
   
   # Clone repo
   git clone seu-repo
   cd painel-produtividade
   
   # Build e run
   docker-compose up -d
   ```

4. **Nginx reverse proxy**:
   ```bash
   sudo apt install nginx
   # Editar /etc/nginx/sites-enabled/default
   ```

## ☁️ Opção 5: Render

### Facilidade: ⭐⭐⭐⭐⭐
### Custo: Gratuito (com limitações)

1. **Ir em** https://render.com/

2. **Conectar GitHub** e autorizar

3. **Novo Web Service**:
   - Repository: seu-repositório
   - Build command: `npm install`
   - Start command: `node src/server.js`

4. **Variáveis de ambiente**:
   ```
   NODE_ENV=production
   JWT_SECRET=sua_chave_secreta
   ```

5. **Deploy automático** a cada push!

## 📱 Opção 6: Supabase (Backend) + Vercel (Frontend)

### Facilidade: ⭐⭐⭐
### Custo: Gratuito (até certo ponto)

**Backend com Supabase**:
1. Criar conta em https://supabase.com/
2. Usar PostgreSQL deles
3. Usar suas funções serverless

**Frontend no Vercel**:
1. Deploy em Vercel
2. Conectar ao backend Supabase

## ⚙️ Configurações Importantes

### 1. Variáveis de Ambiente

**Backend (.env)**:
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_muito_seguro_aqui_com_caracteres_aleatorios
DATABASE_PATH=./database.db
CORS_ORIGIN=https://seu-frontend.com
```

**Frontend (.env.production)**:
```env
VITE_API_URL=https://seu-backend.com
VITE_APP_NAME=Painel de Produtividade
```

### 2. CORS Corrigido

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Segurança

```javascript
// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Helmet para headers
import helmet from 'helmet';
app.use(helmet());
```

### 4. HTTPS

```javascript
// Forçar HTTPS em produção
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

## 🎯 Passo a Passo Detalhado - Railway (Recomendado)

### Backend

1. **Criar Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["node", "src/server.js"]
   ```

2. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Deploy"
   git push origin main
   ```

3. **No Railway**:
   - New Project → GitHub Repo
   - Select painel-produtividade
   - Add Variables:
     - JWT_SECRET
     - NODE_ENV=production

4. **Deploy automático** será acionado

### Frontend

1. **Build otimizado**:
   ```bash
   npm run build
   ```

2. **No Vercel**:
   - New Project → Import Git Repo
   - Configure:
     - Framework: Vite
     - Build: `npm run build`
     - Output: `dist`
   - Environment:
     - VITE_API_URL = seu-backend-railway.app

3. **Deploy automático** em cada push!

## 📊 Monitoramento pós-Deploy

### Sentry (Error Tracking)
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "sua-dsn-aqui",
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

### LogRocket (Frontend Monitoring)
```javascript
import LogRocket from "logrocket";

LogRocket.init("seu-app-id");
```

### Uptime Robot (Verificar se está online)
- https://uptimerobot.com/
- Monitorar: https://seu-backend.com/api/health

## 🔄 Pipeline CI/CD com GitHub Actions

**Arquivo: `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: npm run build
        
      - name: Deploy Frontend
        run: npm run build
        working-directory: ./frontend
```

## 🔐 Segurança em Produção

```javascript
// 1. Helmet para headers de segurança
import helmet from 'helmet';
app.use(helmet());

// 2. Rate limiting
import rateLimit from 'express-rate-limit';
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// 3. HTTPS obrigatório
// (Railway/Vercel fazem automaticamente)

// 4. CORS restritivo
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// 5. Validação rigorosa
function validateInput(data) {
  // check types, lengths, etc
}

// 6. Logs de segurança
console.log(`[SECURITY] SQL Injection attempt from ${ip}`);
```

## 📈 Performance em Produção

```javascript
// 1. Gzip compression
app.use(compression());

// 2. Redis caching
const cache = redis.createClient();

// 3. Database indexes
CREATE INDEX idx_userId ON demandas(userId);
CREATE INDEX idx_email ON users(email);

// 4. Lazy loading no frontend
const Dashboard = React.lazy(() => import('./pages/DashboardPage'));

// 5. CDN para assets estáticos
// Usar Cloudflare ou CloudFront
```

## 🎊 Checklist Final

- [ ] Backend deployado e testado
- [ ] Frontend deployado e testado
- [ ] HTTPS funcionando
- [ ] Domínio configurado
- [ ] Banco de dados backup
- [ ] Variáveis de ambiente configuradas
- [ ] Monitoramento ativo
- [ ] Email de notificações setting
- [ ] Rate limiting ativo
- [ ] Logging ativo
- [ ] Tests passando
- [ ] Performance OK
- [ ] Segurança OK

---

## 🆘 Problemas Comuns no Deploy

### App trava após deploy
- Reiniciar server
- Verificar variáveis de ambiente
- Verificar tamanho do banco

### Banco de dados perdido
- Usar backup
- Para futuro: fazer backup diário

### CORS error em produção
- Verificar CORS_ORIGIN var env
- Verificar domínio exato

### Performance lenta
- Adicionar indexes no banco
- Implementar cache
- CDN para frontend

---

**Você está pronto para levar sua aplicação ao mundo! 🚀**
