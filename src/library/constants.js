import axios from "axios"
import { jwtDecode } from "jwt-decode"

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" }
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const data = error.response.data;
            const isExpired = data?.isExpired ||
                data?.error === 'TokenExpiredError' ||
                (typeof data?.message === 'string' && data.message.toLowerCase().includes('expired'));

            if (isExpired) {
                window.dispatchEvent(new CustomEvent('session-expired', {
                    detail: { message: data?.message || "Your session has expired. Please log in again." }
                }));
            }
        }
        return Promise.reject(error);
    }
)

export const ApiCall = async (method, endpoint, payload = null) => {
    try {
        const config = {
            method,
            url: endpoint
        }
        if (payload !== null && payload !== undefined) {
            config.data = payload
        }
        const response = await api(config)
        return response
    } catch (error) {
        console.error("API Call Error:", error)

        if (error.response) {
            throw error.response
        } else {
            throw { message: "Network error" }
        }
    }
}

export function getTokenData() {
    try {
        const token = sessionStorage.getItem("token")
        if (!token) return null

        const decoded = jwtDecode(token)
        return decoded
    } catch (error) {
        console.error("Error decoding token:", error)
        return null
    }
}

export const getRoleBasePath = () => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}")

    switch (user.role_code) {
        case "ADMIN": return "/admin"
        case "HR": return "/hr"
        case "PAYROLL_MANAGER": return "/payroll"
        case "EMPLOYEE": return "/employee"
        default: return "/"
    }
}