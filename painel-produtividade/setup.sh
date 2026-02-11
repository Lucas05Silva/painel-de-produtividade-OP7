#!/bin/bash

echo "🚀 Iniciando Painel de Produtividade..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Instalar backend
echo -e "${BLUE}📦 Instalando dependências do Backend...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✓ Backend pronto${NC}"
echo ""

# Instalar frontend
echo -e "${BLUE}📦 Instalando dependências do Frontend...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✓ Frontend pronto${NC}"
echo ""

echo -e "${GREEN}✓ Instalação completa!${NC}"
echo ""
echo -e "${BLUE}Para iniciar o projeto:${NC}"
echo ""
echo "1. Terminal 1 - Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo -e "${BLUE}Acessar em:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo -e "${BLUE}Contas de teste:${NC}"
echo "   Admin:    admin@agencia.com / 123456"
echo "   Usuário:  usuario@agencia.com / 123456"
