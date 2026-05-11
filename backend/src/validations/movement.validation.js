const { z } = require('zod');

/*
|--------------------------------------------------------------------------
| Criação de movimentação
|--------------------------------------------------------------------------
*/
const createMovementSchema = z.object({

    product_id: z
        .coerce
        .number({
            message: 'Produto inválido'
        })
        .int(),

    type: z
        .enum(
            [
                'entrada',
                'saida',
                'ajuste'
            ],
            {
                message: 'Tipo de movimentação inválido'
            }
        ),

    quantity: z
        .coerce
        .number({
            message: 'Quantidade inválida'
        })
        .int({
            message: 'Quantidade deve ser um número inteiro'
        })
        .positive({
            message: 'Quantidade deve ser maior que zero'
        })
});

module.exports = {
    createMovementSchema
};