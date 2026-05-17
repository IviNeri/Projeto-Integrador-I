const productService = require('../services/product.service');

const {
    createProductSchema,
    updateProductSchema
} = require('../validations/product.validation');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
async function create(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const payload = {
            ...req.body,
            price:
                req.body.price === undefined ||
                req.body.price === null ||
                req.body.price === ''
                    ? 0
                    : req.body.price,
            stock:
                req.body.stock === undefined ||
                req.body.stock === null ||
                req.body.stock === ''
                    ? 0
                    : req.body.stock,
            expiration_date: req.body.expiration_date ?? null
        };

        const validation = createProductSchema.safeParse(
            payload
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const product = await productService.create(
            payload
        );

        return res.status(201).json({
            message: 'Produto criado com sucesso',
            product
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
| Lista produtos
|--------------------------------------------------------------------------
*/
async function findAll(req, res) {

    try {

        const page = Number(req.query.page) || 1;

        const search = req.query.search || '';

        const parseNumber = (value) => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        };

        const categoryId = parseNumber(req.query.category_id);
        const minPrice = parseNumber(req.query.min_price);
        const maxPrice = parseNumber(req.query.max_price);

        const expirationFrom = req.query.expiration_from || null;
        const expirationTo = req.query.expiration_to || null;

        const filters = {
            categoryId,
            minPrice,
            maxPrice,
            expirationFrom,
            expirationTo
        };

        const limit = 15;

        const {
            products,
            total
        } = await productService.findAll(
            page,
            search,
            filters
        );

        return res.json({
            data: products,

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
| Busca produto por ID
|--------------------------------------------------------------------------
*/
async function findById(req, res) {

    try {

        const { id } = req.params;

        const product = await productService.findById(
            id
        );

        return res.json(product);

    } catch (error) {

        if (error.message === 'PRODUCT_NOT_FOUND') {

            return res.status(404).json({
                error: 'Produto não encontrado'
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
| Atualiza produto
|--------------------------------------------------------------------------
*/
async function update(req, res) {

    try {

        /*
        |--------------------------------------------------------------------------
        | Validação dos dados
        |--------------------------------------------------------------------------
        */
        const validation = updateProductSchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const { id } = req.params;

        const updatedProduct = await productService.update(
            id,
            req.body
        );

        return res.json({
            message: 'Produto atualizado com sucesso',
            product: updatedProduct
        });

    } catch (error) {

        if (error.message === 'PRODUCT_NOT_FOUND') {

            return res.status(404).json({
                error: 'Produto não encontrado'
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
| Remove produto
|--------------------------------------------------------------------------
*/
async function remove(req, res) {

    try {

        const { id } = req.params;

        await productService.remove(id);

        return res.json({
            message: 'Produto removido com sucesso'
        });

    } catch (error) {

        if (error.message === 'PRODUCT_NOT_FOUND') {

            return res.status(404).json({
                error: 'Produto não encontrado'
            });
        }

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};