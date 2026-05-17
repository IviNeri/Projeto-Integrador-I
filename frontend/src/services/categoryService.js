import api from "./api";

export async function fetchCategories() {
  const response = await api.get("/categories");
  return response.data;
}

export async function fetchCategoryById(categoryId) {
  const response = await api.get(`/categories/${categoryId}`);
  return response.data;
}

export async function createCategory({ name }) {
  const response = await api.post("/categories", { name });
  return response.data;
}

export async function updateCategory(categoryId, { name }) {
  const response = await api.put(`/categories/${categoryId}`, { name });
  return response.data;
}

export async function deleteCategory(categoryId) {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
}
