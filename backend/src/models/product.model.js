const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
async function create(productData) {

    const {
        name,
        price,
        stock,
        category_id,
        expiration_date
    } = productData;

    const [result] = await connection.execute(
        `
        INSERT INTO products
        (
            name,
            price,
            stock,
            category_id,
            expiration_date
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            name,
            price,
            stock,
            category_id,
            expiration_date || null
        ]
    );

    return result.insertId;
}

/*
|--------------------------------------------------------------------------
| Lista produtos
|--------------------------------------------------------------------------
*/
async function findAll(page, limit) {

    const offset = (page - 1) * limit;

    const [products] = await connection.execute(
        `
        SELECT
            id,
            name,
            price,
            stock,
            category_id,
            expiration_date,
            created_at
        FROM products
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
        `,
        [
            limit,
            offset
        ]
    );

    const [totalResult] = await connection.execute(
        `
        SELECT COUNT(*) as total
        FROM products
        WHERE deleted_at IS NULL
        `
    );

    return {
        products,
        total: totalResult[0].total
    };
}

/*
|--------------------------------------------------------------------------
| Busca produto por ID
|--------------------------------------------------------------------------
*/
async function findById(id) {

    const [products] = await connection.execute(
        `
        SELECT
            id,
            name,
            price,
            stock,
            category_id,
            expiration_date,
            created_at
        FROM products
        WHERE id = ?
        AND deleted_at IS NULL
        LIMIT 1
        `,
        [id]
    );

    return products[0] || null;
}

/*
|--------------------------------------------------------------------------
| Atualiza produto
|--------------------------------------------------------------------------
*/
async function update(id, productData) {

    const fields = [];

    const values = [];

    Object.entries(productData).forEach(
        ([key, value]) => {

            fields.push(`${key} = ?`);

            values.push(value);
        }
    );

    values.push(id);

    await connection.execute(
        `
        UPDATE products
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
| Remove produto (soft delete)
|--------------------------------------------------------------------------
*/
async function remove(id) {

    await connection.execute(
        `
        UPDATE products
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