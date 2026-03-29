import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import SideBar from '../../HeaderAndFooter/SideBar'
import TopHeader from '../../HeaderAndFooter/TopHeader'
import MainMenu from '../../HeaderAndFooter/MainMenu'
import { useIsMobile } from '../Hooks/useIsMobile'
import { Home, Calendar, AlarmClock, FileText, User, Users, Grid3X3, } from 'lucide-react'
import { BellButton, NotificationSheet, UpdateBanner, useNotifications } from '../Mobile/Notificationsheet'
import { usePWA } from '../Hooks/Usepwa'
import { getRoleBasePath } from '../../library/constants'

function getUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}') }
    catch { return {} }
}

function buildTabs(isManager) {
    const tabs = [
        {
            id: 'home',
            label: 'Home',
            icon: Home,
            route: `${getRoleBasePath()}`,
            match: [`${getRoleBasePath()}`],
        },
        {
            id: 'leave',
            label: 'Leave',
            icon: Calendar,
            route: `${getRoleBasePath()}/leave`,
            match: [`${getRoleBasePath()}/leave`],
        },
        {
            id: 'regularize',
            label: 'Clock',
            icon: AlarmClock,
            route: `${getRoleBasePath()}/regularize`,
            match: [`${getRoleBasePath()}/regularize`],
        },
        {
            id: 'payslip',
            label: 'Payslips',
            icon: FileText,
            route: `${getRoleBasePath()}/payslips`,
            match: [`${getRoleBasePath()}/payslips`],
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            route: `${getRoleBasePath()}/profile`,
            match: [`${getRoleBasePath()}/profile`],
        },
    ]
    if (isManager) {
        tabs.splice(tabs.length - 1, 0, {
            id: 'approvals',
            label: 'Team',
            icon: Users,
            route: `${getRoleBasePath()}/approvals`,
            match: [`${getRoleBasePath()}/approvals`],
        })
    }
    return tabs
}

function MobileHeader({ notifCount, onOpenNotifications, onOpenMenu }) {
    return (
        <div className="flex-shrink-0 flex items-center justify-between
                        px-4 pt-3 pb-2.5 bg-white border-b border-gray-200 z-20">
            <p className="text-sm font-bold text-indigo-600 tracking-tight">HRMS</p>
            <div className="flex items-center gap-1">
                <BellButton count={notifCount} onClick={onOpenNotifications} />
                <button
                    onClick={onOpenMenu}
                    className="w-9 h-9 flex items-center justify-center
                               rounded-xl hover:bg-gray-100 transition-colors"
                    title="All pages"
                >
                    <Grid3X3 size={20} className="text-gray-600" />
                </button>
            </div>
        </div>
    )
}

function MobileBottomNav({ tabs, currentPath }) {
    const navigate = useNavigate()

    const isActive = (tab) => {
        if (tab.id === 'home') return currentPath === tab.route || currentPath === `${getRoleBasePath()}/`
        return tab.match.some(m => currentPath.startsWith(m))
    }

    return (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 pb-safe z-20">
            <div className={`grid pb-1 grid-cols-${Math.min(tabs.length, 6)}`}>
                {tabs.map(tab => {
                    const active = isActive(tab)
                    return (
                        <button key={tab.id} onClick={() => navigate(tab.route)}
                            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1 min-w-[52px] relative"
                        >
                            {active && (
                                <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                            )}
                            <tab.icon size={22} className={active ? 'text-indigo-600' : 'text-gray-400'} strokeWidth={active ? 2.5 : 2} />
                            <span className={`text-[10px] font-medium ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function Dashboard() {
    const isPWAMobile = useIsMobile()
    const location = useLocation()
    const currentPath = location.pathname

    const [isCollapsed, setIsCollapsed] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isSidebar, setIsSidebar] = useState(window.innerWidth < 1024)

    const [openMenu, setOpenMenu] = useState(false)
    const [notifOpen, setNotifOpen] = useState(false)

    const { updateAvailable, updateApp } = usePWA()
    const { notifications, unreadCount, markRead, markAllRead, deleteNotif } = useNotifications()

    const user = getUser()
    const isManager = Boolean(user?.is_manager || user?.isManager)
    const NAV_TABS = buildTabs(isManager)

    useEffect(() => {
        const onResize = () => {
            const mob = window.innerWidth < 1024
            setIsSidebar(mob)
            if (mob) setIsCollapsed(false)
            else setIsMobileOpen(false)
        }
        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const Overlays = (
        <>
            <NotificationSheet
                isOpen={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifications={notifications}
                onMarkRead={markRead}
                onMarkAllRead={markAllRead}
                onDelete={deleteNotif}
                updateAvailable={updateAvailable}
                onUpdate={updateApp}
            />
            {openMenu && <MainMenu onClose={() => setOpenMenu(false)} />}
        </>
    )

    if (isPWAMobile) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">

                {updateAvailable && <UpdateBanner onUpdate={updateApp} />}

                <MobileHeader
                    notifCount={unreadCount}
                    onOpenNotifications={() => setNotifOpen(true)}
                    onOpenMenu={() => setOpenMenu(true)}
                />

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                    <Outlet />
                </div>

                <MobileBottomNav tabs={NAV_TABS} currentPath={currentPath} />

                {Overlays}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1">
                <SideBar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    isMobile={isSidebar}
                    handleToggle={() => {
                        if (isSidebar) setIsMobileOpen(p => !p)
                        else setIsCollapsed(p => !p)
                    }}
                    setIsMobileOpen={setIsMobileOpen}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                />
                <div className={`flex-1 flex flex-col transition-all duration-300
                    ${isSidebar ? 'ml-0' : isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="hidden lg:block sticky top-0 z-30 bg-white border-b border-gray-300">
                        <TopHeader
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                            notifCount={unreadCount}
                            onOpenNotifications={() => setNotifOpen(true)}
                        />
                    </div>
                    <main className="flex-1 p-6 max-h-[calc(100vh-64px)] overflow-y-auto scrollbar">
                        <Outlet />
                    </main>
                </div>
            </div>
            {Overlays}
        </div>
    )
}

export default Dashboard