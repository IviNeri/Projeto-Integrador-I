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
async function findAll(page, limit, search = '') {

    const offset = (page - 1) * limit;

    const searchTerm = `%${search}%`;

    const [products] = await connection.execute(
        `
        SELECT
            products.id,
            products.name,
            products.price,
            products.stock,
            products.expiration_date,
            products.created_at,

            categories.id AS category_id,
            categories.name AS category_name

        FROM products

        LEFT JOIN categories
            ON categories.id = products.category_id
            AND categories.deleted_at IS NULL

        WHERE products.deleted_at IS NULL
        AND products.name LIKE ?

        ORDER BY products.created_at DESC

        LIMIT ? OFFSET ?
        `,
        [
            searchTerm,
            limit,
            offset
        ]
    );

    const formattedProducts = products.map(
        product => {

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                expiration_date: product.expiration_date,
                created_at: product.created_at,

                category: product.category_id
                    ? {
                        id: product.category_id,
                        name: product.category_name
                    }
                    : null
            };
        }
    );

    const [totalResult] = await connection.execute(
        `
        SELECT COUNT(*) as total

        FROM products

        WHERE deleted_at IS NULL
        AND name LIKE ?
        `,
        [searchTerm]
    );

    return {
        products: formattedProducts,
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
            products.id,
            products.name,
            products.price,
            products.stock,
            products.expiration_date,
            products.created_at,

            categories.id AS category_id,
            categories.name AS category_name

        FROM products

        LEFT JOIN categories
            ON categories.id = products.category_id
            AND categories.deleted_at IS NULL

        WHERE products.id = ?
        AND products.deleted_at IS NULL

        LIMIT 1
        `,
        [id]
    );

    const product = products[0];

    if (!product) {
        return null;
    }

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        expiration_date: product.expiration_date,
        created_at: product.created_at,

        category: product.category_id
            ? {
                id: product.category_id,
                name: product.category_name
            }
            : null
    };
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