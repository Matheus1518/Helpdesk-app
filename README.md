# HelpDesk System

Sistema para gerenciamento de chamados técnicos e suporte ao cliente, desenvolvido com arquitetura RESTful, autenticação JWT e persistência em banco de dados relacional.

## Arquitetura do Projeto

O projeto é estruturado como um monorepo contendo as aplicações de front-end e back-end em diretórios isolados:

* `helpdesk-api/`: API RESTful desenvolvida em Node.js e Express.
* `helpdesk-front/`: Interface do usuário desenvolvida em React com Vite.
* `database/`: Scripts DDL para modelagem do banco de dados MySQL.

## Tecnologias Utilizadas

### Front-end
* React.js
* Vite
* React Router DOM
* Axios

### Back-end
* Node.js
* Express
* MySQL
* JSON Web Token (JWT)
* Bcrypt.js
* Dotenv

## Funcionalidades Implementadas

* **Autenticação e Autorização:** Controle de acesso baseado em JWT com hashing de senhas via Bcrypt.
* **Gestão de Chamados:** Abertura, categorização, priorização e acompanhamento de tickets.
* **Rotas Dinâmicas:** Visualização detalhada de chamados e histórico de interações (`/chamado/:id`).
* **Sistema de Comentários:** Módulo para comunicação e atualização de status vinculados a cada chamado.

## Estrutura do Banco de Dados

O banco de dados relacional é composto pelas seguintes entidades principais:

* `usuarios`: Armazena credenciais, perfis de acesso (Cliente/Técnico) e dados cadastrais.
* `chamados`: Registra os tickets com relacionamentos para o usuário solicitante.
* `comentarios`: Mantém o histórico de mensagens e atualizações associadas a cada ticket.

## Front-end

A interface do sistema foi desenvolvida em React com Vite e oferece:

* login do usuário;
* painel de acompanhamento de chamados;
* detalhes do chamado e histórico de comentários;
* navegação entre páginas com React Router.

## Execução Local

### Pré-requisitos
* Node.js (versão LTS recomendada)
* Instância ativa do MySQL

### Configuração do Banco de Dados
Execute o script SQL disponível em `database/schema.sql` no seu SGBD MySQL para instanciar as tabelas e relacionamentos necessários.

### Inicialização da API (Back-end)
```bash
cd helpdesk-api
npm install
# Crie o arquivo .env conforme a estrutura descrita em .env.example
npm start
```

### Inicialização do Front-end
```bash
cd helpdesk-front
npm install
npm run dev
```

## Autor

Matheus Oliveira

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.