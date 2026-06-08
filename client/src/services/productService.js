import api from "./api.js";
import { getDemoProduct, getDemoProducts } from "../utils/demoProducts.js";

export async function getProducts(params = {}) {
  try {
    const { data } = await api.get("/products", { params });
    return data;
  } catch (error) {
    if (import.meta.env.PROD) {
      return getDemoProducts(params);
    }

    throw error;
  }
}

export async function getProduct(id) {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    const product = import.meta.env.PROD ? getDemoProduct(id) : null;

    if (product) {
      return product;
    }

    throw error;
  }
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
