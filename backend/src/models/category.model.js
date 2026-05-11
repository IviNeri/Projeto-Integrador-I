const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Criar categoria
|--------------------------------------------------------------------------
*/
async function create(data) {

    const { name } = data;

    const [result] = await connection.execute(
        `
        INSERT INTO categories (name)
        VALUES (?)
        `,
        [name]
    );

    return result.insertId;
}

/*
|--------------------------------------------------------------------------
| Listar categorias
|--------------------------------------------------------------------------
*/
async function findAll() {

    const [rows] = await connection.execute(
        `
        SELECT id, name, created_at
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        `
    );

    return rows;
}

/*
|--------------------------------------------------------------------------
| Buscar por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const [rows] = await connection.execute(
        `
        SELECT id, name, created_at
        FROM categories
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1
        `,
        [id]
    );

    return rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| Atualizar categoria
|--------------------------------------------------------------------------
*/
async function update(id, data) {

    const { name } = data;

    await connection.execute(
        `
        UPDATE categories
        SET name = ?
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [name, id]
    );

    return findById(id);
}

/*
|--------------------------------------------------------------------------
| Soft delete
|--------------------------------------------------------------------------
*/
async function remove(id) {

    await connection.execute(
        `
        UPDATE categories
        SET deleted_at = NOW()
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [id]
    );
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
};