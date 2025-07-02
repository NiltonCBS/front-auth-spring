# Front Auth Spring

Este projeto é a interface web de autenticação integrada a uma API Spring Boot. Ele permite aos usuários se registrarem, fazerem login e gerenciarem sessões autenticadas com uso de JWT (JSON Web Token), sendo ela o CRUD completo de despesas.

## 🚀 Tecnologias Utilizadas

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- Integração com backend em Spring Boot (JWT Auth)

## 🎯 Funcionalidades

- Cadastro de usuário
- Login com autenticação JWT
- Proteção de rotas
- Armazenamento seguro do token no localStorage

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js e npm instalados
- Backend em execução (ver: [API Spring Auth](https://github.com/NiltonCBS/spring-auth))

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/NiltonCBS/front-auth-spring.git

# Acesse a pasta
cd front-auth-spring

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

🔐 O projeto se comunica com uma API Spring Boot que deve estar rodando em paralelo, geralmente na porta 8080.

## 📂 Estrutura de Pastas
```
front-auth-spring/
├── src/
│ ├── components/   # Componentes para reutilização
│ ├── pages/        # Páginas (Login, Register, Despesas)
│ ├── App.jsx       # Componente principal
│ ├── main.jsx      # Ponto de entrada do React
├── public/
├── package.json
└── vite.config.js
```
## 🔒 Autenticação

Após o login, o token JWT é armazenado no localStorage.

As requisições autenticadas incluem o token no cabeçalho Authorization: Bearer <token>.

As rotas protegidas só são acessíveis com um token válido.
