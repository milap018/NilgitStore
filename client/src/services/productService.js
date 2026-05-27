import api from "./api.js";

export async function getProducts(params = {}) {
  const { data } = await api.get("/products", { params });
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function createProduct(form) {
  const { data } = await api.post("/products", form);
  return data;
}

export async function updateProduct(id, form) {
  const { data } = await api.put(`/products/${id}`, form);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function uploadProductImages(files) {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  const { data } = await api.post("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return data;
}
