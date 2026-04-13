import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

function RouteGuard({ component: Component, skipCheck }) {
    const location = useLocation()
    const menuRoutes = JSON.parse(sessionStorage.getItem('menuRoutes') || '[]')
    if (skipCheck) return <Component />

    const fullPath = location.pathname
    const segments = fullPath.split('/').filter(Boolean)
    segments.shift()
    const routePath = segments.join('/')

    const hasAccess = menuRoutes.some(allowed => {
        const normalizedAllowed = allowed.replace(/^\//, '')
        const normalizedCurrent = routePath

        if (normalizedAllowed === normalizedCurrent) return true

        const allowedParts  = normalizedAllowed.split('/')
        const currentParts  = normalizedCurrent.split('/')

        if (allowedParts.length !== currentParts.length) return false

        return allowedParts.every((part, i) => {
            if (part.startsWith(':')) return true
            return part === currentParts[i]
        })
    })

    if (!hasAccess) return <Navigate to="/unauthorized" replace />
    return <Component />
}

export default RouteGuard