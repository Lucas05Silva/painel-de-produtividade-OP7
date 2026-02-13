# 🧪 Guia de Testes - Painel de Produtividade OP7

## 💡 Antes de Começar

1. **Limpe o banco de dados anterior**:
   ```bash
   # Windows (PowerShell)
   del backend\database.db
   
   # Linux/Mac
   rm backend/database.db
   ```
   Isso força a criação automática do novo schema com ADM Supremo padrão.

2. **Instale dependências**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

---

## ✅ Testes de Autenticação

### 1. **Login com ADM Supremo Padrão**
- **Email**: `admin@agencia.com`
- **Senha**: `AdminSupremo123!`
- **Esperado**: Acesso ao painel admin + Dashboard completo

### 2. **Registro de Novo Usuário**
- Ir para página de Registro
- Selecionar tipo "Colaborador"
- **Esperado**: Usuário criado com sucesso
- Fazer login com novo usuário
- **Esperado**: Dashboard apenas com dados do colaborador

### 3. **Registro de Diretor/Gestor**
- Registrar novo usuário como "Diretor"
- **Esperado**: Acesso à visualização de equipe no Dashboard
- Sistema deve permitir múltiplos Diretores

### 4. **Proteção - Não Criar ADM Segundo**
- Tentar registrar como "ADM Supremo"
- **Esperado**: Backend rejeita (apenas um permitido)

---

## 🎨 Testes de Design & Tema

