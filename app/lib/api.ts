import axios from "axios";

export const BACKEND_ORIGIN =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "http://localhost:5000";

const API = axios.create({
  baseURL: `${BACKEND_ORIGIN}/api`,
  withCredentials: true,
});

export default API;
