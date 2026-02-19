import React, { useState, useEffect } from 'react';
import {
    Save, X, Search, Users, Briefcase, User, Shield,
    ChevronRight, Check, Filter, RefreshCw, Calendar,
    Plus, Trash2, Edit, Copy, Award, Clock, AlertCircle,
    FileText, Settings, Grid, List, Download, Upload,
    PlusCircle, MinusCircle
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonInputField from '../basicComponents/CommonInputField';

function LeaveSettingTest() {
    const [viewMode, setViewMode] = useState('employee'); // 'employee', 'designation', 'employment-type'
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayFormat, setDisplayFormat] = useState('table'); // 'table', 'card'
    const [leaveAllocations, setLeaveAllocations] = useState([]);
    const [filteredAllocations, setFilteredAllocations] = useState([]);
    const [leaveMaster, setLeaveMaster] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState(null);
    
    // Multi-leave allocation state
    const [leaveSelections, setLeaveSelections] = useState([]);
    
    const [bulkAllocation, setBulkAllocation] = useState({
        leave_code: '',
        allocated_days: '',
        valid_from: '',
        valid_to: '',
        note: '',
        apply_to: 'all' // 'all', 'department', 'designation', 'employment-type'
    });

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
                // Determine which leaves are applicable based on employment type
                const applicableLeaves = leaveMaster.filter(leave => 
                    leave.applicable_to.includes(emp.employment_type)
                );
                
                // Create allocations for each applicable leave
                applicableLeaves.forEach(leave => {
                    // Add current year allocation
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
                    
                    // Add carry forward from previous year if applicable
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
            
            // Calculate pending days
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

    // Get unique values for filters
    const getUniqueEmployees = () => {
        const unique = {};
        leaveAllocations.forEach(a => {
            if (!unique[a.emp_code]) {
                unique[a.emp_code] = { emp_code: a.emp_code, emp_name: a.emp_name };
            }
        });
        return Object.values(unique);
    };

    // Initialize leave selections when employee is selected
    const initializeLeaveSelections = (employee) => {
        // Get applicable leaves for this employee's employment type
        const applicableLeaves = leaveMaster.filter(leave => 
            leave.applicable_to.includes(employee.employment_type)
        );
        
        // Create selection array with default values
        const selections = applicableLeaves.map(leave => ({
            leave_code: leave.leave_code,
            leave_name: leave.leave_name,
            leave_color: leave.color,
            default_days: leave.default_days,
            allocated_days: leave.default_days,
            valid_from: new Date().toISOString().split('T')[0],
            valid_to: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            carry_forward: leave.carry_forward,
            note: '',
            selected: true // Default selected
        }));
        
        setLeaveSelections(selections);
    };

    const handleAddAllocation = () => {
        if (!selectedEmployeeForModal) {
            alert('Please select an employee');
            return;
        }

        // Filter selected leaves
        const selectedLeaves = leaveSelections.filter(s => s.selected && s.allocated_days > 0);
        
        if (selectedLeaves.length === 0) {
            alert('Please select at least one leave type with allocated days');
            return;
        }

        // Create new allocations
        const newAllocations = selectedLeaves.map(selection => ({
            id: `${selectedEmployeeForModal.emp_code}_${selection.leave_code}_${Date.now()}_${Math.random()}`,
            emp_code: selectedEmployeeForModal.emp_code,
            emp_name: selectedEmployeeForModal.emp_name,
            designation: selectedEmployeeForModal.designation,
            department: selectedEmployeeForModal.department,
            employment_type: selectedEmployeeForModal.employment_type,
            leave_code: selection.leave_code,
            leave_name: selection.leave_name,
            leave_color: selection.leave_color,
            allocated_days: parseInt(selection.allocated_days),
            used_days: 0,
            pending_days: parseInt(selection.allocated_days),
            valid_from: selection.valid_from,
            valid_to: selection.valid_to,
            carry_forward: selection.carry_forward,
            status: 'active',
            note: selection.note || ''
        }));

        setLeaveAllocations([...leaveAllocations, ...newAllocations]);
        setShowAddModal(false);
        setSelectedEmployeeForModal(null);
        setLeaveSelections([]);
    };

    const handleBulkAllocation = () => {
        if (!bulkAllocation.leave_code || !bulkAllocation.allocated_days) {
            alert('Please fill all required fields');
            return;
        }

        const leave = leaveMaster.find(l => l.leave_code === bulkAllocation.leave_code);
        let targetEmployees = [];

        if (bulkAllocation.apply_to === 'all') {
            targetEmployees = employees;
        } else if (bulkAllocation.apply_to === 'department' && selectedDepartment) {
            targetEmployees = employees.filter(e => e.department === selectedDepartment);
        } else if (bulkAllocation.apply_to === 'designation' && selectedDesignation) {
            targetEmployees = employees.filter(e => e.designation === selectedDesignation);
        } else if (bulkAllocation.apply_to === 'employment-type' && selectedEmploymentType) {
            targetEmployees = employees.filter(e => e.employment_type === selectedEmploymentType);
        }

        // Filter employees by employment type applicability
        targetEmployees = targetEmployees.filter(emp => 
            leave.applicable_to.includes(emp.employment_type)
        );

        const newAllocations = targetEmployees.map(emp => ({
            id: `${emp.emp_code}_${bulkAllocation.leave_code}_${Date.now()}_${Math.random()}`,
            emp_code: emp.emp_code,
            emp_name: emp.emp_name,
            designation: emp.designation,
            department: emp.department,
            employment_type: emp.employment_type,
            leave_code: bulkAllocation.leave_code,
            leave_name: leave.leave_name,
            leave_color: leave.color,
            allocated_days: parseInt(bulkAllocation.allocated_days),
            used_days: 0,
            pending_days: parseInt(bulkAllocation.allocated_days),
            valid_from: bulkAllocation.valid_from || new Date().toISOString().split('T')[0],
            valid_to: bulkAllocation.valid_to || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            carry_forward: leave.carry_forward,
            status: 'active',
            note: bulkAllocation.note || `Bulk allocation for ${bulkAllocation.apply_to}`
        }));

        setLeaveAllocations([...leaveAllocations, ...newAllocations]);
        setShowBulkModal(false);
        setBulkAllocation({
            leave_code: '',
            allocated_days: '',
            valid_from: '',
            valid_to: '',
            note: '',
            apply_to: 'all'
        });
    };

    const handleDeleteAllocation = (id) => {
        if (window.confirm('Are you sure you want to delete this leave allocation?')) {
            setLeaveAllocations(leaveAllocations.filter(a => a.id !== id));
        }
    };

    const handleEditAllocation = (allocation) => {
        // Implement edit functionality
        alert('Edit functionality coming soon');
    };

    const updateLeaveSelection = (index, field, value) => {
        const updated = [...leaveSelections];
        updated[index][field] = value;
        setLeaveSelections(updated);
    };

    const toggleLeaveSelection = (index) => {
        const updated = [...leaveSelections];
        updated[index].selected = !updated[index].selected;
        setLeaveSelections(updated);
    };

    const selectAllLeaves = () => {
        const updated = leaveSelections.map(s => ({ ...s, selected: true }));
        setLeaveSelections(updated);
    };

    const deselectAllLeaves = () => {
        const updated = leaveSelections.map(s => ({ ...s, selected: false }));
        setLeaveSelections(updated);
    };

    // Table Columns
    const allocationColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditAllocation(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
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
                    <button
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Copy"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                </div>
            ),
            width: "100px"
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
        {
            header: "Department",
            accessor: "department"
        },
        {
            header: "Designation",
            accessor: "designation"
        },
        {
            header: "Employment Type",
            accessor: "employment_type",
            cell: row => {
                const colors = {
                    'Permanent': 'bg-green-100 text-green-800',
                    'Contract': 'bg-blue-100 text-blue-800',
                    'Probation': 'bg-yellow-100 text-yellow-800',
                    'Intern': 'bg-purple-100 text-purple-800',
                    'Part-time': 'bg-orange-100 text-orange-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.employment_type] || 'bg-gray-100'}`}>
                        {row.employment_type}
                    </span>
                );
            }
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
                        <span className={`font-semibold ${
                            row.pending_days < 3 ? 'text-red-600' : 'text-green-600'
                        }`}>
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
        {
            header: "Valid From",
            accessor: "valid_from"
        },
        {
            header: "Valid To",
            accessor: "valid_to"
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {row.status}
                </span>
            )
        }
    ];

    // Summary statistics
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

    return (
        <div className="p-6">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Leave Settings' }
                ]}
                title="Leave Allocation Settings"
                description="Configure leave allocations for employees based on various criteria"
            />

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-700">Manage leave allocations for employees</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Bulk Allocation
                    </button>
                    <button
                        onClick={() => {
                            setSelectedEmployeeForModal(null);
                            setLeaveSelections([]);
                            setShowAddModal(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Allocation
                    </button>
                </div>
            </div>

            {/* View Mode Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto p-2 gap-1 border-b">
                    <button
                        onClick={() => setViewMode('employee')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${
                            viewMode === 'employee'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <User className="w-4 h-4" />
                        Employee Wise
                    </button>
                    <button
                        onClick={() => setViewMode('designation')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${
                            viewMode === 'designation'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Designation Wise
                    </button>
                    <button
                        onClick={() => setViewMode('employment-type')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${
                            viewMode === 'employment-type'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Award className="w-4 h-4" />
                        Employment Type Wise
                    </button>
                </div>

                {/* Dynamic Filters based on view mode */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, code, leave..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <CommonDropDown
                        label="Department"
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        options={[
                            { label: 'All Departments', value: '' },
                            ...departments
                        ]}
                        placeholder="Filter by Department"
                    />

                    {viewMode === 'employee' && (
                        <CommonDropDown
                            label="Employee"
                            value={selectedEmployee}
                            onChange={setSelectedEmployee}
                            options={[
                                { label: 'All Employees', value: '' },
                                ...getUniqueEmployees().map(e => ({
                                    label: e.emp_name,
                                    value: e.emp_code
                                }))
                            ]}
                            placeholder="Select Employee"
                        />
                    )}

                    {viewMode === 'designation' && (
                        <CommonDropDown
                            label="Designation"
                            value={selectedDesignation}
                            onChange={setSelectedDesignation}
                            options={[
                                { label: 'All Designations', value: '' },
                                ...designations
                            ]}
                            placeholder="Select Designation"
                        />
                    )}

                    {viewMode === 'employment-type' && (
                        <CommonDropDown
                            label="Employment Type"
                            value={selectedEmploymentType}
                            onChange={setSelectedEmploymentType}
                            options={[
                                { label: 'All Types', value: '' },
                                ...employmentTypes
                            ]}
                            placeholder="Select Employment Type"
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm opacity-90">Employees</div>
                        <Users className="w-5 h-5 opacity-90" />
                    </div>
                    <div className="text-2xl font-bold">{stats.employees}</div>
                    <div className="text-xs opacity-75 mt-2">With leave allocations</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm opacity-90">Total Allocated</div>
                        <Calendar className="w-5 h-5 opacity-90" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalAllocated} days</div>
                    <div className="text-xs opacity-75 mt-2">Avg {stats.avgPerEmployee}/employee</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm opacity-90">Total Used</div>
                        <Clock className="w-5 h-5 opacity-90" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalUsed} days</div>
                    <div className="text-xs opacity-75 mt-2">{((stats.totalUsed / stats.totalAllocated) * 100).toFixed(1)}% utilized</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm opacity-90">Pending Balance</div>
                        <Award className="w-5 h-5 opacity-90" />
                    </div>
                    <div className="text-2xl font-bold">{stats.totalPending} days</div>
                    <div className="text-xs opacity-75 mt-2">Available to use</div>
                </div>
            </div>

            {/* Display Format Toggle */}
            <div className="flex justify-end gap-2 mb-4">
                <button
                    onClick={() => setDisplayFormat('table')}
                    className={`p-2 rounded-lg ${displayFormat === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Grid className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setDisplayFormat('card')}
                    className={`p-2 rounded-lg ${displayFormat === 'card' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            {/* Display Area */}
            {displayFormat === 'table' ? (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-gray-900">Leave Allocations</h2>
                            <p className="text-sm text-gray-500">
                                Showing {filteredAllocations.length} allocations
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                                <Upload className="w-4 h-4" />
                                Import
                            </button>
                        </div>
                    </div>
                    <CommonTable
                        columns={allocationColumns}
                        data={filteredAllocations}
                        itemsPerPage={10}
                        showSearch={false}
                        showPagination={true}
                    />
                </div>
            ) : (
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
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    allocation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
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
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        allocation.employment_type === 'Permanent' ? 'bg-green-100 text-green-800' :
                                        allocation.employment_type === 'Contract' ? 'bg-blue-100 text-blue-800' :
                                        allocation.employment_type === 'Probation' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
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
                                    <span className={`font-semibold ${
                                        allocation.pending_days < 3 ? 'text-red-600' : 'text-green-600'
                                    }`}>
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
                                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteAllocation(allocation.id)}
                                    className="flex-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedEmployeeForModal ? 'Allocate Multiple Leaves' : 'Select Employee First'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedEmployeeForModal(null);
                                    setLeaveSelections([]);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {!selectedEmployeeForModal ? (
                                <div className="space-y-4">
                                    <CommonDropDown
                                        label="Select Employee *"
                                        value={selectedEmployee}
                                        onChange={(val) => {
                                            const emp = employees.find(e => e.emp_code === val);
                                            setSelectedEmployeeForModal(emp);
                                            initializeLeaveSelections(emp);
                                        }}
                                        options={employees.map(e => ({
                                            label: `${e.emp_name} (${e.emp_code})`,
                                            value: e.emp_code,
                                            description: `${e.designation} - ${e.department} (${e.employment_type})`
                                        }))}
                                        placeholder="Choose an employee"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Employee Info */}
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {selectedEmployeeForModal.emp_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{selectedEmployeeForModal.emp_name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {selectedEmployeeForModal.emp_code} • {selectedEmployeeForModal.designation} • {selectedEmployeeForModal.department}
                                                </p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-white text-indigo-700 rounded-full text-xs font-medium">
                                                    {selectedEmployeeForModal.employment_type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bulk Actions */}
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-gray-900">Leave Types to Allocate</h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={selectAllLeaves}
                                                className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={deselectAllLeaves}
                                                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>

                                    {/* Leave Selection Table */}
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Leave Type</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Default Days</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Allocated Days</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Valid From</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Valid To</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Note</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {leaveSelections.map((selection, index) => (
                                                    <tr key={selection.leave_code} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={selection.selected}
                                                                onChange={() => toggleLeaveSelection(index)}
                                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${selection.leave_color}`}>
                                                                {selection.leave_name}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">{selection.default_days} days</td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="number"
                                                                value={selection.allocated_days}
                                                                onChange={(e) => updateLeaveSelection(index, 'allocated_days', e.target.value)}
                                                                disabled={!selection.selected}
                                                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                                min="0"
                                                                max="365"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="date"
                                                                value={selection.valid_from}
                                                                onChange={(e) => updateLeaveSelection(index, 'valid_from', e.target.value)}
                                                                disabled={!selection.selected}
                                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="date"
                                                                value={selection.valid_to}
                                                                onChange={(e) => updateLeaveSelection(index, 'valid_to', e.target.value)}
                                                                disabled={!selection.selected}
                                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input
                                                                type="text"
                                                                value={selection.note}
                                                                onChange={(e) => updateLeaveSelection(index, 'note', e.target.value)}
                                                                disabled={!selection.selected}
                                                                placeholder="Optional"
                                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Selected Leaves:</span>
                                            <span className="font-semibold text-indigo-600">
                                                {leaveSelections.filter(s => s.selected).length} types
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-gray-700">Total Days Allocated:</span>
                                            <span className="font-semibold text-indigo-600">
                                                {leaveSelections.filter(s => s.selected).reduce((sum, s) => sum + parseInt(s.allocated_days || 0), 0)} days
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedEmployeeForModal(null);
                                    setLeaveSelections([]);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            {selectedEmployeeForModal && (
                                <button
                                    onClick={handleAddAllocation}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Allocate {leaveSelections.filter(s => s.selected).length} Leave Types
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Allocation Modal - Multi-Leave Selection */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Bulk Leave Allocation</h3>
                            <button
                                onClick={() => setShowBulkModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apply to *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <label className={`p-3 border rounded-lg cursor-pointer ${
                                        bulkAllocation.apply_to === 'all' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="apply_to"
                                            value="all"
                                            checked={bulkAllocation.apply_to === 'all'}
                                            onChange={(e) => setBulkAllocation({...bulkAllocation, apply_to: e.target.value})}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Users className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium">All Employees</div>
                                        </div>
                                    </label>

                                    <label className={`p-3 border rounded-lg cursor-pointer ${
                                        bulkAllocation.apply_to === 'department' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="apply_to"
                                            value="department"
                                            checked={bulkAllocation.apply_to === 'department'}
                                            onChange={(e) => setBulkAllocation({...bulkAllocation, apply_to: e.target.value})}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Briefcase className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium">Department</div>
                                        </div>
                                    </label>

                                    <label className={`p-3 border rounded-lg cursor-pointer ${
                                        bulkAllocation.apply_to === 'designation' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="apply_to"
                                            value="designation"
                                            checked={bulkAllocation.apply_to === 'designation'}
                                            onChange={(e) => setBulkAllocation({...bulkAllocation, apply_to: e.target.value})}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Award className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium">Designation</div>
                                        </div>
                                    </label>

                                    <label className={`p-3 border rounded-lg cursor-pointer ${
                                        bulkAllocation.apply_to === 'employment-type' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="apply_to"
                                            value="employment-type"
                                            checked={bulkAllocation.apply_to === 'employment-type'}
                                            onChange={(e) => setBulkAllocation({...bulkAllocation, apply_to: e.target.value})}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <User className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium">Employment Type</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {bulkAllocation.apply_to === 'department' && (
                                <CommonDropDown
                                    label="Select Department *"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments}
                                    placeholder="Choose department"
                                />
                            )}

                            {bulkAllocation.apply_to === 'designation' && (
                                <CommonDropDown
                                    label="Select Designation *"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={designations}
                                    placeholder="Choose designation"
                                />
                            )}

                            {bulkAllocation.apply_to === 'employment-type' && (
                                <CommonDropDown
                                    label="Select Employment Type *"
                                    value={selectedEmploymentType}
                                    onChange={setSelectedEmploymentType}
                                    options={employmentTypes}
                                    placeholder="Choose employment type"
                                />
                            )}

                            <CommonDropDown
                                label="Leave Type *"
                                value={bulkAllocation.leave_code}
                                onChange={(val) => setBulkAllocation({...bulkAllocation, leave_code: val})}
                                options={leaveMaster.map(l => ({
                                    label: l.leave_name,
                                    value: l.leave_code,
                                    description: `${l.default_days} days default • Applicable to: ${l.applicable_to.join(', ')}`
                                }))}
                                placeholder="Select leave type"
                            />

                            <CommonInputField
                                label="Allocated Days *"
                                type="number"
                                value={bulkAllocation.allocated_days}
                                onChange={(e) => setBulkAllocation({...bulkAllocation, allocated_days: e.target.value})}
                                placeholder="Enter number of days"
                                min="0"
                                max="365"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <CommonDatePicker
                                    label="Valid From"
                                    value={bulkAllocation.valid_from}
                                    onChange={(val) => setBulkAllocation({...bulkAllocation, valid_from: val})}
                                    placeholder="Start date"
                                />
                                <CommonDatePicker
                                    label="Valid To"
                                    value={bulkAllocation.valid_to}
                                    onChange={(val) => setBulkAllocation({...bulkAllocation, valid_to: val})}
                                    placeholder="End date"
                                />
                            </div>

                            <CommonInputField
                                label="Note (Optional)"
                                value={bulkAllocation.note}
                                onChange={(e) => setBulkAllocation({...bulkAllocation, note: e.target.value})}
                                placeholder="Add any notes for this bulk allocation"
                            />

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Bulk Allocation Preview</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            This will allocate {bulkAllocation.allocated_days || '0'} days of {
                                                leaveMaster.find(l => l.leave_code === bulkAllocation.leave_code)?.leave_name || 'leave'
                                            } to all employees matching the selected criteria.
                                            Only employees with applicable employment type will receive this allocation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => setShowBulkModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkAllocation}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                Apply Bulk Allocation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaveSettingTest;