const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Busca usuário por email
|--------------------------------------------------------------------------
*/
async function findByEmail(email) {

    const [users] = await connection.query(
        `
        SELECT *
        FROM users
        WHERE email = ?
        AND deleted_at IS NULL
        LIMIT 1
        `,
        [email]
    );

    return users[0] || null;
}

/*
|--------------------------------------------------------------------------
| Busca usuário por CPF
|--------------------------------------------------------------------------
*/
async function findByCpf(cpf) {

    const [users] = await connection.query(
        `
        SELECT *
        FROM users
        WHERE cpf = ?
        AND deleted_at IS NULL
        LIMIT 1
        `,
        [cpf]
    );

    return users[0] || null;
}

/*
|--------------------------------------------------------------------------
| Cria novo usuário
|--------------------------------------------------------------------------
*/
async function create(userData) {

    const {
        name,
        email,
        cpf,
        password,
        role
    } = userData;

    const [result] = await connection.execute(
        `
        INSERT INTO users
        (
            name,
            email,
            cpf,
            password,
            role
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            name,
            email,
            cpf,
            password,
            role
        ]
    );

    return result.insertId;
}

/*
|--------------------------------------------------------------------------
| Lista usuários
|--------------------------------------------------------------------------
*/
async function findAll(page, limit, search = '', filters = {}) {

    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;

    const conditions = [
        'deleted_at IS NULL',
        '(name LIKE ? OR email LIKE ?)'
    ];

    const values = [
        searchTerm,
        searchTerm
    ];

    if (filters.role) {

        conditions.push('role = ?');

        values.push(filters.role);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const [users] = await connection.execute(
        `
        SELECT
            id,
            name,
            email,
            cpf,
            role,
            created_at
        FROM users

        ${whereClause}

        ORDER BY created_at DESC

        LIMIT ? OFFSET ?
        `,
        [
            ...values,
            limit,
            offset
        ]
    );

    const [totalResult] = await connection.execute(
        `
        SELECT COUNT(*) as total

        FROM users

        ${whereClause}
        `,
        values
    );

    return {
        users,
        total: totalResult[0].total
    };
}

/*
|--------------------------------------------------------------------------
| Busca usuário por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const [users] = await connection.execute(
        `
        SELECT
            id,
            name,
            email,
            cpf,
            role,
            created_at
        FROM users

        WHERE id = ?
        AND deleted_at IS NULL

        LIMIT 1
        `,
        [id]
    );

    return users[0] || null;
}

/*
|--------------------------------------------------------------------------
| Atualiza usuário
|--------------------------------------------------------------------------
*/
async function update(id, userData) {

    const fields = [];

    const values = [];

    Object.entries(userData).forEach(
        ([key, value]) => {

            fields.push(`${key} = ?`);

            values.push(value);
        }
    );

    values.push(id);

    await connection.execute(
        `
        UPDATE users
        SET ${fields.join(', ')}
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        values
    );

    return findById(id);
}

/*
|--------------------------------------------------------------------------
| Remove usuário (soft delete)
|--------------------------------------------------------------------------
*/
async function remove(id) {

    await connection.execute(
        `
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = ?
        AND deleted_at IS NULL
        `,
        [id]
    );
}

module.exports = {
    findByEmail,
    findByCpf,
    create,
    findAll,
    findById,
    update,
    remove
};