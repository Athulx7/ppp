import React from "react";
import { Home, Rows3, ChevronRight, ChevronLeft, X, LayoutDashboard, Users, CalendarDays, FileText, Wallet, Settings, MessageCircle, HelpCircle, Building2, LogOut, } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

function SideBar({ isCollapsed, isMobileOpen, isMobile, handleToggle, setIsMobileOpen, }) {

    const menuItems = [
        {
            name: "Dashboard",
            url: "/",
            icon: LayoutDashboard,
        },
        {
            name: "Employees",
            url: "/hr/employees",
            icon: Users,
        },
        {
            name: "Attendance",
            url: "/hr/attendance",
            icon: CalendarDays,
        },
        {
            name: "Leave Management",
            url: "/hr/leaves",
            icon: FileText,
        },
        {
            name: "Payroll",
            url: "/hr/payroll",
            icon: Wallet,
        },
        {
            name: "Reports",
            url: "/hr/reports",
            icon: FileText,
        },
    ];

    const settingsItems = [
        {
            label: "Settings",
            to: "/hr/settings",
            icon: Settings,
        },
        {
            label: "Feedback",
            to: "/hr/feedback",
            icon: MessageCircle,
        },
        {
            label: "Help",
            to: "/hr/help",
            icon: HelpCircle,
        },
    ];

    const userProfile = {
        name: "Admin",
        email: "admin@email.com",
        initial: "A"
    }

    const handleLogout = () => {
        console.log("Logging out...")
    }

    return (
        <>
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
                <Link to="/hr/dashboard" className="flex items-center">
                    <Home className="text-indigo-500" />
                    <span className="ml-2 font-bold">PPP</span>
                </Link>
                <button onClick={handleToggle}>
                    <Rows3 />
                </button>
            </div>

            <div
                className={`fixed top-0 left-0 h-full bg-white border-r shadow-md z-40 transition-all duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed && !isMobile ? "w-20" : "w-64"} lg:translate-x-0`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center">
                        <Building2 className="text-indigo-500" />
                        {!isCollapsed && <span className="ml-2 font-bold">PPP</span>}
                    </div>

                    <button
                        onClick={handleToggle}
                        className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        {isMobile ? (
                            isMobileOpen ? <X /> : <Rows3 />
                        ) : isCollapsed ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </button>
                </div>

                <div className="flex flex-col justify-between h-[calc(100%-4rem)] px-2 py-3 overflow-y-auto">
                    <div>
                        {!isCollapsed && (
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                                Menu
                            </div>
                        )}

                        <nav className="space-y-1">
                            {menuItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={idx}
                                        to={item.url}
                                        className={({ isActive }) =>
                                            `flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"} rounded-lg transition
                                            ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"}`
                                        }
                                    >
                                        <Icon className="w-5 h-5" />
                                        {!isCollapsed && (
                                            <span className="ml-3">{item.name}</span>
                                        )}
                                    </NavLink>
                                );
                            })}
                        </nav>

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
                                            className={({ isActive }) =>
                                                `flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"} rounded-lg transition
                                                ${isActive
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                }`
                                            }
                                        >
                                            <Icon className="w-5 h-5" />
                                            {!isCollapsed && (
                                                <span className="ml-3">{item.label}</span>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t">
                        <div
                            className={`items-center ${isCollapsed ? "justify-center p-3" : "py-2 px-3"} cursor-pointer border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors`}
                        >
                            <div className={`flex ${isCollapsed ? "justify-center" : "items-center"}`}>
                                <div className={`${isCollapsed ? "w-10 h-10" : "w-9 h-9"} rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold`}>
                                    {userProfile.initial}
                                </div>

                                {!isCollapsed && (
                                    <div className="ms-3 flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {userProfile.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            {userProfile.email}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`flex items-center ${isCollapsed ? "justify-center p-3" : "px-3 py-2.5"} w-full mt-3 rounded-lg transition text-gray-600 hover:bg-red-50 hover:text-red-600`}
                        >
                            <LogOut className="w-5 h-5" />
                            {!isCollapsed && (
                                <span className="ml-3">Log Out</span>
                            )}
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
        </>
    );
}

export default SideBar
