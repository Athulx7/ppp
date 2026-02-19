import React, { useState, useEffect } from 'react';
import {
    Download, Eye, Filter, Search, Calendar, ChevronDown,
    User, Users, Briefcase, Building, DollarSign, TrendingUp,
    DownloadCloud, Printer, Mail, FileText, Shield, Lock, X,
    Grid, List, ChevronLeft, ChevronRight, Award, Clock,
    CheckCircle, AlertCircle, CreditCard, Home, Heart
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';
import CommonDatePicker from '../basicComponents/CommonDatePicker';

function PayslipsTest() {
    const [currentUser, setCurrentUser] = useState({
        user_id: 'EMP001',
        name: 'John Doe',
        role: 'hr', // 'admin', 'hr', 'payroll_manager', 'employee', 'manager'
        designation: 'HR Manager',
        department: 'Human Resources',
        isManager: true,
        managedEmployees: ['EMP002', 'EMP003', 'EMP004', 'EMP005']
    });

    const [viewMode, setViewMode] = useState('own'); // 'own', 'team', 'all'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayFormat, setDisplayFormat] = useState('table'); // 'table', 'card'
    const [payslipData, setPayslipData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [summary, setSummary] = useState({
        totalEmployees: 0,
        totalGrossPay: 0,
        totalNetPay: 0,
        totalDeductions: 0,
        totalPF: 0,
        totalTax: 0
    });

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
    }));

    const employees = [
        { emp_code: 'EMP001', emp_name: 'John Doe', designation: 'HR Manager', department: 'HR', grade: 'M3', doj: '2020-01-15', bank_account: '1234567890', bank_name: 'HDFC Bank', ifsc: 'HDFC0001234', pan: 'ABCDE1234F' },
        { emp_code: 'EMP002', emp_name: 'Athul Krishna', designation: 'Junior Software Engineer', department: 'Engineering', grade: 'S3', doj: '2023-06-15', bank_account: '2345678901', bank_name: 'ICICI Bank', ifsc: 'ICIC0001234', pan: 'FGHIJ5678K' },
        { emp_code: 'EMP003', emp_name: 'Michael Chen', designation: 'Tech Lead', department: 'Engineering', grade: 'M2', doj: '2019-06-01', bank_account: '3456789012', bank_name: 'SBI', ifsc: 'SBIN0001234', pan: 'KLMNO9012P' },
        { emp_code: 'EMP004', emp_name: 'Sarah Johnson', designation: 'Sales Manager', department: 'Sales', grade: 'M2', doj: '2020-11-20', bank_account: '4567890123', bank_name: 'Axis Bank', ifsc: 'AXIS0001234', pan: 'QRSTU3456V' },
        { emp_code: 'EMP005', emp_name: 'David Kumar', designation: 'Accountant', department: 'Finance', grade: 'S4', doj: '2022-02-15', bank_account: '5678901234', bank_name: 'HDFC Bank', ifsc: 'HDFC0005678', pan: 'VWXYZ7890A' }
    ];

    useEffect(() => {
        const generatePayslips = () => {
            const dummyPayslips = [];

            for (let i = 0; i < 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const monthName = months.find(m => m.value === month)?.label;

                employees.forEach(emp => {
                    const baseSalary =
                        emp.grade === 'M3' ? 85000 :
                            emp.grade === 'M2' ? 95000 :
                                emp.grade === 'S5' ? 75000 :
                                    emp.grade === 'S4' ? 60000 :
                                        emp.grade === 'S3' ? 45000 : 30000;

                    const hra = baseSalary * 0.5;
                    const specialAllowance = baseSalary * 0.2;
                    const conveyance = 3200;
                    const medical = 1250;
                    const lta = baseSalary * 0.05;

                    const earnings = {
                        basic: baseSalary,
                        hra: hra,
                        special_allowance: specialAllowance,
                        conveyance: conveyance,
                        medical: medical,
                        lta: lta,
                        overtime: i === 0 ? Math.floor(Math.random() * 5000) : 0,
                        bonus: i === 0 ? Math.floor(Math.random() * 10000) : 0,
                        total_earnings: 0
                    };

                    earnings.total_earnings = earnings.basic + earnings.hra + earnings.special_allowance +
                        earnings.conveyance + earnings.medical + earnings.lta +
                        earnings.overtime + earnings.bonus;

                    const pfEmployee = baseSalary * 0.12;
                    const pfEmployer = baseSalary * 0.12;
                    const professionalTax = baseSalary > 25000 ? 200 : 0;
                    const incomeTax = baseSalary > 75000 ? 5000 : baseSalary > 50000 ? 2000 : 0;
                    const gratuity = baseSalary * 0.048;
                    const insurance = 5000;

                    const deductions = {
                        pf_employee: pfEmployee,
                        professional_tax: professionalTax,
                        income_tax: incomeTax,
                        loan_recovery: i === 0 ? Math.floor(Math.random() * 2000) : 0,
                        advance: 0,
                        total_deductions: 0
                    };

                    deductions.total_deductions = deductions.pf_employee + deductions.professional_tax +
                        deductions.income_tax + deductions.loan_recovery + deductions.advance;

                    const netPay = earnings.total_earnings - deductions.total_deductions;

                    const employerContributions = {
                        pf_employer: pfEmployer,
                        gratuity: gratuity,
                        insurance: insurance,
                        total: pfEmployer + gratuity + insurance
                    };

                    dummyPayslips.push({
                        id: `${emp.emp_code}_${year}_${month}`,
                        emp_code: emp.emp_code,
                        emp_name: emp.emp_name,
                        designation: emp.designation,
                        department: emp.department,
                        grade: emp.grade,
                        month: month,
                        month_name: monthName,
                        year: year,
                        generated_date: `${year}-${month}-10`,
                        bank_account: emp.bank_account,
                        bank_name: emp.bank_name,
                        ifsc: emp.ifsc,
                        pan: emp.pan,
                        earnings: earnings,
                        deductions: deductions,
                        employer_contributions: employerContributions,
                        net_pay: netPay,
                        status: i === 0 ? 'generated' : 'processed',
                        payment_date: i === 0 ? null : `${year}-${month}-25`
                    });
                });
            }

            return dummyPayslips;
        };

        setPayslipData(generatePayslips());
    }, []);

    useEffect(() => {
        let data = [...payslipData];

        if (currentUser.role === 'employee') {
            data = data.filter(p => p.emp_code === currentUser.user_id);
        } else if (currentUser.role === 'manager' || (currentUser.isManager && currentUser.role !== 'admin' && currentUser.role !== 'hr')) {
            if (viewMode === 'own') {
                data = data.filter(p => p.emp_code === currentUser.user_id);
            } else if (viewMode === 'team') {
                data = data.filter(p =>
                    p.emp_code === currentUser.user_id ||
                    currentUser.managedEmployees.includes(p.emp_code)
                );
            }
        } else if (currentUser.role === 'hr' || currentUser.role === 'admin' || currentUser.role === 'payroll_manager') {
            if (viewMode === 'own') {
                data = data.filter(p => p.emp_code === currentUser.user_id);
            }
        }

        if (selectedEmployee) {
            data = data.filter(p => p.emp_code === selectedEmployee);
        }

        if (selectedDepartment) {
            data = data.filter(p => p.department === selectedDepartment);
        }

        if (selectedDesignation) {
            data = data.filter(p => p.designation === selectedDesignation);
        }

        if (selectedMonth) {
            data = data.filter(p => p.month === selectedMonth);
        }

        if (selectedYear) {
            data = data.filter(p => p.year.toString() === selectedYear);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(p =>
                p.emp_name.toLowerCase().includes(query) ||
                p.emp_code.toLowerCase().includes(query) ||
                p.designation.toLowerCase().includes(query) ||
                `${p.month_name} ${p.year}`.toLowerCase().includes(query)
            );
        }

        setFilteredData(data);

        const totalGrossPay = data.reduce((sum, p) => sum + p.earnings.total_earnings, 0);
        const totalNetPay = data.reduce((sum, p) => sum + p.net_pay, 0);
        const totalDeductions = data.reduce((sum, p) => sum + p.deductions.total_deductions, 0);
        const totalPF = data.reduce((sum, p) => sum + p.deductions.pf_employee, 0);
        const totalTax = data.reduce((sum, p) => sum + p.deductions.income_tax, 0);

        setSummary({
            totalEmployees: [...new Set(data.map(p => p.emp_code))].length,
            totalGrossPay,
            totalNetPay,
            totalDeductions,
            totalPF,
            totalTax
        });
    }, [payslipData, currentUser, viewMode, selectedEmployee, selectedDepartment, selectedDesignation, selectedMonth, selectedYear, searchQuery]);

    const departments = [...new Set(payslipData.map(p => p.department))];
    const designations = [...new Set(payslipData.map(p => p.designation))];

    const getAvailableViewModes = () => {
        if (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'payroll_manager') {
            return [
                { value: 'own', label: 'My Payslips' },
                { value: 'all', label: 'All Employees' }
            ];
        } else if (currentUser.isManager) {
            return [
                { value: 'own', label: 'My Payslips' },
                { value: 'team', label: 'My Team' }
            ];
        } else {
            return [
                { value: 'own', label: 'My Payslips' }
            ];
        }
    };

    const payslipColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewPayslip(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Payslip"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDownloadPayslip(row)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download PDF"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    {(currentUser.role === 'hr' || currentUser.role === 'admin' || currentUser.role === 'payroll_manager') && (
                        <>
                            <button
                                onClick={() => handleEmailPayslip(row)}
                                className="p-1 text-purple-600 hover:bg-purple-50 rounded-lg"
                                title="Email Payslip"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleRegeneratePayslip(row)}
                                className="p-1 text-orange-600 hover:bg-orange-50 rounded-lg"
                                title="Regenerate"
                            >
                                <Award className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
            width: "140px"
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'generated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {row.status === 'generated' ? 'Draft' : 'Processed'}
                </span>
            )
        },
        {
            header: "Month",
            cell: row => `${row.month_name} ${row.year}`
        },
        {
            header: "Employee Code",
            accessor: "emp_code",
            cell: row => (
                <span className="font-mono text-sm font-medium text-indigo-600">
                    {row.emp_code}
                </span>
            )
        },
        {
            header: "Employee Name",
            accessor: "emp_name"
        },
        {
            header: "Designation",
            accessor: "designation"
        },
        {
            header: "Department",
            accessor: "department"
        },
        {
            header: "Gross Pay",
            accessor: "earnings.total_earnings",
            cell: row => `₹ ${row.earnings.total_earnings.toLocaleString()}`
        },
        {
            header: "Deductions",
            accessor: "deductions.total_deductions",
            cell: row => `₹ ${row.deductions.total_deductions.toLocaleString()}`
        },
        {
            header: "Net Pay",
            accessor: "net_pay",
            cell: row => (
                <span className="font-semibold text-green-600">
                    ₹ {row.net_pay.toLocaleString()}
                </span>
            )
        },
        {
            header: "Payment Date",
            accessor: "payment_date",
            cell: row => row.payment_date || 'Not paid'
        }
    ];

    const handleViewPayslip = (payslip) => {
        setSelectedPayslip(payslip);
        setShowPayslipModal(true);
    };

    const handleDownloadPayslip = (payslip) => {
        alert(`Downloading payslip for ${payslip.emp_name} - ${payslip.month_name} ${payslip.year}`);
    };

    const handleEmailPayslip = (payslip) => {
        alert(`Emailing payslip to ${payslip.emp_name}`);
    };

    const handleRegeneratePayslip = (payslip) => {
        alert(`Regenerating payslip for ${payslip.emp_name} - ${payslip.month_name} ${payslip.year}`);
    };

    const closeModal = () => {
        setShowPayslipModal(false);
        setSelectedPayslip(null);
    };

    // Get role badge
    const getRoleBadge = () => {
        switch (currentUser.role) {
            case 'admin':
                return { bg: 'bg-red-100', text: 'text-red-800', label: 'Administrator', icon: Shield };
            case 'hr':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'HR Manager', icon: Users };
            case 'payroll_manager':
                return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Payroll Manager', icon: DollarSign };
            case 'manager':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Manager', icon: Briefcase };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Employee', icon: User };
        }
    };

    const roleBadge = getRoleBadge();
    const RoleIcon = roleBadge.icon;
    const availableViewModes = getAvailableViewModes();

    // Render My Payslips View (simplified, just cards for each month)
    const renderMyPayslipsView = () => {
        const myPayslips = payslipData
            .filter(p => p.emp_code === currentUser.user_id)
            .sort((a, b) => b.year - a.year || b.month - a.month);

        return (
            <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Payslips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto scrollbar pr-1">
                        {myPayslips.map(payslip => (
                            <div key={payslip.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {payslip.month_name} {payslip.year}
                                        </div>
                                        <div className="text-sm text-gray-500">Generated: {payslip.generated_date}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${payslip.status === 'generated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {payslip.status === 'generated' ? 'Draft' : 'Processed'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gross Pay:</span>
                                        <span className="font-medium">₹ {payslip.earnings.total_earnings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Deductions:</span>
                                        <span className="font-medium text-red-600">- ₹ {payslip.deductions.total_deductions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-t-gray-300">
                                        <span className="font-semibold">Net Pay:</span>
                                        <span className="font-bold text-green-600">₹ {payslip.net_pay.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewPayslip(payslip)}
                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDownloadPayslip(payslip)}
                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                    >
                                        <Download className="w-3 h-3" />
                                        PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Payroll', to: '/payroll' },
                    { label: 'Payslips' }
                ]}
                title="Payslip Management"
                description="View and manage employee payslips"
            />

            <div className="bg-white rounded-md shadow-sm mb-6">
                <div className="flex overflow-x-auto p-2 gap-1">
                    {availableViewModes.map(mode => (
                        <button
                            key={mode.value}
                            onClick={() => setViewMode(mode.value)}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-sm transition-all ${viewMode === mode.value
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {mode.value === 'own' && <User className="w-4 h-4" />}
                            {mode.value === 'team' && <Users className="w-4 h-4" />}
                            {mode.value === 'all' && <Users className="w-4 h-4" />}
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {viewMode === 'own' ? (
                renderMyPayslipsView()
            ) : (
                <>

                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, code, month..."
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <CommonDropDown
                                label="Month"
                                value={selectedMonth}
                                onChange={setSelectedMonth}
                                options={[
                                    { label: 'All Months', value: '' },
                                    ...months
                                ]}
                                placeholder="Filter by Month"
                            />

                            <CommonDropDown
                                label="Year"
                                value={selectedYear}
                                onChange={setSelectedYear}
                                options={[
                                    { label: 'All Years', value: '' },
                                    ...years
                                ]}
                                placeholder="Filter by Year"
                            />

                            {(viewMode === 'all' || currentUser.role === 'hr' || currentUser.role === 'admin') && (
                                <>
                                    <CommonDropDown
                                        label="Department"
                                        value={selectedDepartment}
                                        onChange={setSelectedDepartment}
                                        options={[
                                            { label: 'All Departments', value: '' },
                                            ...departments.map(dept => ({ label: dept, value: dept }))
                                        ]}
                                        placeholder="Filter by Department"
                                    />

                                    <CommonDropDown
                                        label="Designation"
                                        value={selectedDesignation}
                                        onChange={setSelectedDesignation}
                                        options={[
                                            { label: 'All Designations', value: '' },
                                            ...designations.map(des => ({ label: des, value: des }))
                                        ]}
                                        placeholder="Filter by Designation"
                                    />
                                </>
                            )}

                            <CommonDropDown
                                label="Employee"
                                value={selectedEmployee}
                                onChange={setSelectedEmployee}
                                options={[
                                    { label: 'All Employees', value: '' },
                                    ...employees.map(emp => ({
                                        label: emp.emp_name,
                                        value: emp.emp_code,
                                        description: `${emp.designation}`
                                    }))
                                ]}
                                placeholder="Select Employee"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setSelectedEmployee('');
                                    setSelectedDepartment('');
                                    setSelectedDesignation('');
                                    setSelectedMonth('');
                                    setSelectedYear('');
                                    setSearchQuery('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {displayFormat === 'table' && (
                        <div className="">
                            {/* <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h2 className="font-semibold text-gray-900">Payslip Details</h2>
                                    <p className="text-sm text-gray-500">
                                        Showing {filteredData.length} payslips
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleExportData}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                                    >
                                        <DownloadCloud className="w-4 h-4" />
                                        Export
                                    </button>
                                    <button
                                        onClick={handlePrintReport}
                                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                                    >
                                        <Printer className="w-4 h-4" />
                                        Print
                                    </button>
                                </div>
                            </div> */}
                            <CommonTable
                                columns={payslipColumns}
                                data={filteredData}
                                itemsPerPage={10}
                                showSearch={false}
                                showPagination={true}
                            />
                        </div>
                    )}

                    {displayFormat === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredData.map(payslip => (
                                <div key={payslip.id} className="bg-white rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-all p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {payslip.emp_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{payslip.emp_name}</div>
                                                <div className="text-xs text-gray-500">{payslip.emp_code}</div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${payslip.status === 'generated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {payslip.status}
                                        </span>
                                    </div>

                                    <div className="text-center mb-3">
                                        <div className="text-lg font-semibold text-indigo-600">
                                            {payslip.month_name} {payslip.year}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Designation:</span>
                                            <span className="font-medium text-gray-900">{payslip.designation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Gross Pay:</span>
                                            <span className="font-medium">₹ {payslip.earnings.total_earnings.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Deductions:</span>
                                            <span className="font-medium text-red-600">- ₹ {payslip.deductions.total_deductions.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-t-gray-300">
                                            <span className="font-semibold">Net Pay:</span>
                                            <span className="font-bold text-green-600">₹ {payslip.net_pay.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewPayslip(payslip)}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPayslip(payslip)}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Download className="w-3 h-3" />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showPayslipModal && selectedPayslip && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                        <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Payslip - {selectedPayslip.month_name} {selectedPayslip.year}</h3>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Company Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-indigo-600">ACME Corp</h1>
                                <p className="text-gray-600">123 Business Park, Bangalore - 560001</p>
                                <p className="text-sm text-gray-500">GST: 29ABCDE1234F1Z5</p>
                            </div>

                            {/* Payslip Title */}
                            <div className="border-t border-b border-gray-300 py-3 mb-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">SALARY SLIP</h2>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Month: <span className="font-semibold">{selectedPayslip.month_name} {selectedPayslip.year}</span></p>
                                    <p className="text-sm text-gray-600">Generated: {selectedPayslip.generated_date}</p>
                                </div>
                            </div>

                            {/* Employee Details */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">Employee Details</h3>
                                    <p><span className="text-gray-600">Name:</span> {selectedPayslip.emp_name}</p>
                                    <p><span className="text-gray-600">Employee ID:</span> {selectedPayslip.emp_code}</p>
                                    <p><span className="text-gray-600">Designation:</span> {selectedPayslip.designation}</p>
                                    <p><span className="text-gray-600">Department:</span> {selectedPayslip.department}</p>
                                    <p><span className="text-gray-600">Grade:</span> {selectedPayslip.grade}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">Bank Details</h3>
                                    <p><span className="text-gray-600">Bank Name:</span> {selectedPayslip.bank_name}</p>
                                    <p><span className="text-gray-600">Account No:</span> {selectedPayslip.bank_account}</p>
                                    <p><span className="text-gray-600">IFSC Code:</span> {selectedPayslip.ifsc}</p>
                                    <p><span className="text-gray-600">PAN:</span> {selectedPayslip.pan}</p>
                                </div>
                            </div>

                            {/* Salary Details Table */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Earnings */}
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-2 font-semibold">Earnings</div>
                                    <table className="w-full">
                                        <tbody className="divide-y divide-gray-300">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Basic</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.basic.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">HRA</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.hra.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Special Allowance</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.special_allowance.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Conveyance</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.conveyance.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Medical</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.medical.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">LTA</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.lta.toLocaleString()}</td>
                                            </tr>
                                            {selectedPayslip.earnings.overtime > 0 && (
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">Overtime</td>
                                                    <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.overtime.toLocaleString()}</td>
                                                </tr>
                                            )}
                                            {selectedPayslip.earnings.bonus > 0 && (
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">Bonus</td>
                                                    <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.bonus.toLocaleString()}</td>
                                                </tr>
                                            )}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td className="px-4 py-2">Total Earnings</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.total_earnings.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Deductions */}
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-2 font-semibold">Deductions</div>
                                    <table className="w-full">
                                        <tbody className="divide-y divide-gray-300">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">PF (Employee)</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.pf_employee.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Professional Tax</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.professional_tax.toLocaleString()}</td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Income Tax</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.income_tax.toLocaleString()}</td>
                                            </tr>
                                            {selectedPayslip.deductions.loan_recovery > 0 && (
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">Loan Recovery</td>
                                                    <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.loan_recovery.toLocaleString()}</td>
                                                </tr>
                                            )}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td className="px-4 py-2">Total Deductions</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.total_deductions.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Employer Contributions */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                                <div className="bg-gray-100 px-4 py-2 font-semibold">Employer Contributions (Not deducted from salary)</div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-gray-600 text-sm">PF (Employer)</span>
                                        <div className="font-semibold">₹ {selectedPayslip.employer_contributions.pf_employer.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Gratuity</span>
                                        <div className="font-semibold">₹ {selectedPayslip.employer_contributions.gratuity.toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Insurance</span>
                                        <div className="font-semibold">₹ {selectedPayslip.employer_contributions.insurance.toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-indigo-800 font-medium">NET PAY (Amount payable)</span>
                                        <p className="text-sm text-indigo-600">Rupees {numberToWords(selectedPayslip.net_pay)} only</p>
                                    </div>
                                    <div className="text-3xl font-bold text-indigo-800">
                                        ₹ {selectedPayslip.net_pay.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-xs text-gray-500 border-t border-t-gray-300 pt-4 flex justify-between">
                                <div>This is a computer generated statement, signature not required</div>
                                <div>© ACME Corp - All rights reserved</div>
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-gray-50 border-t border-t-gray-300 px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => handleDownloadPayslip(selectedPayslip)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to convert number to words (simplified)
function numberToWords(num) {
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return 'Zero';

    const numStr = num.toString();
    const numLength = numStr.length;

    if (numLength > 7) return num.toLocaleString(); // Simplified for large numbers

    // Simplified for demo - just return the number
    return num.toLocaleString() + ' Rupees';
}

export default PayslipsTest;