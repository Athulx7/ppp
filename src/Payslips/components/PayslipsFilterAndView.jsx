import React from 'react';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonTable from '../../basicComponents/commonTable';
import { Filter, RotateCcw, FileText } from 'lucide-react';

function PayslipsFilterAndView({
    months,
    years,
    departments,
    designations,
    viewMode,
    currentUser,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    selectedDepartment,
    setSelectedDepartment,
    selectedDesignation,
    setSelectedDesignation,
    employees,
    selectedEmployee,
    setSelectedEmployee,
    payslipColumns,
    filteredData
}) {
    const hasActiveFilters = Boolean(selectedMonth || selectedYear || selectedDepartment || selectedDesignation || selectedEmployee)

    const handleClearFilters = () => {
        setSelectedEmployee('')
        setSelectedDepartment('')
        setSelectedDesignation('')
        setSelectedMonth('')
        setSelectedYear('')
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-gray-800">Filter Payslips</h3>
                        <span className="text-xs text-gray-400 font-normal">
                            ({filteredData.length} records found)
                        </span>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Reset Filters
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-end">
                    <CommonDropDown
                        label="Month"
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        options={[
                            { label: 'All Months', value: '' },
                            ...months
                        ]}
                        placeholder="All Months"
                    />

                    <CommonDropDown
                        label="Year"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={[
                            { label: 'All Years', value: '' },
                            ...years
                        ]}
                        placeholder="All Years"
                    />

                    {(viewMode === 'all' || currentUser.role === 'hr' || currentUser.role === 'admin') && (
                        <>
                            <CommonDropDown
                                label="Department"
                                value={selectedDepartment}
                                onChange={setSelectedDepartment}
                                options={[
                                    { label: 'All Departments', value: '' },
                                    ...departments.map(dept => ({ label: dept, value: dept }))
                                ]}
                                placeholder="All Departments"
                            />

                            <CommonDropDown
                                label="Designation"
                                value={selectedDesignation}
                                onChange={setSelectedDesignation}
                                options={[
                                    { label: 'All Designations', value: '' },
                                    ...designations.map(des => ({ label: des, value: des }))
                                ]}
                                placeholder="All Designations"
                            />
                        </>
                    )}

                    <CommonDropDown
                        label="Employee"
                        value={selectedEmployee}
                        onChange={setSelectedEmployee}
                        options={[
                            { label: 'All Employees', value: '' },
                            ...employees.map(emp => ({
                                label: `${emp.emp_name} (${emp.emp_code})`,
                                value: emp.emp_code,
                                description: `${emp.designation}`
                            }))
                        ]}
                        placeholder="All Employees"
                    />
                </div>
            </div>

            <CommonTable
                columns={payslipColumns}
                data={filteredData}
                itemsPerPage={10}
                showSearch={false}
                showPagination={true}
            />
        </div>
    )
}

export default PayslipsFilterAndView