import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Adjust
  withCredentials: true, // if using auth cookies
});

export default api;
