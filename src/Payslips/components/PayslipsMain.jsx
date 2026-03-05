import React, { useState, useEffect } from 'react'
import { Download, Eye, User, Users, Briefcase, DollarSign, Mail, Shield, Award } from 'lucide-react';
import PayslipsMyPayslipsView from './PayslipsMyPayslipsView';
import PayslipsFilterAndView from './PayslipsFilterAndView';
import PayslipViewpopup from './PayslipViewpopup';

function PayslipsMain() {
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
    return (
        <>
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
                <PayslipsMyPayslipsView
                    payslipData={payslipData}
                    currentUser={currentUser}
                    handleViewPayslip={handleViewPayslip}
                />
            ) : (
                <PayslipsFilterAndView
                    currentUser={currentUser}
                    months={months}
                    years={years}
                    departments={departments}
                    designations={designations}
                    viewMode={viewMode}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    selectedDesignation={selectedDesignation}
                    setSelectedDesignation={setSelectedDesignation}
                    employees={employees}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    payslipColumns={payslipColumns}
                    filteredData={filteredData}
                />
            )}

            {showPayslipModal && selectedPayslip && (
                <PayslipViewpopup
                    selectedPayslip={selectedPayslip}
                    closeModal={closeModal}
                    handleDownloadPayslip={handleDownloadPayslip}
                />
            )}
        </>
    )
}

export default PayslipsMain