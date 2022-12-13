import axios from "axios";

const instance = axios.create({
  // baseURL: "https://ps-whatsapp-backend.herokuapp.com",
  baseURL: "https://wssap-backend.vercel.app/",
});

export default instance;
