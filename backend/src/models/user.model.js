const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Busca usuário por email
|--------------------------------------------------------------------------
*/
async function findByEmail(email) {

    const [users] = await connection.query(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
    );

    return users[0] || null;
}

/*
|--------------------------------------------------------------------------
| Busca usuário por CPF
|--------------------------------------------------------------------------
*/
async function findByCpf(cpf) {

    const [users] = await connection.query(
        'SELECT * FROM users WHERE cpf = ? LIMIT 1',
        [cpf]
    );

    return users[0] || null;
}

/*
|--------------------------------------------------------------------------
| Cria novo usuário
|--------------------------------------------------------------------------
*/
async function create(userData) {

    const {
        name,
        email,
        cpf,
        password,
        role
    } = userData;

    const [result] = await connection.query(
        `
        INSERT INTO users (
            name,
            email,
            cpf,
            password,
            role
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            name,
            email,
            cpf,
            password,
            role
        ]
    );

    return result.insertId;
}

module.exports = {
    findByEmail,
    findByCpf,
    create
};