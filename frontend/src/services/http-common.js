import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/api", // Địa chỉ backend
  headers: {
    "Content-Type": "application/json",
  },
});