const categoryService = require('../services/category.service');

const {
    createCategorySchema,
    updateCategorySchema
} = require('../validations/category.validation');

/*
|--------------------------------------------------------------------------
| Criação de categoria
|--------------------------------------------------------------------------
*/
async function create(req, res) {

    try {

        // Validação dos dados
        const validation = createCategorySchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const categoryId = await categoryService.create(
            req.body
        );

        return res.status(201).json({
            message: 'Categoria criada com sucesso',
            category: {
                id: categoryId,
                ...req.body
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
| Lista categorias
|--------------------------------------------------------------------------
*/
async function findAll(req, res) {

    try {

        const categories = await categoryService.findAll();

        return res.json(categories);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

/*
|--------------------------------------------------------------------------
| Busca categoria por ID
|--------------------------------------------------------------------------
*/
async function findById(req, res) {

    try {

        const { id } = req.params;

        const category = await categoryService.findById(
            id
        );

        return res.json(category);

    } catch (error) {

        if (error.message === 'CATEGORY_NOT_FOUND') {

            return res.status(404).json({
                error: 'Categoria não encontrada'
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
| Atualiza categoria
|--------------------------------------------------------------------------
*/
async function update(req, res) {

    try {

        // Validação dos dados
        const validation = updateCategorySchema.safeParse(
            req.body
        );

        if (!validation.success) {

            return res.status(400).json({
                error: validation.error.issues[0].message
            });
        }

        const { id } = req.params;

        const category = await categoryService.update(
            id,
            req.body
        );

        return res.json({
            message: 'Categoria atualizada com sucesso',
            category
        });

    } catch (error) {

        if (error.message === 'CATEGORY_NOT_FOUND') {

            return res.status(404).json({
                error: 'Categoria não encontrada'
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
| Remove categoria
|--------------------------------------------------------------------------
*/
async function remove(req, res) {

    try {

        const { id } = req.params;

        await categoryService.remove(id);

        return res.json({
            message: 'Categoria removida com sucesso'
        });

    } catch (error) {

        if (error.message === 'CATEGORY_NOT_FOUND') {

            return res.status(404).json({
                error: 'Categoria não encontrada'
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