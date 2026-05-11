const productModel = require('../models/product.model');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
async function create(productData) {

    const productId = await productModel.create(
        productData
    );

    return {
        id: productId,
        ...productData
    };
}

/*
|--------------------------------------------------------------------------
| Lista produtos
|--------------------------------------------------------------------------
*/
async function findAll(page, search) {

    const limit = 15;

    const data = await productModel.findAll(
        page,
        limit,
        search
    );

    return data;
}

/*
|--------------------------------------------------------------------------
| Busca produto por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const product = await productModel.findById(
        id
    );

    if (!product) {
        throw new Error('PRODUCT_NOT_FOUND');
    }

    return product;
}

/*
|--------------------------------------------------------------------------
| Atualiza produto
|--------------------------------------------------------------------------
*/
async function update(id, productData) {

    const productExists = await productModel.findById(
        id
    );

    if (!productExists) {
        throw new Error('PRODUCT_NOT_FOUND');
    }

    const updatedProduct = await productModel.update(
        id,
        productData
    );

    return updatedProduct;
}

/*
|--------------------------------------------------------------------------
| Remove produto
|--------------------------------------------------------------------------
*/
async function remove(id) {

    const productExists = await productModel.findById(
        id
    );

    if (!productExists) {
        throw new Error('PRODUCT_NOT_FOUND');
    }

    await productModel.remove(id);
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};