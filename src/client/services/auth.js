import api from "./api.js";

export const register = async (name, email, password, confirmPassword) => {
  const response = await api.post("/auth/register", { name, email, password, confirmPassword });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  // api interceptor đã unwrap, response = { token, user, ... }
  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return { token, user };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

