import React, { useState } from 'react';
import {
    DollarSign, Calculator, FileCheck, PieChart,
    CreditCard, Receipt, TrendingUp, Clock,
    AlertCircle, CheckCircle, Download, Plus,
    ChevronRight, BarChart, Users, Calendar,
    Banknote, Shield, FileText, Activity,
    Upload, FileSpreadsheet, Percent, TrendingDown,
    Eye, Send, RefreshCw, Filter, Search,
    DollarSign as DollarIcon, UserCheck, CalendarDays,
    Package, Layers, Divide, BarChart3,
    FileUp, FileDown, ClipboardCheck, Target
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import Greetings from '../common/Greetings';
import CalendarSection from '../common/CalendarSection';

function PayrollManagerDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('December 2024');
    const [uploadProgress, setUploadProgress] = useState({});

    // Payroll Metrics - Enhanced
    const payrollMetrics = [
        {
            title: "This Month Payroll",
            value: "$298,750",
            icon: DollarSign,
            color: "bg-green-500",
            change: "+5.8% from last month",
            detail: "For 247 employees"
        },
        {
            title: "Pending Processing",
            value: "32",
            icon: Clock,
            color: "bg-amber-500",
            change: "Claims & Advances",
            detail: "Requires attention"
        },
        {
            title: "LOP Days",
            value: "124",
            icon: TrendingDown,
            color: "bg-red-500",
            change: "-8.5% from last month",
            detail: "Across all employees"
        },
        {
            title: "Tax Deductions",
            value: "$45,280",
            icon: Shield,
            color: "bg-purple-500",
            change: "This month's TDS",
            detail: "Net tax payable: $38,420"
        },
        {
            title: "Overtime Hours",
            value: "248 hrs",
            icon: Clock,
            color: "bg-blue-500",
            change: "+42 hrs this month",
            detail: "Cost: $8,920"
        },
        {
            title: "Cost Per Employee",
            value: "$1,210",
            icon: Calculator,
            color: "bg-indigo-500",
            change: "+2.3% from last month",
            detail: "Monthly average"
        },
    ];

    // Data Upload Options
    const dataUploadOptions = [
        {
            title: "LOP (Loss of Pay)",
            icon: TrendingDown,
            color: "bg-red-100 text-red-600",
            description: "Upload LOP days for employees",
            format: "CSV/Excel",
            status: "pending",
            records: 18
        },
        {
            title: "Sales Commission",
            icon: DollarIcon,
            color: "bg-green-100 text-green-600",
            description: "Upload sales performance data",
            format: "CSV/Excel",
            status: "completed",
            records: 45
        },
        {
            title: "Performance Bonus",
            icon: Target,
            color: "bg-amber-100 text-amber-600",
            description: "Upload performance ratings",
            format: "CSV/Excel",
            status: "pending",
            records: 32
        },
        {
            title: "Attendance Data",
            icon: CalendarDays,
            color: "bg-blue-100 text-blue-600",
            description: "Upload attendance records",
            format: "CSV/Excel",
            status: "uploaded",
            records: 247
        },
        {
            title: "Reimbursements",
            icon: Receipt,
            color: "bg-purple-100 text-purple-600",
            description: "Upload expense claims",
            format: "CSV/Excel",
            status: "pending",
            records: 28
        },
        {
            title: "Loan Deductions",
            icon: Banknote,
            color: "bg-indigo-100 text-indigo-600",
            description: "Upload loan recovery data",
            format: "CSV/Excel",
            status: "completed",
            records: 15
        },
    ];

    // Payroll Run Status
    const payrollRuns = [
        {
            month: "December 2024",
            status: "processing",
            amount: "$298,750",
            processed: "85%",
            employees: "210/247",
            processedDate: "Dec 23, 2024",
            canRun: false
        },
        {
            month: "January 2025",
            status: "pending",
            amount: "$302,450",
            processed: "0%",
            employees: "0/247",
            processedDate: "Not started",
            canRun: true
        },
        {
            month: "November 2024",
            status: "completed",
            amount: "$282,430",
            processed: "100%",
            employees: "247/247",
            processedDate: "Nov 25, 2024",
            canRun: false
        },
    ];

    // Pending Leave Requests affecting payroll
    const payrollLeaves = [
        {
            name: "John Smith",
            department: "Sales",
            leaveType: "LOP",
            days: "3",
            date: "Dec 15-17",
            impact: "$450",
            status: "approved"
        },
        {
            name: "Maria Garcia",
            department: "Engineering",
            leaveType: "Half-day LOP",
            days: "0.5",
            date: "Dec 20",
            impact: "$75",
            status: "pending"
        },
        {
            name: "Raj Kumar",
            department: "Marketing",
            leaveType: "LOP",
            days: "2",
            date: "Dec 22-23",
            impact: "$300",
            status: "approved"
        },
        {
            name: "Lisa Wang",
            department: "HR",
            leaveType: "LOP",
            days: "1",
            date: "Dec 18",
            impact: "$150",
            status: "approved"
        },
    ];

    // Salary Advances
    const salaryAdvances = [
        {
            name: "David Lee",
            department: "Operations",
            amount: "$500",
            date: "Dec 15",
            repayment: "$100/month",
            status: "approved",
            remaining: "$400"
        },
        {
            name: "Alex Turner",
            department: "Engineering",
            amount: "$1,000",
            date: "Dec 10",
            repayment: "$200/month",
            status: "pending",
            remaining: "$1,000"
        },
        {
            name: "Sarah Johnson",
            department: "Sales",
            amount: "$750",
            date: "Dec 5",
            repayment: "$150/month",
            status: "approved",
            remaining: "$600"
        },
    ];

    // Performance Data Overview
    const performanceData = [
        { metric: "Sales Target Achievement", value: "87%", change: "+5%", color: "bg-green-500" },
        { metric: "Productivity Score", value: "4.2/5", change: "+0.3", color: "bg-blue-500" },
        { metric: "Quality Rating", value: "92%", change: "+2%", color: "bg-purple-500" },
        { metric: "Attendance Score", value: "96%", change: "-1%", color: "bg-amber-500" },
    ];

    // Salary Component Breakdown
    const salaryComponents = [
        { name: "Basic Salary", value: "$150,000", percentage: "50.2%", color: "bg-blue-500" },
        { name: "HRA", value: "$60,000", percentage: "20.1%", color: "bg-green-500" },
        { name: "Allowances", value: "$45,000", percentage: "15.1%", color: "bg-amber-500" },
        { name: "Performance Bonus", value: "$28,750", percentage: "9.6%", color: "bg-purple-500" },
        { name: "Statutory Deductions", value: "$15,000", percentage: "5.0%", color: "bg-red-500" },
    ];

    const payrollQuickActions = [
        {
            label: "Run Payroll",
            icon: Calculator,
            color: "hover:bg-green-50 border-green-200",
            description: "Process monthly payroll"
        },
        {
            label: "Upload Data",
            icon: Upload,
            color: "hover:bg-blue-50 border-blue-200",
            description: "Upload LOP, sales, etc."
        },
        {
            label: "View Payslips",
            icon: Eye,
            color: "hover:bg-purple-50 border-purple-200",
            description: "Access all payslips"
        },
        {
            label: "Process Advances",
            icon: DollarSign,
            color: "hover:bg-amber-50 border-amber-200",
            description: "Handle salary advances"
        },
        {
            label: "Reports",
            icon: BarChart,
            color: "hover:bg-indigo-50 border-indigo-200",
            description: "Generate payroll reports"
        },
        {
            label: "Compliance",
            icon: Shield,
            color: "hover:bg-red-50 border-red-200",
            description: "Tax & statutory filings"
        },
    ];

    const handleDataUpload = (uploadType) => {
        console.log(`Uploading ${uploadType} data`);
        // Simulate upload progress
        setUploadProgress(prev => ({
            ...prev,
            [uploadType]: 0
        }));

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                const newProgress = (prev[uploadType] || 0) + 10;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    return { ...prev, [uploadType]: 100 };
                }
                return { ...prev, [uploadType]: newProgress };
            });
        }, 200);
    };

    const handleRunPayroll = (month) => {
        console.log(`Running payroll for ${month}`);
    };

    const processAdvance = (employeeName) => {
        console.log(`Processing advance for ${employeeName}`);
    };

    const downloadTemplate = (uploadType) => {
        console.log(`Downloading template for ${uploadType}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {isLoading && <LoadingSpinner message="Loading payroll dashboard..." />}

            <Greetings />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {payrollMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                                <p className="text-xs text-gray-600 mb-1">{metric.detail}</p>
                                <p className={`text-xs ${metric.change.includes('+') ? 'text-green-600' : metric.change.includes('-') ? 'text-red-600' : 'text-amber-600'}`}>
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
                        <h3 className="text-lg font-bold text-gray-900"> Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {payrollQuickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => console.log(`Clicked ${action.label}`)}
                                className={`bg-white rounded-lg p-4 flex flex-col items-center justify-center border ${action.color} transition-all hover:shadow-md `}
                            >
                                <div className={`p-3 rounded-full mb-3 ${action.color.split(' ')[1]?.replace('border-', 'bg-').replace('-200', '-100')} ${action.color.includes('green') ? 'text-green-600' :
                                        action.color.includes('blue') ? 'text-blue-600' :
                                            action.color.includes('purple') ? 'text-purple-600' :
                                                action.color.includes('amber') ? 'text-amber-600' :
                                                    action.color.includes('indigo') ? 'text-indigo-600' :
                                                        'text-red-600'
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

            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Monthly Data Upload</h3>
                            <p className="text-sm text-gray-600">Upload LOP, sales, performance data for payroll processing</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Download size={16} />
                            Download All Templates
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dataUploadOptions.map((upload, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${upload.color}`}>
                                            <upload.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{upload.title}</h4>
                                            <span className="text-xs text-gray-500">{upload.records} records</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${upload.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            upload.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {upload.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{upload.description}</p>

                                {/* Upload Progress */}
                                {uploadProgress[upload.title] > 0 && uploadProgress[upload.title] < 100 && (
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress[upload.title]}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress[upload.title]}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDataUpload(upload.title)}
                                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} />
                                        Upload {upload.format}
                                    </button>
                                    <button
                                        onClick={() => downloadTemplate(upload.title)}
                                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                        title="Download Template"
                                    >
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Payroll Run Status</h2>
                            <button
                                onClick={() => handleRunPayroll('January 2025')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Calculator size={16} />
                                Run Next Payroll
                            </button>
                        </div>
                        <div className="space-y-4">
                            {payrollRuns.map((run, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${run.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    run.status === 'processing' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                <Calculator size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{run.month}</h3>
                                                <p className="text-sm text-gray-600">Processed: {run.processedDate}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${run.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    run.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                                            </span>
                                            <p className="text-lg font-bold text-gray-900 mt-1">{run.amount}</p>
                                        </div>
                                    </div>

                                    {run.status === 'processing' || run.status === 'pending' ? (
                                        <>
                                            <div className="mb-2">
                                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                    <span>Employees Processed</span>
                                                    <span>{run.employees} ({run.processed})</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`${run.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'} h-2 rounded-full`}
                                                        style={{ width: run.processed }}
                                                    ></div>
                                                </div>
                                            </div>
                                            {run.canRun && (
                                                <button
                                                    onClick={() => handleRunPayroll(run.month)}
                                                    className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Calculator size={16} />
                                                    Start Payroll Run for {run.month}
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Processed {run.employees} employees</span>
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                                                    <Download size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Leaves Affecting Payroll</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {payrollLeaves.map((leave, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center font-bold text-red-600">
                                            {leave.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{leave.name}</p>
                                            <p className="text-sm text-gray-600">{leave.department} • {leave.leaveType}</p>
                                            <p className="text-xs text-gray-500 mt-1">{leave.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-red-600">{leave.days} day{leave.days !== '0.5' ? 's' : ''}</p>
                                                <p className="text-sm text-gray-600">Impact: {leave.impact}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {leave.status}
                                            </span>
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
                            <h2 className="text-xl font-bold text-gray-900">Performance Data</h2>
                            <span className="text-sm text-gray-600">For Bonus Calculation</span>
                        </div>
                        <div className="space-y-4">
                            {performanceData.map((metric, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-900">{metric.metric}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                                            <span className={`text-xs ${metric.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {metric.change}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className={`${metric.color} h-1.5 rounded-full`}
                                            style={{ width: metric.value.replace('%', '').split('/')[0] }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Salary Advances */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Salary Advances</h2>
                            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                New Advance
                            </button>
                        </div>
                        <div className="space-y-3">
                            {salaryAdvances.map((advance, index) => (
                                <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{advance.name}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${advance.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {advance.status}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">{advance.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">{advance.department}</p>
                                            <p className="text-xs text-gray-500">Repayment: {advance.repayment}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">{advance.amount}</p>
                                            <p className="text-xs text-red-600">Remaining: {advance.remaining}</p>
                                        </div>
                                    </div>
                                    {advance.status === 'pending' && (
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => processAdvance(advance.name)}
                                                className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button className="flex-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Salary Breakdown</h2>
                            <span className="text-lg font-bold text-gray-900">$298,750</span>
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
                                    <div className="text-gray-600">Avg. Net Salary</div>
                                    <div className="font-bold text-gray-900">$1,210</div>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <div className="text-gray-600">Total Deductions</div>
                                    <div className="font-bold text-gray-900">$45,280</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayrollManagerDashboard;