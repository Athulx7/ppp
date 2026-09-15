import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDays, Gift, Clock, Bell, FileText, DollarSign,
    CheckCircle, AlertCircle, Briefcase, Coffee, ChevronRight,
    Sun, Cloud, Moon, Download, Eye, Send, Plus, User,
    CreditCard, FileCheck, Receipt, Calendar, TrendingUp,
    Award, Shield, History, Wallet, ChevronDown, Filter,
    ExternalLink, Package
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import CalendarSection from '../common/CalendarSection';
import Greetings from '../common/Greetings';
import CommonButton from '../../basicComponents/CommonButton';
import { useIsMobile } from '../Hooks/useIsMobile';
import EmployeeDashboardMobile from '../Mobile/EmployeeDashboardMobile';
import { ApiCall } from '../../library/constants';

function EmployeeDashboard() {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchEmployeeDashboard = async () => {
            setIsLoading(true);
            try {
                const res = await ApiCall('get', '/dashboard/employee');
                if (res?.data?.success && res.data.data) {
                    setDashboardData(res.data.data);
                }
            } catch (error) {
                console.error('Failed to load employee dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeDashboard();
    }, []);

    // Dynamic Employee Metrics
    const employeeMetrics = useMemo(() => {
        const m = dashboardData?.metrics || {};
        return [
            {
                title: "Leave Balance",
                value: m.leaveBalance?.value ?? "0 Days",
                icon: CalendarDays,
                color: "bg-blue-100 text-blue-600",
                subtitle: m.leaveBalance?.subtitle ?? "Allocated vs Used",
                trend: m.leaveBalance?.trend ?? "Active leaves",
                trendColor: m.leaveBalance?.trendColor ?? "text-green-600"
            },
            {
                title: "Current CTC",
                value: m.currentCtc?.value ?? "$0",
                icon: DollarSign,
                color: "bg-green-100 text-green-600",
                subtitle: m.currentCtc?.subtitle ?? "Annual compensation",
                trend: m.currentCtc?.trend ?? "Active structure",
                trendColor: m.currentCtc?.trendColor ?? "text-green-600"
            },
            {
                title: "Pending Requests",
                value: m.pendingRequests?.value ?? "0",
                icon: Bell,
                color: "bg-amber-100 text-amber-600",
                subtitle: m.pendingRequests?.subtitle ?? "Leave & Advance",
                trend: m.pendingRequests?.trend ?? "Awaiting review",
                trendColor: m.pendingRequests?.trendColor ?? "text-amber-600"
            },
            {
                title: "Documents",
                value: m.documents?.value ?? "Verified",
                icon: FileCheck,
                color: "bg-purple-100 text-purple-600",
                subtitle: m.documents?.subtitle ?? "Profile active",
                trend: m.documents?.trend ?? "Status: Active",
                trendColor: m.documents?.trendColor ?? "text-emerald-600"
            },
        ];
    }, [dashboardData]);

    // Dynamic Leave Breakdown
    const leaveBreakdown = useMemo(() => {
        return dashboardData?.leaveBreakdown || [];
    }, [dashboardData]);

    // Dynamic Recent Payslips
    const recentPayslips = useMemo(() => {
        return dashboardData?.recentPayslips || [];
    }, [dashboardData]);

    // Dynamic CTC Breakdown
    const ctcBreakdown = useMemo(() => {
        return dashboardData?.ctcBreakdown || [];
    }, [dashboardData]);

    // Dynamic Recent Activities
    const recentActivities = useMemo(() => {
        const icons = [CheckCircle, DollarSign, Send, FileCheck];
        const colors = ["text-green-600", "text-blue-600", "text-amber-600", "text-purple-600"];
        const list = dashboardData?.recentActivities || [];
        return list.map((item, idx) => ({
            ...item,
            icon: icons[idx % icons.length],
            color: colors[idx % colors.length]
        }));
    }, [dashboardData]);

    // Dynamic My Requests
    const myRequests = useMemo(() => {
        return dashboardData?.myRequests || [];
    }, [dashboardData]);

    // Upcoming Holidays
    const upcomingHolidays = [
        { name: "Christmas", date: "Dec 25", type: "public", days: 1 },
        { name: "New Year", date: "Jan 1", type: "public", days: 1 },
        { name: "Republic Day", date: "Jan 26", type: "public", days: 1 },
        { name: "Company Holiday", date: "Dec 31", type: "optional", days: 1 },
    ];

    // Quick Actions for Employees
    const employeeQuickActions = [
        {
            label: "Apply Leave",
            icon: Calendar,
            color: "hover:bg-blue-50 border-blue-200",
            description: "Submit leave request",
            path: "/employee/leaveRequest"
        },
        {
            label: "Advance Salary",
            icon: Wallet,
            color: "hover:bg-green-50 border-green-200",
            description: "Request salary advance",
            path: "/employee/salaryadvanceRequest"
        },
        {
            label: "View Payslips",
            icon: Receipt,
            color: "hover:bg-purple-50 border-purple-200",
            description: "Download salary slips",
            path: "/employee/payslip"
        },
        {
            label: "View CTC",
            icon: TrendingUp,
            color: "hover:bg-amber-50 border-amber-200",
            description: "Check compensation",
            path: "/employee/ctcreport"
        },
        {
            label: "My Profile",
            icon: FileText,
            color: "hover:bg-emerald-50 border-emerald-200",
            description: "View personal details",
            path: "/employee/profile"
        },
        {
            label: "My Leaves",
            icon: History,
            color: "hover:bg-indigo-50 border-indigo-200",
            description: "Track leave balance",
            path: "/employee/myleves"
        },
    ];

    const handleQuickAction = (action) => {
        if (action?.path) {
            navigate(action.path);
        }
    };

    const downloadPayslip = () => {
        navigate('/employee/payslip');
    };

    const viewPayslip = () => {
        navigate('/employee/payslip');
    };

    const applyLeave = () => {
        navigate('/employee/leaveRequest');
    };

    const requestAdvance = () => {
        navigate('/employee/salaryadvanceRequest');
    };

    return isMobile ? <EmployeeDashboardMobile /> :
        <div className="bg-gray-50 min-h-screen">
            {isLoading && <LoadingSpinner message="Loading dashboard..." />}

            <Greetings />

            {/* Employee Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {employeeMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                                <p className="text-sm text-gray-600 mb-2">{metric.subtitle}</p>
                                <p className={`text-xs ${metric.trendColor}`}>
                                    {metric.trend}
                                </p>
                            </div>
                            <div className={`${metric.color.split(' ')[0]} p-3 rounded-lg ml-3`}>
                                <metric.icon className={metric.color.split(' ')[1]} size={24} />
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
                        {employeeQuickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                className={`bg-white rounded-lg p-4 flex flex-col items-center justify-center border ${action.color} transition-all hover:shadow-md hover:scale-[1.02]`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${action.color.split(' ')[1]?.replace('border-', 'bg-').replace('-200', '-100')} ${action.color.includes('blue') ? 'text-blue-600' :
                                    action.color.includes('green') ? 'text-green-600' :
                                        action.color.includes('purple') ? 'text-purple-600' :
                                            action.color.includes('amber') ? 'text-amber-600' :
                                                action.color.includes('emerald') ? 'text-emerald-600' :
                                                    'text-indigo-600'
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
                            <h2 className="text-xl font-bold text-gray-900">Leave Balance</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Total Balance:</span>
                                <span className="text-lg font-bold text-blue-600">32 Days</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {leaveBreakdown.map((leave, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${leave.color}`}></div>
                                            <span className="font-medium text-gray-900">{leave.type}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">Balance</div>
                                                <div className="font-bold text-gray-900">{leave.balance} days</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Allocated: {leave.allocated} days</span>
                                        <span>Used: {leave.used} days</span>
                                        <span>Available: {leave.balance} days</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${leave.color} h-2 rounded-full`}
                                            style={{ width: `${(leave.used / leave.allocated) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent Payslips</h2>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                            >
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            {recentPayslips.map((payslip, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                                            <Receipt size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{payslip.month}</p>
                                            <div className="flex items-center gap-4 mt-1 text-sm">
                                                <span className="text-gray-600">Gross: {payslip.gross}</span>
                                                <span className="text-gray-600">Net: {payslip.net}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${payslip.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {payslip.status.toUpperCase()}
                                        </span>
                                        <button
                                            onClick={() => viewPayslip(payslip.month)}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                            title="View Payslip"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => downloadPayslip(payslip.month)}
                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Annual CTC Breakdown</h2>
                            <span className="text-lg font-bold text-gray-900">$58,200</span>
                        </div>
                        <div className="space-y-3 mb-4">
                            {ctcBreakdown.map((component, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{component.component}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{component.amount}</span>
                                            <span className="text-xs text-gray-500">{component.percentage}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className={`${component.color} h-1.5 rounded-full`}
                                            style={{ width: component.percentage }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-gray-600">Monthly</div>
                                    <div className="font-bold text-gray-900">$4,850</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-gray-600">Take Home</div>
                                    <div className="font-bold text-gray-900">$3,920</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">My Requests</h2>
                            <button
                                onClick={requestAdvance}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                            >
                                New Request
                            </button>
                        </div>
                        <div className="space-y-3">
                            {myRequests.map((request) => (
                                <div key={request.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{request.type}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">{request.appliedOn}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{request.details}</p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{request.date}</span>
                                        <span className="font-medium text-gray-900">
                                            {request.duration || request.amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Gift size={20} />
                                Upcoming Holidays
                            </h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {upcomingHolidays.map((holiday, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${holiday.type === 'public' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{holiday.name}</p>
                                            <p className="text-sm text-gray-500">{holiday.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-gray-900">{holiday.days} day{holiday.days > 1 ? 's' : ''}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ml-2 ${holiday.type === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {holiday.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
}

export default EmployeeDashboard