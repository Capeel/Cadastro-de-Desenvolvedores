import axios from "axios";
import { env } from "./env";

const api = axios.create({
    baseURL: env.api_uri,
    timeout: 10000,
})

export default api;