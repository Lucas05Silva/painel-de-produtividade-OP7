# 🎨 Guia de Desenvolvimento e Customização

## 🚀 Como Começar a Desenvolver

### 1. Criar um Novo Componente

**Exemplo: Novo componente Button com loading state**

```javascript
// frontend/src/components/MyButton.jsx

export function MyButton({ loading, ...props }) {
  return (
    <button 
      className="btn-primary disabled:opacity-50"
      disabled={loading}
      {...props}
    >
      {loading ? '⏳ Carregando...' : 'Enviar'}
    </button>
  );
}
```

### 2. Criar uma Nova Página

**Exemplo: Nova página de Relatórios**

```javascript
// frontend/src/pages/RelatorioPage.jsx

import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function RelatorioPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      const response = await axios.get('/api/relatorio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    };
    fetchRelatorio();
  }, [token]);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-light">Relatório</h1>
        {/* Seu conteúdo aqui */}
      </div>
    </Layout>
  );
}
```

**Adicione a rota em App.jsx:**
```javascript
import RelatorioPage from './pages/RelatorioPage';

// Dentro de <Routes>
<Route path="/relatorio" element={<ProtectedRoute><RelatorioPage /></ProtectedRoute>} />
```

### 3. Adicionar Nova Rota no Backend

**Exemplo: Novo endpoint de relatório**

```javascript
// backend/src/server.js

app.get('/api/relatorio', authenticateToken, async (req, res) => {
  try {
    // Sua lógica aqui
    const relatorio = await dbAll(
      'SELECT * FROM demandas WHERE userId = ?',
      [req.user.id]
    );
    res.json(relatorio);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## 🎯 Casos de Uso Comuns

### Adicionar novo campo em demanda

**1. Banco de dados:**
```javascript
// Em initDB(), ALTER TABLE ou recriar tabela
`CREATE TABLE demandas (
  ...
  prioridade TEXT DEFAULT 'Normal',
  ...
)`
```

**2. Frontend - Formulário:**
```javascript
<select name="prioridade">
  <option>Baixa</option>
  <option>Normal</option>
  <option>Alta</option>
  <option>Urgente</option>
</select>
```

**3. Backend - API:**
```javascript
const { ..., prioridade } = req.body;
await dbRun(
  'INSERT INTO demandas (..., prioridade, ...) VALUES (..., ?, ...)',
  [..., prioridade, ...]
);
```

### Criar um novo tipo de usuário

**1. Banco de dados:**
```sql
-- role pode ser: 'user', 'admin', 'manager', 'analyst'
```

**2. Backend - Verificação:**
```javascript
if (req.user.role !== 'manager') {
  return res.status(403).json({ message: 'Acesso negado' });
}
```

**3. Frontend - Menu:**
```javascript
user?.role === 'manager' && (
  { icon: BarChart3, label: 'Análises', path: '/analytics' }
)
```

### Adicionar filtro em página

```javascript
const [filterPrioridade, setFilterPrioridade] = useState('');

useEffect(() => {
  fetchData(`?prioridade=${filterPrioridade}`);
}, [filterPrioridade]);

// no JSX:
<select value={filterPrioridade} onChange={(e) => setFilterPrioridade(e.target.value)}>
  <option value="">Todas</option>
  <option value="Baixa">Baixa</option>
  <option value="Alta">Alta</option>
