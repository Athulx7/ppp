import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import { Download, Eye, User, Users, Shield, DollarSign, Briefcase } from 'lucide-react';
import CtcReportMyCtcView from './CtcReportMyCtcView';
import CtcReportFilterAndView from './CtcReportFilterAndView';
import CtcReportViewPopUp from './CtcReportViewPopUp';

function CtcReportMain({ isLoading, setIsLoading }) {
    const [currentUser, setCurrentUser] = useState({
        user_id: 'EMP001',
        name: 'User Name',
        role: 'admin', // 'admin', 'hr', 'payroll_manager', 'employee', 'manager'
        designation: 'HR Manager',
        department: 'Human Resources',
        isManager: true,
        managedEmployees: ['EMP002', 'EMP003', 'EMP004', 'EMP005']
    });
    const [viewMode, setViewMode] = useState('own')
    const [ctcData, setCtcData] = useState([]);

    const getAvailableViewModes = () => {
        setIsLoading(false)
        if (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'payroll_manager') {
            return [
                { value: 'own', label: 'My CTC' },
                { value: 'all', label: 'All Employees' }
            ];
        } else if (currentUser.isManager) {
            console.log(setCurrentUser)
            return [
                { value: 'own', label: 'My CTC' },
                { value: 'team', label: 'My Team' }
            ];
        } else {
            return [
                { value: 'own', label: 'My CTC' }
            ];
        }

    };
    const availableViewModes = getAvailableViewModes();
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
    const [summary, setSummary] = useState({
        totalEmployees: 0,
        totalCTC: 0,
        averageCTC: 0,
        highestCTC: 0,
        lowestCTC: 0,
        totalBasic: 0,
        totalHRA: 0,
        totalAllowances: 0,
        totalBonus: 0,
        totalPF: 0,
        totalGratuity: 0
    });

    useEffect(() => {
        const dummyCTCData = [
            {
                emp_code: 'EMP001',
                emp_name: 'John Doe',
                designation: 'HR Manager',
                department: 'HR',
                grade: 'M3',
                doj: '2020-01-15',
                basic_salary: 85000,
                hra: 42500,
                special_allowance: 15000,
                conveyance: 3200,
                medical: 1250,
                lta: 5000,
                bonus: 50000,
                pf_employer: 10200,
                gratuity: 4080,
                insurance: 5000,
                overtime: 0,
                pf_employee: 10200,
                total_ctc: 0
            },
            {
                emp_code: 'EMP002',
                emp_name: 'Athul Krishna',
                designation: 'Junior Software Engineer',
                department: 'Engineering',
                grade: 'S3',
                doj: '2023-06-15',
                basic_salary: 30000,
                hra: 15000,
                special_allowance: 5000,
                conveyance: 1600,
                medical: 1250,
                lta: 2000,
                bonus: 25000,
                pf_employer: 3600,
                gratuity: 1440,
                insurance: 5000,
                overtime: 0,
                pf_employee: 3600,
                total_ctc: 0
            },
            {
                emp_code: 'EMP003',
                emp_name: 'Michael Chen',
                designation: 'Tech Lead',
                department: 'Engineering',
                grade: 'M2',
                doj: '2019-06-01',
                basic_salary: 95000,
                hra: 47500,
                special_allowance: 20000,
                conveyance: 3200,
                medical: 1250,
                lta: 6000,
                bonus: 60000,
                pf_employer: 11400,
                gratuity: 4560,
                insurance: 5000,
                overtime: 5000,
                pf_employee: 11400,
                total_ctc: 0
            },
            {
                emp_code: 'EMP004',
                emp_name: 'Sarah Johnson',
                designation: 'Sales Manager',
                department: 'Sales',
                grade: 'M2',
                doj: '2020-11-20',
                basic_salary: 90000,
                hra: 45000,
                special_allowance: 18000,
                conveyance: 3200,
                medical: 1250,
                lta: 5000,
                bonus: 55000,
                pf_employer: 10800,
                gratuity: 4320,
                insurance: 5000,
                overtime: 3000,
                pf_employee: 10800,
                total_ctc: 0
            },
            {
                emp_code: 'EMP005',
                emp_name: 'David Kumar',
                designation: 'Accountant',
                department: 'Finance',
                grade: 'S4',
                doj: '2022-02-15',
                basic_salary: 55000,
                hra: 27500,
                special_allowance: 8000,
                conveyance: 3200,
                medical: 1250,
                lta: 3000,
                bonus: 30000,
                pf_employer: 6600,
                gratuity: 2640,
                insurance: 5000,
                overtime: 0,
                pf_employee: 6600,
                total_ctc: 0
            }
        ];

        const dataWithTotal = dummyCTCData.map(emp => ({
            ...emp,
            total_ctc: emp.basic_salary + emp.hra + emp.special_allowance + emp.conveyance +
                emp.medical + emp.lta + emp.bonus + emp.pf_employer + emp.gratuity + emp.insurance
        }));

        setCtcData(dataWithTotal);
    }, []);

    useEffect(() => {
        let data = [...ctcData];

        if (currentUser.role === 'employee') {
            data = data.filter(emp => emp.emp_code === currentUser.user_id);
        } else if (currentUser.role === 'manager' || (currentUser.isManager && currentUser.role !== 'admin' && currentUser.role !== 'hr')) {
            if (viewMode === 'own') {
                data = data.filter(emp => emp.emp_code === currentUser.user_id);
            } else if (viewMode === 'team') {
                data = data.filter(emp =>
                    emp.emp_code === currentUser.user_id ||
                    currentUser.managedEmployees.includes(emp.emp_code)
                );
            }
        } else if (currentUser.role === 'hr' || currentUser.role === 'admin' || currentUser.role === 'payroll_manager') {
            if (viewMode === 'own') {
                data = data.filter(emp => emp.emp_code === currentUser.user_id);
            }
        }

        if (selectedEmployee) {
            data = data.filter(emp => emp.emp_code === selectedEmployee);
        }

        if (selectedDepartment) {
            data = data.filter(emp => emp.department === selectedDepartment);
        }

        if (selectedDesignation) {
            data = data.filter(emp => emp.designation === selectedDesignation);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(emp =>
                emp.emp_name.toLowerCase().includes(query) ||
                emp.emp_code.toLowerCase().includes(query) ||
                emp.designation.toLowerCase().includes(query)
            );
        }

        setFilteredData(data);

        const totalCTC = data.reduce((sum, emp) => sum + emp.total_ctc, 0);
        const totalBasic = data.reduce((sum, emp) => sum + emp.basic_salary, 0);
        const totalHRA = data.reduce((sum, emp) => sum + emp.hra, 0);
        const totalAllowances = data.reduce((sum, emp) => sum + emp.special_allowance + emp.conveyance + emp.medical + emp.lta, 0);
        const totalBonus = data.reduce((sum, emp) => sum + emp.bonus, 0);
        const totalPF = data.reduce((sum, emp) => sum + emp.pf_employer, 0);
        const totalGratuity = data.reduce((sum, emp) => sum + emp.gratuity, 0);

        setSummary({
            totalEmployees: data.length,
            totalCTC: totalCTC,
            averageCTC: data.length > 0 ? totalCTC / data.length : 0,
            highestCTC: data.length > 0 ? Math.max(...data.map(emp => emp.total_ctc)) : 0,
            lowestCTC: data.length > 0 ? Math.min(...data.map(emp => emp.total_ctc)) : 0,
            totalBasic,
            totalHRA,
            totalAllowances,
            totalBonus,
            totalPF,
            totalGratuity
        });
    }, [ctcData, currentUser, viewMode, selectedEmployee, selectedDepartment, selectedDesignation, searchQuery]);

    const departments = [...new Set(ctcData.map(emp => emp.department))];
    const designations = [...new Set(ctcData.map(emp => emp.designation))];

    const ctcColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDownloadPayslip(row.emp_code)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download CTC Statement"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            ),
            width: "120px"
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
            header: "Grade",
            accessor: "grade"
        },
        {
            header: "Date of Joining",
            accessor: "doj"
        },
        {
            header: "Basic",
            accessor: "basic_salary",
            cell: row => `₹ ${row.basic_salary.toLocaleString()}`
        },
        {
            header: "HRA",
            accessor: "hra",
            cell: row => `₹ ${row.hra.toLocaleString()}`
        },
        {
            header: "Allowances",
            cell: row => {
                const total = row.special_allowance + row.conveyance + row.medical + row.lta;
                return `₹ ${total.toLocaleString()}`;
            }
        },
        {
            header: "Bonus",
            accessor: "bonus",
            cell: row => `₹ ${row.bonus.toLocaleString()}`
        },
        {
            header: "PF (Employer)",
            accessor: "pf_employer",
            cell: row => `₹ ${row.pf_employer.toLocaleString()}`
        },
        {
            header: "Gratuity",
            accessor: "gratuity",
            cell: row => `₹ ${row.gratuity.toLocaleString()}`
        },
        {
            header: "Total CTC",
            accessor: "total_ctc",
            cell: row => (
                <span className="font-semibold text-green-600">
                    ₹ {row.total_ctc.toLocaleString()}
                </span>
            )
        }
    ];

    const handleViewDetails = (employee) => {
        setSelectedEmployeeData(employee);
        setShowPopup(true);
    };

    const handleDownloadPayslip = (empCode) => {
        alert(`Downloading CTC statement for: ${empCode}`);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedEmployeeData(null);
    };

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
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto p-2 gap-1">
                    {availableViewModes.map(mode => (
                        <button
                            key={mode.value}
                            onClick={() => setViewMode(mode.value)}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${viewMode === mode.value
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
                <CtcReportMyCtcView ctcData={ctcData} currentUser={currentUser} />
            ) : (
                <CtcReportFilterAndView
                    viewMode={viewMode}
                    ctcData={ctcData}
                    currentUser={currentUser}
                    setSelectedEmployee={setSelectedEmployee}
                    setSelectedDepartment={setSelectedDepartment}
                    setSelectedDesignation={setSelectedDesignation}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    setSearchQuery={setSearchQuery}
                    filteredData={filteredData}
                    departments={departments}
                    designations={designations}
                    ctcColumns={ctcColumns}
                />
            )}

            {isLoading && <LoadingSpinner />}

            {showPopup && selectedEmployeeData &&
                <CtcReportViewPopUp
                    closePopup={closePopup}
                    selectedEmployeeData={selectedEmployeeData}
                />
            }
        </>
    )
}

export default CtcReportMain