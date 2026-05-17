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

async function findAll(page, limit, search = '') {
    const finalPage = Math.max(1, parseInt(page, 10) || 1);
    const finalLimit = Math.max(1, parseInt(limit, 10) || 15);
    const offset = (finalPage - 1) * finalLimit;

    const searchTerm = `%${search ?? ''}%`;

    const conditions = [
        'deleted_at IS NULL',
        'name LIKE ?'
    ];

    const values = [searchTerm];

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const [categories] = await connection.execute(
        `
        SELECT id, name, created_at
        FROM categories
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ${finalLimit} OFFSET ${offset}
        `,
        values
    );

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) as total FROM categories ${whereClause}`,
        values
    );

    return {
        categories,
        total
    };
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