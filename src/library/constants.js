import axios from "axios"

const url = 'http://localhost:3000/api'

const api = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    }
})
export const ApiCall = async (endpoint, payload) => {
    try {
        const responce = await api.post(endpoint, payload)
        return responce
    }
    catch (error) {
        console.error("API Call Error:", error);
        return error;
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

export const roleRoutes = {
    'ADMIN': "/admin",
    'EMPLOYEE': "/employee",
    'HR': "/hr",
    'PAYROLL_MANAGER': "/payroll",
};