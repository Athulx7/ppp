import React, { useState, useEffect } from "react";
import SideBar from "../../HeaderAndFooter/SideBar";
import TopHeader from "../../HeaderAndFooter/TopHeader";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "../Hooks/useIsMobile";

function Dashboard() {
    const isPWAMobile = useIsMobile()

    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSidebar, setIsSidebar] = useState(window.innerWidth < 1024)
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const sidebarMobile = window.innerWidth < 1024
            setIsSidebar(sidebarMobile)
            if (sidebarMobile) setIsCollapsed(false)
            else setIsMobileOpen(false)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggle = () => {
        if (isSidebar) setIsMobileOpen(p => !p)
        else setIsCollapsed(p => !p)
    };

    if (isPWAMobile) {
        return (
            <div className="h-screen w-screen overflow-y-auto bg-white hide-scrollbar">
                <Outlet />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1">
                <SideBar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    isMobile={isSidebar}
                    handleToggle={handleToggle}
                    setIsMobileOpen={setIsMobileOpen}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebar ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
                    }`}>
                    <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-300">
                        <TopHeader openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    </div>

                    <main className="flex-1 p-6 max-h-[calc(100vh-64px)] overflow-y-auto scrollbar">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Dashboard