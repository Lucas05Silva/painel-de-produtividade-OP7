# 🚀 Guia Completo de Troubleshooting

## 🔴 Erros Comuns e Soluções

### Frontend

#### ❌ "npm: command not found"
**Causa**: Node.js não está instalado
**Solução**:
```bash
# Baixar em https://nodejs.org/
# Depois verificar:
node --version
npm --version
```

#### ❌ "Cannot find module 'react'"
**Causa**: Dependências não instaladas
**Solução**:
```bash
# Deletar tudo
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Se persistir, limpar cache npm
npm cache clean --force
npm install
```

#### ❌ "Port 5173 already in use"
**Causa**: Outro processo usando a porta
**Solução**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <NUMERO_PID> /F

# macOS/Linux
lsof -i :5173
kill -9 <NUMERO_PID>

# Ou mudar a porta em vite.config.js
export default {
  server: {
    port: 5174  // Mudar aqui
  }
}
```

#### ❌ "Proxy error: Cannot GET /api/..."
**Causa**: Backend não está rodando
**Solução**:
```bash
# Verificar se backend está ligado
# Abrir outro terminal:
cd backend
npm run dev

# Verificar se está em http://localhost:3000
# Testar: curl http://localhost:3000/api/auth/me
```

#### ❌ "Styles not loading (Tailwind)"
**Causa**: Tailwind não foi processado
**Solução**:
```bash
# Parar o servidor (Ctrl+C)
# Deletar cache Next
rm -rf .next dist

# Reinstalar
npm install

# Rodar novamente
npm run dev
```

#### ❌ "Cannot read property 'map' of undefined"
**Causa**: State vazio ou undefined
**Solução**:
```javascript
// Adicionar check de null
{demandas && demandas.map(...)}

// Ou inicializar com array vazio
const [demandas, setDemandas] = useState([]);
```

#### ❌ "Token inválido / 403 Forbidden"
**Causa**: Token expired ou invalido
**Solução**:
```javascript
// Frontend - Limpar localStorage
localStorage.removeItem('token');

// Fazer login novamente
// Verificar se a senha está correta

// Verificar console para ver erro real
console.log(error.response.data.message);
```

#### ❌ "Blank page / Nothing renders"
**Causa**: Erro não capturado
**Solução**:
```bash
# Verificar console do navegador (F12)
# Verificar Network tab para erros

# Se é erro de rota:
# Verificar se Page existe em src/pages/
# Verificar se está declarada em App.jsx
```

### Backend

#### ❌ "Port 3000 already in use"
**Causa**: Outro processo usando a porta
**Solução**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <NUMERO_PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <NUMERO_PID>

# Ou no próprio código:
const PORT = process.env.PORT || 3001;
```

#### ❌ "Cannot find module 'express'"
**Causa**: Dependências não instaladas
**Solução**:
```bash
cd backend
npm install
```

#### ❌ "Cannot connect to database"
**Causa**: SQLite não inicia
**Solução**:
```bash
# Deletar banco corrompido
rm database.db

# Será recriado na próxima execução
npm run dev

# Se persistir:
# Verificar permissões da pasta
chmod 755 backend
```

#### ❌ "Syntax error in server.js"
**Causa**: Código JS inválido
**Solução**:
```bash
# Verificar linha indicada no erro
# Usar editor com syntax highlighting
# Verificar se há:
# - Parênteses não fechados
# - Aspas mal formadas
# - Dois-pontos faltando

# Validar sintaxe:
node -c src/server.js
```

#### ❌ "CORS error"
**Causa**: Frontend em porta diferente
**Solução**:
```javascript
// Verificar se frontend URL está certa
// localhost:5173 é o padrão

// Se mudar porta, adicionar em backend:
app.use(cors({
  origin: 'http://localhost:5174', // Sua nova porta
  credentials: true
}));
```

#### ❌ "JWT error: invalid token"
**Causa**: Token malformado ou expirado
**Solução**:
```bash
# Gerar novo token fazendo login novamente
# Verificar se JWT_SECRET é igual em ambos os lados

# Se tiver dúvida, fazer login fresh:
# Frontend: localStorage.removeItem('token')
# Fazer login novamente
```

#### ❌ "Cannot INSERT (database locked)"
**Causa**: SQLite travado
**Solução**:
```bash
# Parar servidor (Ctrl+C)
# Esperar 5 segundos
# Rodar novamente

# Se persistir:
# Deletar database.db
rm database.db
npm run dev
```

#### ❌ "email already exists"
**Causa**: Email já cadastrado
**Solução**:
```bash
# Ou use outro email para registrar
# Ou delete o banco e comece do zero
rm database.db
npm run dev

# Contas demo serão recriadas automaticamente
```

### Integração Frontend-Backend

#### ❌ "Network error" infinito
**Causa**: Backend não respondendo
**Solução**:
```bash
# 1. Verificar se ambos estão rodando
# Terminal 1: Backend rodando?
curl http://localhost:3000

# Terminal 2: Frontend rodando?
# Acessar http://localhost:5173

# 2. Se falhar, reiniciar:
# Backend: Ctrl+C e npm run dev
# Frontend: Ctrl+C e npm run dev

# 3. Verificar firewall/proxy
```

