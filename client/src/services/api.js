import axios from "axios";

const envApiUrl = import.meta.env.VITE_API_URL;
const productionApiUrl = envApiUrl?.includes("localhost") ? "" : envApiUrl;

const api = axios.create({
  baseURL: productionApiUrl || (import.meta.env.PROD ? "/api" : "http://localhost:5000/api"),
  withCredentials: true
});

export default api;
