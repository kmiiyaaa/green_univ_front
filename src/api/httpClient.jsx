import axios from "axios";

const api = axios.create({
  baseURL: "localhost:8888/api",
  withCredentials: true,
});

export default api;
