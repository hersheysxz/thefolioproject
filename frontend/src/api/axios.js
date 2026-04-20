import axios from "axios";

// Fallback prevents Vercel "undefined env" issue from breaking your app
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://thefolioproject-fuoe.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;