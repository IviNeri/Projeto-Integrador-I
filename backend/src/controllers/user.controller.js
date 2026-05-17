const userService = require('../services/user.service');

const {
    updateUserSchema
} = require('../validations/user.validation');


const connection = require('../config/database');

const bcrypt = require('bcryptjs');

async function create(req, res) {
    try {

        const {
            name,
            email,
            cpf,
            password,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.create({
            name,
            email,
            cpf,
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            user
        });

    } catch (error) {
        console.log(error);

        /*
        |--------------------------------------------------------------------------
        | E-mail duplicado
        |--------------------------------------------------------------------------
        */
        if (
            error.code === 'ER_DUP_ENTRY' &&
            error.sqlMessage.includes('email')
        ) {

            return res.status(400).json({
                error: 'Já existe um usuário com este e-mail'
            });
        }

        /*
        |--------------------------------------------------------------------------
        | CPF duplicado
        |--------------------------------------------------------------------------
        */
        if (
            error.code === 'ER_DUP_ENTRY' &&
            error.sqlMessage.includes('cpf')
        ) {

            return res.status(400).json({
                error: 'Já existe um usuário com este CPF'
            });
        }

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

/*
|--------------------------------------------------------------------------
| Lista usuários
|--------------------------------------------------------------------------
*/
async function findAll(req, res) {

    try {

        const page = Number(req.query.page) || 1;

        const search = req.query.search || '';

        const role = req.query.role || '';

        const filters = {
            role
        };

        const limit = 15;

        const {
            users,
            total
        } = await userService.findAll(
            page,
            search,
            filters
        );

        return res.json({
            data: users,

            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

/*
|--------------------------------------------------------------------------
| Busca usuário por ID
|--------------------------------------------------------------------------
*/
async function findById(req, res) {

    try {

        const { id } = req.params;

        const user = await userService.findById(
            id
        );

        return res.json(user);

    } catch (error) {

        if (error.message === 'USER_NOT_FOUND') {

            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

/*
|--------------------------------------------------------------------------
| Atualiza usuário
|--------------------------------------------------------------------------
*/
async function update(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const validation = updateUserSchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const { id } = req.params;

        const updatedUser = await userService.update(
            id,
            req.body
        );

        return res.json({
            message: 'Usuário atualizado com sucesso',
            user: updatedUser
        });

    } catch (error) {

        if (error.message === 'USER_NOT_FOUND') {

            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

/*
|--------------------------------------------------------------------------
| Usuário autenticado
|--------------------------------------------------------------------------
*/
async function me(req, res) {

    try {

        return res.json({
            user: req.user
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

module.exports = {
    me,
    create,
    findAll,
    findById,
    update
};