const connection = require('../config/database');

/*
|--------------------------------------------------------------------------
| Criação de produto
|--------------------------------------------------------------------------
*/
async function create(productData) {

    const {
        name,
        price = 0,
        stock = 0,
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

async function findAll(page, limit, search = '', filters = {}) {
    const safePage = Number(page);
    const safeLimit = Number(limit);

    const finalPage = Number.isFinite(safePage) && safePage > 0 ? safePage : 1;
    const finalLimit = Number.isFinite(safeLimit) && safeLimit > 0 ? safeLimit : 10;

    const offset = (finalPage - 1) * finalLimit;

    const searchTerm = `%${search ?? ''}%`;

    const conditions = [
        'products.deleted_at IS NULL',
        'products.name LIKE ?'
    ];

    const values = [searchTerm];

    if (filters?.categoryId) {
        conditions.push('products.category_id = ?');
        values.push(filters.categoryId);
    }

    if (filters?.minPrice !== null && filters?.minPrice !== undefined && filters.minPrice !== '') {
        conditions.push('products.price >= ?');
        values.push(filters.minPrice);
    }

    if (filters?.maxPrice !== null && filters?.maxPrice !== undefined && filters.maxPrice !== '') {
        conditions.push('products.price <= ?');
        values.push(filters.maxPrice);
    }

    if (filters?.expirationFrom) {
        conditions.push('products.expiration_date >= ?');
        values.push(filters.expirationFrom);
    }

    if (filters?.expirationTo) {
        conditions.push('products.expiration_date <= ?');
        values.push(filters.expirationTo);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

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

        ${whereClause}

        ORDER BY products.created_at DESC

        LIMIT ? OFFSET ?
        `,
        [
            ...values,
            finalLimit,
            offset
        ]
    );

    const formattedProducts = products.map(product => ({
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
    }));

    const [totalResult] = await connection.execute(
        `
        SELECT COUNT(*) as total
        FROM products
        ${whereClause}
        `,
        values
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