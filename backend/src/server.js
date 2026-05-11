require('dotenv').config();

/*
|--------------------------------------------------------------------------
| Variáveis de configuração
|--------------------------------------------------------------------------
|
*/
const express = require('express');
const connection = require('./config/database');
const app = express();

/*
|--------------------------------------------------------------------------
| Requires das rotas
|--------------------------------------------------------------------------
|
*/
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');

/*
|--------------------------------------------------------------------------
| Middlewares globais
|--------------------------------------------------------------------------
|
| Permite receber JSON no body das requisições
|
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Rotas da aplicação
|--------------------------------------------------------------------------
|
| Todas as rotas de autenticação iniciam com /auth
|
| Exemplo:
| POST /auth/login
|
*/
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

/*
|--------------------------------------------------------------------------
| Conexão com banco de dados
|--------------------------------------------------------------------------
|
| Realiza a conexão inicial com o banco ao iniciar a aplicação
|
*/
connection.getConnection()
    .then(() => {
        console.log('Banco conectado com sucesso');
    })
    .catch((error) => {
        console.log(error);
    });

/*
|--------------------------------------------------------------------------
| Rota de teste da API
|--------------------------------------------------------------------------
|
| Utilizada para verificar se a API está online
|
*/
app.get('/', (req, res) => {
    return res.json({
        message: 'API rodando'
    });
});

/*
|--------------------------------------------------------------------------
| Inicialização do servidor
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});