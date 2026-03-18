import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DUMMY_NOTIFICATIONS = [
    {
        id: 1,
        title: "Leave Approved",
        message: "Your casual leave request for Mar 20–21 has been approved.",
        created_at: "2025-03-17 09:15 AM",
        is_read: false,
        type: "success",
        route: "/admin/leaveapproval"
    },
    {
        id: 2,
        title: "Payslip Available",
        message: "Your payslip for February 2025 is now ready to download.",
        created_at: "2025-03-16 06:00 PM",
        is_read: false,
        type: "info",
        route: "/employee/payslip"
    },
    {
        id: 3,
        title: "Attendance Regularization",
        message: "You missed punch-out on Mar 14. Please regularize attendance.",
        created_at: "2025-03-15 10:30 AM",
        is_read: false,
        type: "warning",
        route: "/attendance"
    },
    {
        id: 4,
        title: "Holiday Notice",
        message: "Office will remain closed on Mar 25 for Holi. Have a great holiday!",
        created_at: "2025-03-14 11:00 AM",
        is_read: true,
        type: "info",
        route: "/holidays"
    },
    {
        id: 5,
        title: "Profile Updated",
        message: "Your emergency contact details were updated successfully.",
        created_at: "2025-03-13 03:45 PM",
        is_read: true,
        type: "success",
        route: "/profile"
    },
    {
        id: 6,
        title: "Document Expiry Alert",
        message: "Your ID proof on file expires in 30 days. Please upload a renewed copy.",
        created_at: "2025-03-12 09:00 AM",
        is_read: true,
        type: "warning",
        route: "/documents"
    }
];

const TYPE_CONFIG = {
    success: {
        icon: CheckCircle,
        bg: "bg-green-50",
        iconColor: "text-green-500",
        dot: "bg-green-500"
    },
    info: {
        icon: Info,
        bg: "bg-blue-50",
        iconColor: "text-blue-500",
        dot: "bg-blue-500"
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-amber-50",
        iconColor: "text-amber-500",
        dot: "bg-amber-500"
    }
}

function NotificationPanel({ notifications, onClose, onItemClick, onMarkAllRead }) {
    const unreadCount = notifications.filter(n => !n.is_read).length
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    return createPortal(
        <div className="fixed inset-0 flex" style={{ zIndex: 99999 }}>
            <div className="flex-1 bg-black/40" onClick={onClose} />

            <div className="w-80 bg-white h-full flex flex-col shadow-2xl" style={{ borderLeft: "1px solid #e5e7eb" }}>
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0">
                    <div>
                        <h2 className="font-semibold text-gray-800 text-base">Notifications</h2>
                        {unreadCount > 0 && (
                            <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button onClick={onMarkAllRead}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all read
                            </button>
                        )}
                        <button onClick={onClose}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                            <Bell className="w-8 h-8 opacity-30" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((item) => {
                            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
                            const Icon = config.icon;
                            return (
                                <div key={item.id} onClick={() => onItemClick(item)}
                                    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${!item.is_read ? "bg-indigo-50/60 hover:bg-indigo-50" : ""}`}
                                >
                                    <div className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                                        <Icon className={`w-4 h-4 ${config.iconColor}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium leading-snug ${!item.is_read ? "text-gray-900" : "text-gray-700"}`}>
                                                {item.title}
                                            </p>
                                            {!item.is_read && (
                                                <span className={`flex-shrink-0 w-2 h-2 mt-1 rounded-full ${config.dot}`} />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                            {item.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {item.created_at}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                <div className="border-t border-gray-200 px-4 py-2.5 bg-gray-50">
                    <p className="text-xs text-center text-gray-400">
                        Showing last {notifications.length} notifications
                    </p>
                </div>
            </div>
        </div>,
        document.body
    )
}

function Notifications() {
    const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS)
    const [showPanel, setShowPanel] = useState(false)
    const navigate = useNavigate()

    const unreadCount = notifications.filter(n => !n.is_read).length

    const handleItemClick = (item) => {
        setNotifications(prev =>
            prev.map(n => n.id === item.id ? { ...n, is_read: true } : n)
        )
        setShowPanel(false)
    }

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }

    return (
        <>
            <div className="relative mr-4">
                <button onClick={() => setShowPanel(true)} className="p-2 rounded-lg ">
                    <Bell className="text-gray-600 cursor-pointer w-5 h-5 hover:text-indigo-600 transition-colors" />
                </button>
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 pointer-events-none">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </div>

            {showPanel && (
                <NotificationPanel
                    notifications={notifications}
                    onClose={() => setShowPanel(false)}
                    onItemClick={handleItemClick}
                    onMarkAllRead={handleMarkAllRead}
                />
            )}
        </>
    )
}

export default Notifications