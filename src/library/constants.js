import axios from "axios"

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

export const ApiCall = async (method, endpoint, payload = null) => {
    try {
        const response = await api({
            method,
            url: endpoint,
            data: payload
        })
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
        console.log("Decoded Token:", decoded)

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