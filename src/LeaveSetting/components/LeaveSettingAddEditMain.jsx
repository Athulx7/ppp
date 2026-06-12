import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { ApiCall, getRoleBasePath } from '../../library/constants';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';
import LeaveSettingAddEditTabSection from './LeaveSettingAddEditTabSection';
import SingleLeaveAllocation from './SingleLeaveAllocation';
import BulkLeaveAllocation from './BulkLeaveAllocation';

function LeaveSettingAddEditMain({ isLoading, setIsLoading }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { mode, allocation } = location.state || { mode: 'add' };
    const [activeTab, setActiveTab] = useState('single');

    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [bulkDropdowns, setBulkDropdowns] = useState({
        department: [],
        designation: [],
        employmentType: []
    });

    const [selectedEmpCode, setSelectedEmpCode] = useState('');
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
    useEffect(() => {
        loadFormData();
    }, []);

    async function loadFormData() {
        setIsLoading({ normal: true, spinner: false });
        try {
            const [employeesRes, departmentRes, designRes, empTypeRes, leaveTypeRes] = await Promise.all([
                ApiCall('GET', '/leavesettings/employees/all'),
                ApiCall('GET', '/leavesettings/department'),
                ApiCall('GET', '/leavesettings/designations/all'),
                ApiCall('GET', '/leavesettings/employeetype'),
                ApiCall('GET', '/leavesettings/leaveTypes')
            ]);

            const rawEmployees = employeesRes?.data?.data?.data || [];
            const departments = departmentRes?.data?.data?.data || [];
            const designations = designRes?.data?.data?.data || [];
            const employmentTypes = empTypeRes?.data?.data?.data || [];
            const leaveTypes = leaveTypeRes?.data?.data || []

            const mappedEmployees = rawEmployees.map(e => ({
                ...e,
                emp_code: e.value || e.emp_code,
                emp_name: e.label || e.emp_name
            }));

            const employeeDDL = mappedEmployees.map(e => ({
                value: e.emp_code,
                label: `${e.emp_name} (${e.emp_code})`,
                ...e
            }));

            setEmployees(employeeDDL);
            setAllEmployees(mappedEmployees);

            setBulkDropdowns({
                department: departments,
                designation: designations,
                employmentType: employmentTypes
            });

            const mappedLeaves = leaveTypes.map(lt => ({
                leave_type_id: lt.leave_type_id,
                leave_code: lt.leave_code,
                leave_name: lt.leave_name,
                description: lt.description,
                default_days: lt.maximum_days ?? lt.default_days ?? 0,
                carry_forward: lt.carry_forward || false,
                max_carry_forward: lt.max_carry_forward || 0,
                applicable_to: lt.applicable_to || []
            }));

            setLeaveMaster(mappedLeaves);
            initializeBulkLeaveSelections(mappedLeaves);

            if (mode === 'edit' && allocation) {
                setSelectedEmpCode(allocation.emp_code);
                const emp = mappedEmployees.find(e => e.emp_code === allocation.emp_code) || {
                    emp_code: allocation.emp_code,
                    emp_name: allocation.emp_name,
                    employment_type: allocation.employment_type || '',
                    department: allocation.department || '',
                    designation: allocation.designation || ''
                };
                setSelectedEmployee(emp);

                const today = new Date().toISOString().split('T')[0];
                const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    .toISOString().split('T')[0];

                const applicable = mappedLeaves.filter(leave =>
                    leave.applicable_to.length === 0 ||
                    leave.applicable_to.includes(emp.employment_type)
                );

                const formatDBDate = (dStr) => {
                    if (!dStr) return '';
                    return dStr.split('T')[0];
                };

                const initialSelections = applicable.map(leave => {
                    const existing = allocation.leaves?.find(l => l.leave_type_id === leave.leave_type_id || l.leave_code === leave.leave_code);
                    if (existing) {
                        return {
                            id: existing.id,
                            leave_type_id: leave.leave_type_id,
                            leave_code: leave.leave_code,
                            leave_name: leave.leave_name,
                            default_days: leave.default_days,
                            allocated_days: existing.allocated_days,
                            valid_from: formatDBDate(existing.valid_from),
                            valid_to: formatDBDate(existing.valid_to),
                            carry_forward: existing.is_carry_forward || existing.carry_forward || false,
                            note: existing.note || '',
                            selected: true
                        };
                    } else {
                        return {
                            leave_type_id: leave.leave_type_id,
                            leave_code: leave.leave_code,
                            leave_name: leave.leave_name,
                            default_days: leave.default_days,
                            allocated_days: leave.default_days,
                            valid_from: today,
                            valid_to: nextYear,
                            carry_forward: leave.carry_forward || false,
                            note: '',
                            selected: false
                        };
                    }
                });
                setLeaveSelections(initialSelections);
            }

        } catch (err) {
            console.error('Error loading form data:', err);
        }
        setIsLoading({ normal: false, spinner: false });
    }

    const initializeBulkLeaveSelections = (leaveData) => {
        setBulkLeaveSelections(leaveData.map(leave => ({
            leave_type_id: leave.leave_type_id,
            leave_code: leave.leave_code,
            leave_name: leave.leave_name,
            default_days: leave.default_days,
            allocated_days: leave.default_days,
            carry_forward: leave.carry_forward,
            applicable_to: leave.applicable_to,
            note: '',
            selected: true
        })));
    };

    const initializeLeaveSelectionsForEmployee = (employee) => {
        if (!employee) { setLeaveSelections([]); return; }

        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString().split('T')[0];

        const applicable = leaveMaster.filter(leave =>
            leave.applicable_to.length === 0 ||
            leave.applicable_to.includes(employee.employment_type)
        );

        setLeaveSelections(applicable.map(leave => ({
            leave_type_id: leave.leave_type_id,
            leave_code: leave.leave_code,
            leave_name: leave.leave_name,
            default_days: leave.default_days,
            allocated_days: leave.default_days,
            valid_from: today,
            valid_to: nextYear,
            carry_forward: leave.carry_forward,
            note: '',
            selected: true
        })));
    };

    const handleEmployeeSelect = (empCode) => {
        setSelectedEmpCode(empCode);
        const emp = allEmployees.find(e => e.emp_code === empCode) || null;
        setSelectedEmployee(emp);
        initializeLeaveSelectionsForEmployee(emp);
    };

    const updateLeaveSelection = (index, field, value) => {
        setLeaveSelections(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const toggleLeaveSelection = (index) => {
        setLeaveSelections(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], selected: !updated[index].selected };
            return updated;
        });
    };

    const updateBulkLeaveSelection = (index, field, value) => {
        setBulkLeaveSelections(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const toggleBulkLeaveSelection = (index) => {
        setBulkLeaveSelections(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], selected: !updated[index].selected };
            return updated;
        });
    };

    const selectAllLeaves = (type = 'single') => {
        if (type === 'single') {
            setLeaveSelections(prev => prev.map(s => ({ ...s, selected: true })));
        } else {
            setBulkLeaveSelections(prev => prev.map(s => ({ ...s, selected: true })));
        }
    };

    const deselectAllLeaves = (type = 'single') => {
        if (type === 'single') {
            setLeaveSelections(prev => prev.map(s => ({ ...s, selected: false })));
        } else {
            setBulkLeaveSelections(prev => prev.map(s => ({ ...s, selected: false })));
        }
    };

    const handleSaveSingleAllocation = async () => {
        if (!selectedEmployee) {
            showStatusToast({
                type: 'warning',
                title: 'Validation',
                message: 'Please select an employee',
                autoClose: true
            });
            return;
        }
        const selectedLeaves = leaveSelections.filter(s => s.selected && parseFloat(s.allocated_days) > 0);
        if (selectedLeaves.length === 0) {
            showStatusToast({
                type: 'warning',
                title: 'Validation',
                message: 'Please select at least one leave type with allocated days',
                autoClose: true
            });
            return;
        }

        const payload = {
            emp_code: selectedEmployee.emp_code,
            allocations: selectedLeaves.map(s => ({
                leave_type_id: s.leave_type_id,
                allocated_days: parseFloat(s.allocated_days),
                valid_from: s.valid_from,
                valid_to: s.valid_to,
                carry_forward: s.carry_forward,
                note: s.note || ''
            }))
        };

        try {
            setIsLoading({ normal: true, spinner: false });
            if (mode === 'edit') {
                const deletePromises = leaveSelections
                    .filter(s => !s.selected && s.id)
                    .map(s => ApiCall('DELETE', `/leavesettings/allocation/${s.id}`));

                const updatePromises = leaveSelections
                    .filter(s => s.selected && s.id)
                    .map(s => ApiCall('PUT', `/leavesettings/allocation/${s.id}`, {
                        allocated_days: parseFloat(s.allocated_days),
                        valid_from: s.valid_from,
                        valid_to: s.valid_to,
                        note: s.note || null
                    }));

                const newSelections = leaveSelections.filter(s => s.selected && !s.id && parseFloat(s.allocated_days) > 0);
                let insertPromise = Promise.resolve();
                if (newSelections.length > 0) {
                    const insertPayload = {
                        emp_code: selectedEmployee.emp_code,
                        allocations: newSelections.map(s => ({
                            leave_type_id: s.leave_type_id,
                            allocated_days: parseFloat(s.allocated_days),
                            valid_from: s.valid_from,
                            valid_to: s.valid_to,
                            carry_forward: s.carry_forward,
                            note: s.note || ''
                        }))
                    };
                    insertPromise = ApiCall('POST', '/leavesettings/allocation', insertPayload);
                }

                await Promise.all([...deletePromises, ...updatePromises, insertPromise]);
            } else {
                await ApiCall('POST', '/leavesettings/allocation', payload);
            }
            navigate(`${getRoleBasePath()}/leavesetting`, {
                state: {
                    success: true,
                    message: `${selectedLeaves.length} leave type(s) ${mode === 'edit' ? 'updated' : 'allocated'} successfully`
                }
            });
        } catch (err) {
            console.error('Error saving single allocation:', err);
            showStatusToast({
                type: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to save allocation. Please try again.',
                autoClose: true
            });
        }
        setIsLoading({ normal: false, spinner: false });
    };

    const handleSaveBulkAllocation = async () => {
        const selectedLeaves = bulkLeaveSelections.filter(s => s.selected && s.allocated_days > 0);
        if (selectedLeaves.length === 0) {
            showStatusToast({
                type: 'warning',
                title: 'Validation',
                message: 'Please select at least one leave type with allocated days',
                autoClose: true
            });
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString().split('T')[0];

        const payload = {
            apply_to: bulkAllocation.apply_to,
            department: bulkAllocation.department || null,
            designation: bulkAllocation.designation || null,
            employment_type: bulkAllocation.employment_type || null,
            valid_from: bulkAllocation.valid_from || today,
            valid_to: bulkAllocation.valid_to || nextYear,
            note: bulkAllocation.note || '',
            allocations: selectedLeaves.map(s => ({
                leave_type_id: s.leave_type_id,
                allocated_days: parseInt(s.allocated_days),
                carry_forward: s.carry_forward,
                note: s.note || ''
            }))
        };

        try {
            setIsLoading({ normal: true, spinner: false });
            const res = await ApiCall('POST', '/leavesettings/allocation/bulk', payload);
            const count = res?.data?.data?.total_inserted ?? selectedLeaves.length;
            navigate(`${getRoleBasePath()}/leavesetting`, {
                state: {
                    success: true,
                    message: `Bulk allocation created successfully (${count} records)`
                }
            });
        } catch (err) {
            console.error('Error saving bulk allocation:', err);
            showStatusToast({
                type: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to save bulk allocation. Please try again.',
                autoClose: true
            });
        }
        setIsLoading({ normal: false, spinner: false });
    };

    const handleCancel = () => navigate(`${getRoleBasePath()}/leavesetting`);

    const getSelectedLeavesCount = () =>
        bulkLeaveSelections.filter(s => s.selected && s.allocated_days > 0).length;

    const getTargetEmployeesCount = () => {
        const { apply_to, department, designation, employment_type } = bulkAllocation;
        if (apply_to === 'all') return allEmployees.length;
        if (apply_to === 'department' && department) return allEmployees.filter(e => e.department_code === department).length;
        if (apply_to === 'designation' && designation) return allEmployees.filter(e => e.designation_code === designation).length;
        if (apply_to === 'employment-type' && employment_type) return allEmployees.filter(e => e.employee_type_code === employment_type).length;
        return 0;
    };

    const getTotalAllocationsCount = () => getSelectedLeavesCount() * getTargetEmployeesCount();

    return (
        <>
            {mode !== 'edit' && (
                <LeaveSettingAddEditTabSection
                    isLoading={isLoading}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}

            {activeTab === 'single' && (
                <SingleLeaveAllocation
                    employeeOptions={employees}
                    selectedEmpCode={selectedEmpCode}
                    onEmployeeChange={handleEmployeeSelect}
                    leaveSelections={leaveSelections}
                    toggleLeaveSelection={toggleLeaveSelection}
                    updateLeaveSelection={updateLeaveSelection}
                    selectAllLeaves={selectAllLeaves}
                    deselectAllLeaves={deselectAllLeaves}
                    isEditMode={mode === 'edit'}
                />
            )}

            {activeTab === 'bulk' && (
                <BulkLeaveAllocation
                    bulkDropdowns={bulkDropdowns}
                    bulkAllocation={bulkAllocation}
                    setBulkAllocation={setBulkAllocation}
                    bulkLeaveSelections={bulkLeaveSelections}
                    toggleBulkLeaveSelection={toggleBulkLeaveSelection}
                    updateBulkLeaveSelection={updateBulkLeaveSelection}
                    selectAllLeaves={selectAllLeaves}
                    deselectAllLeaves={deselectAllLeaves}
                    getSelectedLeavesCount={getSelectedLeavesCount}
                    getTargetEmployeesCount={getTargetEmployeesCount}
                    getTotalAllocationsCount={getTotalAllocationsCount}
                />
            )}

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
                    {mode === 'edit'
                        ? 'Update Allocation'
                        : activeTab === 'single'
                            ? 'Allocate Leaves'
                            : 'Apply Bulk Allocation'}
                </button>
            </div>
        </>
    );
}

export default LeaveSettingAddEditMain;