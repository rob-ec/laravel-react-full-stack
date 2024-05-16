import axios from "axios";

const ACCESS_TOKEN_FIELD = import.meta.env.VITE_ACCESS_TOKEN_FIELD;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosClient = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_FIELD);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        try {
            const { response } = error;
            if (response.status === 401) {
                localStorage.removeItem(ACCESS_TOKEN_FIELD);
            }
        } catch (err) {
            console.error(err);
        }

        throw error;
    }
);

export default axiosClient;
