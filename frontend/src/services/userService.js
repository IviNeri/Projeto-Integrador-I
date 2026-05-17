import api from "./api";

export async function fetchUsers({
  page = 1,
  search = "",
  role = ""
} = {}) {
  const params = { page };

  if (search) {
    params.search = search;
  }

  if (role) {
    params.role = role;
  }

  const response = await api.get("/users", { params });

  return response.data;
}

export async function fetchUserById(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

export const createUser = async (data) => {
  const response = await api.post("/users", data);

  return response.data;
};

export async function updateUser(userId, {
  name,
  email,
  role
} = {}) {
  const response = await api.put(`/users/${userId}`, {
    name,
    email,
    role
  });

  return response.data;
}