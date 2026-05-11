const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Criação de categoria
|--------------------------------------------------------------------------
*/
const createCategorySchema = z.object({

    name: z
        .string()
        .min(2, {
            message: 'Nome deve ter no mínimo 2 caracteres'
        })
        .max(100, {
            message: 'Nome deve ter no máximo 100 caracteres'
        })
});

/*
|--------------------------------------------------------------------------
| Atualização de categoria
|--------------------------------------------------------------------------
*/
const updateCategorySchema = createCategorySchema.partial();

module.exports = {
    createCategorySchema,
    updateCategorySchema
};