### 1. **Verificar Tema Light Corporativo**
- [ ] Fundo branco (#ffffff)
- [ ] Textos em preto (#000000)
- [ ] Botões azuis (#3b82f6)
- [ ] Bordas cinza claro (#e5e7eb)
- [ ] Logo OP7 em Navbar e Sidebar

### 2. **Responsividade**
- [ ] Testar em desktop (1920px)
- [ ] Testar em tablet (768px)
- [ ] Testar em mobile (375px)
- [ ] Sidebar deve ser colapsível em mobile

### 3. **Componentes Reutilizáveis**
- [ ] StatCard em Dashboard (cores corretas)
- [ ] Button com variantes (primary, secondary, danger)
- [ ] Logo component (sm, md, lg) em diferentes páginas

---

## 🔐 Testes de Controle de Acesso

### 1. **Colaborador**
- [ ] Pode ver Dashboard pessoal
- [ ] Pode criar demandas
- [ ] Pode ver apenas suas demandas
- [ ] Menu não mostra "Admin Panel"
- [ ] Não consegue acessar `/admin` diretamente

### 2. **Diretor/Gestor**
- [ ] Dashboard mostra demandas da equipe
- [ ] Menu mostra "Admin Panel" (opcional)
- [ ] Pode visualizar dados de colaboradores
- [ ] Informações de ranking incluem equipe

### 3. **ADM Supremo**
- [ ] Acesso total a Dashboard
- [ ] Admin Panel completamente funcional
- [ ] Pode alterar tipo de usuários
- [ ] Pode deletar usuários
- [ ] Não pode deletar a si mesmo
- [ ] Badge "ADM Supremo" em vermelho

---

## 📋 Testes de Demandas

### 1. **Criar Demanda**
- [ ] Dropdown de categoria com 5 opções fixas
- [ ] Validação: cliente obrigatório
- [ ] Validação: descrição obrigatória
- [ ] Validação: tempo entre 1-1440 minutos
- [ ] Mensagem de sucesso com redirecionamento
- [ ] Erro exibido com ícone AlertCircle

### 2. **Listar Demandas**
- [ ] Cards mostram categorias com cores corretas
- [ ] Filtro por categoria funciona
- [ ] Filtro por status funciona
- [ ] Botão "Limpar Filtros" funciona
- [ ] Estado vazio shows com mensagem
- [ ] Stats cards atualizam com filtros

### 3. **Visualização Kanban**
- [ ] 3 colunas: Pendente, Em andamento, Finalizado
- [ ] Drag-and-drop funciona
- [ ] Status atualiza ao soltar
- [ ] Cores de categoria corretas

### 4. **Categorias Fixas**
```
✓ Automação & IA (Verde)
✓ Planejamento (Azul)
✓ Criação & Design (Roxo)
✓ Suporte & Atendimento (Rosa)
✓ Tráfego Pago (Vermelho)
```

---

## 👥 Testes do Painel Admin

### 1. **Aba Usuários**
- [ ] Mostrar tabela com email, tipo, data criação
- [ ] Dropdown para alterar tipo (colaborador ↔ diretor)
- [ ] Botão deletar funcional
- [ ] Proteção: não pode deletar a si mesmo
- [ ] Stats cards: Total, Colaboradores, Diretores

### 2. **Aba Demandas**
- [ ] Tabela com responsável, categoria, status
- [ ] Mostram primeiras 20 demandas
- [ ] Stats cards: Total, Pendentes, Em Andamento, Finalizadas
- [ ] Filtragem por usuário (opcional)

### 3. **Acesso Restrito**
- [ ] Apenas ADM Supremo pode acessar
- [ ] Colaborador redirecionado da página admin
- [ ] Diretor redirecionado também
- [ ] Alerta explicando acesso restrito

---

## 📊 Testes de Dashboard

### 1. **Colaborador**
- [ ] Mostra apenas suas estatísticas
- [ ] Cards: Total, Em Andamento, Finalizadas, Pendentes
- [ ] Tabela de suas demandas recentes
- [ ] Não mostra coluna "Responsável"

### 2. **Diretor**
- [ ] Dados incluem equipe
- [ ] Tabela mostra coluna "Responsável"
- [ ] Stats refletem demandas da equipe

### 3. **ADM Supremo**
- [ ] Visão geral completa do sistema
- [ ] Cards incluem totais globais
- [ ] Tabela mostra TODAS as demandas
- [ ] Coluna de responsável visível
- [ ] Info cards sobre usuários

---

## 🔧 Testes de Backend

### 1. **Endpoints de Aplicação**
```bash
# Verificar endpoints estão respondendo
GET  /api/verify          # Token válido?
POST /api/login           # Login funciona?
POST /api/register        # Registro funciona?
GET  /api/demandas        # Retorna apenas do usuário?
```

### 2. **Endpoints Admin**
```bash
# Apenas ADM Supremo deve acessar
GET    /api/admin/users              # Lista de usuários
PUT    /api/admin/users/:id/type     # Alterar tipo
DELETE /api/admin/users/:id          # Deletar usuário
GET    /api/admin/demandas           # Todas demandas
GET    /api/categorias               # Categorias fixas
```

### 3. **Validações Backend**
- [ ] Categoria inválida é rejeitada
- [ ] Apenas 1 ADM Supremo permitido
- [ ] Usuário não pode se auto-deletar
- [ ] Token inválido retorna 401
- [ ] Acesso negado retorna 403

---

## 🐛 Verificação de Erros

### 1. **Console do Navegador**
- [ ] Sem erros vermelhos
- [ ] Warnings aceitáveis (não críticos)

### 2. **Network Tab**
- [ ] Requisições retornam status correto (200, 400, 401, 403)
- [ ] Sem requisições pendentes/travadas
- [ ] Token incluído nos headers

### 3. **Banco de Dados**
- [ ] Tabelas criadas corretamente
- [ ] ADM Supremo criado na primeira vez
- [ ] Usuários tem `userType` (não `role`)
- [ ] Demandas tem `category` (não `categoria`)

---

## 📝 Checklist Final

- [ ] Todos os testes de autenticação passaram
- [ ] Tema light corporativo aplicado uniformemente
- [ ] Controle de acesso funciona em 3 níveis
- [ ] Demandas com categorias fixas funcionam
- [ ] Admin panel gerencia usuários corretamente
- [ ] Drag-and-drop no Kanban funciona
- [ ] Responsividade testada em 3 tamanhos
- [ ] Sem erros no console
- [ ] Backend valida categorias
- [ ] Database inicializado corretamente

---

## 🚀 Comandos Úteis para Testes

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (nova aba)
cd frontend
npm run dev

# Acessar
# http://localhost:5173

# Resetar banco (se necessário)
# delete backend/database.db e reiniciar
```

---

## 📞 Troubleshooting

| Problema | Solução |
|----------|---------|
| Login não funciona | Resetar database.db, verificar migrations |
| Categoria não aparece | Verificar CATEGORIAS_FIXAS em backend e frontend |
| Tema escuro ainda aparece | Limpar cache do navegador (Ctrl+Shift+Del) |
| Drag-drop não funciona | Verificar suporte a HTML5 Drag&Drop no navegador |
| Admin não consegue deletar usuário | Verificar se token é de ADM Supremo |
| Logo não aparece | Verificar caminho de importação em Logo.jsx |

---

**Status**: ✅ Pronto para Testes  
**Data**: 2024  
**Versão**: 1.0.0 Modernizado

