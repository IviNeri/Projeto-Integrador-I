const z = require('zod');

const updateUserSchema = z.object({
    name: z
        .string({
            required_error: 'O nome é obrigatório'
        })
        .min(3, 'O nome deve ter no mínimo 3 caracteres'),

    email: z
        .string({
            required_error: 'O e-mail é obrigatório'
        })
        .email('Informe um e-mail válido'),

    role: z
        .string({
            required_error: 'O cargo é obrigatório'
        })
        .min(1, 'O cargo é obrigatório')
});

module.exports = {
    updateUserSchema
};