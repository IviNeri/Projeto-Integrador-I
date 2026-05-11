const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const authorize = require('../middlewares/authorize.middleware');

router.get(
    '/me',
    authMiddleware,
    userController.me
);

/*
|--------------------------------------------------------------------------
| Rota apenas para administradores
|--------------------------------------------------------------------------
*/
router.get(
    '/admin',
    authMiddleware,
    authorize(['proprietario']),
    userController.admin
);

module.exports = router;