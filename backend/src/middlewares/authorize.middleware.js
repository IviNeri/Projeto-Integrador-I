function authorize(roles = []) {

    return (req, res, next) => {

        /*
        |--------------------------------------------------------------------------
        | Verifica se o usuário possui permissão
        |--------------------------------------------------------------------------
        */
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Acesso negado'
            });
        }

        next();
    };
}

module.exports = authorize;