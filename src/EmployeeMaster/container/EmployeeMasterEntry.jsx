import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonTable from '../../basicComponents/commonTable';
import { ApiCall, getRoleBasePath } from '../../library/constants';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';

function EmployeeMasterEntry() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        emp_code: '',
        emp_name: '',
        department_code: '',
        designation_code: '',
        hierarchy_code: '',
        status: ''
    })

    const [employees, setEmployees] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [dropdowns, setDropdowns] = useState({
        departments: [],
        designations: [],
        hierarchyLevels: []
    })

    useEffect(() => {
        loadDepartments()
        loadHierarchyLevels()
    }, [])

    async function loadDepartments() {
        setIsLoading(true)
        try {
            const res = await ApiCall('get', '/empmst/departmentsList')
            if (res?.data?.success) {
                setDropdowns(prev => ({
                    ...prev,
                    departments: res.data.data.data
                }))
            }
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    async function loadDesignations(department_code) {
        setIsLoading(true)
        try {
            const res = await ApiCall('get', `/empmst/designantionList?department_code=${department_code}`
            )

            if (res?.data?.success) {
                setDropdowns(prev => ({
                    ...prev,
                    designations: res.data.data.data
                }))
            }
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    async function loadHierarchyLevels() {
        setIsLoading(true)
        try {
            const res = await ApiCall('get', '/empmst/hierarchyLevel')

            if (res?.data?.success) {
                setDropdowns(prev => ({
                    ...prev,
                    hierarchyLevels: res.data.data.data
                }))
            }
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
        setShowTable(false)
        if (name === 'department_code') {
            loadDesignations(value)
            setFilters(prev => ({
                ...prev,
                designation_code: ''
            }))
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const queryParams = new URLSearchParams()
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value)
            })

            const res = await ApiCall('get', `/empmst/employeeList?${queryParams.toString()}`)

            if (res?.data?.success) {
                setEmployees(res.data.data)
                setShowTable(true)
            }
            else {

            }

        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    const handleRefresh = () => {
        setFilters({
            emp_code: '',
            emp_name: '',
            department_code: '',
            designation_code: '',
            hierarchy_code: '',
            status: ''
        })
        setEmployees([])
        setShowTable(false)
    }
    const isSearchDisabled = Object.values(filters).every(val => !val)

    const handleEdit = (row) => {
        navigate(`${getRoleBasePath()}/employee_master_entry/edit/${row.employee_code}`, { state: { employee: row, mode: 'edit' } });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter(emp => emp.employee_code !== id));
            alert('Employee deleted successfully!');
        }
    };

    const columns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.employee_code)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Employee Code",
            accessor: "employee_code",
            cell: row => (
                <span className=" text-sm font-medium ">
                    {row.employee_code}
                </span>
            )
        },
        {
            header: "Employee Name",
            cell: row => (
                <div className="flex items-center gap-2">
                    <div>
                        <div className="font-medium text-gray-900">
                            {row.first_name} {row.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Department",
            accessor: "department",
            cell: row => (
                <span className=" text-xs font-medium">
                    {row.department}
                </span>
            )
        },
        {
            header: "Designation",
            accessor: "designation"
        },
        {
            header: "Mobile",
            accessor: "mobile_number"
        },
        {
            header: "Joining Date",
            accessor: "joining_date",
            cell: row => (
                <span className="text-sm">
                    {new Date(row.joining_date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })}
                </span>
            )
        },
        {
            header: "Status",
            accessor: "employee_status",
            cell: row => {
                const statusColors = {
                    'Active': 'bg-green-100 text-green-800',
                    'Inactive': 'bg-red-100 text-red-800',
                    'Probation': 'bg-yellow-100 text-yellow-800',
                    'Terminated': 'bg-red-100 text-red-800'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[row.employee_status] || 'bg-gray-100 text-gray-800'}`}>
                        {row.employee_status}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="p-2">
            <BreadCrumb
                items={[{ label: "Employee Master", }]}
                title="Employee Master"
                description="Manage employee profiles and information"
                actions={<button
                    onClick={() => navigate(`${getRoleBasePath()}/employee_master_entry/edit/add`)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add New Employee
                </button>}
                loading={isLoading}
            />

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <CommonInputField
                        label="Employee Code"
                        value={filters.emp_code}
                        onChange={(val) => handleFilterChange('emp_code', val)}
                        placeholder="Enter Employee Code"
                        loading={isLoading}
                    />

                    <CommonInputField
                        label="Employee Name"
                        value={filters.emp_name}
                        onChange={(val) => handleFilterChange('emp_name', val)}
                        placeholder="Enter Employee Name"
                        loading={isLoading}
                    />

                    <CommonDropDown
                        label="Department"
                        value={filters.department_code}
                        onChange={(val) => handleFilterChange('department_code', val)}
                        options={dropdowns.departments}
                        placeholder="Select Department"
                        loading={isLoading}
                    />

                    <CommonDropDown
                        label="Designation"
                        value={filters.designation_code}
                        onChange={(val) => handleFilterChange('designation_code', val)}
                        options={dropdowns.designations}
                        placeholder="Select Designation"
                        loading={isLoading}
                    />

                    <CommonDropDown
                        label="Hierarchy Level"
                        value={filters.hierarchy_code}
                        onChange={(val) => handleFilterChange('hierarchy_code', val)}
                        options={dropdowns.hierarchyLevels}
                        placeholder="Select Hierarchy"
                        loading={isLoading}
                    />

                    <CommonDropDown
                        label="Status"
                        value={filters.status}
                        onChange={(val) => handleFilterChange('status', val)}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Probation', value: 'Probation' },
                            { label: 'Terminated', value: 'Terminated' }
                        ]}
                        placeholder="Select Status"
                        loading={isLoading}
                    />
                    {isLoading ? (
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-300 animate-pulse">
                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    ) : (
                        <div className="flex mt-6 gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={isSearchDisabled}
                                className={`px-6 text-white rounded-md h-8 ${isSearchDisabled
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                                    }`}
                            >
                                Search
                            </button>

                            <button onClick={handleRefresh}
                                className="h-8 w-8 flex cursor-pointer items-center justify-center  border bg-gray-200 border-gray-400 rounded-md hover:border-gray-400 text-gray-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>)}
                </div>

            </div>

            {showTable && (
                <CommonTable
                    columns={columns}
                    data={employees}
                    itemsPerPage={10}
                    showSearch={false}
                    showPagination={true}
                    loading={isLoading}
                />
            )}
            {isLoading && <LoadingSpinner />}
        </div>
    )
}

export default EmployeeMasterEntry
