const authService = require('../services/auth.service');

const {
    loginSchema,
    registerSchema
} = require('../validations/auth.validation');

/*
|--------------------------------------------------------------------------
| Login de usuário
|--------------------------------------------------------------------------
*/
async function login(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const validation = loginSchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const { email, password } = req.body;

        const data = await authService.login(
            email,
            password
        );

        return res.json({
            message: 'Login realizado com sucesso',
            ...data
        });

    } catch (error) {

        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                error: 'Credenciais inválidas'
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
| Registro de usuário
|--------------------------------------------------------------------------
*/
async function register(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const validation = registerSchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const {
            name,
            email,
            cpf,
            password,
            role
        } = req.body;

        const user = await authService.register({
            name,
            email,
            cpf,
            password,
            role
        });

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            user
        });

    } catch (error) {

        if (error.message === 'EMAIL_ALREADY_EXISTS') {
            return res.status(409).json({
                error: 'Email já cadastrado'
            });
        }

        if (error.message === 'CPF_ALREADY_EXISTS') {
            return res.status(409).json({
                error: 'CPF já cadastrado'
            });
        }

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

module.exports = {
    login,
    register
};