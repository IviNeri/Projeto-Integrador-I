const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Cria movimentação
|--------------------------------------------------------------------------
*/
async function create(data) {

    const {
        product_id,
        type,
        quantity,
        user_id
    } = data;

    const [result] = await connection.execute(
        `
        INSERT INTO movements
        (
            product_id,
            type,
            quantity,
            user_id
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            product_id,
            type,
            quantity,
            user_id
        ]
    );

    return result.insertId;
}

async function findAll(page, limit) {
    const finalPage = Math.max(1, parseInt(page, 10) || 1);
    const finalLimit = Math.max(1, parseInt(limit, 10) || 15);
    const offset = (finalPage - 1) * finalLimit;

    const [movements] = await connection.execute(
        `
        SELECT
            movements.id,
            movements.type,
            movements.quantity,
            movements.created_at,

            products.id AS product_id,
            products.name AS product_name,

            users.id AS user_id,
            users.name AS user_name

        FROM movements

        INNER JOIN products
            ON products.id = movements.product_id

        INNER JOIN users
            ON users.id = movements.user_id

        ORDER BY movements.created_at DESC

        LIMIT ${finalLimit} OFFSET ${offset}
        `
    );

    const formattedMovements = movements.map(movement => ({
        id: movement.id,
        type: movement.type,
        quantity: movement.quantity,
        created_at: movement.created_at,
        product: {
            id: movement.product_id,
            name: movement.product_name
        },
        user: {
            id: movement.user_id,
            name: movement.user_name
        }
    }));

    const [[{ total }]] = await connection.execute(
        `SELECT COUNT(*) as total FROM movements`
    );

    return {
        movements: formattedMovements,
        total
    };
}

module.exports = {
    create,
    findAll
};