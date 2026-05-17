const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorize = require('../middlewares/authorize.middleware');

/*
|--------------------------------------------------------------------------
| Lista usuários
|--------------------------------------------------------------------------
*/
router.get(
    '/',
    authMiddleware,
    authorize(['proprietario']),
    userController.findAll
);

/*
|--------------------------------------------------------------------------
| Busca usuário por ID
|--------------------------------------------------------------------------
*/
router.get(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    userController.findById
);

/*
|--------------------------------------------------------------------------
| Cria usuário
|--------------------------------------------------------------------------
*/
router.post(
    '/',
    authMiddleware,
    authorize(['proprietario']),
    userController.create
);

/*
|--------------------------------------------------------------------------
| Atualiza usuário
|--------------------------------------------------------------------------
*/
router.put(
    '/:id',
    authMiddleware,
    authorize(['proprietario']),
    userController.update
);

module.exports = router;