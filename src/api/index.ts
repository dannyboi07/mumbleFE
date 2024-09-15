import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import config from "../config";

function getApiUrl(): string {
    return `${config.ENV === "production" ? "https" : "http"}://${config.BASE_API_URL}`;
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: getApiUrl(), //"http://localhost:80/api"
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const { status, data } = error.response!;
        if (
            status === 401 &&
            (data === "Missing access token\n" || data === "Token expired\n")
        ) {
            try {
                await axiosInstance.get("/auth/refresh_token", {
                    withCredentials: true,
                });
            } catch (err) {
                if (status >= 400) {
                    localStorage.removeItem("mumble-user");
                    window.location.reload();
                    return;
                }
            }
            return axiosInstance.request(error.config);
        }
        return Promise.reject(error);
    },
);

export { getApiUrl };
export default axiosInstance;
