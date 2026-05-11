const express = require('express');

const router = express.Router();

const movementController = require('../controllers/movement.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorize = require('../middlewares/authorize.middleware');

/*
|--------------------------------------------------------------------------
| Cria movimentação
|--------------------------------------------------------------------------
*/
router.post(
    '/',
    authMiddleware,
    authorize(['proprietario', 'funcionario']),
    movementController.create
);

/*
|--------------------------------------------------------------------------
| Lista movimentações
|--------------------------------------------------------------------------
*/
router.get(
    '/',
    authMiddleware,
    authorize(['proprietario', 'funcionario']),
    movementController.findAll
);

module.exports = router;