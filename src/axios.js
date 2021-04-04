import axios from "axios";

const instance = axios.create({
  baseURL: "https://ps-whatsapp-backend.herokuapp.com",
});

export default instance;
