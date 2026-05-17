const categoryModel = require('../models/category.model');

/*
|--------------------------------------------------------------------------
| Criar categoria
|--------------------------------------------------------------------------
*/
async function create(data) {

    return await categoryModel.create(data);
}

/*
|--------------------------------------------------------------------------
| Listar categorias
|--------------------------------------------------------------------------
*/
async function findAll(page, search) {

    const limit = 15;

    const data = await categoryModel.findAll(
        page,
        limit,
        search
    );

    return data;
}

/*
|--------------------------------------------------------------------------
| Buscar por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const category = await categoryModel.findById(id);

    if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    return category;
}

/*
|--------------------------------------------------------------------------
| Atualizar categoria
|--------------------------------------------------------------------------
*/
async function update(id, data) {

    const exists = await categoryModel.findById(id);

    if (!exists) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    return await categoryModel.update(id, data);
}

/*
|--------------------------------------------------------------------------
| Remover categoria
|--------------------------------------------------------------------------
*/
async function remove(id) {

    const exists = await categoryModel.findById(id);

    if (!exists) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    await categoryModel.remove(id);
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};