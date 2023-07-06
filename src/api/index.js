import Axios from "./request.js";

export default new Axios({
  baseURL: '/gateway',
  headers: {
    "Content-Type": "application/json",
  },
});