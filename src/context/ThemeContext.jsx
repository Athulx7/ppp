import React, { useEffect, useState } from 'react'
import { ThemeContext } from './themeContextObject'

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    useEffect(() => {
        const html = document.documentElement
        if (isDark) {
            html.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            html.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
