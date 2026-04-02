import { Edit, RefreshCw, Unlink } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonTable from '../../basicComponents/commonTable'
import { ApiCall } from '../../library/constants'

function SalaryAssignmentListPage({ isLoading, onEditAssignment }) {

    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        fetchAssignments()
    }, [])

    async function fetchAssignments() {
        try {
            const res = await ApiCall("get", "/salarystructure/getassignments")

            if (res?.data?.success) {

                // 🔥 FLATTEN DATA (IMPORTANT)
                const processed = res.data.data.flatMap(row => {

                    const netCost = Math.round(row.net_salary || 0)

                    // ── EMPLOYEE BASED ─────────────────
                    if (row.type === 'employee') {
                        return [{
                            ...row,
                            display_name: row.target_name,
                            display_code: row.emp_code,
                            display_designation: row.employee_designation,
                            display_department: row.employee_department,
                            netCost
                        }]
                    }

                    // ── DESIGNATION BASED ──────────────
                    if (row.type === 'designation' && row.mapped_employees?.length) {
                        return row.mapped_employees.map(emp => ({
                            ...row,
                            display_name: emp.emp_name,
                            display_code: emp.emp_code,
                            display_designation: emp.designation,
                            display_department: emp.department,
                            netCost
                        }))
                    }

                    return []
                })

                setAssignments(processed)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const [filters, setFilters] = useState({
        employee: '',
        designation: '',
        structure: '',
        status: ''
    })

    const handleSearch = async () => {
        try {
            const query = new URLSearchParams(filters).toString()
            const res = await ApiCall("get", `/salarystructure/assignments?${query}`)
            if (res?.data?.success) {
                setAssignments(res.data.data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleReset = () => {
        setFilters({
            employee: '',
            designation: '',
            structure: '',
            status: ''
        })
        fetchAssignments()
    }

    const assignmentColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    {row.status ? (
                        <button
                            onClick={() => onEditAssignment && onEditAssignment(row.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                    ) : null}

                    {row.status ? (
                        <button
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            title="Unassign"
                        >
                            <Unlink size={16} />
                        </button>
                    ) : (
                        <button disabled className="text-gray-300">
                            <Unlink size={16} />
                        </button>
                    )}
                </div>
            )
        },

        // 🔥 EMPLOYEE COLUMN
        {
            header: "Employee",
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">
                        {row.display_name || '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                        {row.display_code || '-'}
                    </div>
                </div>
            )
        },

        // 🔥 DESIGNATION
        {
            header: "Designation",
            cell: row => (
                <div className="text-sm text-gray-900">
                    {row.display_designation || '-'}
                </div>
            )
        },

        // 🔥 DEPARTMENT (NEW - OPTIONAL BUT NICE)
        {
            header: "Department",
            cell: row => (
                <div className="text-sm text-gray-700">
                    {row.display_department || '-'}
                </div>
            )
        },

        {
            header: "Structure",
            cell: row => (
                <div className="font-medium text-indigo-600">
                    {row.structure_name}
                </div>
            )
        },

        {
            header: "Type",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.type === 'designation'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                }`}>
                    {row.type === 'designation'
                        ? 'Designation Based'
                        : 'Employee'}
                </span>
            )
        },

        // 🔥 COST (FROM BACKEND)
        {
            header: "Monthly Cost",
            cell: row => (
                <span className="font-semibold text-green-600">
                    ₹ {row.netCost?.toLocaleString('en-IN') || 0}
                </span>
            )
        },

        {
            header: "Effective Date",
            cell: row => (
                row.effective_date
                    ? new Date(row.effective_date).toLocaleDateString('en-IN')
                    : '-'
            )
        },

        {
            header: "Status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    row.status
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {row.status ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ]

    return (
        <>
            {/* FILTERS */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <CommonInputField
                        label="Employee Name"
                        value={filters.employee}
                        onChange={v => setFilters(f => ({ ...f, employee: v }))}
                        placeholder="Enter Employee Name"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Designation"
                        value={filters.designation}
                        onChange={v => setFilters(f => ({ ...f, designation: v }))}
                        options={[]}
                        placeholder="Select Designation"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Structure"
                        value={filters.structure}
                        onChange={v => setFilters(f => ({ ...f, structure: v }))}
                        options={[]}
                        placeholder="Select Structure"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="Status"
                        value={filters.status}
                        onChange={v => setFilters(f => ({ ...f, status: v }))}
                        options={[
                            { label: 'Active', value: '1' },
                            { label: 'Inactive', value: '0' }
                        ]}
                        placeholder="Select Status"
                        loading={isLoading.normal}
                    />

                    <div className="flex mt-6 gap-3">
                        <button
                            onClick={handleSearch}
                            className="px-6 text-white rounded-md h-8 bg-indigo-500 hover:bg-indigo-600"
                        >
                            Search
                        </button>

                        <button
                            onClick={handleReset}
                            className="h-8 w-8 flex items-center justify-center border bg-gray-200 border-gray-400 rounded-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <CommonTable
                columns={assignmentColumns}
                data={assignments}
            />
        </>
    )
}

export default SalaryAssignmentListPage