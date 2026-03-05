import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonTable from '../../basicComponents/commonTable';

function PayslipsFilterAndView({ months, years, departments, designations, viewMode, currentUser, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, selectedDepartment, setSelectedDepartment, selectedDesignation, setSelectedDesignation, employees, selectedEmployee, setSelectedEmployee, payslipColumns, filteredData }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <CommonDropDown
                        label="Month"
                        value={selectedMonth}
                        onChange={setSelectedMonth}
                        options={[
                            { label: 'All Months', value: '' },
                            ...months
                        ]}
                        placeholder="Filter by Month"
                    />

                    <CommonDropDown
                        label="Year"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        options={[
                            { label: 'All Years', value: '' },
                            ...years
                        ]}
                        placeholder="Filter by Year"
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
                                placeholder="Filter by Department"
                            />

                            <CommonDropDown
                                label="Designation"
                                value={selectedDesignation}
                                onChange={setSelectedDesignation}
                                options={[
                                    { label: 'All Designations', value: '' },
                                    ...designations.map(des => ({ label: des, value: des }))
                                ]}
                                placeholder="Filter by Designation"
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
                                label: emp.emp_name,
                                value: emp.emp_code,
                                description: `${emp.designation}`
                            }))
                        ]}
                        placeholder="Select Employee"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => {
                            setSelectedEmployee('');
                            setSelectedDepartment('');
                            setSelectedDesignation('');
                            setSelectedMonth('');
                            setSelectedYear('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
            <CommonTable
                columns={payslipColumns}
                data={filteredData}
                itemsPerPage={10}
                showSearch={false}
                showPagination={true}
            />
        </>
    )
}

export default PayslipsFilterAndView