#### ❌ "ECONNREFUSED: connection refused"
**Causa**: Backend não está acessível
**Solução**:
```bash
# Verificar se backend está rodando
ps aux | grep "node"

# Se não tiver saída, backend parou
# Reiniciar:
cd backend
npm run dev
```

#### ❌ "undefined response in console"
**Causa**: Resposta vazia ou erro
**Solução**:
```javascript
// Logar a resposta completa
axios.get('/api/...').then(res => {
  console.log('Full response:', res);
  console.log('Data:', res.data);
  console.log('Status:', res.status);
});
```

## 🟡 Warnings (Avisos não críticos)

#### Warning: "React does not recognize the `xxx` prop"
**Solução**: Usar `{...restProps}` para props desconhecidas
```javascript
export function MyComponent({ known, ...other }) {
  return <div {...other}>{known}</div>;
}
```

#### Warning: "Missing dependency in useEffect"
**Solução**: Adicionar dependent às dependências
```javascript
// ❌ Errado
useEffect(() => {
  fetchData(token);
}, []);

// ✅ Correto
useEffect(() => {
  fetchData(token);
}, [token]);
```

## 📋 Checklist de Debug

Quando algo quebrar, fazer nessa ordem:

```
1. ☐ Verificar console do navegador (F12)
2. ☐ Verificar Network tab para erros HTTP
3. ☐ Verificar se backend está rodando
4. ☐ Verificar se frontend está rodando
5. ☐ Limpar cache (parar e rodar novamente)
6. ☐ Deletar node_modules e npm install
7. ☐ Verificar porta não está em uso
8. ☐ Verificar variáveis de ambiente
9. ☐ Verificar se banco de dados existe
10. ☐ Fazer login novamente
```

## 🔍 Ferramentas de Debug

### Browser DevTools (F12)
- **Console**: Ver logs e erros
- **Network**: Ver requisições HTTP
- **Storage**: Ver localStorage e cookies
- **React DevTools**: Inspecionar estado

### Linux/Mac Terminal
```bash
# Ver logs em tempo real
tail -f backend/logs.txt

# Debugar requests
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN"

# Ver processos
ps aux | grep node
```

### Windows PowerShell
```powershell
# Ver logs
Get-Content backend/logs.txt -Wait

# Ver requests
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
  -Headers @{ "Authorization" = "Bearer SEU_TOKEN" }

# Ver processos
Get-Process node
```

## 🧪 Como Testar APIs Manualmente

### curl
```bash
# GET
curl http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"

# POST
curl -X POST http://localhost:3000/api/demandas \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"categoria":"Design","cliente":"XYZ","descricao":"Test","tempo":60,"status":"Pendente"}'
```

### Postman
1. Baixar Postman
2. Novo request
3. URL: `http://localhost:3000/api/demandas`
4. Method: GET
5. Headers: `Authorization: Bearer YOUR_TOKEN`
6. Send

### VS Code REST Client
```
GET http://localhost:3000/api/dashboard/stats
Authorization: Bearer YOUR_TOKEN

###

POST http://localhost:3000/api/demandas
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "categoria": "Design",
  "cliente": "XYZ", 
  "descricao": "Test",
  "tempo": 60,
  "status": "Pendente"
}
```

## 🚨 Emergências

### Tudo parou de funcionar
```bash
# Reset completo

# 1. Parar tudo
# Ctrl+C em todos os terminais

# 2. Deletar dependências
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# 3. Deletar banco
rm backend/database.db

# 4. Resetar navegador
# Abrir DevTools → Application → Clear All

# 5. Rodar novamente
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
```

### Arquivo corrompido
```bash
# Se um arquivo foi modificado incorretamente
git checkout <arquivo>

# Se tudo está quebrado
git reset --hard origin/main
npm install
```

### Memory Leak
```bash
# Se aplicação fica lenta/trava
# Fechar e abrir de novo

# Se persistir, procurar por:
# - setInterval sem clearInterval
# - addEventListener sem removeEventListener
# - Socket.io connections não fechadas
```

## 📞 Como Relatar um Bug

Se encontrar um bug que não conseguir resolver:

1. **Documentar**:
   - Que você fez
   - Que happened
   - Expected behavior
   - Erro exato

2. **Criar reprodução mínima**:
   - Passos claros para reproduzir
   - Usar contas de demo

3. **Screenshots**:
   - Console error
   - Network tab
   - Application state

4. **Informações do ambiente**:
   - Node version: `node --version`
   - npm version: `npm --version`
   - OS: Windows/Mac/Linux
   - Browser: Chrome/Firefox/Safari

---

**Lembre-se**: A maioria dos problemas é resolvida com:
1. Parar tudo (Ctrl+C)
2. Deletar node_modules
3. npm install
4. npm run dev

Se isso não resolver, provavelmente é algo simples que passou despercebido!
