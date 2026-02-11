@echo off
echo.
echo 🚀 Iniciando Painel de Produtividade...
echo.

REM Instalar backend
echo 📦 Instalando dependências do Backend...
cd backend
call npm install
cd ..
echo ✓ Backend pronto
echo.

REM Instalar frontend
echo 📦 Instalando dependências do Frontend...
cd frontend
call npm install
cd ..
echo ✓ Frontend pronto
echo.

echo ✓ Instalação completa!
echo.
echo Para iniciar o projeto:
echo.
echo 1. Terminal 1 - Backend:
echo    cd backend ^&^& npm run dev
echo.
echo 2. Terminal 2 - Frontend:
echo    cd frontend ^&^& npm run dev
echo.
echo Acessar em:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3000
echo.
echo Contas de teste:
echo    Admin:    admin@agencia.com / 123456
echo    Usuário:  usuario@agencia.com / 123456
echo.
pause