</select>
```

## 🎨 Customizar Estilos

### Cores Globais

Edite `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#seu-azul',
  dark: '#seu-escuro',
  light: '#seu-claro',
}
```

### Fonts Personalizadas

Edite `frontend/tailwind.config.js`:

```javascript
theme: {
  fontFamily: {
    sans: ['Poppins', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  }
}
```

Adicione no `frontend/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

### Tema Completo Customizado

Crie `frontend/src/theme.js`:

```javascript
export const customTheme = {
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    danger: '#ff3d3d',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
  }
};
```

## 📊 Adicionar novo Gráfico

**Exemplo: Gráfico de Pizza**

```javascript
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['Design', 'Copy', 'Tráfego'],
  datasets: [{
    data: [300, 150, 200],
    backgroundColor: ['#a855f7', '#3b82f6', '#ef4444'],
  }]
};

<Pie data={data} />
```

## 🔌 Integrar API Externa

**Exemplo: Integrar com Slack para notificações**

### Backend:

```javascript
import axios from 'axios';

async function notifySlack(message) {
  await axios.post(process.env.SLACK_WEBHOOK_URL, {
    text: message
  });
}

// Usar em eventos:
app.post('/api/demandas', authenticateToken, async (req, res) => {
  // ... criar demanda ...
  await notifySlack(`Nova demanda: ${categoria}`);
  res.status(201).json(demanda);
});
```

## 🔐 Implementar Permissões por Recurso

```javascript
// Backend middleware
async function authorizeResource(req, res, next) {
  const resource = await dbGet(
    'SELECT userId FROM demandas WHERE id = ?',
    [req.params.id]
  );
  
  // Permitir owner ou admin
  if (resource.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
}

// Usar em rotas:
app.patch('/api/demandas/:id', authenticateToken, authorizeResource, async (...) => {...});
```

## 📝 Adicionar Validação de Dados

```javascript
// Backend - Validação rigorosa
function validateDemanda(data) {
  if (!data.categoria || data.categoria.trim() === '') {
    throw new Error('Categoria é obrigatória');
  }
  if (!data.tempo || data.tempo < 1) {
    throw new Error('Tempo deve ser maior que 0');
  }
  if (data.tempo > 480) {
    throw new Error('Tempo não pode exceder 8 horas');
  }
  return true;
}

// Usar:
app.post('/api/demandas', authenticateToken, async (req, res) => {
  try {
    validateDemanda(req.body);
    // ... criar demanda ...
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
```

## 🔄 WebSocket (Notificações em Tempo Real)

**Instalação:**
```bash
npm install socket.io socket.io-client
```

**Backend:**
```javascript
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('Novo usuário conectado');
  socket.emit('message', 'Bem-vindo!');
});

server.listen(3000);
```

**Frontend:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('message', (msg) => {
  console.log('Mensagem:', msg);
});

// Enviar notificação ao criar demanda
socket.emit('newDemanda', demanda);
```

## 📱 Adicionar Funcionalidade Mobile

```javascript
// Detector de dispositivo
const isMobile = () => window.innerWidth < 768;

// Usar em componentes:
{isMobile() && <MobileMenu />}
{!isMobile() && <DesktopMenu />}
```

## 🧪 Testes

**Instalar:** 
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Exemplo de teste:**
```javascript
import { render, screen } from '@testing-library/react';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  test('deve renderizar form de login', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
  });
});
```

## 🚀 Deploy Checklist

- [ ] Remover console.log() de produção
- [ ] Configurar variáveis de ambiente
- [ ] Testar autenticação
- [ ] Verificar CORS
- [ ] Ativar HTTPS
- [ ] Configurar rate limiting
- [ ] Backup do banco de dados
- [ ] Monitoramento com Sentry/LogRocket
- [ ] CDN para assets estáticos
- [ ] Compressão GZIP

## 📚 Documentação de Código

```javascript
/**
 * Busca demandas do usuário com filtros
 * @param {string} token - JWT token
 * @param {object} filters - Filtros (categoria, status)
 * @returns {Promise<Array>} Lista de demandas
 */
async function fetchUserDemandas(token, filters) {
  // ...
}
```

## 🐛 Debug Tips

```javascript
// Logar estado do componente
console.table(state);

// Verificar requisição
console.log('Request:', { url, data, headers });

// Timing de operação
console.time('queryDatabase');
// ... código ...
console.timeEnd('queryDatabase');

// Logar em produção
if (process.env.NODE_ENV === 'production') {
  // Sentry.captureException(error);
}
```

---

**Pronto para customizar!** Siga estos pasos para adicionar suas próprias features.
