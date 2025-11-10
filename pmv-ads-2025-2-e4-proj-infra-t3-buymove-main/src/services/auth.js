import { api } from "./api";

function extractMessage(error, fallback) {
  if (error?.response?.data?.detail) {
    if (typeof error.response.data.detail === "string") {
      return error.response.data.detail;
    }
    if (Array.isArray(error.response.data.detail)) {
      return error.response.data.detail.map((item) => item.msg ?? item).join(" ");
    }
  }
  if (error?.message) return error.message;
  return fallback;
}

export async function loginWithEmail({ email, password }) {
  try {
    const formData = new URLSearchParams();
    formData.set("username", email);
    formData.set("password", password);

    const { data } = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return data;
  } catch (error) {
    const message = extractMessage(error, "Não foi possível fazer login. Verifique suas credenciais.");
    const err = new Error(message);
    err.cause = error;
    throw err;
  }
}

export async function fetchCurrentUser() {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    const message = extractMessage(error, "Não foi possível carregar os dados do usuário.");
    const err = new Error(message);
    err.cause = error;
    throw err;
  }
}

export async function registerUser(payload) {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data;
  } catch (error) {
    const message = extractMessage(error, "Não foi possível concluir o cadastro.");
    const err = new Error(message);
    err.cause = error;
    throw err;
  }
}
