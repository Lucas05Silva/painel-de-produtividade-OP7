Setup e execução local (Windows)

1) Backend

Abra um terminal PowerShell/CMD na pasta `backend` e rode:

```powershell
cd backend
npm install
# opcional: copie .env.local de .env.example e ajuste
# copie .env.local se necessário
# cp .env.example .env.local  (use copy no Windows se preferir)
npm run dev
```

O backend ficará em `http://localhost:3000`.
Verifique saúde em `http://localhost:3000/health`.

2) Frontend

Abra outro terminal na pasta `frontend` e rode:

```powershell
cd frontend
npm install
npm run dev
```

O frontend (Vite) roda em `http://localhost:5173` e o proxy `/api` aponta para `http://localhost:3000`.

Observações
- Se usar Docker Compose, os serviços já mapeiam portas 3000 e 80 (veja `docker-compose.yml`).
- Se houver erros de DB, verifique o arquivo `backend/database.db` e permissões.
