import React, { useState } from 'react';
import { 
  DollarSign, Calculator, FileCheck, PieChart,
  CreditCard, Receipt, TrendingUp, Clock,
  AlertCircle, CheckCircle, Download, Plus,
  ChevronRight, BarChart, Users, Calendar,
  Banknote, Shield, FileText, Activity
} from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import Greetings from '../common/Greetings';
import CalendarSection from '../common/CalendarSection';
import CommonButton from '../../basicComponents/CommonButton';

function PayrollManagerDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [payrollStatus, setPayrollStatus] = useState('pending'); // pending, processing, completed

    // Payroll Metrics
    const payrollMetrics = [
        { 
            title: "Monthly Payroll", 
            value: "$298,750", 
            icon: DollarSign, 
            color: "bg-green-500", 
            change: "+5.8% from last month",
            detail: "Dec 2024"
        },
        { 
            title: "Employees", 
            value: "247", 
            icon: Users, 
            color: "bg-blue-500", 
            change: "+12 this month",
            detail: "Active: 240"
        },
        { 
            title: "Pending Processing", 
            value: "32", 
            icon: Clock, 
            color: "bg-amber-500", 
            change: "To be processed",
            detail: "Claims & Advances"
        },
        { 
            title: "Tax Deductions", 
            value: "$45,280", 
            icon: Shield, 
            color: "bg-red-500", 
            change: "This month",
            detail: "TDS: $38,420"
        },
        { 
            title: "Statutory Payments", 
            value: "$18,650", 
            icon: FileCheck, 
            color: "bg-purple-500", 
            change: "Due this month",
            detail: "PF, ESI, PT"
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

    // Upcoming Payroll Deadlines
    const payrollDeadlines = [
        { task: "Salary Processing", date: "Dec 25", status: "pending", type: "processing" },
        { task: "PF Payment", date: "Dec 28", status: "due", type: "statutory" },
        { task: "ESI Payment", date: "Dec 30", status: "due", type: "statutory" },
        { task: "TDS Filing", date: "Jan 7", status: "upcoming", type: "compliance" },
        { task: "Form 16 Generation", date: "Jan 15", status: "pending", type: "compliance" },
    ];

    // Pending Claims & Advances
    const pendingClaims = [
        { type: "Medical Claim", employee: "Raj Kumar", amount: "$450", date: "Dec 18", status: "pending" },
        { type: "Travel Claim", employee: "Maria Garcia", amount: "$320", date: "Dec 19", status: "pending" },
        { type: "Advance Salary", employee: "David Lee", amount: "$1,000", date: "Dec 15", status: "approved" },
        { type: "Reimbursement", employee: "Alex Turner", amount: "$180", date: "Dec 20", status: "pending" },
    ];

    // Payroll Run Status
    const payrollRuns = [
        { month: "December 2024", status: "processing", amount: "$298,750", processed: "85%" },
        { month: "November 2024", status: "completed", amount: "$282,430", processed: "100%" },
        { month: "October 2024", status: "completed", amount: "$275,890", processed: "100%" },
    ];

    // Salary Component Breakdown
    const salaryComponents = [
        { name: "Basic Salary", value: "$150,000", percentage: "50.2%", color: "bg-blue-500" },
        { name: "HRA", value: "$60,000", percentage: "20.1%", color: "bg-green-500" },
        { name: "Allowances", value: "$45,000", percentage: "15.1%", color: "bg-amber-500" },
        { name: "Bonus & OT", value: "$28,750", percentage: "9.6%", color: "bg-purple-500" },
        { name: "Deductions", value: "$15,000", percentage: "5.0%", color: "bg-red-500" },
    ];

    // Department-wise Cost
    const departmentCosts = [
        { department: "Engineering", cost: "$120,450", employees: "85", avg: "$1,417" },
        { department: "Sales", cost: "$65,280", employees: "42", avg: "$1,554" },
        { department: "Marketing", cost: "$45,320", employees: "28", avg: "$1,619" },
        { department: "HR & Admin", cost: "$35,420", employees: "22", avg: "$1,610" },
        { department: "Operations", cost: "$32,280", employees: "25", avg: "$1,291" },
    ];

    // Quick Stats
    const payrollStats = [
        { label: "Avg. Net Salary", value: "$1,210" },
        { label: "Tax Saving", value: "$8,450" },
        { label: "Loan Recovery", value: "$4,320" },
        { label: "Advance Paid", value: "$12,500" },
        { label: "Reimbursements", value: "$6,780" },
        { label: "OT Hours", value: "248 hrs" },
    ];

    // Quick Actions for Payroll Manager
    const payrollQuickActions = [
        { label: "Run Payroll", icon: Calculator, color: "hover:bg-green-50 border-green-200" },
        { label: "Process Claims", icon: Receipt, color: "hover:bg-blue-50 border-blue-200" },
        { label: "Bank Transfer", icon: Banknote, color: "hover:bg-amber-50 border-amber-200" },
        { label: "Generate Reports", icon: BarChart, color: "hover:bg-purple-50 border-purple-200" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            {isLoading && <LoadingSpinner message="Loading payroll dashboard..." />}

            {/* Header with Greetings */}
            

                <Greetings />

            {/* Payroll Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {payrollMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-xl font-bold text-gray-900 mb-1">{metric.value}</p>
                                <p className="text-xs text-gray-600 mb-1">{metric.detail}</p>
                                <p className={`text-xs ${metric.change.includes('+') ? 'text-green-600' : 'text-gray-500'}`}>
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

            <div className="my-4">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Payroll Quick Actions</h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                payrollStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                payrollStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                Status: {payrollStatus}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {payrollQuickActions.map((action, index) => (
                            <button
                                key={index}
                                className={`bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center border ${action.color} transition-colors hover:shadow-sm`}
                            >
                                <div className={`p-2 rounded-full mb-2 ${action.color.split(' ')[1]?.replace('border-', 'bg-').replace('-200', '-100')} ${
                                    action.color.includes('green') ? 'text-green-600' : 
                                    action.color.includes('blue') ? 'text-blue-600' :
                                    action.color.includes('amber') ? 'text-amber-600' :
                                    'text-purple-600'
                                }`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Calendar & Salary Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                    <CalendarSection />

                    {/* Salary Component Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Salary Component Breakdown</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View Details
                            </button>
                        </div>
                        
                        {/* Progress Bars */}
                        <div className="space-y-4 mb-4">
                            {salaryComponents.map((component, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{component.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{component.value}</span>
                                            <span className="text-xs text-gray-500">{component.percentage}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`${component.color} h-2 rounded-full`}
                                            style={{ width: component.percentage }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Total Monthly Cost: <span className="font-bold text-gray-900">$298,750</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Per Employee: <span className="font-bold text-gray-900">$1,210</span>
                            </div>
                        </div>
                    </div>

                    {/* Pending Claims & Advances */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Pending Claims & Advances</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {pendingClaims.map((claim, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            claim.type === 'Medical Claim' ? 'bg-red-100 text-red-600' :
                                            claim.type === 'Travel Claim' ? 'bg-blue-100 text-blue-600' :
                                            claim.type === 'Advance Salary' ? 'bg-amber-100 text-amber-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {claim.type === 'Medical Claim' ? <Receipt size={18} /> :
                                             claim.type === 'Travel Claim' ? <CreditCard size={18} /> :
                                             <DollarSign size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{claim.type}</p>
                                            <p className="text-sm text-gray-500">{claim.employee} • {claim.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {claim.status}
                                        </span>
                                        <p className="text-sm font-bold text-gray-900 mt-1">{claim.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Payroll Deadlines */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Payroll Deadlines</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View Calendar
                            </button>
                        </div>
                        <div className="space-y-3">
                            {payrollDeadlines.map((deadline, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{deadline.task}</p>
                                            <p className="text-sm text-gray-500">Due: {deadline.date}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            deadline.status === 'due' ? 'bg-red-100 text-red-800' :
                                            deadline.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {deadline.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                        <div className={`w-2 h-2 rounded-full ${
                                            deadline.type === 'statutory' ? 'bg-red-500' :
                                            deadline.type === 'compliance' ? 'bg-purple-500' :
                                            'bg-blue-500'
                                        }`}></div>
                                        <span className="capitalize">{deadline.type}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payroll Run Status */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Payroll Run Status</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View History
                            </button>
                        </div>
                        <div className="space-y-3">
                            {payrollRuns.map((run, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{run.month}</p>
                                            <p className="text-sm text-gray-500">Amount: {run.amount}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            run.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            run.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {run.status}
                                        </span>
                                    </div>
                                    {run.status === 'processing' && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Processing</span>
                                                <span>{run.processed}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: run.processed }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Department-wise Cost */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Department Cost</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {departmentCosts.map((dept, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{dept.department}</p>
                                        <p className="text-sm text-gray-500">{dept.employees} employees</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">{dept.cost}</p>
                                        <p className="text-xs text-gray-500">Avg: {dept.avg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                </div>
            </div>

            {/* Bottom Section - Quick Actions */}
            

            {/* Statutory Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">PF Compliance</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Contribution This Month</span>
                            <span className="font-bold text-gray-900">$12,450</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Employees Covered</span>
                            <span className="font-bold text-gray-900">238/247</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Next Payment</span>
                            <span className="font-bold text-gray-900">Dec 28</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">TDS Status</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">This Month Deduction</span>
                            <span className="font-bold text-gray-900">$38,420</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Quarterly Filing</span>
                            <span className="font-bold text-gray-900">Due Jan 7</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Form 16 Ready</span>
                            <span className="font-bold text-green-600">85%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900">Overall Compliance</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Monthly Returns</span>
                            <span className="font-bold text-green-600">4/5 Done</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Pending Audits</span>
                            <span className="font-bold text-gray-900">2</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Compliance Score</span>
                            <span className="font-bold text-gray-900">94%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayrollManagerDashboard;