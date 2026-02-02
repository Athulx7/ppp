import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    const token = sessionStorage.getItem('token')

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role_code)) {
        switch (user.role_code) {
            case 'ADMIN':
                return <Navigate to="/admin" replace />
            case 'HR':
                return <Navigate to="/hr" replace />
            case 'PAYROLL_MANAGER':
                return <Navigate to="/payroll" replace />
            case 'EMPLOYEE':
                return <Navigate to="/employee" replace />
            default:
                return <Navigate to="/" replace />
        }
    }

    return children
}

export default ProtectedRoute