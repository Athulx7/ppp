import React, { useEffect, useState, useCallback, useMemo } from 'react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import { Download, Eye, User, Users, RefreshCw } from 'lucide-react';
import CtcReportMyCtcView from './CtcReportMyCtcView';
import CtcReportFilterAndView from './CtcReportFilterAndView';
import CtcReportViewPopUp from './CtcReportViewPopUp';
import { ApiCall } from '../../library/constants';

function CtcReportMain({ isLoading, setIsLoading }) {
    const [currentUser] = useState(() => {
        try {
            const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
            const role = (stored.role_code || 'EMPLOYEE').toLowerCase();
            return {
                user_id: stored.user_code || stored.emp_code || '',
                name: stored.user_name || stored.email || stored.user_code || 'User',
                role: role,
                designation: stored.designation || 'Staff',
                department: stored.department || 'General',
                isManager: ['manager', 'admin', 'hr', 'payroll_manager'].includes(role),
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
    const [ctcData, setCtcData] = useState([]);
    const [internalLoading, setInternalLoading] = useState(false);

    const setLoading = useCallback((val) => {
        setInternalLoading(val);
        if (typeof setIsLoading === 'function') {
            setIsLoading(prev => (typeof prev === 'object' && prev !== null) ? { ...prev, spinner: val, normal: val } : val);
        }
    }, [setIsLoading]);

    const availableViewModes = useMemo(() => {
        if (currentUser.role === 'admin' || currentUser.role === 'hr' || currentUser.role === 'payroll_manager') {
            return [
                { value: 'all', label: 'All Employees' },
                { value: 'own', label: 'My CTC' }
            ];
        } else if (currentUser.role === 'manager' || currentUser.isManager) {
            return [
                { value: 'team', label: 'My Team' },
                { value: 'all', label: 'All Employees' },
                { value: 'own', label: 'My CTC' }
            ];
        } else {
            return [
                { value: 'own', label: 'My CTC' }
            ];
        }
    }, [currentUser.role, currentUser.isManager]);

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
        totalGross: 0,
        totalEmployerBenefits: 0
    });

    const fetchCtcData = useCallback(async () => {
        setLoading(true);
        try {
            const endpoint = `/payroll/ctc-report?view=${viewMode}`;
            const res = await ApiCall('get', endpoint);
            if (res?.data?.success && Array.isArray(res.data.data)) {
                setCtcData(res.data.data);
            } else {
                setCtcData([]);
            }
        } catch (err) {
            console.error("Error fetching CTC report:", err);
            setCtcData([]);
        } finally {
            setLoading(false);
        }
    }, [viewMode, setLoading]);

    useEffect(() => {
        fetchCtcData();
    }, [fetchCtcData]);

    useEffect(() => {
        let data = [...ctcData];

        if (currentUser.role === 'employee' || viewMode === 'own') {
            if (currentUser.user_id && data.length > 1) {
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
                emp.emp_name?.toLowerCase().includes(query) ||
                emp.emp_code?.toLowerCase().includes(query) ||
                emp.designation?.toLowerCase().includes(query) ||
                emp.department?.toLowerCase().includes(query)
            );
        }

        setFilteredData(data);

        const totalCTC = data.reduce((sum, emp) => sum + (emp.total_ctc || emp.annual_ctc || 0), 0);
        const totalGross = data.reduce((sum, emp) => sum + (emp.annual_gross || (emp.monthly_gross * 12) || 0), 0);
        const totalEmployer = data.reduce((sum, emp) => sum + (
            emp.employer_contributions_list?.reduce((s, c) => s + (c.amount || 0) * 12, 0) ||
            ((emp.pf_employer || 0) + (emp.gratuity || 0) + (emp.insurance || 0)) * 12
        ), 0);

        setSummary({
            totalEmployees: data.length,
            totalCTC: totalCTC,
            averageCTC: data.length > 0 ? Math.round(totalCTC / data.length) : 0,
            highestCTC: data.length > 0 ? Math.max(...data.map(emp => emp.total_ctc || emp.annual_ctc || 0)) : 0,
            lowestCTC: data.length > 0 ? Math.min(...data.map(emp => emp.total_ctc || emp.annual_ctc || 0)) : 0,
            totalGross,
            totalEmployerBenefits: totalEmployer
        });
    }, [ctcData, currentUser, viewMode, selectedEmployee, selectedDepartment, selectedDesignation, searchQuery]);

    const departments = useMemo(() => [...new Set(ctcData.map(emp => emp.department).filter(Boolean))], [ctcData]);
    const designations = useMemo(() => [...new Set(ctcData.map(emp => emp.designation).filter(Boolean))], [ctcData]);

    const handleViewDetails = (employee) => {
        setSelectedEmployeeData(employee);
        setShowPopup(true);
    };

    const handleDownloadStatement = (employee) => {
        const earningsList = employee.earnings_list || [];
        const deductionsList = employee.deductions_list || [];
        const employerList = employee.employer_contributions_list || [];

        const rows = [
            ["Cost To Company (CTC) Statement"],
            ["Employee Code", employee.emp_code],
            ["Employee Name", `"${employee.emp_name}"`],
            ["Designation", `"${employee.designation}"`],
            ["Department", `"${employee.department}"`],
            ["Structure", `"${employee.structure_name || employee.grade || ''}"`],
            ["Date of Joining", employee.doj],
            [],
            ["Earnings Component", "Monthly (INR)", "Annual (INR)"],
            ...earningsList.map(e => [`"${e.component_name || e.component_code}"`, e.amount || 0, (e.amount || 0) * 12]),
            ["Total Gross Earnings", employee.monthly_gross || 0, (employee.monthly_gross || 0) * 12],
            [],
            ["Deductions Component", "Monthly (INR)", "Annual (INR)"],
            ...deductionsList.map(d => [`"${d.component_name || d.component_code}"`, d.amount || 0, (d.amount || 0) * 12]),
            [],
            ["Employer Contributions (Benefits)", "Monthly (INR)", "Annual (INR)"],
            ...employerList.map(c => [`"${c.component_name || c.component_code}"`, c.amount || 0, (c.amount || 0) * 12]),
            [],
            ["Monthly CTC", employee.monthly_ctc || 0, employee.total_ctc || employee.annual_ctc || 0],
            ["Total Annual CTC", "", employee.total_ctc || employee.annual_ctc || 0]
        ];

        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CTC_Statement_${employee.emp_code}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportAll = () => {
        if (!filteredData || filteredData.length === 0) return;
        const headers = [
            "Employee Code", "Employee Name", "Designation", "Department", "Salary Structure", "Date of Joining",
            "Monthly Gross", "Annual Gross", "Monthly Employer Benefits", "Monthly CTC", "Total Annual CTC"
        ];
        const rows = filteredData.map(emp => {
            const employerMonthly = emp.employer_contributions_list?.reduce((s, c) => s + (c.amount || 0), 0) ||
                ((emp.pf_employer || 0) + (emp.gratuity || 0) + (emp.insurance || 0));
            return [
                emp.emp_code,
                `"${emp.emp_name}"`,
                `"${emp.designation}"`,
                `"${emp.department}"`,
                `"${emp.structure_name || emp.grade || ''}"`,
                emp.doj,
                emp.monthly_gross || 0,
                (emp.monthly_gross || 0) * 12,
                employerMonthly,
                emp.monthly_ctc || 0,
                emp.total_ctc || emp.annual_ctc || 0
            ];
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CTC_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getAvatarColor = (name = '') => {
        const colors = [
            'bg-indigo-100 text-indigo-700',
            'bg-emerald-100 text-emerald-700',
            'bg-blue-100 text-blue-700',
            'bg-purple-100 text-purple-700',
            'bg-amber-100 text-amber-700',
            'bg-teal-100 text-teal-700'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const ctcColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Detailed CTC Breakdown"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDownloadStatement(row)}
                        className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Download CTC Statement CSV"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            ),
            width: "90px"
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
                    <div className="text-xs text-gray-800 font-medium">{row.designation || '—'}</div>
                    <div className="text-[10px] text-gray-500">{row.department || '—'}</div>
                </div>
            )
        },
        {
            header: "Salary Structure",
            accessor: "structure_name",
            cell: row => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {row.structure_name || row.grade || 'Standard'}
                </span>
            )
        },
        {
            header: "Gross Salary (Mo)",
            accessor: "monthly_gross",
            cell: row => (
                <span className="text-xs font-semibold text-gray-800">
                    ₹{(row.monthly_gross || 0).toLocaleString('en-IN')}
                </span>
            )
        },
        {
            header: "Benefits (Mo)",
            cell: row => {
                const total = row.employer_contributions_list?.reduce((s, c) => s + (c.amount || 0), 0) ||
                    ((row.pf_employer || 0) + (row.gratuity || 0) + (row.insurance || 0));
                return (
                    <span className="text-xs font-medium text-purple-700">
                        ₹{total.toLocaleString('en-IN')}
                    </span>
                );
            }
        },
        {
            header: "Monthly CTC",
            accessor: "monthly_ctc",
            cell: row => (
                <span className="text-xs font-semibold text-indigo-700">
                    ₹{(row.monthly_ctc || 0).toLocaleString('en-IN')}
                </span>
            )
        },
        {
            header: "Annual CTC",
            accessor: "total_ctc",
            cell: row => (
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ₹{(row.total_ctc || row.annual_ctc || 0).toLocaleString('en-IN')}
                </span>
            )
        }
    ];

    const closePopup = () => {
        setShowPopup(false);
        setSelectedEmployeeData(null);
    };

    const showSpinner = internalLoading || isLoading?.spinner || isLoading === true;

    return (
        <div className="mb-5">
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Cost To Company (CTC) Directory
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Corporate compensation statements, annual cost breakdown, and employer statutory contribution audits.
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
                        onClick={fetchCtcData}
                        disabled={showSpinner}
                        className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                        title="Reload CTC data"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${showSpinner ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
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
                    selectedDepartment={selectedDepartment}
                    selectedDesignation={selectedDesignation}
                    selectedEmployee={selectedEmployee}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredData={filteredData}
                    departments={departments}
                    designations={designations}
                    ctcColumns={ctcColumns}
                    summary={summary}
                    handleExportAll={handleExportAll}
                />
            )}

            {showSpinner && <LoadingSpinner message="Calculating CTC records..." />}

            {showPopup && selectedEmployeeData && (
                <CtcReportViewPopUp
                    closePopup={closePopup}
                    selectedEmployeeData={selectedEmployeeData}
                />
            )}
        </div>
    )
}

export default CtcReportMain