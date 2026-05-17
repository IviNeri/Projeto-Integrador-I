import api from "./api";

export async function fetchMovements({
  page = 1,
  type = "",
  search = ""
} = {}) {
  const params = { page };

  if (type) {
    params.type = type;
  }

  if (search) {
    params.search = search;
  }

  const response = await api.get("/movements", { params });

  return response.data;
}

export async function createMovement({
  productId,
  type,
  quantity
} = {}) {
  const response = await api.post("/movements", {
    product_id: productId,
    type,
    quantity
  });

  return response.data;
}
