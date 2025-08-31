
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // update with your backend port
  withCredentials: true, // for JWT cookies if you use them
});

export default api;
