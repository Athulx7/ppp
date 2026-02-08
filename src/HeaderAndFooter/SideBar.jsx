import React, { useEffect, useState, useMemo } from "react";
import { ChevronRight, ChevronLeft, X, Building2, LogOut, Grid3X3, Home, Rows3,  LayoutDashboard } from "lucide-react"
import { NavLink, Link, useLocation } from "react-router-dom"
import * as Icons from "lucide-react"
import MainMenu from "./MainMenu";
import { ApiCall } from "../library/constants"

function SideBar({
    isCollapsed,
    isMobileOpen,
    isMobile,
    handleToggle,
    setIsMobileOpen,
    openMenu,
    setOpenMenu
}) {
    const location = useLocation()

    const [menuData, setMenuData] = useState([])
    const [groupedMenus, setGroupedMenus] = useState({})
    const [settingsItems, setSettingsItems] = useState([])

    const userData = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem("user"))
        } catch {
            return null
        }
    }, [])

    const basePath = useMemo(() => {
        if (!userData?.role_code) return "/"
        switch (userData.role_code.toUpperCase()) {
            case "ADMIN":
                return "/admin"
            case "HR":
                return "/hr"
            case "PAYROLL_MANAGER":
                return "/payroll"
            case "EMPLOYEE":
                return "/employee"
            default:
                return "/"
        }
    }, [userData])

    const getIconComponent = (iconName) => {
        return Icons[iconName] || LayoutDashboard
    }

    const buildRoleRoute = (routePath) => {
        if (!routePath) return basePath

        if (!routePath.startsWith("/")) {
            routePath = `/${routePath}`
        }

        if (routePath.startsWith(basePath)) return routePath

        return `${basePath}${routePath}`
    }

    const isActivePath = (menuPath) => {
        const currentPath = location.pathname

        if (menuPath === basePath) {
            return currentPath === basePath
        }

        return (
            currentPath === menuPath ||
            currentPath.startsWith(`${menuPath}/`)
        )
    }

    useEffect(() => {
        fetchSideMenu()
    }, [basePath])

    async function fetchSideMenu() {
        try {
            const response = await ApiCall("GET", "/side-menu")
            if (response.status !== 200) return

            const processed = response.data.data.map((item) => ({
                ...item,
                route_path: buildRoleRoute(item.route_path)
            }))

            setMenuData(processed)

            const grouped = processed.reduce((acc, item) => {
                if (!acc[item.main_menu_name]) acc[item.main_menu_name] = []
                acc[item.main_menu_name].push(item)
                return acc
            }, {})

            setGroupedMenus(grouped)

            setSettingsItems([
                { label: "Settings", to: `${basePath}/settings`, icon: Icons.Settings },
                { label: "Feedback", to: `${basePath}/feedback`, icon: Icons.MessageCircle },
                { label: "Help", to: `${basePath}/help`, icon: Icons.HelpCircle }
            ])
        } catch (err) {
            console.error("Side menu error:", err)
        }
    }

    const handleLogout = () => {
        sessionStorage.clear()
        window.location.href = "/"
    }

    const userInitial = userData?.name?.charAt(0)?.toUpperCase() || "U"
    return (
        <>
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
                <Link to={basePath} className="flex items-center">
                    <Home className="text-indigo-500" />
                    <span className="ml-2 font-bold">PPP</span>
                </Link>
                <Grid3X3 size={30} onClick={() => setOpenMenu(true)} />
            </div>

            <div
                className={`fixed top-0 left-0 h-full bg-white border-r shadow-md z-40 transition-all duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed && !isMobile ? "w-20" : "w-64"} lg:translate-x-0`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center">
                        <Building2 className="text-indigo-500" />
                        {!isCollapsed && <span className="ml-2 font-bold">PPP</span>}
                    </div>

                    <button onClick={handleToggle}>
                        {isMobile ? isMobileOpen ? <X /> : <Rows3 /> : isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
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

                        {Object.entries(groupedMenus).map(([main, items]) =>
                            main === "Dashboard" ? null : (
                                <nav key={main} className="space-y-1 mt-2">
                                    {items
                                        .sort((a, b) => a.display_order - b.display_order)
                                        .map((item) => {
                                            const Icon = getIconComponent(item.sub_icon);
                                            return (
                                                <NavLink
                                                    key={item.sub_menu_id}
                                                    to={item.route_path}
                                                    className={`flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                          rounded-lg transition ${isActivePath(item.route_path)
                                                            ? "bg-indigo-100 text-indigo-600"
                                                            : "text-gray-600 hover:bg-indigo-50"
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {!isCollapsed && <span className="ml-3">{item.sub_menu_name}</span>}
                                                </NavLink>
                                            );
                                        })}
                                </nav>
                            )
                        )}

                        <div className="mt-6">
                            {!isCollapsed && (
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                                    Help & Settings
                                </div>
                            )}

                            <nav className="space-y-1">
                                {settingsItems.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <NavLink
                                            key={idx}
                                            to={item.to}
                                            className={`flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
                      rounded-lg transition ${isActivePath(item.to)
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {!isCollapsed && <span className="ml-3">{item.label}</span>}
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"}
              text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg`}
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
    );
}

export default SideBar
