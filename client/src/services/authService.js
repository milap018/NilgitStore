import api from "./api.js";

export async function signupUser(form) {
  const { data } = await api.post("/auth/signup", form);
  return data;
}

export async function signinUser(form) {
  const { data } = await api.post("/auth/signin", form);
  return data;
}

export async function logoutUser() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function checkSession() {
  const { data } = await api.get("/auth/session");
  return data;
}
