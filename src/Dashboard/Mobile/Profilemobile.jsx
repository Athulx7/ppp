import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, LogOut } from 'lucide-react'

function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}') }
    catch { return {} }
}

function ProfileMobile() {
    const navigate = useNavigate()
    const user = getCurrentUser()
    const isManager = Boolean(user?.is_manager || user?.isManager)
    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AK'
    const displayName = user?.name || 'Arjun Kumar'

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/login')
    }

    return (
        <div className="pb-6">
            <div className="px-5 pt-4 pb-3">
                <p className="text-lg font-semibold text-gray-900">Profile</p>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center px-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center
                                justify-center text-white text-xl font-semibold mb-2.5">
                    {initials}
                </div>
                <p className="text-base font-semibold text-gray-900">{displayName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {user?.designation || 'Software Engineer'} · {user?.department || 'Engineering'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-0.5 rounded-full">
                        Employee
                    </span>
                    {isManager && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-0.5 rounded-full">
                            Manager
                        </span>
                    )}
                </div>
            </div>

            {/* Info rows */}
            <div className="px-4 space-y-1.5 mb-5">
                {[
                    { label: 'Employee ID', value: user?.emp_code || 'EMP-00142' },
                    { label: 'Department', value: user?.department || 'Engineering' },
                    { label: 'Joining Date', value: user?.doj || 'Jan 15, 2022' },
                    { label: 'Manager', value: user?.manager || 'Priya Sharma' },
                    {
                        label: 'Work Email', value: user?.email || 'arjun@company.com',
                        highlight: true
                    },
                ].map(d => (
                    <div key={d.label}
                        className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-500">{d.label}</span>
                        <span className={`text-sm font-medium
                            ${d.highlight ? 'text-indigo-600' : 'text-gray-900'}`}>
                            {d.value}
                        </span>
                    </div>
                ))}
            </div>

            {/* More links — navigate to real web routes */}
            <div className="px-4 mb-5">
                <p className="text-xs font-medium text-gray-500 mb-2.5">More</p>
                {[
                    { label: 'My Calendar', path: '/employee/mycalendar' },
                    { label: 'CTC Report', path: '/employee/ctcreport' },
                    { label: 'Salary Advance Request', path: '/employee/salaryadvanceRequest' },
                    { label: 'My Leaves', path: '/employee/myleves' },
                ].map(link => (
                    <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="w-full flex items-center justify-between p-3.5
                                   border-b border-gray-100 last:border-0"
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
                    className="w-full flex items-center justify-center gap-2 p-3.5
                               bg-red-50 border border-red-200 text-red-600
                               rounded-2xl text-sm font-medium"
                >
                    <LogOut size={15} /> Sign Out
                </button>
            </div>
        </div>
    )
}

export default ProfileMobile