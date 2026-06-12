import React from "react"
import CommonDropDown from "../../basicComponents/CommonDropDown"

function SingleLeaveAllocation({
    employeeOptions,
    selectedEmpCode,
    onEmployeeChange,
    leaveSelections,
    toggleLeaveSelection,
    updateLeaveSelection,
    selectAllLeaves,
    deselectAllLeaves,
    isEditMode = false
}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="max-w-md">
                        <CommonDropDown
                            label="Select Employee"
                            required
                            value={selectedEmpCode}
                            onChange={onEmployeeChange}
                            options={employeeOptions}
                            placeholder="Choose an employee"
                            disabled={isEditMode}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Leave Types to Allocate</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => selectAllLeaves('single')}
                                className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                            >
                                Select All
                            </button>
                            <button
                                onClick={() => deselectAllLeaves('single')}
                                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div className="border border-indigo-200 rounded-lg overflow-auto scrollbar">
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Leave Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Default Days</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Allocated Days</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Valid From</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Valid To</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {leaveSelections && leaveSelections.length > 0 ? (
                                    leaveSelections.map((selection, index) => (
                                        <tr key={selection.leave_code} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selection.selected}
                                                onChange={() => toggleLeaveSelection(index)}
                                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${selection.leave_color || 'bg-indigo-50 text-indigo-700'}`}>
                                                {selection.leave_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-sm">{selection.default_days} days</td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={selection.allocated_days}
                                                onChange={(e) => updateLeaveSelection(index, 'allocated_days', e.target.value)}
                                                disabled={!selection.selected}
                                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                min="0"
                                                max="365"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                value={selection.valid_from}
                                                onChange={(e) => updateLeaveSelection(index, 'valid_from', e.target.value)}
                                                disabled={!selection.selected}
                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                value={selection.valid_to}
                                                onChange={(e) => updateLeaveSelection(index, 'valid_to', e.target.value)}
                                                disabled={!selection.selected}
                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={selection.note}
                                                onChange={(e) => updateLeaveSelection(index, 'note', e.target.value)}
                                                disabled={!selection.selected}
                                                placeholder="Optional"
                                                className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-gray-500">{selectedEmpCode==="" ?"Please Select Employee" : "No Leave Types Found"}</td>
                                    </tr>
                                )
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Selected Leaves:</span>
                            <span className="font-semibold text-indigo-600">
                                {leaveSelections.filter(s => s.selected).length} types
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-gray-700">Total Days Allocated:</span>
                            <span className="font-semibold text-indigo-600">
                                {leaveSelections.filter(s => s.selected).reduce((sum, s) => sum + parseInt(s.allocated_days || 0), 0)} days
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SingleLeaveAllocation