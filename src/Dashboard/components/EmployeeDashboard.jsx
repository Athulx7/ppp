import React, { useState } from 'react';
import {
    CalendarDays, Gift, Clock, Bell, FileText, DollarSign,
    CheckCircle, AlertCircle, Briefcase, Coffee, ChevronRight,
    Sun, Cloud, Moon
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import CalendarSection from '../common/CalendarSection'
import Greetings from '../common/Greetings'

function EmployeeDashboard() {
    const [isLoading, setIsLoading] = useState(false)

    const employeeMetrics = [
        {
            title: "Leave Balance",
            value: "12 Days",
            icon: CalendarDays,
            color: "bg-blue-100 text-blue-600",
            subtitle: "Annual Leave"
        },
        {
            title: "This Month Salary",
            value: "$4,850",
            icon: DollarSign,
            color: "bg-green-100 text-green-600",
            subtitle: "Net amount"
        },
        {
            title: "Pending Requests",
            value: "3",
            icon: Bell,
            color: "bg-amber-100 text-amber-600",
            subtitle: "1 urgent"
        },
        {
            title: "Documents",
            value: "2 Pending",
            icon: FileText,
            color: "bg-purple-100 text-purple-600",
            subtitle: "To upload"
        },
    ];

    const recentActivities = [
        { action: "Leave approved", details: "Dec 20-22", time: "2 hours ago", icon: CheckCircle, color: "text-green-600" },
        { action: "Salary credited", details: "December", time: "1 day ago", icon: DollarSign, color: "text-blue-600" },
        { action: "Task assigned", details: "Project docs", time: "2 days ago", icon: Briefcase, color: "text-indigo-600" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            {isLoading && <LoadingSpinner message="Loading dashboard..." />}

            <Greetings />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {employeeMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                                <p className="text-sm text-gray-600">{metric.subtitle}</p>
                            </div>
                            <div className={`${metric.color.split(' ')[0]} p-3 rounded-lg`}>
                                <metric.icon className={metric.color.split(' ')[1]} size={24} />
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
                            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className={`p-2 rounded-full ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 font-medium">{activity.action}</p>
                                        <p className="text-sm text-gray-600">{activity.details}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">My Requests</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {[
                                { type: "Annual Leave", status: "Approved", date: "Dec 20-22", days: 3 },
                                { type: "Medical Claim", status: "Pending", amount: "$150", date: "Dec 18" },
                                { type: "Advance Salary", status: "Processing", amount: "$500", date: "Dec 15" },
                            ].map((request, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-medium text-gray-900">{request.type}</p>
                                        <p className="text-sm text-gray-500">
                                            {request.date} {request.days && `• ${request.days} days`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                        {request.amount && (
                                            <p className="text-sm font-medium text-gray-900 mt-1">{request.amount}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Company Policies", icon: FileText, color: "bg-blue-100 text-blue-600" },
                                { label: "Team Directory", icon: Briefcase, color: "bg-green-100 text-green-600" },
                                { label: "Training", icon: Coffee, color: "bg-amber-100 text-amber-600" },
                                { label: "Help Desk", icon: AlertCircle, color: "bg-purple-100 text-purple-600" },
                            ].map((link, index) => (
                                <button
                                    key={index}
                                    className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 flex flex-col items-center justify-center transition-colors"
                                >
                                    <div className={`p-2 rounded-full mb-2 ${link.color}`}>
                                        <link.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 text-center">{link.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDashboard