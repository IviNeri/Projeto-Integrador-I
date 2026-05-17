require('dotenv').config();

/*
|--------------------------------------------------------------------------
| Variáveis de configuração
|--------------------------------------------------------------------------
*/
const express = require('express');

const connection = require('./config/database');

const app = express();

/*
|--------------------------------------------------------------------------
| Requires das rotas
|--------------------------------------------------------------------------
*/
const authRoutes = require('./routes/auth.routes');

const userRoutes = require('./routes/user.routes');

const productRoutes = require('./routes/product.routes');

const categoryRoutes = require('./routes/category.routes');

const movementRoutes = require('./routes/movement.routes');

/*
|--------------------------------------------------------------------------
| Middlewares globais
|--------------------------------------------------------------------------
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| CORS para ambiente de desenvolvimento
|--------------------------------------------------------------------------
*/
const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]);

app.use((req, res, next) => {

    const origin = req.headers.origin;

    if (origin && allowedOrigins.has(origin)) {

        res.setHeader(
            'Access-Control-Allow-Origin',
            origin
        );
    }

    res.setHeader('Vary', 'Origin');

    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );

    if (req.method === 'OPTIONS') {

        return res.sendStatus(204);
    }

    return next();
});

/*
|--------------------------------------------------------------------------
| Rotas da aplicação
|--------------------------------------------------------------------------
*/
app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/products', productRoutes);

app.use('/categories', categoryRoutes);

app.use('/movements', movementRoutes);

/*
|--------------------------------------------------------------------------
| Rota de teste
|--------------------------------------------------------------------------
*/
app.get('/', (req, res) => {

    return res.json({
        message: 'API rodando'
    });
});

/*
|--------------------------------------------------------------------------
| Middleware de rota não encontrada
|--------------------------------------------------------------------------
*/
app.use((req, res) => {

    return res.status(404).json({
        error: 'Rota não encontrada'
    });
});

/*
|--------------------------------------------------------------------------
| Conexão com banco
|--------------------------------------------------------------------------
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
| Inicialização do servidor
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor rodando na porta ${PORT}`);
});