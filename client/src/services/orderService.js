import api from "./api.js";

export async function createCheckout(payload) {
  const { data } = await api.post("/orders/checkout", payload);
  return data;
}

export async function verifyPayment(sessionId) {
  const { data } = await api.post("/orders/verify-payment", { sessionId });
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get("/orders/my-orders");
  return data;
}
