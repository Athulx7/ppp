import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Receipt, Banknote, BarChart, Shield, FileCheck, Calculator,
    Calendar, Users, DollarSign, Clock, TrendingUp, Bell, Gift,
    CalendarDays, Download, MoreVertical, ChevronLeft, ChevronRight,
    Plus, Moon, Sun, Cloud, Building, Target, CheckCircle, AlertTriangle,
    UserPlus, UserCheck, Settings, Key, Eye, Lock, Unlock, Mail,
    Phone, MapPin, Globe, Edit, Trash2, UserCog, ShieldCheck,
    Database, CreditCard, PieChart, Activity, Filter, Search,
    Users as UsersIcon, UserX, Crown
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import Greetings from '../common/Greetings';
import CalendarSection from '../common/CalendarSection';
import { ApiCall } from '../../library/constants';

function AdminDashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const fetchAdminDashboard = async () => {
            setIsLoading(true);
            try {
                const res = await ApiCall('get', '/dashboard/admin');
                if (res?.data?.success && res.data.data) {
                    setDashboardData(res.data.data);
                }
            } catch (error) {
                console.error('Failed to load admin dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminDashboard();
    }, []);

    // Dynamic Admin Metrics
    const adminMetrics = useMemo(() => {
        const m = dashboardData?.metrics || {};
        return [
            {
                title: "Total Employees",
                value: m.totalEmployees?.value ?? "0",
                icon: Users,
                color: "bg-blue-500",
                change: m.totalEmployees?.change ?? "+0 this month",
                detail: m.totalEmployees?.detail ?? "Active: 0 | Inactive: 0"
            },
            {
                title: "System Users",
                value: m.systemUsers?.value ?? "0",
                icon: UserCog,
                color: "bg-purple-500",
                change: m.systemUsers?.change ?? "Active users",
                detail: m.systemUsers?.detail ?? "Active roles configured"
            },
            {
                title: "Pending Approvals",
                value: m.pendingApprovals?.value ?? "0",
                icon: AlertTriangle,
                color: "bg-amber-500",
                change: m.pendingApprovals?.change ?? "0 urgent requests",
                detail: m.pendingApprovals?.detail ?? "HR & Payroll"
            },
            {
                title: "Total Payroll",
                value: m.totalPayroll?.value ?? "$0",
                icon: DollarSign,
                color: "bg-green-500",
                change: m.totalPayroll?.change ?? "Latest run",
                detail: m.totalPayroll?.detail ?? "Monthly payroll"
            },
            {
                title: "System Health",
                value: m.systemHealth?.value ?? "100%",
                icon: CheckCircle,
                color: "bg-emerald-500",
                change: m.systemHealth?.change ?? "Operational",
                detail: m.systemHealth?.detail ?? "Database Connected"
            },
            {
                title: "Company Settings",
                value: m.companySettings?.value ?? "Configured",
                icon: Settings,
                color: "bg-indigo-500",
                change: m.companySettings?.change ?? "Active",
                detail: m.companySettings?.detail ?? "Configurations"
            },
        ];
    }, [dashboardData]);

    // Dynamic User Access Management
    const userAccess = useMemo(() => {
        const icons = [UsersIcon, CreditCard, Building, Crown];
        const colors = [
            "bg-blue-100 text-blue-600",
            "bg-green-100 text-green-600",
            "bg-purple-100 text-purple-600",
            "bg-amber-100 text-amber-600"
        ];
        const list = dashboardData?.userAccess || [];
        if (list.length === 0) {
            return [
                { name: "HR Manager", users: 0, permissions: ["Employee Management", "Leave Approval", "Attendance"], icon: UsersIcon, color: colors[0] },
                { name: "Payroll Admin", users: 0, permissions: ["Salary Processing", "Payslip Generation", "Tax Reports"], icon: CreditCard, color: colors[1] },
                { name: "Department Heads", users: 0, permissions: ["Team Management", "Leave Approval", "Reports"], icon: Building, color: colors[2] },
                { name: "Super Admin", users: 0, permissions: ["Full System Access", "User Management", "Settings"], icon: Crown, color: colors[3] },
            ];
        }
        return list.map((item, idx) => ({
            ...item,
            icon: icons[idx % icons.length],
            color: item.color || colors[idx % colors.length]
        }));
    }, [dashboardData]);

    // Dynamic Recent Employee CTC Updates
    const recentCtcUpdates = useMemo(() => {
        return dashboardData?.recentCtcUpdates || [];
    }, [dashboardData]);

    // Dynamic Company Settings Overview
    const companySettings = useMemo(() => {
        const icons = [Building, Shield, CreditCard, Mail];
        const list = dashboardData?.companySettings || [];
        if (list.length === 0) {
            return [
                { category: "Company Info", items: 1, lastUpdated: "Configured", icon: Building, color: "bg-blue-100" },
                { category: "Departments", items: 0, lastUpdated: "Active", icon: Shield, color: "bg-green-100" },
                { category: "Designations", items: 0, lastUpdated: "Active", icon: CreditCard, color: "bg-purple-100" },
                { category: "Salary Components", items: 0, lastUpdated: "Active", icon: Mail, color: "bg-amber-100" },
            ];
        }
        return list.map((item, idx) => ({
            ...item,
            icon: icons[idx % icons.length]
        }));
    }, [dashboardData]);

    // Dynamic Salary Component Breakdown
    const salaryComponents = useMemo(() => {
        return dashboardData?.salaryComponents || [];
    }, [dashboardData]);

    // Dynamic System Activities
    const systemActivities = useMemo(() => {
        return dashboardData?.systemActivities || [];
    }, [dashboardData]);

    // Admin Quick Actions
    const adminQuickActions = [
        {
            label: "Employee Master",
            icon: Users,
            color: "hover:bg-blue-50 border-blue-200",
            description: "View and manage employees",
            path: "/admin/employee_master_entry"
        },
        {
            label: "Company Settings",
            icon: Settings,
            color: "hover:bg-green-50 border-green-200",
            description: "Configure company data",
            path: "/admin/companysettings"
        },
        {
            label: "View All CTCs",
            icon: DollarSign,
            color: "hover:bg-purple-50 border-purple-200",
            description: "Access employee compensation",
            path: "/admin/ctcreport"
        },
        {
            label: "Payslip Access",
            icon: Eye,
            color: "hover:bg-amber-50 border-amber-200",
            description: "View all employee payslips",
            path: "/admin/payslip"
        },
        {
            label: "Salary Components",
            icon: CreditCard,
            color: "hover:bg-red-50 border-red-200",
            description: "Manage salary components",
            path: "/admin/salary_components"
        },
        {
            label: "Salary Structures",
            icon: Database,
            color: "hover:bg-indigo-50 border-indigo-200",
            description: "Manage salary structures",
            path: "/admin/salary_structure"
        },
    ];

    const handleQuickAction = (action) => {
        if (action?.path) {
            navigate(action.path);
        }
    };

    const viewEmployeePayslip = () => {
        navigate('/admin/payslip');
    };

    const editUserAccess = () => {
        navigate('/admin/employee_master_entry');
    };

    const updateCompanySettings = () => {
        navigate('/admin/companysettings');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {isLoading && <LoadingSpinner message="Loading Admin Dashboard..." />}

            <Greetings />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {adminMetrics.map((metric, index) => (
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
                        <h3 className="text-lg font-bold text-gray-900">Admin Quick Actions</h3>
                        <div className="text-sm text-gray-600">
                            Full System Control Access
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {adminQuickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickAction(action)}
                                className={`bg-white rounded-lg p-4 flex flex-col items-center justify-center border ${action.color} transition-all hover:shadow-md hover:scale-[1.02]`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${action.color.split(' ')[1]?.replace('border-', 'bg-').replace('-200', '-100')} ${action.color.includes('blue') ? 'text-blue-600' :
                                        action.color.includes('green') ? 'text-green-600' :
                                            action.color.includes('purple') ? 'text-purple-600' :
                                                action.color.includes('amber') ? 'text-amber-600' :
                                                    action.color.includes('red') ? 'text-red-600' :
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
                            <h2 className="text-xl font-bold text-gray-900">User Access Management</h2>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <Plus size={16} />
                                Add New Role
                            </button>
                        </div>
                        <div className="space-y-4">
                            {userAccess.map((role, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-lg ${role.color}`}>
                                                <role.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{role.name}</h3>
                                                <p className="text-sm text-gray-600">{role.users} active users</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => editUserAccess(role.name)}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            Edit Access
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map((permission, pIndex) => (
                                            <span
                                                key={pIndex}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                                            >
                                                {permission}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recent CTC Updates</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                View All Employees <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentCtcUpdates.map((employee, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                                            {employee.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{employee.name}</p>
                                            <p className="text-sm text-gray-600">{employee.department}</p>
                                            <p className="text-xs text-gray-500 mt-1">{employee.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">{employee.newCtc}</p>
                                                <p className="text-xs text-gray-500 line-through">{employee.oldCtc}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${parseFloat(employee.change) > 10 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {employee.change}
                                            </span>
                                            <button
                                                onClick={() => viewEmployeePayslip(employee.name)}
                                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                                                title="View Payslip"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Settings size={20} />
                                Company Settings
                            </h2>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Edit All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {companySettings.map((setting, index) => (
                                <div
                                    key={index}
                                    onClick={() => updateCompanySettings(setting.category)}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${setting.color}`}>
                                                <setting.icon className="text-gray-600" size={18} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{setting.category}</p>
                                                <p className="text-sm text-gray-600">{setting.items} items</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Updated</p>
                                            <p className="text-sm font-medium text-gray-900">{setting.lastUpdated}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-3">Quick Company Info</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail size={14} />
                                    <span>contact@company.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={14} />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={14} />
                                    <span>123 Business St, City</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Globe size={14} />
                                    <span>www.company.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Company Payroll Overview</h2>
                            <span className="text-lg font-bold text-gray-900">$1.2M</span>
                        </div>
                        <div className="space-y-3 mb-4">
                            {salaryComponents.map((component, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{component.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{component.value}</span>
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
                                    <div className="text-gray-600">Monthly Payroll</div>
                                    <div className="font-bold text-gray-900">$298,750</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-gray-600">Avg. Per Employee</div>
                                    <div className="font-bold text-gray-900">$1,210</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Activity size={20} />
                                System Activities
                            </h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View Logs
                            </button>
                        </div>
                        <div className="space-y-4">
                            {systemActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        {activity.person === 'Admin' ? <Crown size={16} className="text-indigo-600" /> :
                                        activity.person === 'System' ? <Database size={16} className="text-indigo-600" /> :
                                        <UserCog size={16} className="text-indigo-600" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900">{activity.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500">by {activity.person}</span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{activity.target}</span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{activity.time}</span>
                                        </div>
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

export default AdminDashboard