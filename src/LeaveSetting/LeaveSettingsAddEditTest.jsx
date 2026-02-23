import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Users, Briefcase, User, Award, Layers } from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';

function LeaveSettingsAddEditTest() {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, employee, allocation } = location.state || { mode: 'add' };

    const [activeTab, setActiveTab] = useState('single'); // 'single', 'bulk'
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [leaveSelections, setLeaveSelections] = useState([]);

    const [bulkAllocation, setBulkAllocation] = useState({
        apply_to: 'all',
        department: '',
        designation: '',
        employment_type: '',
        valid_from: '',
        valid_to: '',
        note: ''
    });

    const [bulkLeaveSelections, setBulkLeaveSelections] = useState([]);

    const [leaveMaster, setLeaveMaster] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employmentTypes, setEmploymentTypes] = useState([]);

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

        initializeBulkLeaveSelections(dummyLeaveMaster);

        const dummyEmployees = [
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
        setEmployees(dummyEmployees);

        // Dummy Departments
        setDepartments([
            { value: 'HR', label: 'Human Resources' },
            { value: 'Engineering', label: 'Engineering' },
            { value: 'Sales', label: 'Sales' },
            { value: 'Marketing', label: 'Marketing' },
            { value: 'Finance', label: 'Finance' },
            { value: 'Operations', label: 'Operations' }
        ]);

        // Dummy Designations
        setDesignations([
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
        ]);

        // Dummy Employment Types
        setEmploymentTypes([
            { value: 'Permanent', label: 'Permanent' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Probation', label: 'Probation' },
            { value: 'Intern', label: 'Intern' },
            { value: 'Part-time', label: 'Part-time' }
        ]);

        // If editing existing allocation, populate form
        if (mode === 'edit' && allocation) {
            // Handle edit mode
            if (allocation.emp_code) {
                // Single allocation edit
                const emp = dummyEmployees.find(e => e.emp_code === allocation.emp_code);
                setSelectedEmployee(emp);
                const leave = dummyLeaveMaster.find(l => l.leave_code === allocation.leave_code);
                setLeaveSelections([{
                    leave_code: allocation.leave_code,
                    leave_name: leave.leave_name,
                    leave_color: leave.color,
                    default_days: leave.default_days,
                    allocated_days: allocation.allocated_days,
                    valid_from: allocation.valid_from,
                    valid_to: allocation.valid_to,
                    carry_forward: leave.carry_forward,
                    note: allocation.note || '',
                    selected: true,
                    id: allocation.id
                }]);
            }
        }
    }, [mode, allocation]);

    // Initialize bulk leave selections with all leave types
    const initializeBulkLeaveSelections = (leaveMasterData) => {
        const selections = leaveMasterData.map(leave => ({
            leave_code: leave.leave_code,
            leave_name: leave.leave_name,
            leave_color: leave.color,
            default_days: leave.default_days,
            allocated_days: leave.default_days,
            carry_forward: leave.carry_forward,
            applicable_to: leave.applicable_to,
            note: '',
            selected: true // Default selected
        }));

        setBulkLeaveSelections(selections);
    };

    // Initialize leave selections when employee is selected
    const initializeLeaveSelections = (employee) => {
        if (!employee) return;

        const applicableLeaves = leaveMaster.filter(leave =>
            leave.applicable_to.includes(employee.employment_type)
        );

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
            selected: true
        }));

        setLeaveSelections(selections);
    };

    const handleEmployeeSelect = (empCode) => {
        const emp = employees.find(e => e.emp_code === empCode);
        setSelectedEmployee(emp);
        initializeLeaveSelections(emp);
    };

    // Single allocation helpers
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

    const selectAllLeaves = (type = 'single') => {
        if (type === 'single') {
            const updated = leaveSelections.map(s => ({ ...s, selected: true }));
            setLeaveSelections(updated);
        } else {
            const updated = bulkLeaveSelections.map(s => ({ ...s, selected: true }));
            setBulkLeaveSelections(updated);
        }
    };

    const deselectAllLeaves = (type = 'single') => {
        if (type === 'single') {
            const updated = leaveSelections.map(s => ({ ...s, selected: false }));
            setLeaveSelections(updated);
        } else {
            const updated = bulkLeaveSelections.map(s => ({ ...s, selected: false }));
            setBulkLeaveSelections(updated);
        }
    };

    // Bulk allocation helpers
    const updateBulkLeaveSelection = (index, field, value) => {
        const updated = [...bulkLeaveSelections];
        updated[index][field] = value;
        setBulkLeaveSelections(updated);
    };

    const toggleBulkLeaveSelection = (index) => {
        const updated = [...bulkLeaveSelections];
        updated[index].selected = !updated[index].selected;
        setBulkLeaveSelections(updated);
    };

    const handleSaveSingleAllocation = () => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }

        const selectedLeaves = leaveSelections.filter(s => s.selected && s.allocated_days > 0);

        if (selectedLeaves.length === 0) {
            alert('Please select at least one leave type with allocated days');
            return;
        }

        // Create allocation data
        const allocations = selectedLeaves.map(selection => ({
            id: mode === 'edit' && selection.id ? selection.id : `${selectedEmployee.emp_code}_${selection.leave_code}_${Date.now()}`,
            emp_code: selectedEmployee.emp_code,
            emp_name: selectedEmployee.emp_name,
            designation: selectedEmployee.designation,
            department: selectedEmployee.department,
            employment_type: selectedEmployee.employment_type,
            leave_code: selection.leave_code,
            leave_name: selection.leave_name,
            leave_color: selection.leave_color,
            allocated_days: parseInt(selection.allocated_days),
            used_days: mode === 'edit' ? allocation?.used_days || 0 : 0,
            pending_days: parseInt(selection.allocated_days) - (mode === 'edit' ? allocation?.used_days || 0 : 0),
            valid_from: selection.valid_from,
            valid_to: selection.valid_to,
            carry_forward: selection.carry_forward,
            status: 'active',
            note: selection.note || ''
        }));

        console.log('Saving allocations:', allocations);

        // Navigate back with success message
        navigate('/admin/leavesetting', {
            state: {
                success: true,
                message: `${allocations.length} leave type(s) ${mode === 'edit' ? 'updated' : 'allocated'} successfully`
            }
        });
    };

    const handleSaveBulkAllocation = () => {
        const selectedLeaves = bulkLeaveSelections.filter(s => s.selected && s.allocated_days > 0);

        if (selectedLeaves.length === 0) {
            alert('Please select at least one leave type with allocated days');
            return;
        }

        let targetEmployees = [];

        if (bulkAllocation.apply_to === 'all') {
            targetEmployees = employees;
        } else if (bulkAllocation.apply_to === 'department' && bulkAllocation.department) {
            targetEmployees = employees.filter(e => e.department === bulkAllocation.department);
        } else if (bulkAllocation.apply_to === 'designation' && bulkAllocation.designation) {
            targetEmployees = employees.filter(e => e.designation === bulkAllocation.designation);
        } else if (bulkAllocation.apply_to === 'employment-type' && bulkAllocation.employment_type) {
            targetEmployees = employees.filter(e => e.employment_type === bulkAllocation.employment_type);
        }

        if (targetEmployees.length === 0) {
            alert('No employees match the selected criteria');
            return;
        }

        // Create allocations for each employee and each selected leave type
        const allAllocations = [];

        targetEmployees.forEach(emp => {
            selectedLeaves.forEach(selection => {
                // Check if this leave type is applicable to the employee's employment type
                if (selection.applicable_to.includes(emp.employment_type)) {
                    allAllocations.push({
                        id: `${emp.emp_code}_${selection.leave_code}_${Date.now()}_${Math.random()}`,
                        emp_code: emp.emp_code,
                        emp_name: emp.emp_name,
                        designation: emp.designation,
                        department: emp.department,
                        employment_type: emp.employment_type,
                        leave_code: selection.leave_code,
                        leave_name: selection.leave_name,
                        leave_color: selection.leave_color,
                        allocated_days: parseInt(selection.allocated_days),
                        used_days: 0,
                        pending_days: parseInt(selection.allocated_days),
                        valid_from: bulkAllocation.valid_from || new Date().toISOString().split('T')[0],
                        valid_to: bulkAllocation.valid_to || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                        carry_forward: selection.carry_forward,
                        status: 'active',
                        note: bulkAllocation.note || `Bulk allocation for ${bulkAllocation.apply_to}`
                    });
                }
            });
        });

        console.log('Saving bulk allocations:', allAllocations);

        // Navigate back with success message
        navigate('/admin/leavesetting', {
            state: {
                success: true,
                message: `${allAllocations.length} leave allocations created for ${targetEmployees.length} employees`
            }
        });
    };

    const handleCancel = () => {
        navigate('/admin/leavesetting');
    };

    // Count selected leaves and total employees for preview
    const getSelectedLeavesCount = () => {
        return bulkLeaveSelections.filter(s => s.selected && s.allocated_days > 0).length;
    };

    const getTargetEmployeesCount = () => {
        if (!bulkAllocation.apply_to) return 0;

        if (bulkAllocation.apply_to === 'all') {
            return employees.length;
        } else if (bulkAllocation.apply_to === 'department' && bulkAllocation.department) {
            return employees.filter(e => e.department === bulkAllocation.department).length;
        } else if (bulkAllocation.apply_to === 'designation' && bulkAllocation.designation) {
            return employees.filter(e => e.designation === bulkAllocation.designation).length;
        } else if (bulkAllocation.apply_to === 'employment-type' && bulkAllocation.employment_type) {
            return employees.filter(e => e.employment_type === bulkAllocation.employment_type).length;
        }
        return 0;
    };

    const getTotalAllocationsCount = () => {
        const selectedLeaves = getSelectedLeavesCount();
        const targetEmployees = getTargetEmployeesCount();
        return selectedLeaves * targetEmployees;
    };

    return (
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Leave Settings', to: '/admin/leavesetting' },
                    { label: mode === 'edit' ? 'Edit Allocation' : (activeTab === 'single' ? 'Add Allocation' : 'Bulk Allocation') }
                ]}
                title={mode === 'edit' ? 'Edit Leave Allocation' : (activeTab === 'single' ? 'Add Leave Allocation' : 'Bulk Leave Allocation')}
                description={mode === 'edit' ? 'Modify existing leave allocation' : (activeTab === 'single' ? 'Allocate leaves to individual employee' : 'Allocate multiple leave types to multiple employees at once')}
            />

            {/* Tabs for Add mode only */}
            {mode !== 'edit' && (
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex p-2 gap-1 border-b border-b-gray-300">
                        <button
                            onClick={() => setActiveTab('single')}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeTab === 'single'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Single Allocation
                        </button>
                        <button
                            onClick={() => setActiveTab('bulk')}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeTab === 'bulk'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Bulk Allocation
                        </button>
                    </div>
                </div>
            )}

            {/* Single Allocation Form */}
            {activeTab === 'single' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Employee Selection */}
                        {mode !== 'edit' && (
                            <div className="max-w-md">
                                <CommonDropDown
                                    label="Select Employee *"
                                    value={selectedEmployee?.emp_code || ''}
                                    onChange={handleEmployeeSelect}
                                    options={employees.map(e => ({
                                        label: `${e.emp_name} (${e.emp_code})`,
                                        value: e.emp_code,
                                        description: `${e.designation} - ${e.department} (${e.employment_type})`
                                    }))}
                                    placeholder="Choose an employee"
                                />
                            </div>
                        )}

                        {selectedEmployee && (
                            <>
                                {/* Employee Info */}
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {selectedEmployee.emp_name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{selectedEmployee.emp_name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {selectedEmployee.emp_code} • {selectedEmployee.designation} • {selectedEmployee.department}
                                            </p>
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-white text-indigo-700 rounded-full text-xs font-medium">
                                                {selectedEmployee.employment_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bulk Actions */}
                                <div className="flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900">Leave Types to Allocate</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => selectAllLeaves('single')}
                                            className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={() => deselectAllLeaves('single')}
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
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Bulk Allocation Form - Now with Multi-Leave Selection */}
            {activeTab === 'bulk' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Apply to Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Apply to *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'all' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="apply_to"
                                        value="all"
                                        checked={bulkAllocation.apply_to === 'all'}
                                        onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        <Users className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                        <div className="font-medium">All Employees</div>
                                    </div>
                                </label>

                                <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'department' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="apply_to"
                                        value="department"
                                        checked={bulkAllocation.apply_to === 'department'}
                                        onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        <Briefcase className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                        <div className="font-medium">Department</div>
                                    </div>
                                </label>

                                <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'designation' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="apply_to"
                                        value="designation"
                                        checked={bulkAllocation.apply_to === 'designation'}
                                        onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        <Award className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                        <div className="font-medium">Designation</div>
                                    </div>
                                </label>

                                <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'employment-type' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="apply_to"
                                        value="employment-type"
                                        checked={bulkAllocation.apply_to === 'employment-type'}
                                        onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                        className="hidden"
                                    />
                                    <div className="text-center">
                                        <User className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                        <div className="font-medium">Employment Type</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Conditional Dropdowns based on selection */}
                        {bulkAllocation.apply_to === 'department' && (
                            <CommonDropDown
                                label="Select Department *"
                                value={bulkAllocation.department}
                                onChange={(val) => setBulkAllocation({ ...bulkAllocation, department: val })}
                                options={departments}
                                placeholder="Choose department"
                            />
                        )}

                        {bulkAllocation.apply_to === 'designation' && (
                            <CommonDropDown
                                label="Select Designation *"
                                value={bulkAllocation.designation}
                                onChange={(val) => setBulkAllocation({ ...bulkAllocation, designation: val })}
                                options={designations}
                                placeholder="Choose designation"
                            />
                        )}

                        {bulkAllocation.apply_to === 'employment-type' && (
                            <CommonDropDown
                                label="Select Employment Type *"
                                value={bulkAllocation.employment_type}
                                onChange={(val) => setBulkAllocation({ ...bulkAllocation, employment_type: val })}
                                options={employmentTypes}
                                placeholder="Choose employment type"
                            />
                        )}

                        {/* Date Range for Bulk Allocations */}
                        <div className="grid grid-cols-3 gap-3">
                            <CommonDatePicker
                                label="Valid From"
                                value={bulkAllocation.valid_from}
                                onChange={(val) => setBulkAllocation({ ...bulkAllocation, valid_from: val })}
                                placeholder="Start date"
                            />
                            <CommonDatePicker
                                label="Valid To"
                                value={bulkAllocation.valid_to}
                                onChange={(val) => setBulkAllocation({ ...bulkAllocation, valid_to: val })}
                                placeholder="End date"
                            />

                            <CommonInputField
                                label="Note (Optional)"
                                value={bulkAllocation.note}
                                onChange={(e) => setBulkAllocation({ ...bulkAllocation, note: e.target.value })}
                                placeholder="Add any notes for this bulk allocation"
                            />
                        </div>

                        {/* Leave Selection Section - New for Bulk */}
                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium text-gray-900">Select Leave Types to Allocate</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => selectAllLeaves('bulk')}
                                        className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={() => deselectAllLeaves('bulk')}
                                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>

                            {/* Bulk Leave Selection Table */}
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Leave Type</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Default Days</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Allocated Days</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Applicable To</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {bulkLeaveSelections.map((selection, index) => (
                                            <tr key={selection.leave_code} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selection.selected}
                                                        onChange={() => toggleBulkLeaveSelection(index)}
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
                                                        onChange={(e) => updateBulkLeaveSelection(index, 'allocated_days', e.target.value)}
                                                        disabled={!selection.selected}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                        min="0"
                                                        max="365"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {selection.applicable_to.map(type => (
                                                            <span key={type} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Preview Summary */}
                        {getSelectedLeavesCount() > 0 && getTargetEmployeesCount() > 0 && (
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Layers className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Bulk Allocation Preview</p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            This will create <span className="font-semibold">{getTotalAllocationsCount()}</span> leave allocations:
                                        </p>
                                        <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                                            <li>{getSelectedLeavesCount()} leave type(s) selected</li>
                                            <li>{getTargetEmployeesCount()} employee(s) targeted</li>
                                            <li>Valid from {bulkAllocation.valid_from || 'start date'} to {bulkAllocation.valid_to || 'end date'}</li>
                                            <li>Only employees with applicable employment type will receive each leave type</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
                <button
                    onClick={activeTab === 'single' ? handleSaveSingleAllocation : handleSaveBulkAllocation}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {mode === 'edit' ? 'Update Allocation' : (activeTab === 'single' ? 'Allocate Leaves' : 'Apply Bulk Allocation')}
                </button>
            </div>
        </div>
    );
}

export default LeaveSettingsAddEditTest;