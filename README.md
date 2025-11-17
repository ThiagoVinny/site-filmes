# 🎬 Site Filmes — Plataforma de Avaliação de Séries e Filmes

````git

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![TMDB API](https://img.shields.io/badge/API-TMDB-orange?logo=themoviedatabase)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> Projeto full-stack desenvolvido em **React + Node.js + PostgreSQL**, com integração à **API TMDB** para exibir e avaliar séries e filmes.  
> Os usuários podem criar pastas, comentar, avaliar e gerenciar suas próprias listas.

---

## 🚀 Começando

Este projeto foi inicializado com [Create React App](https://github.com/facebook/create-react-app) e expandido com backend em Node.js + banco PostgreSQL.

### 📦 Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/SEU_USUARIO/site-filmes.git
cd site-filmes
npm install
````

Para instalar o backend:

```bash
cd server
npm install
```

---

## ⚙️ Configuração

### 🔐 Backend (.env)

Crie o arquivo `.env` dentro da pasta `server`:

```env
PORT=4000
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha
PGDATABASE=site_filmes
JWT_SECRET=sua_chave_super_secreta
JWT_EXPIRES_IN=7d
```

Rode o servidor:

```bash
node index.js
```

O backend rodará em: [http://localhost:4000](http://localhost:4000)

---

### 🌐 Frontend (.env)

Crie o arquivo `.env` na raiz do projeto React:

```env
REACT_APP_API_KEY=SEU_TOKEN_DA_TMDB
REACT_APP_BASE_URL=https://api.themoviedb.org/3
REACT_APP_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
REACT_APP_API_BASE_URL=http://localhost:4000
```

Inicie o frontend:

```bash
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🧠 Principais Funcionalidades

* 🔐 **Autenticação de usuários (login e registro com JWT)**
* 🎞️ **Busca e exibição de séries/filmes via TMDB**
* 🧾 **Criação e exclusão de pastas personalizadas**
* 💬 **Sistema de avaliações e comentários**
* ⭐ **Notas individuais por usuário**
* 🧍‍♂️ **Perfil com abas:**

  * Perfil
  * Avaliações
  * Séries assistidas

---

## 🧩 Scripts Disponíveis

No diretório do projeto (frontend), você pode rodar:

### `npm start`

Executa o app em modo de desenvolvimento.
Abra [http://localhost:3000](http://localhost:3000).

### `npm run build`

Cria o build otimizado para produção dentro da pasta `build`.

### `npm test`

Executa os testes interativos (se houver configurados).

### `npm run eject`

Exibe todas as configurações internas do Create React App (irreversível).

---

## 📁 Estrutura do Projeto

```
site-filmes/
├── server/                # Backend Node.js + Express + PostgreSQL
│   ├── routes/            # Rotas (auth, folders, reviews)
│   ├── db.js              # Conexão com o banco
│   ├── index.js           # Ponto de entrada da API
│   └── .env               # Variáveis de ambiente
│
├── src/                   # Frontend React
│   ├── components/        # Componentes reutilizáveis
│   ├── context/           # Context API (Auth)
│   ├── pages/             # Páginas (Home, Login, Register, Profile, etc.)
│   ├── services/          # Comunicação com o backend
│   ├── App.js             # Rotas principais
│   └── index.js           # Ponto de entrada
│
├── .env                   # Configurações da API TMDB e servidor local
└── README.md
```

---

## 🧠 Próximas Features

* [ ] Upload de foto de perfil
* [ ] Sistema de curtidas em comentários
* [ ] Modo escuro/claro
* [ ] Rankings de séries mais avaliadas
* [ ] Seguir outros usuários

---

## 🧑‍💻 Autor

**Thiago Vinny**
📧 [thiagovinny.dev@gmail.com](mailto:thiagovinny.dev@gmail.com)
🌐 [github.com/ThiagoVinny](https://github.com/ThiagoVinny)

---

## 🪪 Licença

Distribuído sob a licença **MIT**.
