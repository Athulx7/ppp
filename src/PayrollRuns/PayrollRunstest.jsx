import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Wallet, Calendar, User, Briefcase,
    FileText, CheckCircle, XCircle, AlertCircle, Info,
    HelpCircle, Loader, ChevronRight, ChevronDown, Clock,
    DollarSign, Percent, CreditCard, Home, TrendingUp,
    Shield, ShieldCheck, Plus, Minus, Upload, Download,
    Eye, Edit, Trash2, Copy, Check, AlertTriangle,
    Building, Users, Settings, RefreshCw, Filter, Search,
    ThumbsUp, ThumbsDown, UserCheck, UserX, BarChart,
    PieChart, DownloadCloud, Printer, MessageSquare,
    Layers, Grid, List, Sliders, Play, Pause, StopCircle,
    Award, CalendarDays, Clock3, Banknote, Receipt,
    Calculator, Database, Server, HardDrive, Cloud,
    CheckSquare, Square, ChevronFirst, ChevronLast, XCircle as XIcon,
    ChevronUp, ChevronsUpDown, Clock4, Coffee, Moon,
    MinusCircle, Settings2, Gauge, Zap, TrendingUp as TrendUp
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonTable from '../basicComponents/commonTable';

function PayrollRun() {
    const navigate = useNavigate();

    // Current user (HR/Payroll Admin)
    const [currentUser, setCurrentUser] = useState({
        emp_code: 'ADMIN001',
        emp_name: 'John Admin',
        role: 'hr',
        designation: 'HR Manager',
        department: 'Human Resources'
    });

    // State for payroll run configuration
    const [payrollConfig, setPayrollConfig] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        pay_period: 'monthly',
        run_type: 'regular',
        payment_date: new Date().toISOString().split('T')[0],
        process_date: new Date().toISOString().split('T')[0]
    });

    // Filter states
    const [selectedView, setSelectedView] = useState('all');
    const [selectAll, setSelectAll] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showLopOtSettings, setShowLopOtSettings] = useState(false);
    const [filters, setFilters] = useState({
        departments: [],
        designations: [],
        employee_types: [],
        locations: [],
        bands: [],
        status: ['active']
    });

    // Accordion state for filter sections
    const [openFilterSections, setOpenFilterSections] = useState({
        departments: true,
        designations: false,
        employee_types: false,
        locations: false,
        bands: false,
        status: false
    });

    // LOP (Loss of Pay) data state
    const [lopData, setLopData] = useState({
        include_lop: true,
        min_lop_days: 0,
        max_lop_days: 30,
        lop_deduction_type: 'proportional', // 'proportional', 'fixed', 'percentage'
        lop_deduction_value: 0,
        exclude_lop_employees: []
    });

    // Overtime data state
    const [overtimeData, setOvertimeData] = useState({
        include_overtime: true,
        overtime_rate: 1.5, // 1.5x normal rate
        overtime_calculation: 'hourly', // 'hourly', 'daily', 'fixed'
        min_overtime_hours: 0,
        max_overtime_hours: 60,
        overtime_cap: 5000,
        exclude_overtime_employees: []
    });

    // Available filter options
    const filterOptions = {
        departments: [
            { value: 'Engineering', label: 'Engineering', count: 45 },
            { value: 'Sales', label: 'Sales', count: 32 },
            { value: 'Marketing', label: 'Marketing', count: 18 },
            { value: 'HR', label: 'Human Resources', count: 12 },
            { value: 'Finance', label: 'Finance', count: 15 },
            { value: 'Operations', label: 'Operations', count: 24 },
            { value: 'IT', label: 'IT Support', count: 8 },
            { value: 'Admin', label: 'Administration', count: 6 }
        ],
        designations: [
            { value: 'Software Engineer', label: 'Software Engineer', count: 28 },
            { value: 'Senior Software Engineer', label: 'Senior Software Engineer', count: 15 },
            { value: 'Tech Lead', label: 'Tech Lead', count: 8 },
            { value: 'Manager', label: 'Manager', count: 12 },
            { value: 'Sr. Manager', label: 'Senior Manager', count: 6 },
            { value: 'Director', label: 'Director', count: 4 },
            { value: 'VP', label: 'Vice President', count: 2 },
            { value: 'Associate', label: 'Associate', count: 22 },
            { value: 'Executive', label: 'Executive', count: 18 },
            { value: 'Analyst', label: 'Analyst', count: 14 }
        ],
        employee_types: [
            { value: 'permanent', label: 'Permanent', count: 98 },
            { value: 'contract', label: 'Contract', count: 42 },
            { value: 'intern', label: 'Intern', count: 15 },
            { value: 'probation', label: 'Probation', count: 8 },
            { value: 'consultant', label: 'Consultant', count: 12 },
            { value: 'trainee', label: 'Trainee', count: 10 }
        ],
        locations: [
            { value: 'bangalore', label: 'Bangalore', count: 85 },
            { value: 'mumbai', label: 'Mumbai', count: 42 },
            { value: 'delhi', label: 'Delhi', count: 28 },
            { value: 'pune', label: 'Pune', count: 35 },
            { value: 'hyderabad', label: 'Hyderabad', count: 30 },
            { value: 'chennai', label: 'Chennai', count: 22 }
        ],
        bands: [
            { value: 'E1', label: 'Entry Level (E1)', count: 35 },
            { value: 'E2', label: 'Junior (E2)', count: 48 },
            { value: 'E3', label: 'Mid Level (E3)', count: 42 },
            { value: 'M1', label: 'Manager (M1)', count: 18 },
            { value: 'M2', label: 'Senior Manager (M2)', count: 12 },
            { value: 'L1', label: 'Leadership (L1)', count: 6 }
        ],
        status: [
            { value: 'active', label: 'Active', count: 145 },
            { value: 'on_leave', label: 'On Leave', count: 12 },
            { value: 'resigned', label: 'Resigned', count: 8 },
            { value: 'hold', label: 'Hold', count: 5 }
        ]
    };

    // Dummy employee data
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [payrollSummary, setPayrollSummary] = useState({
        total_employees: 0,
        selected_count: 0,
        total_salary: 0,
        total_deductions: 0,
        net_payable: 0,
        employer_contribution: 0,
        by_department: {},
        by_type: {},
        total_lop_deductions: 0,
        total_overtime_pay: 0
    });

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [processingProgress, setProcessingProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [showRunModal, setShowRunModal] = useState(false);
    const [runConfig, setRunConfig] = useState({
        confirm: false,
        notify_employees: true,
        generate_payslips: true,
        post_to_accounting: false,
        release_payment: false,
        include_lop: true,
        include_overtime: true
    });

    // Toggle filter section
    const toggleFilterSection = (section) => {
        setOpenFilterSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Generate dummy employees
    useEffect(() => {
        const dummyEmployees = [];
        const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma', 'William', 'Olivia', 'James', 'Sophia', 'Thomas', 'Isabella', 'Richard', 'Mia', 'Joseph', 'Charlotte', 'Charles', 'Amelia'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

        for (let i = 1; i <= 185; i++) {
            const dept = filterOptions.departments[Math.floor(Math.random() * filterOptions.departments.length)];
            const desig = filterOptions.designations[Math.floor(Math.random() * filterOptions.designations.length)];
            const empType = filterOptions.employee_types[Math.floor(Math.random() * filterOptions.employee_types.length)];
            const location = filterOptions.locations[Math.floor(Math.random() * filterOptions.locations.length)];
            const band = filterOptions.bands[Math.floor(Math.random() * filterOptions.bands.length)];
            const status = Math.random() > 0.85 ?
                ['on_leave', 'resigned', 'hold'][Math.floor(Math.random() * 3)] :
                'active';

            const baseSalary = Math.floor(Math.random() * 150000) + 25000;
            const variablePay = Math.floor(baseSalary * (Math.random() * 0.3));

            // LOP days (Loss of Pay)
            const lopDays = status === 'active' ? Math.floor(Math.random() * 3) : 0;
            const lopDeduction = Math.floor((baseSalary / 30) * lopDays * 0.8); // 80% deduction for LOP

            // Overtime hours
            const overtimeHours = Math.random() > 0.6 ? Math.floor(Math.random() * 20) : 0;
            const overtimePay = Math.floor((baseSalary / 30 / 8) * 1.5 * overtimeHours); // 1.5x rate

            const deductions = Math.floor(baseSalary * (Math.random() * 0.15)) + lopDeduction;
            const netPay = baseSalary + variablePay - deductions + overtimePay;
            const employerPf = Math.floor(baseSalary * 0.12);
            const employerEsi = Math.floor(baseSalary * 0.0325);
            const gratuity = Math.floor(baseSalary * 0.0417);

            dummyEmployees.push({
                id: `EMP${String(i).padStart(3, '0')}`,
                name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                department: dept.value,
                department_label: dept.label,
                designation: desig.value,
                designation_label: desig.label,
                employee_type: empType.value,
                employee_type_label: empType.label,
                location: location.value,
                location_label: location.label,
                band: band.value,
                band_label: band.label,
                status: status,
                doj: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                bank_account: `XXXXXX${Math.floor(Math.random() * 10000)}`,
                ifsc: `HDFC${Math.floor(Math.random() * 100000)}`,
                pan: `ABCDE${Math.floor(Math.random() * 10000)}F`,
                uan: `${Math.floor(Math.random() * 1000000000)}`,

                // Salary components
                basic: Math.floor(baseSalary * 0.5),
                hra: Math.floor(baseSalary * 0.4),
                conveyance: 1600,
                medical: 1250,
                special: Math.floor(baseSalary * 0.1),
                variable_pay: variablePay,
                gross_salary: baseSalary + variablePay,

                // LOP Data
                lop_days: lopDays,
                lop_deduction: lopDeduction,

                // Overtime Data
                overtime_hours: overtimeHours,
                overtime_pay: overtimePay,

                // Deductions
                pf: Math.floor(baseSalary * 0.12),
                esi: Math.floor(baseSalary * 0.0075),
                professional_tax: Math.random() > 0.7 ? 200 : 0,
                tds: Math.floor(baseSalary * 0.05),
                loan_recovery: Math.random() > 0.8 ? Math.floor(Math.random() * 5000) : 0,
                advance_recovery: Math.random() > 0.7 ? Math.floor(Math.random() * 3000) : 0,
                other_deductions: deductions - lopDeduction,
                total_deductions: deductions,

                // Net
                net_pay: netPay,

                // Employer costs
                employer_pf: employerPf,
                employer_esi: employerEsi,
                employer_gratuity: gratuity,
                employer_mediclaim: Math.floor(baseSalary * 0.02),
                employer_bonus: Math.floor(baseSalary * 0.0833),
                employer_total: baseSalary + employerPf + employerEsi + gratuity + Math.floor(baseSalary * 0.02) + Math.floor(baseSalary * 0.0833),

                // Attendance
                working_days: 30,
                present_days: 28 + Math.floor(Math.random() * 3) - lopDays,
                absent_days: Math.floor(Math.random() * 2) + lopDays,
                leave_days: Math.floor(Math.random() * 3),

                // Selection
                selected: status === 'active' ? Math.random() > 0.2 : false
            });
        }

        setEmployees(dummyEmployees);
        setFilteredEmployees(dummyEmployees.filter(e => e.status === 'active'));

        // Calculate summary
        calculateSummary(dummyEmployees);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Apply filters
    useEffect(() => {
        if (!employees.length) return;

        let filtered = employees;

        // Department filter
        if (filters.departments && filters.departments.length > 0) {
            filtered = filtered.filter(e => filters.departments.includes(e.department));
        }

        // Designation filter
        if (filters.designations && filters.designations.length > 0) {
            filtered = filtered.filter(e => filters.designations.includes(e.designation));
        }

        // Employee type filter
        if (filters.employee_types && filters.employee_types.length > 0) {
            filtered = filtered.filter(e => filters.employee_types.includes(e.employee_type));
        }

        // Location filter
        if (filters.locations && filters.locations.length > 0) {
            filtered = filtered.filter(e => filters.locations.includes(e.location));
        }

        // Band filter
        if (filters.bands && filters.bands.length > 0) {
            filtered = filtered.filter(e => filters.bands.includes(e.band));
        }

        // Status filter
        if (filters.status && filters.status.length > 0) {
            filtered = filtered.filter(e => filters.status.includes(e.status));
        }

        // Apply LOP filter if needed
        if (lopData.min_lop_days > 0 || lopData.max_lop_days < 30) {
            filtered = filtered.filter(e =>
                e.lop_days >= lopData.min_lop_days &&
                e.lop_days <= lopData.max_lop_days
            );
        }

        // Apply Overtime filter if needed
        if (overtimeData.min_overtime_hours > 0 || overtimeData.max_overtime_hours < 60) {
            filtered = filtered.filter(e =>
                e.overtime_hours >= overtimeData.min_overtime_hours &&
                e.overtime_hours <= overtimeData.max_overtime_hours
            );
        }

        setFilteredEmployees(filtered);

        // Update select all based on filtered employees
        const allFilteredSelected = filtered.length > 0 && filtered.every(e => e.selected);
        setSelectAll(allFilteredSelected);
    }, [filters, employees, lopData, overtimeData]);

    // Calculate payroll summary
    const calculateSummary = (empList) => {
        if (!empList || !empList.length) {
            setPayrollSummary({
                total_employees: 0,
                selected_count: 0,
                total_salary: 0,
                total_deductions: 0,
                net_payable: 0,
                employer_contribution: 0,
                by_department: {},
                by_type: {},
                total_lop_deductions: 0,
                total_overtime_pay: 0
            });
            return;
        }

        const selected = empList.filter(e => e && e.selected);

        const totalSalary = selected.reduce((sum, e) => sum + (e.gross_salary || 0), 0);
        const totalDeductions = selected.reduce((sum, e) => sum + (e.total_deductions || 0), 0);
        const totalLopDeductions = selected.reduce((sum, e) => sum + (e.lop_deduction || 0), 0);
        const totalOvertimePay = selected.reduce((sum, e) => sum + (e.overtime_pay || 0), 0);
        const netPayable = selected.reduce((sum, e) => sum + (e.net_pay || 0), 0);
        const employerTotal = selected.reduce((sum, e) => sum + (e.employer_total || 0), 0);

        // By department
        const byDepartment = {};
        selected.forEach(e => {
            if (!e || !e.department) return;

            if (!byDepartment[e.department]) {
                byDepartment[e.department] = {
                    count: 0,
                    salary: 0,
                    deductions: 0,
                    net: 0,
                    lop_days: 0,
                    overtime_hours: 0
                };
            }
            byDepartment[e.department].count++;
            byDepartment[e.department].salary += e.gross_salary || 0;
            byDepartment[e.department].deductions += e.total_deductions || 0;
            byDepartment[e.department].net += e.net_pay || 0;
            byDepartment[e.department].lop_days += e.lop_days || 0;
            byDepartment[e.department].overtime_hours += e.overtime_hours || 0;
        });

        // By employee type
        const byType = {};
        selected.forEach(e => {
            if (!e || !e.employee_type) return;

            if (!byType[e.employee_type]) {
                byType[e.employee_type] = {
                    count: 0,
                    salary: 0
                };
            }
            byType[e.employee_type].count++;
            byType[e.employee_type].salary += e.gross_salary || 0;
        });

        setPayrollSummary({
            total_employees: empList.length,
            selected_count: selected.length,
            total_salary: totalSalary,
            total_deductions: totalDeductions,
            total_lop_deductions: totalLopDeductions,
            total_overtime_pay: totalOvertimePay,
            net_payable: netPayable,
            employer_contribution: employerTotal - totalSalary,
            by_department: byDepartment,
            by_type: byType
        });
    };

    // Handle select all
    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const updatedEmployees = employees.map(e => {
            if (filteredEmployees.some(fe => fe.id === e.id)) {
                return { ...e, selected: newSelectAll };
            }
            return e;
        });

        setEmployees(updatedEmployees);
        calculateSummary(updatedEmployees);
    };

    // Handle select employee
    const handleSelectEmployee = (empId) => {
        const updatedEmployees = employees.map(e =>
            e.id === empId ? { ...e, selected: !e.selected } : e
        );

        setEmployees(updatedEmployees);

        // Update select all
        const allFilteredSelected = filteredEmployees.length > 0 &&
            filteredEmployees.every(e =>
                updatedEmployees.find(ue => ue.id === e.id)?.selected
            );
        setSelectAll(allFilteredSelected);

        calculateSummary(updatedEmployees);
    };

    // Handle filter change
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            const currentValues = prev[filterType] ? [...prev[filterType]] : [];
            const index = currentValues.indexOf(value);

            if (index === -1) {
                currentValues.push(value);
            } else {
                currentValues.splice(index, 1);
            }

            return { ...prev, [filterType]: currentValues };
        });
    };

    // Handle bulk selection by filter
    const handleBulkSelect = (filterType, filterValue, select = true) => {
        const updatedEmployees = employees.map(e => {
            if (e[filterType] === filterValue) {
                return { ...e, selected: select };
            }
            return e;
        });

        setEmployees(updatedEmployees);

        // Update select all
        const allFilteredSelected = filteredEmployees.length > 0 &&
            filteredEmployees.every(e =>
                updatedEmployees.find(ue => ue.id === e.id)?.selected
            );
        setSelectAll(allFilteredSelected);

        calculateSummary(updatedEmployees);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            departments: [],
            designations: [],
            employee_types: [],
            locations: [],
            bands: [],
            status: ['active']
        });
    };

    // Reset LOP/OT settings to default
    const handleResetLopOt = () => {
        setLopData({
            include_lop: true,
            min_lop_days: 0,
            max_lop_days: 30,
            lop_deduction_type: 'proportional',
            lop_deduction_value: 0,
            exclude_lop_employees: []
        });
        setOvertimeData({
            include_overtime: true,
            overtime_rate: 1.5,
            overtime_calculation: 'hourly',
            min_overtime_hours: 0,
            max_overtime_hours: 60,
            overtime_cap: 5000,
            exclude_overtime_employees: []
        });
    };

    // Get active filter count
    const getActiveFilterCount = () => {
        return Object.values(filters).reduce((count, arr) => count + arr.length, 0);
    };

    // Get active LOP/OT settings count
    const getActiveLopOtCount = () => {
        let count = 0;
        if (lopData.min_lop_days > 0 || lopData.max_lop_days < 30) count++;
        if (lopData.lop_deduction_type !== 'proportional') count++;
        if (overtimeData.min_overtime_hours > 0 || overtimeData.max_overtime_hours < 60) count++;
        if (overtimeData.overtime_rate !== 1.5) count++;
        if (overtimeData.overtime_calculation !== 'hourly') count++;
        return count;
    };

    // Run payroll process
    const handleRunPayroll = () => {
        if (!runConfig.confirm) {
            alert('Please confirm to run payroll');
            return;
        }

        if (payrollSummary.selected_count === 0) {
            alert('No employees selected for payroll');
            return;
        }

        setIsProcessing(true);
        setProcessingStep('Validating employee data...');
        setProcessingProgress(10);

        // Simulate payroll processing steps
        const steps = [
            { progress: 20, message: 'Calculating earnings...' },
            { progress: 35, message: 'Processing LOP deductions...' },
            { progress: 50, message: 'Calculating overtime pay...' },
            { progress: 65, message: 'Applying loan recoveries...' },
            { progress: 80, message: 'Generating payslips...' },
            { progress: 95, message: 'Finalizing payroll...' }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                setProcessingProgress(step.progress);
                setProcessingStep(step.message);
            }, (index + 1) * 800);
        });

        setTimeout(() => {
            setIsProcessing(false);
            setShowRunModal(false);
            setShowPreview(true);

            // Generate preview data
            const preview = {
                run_id: `PR${payrollConfig.year}${String(payrollConfig.month + 1).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
                processed_on: new Date().toISOString(),
                processed_by: currentUser.emp_name,
                employees: payrollSummary.selected_count,
                total_gross: payrollSummary.total_salary,
                total_deductions: payrollSummary.total_deductions,
                total_lop_deductions: payrollSummary.total_lop_deductions,
                total_overtime_pay: payrollSummary.total_overtime_pay,
                net_payable: payrollSummary.net_payable,
                employer_cost: (payrollSummary.employer_contribution || 0) + payrollSummary.total_salary,
                bank_transfer_file: `payroll_${payrollConfig.year}_${payrollConfig.month + 1}.txt`,
                payslips_generated: payrollSummary.selected_count
            };

            setPreviewData(preview);
        }, 5000);
    };

    // Employee table columns
    const employeeColumns = [
        {
            header: "",
            cell: row => (
                <input
                    type="checkbox"
                    checked={row.selected || false}
                    onChange={() => handleSelectEmployee(row.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
            ),
            width: "40px"
        },
        {
            header: "Employee",
            cell: row => (
                <div>
                    <div className="font-medium text-sm">{row.name || ''}</div>
                    <div className="text-xs text-gray-500">{row.id || ''}</div>
                </div>
            )
        },
        {
            header: "Department",
            accessor: "department_label",
            cell: row => row.department_label || ''
        },
        {
            header: "Designation",
            accessor: "designation_label",
            cell: row => row.designation_label || ''
        },
        {
            header: "Type",
            cell: row => {
                const colors = {
                    'permanent': 'bg-green-100 text-green-800',
                    'contract': 'bg-blue-100 text-blue-800',
                    'intern': 'bg-purple-100 text-purple-800',
                    'probation': 'bg-yellow-100 text-yellow-800',
                    'consultant': 'bg-orange-100 text-orange-800',
                    'trainee': 'bg-indigo-100 text-indigo-800'
                };
                const colorClass = colors[row.employee_type] || 'bg-gray-100';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {row.employee_type_label || row.employee_type || ''}
                    </span>
                );
            }
        },
        {
            header: "Gross Salary",
            cell: row => row.gross_salary ? `₹${row.gross_salary.toLocaleString()}` : '₹0'
        },
        {
            header: "LOP Days",
            cell: row => (
                <span className={row.lop_days > 0 ? 'text-red-600 font-medium' : ''}>
                    {row.lop_days || 0}
                </span>
            )
        },
        {
            header: "OT Hours",
            cell: row => (
                <span className={row.overtime_hours > 0 ? 'text-green-600 font-medium' : ''}>
                    {row.overtime_hours || 0}
                </span>
            )
        },
        {
            header: "Deductions",
            cell: row => row.total_deductions ? `₹${row.total_deductions.toLocaleString()}` : '₹0'
        },
        {
            header: "Net Pay",
            cell: row => (
                <span className="font-semibold text-indigo-600">
                    {row.net_pay ? `₹${row.net_pay.toLocaleString()}` : '₹0'}
                </span>
            )
        },
        {
            header: "Status",
            cell: row => {
                const colors = {
                    'active': 'bg-green-100 text-green-800',
                    'on_leave': 'bg-yellow-100 text-yellow-800',
                    'resigned': 'bg-red-100 text-red-800',
                    'hold': 'bg-gray-100 text-gray-800'
                };
                const colorClass = colors[row.status] || 'bg-gray-100';
                const statusText = row.status ? row.status.replace('_', ' ').toUpperCase() : '';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {statusText}
                    </span>
                );
            }
        }
    ];

    // Filter Panel Component with Accordion
    const FilterPanel = () => (
        <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-4 max-h-[500px] overflow-y-auto scrollbar">
            <div className="flex items-center justify-between mb-4 sticky top-1 bg-white pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    Filters
                </h3>
                <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                >
                    <XIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Quick Actions */}
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-xs font-medium text-indigo-700 mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleSelectAll()}
                        className="px-2 py-1.5 bg-white text-indigo-600 text-xs rounded border border-indigo-200 hover:bg-indigo-100"
                    >
                        {selectAll ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={() => setSelectedView('selected')}
                        className="px-2 py-1.5 bg-white text-indigo-600 text-xs rounded border border-indigo-200 hover:bg-indigo-100"
                    >
                        View Selected
                    </button>
                </div>
            </div>

            {/* Active Filters Summary */}
            {getActiveFilterCount() > 0 && (
                <div className="mb-4 p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-700">
                            {getActiveFilterCount()} active filters
                        </span>
                        <button
                            onClick={handleClearFilters}
                            className="text-xs text-yellow-700 hover:text-yellow-800 underline"
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}

            {/* Department Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('departments')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Department</span>
                    <div className="flex items-center gap-2">
                        {filters.departments.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.departments.length}
                            </span>
                        )}
                        {openFilterSections.departments ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.departments && (
                    <div className="p-3 space-y-2 max-h-48 overflow-y-auto scrollbar">
                        {filterOptions.departments.map(dept => (
                            <label key={dept.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.departments?.includes(dept.value) || false}
                                        onChange={() => handleFilterChange('departments', dept.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{dept.label}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">{dept.count}</span>
                                    <button
                                        onClick={() => handleBulkSelect('department', dept.value, true)}
                                        className="text-xs text-indigo-600 hover:text-indigo-800"
                                        title="Select all in this department"
                                    >
                                        <CheckSquare className="w-3 h-3" />
                                    </button>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Designation Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('designations')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Designation</span>
                    <div className="flex items-center gap-2">
                        {filters.designations.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.designations.length}
                            </span>
                        )}
                        {openFilterSections.designations ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.designations && (
                    <div className="p-3 space-y-2 max-h-48 overflow-y-auto scrollbar">
                        {filterOptions.designations.map(des => (
                            <label key={des.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.designations?.includes(des.value) || false}
                                        onChange={() => handleFilterChange('designations', des.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{des.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{des.count}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Employee Type Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('employee_types')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Employee Type</span>
                    <div className="flex items-center gap-2">
                        {filters.employee_types.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.employee_types.length}
                            </span>
                        )}
                        {openFilterSections.employee_types ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.employee_types && (
                    <div className="p-3 space-y-2">
                        {filterOptions.employee_types.map(type => (
                            <label key={type.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.employee_types?.includes(type.value) || false}
                                        onChange={() => handleFilterChange('employee_types', type.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{type.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{type.count}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Location Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('locations')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Location</span>
                    <div className="flex items-center gap-2">
                        {filters.locations.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.locations.length}
                            </span>
                        )}
                        {openFilterSections.locations ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.locations && (
                    <div className="p-3 space-y-2">
                        {filterOptions.locations.map(loc => (
                            <label key={loc.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.locations?.includes(loc.value) || false}
                                        onChange={() => handleFilterChange('locations', loc.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{loc.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{loc.count}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Band Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('bands')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Grade/Band</span>
                    <div className="flex items-center gap-2">
                        {filters.bands.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.bands.length}
                            </span>
                        )}
                        {openFilterSections.bands ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.bands && (
                    <div className="p-3 space-y-2">
                        {filterOptions.bands.map(band => (
                            <label key={band.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.bands?.includes(band.value) || false}
                                        onChange={() => handleFilterChange('bands', band.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{band.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{band.count}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Status Filter - Accordion */}
            <div className="mb-3 border border-gray-300 rounded-lg overflow-hidden">
                <button
                    onClick={() => toggleFilterSection('status')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="font-medium text-sm text-gray-700">Status</span>
                    <div className="flex items-center gap-2">
                        {filters.status.length > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                {filters.status.length}
                            </span>
                        )}
                        {openFilterSections.status ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>
                {openFilterSections.status && (
                    <div className="p-3 space-y-2">
                        {filterOptions.status.map(st => (
                            <label key={st.value} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.status?.includes(st.value) || false}
                                        onChange={() => handleFilterChange('status', st.value)}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{st.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">{st.count}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Summary */}
            <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">
                    Showing {filteredEmployees.length} employees
                </p>
                <button
                    onClick={handleClearFilters}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );

    // LOP/OT Settings Panel
    const LopOtSettingsPanel = () => (
        <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-4 max-h-[500px] overflow-y-auto scrollbar">
            <div className="flex items-center justify-between mb-4 sticky top-1 bg-white pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    LOP & Overtime Settings
                </h3>
                <button
                    onClick={() => setShowLopOtSettings(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                >
                    <XIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Active Settings Summary */}
            {getActiveLopOtCount() > 0 && (
                <div className="mb-4 p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-yellow-700">
                            {getActiveLopOtCount()} active settings
                        </span>
                        <button
                            onClick={handleResetLopOt}
                            className="text-xs text-yellow-700 hover:text-yellow-800 underline"
                        >
                            Reset to default
                        </button>
                    </div>
                </div>
            )}

            {/* LOP Section */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <MinusCircle className="w-4 h-4 text-red-500" />
                    Loss of Pay (LOP) Settings
                </h4>
                <div className="space-y-3 pl-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={lopData.include_lop}
                            onChange={(e) => setLopData({ ...lopData, include_lop: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Include LOP in payroll calculation</span>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Min LOP Days</label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={lopData.min_lop_days}
                                onChange={(e) => setLopData({ ...lopData, min_lop_days: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Max LOP Days</label>
                            <input
                                type="number"
                                min="0"
                                max="30"
                                value={lopData.max_lop_days}
                                onChange={(e) => setLopData({ ...lopData, max_lop_days: parseInt(e.target.value) || 30 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Deduction Type</label>
                        <select
                            value={lopData.lop_deduction_type}
                            onChange={(e) => setLopData({ ...lopData, lop_deduction_type: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                            <option value="proportional">Proportional (1 day = 1/30 of monthly)</option>
                            <option value="fixed">Fixed Amount per day</option>
                            <option value="percentage">Percentage of Basic per day</option>
                        </select>
                    </div>

                    {lopData.lop_deduction_type !== 'proportional' && (
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">
                                {lopData.lop_deduction_type === 'fixed' ? 'Fixed Deduction per day (₹)' : 'Deduction Percentage per day (%)'}
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={lopData.lop_deduction_value}
                                onChange={(e) => setLopData({ ...lopData, lop_deduction_value: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    )}

                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Current:</span>{' '}
                        {lopData.include_lop ? 'Including' : 'Excluding'} LOP |
                        Days: {lopData.min_lop_days}-{lopData.max_lop_days} |
                        Type: {lopData.lop_deduction_type}
                    </div>
                </div>
            </div>

            {/* Overtime Section */}
            <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Clock4 className="w-4 h-4 text-green-500" />
                    Overtime Settings
                </h4>
                <div className="space-y-3 pl-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={overtimeData.include_overtime}
                            onChange={(e) => setOvertimeData({ ...overtimeData, include_overtime: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Include Overtime in payroll calculation</span>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Min OT Hours</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                value={overtimeData.min_overtime_hours}
                                onChange={(e) => setOvertimeData({ ...overtimeData, min_overtime_hours: parseInt(e.target.value) || 0 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Max OT Hours</label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                value={overtimeData.max_overtime_hours}
                                onChange={(e) => setOvertimeData({ ...overtimeData, max_overtime_hours: parseInt(e.target.value) || 60 })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Overtime Rate (x normal pay)</label>
                        <input
                            type="number"
                            min="1"
                            max="3"
                            step="0.1"
                            value={overtimeData.overtime_rate}
                            onChange={(e) => setOvertimeData({ ...overtimeData, overtime_rate: parseFloat(e.target.value) || 1.5 })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Calculation Method</label>
                        <select
                            value={overtimeData.overtime_calculation}
                            onChange={(e) => setOvertimeData({ ...overtimeData, overtime_calculation: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                            <option value="hourly">Hourly Rate</option>
                            <option value="daily">Daily Rate</option>
                            <option value="fixed">Fixed Amount per hour</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Maximum Overtime Pay (₹ per month)</label>
                        <input
                            type="number"
                            min="0"
                            value={overtimeData.overtime_cap}
                            onChange={(e) => setOvertimeData({ ...overtimeData, overtime_cap: parseInt(e.target.value) || 0 })}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Current:</span>{' '}
                        {overtimeData.include_overtime ? 'Including' : 'Excluding'} OT |
                        Hours: {overtimeData.min_overtime_hours}-{overtimeData.max_overtime_hours} |
                        Rate: {overtimeData.overtime_rate}x
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <button
                    onClick={handleResetLopOt}
                    className="w-full px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
                >
                    Reset to Default Settings
                </button>
            </div>
        </div>
    );

    // Table Controls Component (passed to CommonTable)
    const tableControls = (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
                <button
                    onClick={() => setSelectedView('all')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${selectedView === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setSelectedView('selected')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${selectedView === 'selected'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Selected ({payrollSummary.selected_count || 0})
                </button>
                <button
                    onClick={() => setSelectedView('excluded')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${selectedView === 'excluded'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Excluded
                </button>
            </div>
        </div>
    );

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen pb-32">
            <Breadcrumb
                items={[
                    { label: 'Payroll', to: '/payroll' },
                    { label: 'Run Payroll' }
                ]}
                title="Run Payroll"
                description="Process monthly payroll with multi-level filtering and selection"
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setShowLopOtSettings(!showLopOtSettings);
                                setShowFilters(false);
                            }}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 relative ${showLopOtSettings ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            title="LOP & Overtime Settings"
                        >
                            <Settings2 className="w-4 h-4" />
                            <span className="hidden sm:inline">LOP/OT Settings</span>
                            {getActiveLopOtCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getActiveLopOtCount()}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setShowFilters(!showFilters);
                                setShowLopOtSettings(false);
                            }}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 relative ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            title="Toggle filters"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {getActiveFilterCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getActiveFilterCount()}
                                </span>
                            )}
                        </button>
                    </div>
                }
            />

            {/* Filter Panel */}
            {showFilters && (
                <div className="absolute top-32 right-4 z-50 w-80 md:w-96">
                    <FilterPanel />
                </div>
            )}

            {/* LOP/OT Settings Panel */}
            {showLopOtSettings && (
                <div className="absolute top-32 right-4 z-50 w-80 md:w-96">
                    <LopOtSettingsPanel />
                </div>
            )}

            {/* Stats Cards with LOP and Overtime */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">{payrollSummary.total_employees || 0}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Selected</p>
                            <p className="text-lg font-bold text-indigo-600">{payrollSummary.selected_count || 0}</p>
                        </div>
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Gross</p>
                            <p className="text-lg font-bold text-gray-900">₹{((payrollSummary.total_salary || 0) / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">LOP</p>
                            <p className="text-lg font-bold text-red-600">₹{((payrollSummary.total_lop_deductions || 0) / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Minus className="w-4 h-4 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">OT</p>
                            <p className="text-lg font-bold text-green-600">₹{((payrollSummary.total_overtime_pay || 0) / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Clock4 className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Net</p>
                            <p className="text-lg font-bold text-purple-600">₹{((payrollSummary.net_payable || 0) / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Banknote className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Cost</p>
                            <p className="text-lg font-bold text-orange-600">₹{(((payrollSummary.employer_contribution || 0) + (payrollSummary.total_salary || 0)) / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Building className="w-4 h-4 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Single Column with Table */}
            <div className="bg-white rounded-xl shadow-sm relative">
                {/* Employee Table with Integrated Filters */}
                <div className="relative">
                    <CommonTable
                        columns={employeeColumns}
                        data={filteredEmployees.filter(e => {
                            if (selectedView === 'selected') return e.selected;
                            if (selectedView === 'excluded') return !e.selected;
                            return true;
                        })}
                        itemsPerPage={10}
                        showSearch={true}
                        showPagination={true}
                        tableControls={tableControls}
                        searchPlaceholder="Search employees..."
                    />
                </div>
            </div>

            {/* Bottom Action Bar - Responsive */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 md:p-4 z-40">
                <div className="max-w-7xl mx-auto">
                    {/* Mobile View */}
                    <div className="block md:hidden">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-600">
                                        {payrollSummary.selected_count || 0} selected
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Net:</span>
                                    <span className="text-sm font-bold text-indigo-600">
                                        ₹{(payrollSummary.net_payable || 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-red-600">LOP: -₹{(payrollSummary.total_lop_deductions || 0).toLocaleString()}</span>
                                <span className="text-green-600">OT: +₹{(payrollSummary.total_overtime_pay || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <CommonDropDown
                                    label=""
                                    value={payrollConfig.month}
                                    onChange={(val) => setPayrollConfig({ ...payrollConfig, month: parseInt(val) })}
                                    options={monthNames.map((m, i) => ({ label: m.substring(0, 3), value: i }))}
                                    placeholder="Month"
                                    theme="light"
                                    className="flex-1"
                                />
                                <CommonDropDown
                                    label=""
                                    value={payrollConfig.run_type}
                                    onChange={(val) => setPayrollConfig({ ...payrollConfig, run_type: val })}
                                    options={[
                                        { value: 'regular', label: 'Regular' },
                                        { value: 'supplementary', label: 'Supp.' },
                                        { value: 'bonus', label: 'Bonus' }
                                    ]}
                                    placeholder="Type"
                                    theme="light"
                                    className="flex-1"
                                />
                                <button
                                    onClick={() => setShowRunModal(true)}
                                    disabled={!payrollSummary.selected_count || payrollSummary.selected_count === 0}
                                    className={`px-3 py-2 rounded-lg text-white text-xs flex items-center gap-1 ${!payrollSummary.selected_count || payrollSummary.selected_count === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    <Play className="w-3 h-3" />
                                    Run
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-600">
                                    {payrollSummary.selected_count || 0} employees selected
                                </span>
                            </div>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div className="text-sm">
                                <span className="text-gray-500">Net Payable:</span>
                                <span className="ml-2 font-bold text-indigo-600">
                                    ₹{(payrollSummary.net_payable || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500">LOP:</span>
                                <span className="ml-2 font-medium text-red-600">
                                    -₹{(payrollSummary.total_lop_deductions || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm">
                                <span className="text-gray-500">OT:</span>
                                <span className="ml-2 font-medium text-green-600">
                                    +₹{(payrollSummary.total_overtime_pay || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CommonDropDown
                                label=""
                                value={payrollConfig.month}
                                onChange={(val) => setPayrollConfig({ ...payrollConfig, month: parseInt(val) })}
                                options={monthNames.map((m, i) => ({ label: m, value: i }))}
                                placeholder="Month"
                                theme="light"
                                className="w-32"
                            />
                            <CommonDropDown
                                label=""
                                value={payrollConfig.run_type}
                                onChange={(val) => setPayrollConfig({ ...payrollConfig, run_type: val })}
                                options={[
                                    { value: 'regular', label: 'Regular Payroll' },
                                    { value: 'supplementary', label: 'Supplementary' },
                                    { value: 'bonus', label: 'Bonus Run' },
                                    { value: 'off-cycle', label: 'Off-Cycle' }
                                ]}
                                placeholder="Run Type"
                                theme="light"
                                className="w-36"
                            />
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm whitespace-nowrap">
                                Save Draft
                            </button>
                            <button
                                onClick={() => setShowRunModal(true)}
                                disabled={!payrollSummary.selected_count || payrollSummary.selected_count === 0}
                                className={`px-6 py-2 rounded-lg text-white text-sm flex items-center gap-2 whitespace-nowrap ${!payrollSummary.selected_count || payrollSummary.selected_count === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                <Play className="w-4 h-4" />
                                Run Payroll
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Run Payroll Modal */}
            {showRunModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <Play className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Run Payroll</h3>
                                    <p className="text-sm text-gray-500">
                                        {monthNames[payrollConfig.month] || ''} {payrollConfig.year} - {payrollSummary.selected_count || 0} employees
                                    </p>
                                </div>
                            </div>

                            {/* LOP and Overtime Summary */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-500">LOP Deductions:</span>
                                        <span className="ml-1 font-medium text-red-600">₹{(payrollSummary.total_lop_deductions || 0).toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Overtime Pay:</span>
                                        <span className="ml-1 font-medium text-green-600">₹{(payrollSummary.total_overtime_pay || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Simulation */}
                            {isProcessing ? (
                                <div className="py-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                                        <span className="text-sm text-gray-700">{processingStep}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 rounded-full h-2 transition-all duration-500"
                                            style={{ width: `${processingProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">{processingProgress}% complete</p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-medium text-gray-700 mb-3">Payroll Summary</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-500">Total Gross</p>
                                                <p className="font-medium">₹{(payrollSummary.total_salary || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">LOP Deductions</p>
                                                <p className="font-medium text-red-600">-₹{(payrollSummary.total_lop_deductions || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Overtime Pay</p>
                                                <p className="font-medium text-green-600">+₹{(payrollSummary.total_overtime_pay || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Other Deductions</p>
                                                <p className="font-medium text-red-600">-₹{((payrollSummary.total_deductions || 0) - (payrollSummary.total_lop_deductions || 0)).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Net Payable</p>
                                                <p className="font-bold text-indigo-600">₹{(payrollSummary.net_payable || 0).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Employer Cost</p>
                                                <p className="font-medium">₹{((payrollSummary.employer_contribution || 0) + (payrollSummary.total_salary || 0)).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="space-y-3 mb-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={runConfig.notify_employees}
                                                onChange={(e) => setRunConfig({ ...runConfig, notify_employees: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-700">Notify employees after processing</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={runConfig.generate_payslips}
                                                onChange={(e) => setRunConfig({ ...runConfig, generate_payslips: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-700">Generate payslips</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={runConfig.post_to_accounting}
                                                onChange={(e) => setRunConfig({ ...runConfig, post_to_accounting: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-700">Post to accounting system</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={runConfig.release_payment}
                                                onChange={(e) => setRunConfig({ ...runConfig, release_payment: e.target.checked })}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                            />
                                            <span className="text-sm text-gray-700">Release payment (bank transfer)</span>
                                        </label>
                                        <div className="border-t pt-3 mt-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={runConfig.confirm}
                                                    onChange={(e) => setRunConfig({ ...runConfig, confirm: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    I confirm that I have verified all employee data
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowRunModal(false);
                                        setIsProcessing(false);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Cancel
                                </button>
                                {!isProcessing && (
                                    <button
                                        onClick={handleRunPayroll}
                                        disabled={!runConfig.confirm}
                                        className={`px-4 py-2 text-white rounded-lg text-sm ${runConfig.confirm
                                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Process Payroll
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && previewData && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Payroll Processed Successfully</h3>
                                        <p className="text-sm text-gray-500">Run ID: {previewData.run_id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 text-white mb-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-green-100 text-xs">Net Payable</p>
                                        <p className="text-2xl font-bold">₹{((previewData.net_payable || 0) / 100000).toFixed(2)}L</p>
                                    </div>
                                    <div>
                                        <p className="text-green-100 text-xs">Employees</p>
                                        <p className="text-2xl font-bold">{previewData.employees || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Processed On</p>
                                    <p className="text-sm font-medium">{previewData.processed_on ? new Date(previewData.processed_on).toLocaleString() : ''}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Processed By</p>
                                    <p className="text-sm font-medium">{previewData.processed_by || ''}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Payslips Generated</p>
                                    <p className="text-sm font-medium">{previewData.payslips_generated || 0}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Bank File</p>
                                    <p className="text-sm font-medium text-indigo-600">{previewData.bank_transfer_file || ''}</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Close
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayrollRun;