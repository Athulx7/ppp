import React, { createContext, useContext, useState, useCallback } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
    const [user, setUserState] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('user')) || null
        } catch {
            return null
        }
    })

    const [company, setCompanyState] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('company')) || null
        } catch {
            return null
        }
    })

    const [token, setTokenState] = useState(() => {
        return sessionStorage.getItem('token') || null
    })

    const [menuRoutes, setMenuRoutesState] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem('menuRoutes')) || []
        } catch {
            return []
        }
    })

    const login = useCallback((userData, tokenVal, companyData, menuRoutesVal) => {
        sessionStorage.setItem('token', tokenVal)
        sessionStorage.setItem('user', JSON.stringify(userData))
        sessionStorage.setItem('company', JSON.stringify(companyData))
        if (menuRoutesVal) {
            sessionStorage.setItem('menuRoutes', JSON.stringify(menuRoutesVal))
        }

        setUserState(userData)
        setTokenState(tokenVal)
        setCompanyState(companyData)
        if (menuRoutesVal) {
            setMenuRoutesState(menuRoutesVal)
        }
    }, [])

    const logout = useCallback(() => {
        sessionStorage.clear()
        setUserState(null)
        setTokenState(null)
        setCompanyState(null)
        setMenuRoutesState([])
    }, [])

    const updateUser = useCallback((newUserData) => {
        setUserState(prev => {
            const updated = prev ? { ...prev, ...newUserData } : newUserData
            sessionStorage.setItem('user', JSON.stringify(updated))
            return updated
        })
    }, [])

    const updateCompany = useCallback((newCompanyData) => {
        setCompanyState(prev => {
            const updated = prev ? { ...prev, ...newCompanyData } : newCompanyData
            sessionStorage.setItem('company', JSON.stringify(updated))
            return updated
        })
    }, [])

    const isAuthenticated = !!token

    return (
        <UserContext.Provider value={{
            user,
            company,
            token,
            menuRoutes,
            isAuthenticated,
            login,
            logout,
            updateUser,
            updateCompany
        }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
