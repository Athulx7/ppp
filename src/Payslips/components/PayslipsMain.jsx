import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, Eye, User, Users, Briefcase, DollarSign, Shield, RefreshCw } from 'lucide-react';
import PayslipsMyPayslipsView from './PayslipsMyPayslipsView';
import PayslipsFilterAndView from './PayslipsFilterAndView';
import PayslipViewpopup from './PayslipViewpopup';
import { ApiCall } from '../../library/constants';

function PayslipsMain() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
            const role = (stored.role_code || 'EMPLOYEE').toLowerCase();
            return {
                user_id: stored.user_code || stored.emp_code || '',
                name: stored.email || stored.user_code || 'User',
                role: role,
                designation: stored.designation || 'Staff',
                department: stored.department || 'General',
                isManager: role === 'manager' || role === 'admin' || role === 'hr' || role === 'payroll_manager',
                managedEmployees: []
            };
        } catch {
            return {
                user_id: '',
                name: 'User',
                role: 'employee',
                designation: 'Staff',
                department: 'General',
                isManager: false,
                managedEmployees: []
            };
        }
    });

    const isEmployeeRole = currentUser.role === 'employee';
    const [viewMode, setViewMode] = useState(isEmployeeRole ? 'own' : 'all');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [payslipData, setPayslipData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const months = useMemo(() => [
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
    ], []);

    const currentYear = new Date().getFullYear();
    const years = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
    })), [currentYear]);

    const fetchPayslips = useCallback(async () => {
        setIsLoading(true);
        try {
            const endpoint = `/payroll/payslips?view=${viewMode}`
            const res = await ApiCall('get', endpoint)
            if (res?.data?.success && Array.isArray(res.data.data)) {
                setPayslipData(res.data.data)
            } else {
                setPayslipData([])
            }
        } catch (err) {
            console.error("Error fetching payslips:", err)
            setPayslipData([])
        } finally {
            setIsLoading(false)
        }
    }, [viewMode])

    useEffect(() => {
        fetchPayslips()
    }, [fetchPayslips])

    useEffect(() => {
        let data = [...payslipData]

        if (currentUser.role === 'employee' || viewMode === 'own') {
            if (currentUser.user_id) {
                data = data.filter(p => p.emp_code === currentUser.user_id)
            }
        }

        if (selectedEmployee) {
            data = data.filter(p => p.emp_code === selectedEmployee)
        }

        if (selectedDepartment) {
            data = data.filter(p => p.department === selectedDepartment)
        }

        if (selectedDesignation) {
            data = data.filter(p => p.designation === selectedDesignation)
        }

        if (selectedMonth) {
            data = data.filter(p => p.month === selectedMonth)
        }

        if (selectedYear) {
            data = data.filter(p => p.year.toString() === selectedYear)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            data = data.filter(p =>
                (p.emp_name || '').toLowerCase().includes(query) ||
                (p.emp_code || '').toLowerCase().includes(query) ||
                (p.designation || '').toLowerCase().includes(query) ||
                `${p.month_name || ''} ${p.year || ''}`.toLowerCase().includes(query)
            )
        }

        setFilteredData(data)

        const totalGrossPay = data.reduce((sum, p) => sum + (p.earnings?.total_earnings || 0), 0)
        const totalNetPay = data.reduce((sum, p) => sum + (p.net_pay || 0), 0)
        const totalDeductions = data.reduce((sum, p) => sum + (p.deductions?.total_deductions || 0), 0)
        const totalPF = data.reduce((sum, p) => sum + (p.deductions?.pf_employee || 0), 0)
        const totalTax = data.reduce((sum, p) => sum + (p.deductions?.professional_tax || 0) + (p.deductions?.income_tax || 0), 0)

        setSummary({
            totalEmployees: [...new Set(data.map(p => p.emp_code))].length,
            totalGrossPay,
            totalNetPay,
            totalDeductions,
            totalPF,
            totalTax
        })
    }, [payslipData, currentUser, viewMode, selectedEmployee, selectedDepartment, selectedDesignation, selectedMonth, selectedYear, searchQuery])

    const departments = useMemo(() => [...new Set(payslipData.map(p => p.department).filter(Boolean))], [payslipData])
    const designations = useMemo(() => [...new Set(payslipData.map(p => p.designation).filter(Boolean))], [payslipData])
    const employeeOptions = useMemo(() => {
        const unique = []
        const seen = new Set()
        payslipData.forEach(p => {
            if (!seen.has(p.emp_code)) {
                seen.add(p.emp_code)
                unique.push({
                    emp_code: p.emp_code,
                    emp_name: p.emp_name,
                    designation: p.designation
                })
            }
        })
        return unique
    }, [payslipData])

    const getAvailableViewModes = () => {
        if (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'payroll_manager') {
            return [
                { value: 'all', label: 'All Employees' },
                { value: 'own', label: 'My Payslips' }
            ]
        } else if (currentUser.isManager) {
            return [
                { value: 'own', label: 'My Payslips' },
                { value: 'team', label: 'My Team' },
                { value: 'all', label: 'All Employees' }
            ]
        } else {
            return [
                { value: 'own', label: 'My Payslips' }
            ]
        }
    }

    const handleViewPayslip = (payslip) => {
        setSelectedPayslip(payslip)
        setShowPayslipModal(true)
    }

    const handleDownloadPayslip = (payslip) => {
        window.print()
    }

    const closeModal = () => {
        setShowPayslipModal(false)
        setSelectedPayslip(null)
    }

    const availableViewModes = getAvailableViewModes()

    const getAvatarColor = (name = '') => {
        const colors = [
            'bg-indigo-100 text-indigo-700',
            'bg-emerald-100 text-emerald-700',
            'bg-blue-100 text-blue-700',
            'bg-purple-100 text-purple-700',
            'bg-amber-100 text-amber-700',
            'bg-teal-100 text-teal-700'
        ]
        let hash = 0
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
        return colors[Math.abs(hash) % colors.length]
    }

    const payslipColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handleViewPayslip(row)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Detailed Payslip"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleViewPayslip(row)}
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Print / Save PDF"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            ),
            width: "90px"
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    row.status === 'generated' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                    {row.status === 'generated' ? 'Generated' : 'Processed'}
                </span>
            )
        },
        {
            header: "Period",
            cell: row => (
                <span className="font-semibold text-gray-800">
                    {row.month_name} {row.year}
                </span>
            )
        },
        {
            header: "Employee",
            accessor: "emp_name",
            cell: row => {
                const initials = (row.emp_name || 'E').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                return (
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(row.emp_name)}`}>
                            {initials}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 text-xs">{row.emp_name}</div>
                            <div className="font-mono text-[10px] text-gray-500">{row.emp_code}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: "Designation & Dept",
            cell: row => (
                <div>
                    <div className="text-xs text-gray-800 font-medium">{row.designation}</div>
                    <div className="text-[10px] text-gray-500">{row.department}</div>
                </div>
            )
        },
        {
            header: "Gross Earnings",
            cell: row => (
                <span className="text-xs font-medium text-gray-800">
                    ₹{(row.earnings?.total_earnings || 0).toLocaleString('en-IN')}
                </span>
            )
        },
        {
            header: "Deductions",
            cell: row => (
                <span className="text-xs font-medium text-rose-600">
                    -₹{(row.deductions?.total_deductions || 0).toLocaleString('en-IN')}
                </span>
            )
        },
        {
            header: "Net Take-Home",
            cell: row => (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ₹{(row.net_pay || 0).toLocaleString('en-IN')}
                </span>
            )
        },
        {
            header: "Run Date",
            accessor: "generated_date",
            cell: row => <span className="text-[11px] text-gray-500 font-mono">{row.generated_date || '—'}</span>
        }
    ];

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        Payslips & Compensation Slips
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        View, inspect, and export finalized salary slips with dynamic structure earnings and statutory deductions.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="bg-gray-100 p-1 rounded-md flex items-center gap-1 border border-gray-200">
                        {availableViewModes.map(mode => (
                            <button
                                key={mode.value}
                                onClick={() => setViewMode(mode.value)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                    viewMode === mode.value
                                        ? 'bg-white text-indigo-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                }`}
                            >
                                {mode.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={fetchPayslips}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Reload payslips from database"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                </div>
            </div>

            {viewMode !== 'own' && !isEmployeeRole && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800">Disbursed Staff</p>
                                <p className="text-2xl font-black text-indigo-950 mt-1">{summary.totalEmployees}</p>
                                <p className="text-[11px] text-indigo-600 mt-0.5">{filteredData.length} payslips processed</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Total Gross Payroll</p>
                                <p className="text-2xl font-black text-blue-950 mt-1">₹{summary.totalGrossPay.toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-blue-600 mt-0.5">Base & structure earnings</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">Total Deductions</p>
                                <p className="text-2xl font-black text-rose-950 mt-1">₹{summary.totalDeductions.toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-rose-600 mt-0.5">PF, PT, TDS & LOP</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Total Net Disbursed</p>
                                <p className="text-2xl font-black text-emerald-950 mt-1">₹{summary.totalNetPay.toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-emerald-600 mt-0.5">Credited to employee accounts</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <Briefcase className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'own' ? (
                <PayslipsMyPayslipsView
                    payslipData={filteredData}
                    currentUser={currentUser}
                    handleViewPayslip={handleViewPayslip}
                />
            ) : (
                <PayslipsFilterAndView
                    months={months}
                    years={years}
                    departments={departments}
                    designations={designations}
                    viewMode={viewMode}
                    currentUser={currentUser}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    selectedDesignation={selectedDesignation}
                    setSelectedDesignation={setSelectedDesignation}
                    employees={employeeOptions}
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
        </div>
    )
}

export default PayslipsMain