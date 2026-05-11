const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/
const loginSchema = z.object({
    email: z.email({
        message: 'Email inválido'
    }),

    password: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres'
    })
});

/*
|--------------------------------------------------------------------------
| Registro
|--------------------------------------------------------------------------
*/
const registerSchema = z.object({
    name: z.string().min(3, {
        message: 'Nome deve ter no mínimo 3 caracteres'
    }),

    email: z.email({
        message: 'Email inválido'
    }),

    password: z.string().min(6, {
        message: 'Senha deve ter no mínimo 6 caracteres'
    }),

    cpf: z
    .string()
    .regex(/^\d{11}$/, {
        message: 'CPF inválido'
    }),

    role: z.enum([
        'proprietario',
        'funcionario'
    ], {
        message: 'Role inválida'
    })
});

module.exports = {
    loginSchema,
    registerSchema
};