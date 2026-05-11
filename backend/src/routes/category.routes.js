const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/category.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorize = require('../middlewares/authorize.middleware');

/*
|--------------------------------------------------------------------------
| Lista categorias
|--------------------------------------------------------------------------
*/
router.get(
    '/',
    authMiddleware,
    authorize(['proprietario', 'funcionario']),
    categoryController.findAll
);

/*
|--------------------------------------------------------------------------
| Busca categoria por ID
|--------------------------------------------------------------------------
*/
router.get(
    '/:id',
    authMiddleware,
    authorize(['proprietario', 'funcionario']),
    categoryController.findById
);

/*
|--------------------------------------------------------------------------
| Criação de categoria
|--------------------------------------------------------------------------
*/
router.post(
    '/',
    authMiddleware,
    authorize(['proprietario']),
    categoryController.create
);

/*
|--------------------------------------------------------------------------
| Atualiza categoria
|--------------------------------------------------------------------------
*/
router.put(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    categoryController.update
);

/*
|--------------------------------------------------------------------------
| Remove categoria
|--------------------------------------------------------------------------
*/
router.delete(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    categoryController.remove
);

module.exports = router;