import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import CommonTable from '../../basicComponents/commonTable';

function CtcReportFilterAndView({ viewMode, ctcData, currentUser, departments, designations, selectedDepartment, setSelectedDepartment, selectedDesignation, setSelectedDesignation, selectedEmployee, setSelectedEmployee, dateRange, setDateRange, setSearchQuery, ctcColumns, filteredData }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

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
                            ...ctcData.map(emp => ({
                                label: emp.emp_name,
                                value: emp.emp_code,
                                description: `${emp.designation}`
                            }))
                        ]}
                        placeholder="Select Employee"
                    />

                    <CommonDatePicker
                        label="From Date"
                        value={dateRange.from}
                        onChange={(val) => setDateRange({ ...dateRange, from: val })}
                        placeholder="Start Date"
                    />

                    <CommonDatePicker
                        label="To Date"
                        value={dateRange.to}
                        onChange={(val) => setDateRange({ ...dateRange, to: val })}
                        placeholder="End Date"
                    />
                    <div className="flex gap-3 mt-6">
                        <button
                            className="px-4 py-2 h-10 border bg-indigo-600  text-white rounded-lg hover:bg-indigo-500"
                        >
                            View
                        </button>
                        <button
                            onClick={() => {
                                setSelectedEmployee('');
                                setSelectedDepartment('');
                                setSelectedDesignation('');
                                setSearchQuery('');
                                setDateRange({ from: '', to: '' });
                            }}
                            className="px-4 py-2 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>


            </div>

            <div className="">
                <CommonTable
                    columns={ctcColumns}
                    data={filteredData}
                    itemsPerPage={10}
                    showSearch={false}
                    showPagination={true}
                />
            </div>

        </>
    )
}

export default CtcReportFilterAndView