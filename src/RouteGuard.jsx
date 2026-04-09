import React from 'react'
import { Navigate } from 'react-router-dom'

function RouteGuard({ component: Component, routePath, skipCheck }) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    const menuRoutes = JSON.parse(sessionStorage.getItem('menuRoutes') || '[]')
    if (skipCheck) return <Component />
    const hasAccess = menuRoutes.some(allowed => {
        if (allowed === `/${routePath}`) return true
        if (allowed === routePath) return true
        return false
    })

    if (!hasAccess) return <Navigate to="/unauthorized" replace />
    return <Component />
}

export default RouteGuard