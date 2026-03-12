import React, { useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import { RefreshCw, Eye, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import CommonTable from '../../basicComponents/commonTable'

const ITEMS_PER_PAGE = 5

function EmployeeHistoryModal({ employeeName, history, onClose }) {
    const [page, setPage] = useState(1)
    const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE)
    const paginated = history.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"> {/*backdrop-blur-sm*/}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-b-gray-300">
                    <div>
                        <h2 className="text-black font-bold text-lg">Salary Structure History</h2>
                        <p className="text-gray-500 text-sm">{employeeName} &mdash; {history.length} records</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto scrollbar max-h-[60vh]">
                    {paginated.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No history records found.</p>
                    ) : (
                        <ol className="relative border-l border-indigo-200 ml-3">
                            {paginated.map((item, idx) => (
                                <li key={item.id} className="mb-6 ml-6 last:mb-0">
                                    {/* Dot */}
                                    <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-indigo-100 rounded-full ring-4 ring-white">
                                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                    </span>

                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                                        {/* Date & Changed by */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                {item.changedDate}
                                            </span>
                                            <span className="text-xs text-gray-500">by <span className="font-medium text-gray-700">{item.changedBy}</span></span>
                                        </div>

                                        {/* Structure change */}
                                        <div className="flex items-center gap-2 flex-wrap mt-1">
                                            <span className={`text-sm px-3 py-1 rounded-lg ${item.oldStructureName ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-400 italic'}`}>
                                                {item.oldStructureName || 'No previous structure'}
                                            </span>
                                            <ArrowRight size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="text-sm px-3 py-1 rounded-lg bg-green-50 text-green-700 font-medium">
                                                {item.newStructureName}
                                            </span>
                                        </div>

                                        {/* Reason */}
                                        {item.reason && (
                                            <p className="text-xs text-gray-500 mt-2 border-t border-gray-100 pt-2">
                                                <span className="font-medium text-gray-600">Reason: </span>{item.reason}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Page {page} of {totalPages} &bull; {history.length} records
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function SalaryHostoryListPage({ isLoading, setisLoading }) {
    const [isSearchDisabled, setIsSearchDisabled] = useState(true)
    const [selectedEmployee, setSelectedEmployee] = useState(null) // { employeeName, history[] }

    const [structureHistory, setStructureHistory] = useState([
        { id: 1, employeeId: 101, employeeName: 'John Smith', oldStructureId: null, oldStructureName: null, newStructureId: 1, newStructureName: 'Junior Software Engineer', changedDate: '2023-06-15', changedBy: 'Admin', reason: 'Initial assignment on joining' },
        { id: 2, employeeId: 101, employeeName: 'John Smith', oldStructureId: 1, oldStructureName: 'Junior Software Engineer', newStructureId: 2, newStructureName: 'Mid-Level Engineer', changedDate: '2023-12-01', changedBy: 'HR Manager', reason: 'Performance review upgrade' },
        { id: 3, employeeId: 101, employeeName: 'John Smith', oldStructureId: 2, oldStructureName: 'Mid-Level Engineer', newStructureId: 3, newStructureName: 'Senior Software Engineer', changedDate: '2024-06-01', changedBy: 'Admin', reason: 'Promotion' },
        { id: 4, employeeId: 101, employeeName: 'John Smith', oldStructureId: 3, oldStructureName: 'Senior Software Engineer', newStructureId: 4, newStructureName: 'Lead Engineer', changedDate: '2024-09-15', changedBy: 'HR Manager', reason: 'Designation change to Lead' },
        { id: 5, employeeId: 101, employeeName: 'John Smith', oldStructureId: 4, oldStructureName: 'Lead Engineer', newStructureId: 5, newStructureName: 'Principal Engineer', changedDate: '2025-01-10', changedBy: 'Admin', reason: 'Annual appraisal' },
        { id: 6, employeeId: 101, employeeName: 'John Smith', oldStructureId: 5, oldStructureName: 'Principal Engineer', newStructureId: 6, newStructureName: 'Architect', changedDate: '2025-06-01', changedBy: 'CEO', reason: 'Promoted to Architect role' },
        { id: 7, employeeId: 102, employeeName: 'Sarah Johnson', oldStructureId: null, oldStructureName: null, newStructureId: 1, newStructureName: 'Junior Software Engineer', changedDate: '2022-03-10', changedBy: 'Admin', reason: 'Initial assignment on joining' },
        { id: 8, employeeId: 102, employeeName: 'Sarah Johnson', oldStructureId: 1, oldStructureName: 'Junior Software Engineer', newStructureId: 2, newStructureName: 'Senior Software Engineer', changedDate: '2024-01-15', changedBy: 'HR Manager', reason: 'Promotion to Senior Software Engineer' },
        { id: 9, employeeId: 103, employeeName: 'Mike Chen', oldStructureId: null, oldStructureName: null, newStructureId: 3, newStructureName: 'HR Executive', changedDate: '2023-08-22', changedBy: 'Admin', reason: 'Initial assignment on joining' },
    ])

    const getEmployeeHistory = (employeeId) =>
        structureHistory.filter(h => h.employeeId === employeeId).sort((a, b) => new Date(b.changedDate) - new Date(a.changedDate))

    const latestPerEmployee = Object.values(
        structureHistory.reduce((acc, h) => {
            if (!acc[h.employeeId] || new Date(h.changedDate) > new Date(acc[h.employeeId].changedDate)) {
                acc[h.employeeId] = h
            }
            return acc
        }, {})
    )

    const historyColumns = [
        {
            header: "Actions",
            cell: row => (
                <button
                    onClick={() => setSelectedEmployee({ employeeName: row.employeeName, history: getEmployeeHistory(row.employeeId) })}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                    title="View full history"
                >
                    <Eye size={15} />
                    View
                </button>
            )
        },
        {
            header: "Employee",
            accessor: "employeeName",
            cell: row => (
                <div className="font-medium text-gray-900">{row.employeeName}</div>
            )
        },
        {
            header: "Previous Structure",
            accessor: "oldStructureName",
            cell: row => (
                <div className={row.oldStructureName ? "text-sm text-gray-600" : "text-sm text-gray-400 italic"}>
                    {row.oldStructureName || 'No previous structure'}
                </div>
            )
        },
        {
            header: "Current Structure",
            accessor: "newStructureName",
            cell: row => (
                <div className="font-medium text-green-600">{row.newStructureName}</div>
            )
        },
        {
            header: "Last Changed",
            accessor: "changedDate"
        },
        {
            header: "Changed By",
            accessor: "changedBy"
        },
        {
            header: "Reason",
            accessor: "reason",
            cell: row => (
                <div className="text-sm text-gray-600 max-w-xs truncate">{row.reason}</div>
            )
        }
    ]

    return (
        <>
            {/* History Popup */}
            {selectedEmployee && (
                <EmployeeHistoryModal
                    employeeName={selectedEmployee.employeeName}
                    history={selectedEmployee.history}
                    onClose={() => setSelectedEmployee(null)}
                />
            )}

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
                        label="Structure"
                        value={''}
                        onChange={''}
                        options={[]}
                        placeholder="Select Structure"
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
                                className="h-8 w-8 flex cursor-pointer items-center justify-center border bg-gray-200 border-gray-400 rounded-md hover:border-gray-400 text-gray-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <CommonTable
                columns={historyColumns}
                data={latestPerEmployee}
            />
        </>
    )
}

export default SalaryHostoryListPage