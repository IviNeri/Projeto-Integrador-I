const userModel = require('../models/user.model');
const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Lista usuários
|--------------------------------------------------------------------------
*/
async function findAll(page, search = '', filters = {}) {

    const limit = 15;

    const {
        users,
        total
    } = await userModel.findAll(
        page,
        limit,
        search,
        filters
    );

    return {
        users,
        total
    };
}

/*
|--------------------------------------------------------------------------
| Busca usuário por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const user = await userModel.findById(id);

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    return user;
}

/*
|--------------------------------------------------------------------------
| Atualiza usuário
|--------------------------------------------------------------------------
*/
async function update(id, userData) {

    const existingUser = await userModel.findById(id);

    if (!existingUser) {
        throw new Error('USER_NOT_FOUND');
    }

    return userModel.update(id, userData);
}

async function create(data) {

    const {
        name,
        email,
        cpf,
        password,
        role
    } = data;

    const [result] = await connection.execute(
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

    return {
        id: result.insertId,
        name,
        email,
        cpf,
        role
    };
}

module.exports = {
    findAll,
    findById,
    update,
    create
};