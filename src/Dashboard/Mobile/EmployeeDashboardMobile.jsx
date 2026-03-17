import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    Home, Calendar, FileText, User,
    CheckCircle, DollarSign, Clock,
    ChevronRight, Download, Eye, Plus, LogOut,
    Grid3X3
} from 'lucide-react'

// ─── Bottom nav config ────────────────────────────────────────────────────────
// Each tab either renders inline content OR navigates to an existing route.
// 'screen'   → render the inline screen component (no route change)
// 'route'    → navigate to the given path (opens the existing page)
const NAV_TABS = [
    { id: 'home', label: 'Home', icon: Home, screen: true },
    { id: 'leave', label: 'Leave', icon: Calendar, screen: true },
    { id: 'payslip', label: 'Payslips', icon: FileText, screen: true },
    { id: 'profile', label: 'Profile', icon: User, screen: true },
]

// ─── Reusable primitives ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        Approved: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Rejected: 'bg-red-100 text-red-800',
        Processing: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
    }
    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    )
}

// ─── Home screen ──────────────────────────────────────────────────────────────
function HomeScreen({ navigate }) {
    const isPunchedIn = true // replace with real state

    return (
        <div className="pb-4">
            {/* Greeting header */}
            <div className="flex justify-between items-center px-5 pt-4 pb-3">
                <div>
                    <p className="text-xs text-gray-500">Good Morning</p>
                    <p className="text-lg font-semibold text-gray-900">Hello, Arjun 👋</p>
                </div>
                <div className="w-10 h-10 text-indigo-500 flex items-center justify-center text-sm font-semibold">
                    <Grid3X3 size={30} />
                </div>
            </div>

            {/* Attendance card */}
            <div className="mx-4 mb-4 bg-indigo-600 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-xs text-white/70">Today's Attendance</p>
                        <p className="text-sm font-medium text-white mt-0.5">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
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

            {/* Leave balance stats */}
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

            {/* Quick actions — navigate to existing routes */}
            <div className="px-4 mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Quick Actions</p>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { label: 'Apply Leave', path: '/employee/leaveRequest', color: 'bg-indigo-50 text-indigo-600' },
                        { label: 'My Leaves', path: '/employee/myleves', color: 'bg-emerald-50 text-emerald-600' },
                        { label: 'Regularize', path: '/employee/mycalendar', color: 'bg-amber-50 text-amber-600' },
                        { label: 'Advance', path: '/employee/salaryadvanceRequest', color: 'bg-purple-50 text-purple-600' },
                    ].map(a => (
                        <button
                            key={a.label}
                            onClick={() => navigate(a.path)}
                            className={`${a.color} rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-transparent`}
                        >
                            <ChevronRight size={18} />
                            <span className="text-[10px] font-medium text-center leading-tight">{a.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent activity */}
            <div className="px-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Recent Activity</p>
                <div className="space-y-2">
                    {[
                        { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600', title: 'Leave approved', sub: 'Annual Leave · Dec 20–22', time: '2h ago' },
                        { icon: DollarSign, bg: 'bg-blue-100', color: 'text-blue-600', title: 'Salary credited', sub: 'December · ₹58,200', time: '1d ago' },
                        { icon: Clock, bg: 'bg-amber-100', color: 'text-amber-600', title: 'Advance request', sub: 'Submitted · ₹5,000', time: '2d ago' },
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

// ─── Leave screen ─────────────────────────────────────────────────────────────
function LeaveScreen({ navigate }) {
    const balances = [
        { label: 'Annual Leave', allocated: 15, used: 3, balance: 12, color: 'bg-indigo-500', text: 'text-indigo-600' },
        { label: 'Sick Leave', allocated: 10, used: 3, balance: 7, color: 'bg-emerald-500', text: 'text-emerald-600' },
        { label: 'Casual Leave', allocated: 8, used: 3, balance: 5, color: 'bg-amber-500', text: 'text-amber-600' },
        { label: 'Comp Off', allocated: 2, used: 0, balance: 2, color: 'bg-purple-500', text: 'text-purple-600' },
    ]
    const requests = [
        { type: 'Annual Leave', status: 'Approved', dates: 'Dec 20 – Dec 22', days: '3 days', reason: 'Family vacation' },
        { type: 'Sick Leave', status: 'Approved', dates: 'Nov 10', days: '1 day', reason: 'Fever' },
        { type: 'WFH Request', status: 'Pending', dates: 'Dec 25', days: '1 day', reason: 'Remote work' },
    ]

    return (
        <div className="pb-4">
            <div className="flex justify-between items-center px-5 pt-4 pb-3">
                <p className="text-lg font-semibold text-gray-900">Leave</p>
                <button
                    onClick={() => navigate('/employee/leaveRequest')}
                    className="bg-indigo-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1"
                >
                    <Plus size={14} /> Apply
                </button>
            </div>

            {/* Balance cards */}
            <div className="grid grid-cols-2 gap-2.5 mx-4 mb-4">
                {balances.map(b => (
                    <div key={b.label} className="bg-gray-50 rounded-2xl p-3.5">
                        <p className="text-xs text-gray-500 mb-1.5">{b.label}</p>
                        <p className={`text-2xl font-semibold ${b.text}`}>
                            {b.balance} <span className="text-sm font-normal text-gray-500">days</span>
                        </p>
                        <div className="mt-2 bg-gray-200 rounded-full h-1">
                            <div
                                className={`${b.color} h-1 rounded-full`}
                                style={{ width: `${(b.used / b.allocated) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{b.used} used of {b.allocated}</p>
                    </div>
                ))}
            </div>

            {/* View all leaves → existing route */}
            <div className="px-4 mb-3">
                <button
                    onClick={() => navigate('/employee/myleves')}
                    className="w-full flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl"
                >
                    <span className="text-sm font-medium text-indigo-700">View All My Leaves</span>
                    <ChevronRight size={16} className="text-indigo-500" />
                </button>
            </div>

            {/* Recent requests */}
            <div className="px-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Recent Requests</p>
                <div className="space-y-2">
                    {requests.map((r, i) => (
                        <div key={i} className="p-3.5 border border-gray-200 rounded-2xl">
                            <div className="flex justify-between items-start mb-1.5">
                                <p className="text-sm font-medium text-gray-900">{r.type}</p>
                                <StatusBadge status={r.status} />
                            </div>
                            <p className="text-xs text-gray-500">{r.dates} · {r.days}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{r.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Payslip screen ───────────────────────────────────────────────────────────
function PayslipScreen({ navigate }) {
    const payslips = [
        { month: 'December 2024', abbr: 'DEC', gross: '₹52,000', net: '₹39,200', status: 'paid' },
        { month: 'November 2024', abbr: 'NOV', gross: '₹52,000', net: '₹39,200', status: 'paid' },
        { month: 'October 2024', abbr: 'OCT', gross: '₹52,000', net: '₹39,200', status: 'paid' },
        { month: 'September 2024', abbr: 'SEP', gross: '₹52,000', net: '₹39,200', status: 'paid' },
    ]

    return (
        <div className="pb-4">
            <div className="px-5 pt-4 pb-3">
                <p className="text-lg font-semibold text-gray-900">Payslips</p>
            </div>

            {/* CTC summary */}
            <div className="mx-4 mb-4 bg-indigo-600 rounded-2xl p-4">
                <p className="text-xs text-white/70 mb-1">Annual CTC</p>
                <p className="text-2xl font-semibold text-white mb-3">₹5,82,000</p>
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/15 rounded-xl p-3">
                        <p className="text-xs text-white/60 mb-1">Monthly Gross</p>
                        <p className="text-base font-semibold text-white">₹52,000</p>
                    </div>
                    <div className="bg-white/15 rounded-xl p-3">
                        <p className="text-xs text-white/60 mb-1">Take Home</p>
                        <p className="text-base font-semibold text-white">₹39,200</p>
                    </div>
                </div>
            </div>

            {/* View CTC breakdown → existing route */}
            <div className="px-4 mb-3">
                <button
                    onClick={() => navigate('/employee/ctcreport')}
                    className="w-full flex items-center justify-between p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl"
                >
                    <span className="text-sm font-medium text-indigo-700">View Full CTC Report</span>
                    <ChevronRight size={16} className="text-indigo-500" />
                </button>
            </div>

            {/* Payslip list → navigate to payslip route */}
            <div className="px-4">
                <p className="text-xs font-medium text-gray-500 mb-2.5">Recent Payslips</p>
                <div className="space-y-2">
                    {payslips.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-3.5 border border-gray-200 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-semibold text-indigo-700">{p.abbr}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{p.month}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Net: {p.net} · <span className="text-emerald-600">Paid</span>
                                </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => navigate('/employee/payslip')}
                                    className="w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center"
                                >
                                    <Eye size={14} className="text-gray-500" />
                                </button>
                                <button
                                    onClick={() => console.log('download', p.month)}
                                    className="w-8 h-8 rounded-lg border border-indigo-200 bg-indigo-50 flex items-center justify-center"
                                >
                                    <Download size={14} className="text-indigo-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Profile screen ───────────────────────────────────────────────────────────
function ProfileScreen({ navigate }) {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    return (
        <div className="pb-4">
            <div className="px-5 pt-4 pb-3">
                <p className="text-lg font-semibold text-gray-900">Profile</p>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center px-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-semibold mb-2.5">
                    AK
                </div>
                <p className="text-base font-semibold text-gray-900">Arjun Kumar</p>
                <p className="text-xs text-gray-500 mt-0.5">Software Engineer · Engineering</p>
                <span className="mt-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-0.5 rounded-full">
                    Employee
                </span>
            </div>

            {/* Details */}
            <div className="px-4 space-y-1.5 mb-5">
                {[
                    { label: 'Employee ID', value: 'EMP-00142' },
                    { label: 'Department', value: 'Engineering' },
                    { label: 'Joining Date', value: 'Jan 15, 2022' },
                    { label: 'Manager', value: 'Priya Sharma' },
                    { label: 'Work Email', value: 'arjun@company.com', highlight: true },
                ].map(d => (
                    <div key={d.label} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-500">{d.label}</span>
                        <span className={`text-sm font-medium ${d.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
                            {d.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* Quick links to other routes */}
            <div className="px-4 mb-5">
                <p className="text-xs font-medium text-gray-500 mb-2.5">More</p>
                {[
                    { label: 'My Calendar', path: '/employee/mycalendar' },
                    { label: 'CTC Report', path: '/employee/ctcreport' },
                    { label: 'Salary Advance Request', path: '/employee/salaryadvanceRequest' },
                ].map(link => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="w-full flex items-center justify-between p-3.5 border-b border-gray-100 last:border-0"
                    >
                        <span className="text-sm text-gray-800">{link.label}</span>
                        <ChevronRight size={15} className="text-gray-400" />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <div className="px-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium"
                >
                    <LogOut size={15} />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

// ─── Main mobile dashboard ────────────────────────────────────────────────────
function EmployeeDashboardMobile() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('home')

    const screens = {
        home: <HomeScreen navigate={navigate} />,
        leave: <LeaveScreen navigate={navigate} />,
        payslip: <PayslipScreen navigate={navigate} />,
        profile: <ProfileScreen navigate={navigate} />,
    }

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/* Screen content */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {screens[activeTab]}
            </div>

            {/* Bottom navigation */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 grid grid-cols-4 pb-safe">
                {NAV_TABS.map(tab => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex flex-col items-center justify-center gap-1 py-2.5 px-1"
                        >
                            <tab.icon
                                size={22}
                                className={isActive ? 'text-indigo-600' : 'text-gray-400'}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default EmployeeDashboardMobile