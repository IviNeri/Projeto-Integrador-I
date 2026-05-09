# Projeto-Integrador-1
Repositório criado para o Projeto Integrador em Computação I do grupo PJI110 - A2026S1N6 - GRUPO 18. 
O tema do PI é: Desenvolvimento de um software com framework web que utilize noções de banco de dados, praticando controle de versão.

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


