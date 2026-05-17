const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
const createProductSchema = z.object({

    name: z
        .string()
        .min(3, {
            message: 'Nome deve ter no mínimo 3 caracteres'
        })
        .max(150, {
            message: 'Nome deve ter no máximo 150 caracteres'
        }),

    price: z
        .coerce
        .number({
            message: 'Preço deve ser um número'
        })
        .min(0, {
            message: 'Preço deve ser maior ou igual a zero'
        })
        .optional(),

    stock: z
        .coerce
        .number({
            message: 'Estoque deve ser um número'
        })
        .int({
            message: 'Estoque deve ser um número inteiro'
        })
        .min(0, {
            message: 'Estoque não pode ser negativo'
        })
        .optional(),

    category_id: z
        .coerce
        .number({
            message: 'Categoria inválida'
        })
        .int(),
        
    expiration_date: z
        .coerce
        .date()
        .nullable()
        .optional()
});

/*
|--------------------------------------------------------------------------
| Atualização de produto
|--------------------------------------------------------------------------
*/
const updateProductSchema = createProductSchema.partial();

module.exports = {
    createProductSchema,
    updateProductSchema
};