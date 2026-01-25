import React, { useState } from 'react';
import { 
  Users, CalendarDays, DollarSign, TrendingUp, 
  Briefcase, GraduationCap, FileCheck, PieChart,
  ChevronRight, Clock, AlertCircle, CheckCircle,
  Download, Plus, UserPlus, Calendar, FileText,
  BarChart, Activity, Bell, Gift
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import Greetings from '../common/Greetings';
import CalendarSection from '../common/CalendarSection';
import CommonButton from '../../basicComponents/CommonButton';

function HRDashboard() {
    const [isLoading, setIsLoading] = useState(false);

    // HR Metrics
    const hrMetrics = [
        { 
            title: "Total Employees", 
            value: "247", 
            icon: Users, 
            color: "bg-blue-500", 
            change: "+12 this month",
            detail: "Active: 240"
        },
        { 
            title: "Open Positions", 
            value: "18", 
            icon: Briefcase, 
            color: "bg-amber-500", 
            change: "-3 from last week",
            detail: "Urgent: 5"
        },
        { 
            title: "Pending Approvals", 
            value: "32", 
            icon: FileCheck, 
            color: "bg-orange-500", 
            change: "+8 today",
            detail: "Leaves: 24"
        },
        { 
            title: "Avg. Attendance", 
            value: "94.8%", 
            icon: TrendingUp, 
            color: "bg-green-500", 
            change: "+1.2% from last month",
            detail: "This month"
        },
        { 
            title: "Training Ongoing", 
            value: "7", 
            icon: GraduationCap, 
            color: "bg-purple-500", 
            change: "3 completed",
            detail: "Active sessions"
        },
        { 
            title: "Payroll Cost", 
            value: "$298,750", 
            icon: DollarSign, 
            color: "bg-indigo-500", 
            change: "+5.8% from last month",
            detail: "This month"
        },
    ];

    // Upcoming interviews
    const upcomingInterviews = [
        { name: "John Smith", position: "Senior Developer", time: "10:00 AM", status: "confirmed" },
        { name: "Sarah Johnson", position: "HR Executive", time: "11:30 AM", status: "pending" },
        { name: "Mike Chen", position: "Sales Manager", time: "2:00 PM", status: "confirmed" },
        { name: "Priya Sharma", position: "Marketing Head", time: "3:30 PM", status: "rescheduled" },
    ];

    // Pending approvals
    const pendingApprovals = [
        { type: "Leave Request", employee: "Raj Kumar", days: "3", date: "Dec 20-22", status: "pending" },
        { type: "Expense Claim", employee: "Maria Garcia", amount: "$450", date: "Dec 18", status: "pending" },
        { type: "Advance Salary", employee: "David Lee", amount: "$1,000", date: "Dec 15", status: "pending" },
        { type: "Resignation", employee: "Alex Turner", notice: "30 days", date: "Jan 15", status: "urgent" },
    ];

    // Recent joinings
    const recentJoinings = [
        { name: "Emily Brown", department: "Engineering", date: "Today", status: "onboarded" },
        { name: "Robert Wilson", department: "Sales", date: "Yesterday", status: "onboarded" },
        { name: "Lisa Wang", department: "Marketing", date: "2 days ago", status: "pending docs" },
    ];

    // Team birthdays
    const teamBirthdays = [
        { name: "Sarah Johnson", department: "HR", date: "Today" },
        { name: "Mike Chen", department: "Engineering", date: "Tomorrow" },
        { name: "Priya Sharma", department: "Sales", date: "Dec 28" },
    ];

    // Compliance deadlines
    const complianceDeadlines = [
        { task: "PF Filing", date: "Dec 25", status: "upcoming", priority: "high" },
        { task: "ESI Filing", date: "Dec 30", status: "upcoming", priority: "high" },
        { task: "TDS Quarterly", date: "Jan 7", status: "pending", priority: "medium" },
        { task: "Gratuity Calculation", date: "Jan 15", status: "pending", priority: "medium" },
    ];

    // Quick stats
    const quickStats = [
        { label: "This Month Joinees", value: "8" },
        { label: "This Month Exits", value: "3" },
        { label: "Active Recruitment", value: "12" },
        { label: "Pending Documents", value: "15" },
        { label: "Training Hours", value: "48" },
        { label: "Avg. Time to Hire", value: "18 days" },
    ];

    // Quick actions for HR
    const hrQuickActions = [
        { label: "Add Employee", icon: UserPlus, color: "hover:bg-blue-50 border-blue-200" },
        { label: "Process Payroll", icon: DollarSign, color: "hover:bg-green-50 border-green-200" },
        { label: "Schedule Interview", icon: Calendar, color: "hover:bg-amber-50 border-amber-200" },
        { label: "Generate Reports", icon: BarChart, color: "hover:bg-purple-50 border-purple-200" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            {isLoading && <LoadingSpinner message="Loading dashboard..." />}

                <Greetings />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {hrMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                                <p className="text-xs text-gray-600 mb-1">{metric.detail}</p>
                                <p className={`text-xs ${metric.change.includes('+') ? 'text-green-600' : metric.change.includes('-') ? 'text-red-600' : 'text-gray-500'}`}>
                                    {metric.change}
                                </p>
                            </div>
                            <div className={`${metric.color} p-2 rounded-lg`}>
                                <metric.icon className="text-white" size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <CalendarSection />

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {pendingApprovals.map((approval, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            approval.type === 'Leave Request' ? 'bg-blue-100 text-blue-600' :
                                            approval.type === 'Expense Claim' ? 'bg-green-100 text-green-600' :
                                            approval.type === 'Advance Salary' ? 'bg-amber-100 text-amber-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {approval.type === 'Leave Request' ? <CalendarDays size={18} /> :
                                             approval.type === 'Expense Claim' ? <DollarSign size={18} /> :
                                             approval.type === 'Advance Salary' ? <FileText size={18} /> :
                                             <AlertCircle size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{approval.type}</p>
                                            <p className="text-sm text-gray-500">{approval.employee} • {approval.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            approval.status === 'urgent' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {approval.status === 'urgent' ? 'Urgent' : 'Pending'}
                                        </span>
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {approval.days || approval.amount || approval.notice}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Recent Joinings</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentJoinings.map((employee, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{employee.name}</p>
                                            <p className="text-sm text-gray-500">{employee.department}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{employee.date}</p>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            employee.status === 'onboarded' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {employee.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Compliance Deadlines</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {complianceDeadlines.map((deadline, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">{deadline.task}</p>
                                        <p className="text-sm text-gray-500">Due: {deadline.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {deadline.priority}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">{deadline.status}</p>
                                    </div>
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