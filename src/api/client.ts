import axios from "axios";
import { getAccessToken } from "@/services/auth";

export const api = axios.create({
  baseURL: "https://localhost:7099/api",
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
