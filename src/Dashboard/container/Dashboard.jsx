import React, { useState, useEffect } from "react";
import SideBar from "../../HeaderAndFooter/SideBar";
import TopHeader from "../../HeaderAndFooter/TopHeader";
import { Outlet } from "react-router-dom";

function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(false);
            else setIsMobileOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggle = () => {
        if (isMobile) setIsMobileOpen((p) => !p);
        else setIsCollapsed((p) => !p);
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col">
            <div className="flex-1">
                <SideBar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    isMobile={isMobile}
                    handleToggle={handleToggle}
                    setIsMobileOpen={setIsMobileOpen}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64" }`}>
                    <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-200">
                        <TopHeader openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    </div>

                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Dashboard