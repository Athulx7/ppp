import React, { useState, useEffect } from 'react'
import {
    Bell, X, CheckCircle, Clock, AlertCircle,
    Calendar, DollarSign, AlarmClock, RefreshCw,
    ChevronRight, Trash2, Check
} from 'lucide-react'

const TYPE_META = {
    leave_approved: { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600', label: 'Leave' },
    leave_rejected: { icon: X, bg: 'bg-red-100', color: 'text-red-600', label: 'Leave' },
    leave_pending: { icon: Clock, bg: 'bg-yellow-100', color: 'text-yellow-600', label: 'Leave' },
    salary_credited: { icon: DollarSign, bg: 'bg-blue-100', color: 'text-blue-600', label: 'Payroll' },
    reg_approved: { icon: CheckCircle, bg: 'bg-indigo-100', color: 'text-indigo-600', label: 'Attendance' },
    reg_rejected: { icon: X, bg: 'bg-red-100', color: 'text-red-600', label: 'Attendance' },
    advance_approved: { icon: DollarSign, bg: 'bg-emerald-100', color: 'text-emerald-600', label: 'Advance' },
    general: { icon: Bell, bg: 'bg-gray-100', color: 'text-gray-600', label: 'General' },
}

function getMeta(type) {
    return TYPE_META[type] || TYPE_META.general
}

export function UpdateBanner({ onUpdate }) {
    return (
        <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-600 text-white">
            <div className="flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '2s' }} />
                <span className="text-xs font-medium">New update available</span>
            </div>
            <button
                onClick={onUpdate}
                className="flex items-center gap-1.5 text-xs font-bold bg-white text-indigo-600
                           px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
            >
                <RefreshCw size={11} /> Update now
            </button>
        </div>
    )
}

export function BellButton({ count, onClick }) {
    return (
        <button
            onClick={onClick}
            className="relative w-9 h-9 flex items-center justify-center
                       rounded-xl hover:bg-gray-100 transition-colors"
        >
            <Bell size={20} className="text-gray-600" />
            {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px]
                                 bg-red-500 text-white text-[9px] font-bold rounded-full
                                 flex items-center justify-center leading-none px-1">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </button>
    )
}

export function NotificationSheet({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead, onDelete, updateAvailable, onUpdate }) {
    if (!isOpen) return null

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">

                <div className="flex-shrink-0 pt-3 pb-4 px-5 border-b border-gray-100">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-base font-bold text-gray-900">Notifications</p>
                            {unreadCount > 0 && (
                                <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={onMarkAllRead}
                                    className="text-xs font-medium text-indigo-600 bg-indigo-50
                                               px-3 py-1.5 rounded-xl"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100">
                                <X size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {updateAvailable && (
                    <div className="flex-shrink-0 flex items-center justify-between
                                    mx-4 mt-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <RefreshCw size={14} className="text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-indigo-800">New update available</p>
                                <p className="text-xs text-indigo-500 mt-0.5">Tap to get the latest version</p>
                            </div>
                        </div>
                        <button
                            onClick={onUpdate}
                            className="text-xs font-bold text-white bg-indigo-600
                                       px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                        >
                            <RefreshCw size={11} /> Update
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-3 space-y-2">
                    {notifications.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <Bell size={36} className="mx-auto mb-2 opacity-25" />
                            <p className="text-sm font-medium">No notifications</p>
                            <p className="text-xs mt-1 text-gray-400">You're all caught up!</p>
                        </div>
                    ) : notifications.map(n => {
                        const meta = getMeta(n.type)
                        const IconEl = meta.icon
                        return (
                            <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-2xl transition-colors group
                                    ${n.read ? 'bg-gray-50' : 'bg-white border border-indigo-100 shadow-sm'}`}
                            >
                                {!n.read && (
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-2" />
                                )}
                                {n.read && <div className="w-2 flex-shrink-0" />}

                                <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                    <IconEl size={16} className={meta.color} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm leading-snug ${n.read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
                                            {n.title}
                                        </p>
                                        <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{n.time}</span>
                                    </div>
                                    {n.body && (
                                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${meta.bg} ${meta.color}`}>
                                            {meta.label}
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                            {!n.read && (
                                                <button onClick={() => onMarkRead(n.id)}
                                                    className="p-1 text-indigo-500 hover:bg-indigo-50 rounded-lg">
                                                    <Check size={12} />
                                                </button>
                                            )}
                                            <button onClick={() => onDelete(n.id)}
                                                className="p-1 text-red-400 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl text-sm font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export function useNotifications() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'leave_approved', title: 'Leave Approved', body: 'Your Annual Leave (Dec 20–22) has been approved by Priya Sharma', time: '2h ago', read: false },
        { id: 2, type: 'salary_credited', title: 'Salary Credited', body: 'December salary ₹39,200 has been credited to your account', time: '1d ago', read: false },
        { id: 3, type: 'reg_approved', title: 'Regularization OK', body: 'Your attendance regularization for Mar 15 has been approved', time: '2d ago', read: true },
        { id: 4, type: 'leave_pending', title: 'Leave Pending', body: 'Your Earned Leave (Apr 1–5) is awaiting manager approval', time: '3d ago', read: true },
        { id: 5, type: 'advance_approved', title: 'Advance Approved', body: 'Salary advance of ₹5,000 has been approved', time: '4d ago', read: true },
    ])

    useEffect(() => {
        const poll = async () => {
            try {
                // const result = await ApiCall('GET', '/api/notifications')
                // setNotifications(result.data.data)
            } catch (err) {
                console.error('notification poll error:', err)
            }
        }
        poll()
        const interval = setInterval(poll, 30_000)
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    const deleteNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

    return { notifications, unreadCount, markRead, markAllRead, deleteNotif }
}