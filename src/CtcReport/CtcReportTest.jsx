import React, { useState, useEffect } from 'react';
import {
    Download, Eye, Filter, Search, Calendar, ChevronDown,
    User, Users, Briefcase, Building, DollarSign, TrendingUp,
    DownloadCloud, Printer, Mail, FileText, Shield, Lock, X,
    Grid, List, PieChart as PieChartIcon, BarChart as BarChartIcon
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';
import CommonDatePicker from '../basicComponents/CommonDatePicker';

function CtcReportTest() {
    const [currentUser, setCurrentUser] = useState({
        user_id: 'EMP001',
        name: 'User Name',
        role: 'admin', // 'admin', 'hr', 'payroll_manager', 'employee', 'manager'
        designation: 'HR Manager',
        department: 'Human Resources',
        isManager: true,
        managedEmployees: ['EMP002', 'EMP003', 'EMP004', 'EMP005']
    });

    const [viewMode, setViewMode] = useState('own'); // 'own', 'team', 'all'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [displayFormat, setDisplayFormat] = useState('table'); // 'table', 'card'
    const [ctcData, setCtcData] = useState([]);
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

    const getAvailableViewModes = () => {
        if (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'payroll_manager') {
            return [
                { value: 'own', label: 'My CTC' },
                { value: 'all', label: 'All Employees' }
            ];
        } else if (currentUser.isManager) {
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
                    {(currentUser.role === 'hr' || currentUser.role === 'admin' || currentUser.role === 'payroll_manager') && (
                        <button
                            onClick={() => handleEmailReport(row.emp_code)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="Email Report"
                        >
                            <Mail className="w-4 h-4" />
                        </button>
                    )}
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

    const handleEmailReport = (empCode) => {
        alert(`Emailing report for: ${empCode}`);
    };

    const handleExportData = () => {
        alert('Exporting CTC report...');
    };

    const handlePrintReport = () => {
        alert('Printing report...');
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
    const availableViewModes = getAvailableViewModes();

    const renderMyCtcView = () => {
        const myData = ctcData.find(emp => emp.emp_code === currentUser.user_id);
        if (!myData) return null;

        const monthlyGross = myData.basic_salary + myData.hra + myData.special_allowance +
            myData.conveyance + myData.medical + myData.lta;
        const monthlyDeductions = myData.pf_employee || 0;
        const monthlyNet = monthlyGross - monthlyDeductions;
        const annualGross = monthlyGross * 12;
        const annualNet = monthlyNet * 12;
        const annualCTC = myData.total_ctc;

        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-b-gray-300">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{myData.emp_name}</h2>
                        <p className="text-gray-600">{myData.emp_code} | {myData.designation}</p>
                        <p className="text-sm text-gray-500">{myData.department} • {myData.grade}</p>
                    </div>

                    <button
                        onClick={handleExportData}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                    >
                        <DownloadCloud className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Gross Salary</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualGross.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Employer Contributions</div>
                            <div className="text-xl font-bold text-gray-900">₹{(myData.pf_employer * 12).toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Net Salary</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualNet.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual CTC</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualCTC.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-semibold text-gray-900">Earnings</h4>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">OVERTIME</span>
                                    <span className="font-medium">₹{myData.overtime?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">BASIC</span>
                                    <span className="font-medium">₹{myData.basic_salary.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">HRA</span>
                                    <span className="font-medium">₹{myData.hra.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Special Allowance</span>
                                    <span className="font-medium">₹{myData.special_allowance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Conveyance</span>
                                    <span className="font-medium">₹{myData.conveyance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Medical</span>
                                    <span className="font-medium">₹{myData.medical.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">LTA</span>
                                    <span className="font-medium">₹{myData.lta.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                    <span className="text-gray-900">Total Earnings</span>
                                    <span className="text-gray-900">₹{monthlyGross.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-semibold text-gray-900">Deductions</h4>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">PF Employee</span>
                                    <span className="font-medium">₹{myData.pf_employee?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                    <span className="text-gray-900">Total Deductions</span>
                                    <span className="text-gray-900">₹{monthlyDeductions.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-t-gray-300">
                            <div className="bg-gray-50 px-4 py-3">
                                <h4 className="font-semibold text-gray-900">Employer Contributions</h4>
                                <p className="text-xs text-gray-500 mt-1">Not shown on payslip, included in CTC</p>
                            </div>
                            <div className="p-4">
                                {myData.pf_employer > 0 || myData.gratuity > 0 || myData.insurance > 0 ? (
                                    <div className="space-y-3">
                                        {myData.pf_employer > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">PF Employer</span>
                                                <span className="font-medium">₹{myData.pf_employer.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {myData.gratuity > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Gratuity</span>
                                                <span className="font-medium">₹{myData.gratuity.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {myData.insurance > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Insurance</span>
                                                <span className="font-medium">₹{myData.insurance.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                            <span className="text-gray-900">Total Employer Contributions</span>
                                            <span className="text-gray-900">₹{(myData.pf_employer + myData.gratuity + myData.insurance).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No employer contributions</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Reports', to: '/reports' },
                    { label: 'CTC Report' }
                ]}
                title="CTC Report"
                description="View Cost to Company breakdown for employees"
            />

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
                renderMyCtcView()
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

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
                                    ...ctcData.map(emp => ({
                                        label: emp.emp_name,
                                        value: emp.emp_code,
                                        description: `${emp.designation}`
                                    }))
                                ]}
                                placeholder="Select Employee"
                            />

                            <CommonDatePicker
                                label="From Date"
                                value={dateRange.from}
                                onChange={(val) => setDateRange({ ...dateRange, from: val })}
                                placeholder="Start Date"
                            />

                            <CommonDatePicker
                                label="To Date"
                                value={dateRange.to}
                                onChange={(val) => setDateRange({ ...dateRange, to: val })}
                                placeholder="End Date"
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    className="px-4 py-2 h-10 border bg-indigo-600  text-white rounded-lg hover:bg-indigo-500"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedEmployee('');
                                        setSelectedDepartment('');
                                        setSelectedDesignation('');
                                        setSearchQuery('');
                                        setDateRange({ from: '', to: '' });
                                    }}
                                    className="px-4 py-2 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>


                    </div>

                    {displayFormat === 'table' && (
                        <div className="">
                            <CommonTable
                                columns={ctcColumns}
                                data={filteredData}
                                itemsPerPage={10}
                                showSearch={false}
                                showPagination={true}
                            />
                        </div>
                    )}

                    {displayFormat === 'card' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredData.map(emp => (
                                <div key={emp.emp_code} className="bg-white rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-all p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {emp.emp_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{emp.emp_name}</div>
                                                <div className="text-xs text-gray-500">{emp.emp_code}</div>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {emp.grade}
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Designation:</span>
                                            <span className="font-medium text-gray-900">{emp.designation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Department:</span>
                                            <span className="font-medium text-gray-900">{emp.department}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">DOJ:</span>
                                            <span className="text-gray-900">{emp.doj}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-t-gray-300 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500">Total CTC</span>
                                            <span className="text-lg font-bold text-green-600">₹ {emp.total_ctc.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Basic: ₹{emp.basic_salary.toLocaleString()}</span>
                                            <span>HRA: ₹{emp.hra.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleViewDetails(emp)}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPayslip(emp.emp_code)}
                                            className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                        >
                                            <Download className="w-3 h-3" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {showPopup && selectedEmployeeData && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                        <div className="sticky top-0 bg-white border-b px-6 py-2 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Employee CTC Details</h3>
                            <button
                                onClick={closePopup}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-b-gray-300">
                   <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedEmployeeData.emp_name}</h2>
                                    <p className="text-gray-600">{selectedEmployeeData.emp_code} | {selectedEmployeeData.designation}</p>
                                    <p className="text-sm text-gray-500">{selectedEmployeeData.department} • {selectedEmployeeData.grade}</p>
                                </div>

                    <button
                        onClick={handleExportData}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                    >
                        <DownloadCloud className="w-4 h-4" />
                        Export
                    </button>
                </div>

                            

                            {(() => {
                                const monthlyGross = selectedEmployeeData.basic_salary + selectedEmployeeData.hra +
                                    selectedEmployeeData.special_allowance + selectedEmployeeData.conveyance +
                                    selectedEmployeeData.medical + selectedEmployeeData.lta;
                                const monthlyDeductions = selectedEmployeeData.pf_employee || 0;
                                const monthlyNet = monthlyGross - monthlyDeductions;
                                const annualGross = monthlyGross * 12;
                                const annualNet = monthlyNet * 12;
                                const annualCTC = selectedEmployeeData.total_ctc;

                                return (
                                    <>
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="text-sm text-gray-500">Annual Gross Salary</div>
                                                    <div className="text-xl font-bold text-gray-900">₹{annualGross.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="text-sm text-gray-500">Annual Employer Contributions</div>
                                                    <div className="text-xl font-bold text-gray-900">₹{(selectedEmployeeData.pf_employer * 12).toLocaleString()}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="text-sm text-gray-500">Annual Net Salary</div>
                                                    <div className="text-xl font-bold text-gray-900">₹{annualNet.toLocaleString()}</div>
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="text-sm text-gray-500">Annual CTC</div>
                                                    <div className="text-xl font-bold text-gray-900">₹{annualCTC.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                                                    <h4 className="font-semibold text-gray-900">Earnings</h4>
                                                </div>
                                                <div className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">OVERTIME</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.overtime?.toLocaleString() || '0'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">BASIC</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.basic_salary.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">HRA</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.hra.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Special Allowance</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.special_allowance.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Conveyance</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.conveyance.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">Medical</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.medical.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">LTA</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.lta.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                                            <span className="text-gray-900">Total Earnings</span>
                                                            <span className="text-gray-900">₹{monthlyGross.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                                                    <h4 className="font-semibold text-gray-900">Deductions</h4>
                                                </div>
                                                <div className="p-4">
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-600">PF Employee</span>
                                                            <span className="font-medium">₹{selectedEmployeeData.pf_employee?.toLocaleString() || '0'}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                                            <span className="text-gray-900">Total Deductions</span>
                                                            <span className="text-gray-900">₹{monthlyDeductions.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-t-gray-300">
                                                    <div className="bg-gray-50 px-4 py-3">
                                                        <h4 className="font-semibold text-gray-900">Employer Contributions</h4>
                                                        <p className="text-xs text-gray-500 mt-1">Not shown on payslip, included in CTC</p>
                                                    </div>
                                                    <div className="p-4">
                                                        {selectedEmployeeData.pf_employer > 0 || selectedEmployeeData.gratuity > 0 || selectedEmployeeData.insurance > 0 ? (
                                                            <div className="space-y-3">
                                                                {selectedEmployeeData.pf_employer > 0 && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600">PF Employer</span>
                                                                        <span className="font-medium">₹{selectedEmployeeData.pf_employer.toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                                {selectedEmployeeData.gratuity > 0 && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600">Gratuity</span>
                                                                        <span className="font-medium">₹{selectedEmployeeData.gratuity.toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                                {selectedEmployeeData.insurance > 0 && (
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-gray-600">Insurance</span>
                                                                        <span className="font-medium">₹{selectedEmployeeData.insurance.toLocaleString()}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                                                    <span className="text-gray-900">Total Employer Contributions</span>
                                                                    <span className="text-gray-900">₹{(selectedEmployeeData.pf_employer + selectedEmployeeData.gratuity + selectedEmployeeData.insurance).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">No employer contributions</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CtcReportTest