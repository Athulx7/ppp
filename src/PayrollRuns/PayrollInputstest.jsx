import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Upload, Download, FileSpreadsheet,
    Calendar, User, Briefcase, DollarSign, Percent, Clock,
    CheckCircle, XCircle, AlertCircle, Info, HelpCircle,
    Loader, ChevronRight, ChevronDown, Plus, Minus, Trash2,
    Edit, Copy, Eye, Filter, Search, RefreshCw, Settings,
    Database, HardDrive, Cloud, CheckSquare, Square,
    ChevronUp, ChevronsUpDown, Clock4, MinusCircle,
    TrendingUp, Award, Target, PieChart, BarChart,
    FileText, DownloadCloud, Printer, MessageSquare,
    Users, Building, Shield, Zap, Gauge, Sliders
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonTable from '../basicComponents/commonTable';

function PayrollInputstest() {
    const navigate = useNavigate();

    // Tenant configuration - this would come from API based on customer
    const [tenantConfig, setTenantConfig] = useState({
        tenant_id: 'T001',
        tenant_name: 'Acme Corp',
        modules: {
            lop: { enabled: true, source: 'leave_module' }, // 'leave_module', 'manual', 'upload'
            overtime: { enabled: true, source: 'manual' },
            performance_bonus: { enabled: true, source: 'upload' },
            sales_commission: { enabled: true, source: 'upload' },
            attendance_bonus: { enabled: false, source: null },
            shift_allowance: { enabled: true, source: 'manual' },
            travel_allowance: { enabled: false, source: null },
            meal_voucher: { enabled: true, source: 'fixed' },
            loan_recovery: { enabled: true, source: 'loan_module' },
            advance_recovery: { enabled: true, source: 'advance_module' }
        }
    });

    // Current payroll period
    const [payrollPeriod, setPayrollPeriod] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        pay_period: 'monthly'
    });

    // Selected input type/view
    const [selectedInputType, setSelectedInputType] = useState('lop'); // 'lop', 'overtime', 'performance', 'sales', etc.

    // Data for different input types
    const [inputData, setInputData] = useState({
        lop: [],
        overtime: [],
        performance_bonus: [],
        sales_commission: [],
        shift_allowance: [],
        meal_voucher: [],
        loan_recovery: [],
        advance_recovery: []
    });

    // Upload states
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadType, setUploadType] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    // Manual entry states
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualEntryType, setManualEntryType] = useState('');
    const [manualEntryData, setManualEntryData] = useState({
        emp_code: '',
        emp_name: '',
        value: '',
        units: '',
        rate: '',
        amount: '',
        remarks: ''
    });

    // Search and filter
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    // Employee list (would come from API)
    const [employees, setEmployees] = useState([]);

    // Validation status
    const [validationStatus, setValidationStatus] = useState({
        lop: { status: 'pending', message: '' },
        overtime: { status: 'pending', message: '' },
        performance_bonus: { status: 'pending', message: '' },
        sales_commission: { status: 'pending', message: '' }
    });

    // Load employees (dummy data)
    useEffect(() => {
        const dummyEmployees = [
            { emp_code: 'EMP001', emp_name: 'John Doe', department: 'Engineering' },
            { emp_code: 'EMP002', emp_name: 'Jane Smith', department: 'Sales' },
            { emp_code: 'EMP003', emp_name: 'Mike Johnson', department: 'Marketing' },
            { emp_code: 'EMP004', emp_name: 'Sarah Williams', department: 'HR' },
            { emp_code: 'EMP005', emp_name: 'David Brown', department: 'Finance' },
            { emp_code: 'EMP006', emp_name: 'Lisa Davis', department: 'Engineering' },
            { emp_code: 'EMP007', emp_name: 'Tom Wilson', department: 'Sales' },
            { emp_code: 'EMP008', emp_name: 'Amy Taylor', department: 'Operations' }
        ];
        setEmployees(dummyEmployees);

        // Load dummy data for each input type
        loadDummyData();
    }, []);

    const loadDummyData = () => {
        // LOP data (would come from leave module)
        setInputData(prev => ({
            ...prev,
            lop: [
                { emp_code: 'EMP001', emp_name: 'John Doe', days: 2, reason: 'Sick Leave', amount: 3000 },
                { emp_code: 'EMP003', emp_name: 'Mike Johnson', days: 1, reason: 'Personal Leave', amount: 1500 },
                { emp_code: 'EMP005', emp_name: 'David Brown', days: 3, reason: 'Unpaid Leave', amount: 4500 }
            ],
            overtime: [
                { emp_code: 'EMP002', emp_name: 'Jane Smith', hours: 8, rate: 1.5, amount: 1800 },
                { emp_code: 'EMP004', emp_name: 'Sarah Williams', hours: 5, rate: 1.5, amount: 1125 },
                { emp_code: 'EMP007', emp_name: 'Tom Wilson', hours: 12, rate: 2.0, amount: 3600 }
            ],
            performance_bonus: [
                { emp_code: 'EMP001', emp_name: 'John Doe', rating: 4.5, amount: 5000 },
                { emp_code: 'EMP004', emp_name: 'Sarah Williams', rating: 4.8, amount: 7500 },
                { emp_code: 'EMP007', emp_name: 'Tom Wilson', rating: 4.2, amount: 3000 }
            ],
            sales_commission: [
                { emp_code: 'EMP002', emp_name: 'Jane Smith', sales: 50000, commission_rate: 5, amount: 2500 },
                { emp_code: 'EMP007', emp_name: 'Tom Wilson', sales: 75000, commission_rate: 5, amount: 3750 }
            ],
            shift_allowance: [
                { emp_code: 'EMP003', emp_name: 'Mike Johnson', shifts: 5, rate: 200, amount: 1000 },
                { emp_code: 'EMP008', emp_name: 'Amy Taylor', shifts: 8, rate: 200, amount: 1600 }
            ],
            loan_recovery: [
                { emp_code: 'EMP001', emp_name: 'John Doe', loan_amount: 50000, emi: 5000, balance: 25000 },
                { emp_code: 'EMP006', emp_name: 'Lisa Davis', loan_amount: 30000, emi: 3000, balance: 18000 }
            ],
            advance_recovery: [
                { emp_code: 'EMP002', emp_name: 'Jane Smith', advance_amount: 10000, recovery: 2000, balance: 8000 },
                { emp_code: 'EMP005', emp_name: 'David Brown', advance_amount: 5000, recovery: 1000, balance: 4000 }
            ]
        }));
    };

    // Get columns for current input type
    const getColumnsForType = (type) => {
        switch (type) {
            case 'lop':
                return [
                    { header: "Employee", cell: row => `${row.emp_name} (${row.emp_code})` },
                    { header: "Days", accessor: "days" },
                    { header: "Reason", accessor: "reason" },
                    { header: "Amount", cell: row => `₹${row.amount.toLocaleString()}` },
                    { header: "Source", cell: () => <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Leave Module</span> },
                    {
                        header: "Actions", cell: row => (
                            <div className="flex gap-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )
                    }
                ];
            case 'overtime':
                return [
                    { header: "Employee", cell: row => `${row.emp_name} (${row.emp_code})` },
                    { header: "Hours", accessor: "hours" },
                    { header: "Rate", cell: row => `${row.rate}x` },
                    { header: "Amount", cell: row => `₹${row.amount.toLocaleString()}` },
                    {
                        header: "Actions", cell: row => (
                            <div className="flex gap-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )
                    }
                ];
            case 'performance_bonus':
                return [
                    { header: "Employee", cell: row => `${row.emp_name} (${row.emp_code})` },
                    { header: "Rating", accessor: "rating" },
                    { header: "Amount", cell: row => `₹${row.amount.toLocaleString()}` },
                    {
                        header: "Actions", cell: row => (
                            <div className="flex gap-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )
                    }
                ];
            case 'sales_commission':
                return [
                    { header: "Employee", cell: row => `${row.emp_name} (${row.emp_code})` },
                    { header: "Sales", cell: row => `₹${row.sales.toLocaleString()}` },
                    { header: "Rate", cell: row => `${row.commission_rate}%` },
                    { header: "Amount", cell: row => `₹${row.amount.toLocaleString()}` },
                    {
                        header: "Actions", cell: row => (
                            <div className="flex gap-1">
                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        )
                    }
                ];
            default:
                return [];
        }
    };

    // Handle file upload
    const handleFileUpload = () => {
        if (!uploadFile) {
            alert('Please select a file');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setShowUploadModal(false);
                    setUploadFile(null);

                    // Show success message
                    alert(`${uploadType} data uploaded successfully`);

                    // Validate after upload
                    validateInputData(uploadType);

                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    // Validate input data
    const validateInputData = (type) => {
        setValidationStatus(prev => ({
            ...prev,
            [type]: { status: 'validating', message: 'Validating...' }
        }));

        // Simulate validation
        setTimeout(() => {
            setValidationStatus(prev => ({
                ...prev,
                [type]: {
                    status: 'valid',
                    message: `All ${type} data validated successfully`
                }
            }));
        }, 2000);
    };

    // Validate all inputs before payroll run
    const validateAllInputs = () => {
        const enabledModules = Object.entries(tenantConfig.modules)
            .filter(([_, config]) => config.enabled)
            .map(([key]) => key);

        enabledModules.forEach(module => {
            validateInputData(module);
        });

        alert('Validation started for all enabled modules');
    };

    // Get summary stats for current period
    const getSummaryStats = () => {
        return {
            totalLop: inputData.lop.reduce((sum, item) => sum + item.amount, 0),
            totalOvertime: inputData.overtime.reduce((sum, item) => sum + item.amount, 0),
            totalBonus: inputData.performance_bonus.reduce((sum, item) => sum + item.amount, 0),
            totalCommission: inputData.sales_commission.reduce((sum, item) => sum + item.amount, 0),
            totalAllowances: inputData.shift_allowance.reduce((sum, item) => sum + item.amount, 0),
            totalLoanRecovery: inputData.loan_recovery.reduce((sum, item) => sum + item.emi, 0),
            totalAdvanceRecovery: inputData.advance_recovery.reduce((sum, item) => sum + item.recovery, 0)
        };
    };

    const stats = getSummaryStats();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Payroll', to: '/payroll' },
                    { label: 'Payroll Inputs' }
                ]}
                title="Payroll Inputs"
                description="Manage all variable payroll data before processing"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={validateAllInputs}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Validate All
                        </button>
                        <button
                            onClick={() => navigate('/payroll/run')}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                        >
                            <Zap className="w-4 h-4" />
                            Go to Payroll Run
                        </button>
                    </div>
                }
            />

            {/* Period Selection */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Payroll Period:</span>
                    </div>
                    <CommonDropDown
                        label=""
                        value={payrollPeriod.month}
                        onChange={(val) => setPayrollPeriod({ ...payrollPeriod, month: parseInt(val) })}
                        options={monthNames.map((m, i) => ({ label: m, value: i }))}
                        placeholder="Month"
                        className="w-32"
                    />
                    <CommonInputField
                        type="number"
                        value={payrollPeriod.year}
                        onChange={(e) => setPayrollPeriod({ ...payrollPeriod, year: parseInt(e.target.value) })}
                        className="w-24"
                        placeholder="Year"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-medium text-indigo-600">{employees.length}</span> employees active
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">LOP Deductions</p>
                    <p className="text-lg font-bold text-red-600">₹{stats.totalLop.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Overtime</p>
                    <p className="text-lg font-bold text-green-600">₹{stats.totalOvertime.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Performance</p>
                    <p className="text-lg font-bold text-purple-600">₹{stats.totalBonus.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="text-lg font-bold text-blue-600">₹{stats.totalCommission.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Allowances</p>
                    <p className="text-lg font-bold text-orange-600">₹{stats.totalAllowances.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Loan Recovery</p>
                    <p className="text-lg font-bold text-red-600">₹{stats.totalLoanRecovery.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <p className="text-xs text-gray-500">Advance</p>
                    <p className="text-lg font-bold text-red-600">₹{stats.totalAdvanceRecovery.toLocaleString()}</p>
                </div>
            </div>

            {/* Module Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-4">
                <div className="flex flex-wrap p-2 gap-1 border-b overflow-x-auto">
                    {Object.entries(tenantConfig.modules).map(([key, config]) =>
                        config.enabled && (
                            <button
                                key={key}
                                onClick={() => setSelectedInputType(key)}
                                className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedInputType === key
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                {validationStatus[key]?.status === 'valid' && (
                                    <CheckCircle className="w-3 h-3 inline ml-1" />
                                )}
                                {validationStatus[key]?.status === 'validating' && (
                                    <Loader className="w-3 h-3 inline ml-1 animate-spin" />
                                )}
                            </button>
                        )
                    )}
                </div>

                {/* Module Actions Bar */}
                <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <CommonDropDown
                            label=""
                            value={departmentFilter}
                            onChange={setDepartmentFilter}
                            options={[
                                { value: '', label: 'All Departments' },
                                { value: 'Engineering', label: 'Engineering' },
                                { value: 'Sales', label: 'Sales' },
                                { value: 'Marketing', label: 'Marketing' }
                            ]}
                            placeholder="Department"
                            className="w-40"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setUploadType(selectedInputType);
                                setShowUploadModal(true);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Excel
                        </button>
                        <button
                            onClick={() => {
                                setManualEntryType(selectedInputType);
                                setShowManualModal(true);
                            }}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Manual
                        </button>
                        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                            <Download className="w-4 h-4" />
                            Download Template
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <div className="min-w-[800px] p-3">
                        <CommonTable
                            columns={getColumnsForType(selectedInputType)}
                            data={inputData[selectedInputType] || []}
                            itemsPerPage={10}
                            showSearch={false}
                            showPagination={true}
                        />
                    </div>
                </div>

                {/* Source Information */}
                <div className="p-3 bg-gray-50 border-t flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <Info className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">
                            Data source: <span className="font-medium text-indigo-600">
                                {tenantConfig.modules[selectedInputType]?.source === 'leave_module' ? 'Leave Management Module' :
                                    tenantConfig.modules[selectedInputType]?.source === 'loan_module' ? 'Loan Management Module' :
                                        tenantConfig.modules[selectedInputType]?.source === 'advance_module' ? 'Salary Advance Module' :
                                            tenantConfig.modules[selectedInputType]?.source === 'fixed' ? 'Fixed Configuration' :
                                                tenantConfig.modules[selectedInputType]?.source === 'upload' ? 'Excel Upload' :
                                                    'Manual Entry'}
                            </span>
                        </span>
                    </div>
                    {validationStatus[selectedInputType] && (
                        <div className={`flex items-center gap-1 ${validationStatus[selectedInputType].status === 'valid' ? 'text-green-600' :
                                validationStatus[selectedInputType].status === 'validating' ? 'text-yellow-600' :
                                    'text-gray-500'
                            }`}>
                            {validationStatus[selectedInputType].status === 'valid' && <CheckCircle className="w-3 h-3" />}
                            {validationStatus[selectedInputType].status === 'validating' && <Loader className="w-3 h-3 animate-spin" />}
                            <span>{validationStatus[selectedInputType].message}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Integration Status */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Integration Status
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Leave Module</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">LOP data synced • 3 employees</p>
                    </div>
                    <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Loan Module</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">2 active loans • ₹50,000 total</p>
                    </div>
                    <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Advance Module</span>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">2 advances • ₹12,000 recovery</p>
                    </div>
                    <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Attendance</span>
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <p className="text-xs text-gray-500">Pending for 5 employees</p>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Upload {uploadType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Data
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadFile(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-1">Drag & drop or click to browse</p>
                                    <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        className="hidden"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                    />
                                </div>
                                {uploadFile && (
                                    <p className="text-xs text-gray-600 mt-2">Selected: {uploadFile.name}</p>
                                )}
                            </div>

                            {isUploading && (
                                <div className="mb-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 rounded-full h-2 transition-all"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{uploadProgress}% uploaded</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowUploadModal(false);
                                        setUploadFile(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!uploadFile || isUploading}
                                    className={`px-4 py-2 text-white rounded-lg text-sm ${!uploadFile || isUploading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Entry Modal */}
            {showManualModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Add {manualEntryType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Manual Entry
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowManualModal(false);
                                        setManualEntryData({
                                            emp_code: '',
                                            emp_name: '',
                                            value: '',
                                            units: '',
                                            rate: '',
                                            amount: '',
                                            remarks: ''
                                        });
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Employee Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Employee *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        value={manualEntryData.emp_code}
                                        onChange={(e) => {
                                            const emp = employees.find(emp => emp.emp_code === e.target.value);
                                            setManualEntryData({
                                                ...manualEntryData,
                                                emp_code: e.target.value,
                                                emp_name: emp?.emp_name || ''
                                            });
                                        }}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.emp_code} value={emp.emp_code}>
                                                {emp.emp_name} ({emp.emp_code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dynamic Fields based on input type */}
                                {manualEntryType === 'lop' && (
                                    <>
                                        <CommonInputField
                                            label="Days *"
                                            type="number"
                                            value={manualEntryData.value}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, value: e.target.value })}
                                            placeholder="Enter days"
                                        />
                                        <CommonInputField
                                            label="Reason"
                                            type="text"
                                            value={manualEntryData.remarks}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, remarks: e.target.value })}
                                            placeholder="Enter reason"
                                        />
                                    </>
                                )}

                                {manualEntryType === 'overtime' && (
                                    <>
                                        <CommonInputField
                                            label="Hours *"
                                            type="number"
                                            value={manualEntryData.value}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, value: e.target.value })}
                                            placeholder="Enter hours"
                                        />
                                        <CommonInputField
                                            label="Rate Multiplier *"
                                            type="number"
                                            step="0.1"
                                            value={manualEntryData.rate}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, rate: e.target.value })}
                                            placeholder="e.g., 1.5"
                                        />
                                    </>
                                )}

                                {manualEntryType === 'performance_bonus' && (
                                    <>
                                        <CommonInputField
                                            label="Rating"
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={manualEntryData.value}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, value: e.target.value })}
                                            placeholder="Rating out of 5"
                                        />
                                        <CommonInputField
                                            label="Amount *"
                                            type="number"
                                            value={manualEntryData.amount}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, amount: e.target.value })}
                                            placeholder="Enter amount"
                                        />
                                    </>
                                )}

                                {manualEntryType === 'sales_commission' && (
                                    <>
                                        <CommonInputField
                                            label="Sales Amount *"
                                            type="number"
                                            value={manualEntryData.value}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, value: e.target.value })}
                                            placeholder="Enter sales amount"
                                        />
                                        <CommonInputField
                                            label="Commission Rate % *"
                                            type="number"
                                            step="0.1"
                                            value={manualEntryData.rate}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, rate: e.target.value })}
                                            placeholder="Enter percentage"
                                        />
                                    </>
                                )}

                                {manualEntryType === 'shift_allowance' && (
                                    <>
                                        <CommonInputField
                                            label="Number of Shifts *"
                                            type="number"
                                            value={manualEntryData.units}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, units: e.target.value })}
                                            placeholder="Enter shift count"
                                        />
                                        <CommonInputField
                                            label="Rate per Shift *"
                                            type="number"
                                            value={manualEntryData.rate}
                                            onChange={(e) => setManualEntryData({ ...manualEntryData, rate: e.target.value })}
                                            placeholder="Enter rate"
                                        />
                                    </>
                                )}

                                {/* Amount Field (calculated or manual) */}
                                <CommonInputField
                                    label="Amount"
                                    type="number"
                                    value={manualEntryData.amount}
                                    onChange={(e) => setManualEntryData({ ...manualEntryData, amount: e.target.value })}
                                    placeholder="Amount will be calculated"
                                    disabled={manualEntryType === 'overtime' || manualEntryType === 'shift_allowance'}
                                />

                                {/* Remarks */}
                                <CommonInputField
                                    label="Remarks"
                                    type="text"
                                    value={manualEntryData.remarks}
                                    onChange={(e) => setManualEntryData({ ...manualEntryData, remarks: e.target.value })}
                                    placeholder="Add any remarks"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowManualModal(false);
                                        setManualEntryData({
                                            emp_code: '',
                                            emp_name: '',
                                            value: '',
                                            units: '',
                                            rate: '',
                                            amount: '',
                                            remarks: ''
                                        });
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Add logic to save manual entry
                                        alert('Manual entry added successfully');
                                        setShowManualModal(false);

                                        // Trigger validation
                                        validateInputData(manualEntryType);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                >
                                    Save Entry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Summary Modal */}
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3 max-w-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Gauge className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">Validation Summary</span>
                </div>
                <div className="space-y-1 text-xs">
                    {Object.entries(validationStatus).map(([key, status]) => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="text-gray-600">{key.split('_').join(' ')}</span>
                            <span className={`flex items-center gap-1 ${status.status === 'valid' ? 'text-green-600' :
                                    status.status === 'validating' ? 'text-yellow-600' :
                                        'text-gray-400'
                                }`}>
                                {status.status === 'valid' && <CheckCircle className="w-3 h-3" />}
                                {status.status === 'validating' && <Loader className="w-3 h-3 animate-spin" />}
                                {status.status === 'pending' && <Clock className="w-3 h-3" />}
                                {status.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="fixed left-4 bottom-4 bg-white rounded-lg shadow-lg border p-2">
                <div className="flex flex-col gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Refresh Data">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Export Summary">
                        <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Settings">
                        <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Help">
                        <HelpCircle className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Bulk Edit Mode */}
            {/* <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Bulk Edit - {selectedInputType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </h3>
                            <button className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <CommonDropDown
                                label="Action"
                                value=""
                                onChange={() => {}}
                                options={[
                                    { value: 'update', label: 'Update Values' },
                                    { value: 'delete', label: 'Delete Selected' },
                                    { value: 'validate', label: 'Validate Selected' }
                                ]}
                                placeholder="Select action"
                            />
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            <CommonTable
                                columns={[
                                    { header: "", cell: () => (
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    )},
                                    { header: "Employee", cell: row => `${row.emp_name} (${row.emp_code})` },
                                    { header: "Current Value", accessor: "amount" },
                                    { header: "New Value", cell: () => (
                                        <input type="number" className="w-24 px-2 py-1 border rounded" placeholder="New value" />
                                    )}
                                ]}
                                data={inputData[selectedInputType] || []}
                                showPagination={false}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default PayrollInputstest;