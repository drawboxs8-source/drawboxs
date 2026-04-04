import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

// Attach token automatically
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.authorization = token;
  }

  return req;
});
