const express = require('express');

const router = express.Router();

const productController = require('../controllers/product.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorize = require('../middlewares/authorize.middleware');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
router.post(
    '/',
    authMiddleware,
    authorize(['proprietario']),
    productController.create
);

/*
|--------------------------------------------------------------------------
| Lista produtos
|--------------------------------------------------------------------------
*/
router.get(
    '/',
    authMiddleware,
    authorize(['proprietario','funcionario']),
    productController.findAll
);

/*
|--------------------------------------------------------------------------
| Busca produto por ID
|--------------------------------------------------------------------------
*/
router.get(
    '/:id',
    authMiddleware,
    authorize(['proprietario', 'funcionario']),
    productController.findById
);

/*
|--------------------------------------------------------------------------
| Atualiza produto
|--------------------------------------------------------------------------
*/
router.put(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    productController.update
);

/*
|--------------------------------------------------------------------------
| Remove produto
|--------------------------------------------------------------------------
*/
router.delete(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    productController.remove
);

module.exports = router;