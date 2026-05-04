import api from "./api.js";

export const register = async (name, email, password, confirmPassword) => {
  const response = await api.post("/auth/register", { name, email, password, confirmPassword });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  // ✅ Lấy token và user từ response
  const { token, user } = response.data;

  // ✅ Lưu vào localStorage
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  return response.data;
};

// ✅ Lưu ngay vào localStorage
if (token) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

return { token, user };


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};