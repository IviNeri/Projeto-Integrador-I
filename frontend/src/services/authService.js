import api from "./api";

const AUTH_HEADER = "Authorization";

export async function login({ email, password }) {
  const response = await api.post("/auth/login", {
    email,
    password
  });

  return response.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common[AUTH_HEADER] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common[AUTH_HEADER];
  }
}
