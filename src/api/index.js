import Axios from "@/api/request.js";

const axios = new Axios({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
      "Content-Type": "application/json",
  },
});

export default axios;