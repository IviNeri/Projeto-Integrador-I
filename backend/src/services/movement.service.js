const movementModel = require('../models/movement.model');

const productModel = require('../models/product.model');

/*
|--------------------------------------------------------------------------
| Cria movimentação
|--------------------------------------------------------------------------
*/
async function create(data) {

    const {
        product_id,
        type,
        quantity,
        user_id
    } = data;

    /*
    |--------------------------------------------------------------------------
    | Verifica se produto existe
    |--------------------------------------------------------------------------
    */
    const product = await productModel.findById(
        product_id
    );

    if (!product) {
        throw new Error('PRODUCT_NOT_FOUND');
    }

    let newStock = product.stock;

    /*
    |--------------------------------------------------------------------------
    | Entrada
    |--------------------------------------------------------------------------
    */
    if (type === 'entrada') {

        newStock += quantity;
    }

    /*
    |--------------------------------------------------------------------------
    | Saída
    |--------------------------------------------------------------------------
    */
    if (type === 'saida') {

        if (product.stock < quantity) {
            throw new Error('INSUFFICIENT_STOCK');
        }

        newStock -= quantity;
    }

    /*
    |--------------------------------------------------------------------------
    | Ajuste
    |--------------------------------------------------------------------------
    */
    if (type === 'ajuste') {

        newStock = quantity;
    }

    /*
    |--------------------------------------------------------------------------
    | Atualiza estoque do produto
    |--------------------------------------------------------------------------
    */
    await productModel.update(
        product_id,
        {
            stock: newStock
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Cria movimentação
    |--------------------------------------------------------------------------
    */
    const movementId = await movementModel.create({
        product_id,
        type,
        quantity,
        user_id
    });

    return {
        id: movementId,
        product_id,
        type,
        quantity,
        stock: newStock
    };
}

/*
|--------------------------------------------------------------------------
| Lista movimentações
|--------------------------------------------------------------------------
*/
async function findAll(page) {

    const limit = 15;

    const safePage = Number(page) > 0 ? Number(page) : 1;

    return await movementModel.findAll(
        safePage,
        limit
    );
}

module.exports = {
    create,
    findAll
};