import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    ChevronRight, ChevronLeft, X, Building2, LogOut,
    Grid3X3, Rows3, LayoutDashboard, Sun, Moon, Star
} from "lucide-react"
import { NavLink, Link, useLocation } from "react-router-dom"
import * as Icons from "lucide-react"
import MainMenu from "./MainMenu";
import { ApiCall } from "../library/constants"
import { useTheme } from '../context/useTheme'
import { useFavourites } from "./context/FavouritesContext";

function SideBar({ isCollapsed, isMobileOpen, isMobile, handleToggle, setIsMobileOpen, openMenu, setOpenMenu }) {
    const location = useLocation()
    const { isDark, toggleTheme } = useTheme()

    const { favourites } = useFavourites()

    const [groupedMenus, setGroupedMenus] = useState({})
    const [isLogoHovered, setIsLogoHovered] = useState(false)

    const userData = useMemo(() => {
        try { return JSON.parse(sessionStorage.getItem("user")) }
        catch { return null }
    }, [])

    const basePath = useMemo(() => {
        if (!userData?.role_code) return "/"
        const map = {
            ADMIN: '/admin',
            HR: '/hr',
            PAYROLL_MANAGER: '/payroll',
            EMPLOYEE: '/employee'
        }
        return map[userData.role_code.toUpperCase()] || '/'
    }, [userData])

    const getIconComponent = (iconName) => Icons[iconName] || LayoutDashboard

    const buildRoleRoute = useCallback((routePath) => {
        if (!routePath) return basePath
        if (!routePath.startsWith('/')) routePath = `/${routePath}`
        if (routePath.startsWith(basePath)) return routePath
        return `${basePath}${routePath}`
    }, [basePath])

    const isActivePath = (menuPath) => {
        const currentPath = location.pathname
        if (menuPath === basePath) return currentPath === basePath
        return currentPath === menuPath || currentPath.startsWith(`${menuPath}/`)
    }

    const fetchSideMenu = useCallback(async () => {
        try {
            const response = await ApiCall("GET", "/side-menu")
            if (response.status !== 200) return
            const processed = response.data.data.map(item => ({
                ...item,
                route_path: buildRoleRoute(item.route_path)
            }))
            const grouped = processed.reduce((acc, item) => {
                if (!acc[item.main_menu_name]) acc[item.main_menu_name] = []
                acc[item.main_menu_name].push(item)
                return acc
            }, {})
            setGroupedMenus(grouped)
        } catch (err) {
            console.error("Side menu error:", err)
        }
    }, [basePath, buildRoleRoute])

    useEffect(() => {
        fetchSideMenu()
    }, [fetchSideMenu])

    const displayedFavourites = useMemo(() => {
        return favourites
            .slice(0, 10)
            .map(f => ({
                ...f,
                route_path: buildRoleRoute(f.route_path)
            }))
    }, [favourites, buildRoleRoute])

    const handleLogout = () => {
        sessionStorage.clear()
        window.location.href = "/"
    }

    return (
        <>
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-300 sticky top-0 z-50 text-gray-900">
                <Link to={basePath} className="flex items-center">
                    <Building2 className="text-indigo-500" />
                    <span className="ml-2 font-bold text-gray-900">PPP</span>
                </Link>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <Grid3X3 size={30} onClick={() => setOpenMenu(true)} />
                </div>
            </div>

            <div className={`
                fixed top-0 left-0 h-full bg-white border-r border-gray-300 shadow-md z-40
                transition-all duration-300
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                ${isCollapsed && !isMobile ? "w-20" : "w-64"} lg:translate-x-0
            `}>
                <div className="flex items-center justify-between p-4 border-b border-gray-300" style={{ paddingBottom: '10px' }}>
                    <div
                        className="flex items-center justify-center cursor-pointer w-8 h-8 ml-1"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                        onClick={isCollapsed ? handleToggle : undefined}
                    >
                        {isCollapsed ? (
                            isLogoHovered
                                ? <ChevronRight className="text-gray-900 w-6 h-6 transition-all duration-200" />
                                : <Building2 className="text-indigo-500 w-6 h-6 transition-all duration-200" />
                        ) : (
                            <div className="flex items-center p-2">
                                <Building2 className="text-indigo-500 w-6 h-6" />
                                <span className="ml-2 font-bold text-gray-900">PPP</span>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button onClick={handleToggle} className="text-gray-600 hover:text-indigo-600 transition-colors">
                            {isMobile ? (isMobileOpen ? <X /> : <Rows3 />) : <ChevronLeft />}
                        </button>
                    )}
                </div>

                <div className="flex flex-col justify-between h-[calc(100%-4rem)] px-2 py-3 overflow-y-auto">
                    <div>
                        <NavLink
                            to={basePath}
                            end
                            className={`flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                                rounded-lg transition ${isActivePath(basePath)
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "text-gray-600 hover:bg-indigo-50"
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            {!isCollapsed && <span className="ml-3">Dashboard</span>}
                        </NavLink>

                        {displayedFavourites.length > 0 ? (
                            <div className="mt-3">
                                {!isCollapsed ? (
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase mb-1 px-2 mt-2">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        Favourites
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <nav className="space-y-1">
                                    {displayedFavourites.map(fav => {
                                        const Icon = getIconComponent(fav.icon_name)
                                        return (
                                            <NavLink
                                                key={fav.route_path}
                                                to={fav.route_path}
                                                className={`flex items-center
                                                    ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                                                    rounded-lg transition
                                                    ${isActivePath(fav.route_path)
                                                        ? "bg-amber-50 text-amber-600"
                                                        : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                {!isCollapsed && (
                                                    <span className="ml-3 truncate text-sm">
                                                        {fav.sub_menu_name}
                                                    </span>
                                                )}
                                            </NavLink>
                                        )
                                    })}
                                </nav>
                            </div>
                        ) : (
                            Object.entries(groupedMenus).map(([main, items]) =>
                                main === "Dashboard" ? null : (
                                    <nav key={main} className="space-y-1 mt-2">
                                        {items
                                            .sort((a, b) => a.display_order - b.display_order)
                                            .map(item => {
                                                const Icon = getIconComponent(item.sub_icon)
                                                return (
                                                    <NavLink
                                                        key={item.sub_menu_id}
                                                        to={item.route_path}
                                                        className={`flex items-center
                                                            ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                                                            rounded-lg transition
                                                            ${isActivePath(item.route_path)
                                                                ? "bg-indigo-100 text-indigo-600"
                                                                : "text-gray-600 hover:bg-indigo-50"
                                                            }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        {!isCollapsed && (
                                                            <span className="ml-3">{item.sub_menu_name}</span>
                                                        )}
                                                    </NavLink>
                                                )
                                            })}
                                    </nav>
                                )
                            )
                        )}
                    </div>

                    <div className="border-t border-gray-400 pt-3 space-y-1">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full
                                ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                                text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition`}
                        >
                            <LogOut className="w-5 h-5" />
                            {!isCollapsed && <span className="ml-3">Log Out</span>}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </>
    )
}

export default SideBar