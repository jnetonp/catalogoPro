# CatálogoPro

Sistema web de catálogo de produtos com filtros, autenticação JWT e painel administrativo.

**Aluno:** João Luiz Alves Neto  
**Curso:** Análise e Desenvolvimento de Sistemas — Unifor  
**Disciplina:** Desenvolvimento de Software em Nuvem

---

## Tecnologias

- **Front-end:** React 18 + Vite — deploy na Vercel
- **Back-end:** Node.js + Express + Docker — deploy no Render
- **Banco de dados:** Serviço gerenciado em nuvem (Supabase / MongoDB Atlas)
- **CI/CD:** GitHub Actions

---

## Como rodar localmente

### Com Docker Compose

```bash
git clone https://github.com/seu-usuario/catalogo-pro
cd catalogo-pro
docker-compose up --build
```

### Sem Docker

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse em: `http://localhost:5173`  
API em: `http://localhost:3001`  
Docs Swagger: `http://localhost:3001/api/docs`

---

## Usuários de demonstração

| Perfil  | E-mail              | Senha    |
|---------|---------------------|----------|
| Admin   | admin@catalogo.com  | admin123 |
| Usuário | user@catalogo.com   | user123  |

---

## Variáveis de ambiente

**Backend (`backend/.env`):**
```
PORT=3001
JWT_SECRET=sua_chave_secreta
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```
VITE_API_URL=http://localhost:3001/api
```

---

## Endpoints principais

| Método | Rota                | Acesso  | Descrição          |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/login     | Público | Login              |
| POST   | /api/auth/register  | Público | Cadastro           |
| GET    | /api/products       | Público | Listar produtos    |
| GET    | /api/products/:id   | Público | Detalhe do produto |
| POST   | /api/products       | Admin   | Criar produto      |
| PUT    | /api/products/:id   | Admin   | Editar produto     |
| DELETE | /api/products/:id   | Admin   | Remover produto    |

Filtros disponíveis: `?search=`, `?category=`, `?minPrice=`, `?maxPrice=`, `?page=`, `?limit=`

---

## Testes

```bash
cd backend
npm test
```

---

## Estrutura do projeto

```
catalogo-pro/
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD
├── backend/
│   ├── src/
│   │   ├── routes/               # auth.js, products.js
│   │   ├── middleware/auth.js    # Validação JWT
│   │   ├── db.js                 # Banco de dados
│   │   └── server.js
│   ├── tests/api.test.js
│   ├── Dockerfile
│   └── swagger.yaml
├── frontend/
│   └── src/
│       ├── pages/                # Home, Login, Register, Admin, ProductDetail
│       ├── components/           # Navbar, ProductCard
│       └── services/             # api.js, AuthContext.jsx
├── docker-compose.yml
└── README.md
```
