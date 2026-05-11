async function me(req, res) {

    return res.json({
        user: req.user
    });
}

async function admin(req, res) {

    return res.json({
        message: 'Área do administrador'
    });
}

module.exports = {
    me,
    admin
};