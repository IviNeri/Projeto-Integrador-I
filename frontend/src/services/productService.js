import api from "./api";

export async function fetchProducts({
  page = 1,
  search = "",
  categoryId = "",
  minPrice = "",
  maxPrice = "",
  expirationFrom = "",
  expirationTo = ""
} = {}) {
  const params = { page };

  if (search) {
    params.search = search;
  }

  if (categoryId) {
    params.category_id = categoryId;
  }

  if (minPrice !== "") {
    params.min_price = minPrice;
  }

  if (maxPrice !== "") {
    params.max_price = maxPrice;
  }

  if (expirationFrom) {
    params.expiration_from = expirationFrom;
  }

  if (expirationTo) {
    params.expiration_to = expirationTo;
  }

  const response = await api.get("/products", { params });

  return response.data;
}

export async function createProduct({
  name,
  categoryId,
  price = 0,
  stock = 0,
  expirationDate = null
} = {}) {
  const response = await api.post("/products", {
    name,
    category_id: categoryId,
    price,
    stock,
    expiration_date: expirationDate
  });

  return response.data;
}

export async function fetchProductById(productId) {
  const response = await api.get(`/products/${productId}`);
  return response.data;
}

export async function updateProduct(productId, {
  name,
  categoryId,
  price,
  stock,
  expirationDate
} = {}) {
  const response = await api.put(`/products/${productId}`, {
    name,
    category_id: categoryId,
    price,
    stock,
    expiration_date: expirationDate
  });

  return response.data;
}

export async function deleteProduct(productId) {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
}
