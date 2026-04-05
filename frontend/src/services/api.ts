import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "/api";

if (baseURL && !baseURL.endsWith('/api')) {
  baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

export const API = axios.create({
  baseURL
});

// Attach token automatically
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = token;
  }

  return req;
});
