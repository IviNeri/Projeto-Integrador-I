const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');

/*
|--------------------------------------------------------------------------
| Login de usuário
|--------------------------------------------------------------------------
*/
async function login(email, password) {

    const user = await userModel.findByEmail(email);

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const correctPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!correctPassword) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        }
    };
}

/*
|--------------------------------------------------------------------------
| Registro de usuário
|--------------------------------------------------------------------------
*/
async function register(userData) {

    const {
        name,
        email,
        cpf,
        password,
        role
    } = userData;

    // Verifica se já existe cadastro com email enviado
    const userEmailExists = await userModel.findByEmail(
        email
    );

    if (userEmailExists) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }

    // Verifica se já existe cadastro com cpf enviado
    const userCpfExists = await userModel.findByCpf(
        cpf
    );

    if (userCpfExists) {
        throw new Error('CPF_ALREADY_EXISTS');
    }

    // Gera hash da senha
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    // Cria usuário
    const userId = await userModel.create({
        name,
        email,
        cpf,
        password: hashedPassword,
        role
    });

    return {
        id: userId,
        name,
        email,
        cpf,
        role
    };
}

module.exports = {
    login,
    register
};