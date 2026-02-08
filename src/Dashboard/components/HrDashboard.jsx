import React, { useState } from 'react';
import {
    Users, CalendarDays, DollarSign, TrendingUp,
    Briefcase, GraduationCap, FileCheck, PieChart,
    ChevronRight, Clock, AlertCircle, CheckCircle,
    Download, Plus, UserPlus, Calendar, FileText,
    BarChart, Activity, Bell, Gift, Shield,
    UserCog, FolderTree, Award, Send, ListTodo,
    Edit, Trash2, Eye, Filter, Search
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import Greetings from '../common/Greetings';
import CalendarSection from '../common/CalendarSection';
import CommonButton from '../../basicComponents/CommonButton';

function HRDashboard() {
    const [isLoading, setIsLoading] = useState(false);

    const hrMetrics = [
        {
            title: "Total Employees",
            value: "247",
            icon: Users,
            color: "bg-blue-500",
            change: "+12 this month",
            detail: "Active: 240 | On Leave: 7"
        },
        {
            title: "Leave Requests",
            value: "28",
            icon: CalendarDays,
            color: "bg-amber-500",
            change: "+8 pending",
            detail: "Approved: 20 | Rejected: 5"
        },
        {
            title: "Employee Master",
            value: "Updated",
            icon: UserCog,
            color: "bg-purple-500",
            change: "15 edits pending",
            detail: "Last updated: Today"
        },
        {
            title: "Departments",
            value: "14",
            icon: FolderTree,
            color: "bg-green-500",
            change: "2 new added",
            detail: "Largest: Engineering"
        },
        {
            title: "Designations",
            value: "32",
            icon: Award,
            color: "bg-indigo-500",
            change: "3 new roles",
            detail: "Recent: Tech Lead"
        },
        {
            title: "Leave Types",
            value: "8",
            icon: ListTodo,
            color: "bg-orange-500",
            change: "1 new added",
            detail: "Popular: Sick Leave"
        },
    ];

    const upcomingLeaves = [
        {
            name: "John Smith",
            department: "Engineering",
            type: "Annual Leave",
            dates: "Dec 25-29",
            status: "approved",
            days: "5 days"
        },
        {
            name: "Sarah Johnson",
            department: "HR",
            type: "Sick Leave",
            dates: "Dec 26",
            status: "pending",
            days: "1 day"
        },
        {
            name: "Mike Chen",
            department: "Sales",
            type: "Emergency Leave",
            dates: "Today",
            status: "urgent",
            days: "1 day"
        },
        {
            name: "Priya Sharma",
            department: "Marketing",
            type: "Maternity Leave",
            dates: "Jan 1-30",
            status: "approved",
            days: "30 days"
        },
    ];

    const pendingApprovals = [
        {
            id: 1,
            type: "Leave Request",
            employee: "Raj Kumar",
            details: "Annual Leave",
            duration: "3 days",
            date: "Dec 20-22",
            status: "pending",
            priority: "normal"
        },
        {
            id: 2,
            type: "Leave Request",
            employee: "Maria Garcia",
            details: "Sick Leave",
            duration: "2 days",
            date: "Dec 18-19",
            status: "pending",
            priority: "normal"
        },
        {
            id: 3,
            type: "Employee Edit",
            employee: "David Lee",
            details: "Update Bank Details",
            duration: "",
            date: "Dec 15",
            status: "pending",
            priority: "medium"
        },
        {
            id: 4,
            type: "Leave Type",
            employee: "System",
            details: "Add Paternity Leave",
            duration: "",
            date: "Dec 14",
            status: "pending",
            priority: "low"
        },
    ];

    const recentEmployeeUpdates = [
        {
            name: "Emily Brown",
            action: "Employee Added",
            department: "Engineering",
            date: "Today",
            time: "10:30 AM"
        },
        {
            name: "Robert Wilson",
            action: "Details Updated",
            department: "Sales",
            date: "Yesterday",
            time: "3:45 PM"
        },
        {
            name: "Lisa Wang",
            action: "Leave Assigned",
            department: "Marketing",
            date: "2 days ago",
            time: "11:20 AM"
        },
        {
            name: "Alex Turner",
            action: "Department Changed",
            department: "HR",
            date: "3 days ago",
            time: "2:15 PM"
        },
    ];

    const departmentStats = [
        { name: "Engineering", employees: 85, color: "bg-blue-500" },
        { name: "Sales", employees: 45, color: "bg-green-500" },
        { name: "Marketing", employees: 28, color: "bg-purple-500" },
        { name: "HR", employees: 18, color: "bg-amber-500" },
        { name: "Finance", employees: 22, color: "bg-indigo-500" },
        { name: "Operations", employees: 49, color: "bg-red-500" },
    ];

    const leaveTypeStats = [
        { type: "Annual Leave", count: 45, color: "bg-blue-500" },
        { type: "Sick Leave", count: 28, color: "bg-green-500" },
        { type: "Casual Leave", count: 32, color: "bg-amber-500" },
        { type: "Maternity", count: 5, color: "bg-pink-500" },
        { type: "Paternity", count: 3, color: "bg-indigo-500" },
        { type: "Emergency", count: 12, color: "bg-red-500" },
    ];

    const quickStats = [
        { label: "Active Departments", value: "14" },
        { label: "Total Designations", value: "32" },
        { label: "Leave Types", value: "8" },
        { label: "Pending Approvals", value: "28" },
        { label: "This Month Joinees", value: "12" },
        { label: "Employee Updates", value: "47" },
    ];

    const hrQuickActions = [
        {
            label: "Employee Master",
            icon: Users,
            color: "hover:bg-blue-50 border-blue-200",
            description: "Add/Edit employee details"
        },
        {
            label: "Leave Manager",
            icon: CalendarDays,
            color: "hover:bg-green-50 border-green-200",
            description: "Manage leaves & approvals"
        },
        {
            label: "Department Master",
            icon: FolderTree,
            color: "hover:bg-amber-50 border-amber-200",
            description: "Add/Edit departments"
        },
        {
            label: "Designation Master",
            icon: Award,
            color: "hover:bg-purple-50 border-purple-200",
            description: "Manage designations"
        },
        {
            label: "Leave Types",
            icon: ListTodo,
            color: "hover:bg-indigo-50 border-indigo-200",
            description: "Configure leave policies"
        },
        {
            label: "Reports",
            icon: BarChart,
            color: "hover:bg-emerald-50 border-emerald-200",
            description: "Generate HR reports"
        },
    ];

    const handleQuickAction = (action) => {
        console.log(`Clicked ${action.label}`);
    };

    const handleApprove = (id) => {
        console.log(`Approving request ${id}`);
    };

    const handleReject = (id) => {
        console.log(`Rejecting request ${id}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {isLoading && <LoadingSpinner message="Loading HR Dashboard..." />}

            <Greetings />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {hrMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                                <p className="text-xs text-gray-600 mb-1">{metric.detail}</p>
                                <p className={`text-xs ${metric.change.includes('+') ? 'text-green-600' : 'text-amber-600'}`}>
                                    {metric.change}
                                </p>
                            </div>
                            <div className={`${metric.color} p-2 rounded-lg ml-2`}>
                                <metric.icon className="text-white" size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {hrQuickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                className={`bg-white rounded-lg p-4 flex flex-col items-center justify-center border ${action.color} transition-all hover:shadow-md hover:scale-[1.02]`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${action.color.split(' ')[1]?.replace('border-', 'bg-').replace('-200', '-100')} ${action.color.includes('blue') ? 'text-blue-600' :
                                    action.color.includes('green') ? 'text-green-600' :
                                        action.color.includes('amber') ? 'text-amber-600' :
                                            action.color.includes('purple') ? 'text-purple-600' :
                                                action.color.includes('indigo') ? 'text-indigo-600' :
                                                    'text-emerald-600'
                                    }`}>
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-semibold text-gray-800 text-center mb-1">{action.label}</span>
                                <span className="text-xs text-gray-500 text-center">{action.description}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <CalendarSection />

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {pendingApprovals.map((approval) => (
                                <div key={approval.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`p-3 rounded-lg ${approval.type === 'Leave Request' ? 'bg-blue-100 text-blue-600' :
                                            approval.type === 'Employee Edit' ? 'bg-purple-100 text-purple-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                            {approval.type === 'Leave Request' ? <CalendarDays size={20} /> :
                                                approval.type === 'Employee Edit' ? <Edit size={20} /> :
                                                    <FileText size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900">{approval.type}</p>
                                            <p className="text-sm text-gray-600">{approval.employee} • {approval.details}</p>
                                            <p className="text-xs text-gray-500 mt-1">{approval.date} {approval.duration && `• ${approval.duration}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {approval.type === 'Leave Request' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(approval.id)}
                                                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(approval.id)}
                                                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${approval.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                            approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {approval.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Department Distribution</h3>
                            <div className="space-y-3">
                                {departmentStats.map((dept, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                                            <span className="text-sm text-gray-700">{dept.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-900">{dept.employees}</span>
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${dept.color} h-2 rounded-full`}
                                                    style={{ width: `${(dept.employees / 247) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Leave Type Statistics</h3>
                            <div className="space-y-3">
                                {leaveTypeStats.map((leave, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${leave.color}`}></div>
                                            <span className="text-sm text-gray-700">{leave.type}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-900">{leave.count}</span>
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${leave.color} h-2 rounded-full`}
                                                    style={{ width: `${(leave.count / 125) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Leaves</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {upcomingLeaves.map((leave, index) => (
                                <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{leave.name}</p>
                                            <p className="text-sm text-gray-500">{leave.department}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{leave.type}</span>
                                        <span className="font-medium text-gray-900">{leave.days}</span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {leave.dates}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Recent Employee Updates</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentEmployeeUpdates.map((update, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                                        {update.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{update.name}</p>
                                        <p className="text-sm text-gray-600">{update.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                                {update.department}
                                            </span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-xs text-gray-500">{update.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500">{update.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">HR Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {quickStats.map((stat, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HRDashboard;