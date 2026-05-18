# Projeto-Integrador-1
Repositório criado para o Projeto Integrador em Computação I do grupo PJI110 - A2026S1N6 - GRUPO 18. 
O tema do PI é: Desenvolvimento de um software com framework web que utilize noções de banco de dados, praticando controle de versão.

## Como o projeto foi construído

O projeto foi construído como uma aplicação web completa de controle de estoque. A ideia foi separar responsabilidades: o frontend em React cuida da interface e da navegação, o backend em Node.js/Express concentra as regras de negócio e a API, e o MySQL guarda os dados. A navegação principal passa por login, home e pelos módulos de produtos, categorias, movimentações e usuários.

Essa separação ajuda a evoluir cada camada com independência. O frontend consome a API via HTTP, enquanto o backend entrega endpoints REST com autenticação e validação. O banco foi modelado para suportar relacionamentos (por exemplo, produtos e categorias) e para manter histórico de registros por soft delete quando necessário.

### Estrutura do backend (Node.js + Express)

- Organização em camadas inspirada em MVC: rotas -> controllers -> services -> models.
- Rotas definem os endpoints de cada recurso (produtos, categorias, usuários, movimentações) e aplicam middlewares de segurança.
- Controllers recebem requests, validam dados (com Zod), tratam erros e montam as respostas HTTP.
- Services concentram regras de negócio, como validar existência antes de atualizar ou remover.
- Models executam as queries SQL, com filtros, paginação, joins e soft delete quando aplicável.
- Middlewares de autenticação (JWT) e autorização por perfil (proprietário/funcionário) protegem as rotas.
- Configuração centralizada via .env (porta, banco, JWT) e CORS liberando o frontend.

### Estrutura do frontend (React)

- React Router organiza as páginas e protege rotas que exigem login.
- O estado de autenticação fica no localStorage; o token é enviado no header Authorization.
- A camada de serviços (src/services) usa Axios com baseURL configurada e interceptador de token.
- As páginas seguem o CRUD: listagem com filtros e paginação, formulários de criação/edição e modal de confirmação para exclusão.

### Exemplo de CRUD (produtos)

- Listar: a página chama o service, que consome GET /products com filtros e paginação; o backend devolve lista e metadados de página.
- Criar: o formulário valida campos, envia POST /products; o controller valida com Zod, o service cria e o model grava no MySQL.
- Editar: a página carrega GET /products/:id, envia PUT /products/:id; o service verifica existência antes de atualizar.
- Excluir: a página dispara DELETE /products/:id; o model aplica soft delete para manter histórico.

### Módulos da aplicação (frontend e backend)

- Autenticação: a tela de login envia credenciais para o backend; a API responde com JWT em /auth/login (e possui /auth/register para cadastro via API). O token fica salvo no navegador e vai no header Authorization.
- Home: página inicial após o login com boas-vindas e acesso aos módulos; o backend garante acesso apenas para usuários autenticados.
- Produtos: listagem com filtros, paginação e seleção; telas de criar/editar; no backend o CRUD roda em /products com validação (Zod), filtros por categoria/preço/validade, join com categorias e soft delete.
- Categorias: tela de listagem com busca simples e páginas de criar/editar; no backend o CRUD fica em /categories com validação de nome e soft delete.
- Movimentações: tela de histórico e formulário para nova entrada/saída/ajuste; no backend /movements grava a movimentação e atualiza o estoque do produto, registrando usuário e produto envolvidos.
- Usuários: listagem com filtros por nome/e-mail e cargo, telas de criar/editar; no backend /users permite cadastrar, listar e atualizar, com validação e bloqueio de duplicidade (email/CPF).
- Permissões: perfis de proprietário e funcionário controlam o que cada usuário pode acessar, tanto no frontend quanto nas rotas do backend.

### Deploy

O frontend foi publicado no Vercel, o backend no Render e o banco no Railway. Assim, cada parte ficou hospedada no servico mais adequado e pode ser atualizada de forma independente.

📄 **Plano de Ação (PDF):** [Abrir no GitHub](https://alunounivespbr-my.sharepoint.com/:w:/r/personal/24200017_aluno_univesp_br/_layouts/15/Doc.aspx?sourcedoc=%7BB4937894-3E19-41A7-AE3D-E9BD7019347A%7D&file=Modelo-Plano_de_Acao%20DRP01-Projeto%20Integrador%20em%20Computa%C3%A7%C3%A3o%20I-Turma%20006.docx&action=default&mobileredirect=true&DefaultItemOpen=1&wdOrigin=WAC.WORD.HOME-BUTTON%2CAPPHOME-WEB.JUMPBACKIN&wdPreviousSession=21702307-bc59-e126-130f-477bb62005c5&wdPreviousSessionSrc=Wac&ct=1773444480865)

## Configuração backend

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar .env
```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=database_name
DB_USER=database_user
DB_PASSWORD=database_password

JWT_SECRET=secret_password
JWT_EXPIRES_IN=7d
```

### 3. Executar backend

```bash
npm run dev
```

## Banco de dados

Criar database:
```sql
CREATE DATABASE estoque_facil;
```

Rode o schema.sql inicial (`backend/database/schema.sql`)

## Usuário administrador padrão

Após executar o seeder inicial (`backend/database/seeders/initial_seed.sql`):

Email: admin@email.com  
Senha: teste123

Usuário destinado **SOMENTE** para ambiente de desenvolvimento


