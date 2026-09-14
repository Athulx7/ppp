import React from 'react';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonTable from '../../basicComponents/commonTable';
import { DownloadCloud, Users, DollarSign, TrendingUp, Award, Filter, RotateCcw } from 'lucide-react';

function CtcReportFilterAndView({
    viewMode,
    ctcData,
    currentUser,
    departments,
    designations,
    selectedDepartment,
    setSelectedDepartment,
    selectedDesignation,
    setSelectedDesignation,
    selectedEmployee,
    setSelectedEmployee,
    searchQuery,
    setSearchQuery,
    ctcColumns,
    filteredData,
    summary,
    handleExportAll
}) {
    const hasActiveFilters = Boolean(selectedDepartment || selectedDesignation || selectedEmployee);

    return (
        <div className="space-y-5">
            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-800">Mapped Staff</p>
                                <p className="text-2xl font-black text-indigo-950 mt-1">{summary.totalEmployees || 0}</p>
                                <p className="text-[11px] text-indigo-600 mt-0.5">With active salary structure</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Total Annual CTC</p>
                                <p className="text-2xl font-black text-emerald-950 mt-1">₹{(summary.totalCTC || 0).toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-emerald-600 mt-0.5">Annual payroll commitment</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-blue-800">Average Annual CTC</p>
                                <p className="text-2xl font-black text-blue-950 mt-1">₹{(summary.averageCTC || 0).toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-blue-600 mt-0.5">Per mapped employee</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-purple-800">Annual Employer Benefits</p>
                                <p className="text-2xl font-black text-purple-950 mt-1">₹{(summary.totalEmployerBenefits || 0).toLocaleString('en-IN')}</p>
                                <p className="text-[11px] text-purple-600 mt-0.5">Statutory & employer perks</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-gray-800">Filter Directory</h3>
                        <span className="text-xs text-gray-400 font-normal">
                            ({filteredData.length} records)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setSelectedEmployee('');
                                    setSelectedDepartment('');
                                    setSelectedDesignation('');
                                    setSearchQuery?.('');
                                }}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset
                            </button>
                        )}
                        <button
                            onClick={handleExportAll}
                            disabled={!filteredData || filteredData.length === 0}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md cursor-pointer text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                            title="Export filtered list to CSV"
                        >
                            <DownloadCloud className="w-3.5 h-3.5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 items-end">
                    {(viewMode === 'all' || currentUser.role === 'hr' || currentUser.role === 'admin' || currentUser.role === 'payroll_manager') && (
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
                            ...ctcData.map(emp => ({
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
                    columns={ctcColumns}
                    data={filteredData}
                    itemsPerPage={10}
                    showSearch={true}
                    showPagination={true}
                />
            </div>
    )
}

export default CtcReportFilterAndView