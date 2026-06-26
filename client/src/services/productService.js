import api from "./api.js";
import { getDemoProduct, getDemoProducts } from "../utils/demoProducts.js";

function withTimeout(promise, timeoutMs = 1500) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
// If the backend is slow or unavailable, stop waiting and let the UI fall back.
    timeoutId = setTimeout(() => reject(new Error("Request timed out.")), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function getProducts(params = {}) {
  try {
    const { data } = await withTimeout(api.get("/products", { params }));
    return data;
  } catch (error) {
// In learning mode we prefer showing demo products over an empty loading state.
    return getDemoProducts(params);
  }
}

export async function getProduct(id) {
  try {
    const { data } = await withTimeout(api.get(`/products/${id}`));
    return data;
  } catch (error) {
// Product detail pages also fall back to demo data when the API cannot answer.
    const product = getDemoProduct(id);

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
