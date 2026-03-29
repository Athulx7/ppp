import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Users, CheckCircle, DollarSign,
    Clock, ChevronRight, Calendar,
    AlarmClock, FileText,
} from 'lucide-react'
import { getRoleBasePath } from '../../library/constants'

function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}') }
    catch { return {} }
}

function EmployeeDashboardMobile() {
    const navigate = useNavigate()
    const user = getCurrentUser()

    const isManager = Boolean(user?.is_manager || user?.isManager)
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AK'
    const displayName = user?.name || 'Arjun Kumar'
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div className="pb-4">

            <div className="flex justify-between items-center px-5 pt-4 pb-3">
                <div>
                    <p className="text-xs text-gray-500">{greeting}</p>
                    <p className="text-lg font-semibold text-gray-900">
                        Hello, {displayName.split(' ')[0]} 👋
                    </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center
                                justify-center text-white text-sm font-semibold">
                    {initials}
                </div>
            </div>

            <div className="mx-4 mb-4 bg-indigo-600 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-xs text-white/70">Today's Attendance</p>
                        <p className="text-sm font-medium text-white mt-0.5">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long', day: 'numeric', month: 'short',
                            })}
                        </p>
                    </div>
                    <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-full">
                        On Time
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-white/15 rounded-xl p-3">
                        <p className="text-xs text-white/60 mb-1">Punch In</p>
                        <p className="text-base font-semibold text-white">09:02 AM</p>
                    </div>
                    <div className="bg-white/15 rounded-xl p-3">
                        <p className="text-xs text-white/60 mb-1">Punch Out</p>
                        <p className="text-base font-semibold text-white">—</p>
                    </div>
                </div>
                <button className="w-full bg-white text-indigo-600 rounded-xl py-2.5 text-sm font-semibold">
                    Punch Out
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mx-4 mb-4">
                {[
                    { label: 'Annual', value: 12, color: 'text-indigo-600' },
                    { label: 'Sick', value: 7, color: 'text-emerald-600' },
                    { label: 'Pending', value: 3, color: 'text-amber-600' },
                ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                        <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {isManager && (
                <div className="mx-4 mb-4">
                    <button
                        onClick={() => navigate(`${getRoleBasePath()}/approvals`)}
                        className="w-full flex items-center justify-between p-3.5
                                   bg-amber-50 border border-amber-200 rounded-2xl"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Users size={15} className="text-amber-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-amber-800">Pending Approvals</p>
                                <p className="text-xs text-amber-600">5 requests awaiting your action</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-amber-500" />
                    </button>
                </div>
            )}

            <div className="px-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Quick Actions</p>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        {
                            label: 'Apply Leave',
                            path: `${getRoleBasePath()}/leave`,
                            color: 'bg-indigo-50 text-indigo-600',
                            icon: Calendar,
                        },
                        {
                            label: 'Regularize',
                            path: `${getRoleBasePath()}/regularize`,
                            color: 'bg-emerald-50 text-emerald-600',
                            icon: AlarmClock,
                        },
                        {
                            label: 'Payslips',
                            path: `${getRoleBasePath()}/payslips`,
                            color: 'bg-purple-50 text-purple-600',
                            icon: FileText,
                        },
                        {
                            label: 'Advance',
                            path: `${getRoleBasePath()}/salaryadvanceRequest`,
                            color: 'bg-amber-50 text-amber-600',
                            icon: DollarSign,
                        },
                        ...(isManager ? [{
                            label: 'Approvals',
                            path: `${getRoleBasePath()}/approvals`,
                            color: 'bg-blue-50 text-blue-600',
                            icon: CheckCircle,
                        }] : []),
                    ].map(a => (
                        <button
                            key={a.label}
                            onClick={() => navigate(a.path)}
                            className={`${a.color} rounded-2xl p-3 flex flex-col items-center gap-1.5`}
                        >
                            <a.icon size={18} />
                            <span className="text-[10px] font-medium text-center leading-tight">
                                {a.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Recent Activity</p>
                <div className="space-y-2">
                    {[
                        {
                            icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600',
                            title: 'Leave approved', sub: 'Annual Leave · Dec 20–22', time: '2h ago'
                        },
                        {
                            icon: DollarSign, bg: 'bg-blue-100', color: 'text-blue-600',
                            title: 'Salary credited', sub: 'December · ₹58,200', time: '1d ago'
                        },
                        {
                            icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600',
                            title: 'Advance request', sub: 'Submitted · ₹5,000', time: '2d ago'
                        },
                    ].map((a, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                            <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center flex-shrink-0`}>
                                <a.icon size={16} className={a.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{a.sub}</p>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboardMobile