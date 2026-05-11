const movementService = require('../services/movement.service');

const {
    createMovementSchema
} = require('../validations/movement.validation');

/*
|--------------------------------------------------------------------------
| Cria movimentação
|--------------------------------------------------------------------------
*/
async function create(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const validation = createMovementSchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const movement = await movementService.create({
            ...req.body,
            user_id: req.user.id
        });

        return res.status(201).json({
            message: 'Movimentação realizada com sucesso',
            movement
        });

    } catch (error) {

        if (error.message === 'PRODUCT_NOT_FOUND') {

            return res.status(404).json({
                error: 'Produto não encontrado'
            });
        }

        if (error.message === 'INSUFFICIENT_STOCK') {

            return res.status(400).json({
                error: 'Estoque insuficiente'
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
| Lista movimentações
|--------------------------------------------------------------------------
*/
async function findAll(req, res) {

    try {

        const page = Number(req.query.page) || 1;

        const {
            movements,
            total
        } = await movementService.findAll(page);

        return res.json({
            data: movements,

            pagination: {
                page,
                limit: 15,
                total,
                totalPages: Math.ceil(total / 15)
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

module.exports = {
    create,
    findAll
};