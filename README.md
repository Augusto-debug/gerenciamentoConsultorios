# 🧠 Gestão de Consultórios de Psicologia

Este projeto é uma solução fullstack para gestão de consultórios de psicologia, composta por um frontend moderno em React + TypeScript e um backend robusto em NestJS. Foi desenvolvido para facilitar o controle de pacientes, sessões, receitas, despesas e outras rotinas administrativas de profissionais da saúde mental.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend
- **React (TypeScript)** – Interface reativa e escalável.
- **Vite** – Ferramenta de build e desenvolvimento ultrarrápido.
- **Material UI (MUI)** – Componentes visuais modernos e responsivos.
- **React Hook Form + Yup** – Gerenciamento e validação de formulários.
- **Axios** – Comunicação com o backend via HTTP.
- **Notistack** – Sistema de notificações (snackbars).
- **Date-fns** – Manipulação de datas.

### 🧰 Backend
- **NestJS** – Framework Node.js escalável com TypeScript.
- **Prisma ORM** – Acesso ao banco de dados de forma tipada e segura.
- **Bcrypt** – Hash seguro de senhas.
- **JWT (JSON Web Tokens)** – Autenticação e autorização.
- **PostgreSQL** – Banco de dados relacional (substituível por MySQL, SQLite, etc.).

### 🐳 Docker
- **Docker & Docker Compose** – Empacotamento e execução facilitada do projeto completo (frontend, backend e banco de dados) com um único comando.

---

## 👥 Público-alvo

Este projeto é ideal para:
- Psicólogos(as) autônomos(as) que desejam digitalizar a gestão dos atendimentos.
- Clínicas de psicologia que buscam uma solução multiusuário.
- Outros profissionais da saúde que desejam adaptar o sistema.
- Desenvolvedores em busca de um modelo completo de aplicação React + NestJS com boas práticas.

---

## 🎯 Funcionalidades

- 👤 Cadastro, edição e exclusão de pacientes
- 📅 Agendamento e histórico de sessões
- 💰 Controle financeiro (receitas e despesas)
- 📊 Dashboard com indicadores úteis
- 🔐 Autenticação de usuários (JWT)
- 📱 Interface responsiva (desktop e mobile(ainda por fazer))

---

## 🛠️ Como rodar o projeto

### 🔁 Com Docker (recomendado)

Certifique-se de ter o Docker e Docker Compose instalados.

Na raiz do projeto, execute:

```bash
cd docker
docker-compose up --build
```

Isso irá subir automaticamente o frontend, backend e banco de dados.

---

### 🔧 Alternativa: Executar manualmente

#### 1. Banco de Dados

Certifique-se de que o PostgreSQL (ou outro banco relacional) esteja rodando e configure a variável `DATABASE_URL` no arquivo `.env` do backend.

#### 2. Backend

```bash
cd backend
yarn install
yarn run prisma migrate deploy # ou yarn prisma migrate dev para ambiente de desenvolvimento
yarn run start:dev
```

#### 3. Frontend

```bash
cd frontend
yarn install
yarn run dev
```

Acesse o sistema em [http://localhost:5173](http://localhost:5173) (ou a porta configurada pelo Vite).

---

Pronto! Agora você pode utilizar o sistema de gestão de consultórios de psicologia localmente ou via Docker.