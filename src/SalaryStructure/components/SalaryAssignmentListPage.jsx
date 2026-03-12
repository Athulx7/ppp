import { Edit, RefreshCw, Unlink } from 'lucide-react'
import React, { useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonTable from '../../basicComponents/commonTable'

function SalaryAssignmentListPage({ isLoading, onEditAssignment }) {

    const [isSearchDisabled] = useState(true)

    const employees = [
        { id: 101, name: 'John Smith', employeeCode: 'EMP001', designation: 'Junior Software Engineer', department: 'Engineering' },
        { id: 102, name: 'Sarah Johnson', employeeCode: 'EMP002', designation: 'Senior Software Engineer', department: 'Engineering' },
        { id: 103, name: 'Mike Chen', employeeCode: 'EMP003', designation: 'HR Executive', department: 'Human Resources' },
        { id: 104, name: 'Priya Sharma', employeeCode: 'EMP004', designation: 'Junior Software Engineer', department: 'Engineering' },
        { id: 105, name: 'David Lee', employeeCode: 'EMP005', designation: 'Sales Executive', department: 'Sales' },
    ]

    const [assignments] = useState([
        {
            id: 1,
            type: 'designation',
            targetId: 101,
            targetName: 'John Smith',
            employeeCode: 'EMP001',
            structureName: 'Junior Software Engineer',
            effectiveDate: '2024-01-01',
            status: 'active'
        },
        {
            id: 2,
            type: 'employee',
            targetId: 102,
            targetName: 'Sarah Johnson',
            employeeCode: 'EMP002',
            structureName: 'Senior Software Engineer',
            effectiveDate: '2024-01-01',
            status: 'active'
        },
        {
            id: 3,
            type: 'designation',
            targetId: 103,
            targetName: 'Mike Chen',
            employeeCode: 'EMP003',
            structureName: 'HR Executive',
            effectiveDate: '2024-01-01',
            status: 'active'
        },
        {
            id: 4,
            type: 'employee',
            targetId: 104,
            targetName: 'Priya Sharma',
            employeeCode: 'EMP004',
            structureName: 'Junior Software Engineer',
            effectiveDate: '2024-03-01',
            status: 'inactive'
        },
        {
            id: 5,
            type: 'employee',
            targetId: 105,
            targetName: 'David Lee',
            employeeCode: 'EMP005',
            structureName: 'Sales Executive Structure',
            effectiveDate: '2023-11-30',
            status: 'active'
        },
    ])

    const assignmentColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    {row.status === 'active' ? (
                        <button
                            onClick={() => onEditAssignment && onEditAssignment(row.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>) : null}
                    {row.status === 'active' ? (
                        <button
                            onClick={() => { }}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Unassign"
                        >
                            <Unlink size={16} />
                        </button>
                    ) : (
                        <button
                            disabled
                            className="text-gray-300 cursor-not-allowed"
                            title="Already Unassigned/Inactive"
                        >
                            <Unlink size={16} />
                        </button>
                    )}

                </div>
            )
        },
        {
            header: "Employee",
            accessor: "targetName",
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.targetName}</div>
                    <div className="text-sm text-gray-500">{row.employeeCode}</div>
                </div>
            )
        },
        {
            header: "Designation",
            accessor: "designation",
            cell: row => (
                <div className="text-sm text-gray-900">
                    {employees.find(e => e.id === row.targetId)?.designation || '-'}
                </div>
            )
        },
        {
            header: "Structure",
            accessor: "structureName",
            cell: row => (
                <div className="font-medium text-indigo-600">{row.structureName}</div>
            )
        },
        {
            header: "Type",
            accessor: "type",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.type === 'designation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {row.type === 'designation' ? 'Designation Based' : 'Individual'}
                </span>
            )
        },
        {
            header: "Effective Date",
            accessor: "effectiveDate"
        },
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
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <CommonInputField
                        label="Employee Name"
                        value={''}
                        onChange={''}
                        placeholder="Enter Employee Name"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Department"
                        value={''}
                        onChange={''}
                        options={[]}
                        placeholder="Select Department"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Designation"
                        value={''}
                        onChange={''}
                        options={[]}
                        placeholder="Select Designation"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Salary Component"
                        value={''}
                        onChange={''}
                        options={[]}
                        placeholder="Select Salary Component"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Structure"
                        value={''}
                        onChange={''}
                        options={[]}
                        placeholder="Select Structure"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Status"
                        value={''}
                        onChange={''}
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Probation', value: 'Probation' },
                            { label: 'Terminated', value: 'Terminated' }
                        ]}
                        placeholder="Select Status"
                        loading={isLoading.normal}
                    />
                    {isLoading.normal ? (
                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-300 animate-pulse">
                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    ) : (
                        <div className="flex mt-6 gap-3">
                            <button
                                onClick={''}
                                disabled={isSearchDisabled}
                                className={`px-6 text-white rounded-md h-8 ${isSearchDisabled
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-500 hover:bg-indigo-600 cursor-pointer'
                                    }`}
                            >
                                Search
                            </button>

                            <button onClick={''}
                                className="h-8 w-8 flex cursor-pointer items-center justify-center  border bg-gray-200 border-gray-400 rounded-md hover:border-gray-400 text-gray-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>)}
                </div>

            </div>

            <CommonTable
                columns={assignmentColumns}
                data={assignments}
            />
        </>
    )
}

export default SalaryAssignmentListPage