require('dotenv').config();

const express = require('express');
const connection = require('./config/database');

const app = express();

app.use(express.json());

connection.getConnection()
    .then(() => {
        console.log('Banco conectado com sucesso');
    })
    .catch((error) => {
        console.log(error);
    });

app.get('/', (req, res) => {
    return res.json({
        message: 'API rodando'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando: ${PORT}`);
});