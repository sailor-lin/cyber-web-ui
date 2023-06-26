import Axios from "./request.js";
import { API_URL } from '../config.js';

export { Axios };

const axios = new Axios({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axios;
