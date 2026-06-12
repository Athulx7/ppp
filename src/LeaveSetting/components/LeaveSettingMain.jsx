import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Trash2, Edit, Download, ChevronRight } from 'lucide-react';
import CommonTable from '../../basicComponents/commonTable';
import { ApiCall, getRoleBasePath } from '../../library/constants';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';
import LeaveSettingsEntrySelections from './LeaveSettingsEntrySelections';
import EmployeeWiseLeaveShowModal from './EmployeeWiseLeaveShowModal';

function LeaveSettingMain({ isLoading, setIsLoading, navigate }) {
    const location = useLocation();
    const [selections, setSelection] = useState({
        departments: '',
        designation: '',
        hierarchyLevel: '',
        employmentType: '',
        employee: ''
    });

    const [selectionDropdowns, setSelectionDropdowns] = useState({
        departments: [],
        designation: [],
        hierarchyLevel: [],
        employmentType: [],
        employee: []
    })

    const [leaveAllocations, setLeaveAllocations] = useState([])

    const [modalEmployee, setModalEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getCommonDDLDatas()
        fetchLeaveAllocations()
    }, [])

    useEffect(() => {
        if (location.state?.success && location.state?.message) {
            showStatusToast({
                type: 'success',
                title: 'Success',
                message: location.state.message,
                autoClose: true
            });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    async function getCommonDDLDatas() {
        setIsLoading({ normal: true, spinner: false })
        try {
            const [departmentRes, hierarchyLevelRes, employmentTypeRes] = await Promise.all([
                ApiCall('GET', '/leavesettings/department'),
                ApiCall('GET', '/leavesettings/hierarchy'),
                ApiCall('GET', '/leavesettings/employeetype')
            ])

            setSelectionDropdowns(prev => ({
                ...prev,
                departments: departmentRes?.data?.data?.data || [],
                hierarchyLevel: hierarchyLevelRes?.data?.data?.data || [],
                employmentType: employmentTypeRes?.data?.data?.data || []
            }));
        } catch (err) {
            console.error('Error loading DDL data:', err)
        }
        setIsLoading({ normal: false, spinner: false })
    }

    async function fetchLeaveAllocations() {
        setIsLoading({ normal: true, spinner: false });
        try {
            const res = await ApiCall('GET', '/leavesettings/allocations');
            const data = res?.data?.data?.data || [];
            setLeaveAllocations(data);
        } catch (err) {
            console.error('Error loading leave allocations:', err);
        }
        setIsLoading({ normal: false, spinner: false });
    }

    async function getDesignationDDL(department) {
        setIsLoading({ normal: true, spinner: false });
        try {
            const res = await ApiCall('GET', `/leavesettings/designation?department_code=${department}`);
            setSelectionDropdowns(prev => ({
                ...prev,
                designation: res?.data?.data?.data || []
            }));
        } catch (err) {
            console.error('Error loading designations:', err);
        }
        setIsLoading({ normal: false, spinner: false });
    }

    useEffect(() => {
        getLeaveALlocations()
    }, [selections.departments, selections.designation, selections.employmentType, selections.employee]);

    async function getLeaveALlocations() {
        setIsLoading({ normal: true, spinner: false });

        try {
            const params = new URLSearchParams();

            if (selections.employee)
                params.append('emp_code', selections.employee);

            if (selections.departments)
                params.append('department', selections.departments);

            if (selections.designation)
                params.append('designation', selections.designation);

            if (selections.employmentType)
                params.append('employment_type', selections.employmentType);

            const res = await ApiCall(
                'GET',
                `/leavesettings/allocations?${params.toString()}`
            );
            console.log('leave allocations gets', res.data.data)

            const data = res?.data?.data || [];

            setLeaveAllocations(data)
        } catch (err) {
            console.error('Error loading leave allocations:', err);
        }

        setIsLoading({ normal: false, spinner: false });
    }

    useEffect(() => {
        getEmployeeDDL(
            selections.departments,
            selections.designation,
            selections.hierarchyLevel,
            selections.employmentType
        );
    }, [selections.departments, selections.designation, selections.hierarchyLevel, selections.employmentType]);

    async function getEmployeeDDL(department, designation, hierarchyLevel, employmentType) {
        try {
            const res = await ApiCall(
                'GET',
                `/leavesettings/employees?department_code=${department || ''}&designation_code=${designation || ''}&hierarchy_code=${hierarchyLevel || ''}&employee_type_code=${employmentType || ''}`
            );
            setSelectionDropdowns(prev => ({ ...prev, employee: res?.data?.data?.data || [] }));
        } catch (err) {
            console.error('Error loading employees DDL:', err);
        }
    }

    const handleFilterChange = (name, value) => {
        setSelection(prev => ({ ...prev, [name]: value }));
        if (name === 'departments') {
            getDesignationDDL(value);
            setSelection(prev => ({ ...prev, designation: '' }));
        }
    };

    const handleClearFilters = () => {
        setSelection({
            departments: '',
            designation: '',
            hierarchyLevel: '',
            employmentType: '',
            employee: ''
        });
    }

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') closeModal(); };
        if (isModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const getGroupedAllocations = useCallback(() => {
        const grouped = {};

        leaveAllocations.forEach(alloc => {
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
            totalAllocated: emp.leaves.reduce(
                (s, l) => s + (l.allocated_days || 0),
                0
            ),
            totalUsed: emp.leaves.reduce(
                (s, l) => s + (l.used_days || 0),
                0
            ),
            balance: emp.leaves.reduce(
                (s, l) => s + (l.pending_days || 0),
                0
            )
        }));
    }, [leaveAllocations]);

    const groupedAllocations = getGroupedAllocations();

    const openModal = (empRow) => {
        setModalEmployee(empRow);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalEmployee(null);
    };

    const getEmpTypeBadgeClass = (type) => {
        const map = {
            Permanent: 'bg-green-100 text-green-800',
            Contract: 'bg-blue-100 text-blue-800',
            Probation: 'bg-yellow-100 text-yellow-800',
            Intern: 'bg-purple-100 text-purple-800',
            'Part-time': 'bg-gray-100 text-gray-800'
        };
        return map[type] || 'bg-gray-100 text-gray-800';
    };

    const handleEditAllocation = (allocation) => {
        navigate(`${getRoleBasePath()}/leave-settings/edit`, { state: { mode: 'edit', allocation } });
    };

    const handleDeleteAllocation = async (empCode) => {
        if (!window.confirm('Are you sure you want to delete all leave allocations for this employee?')) return;
        try {
            setIsLoading({ normal: true, spinner: false });
            await ApiCall('DELETE', `/leavesettings/allocation/${empCode}`);
            showStatusToast({
                type: 'success',
                title: 'Deleted',
                message: 'All leave allocations for this employee deleted successfully.',
                autoClose: true
            });
            await fetchLeaveAllocations();
        } catch (err) {
            console.error('Error deleting allocation:', err);
            showStatusToast({
                type: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Failed to delete leave allocations. Please try again.',
                autoClose: false
            });
        }
        setIsLoading({ normal: false, spinner: false });
    };

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
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.leave_color || 'bg-gray-100 text-gray-700'}`}
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

    const getSummaryStats = () => {
        const uniqueEmployees = new Set(
            leaveAllocations.map(a => a.emp_code)
        );

        const totalAllocated = leaveAllocations.reduce(
            (sum, a) => sum + (a.allocated_days || 0),
            0
        );

        const totalUsed = leaveAllocations.reduce(
            (sum, a) => sum + (a.used_days || 0),
            0
        );

        const totalPending = leaveAllocations.reduce(
            (sum, a) => sum + (a.pending_days || 0),
            0
        );
        return {
            employees: uniqueEmployees.size,
            totalAllocated,
            totalUsed,
            totalPending,
            avgPerEmployee: (totalAllocated / (uniqueEmployees.size || 1)).toFixed(1)
        };
    };

    const stats = getSummaryStats();

    const modalStats = modalEmployee
        ? {
            totalAllocated: modalEmployee.totalAllocated,
            totalUsed: modalEmployee.totalUsed,
            balance: modalEmployee.balance,
            leaveCount: modalEmployee.leaves.length
        }
        : null;

    return (
        <>
            <LeaveSettingsEntrySelections
                selection={selections}
                setSelection={setSelection}
                selectionDropdowns={selectionDropdowns}
                handleFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />

            <div>
                <CommonTable
                    columns={groupedColumns}
                    data={groupedAllocations}
                    onRowClick={(row) => openModal(row)}
                    rowClassName="cursor-pointer hover:bg-indigo-50 transition-colors"
                    itemsPerPage={10}
                    showSearch={false}
                    showPagination={true}
                />
            </div>

            {isModalOpen && modalEmployee && (
                <EmployeeWiseLeaveShowModal
                    isModalOpen={isModalOpen}
                    modalEmployee={modalEmployee}
                    closeModal={closeModal}
                    handleEditAllocation={handleEditAllocation}
                    getEmpTypeBadgeClass={getEmpTypeBadgeClass}
                    modalStats={modalStats}
                />
            )}
        </>
    );
}

export default LeaveSettingMain;
