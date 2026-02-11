import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonTable from '../../basicComponents/CommonTable';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';

function EmployeeMasterEntry() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [employees, setEmployees] = useState([]);

    const employeesData = [
        {
            employee_id: 1,
            employee_code: "EMP001",
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@company.com",
            mobile_number: "+91 9876543210",
            department: "Engineering",
            designation: "Senior Software Engineer",
            employee_status: "Active",
            joining_date: "2022-01-15"
        },
        {
            employee_id: 2,
            employee_code: "EMP002",
            first_name: "Sarah",
            last_name: "Johnson",
            email: "sarah.j@company.com",
            mobile_number: "+91 9876543220",
            department: "HR",
            designation: "HR Manager",
            employee_status: "Active",
            joining_date: "2021-06-01"
        },
        {
            employee_id: 3,
            employee_code: "EMP003",
            first_name: "Michael",
            last_name: "Chen",
            email: "michael.c@company.com",
            mobile_number: "+91 9876543230",
            department: "Sales",
            designation: "Sales Manager",
            employee_status: "Probation",
            joining_date: "2023-11-15"
        },
        {
            employee_id: 4,
            employee_code: "EMP004",
            first_name: "Priya",
            last_name: "Patel",
            email: "priya.p@company.com",
            mobile_number: "+91 9876543240",
            department: "Finance",
            designation: "Accountant",
            employee_status: "Inactive",
            joining_date: "2022-08-20"
        },
        {
            employee_id: 5,
            employee_code: "EMP005",
            first_name: "David",
            last_name: "Kumar",
            email: "david.k@company.com",
            mobile_number: "+91 9876543250",
            department: "Marketing",
            designation: "Marketing Specialist",
            employee_status: "Active",
            joining_date: "2023-01-10"
        }
    ];

    useEffect(() => {
        setEmployees(employeesData);
    }, []);

    const handleAddNew = () => {
        navigate('/admin/employeemaster/edit/add');
    };

    const handleEdit = (row) => {
        navigate(`/admin/employeemaster/edit/${row.employee_id}`, { state: { employee: row, mode: 'edit' } });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            setEmployees(employees.filter(emp => emp.employee_id !== id));
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
                        onClick={() => handleDelete(row.employee_id)}
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
                    'Inactive': 'bg-gray-100 text-gray-800',
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

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch =
            emp.employee_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.department?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
        const matchesStatus = statusFilter === 'all' || emp.employee_status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
    })

    const departments = [...new Set(employees.map(emp => emp.department))]

    return (
        <div className="min-h-screen bg-gray-50 p-3">
            <div className="mb-6">
                <BreadCrumb
                    items={[{ label: "Employee Master", }]}
                    title="Employee Master"
                    description="Manage employee profiles and information"
                    actions={<button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Employee
                    </button>}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <CommonInputField
                        label="Employee Code"
                        value={''}
                        disabled={''}
                        onChange={''}
                        placeholder="Employee code"
                    />

                    <CommonInputField
                        label="Employee Name"
                        value={''}
                        disabled={''}
                        onChange={''}
                        placeholder="Employee code"
                    />
                    <CommonDropDown
                        label="Department"
                        value={departmentFilter}
                        onChange={setDepartmentFilter}
                        options={[
                            { label: 'All Departments', value: 'all' },
                            ...departments.map(dept => ({ label: dept, value: dept }))
                        ]}
                        placeholder="Filter by Department"
                    />

                    <CommonDropDown
                        label="Designation"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Probation', value: 'Probation' },
                            { label: 'Terminated', value: 'Terminated' }
                        ]}
                        placeholder="Filter by Status"
                    />

                    <CommonDropDown
                        label="Status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Probation', value: 'Probation' },
                            { label: 'Terminated', value: 'Terminated' }
                        ]}
                        placeholder="Filter by Status"
                    />
                    <div className='flex mt-6'>
                        <button className="px-10 font-bold  text-white bg-indigo-500 rounded-md hover:bg-indigo-600 cursor-pointer h-10">
                            View
                        </button>
                        <button className="p-3 border-1 flex items-center ml-3 hover:border-indigo-600 hover:text-indigo-600 border-indigo-500 rounded-md text-indigo-500 cursor-pointer h-10">
                            <RefreshCw />
                        </button>
                    </div>
                </div>

            </div>

            <CommonTable
                columns={columns}
                data={filteredEmployees}
                itemsPerPage={10}
                showSearch={false}
                showPagination={true}
            />
        </div>
    )
}

export default EmployeeMasterEntry
