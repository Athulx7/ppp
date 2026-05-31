import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Plus, Trash2, Edit, Download, X, ChevronRight } from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';

function LeaveSettingTest() {
    const navigate = useNavigate();
    const location = useLocation();

    const [viewMode, setViewMode] = useState('employee');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayFormat, setDisplayFormat] = useState('table');
    const [leaveAllocations, setLeaveAllocations] = useState([]);
    const [filteredAllocations, setFilteredAllocations] = useState([]);
    const [leaveMaster, setLeaveMaster] = useState([]);

    // Modal state
    const [modalEmployee, setModalEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Success message from navigation state
    const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

    // Dummy Data for Dropdowns
    const employees = [
        { emp_code: 'EMP001', emp_name: 'John Doe', designation: 'HR Manager', department: 'HR', employment_type: 'Permanent', doj: '2020-01-15' },
        { emp_code: 'EMP002', emp_name: 'Athul Krishna', designation: 'Junior Software Engineer', department: 'Engineering', employment_type: 'Permanent', doj: '2023-06-15' },
        { emp_code: 'EMP003', emp_name: 'Michael Chen', designation: 'Tech Lead', department: 'Engineering', employment_type: 'Permanent', doj: '2019-06-01' },
        { emp_code: 'EMP004', emp_name: 'Sarah Johnson', designation: 'Sales Manager', department: 'Sales', employment_type: 'Permanent', doj: '2020-11-20' },
        { emp_code: 'EMP005', emp_name: 'David Kumar', designation: 'Accountant', department: 'Finance', employment_type: 'Permanent', doj: '2022-02-15' },
        { emp_code: 'EMP006', emp_name: 'Priya Patel', designation: 'HR Executive', department: 'HR', employment_type: 'Contract', doj: '2022-08-01' },
        { emp_code: 'EMP007', emp_name: 'Robert Wilson', designation: 'Software Engineer', department: 'Engineering', employment_type: 'Probation', doj: '2023-01-10' },
        { emp_code: 'EMP008', emp_name: 'Lisa Wong', designation: 'Marketing Specialist', department: 'Marketing', employment_type: 'Permanent', doj: '2021-09-15' },
        { emp_code: 'EMP009', emp_name: 'Thomas Brown', designation: 'Sales Executive', department: 'Sales', employment_type: 'Intern', doj: '2023-03-20' },
        { emp_code: 'EMP010', emp_name: 'Amanda Lee', designation: 'Financial Analyst', department: 'Finance', employment_type: 'Permanent', doj: '2020-07-01' }
    ];

    const departments = [
        { value: 'HR', label: 'Human Resources' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' }
    ];

    const designations = [
        { value: 'HR Manager', label: 'HR Manager' },
        { value: 'HR Executive', label: 'HR Executive' },
        { value: 'Tech Lead', label: 'Tech Lead' },
        { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
        { value: 'Software Engineer', label: 'Software Engineer' },
        { value: 'Junior Software Engineer', label: 'Junior Software Engineer' },
        { value: 'Sales Manager', label: 'Sales Manager' },
        { value: 'Sales Executive', label: 'Sales Executive' },
        { value: 'Accountant', label: 'Accountant' },
        { value: 'Financial Analyst', label: 'Financial Analyst' },
        { value: 'Marketing Specialist', label: 'Marketing Specialist' }
    ];

    const employmentTypes = [
        { value: 'Permanent', label: 'Permanent' },
        { value: 'Contract', label: 'Contract' },
        { value: 'Probation', label: 'Probation' },
        { value: 'Intern', label: 'Intern' },
        { value: 'Part-time', label: 'Part-time' }
    ];

    // Leave Master Data
    useEffect(() => {
        const dummyLeaveMaster = [
            {
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                default_days: 12,
                carry_forward: true,
                max_carry_forward: 6,
                approvers: ['Manager', 'HR'],
                applicable_to: ['Permanent', 'Contract', 'Probation'],
                description: 'For urgent matters, personal work',
                color: 'bg-blue-100 text-blue-800'
            },
            {
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                default_days: 10,
                carry_forward: false,
                max_carry_forward: 0,
                approvers: ['Manager'],
                applicable_to: ['Permanent', 'Contract', 'Probation', 'Intern'],
                description: 'Medical emergencies, health issues',
                color: 'bg-green-100 text-green-800'
            },
            {
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                default_days: 18,
                carry_forward: true,
                max_carry_forward: 30,
                approvers: ['Manager', 'HR'],
                applicable_to: ['Permanent'],
                description: 'Accumulated leave based on working days',
                color: 'bg-purple-100 text-purple-800'
            },
            {
                leave_code: 'L004',
                leave_name: 'Maternity Leave',
                default_days: 180,
                carry_forward: false,
                max_carry_forward: 0,
                approvers: ['HR', 'Admin'],
                applicable_to: ['Permanent', 'Contract'],
                description: 'For female employees during childbirth',
                color: 'bg-pink-100 text-pink-800'
            },
            {
                leave_code: 'L005',
                leave_name: 'Paternity Leave',
                default_days: 15,
                carry_forward: false,
                max_carry_forward: 0,
                approvers: ['Manager', 'HR'],
                applicable_to: ['Permanent'],
                description: 'For male employees during childbirth',
                color: 'bg-indigo-100 text-indigo-800'
            },
            {
                leave_code: 'L006',
                leave_name: 'Bereavement Leave',
                default_days: 7,
                carry_forward: false,
                max_carry_forward: 0,
                approvers: ['Manager'],
                applicable_to: ['Permanent', 'Contract', 'Probation', 'Intern'],
                description: 'Death of immediate family member',
                color: 'bg-gray-100 text-gray-800'
            },
            {
                leave_code: 'L007',
                leave_name: 'Marriage Leave',
                default_days: 5,
                carry_forward: false,
                max_carry_forward: 0,
                approvers: ['Manager', 'HR'],
                applicable_to: ['Permanent', 'Contract'],
                description: 'For employee\'s own wedding',
                color: 'bg-yellow-100 text-yellow-800'
            },
            {
                leave_code: 'L008',
                leave_name: 'Compensatory Off',
                default_days: 0,
                carry_forward: true,
                max_carry_forward: 10,
                approvers: ['Manager'],
                applicable_to: ['Permanent', 'Contract', 'Probation'],
                description: 'For working on holidays/weekends',
                color: 'bg-orange-100 text-orange-800'
            }
        ];
        setLeaveMaster(dummyLeaveMaster);
    }, []);

    // Generate leave allocations for employees
    useEffect(() => {
        const generateAllocations = () => {
            const allocations = [];

            employees.forEach(emp => {
                const applicableLeaves = leaveMaster.filter(leave =>
                    leave.applicable_to.includes(emp.employment_type)
                );

                applicableLeaves.forEach(leave => {
                    allocations.push({
                        id: `${emp.emp_code}_${leave.leave_code}_2024`,
                        emp_code: emp.emp_code,
                        emp_name: emp.emp_name,
                        designation: emp.designation,
                        department: emp.department,
                        employment_type: emp.employment_type,
                        leave_code: leave.leave_code,
                        leave_name: leave.leave_name,
                        leave_color: leave.color,
                        allocated_days: leave.default_days,
                        used_days: Math.floor(Math.random() * (leave.default_days / 2)),
                        pending_days: 0,
                        valid_from: '2024-01-01',
                        valid_to: '2024-12-31',
                        carry_forward: leave.carry_forward,
                        status: 'active',
                        note: ''
                    });

                    if (leave.carry_forward && Math.random() > 0.5) {
                        const carriedDays = Math.floor(Math.random() * leave.max_carry_forward);
                        if (carriedDays > 0) {
                            allocations.push({
                                id: `${emp.emp_code}_${leave.leave_code}_2023_CF`,
                                emp_code: emp.emp_code,
                                emp_name: emp.emp_name,
                                designation: emp.designation,
                                department: emp.department,
                                employment_type: emp.employment_type,
                                leave_code: leave.leave_code,
                                leave_name: `${leave.leave_name} (Carried Forward)`,
                                leave_color: leave.color,
                                allocated_days: carriedDays,
                                used_days: 0,
                                pending_days: carriedDays,
                                valid_from: '2024-01-01',
                                valid_to: '2024-03-31',
                                carry_forward: false,
                                status: 'active',
                                note: 'Carried forward from 2023'
                            });
                        }
                    }
                });
            });

            allocations.forEach(alloc => {
                alloc.pending_days = alloc.allocated_days - alloc.used_days;
            });

            setLeaveAllocations(allocations);
            setFilteredAllocations(allocations);
        };

        if (leaveMaster.length > 0) {
            generateAllocations();
        }
    }, [leaveMaster]);

    // Filter allocations based on selections
    useEffect(() => {
        let filtered = [...leaveAllocations];

        if (viewMode === 'employee' && selectedEmployee) {
            filtered = filtered.filter(a => a.emp_code === selectedEmployee);
        } else if (viewMode === 'designation' && selectedDesignation) {
            filtered = filtered.filter(a => a.designation === selectedDesignation);
        } else if (viewMode === 'employment-type' && selectedEmploymentType) {
            filtered = filtered.filter(a => a.employment_type === selectedEmploymentType);
        }

        if (selectedDepartment) {
            filtered = filtered.filter(a => a.department === selectedDepartment);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.emp_name.toLowerCase().includes(query) ||
                a.emp_code.toLowerCase().includes(query) ||
                a.leave_name.toLowerCase().includes(query) ||
                a.designation.toLowerCase().includes(query)
            );
        }

        setFilteredAllocations(filtered);
    }, [leaveAllocations, viewMode, selectedEmployee, selectedDesignation, selectedEmploymentType, selectedDepartment, searchQuery]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // ─── Group allocations by employee ───────────────────────────────────────
    const getGroupedAllocations = useCallback(() => {
        const grouped = {};
        filteredAllocations.forEach(alloc => {
            if (!grouped[alloc.emp_code]) {
                grouped[alloc.emp_code] = {
                    emp_code: alloc.emp_code,
                    emp_name: alloc.emp_name,
                    designation: alloc.designation,
                    department: alloc.department,
                    employment_type: alloc.employment_type,
                    leaves: []
                };
            }
            grouped[alloc.emp_code].leaves.push(alloc);
        });

        return Object.values(grouped).map(emp => ({
            ...emp,
            totalAllocated: emp.leaves.reduce((s, l) => s + l.allocated_days, 0),
            totalUsed: emp.leaves.reduce((s, l) => s + l.used_days, 0),
            balance: emp.leaves.reduce((s, l) => s + l.pending_days, 0),
        }));
    }, [filteredAllocations]);

    const groupedAllocations = getGroupedAllocations();

    // ─── Modal helpers ────────────────────────────────────────────────────────
    const openModal = (empRow) => {
        setModalEmployee(empRow);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalEmployee(null);
    };

    const getInitials = (name) =>
        name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    const getEmpTypeBadgeClass = (type) => {
        const map = {
            Permanent: 'bg-green-100 text-green-800',
            Contract: 'bg-blue-100 text-blue-800',
            Probation: 'bg-yellow-100 text-yellow-800',
            Intern: 'bg-purple-100 text-purple-800',
            'Part-time': 'bg-gray-100 text-gray-800',
        };
        return map[type] || 'bg-gray-100 text-gray-800';
    };

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const getUniqueEmployees = () => {
        const unique = {};
        leaveAllocations.forEach(a => {
            if (!unique[a.emp_code]) {
                unique[a.emp_code] = { emp_code: a.emp_code, emp_name: a.emp_name };
            }
        });
        return Object.values(unique);
    };

    const handleAddAllocation = () => {
        navigate('/admin/leave-settings/add', { state: { mode: 'add' } });
    };

    const handleEditAllocation = (allocation) => {
        navigate('/admin/leave-settings/edit', { state: { mode: 'edit', allocation } });
    };

    const handleDeleteAllocation = (id) => {
        if (window.confirm('Are you sure you want to delete this leave allocation?')) {
            setLeaveAllocations(leaveAllocations.filter(a => a.id !== id));
        }
    };

    // ─── Grouped table columns (one row per employee) ─────────────────────────
    const groupedColumns = [
        {
            header: 'Actions',
            cell: row => (
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => handleEditAllocation(row)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => handleDeleteAllocation(row.emp_code)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={e => { e.stopPropagation(); openModal(row); }}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                        View <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            ),
            width: '120px'
        },
        {
            header: 'Employee',
            cell: row => (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-medium text-gray-900 text-sm">{row.emp_name}</div>
                        <div className="text-xs text-gray-500">{row.emp_code}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Department',
            accessor: 'department'
        },
        {
            header: 'Designation',
            accessor: 'designation'
        },
        {
            header: 'Employment Type',
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmpTypeBadgeClass(row.employment_type)}`}>
                    {row.employment_type}
                </span>
            )
        },
        {
            header: 'Leave Types',
            cell: row => (
                <div className="flex flex-wrap gap-1">
                    {row.leaves.slice(0, 2).map(l => (
                        <span
                            key={l.id}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.leave_color}`}
                        >
                            {l.leave_name}
                        </span>
                    ))}
                    {row.leaves.length > 2 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{row.leaves.length - 2} more
                        </span>
                    )}
                </div>
            )
        }
    ];

    // ─── Legacy per-row columns (kept for card view) ──────────────────────────
    const allocationColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditAllocation(row)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => handleDeleteAllocation(row.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ),
            width: "120px"
        },
        {
            header: "Employee",
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.emp_name}</div>
                    <div className="text-xs text-gray-500">{row.emp_code}</div>
                </div>
            )
        },
        { header: "Department", accessor: "department" },
        { header: "Designation", accessor: "designation" },
        {
            header: "Employment Type",
            accessor: "employment_type",
            cell: row => (
                <span className="px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                    {row.employment_type}
                </span>
            )
        },
        {
            header: "Leave Type",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.leave_color}`}>
                    {row.leave_name}
                </span>
            )
        },
        {
            header: "Allocated",
            accessor: "allocated_days",
            cell: row => <span className="font-medium">{row.allocated_days} days</span>
        },
        {
            header: "Used",
            accessor: "used_days",
            cell: row => <span className="text-orange-600">{row.used_days} days</span>
        },
        {
            header: "Pending",
            accessor: "pending_days",
            cell: row => {
                const percentage = (row.used_days / row.allocated_days) * 100;
                return (
                    <div>
                        <span className={`font-semibold ${row.pending_days < 3 ? 'text-red-600' : 'text-green-600'}`}>
                            {row.pending_days} days
                        </span>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
                            <div
                                className="h-1.5 bg-indigo-600 rounded-full"
                                style={{ width: `${Math.min(100, percentage)}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
        { header: "Valid From", accessor: "valid_from" },
        { header: "Valid To", accessor: "valid_to" },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.status}
                </span>
            )
        }
    ];

    const getSummaryStats = () => {
        const uniqueEmployees = new Set(filteredAllocations.map(a => a.emp_code));
        const totalAllocated = filteredAllocations.reduce((sum, a) => sum + a.allocated_days, 0);
        const totalUsed = filteredAllocations.reduce((sum, a) => sum + a.used_days, 0);
        const totalPending = filteredAllocations.reduce((sum, a) => sum + a.pending_days, 0);
        return {
            employees: uniqueEmployees.size,
            totalAllocated,
            totalUsed,
            totalPending,
            avgPerEmployee: (totalAllocated / (uniqueEmployees.size || 1)).toFixed(1)
        };
    };

    const stats = getSummaryStats();

    // ─── Modal summary for selected employee ─────────────────────────────────
    const modalStats = modalEmployee
        ? {
            totalAllocated: modalEmployee.totalAllocated,
            totalUsed: modalEmployee.totalUsed,
            balance: modalEmployee.balance,
            leaveCount: modalEmployee.leaves.length
        }
        : null;

    return (
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Leave Settings' }
                ]}
                title="Leave Allocation Settings"
                description="Configure leave allocations for employees based on various criteria"
                actions={
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddAllocation}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Allocation
                        </button>
                    </div>
                }
            />

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    {successMessage}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <CommonDropDown
                        label="Department"
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        options={[{ label: 'All Departments', value: '' }, ...departments]}
                        placeholder="Filter by Department"
                    />
                    <CommonDropDown
                        label="Designation"
                        value={selectedDesignation}
                        onChange={setSelectedDesignation}
                        options={[{ label: 'All Designations', value: '' }, ...designations]}
                        placeholder="Filter by Designation"
                    />
                    <CommonDropDown
                        label="Hierarchy Level"
                        value={selectedDesignation}
                        onChange={setSelectedDesignation}
                        options={[{ label: 'All Hierarchy Levels', value: '' }, ...designations]}
                        placeholder="Filter by Hierarchy Level"
                    />
                    <CommonDropDown
                        label="Employee Type"
                        value={selectedEmploymentType}
                        onChange={setSelectedEmploymentType}
                        options={[{ label: 'All', value: '' }, ...employmentTypes]}
                        placeholder="Filter by Employee Type"
                    />

                    {viewMode === 'employee' && (
                        <CommonDropDown
                            label="Employee"
                            value={selectedEmployee}
                            onChange={setSelectedEmployee}
                            options={[
                                { label: 'All Employees', value: '' },
                                ...getUniqueEmployees().map(e => ({ label: e.emp_name, value: e.emp_code }))
                            ]}
                            placeholder="Select Employee"
                        />
                    )}

                    <div className="flex items-end">
                        <button
                            onClick={() => {
                                setSelectedEmployee('');
                                setSelectedDesignation('');
                                setSelectedEmploymentType('');
                                setSelectedDepartment('');
                                setSearchQuery('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View — one row per employee */}
            {displayFormat === 'table' ? (
                <div>
                    <CommonTable
                        columns={groupedColumns}
                        data={groupedAllocations}
                        onRowClick={(row) => openModal(row)}
                        rowClassName="cursor-pointer hover:bg-indigo-50 transition-colors"
                        customHeader={
                            <div className="flex justify-between items-center w-full">
                                <div className="text-sm text-gray-500">
                                    {stats.employees} Employees &nbsp;|&nbsp;
                                    {stats.totalAllocated} Days Allocated &nbsp;|&nbsp;
                                    {stats.totalUsed} Days Used &nbsp;|&nbsp;
                                    {stats.totalPending} Days Pending &nbsp;|&nbsp;
                                    Avg {stats.avgPerEmployee} Days/Employee
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        }
                        itemsPerPage={10}
                        showSearch={false}
                        showPagination={true}
                    />
                </div>
            ) : (
                /* Card View — unchanged, uses flat allocations */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAllocations.map(allocation => (
                        <div key={allocation.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {allocation.emp_name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{allocation.emp_name}</div>
                                        <div className="text-xs text-gray-500">{allocation.emp_code}</div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${allocation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {allocation.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${allocation.leave_color}`}>
                                    {allocation.leave_name}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Department:</span>
                                    <span className="font-medium text-gray-900">{allocation.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Designation:</span>
                                    <span className="font-medium text-gray-900">{allocation.designation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEmpTypeBadgeClass(allocation.employment_type)}`}>
                                        {allocation.employment_type}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">Allocated</span>
                                    <span className="text-lg font-bold text-indigo-600">{allocation.allocated_days} days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Used:</span>
                                    <span className="font-medium text-orange-600">{allocation.used_days} days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Pending:</span>
                                    <span className={`font-semibold ${allocation.pending_days < 3 ? 'text-red-600' : 'text-green-600'}`}>
                                        {allocation.pending_days} days
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2">
                                    <div
                                        className="h-1.5 bg-indigo-600 rounded-full"
                                        style={{ width: `${(allocation.used_days / allocation.allocated_days) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Valid: {allocation.valid_from}</span>
                                    <span>to {allocation.valid_to}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => handleEditAllocation(allocation)}
                                    className="flex-1 px-3 py-1.5 text-xs border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center justify-center gap-1"
                                >
                                    <Edit className="w-3 h-3" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteAllocation(allocation.id)}
                                    className="flex-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Leave Detail Modal ──────────────────────────────────────────── */}
            {isModalOpen && modalEmployee && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                    {getInitials(modalEmployee.emp_name)}
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">{modalEmployee.emp_name}</h2>
                                    <p className="text-xs text-gray-500">
                                        {modalEmployee.emp_code} &nbsp;·&nbsp; {modalEmployee.designation} &nbsp;·&nbsp; {modalEmployee.department}
                                        &nbsp;·&nbsp;
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getEmpTypeBadgeClass(modalEmployee.employment_type)}`}>
                                            {modalEmployee.employment_type}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-gray-100">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <div className="text-xs text-gray-500 mb-1">Leave Types</div>
                                <div className="text-xl font-semibold text-gray-900">{modalStats.leaveCount}</div>
                            </div>
                            <div className="bg-indigo-50 rounded-xl p-3 text-center">
                                <div className="text-xs text-indigo-500 mb-1">Total Allocated</div>
                                <div className="text-xl font-semibold text-indigo-700">{modalStats.totalAllocated}</div>
                                <div className="text-xs text-indigo-400">days</div>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-3 text-center">
                                <div className="text-xs text-orange-500 mb-1">Total Used</div>
                                <div className="text-xl font-semibold text-orange-600">{modalStats.totalUsed}</div>
                                <div className="text-xs text-orange-400">days</div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <div className="text-xs text-green-500 mb-1">Balance</div>
                                <div className={`text-xl font-semibold ${modalStats.balance < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                    {modalStats.balance}
                                </div>
                                <div className="text-xs text-green-400">days</div>
                            </div>
                        </div>

                        {/* Leave Breakdown — scrollable */}
                        <div className="flex-1 overflow-y-auto scrollbar px-6 py-4">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Leave Breakdown</h3>
                            <div className="space-y-3">
                                {modalEmployee.leaves.map(leave => {
                                    const pct = leave.allocated_days > 0
                                        ? Math.min(100, Math.round((leave.used_days / leave.allocated_days) * 100))
                                        : 0;
                                    return (
                                        <div
                                            key={leave.id}
                                            className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                                        >
                                            {/* Leave name + validity */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${leave.leave_color}`}>
                                                        {leave.leave_name}
                                                    </span>
                                                    {leave.carry_forward && (
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                                                            Carry Forward
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {leave.valid_from} → {leave.valid_to}
                                                </span>
                                            </div>

                                            {/* Stats row */}
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                <div className="text-center">
                                                    <div className="text-base font-semibold text-gray-800">{leave.allocated_days}</div>
                                                    <div className="text-xs text-gray-400">Allocated</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-base font-semibold text-orange-500">{leave.used_days}</div>
                                                    <div className="text-xs text-gray-400">Used</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-base font-semibold ${leave.pending_days < 3 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {leave.pending_days}
                                                    </div>
                                                    <div className="text-xs text-gray-400">Balance</div>
                                                </div>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-1.5 bg-indigo-500 rounded-full transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                <span>{pct}% used</span>
                                                {leave.note && <span className="italic">{leave.note}</span>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { closeModal(); handleEditAllocation(modalEmployee); }}
                                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                            >
                                <Edit className="w-3.5 h-3.5" /> Edit Allocations
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaveSettingTest;