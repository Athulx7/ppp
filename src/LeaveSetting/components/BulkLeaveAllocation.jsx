import React from "react"
import CommonDropDown from "../../basicComponents/CommonDropDown"
import CommonDatePicker from "../../basicComponents/CommonDatePicker"
import { Users, Briefcase, Award, User, Layers } from "lucide-react"
import CommonInputField from "../../basicComponents/CommonInputField"

function BulkLeaveAllocation({
    bulkDropdowns,
    bulkAllocation, setBulkAllocation,
    bulkLeaveSelections, toggleBulkLeaveSelection, updateBulkLeaveSelection,
    selectAllLeaves, deselectAllLeaves,
    getSelectedLeavesCount, getTargetEmployeesCount, getTotalAllocationsCount
}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apply to *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'all' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="apply_to"
                                    value="all"
                                    checked={bulkAllocation.apply_to === 'all'}
                                    onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Users className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                    <div className="font-medium">All Employees</div>
                                </div>
                            </label>

                            <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'department' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="apply_to"
                                    value="department"
                                    checked={bulkAllocation.apply_to === 'department'}
                                    onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Briefcase className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                    <div className="font-medium">Department</div>
                                </div>
                            </label>

                            <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'designation' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="apply_to"
                                    value="designation"
                                    checked={bulkAllocation.apply_to === 'designation'}
                                    onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <Award className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                    <div className="font-medium">Designation</div>
                                </div>
                            </label>

                            <label className={`p-3 border rounded-lg cursor-pointer ${bulkAllocation.apply_to === 'employment-type' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                                <input
                                    type="radio"
                                    name="apply_to"
                                    value="employment-type"
                                    checked={bulkAllocation.apply_to === 'employment-type'}
                                    onChange={(e) => setBulkAllocation({ ...bulkAllocation, apply_to: e.target.value })}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <User className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
                                    <div className="font-medium">Employment Type</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {bulkAllocation.apply_to === 'department' && (
                        <CommonDropDown
                            required
                            label="Select Department"
                            value={bulkAllocation.department}
                            onChange={(val) => setBulkAllocation({ ...bulkAllocation, department: val })}
                            options={bulkDropdowns.department}
                            placeholder="Choose department"
                        />
                    )}

                    {bulkAllocation.apply_to === 'designation' && (
                        <CommonDropDown
                            required
                            label="Select Designation"
                            value={bulkAllocation.designation}
                            onChange={(val) => setBulkAllocation({ ...bulkAllocation, designation: val })}
                            options={bulkDropdowns.designation}
                            placeholder="Choose designation"
                        />
                    )}

                    {bulkAllocation.apply_to === 'employment-type' && (
                        <CommonDropDown
                            required
                            label="Select Employment Type"
                            value={bulkAllocation.employment_type}
                            onChange={(val) => setBulkAllocation({ ...bulkAllocation, employment_type: val })}
                            options={bulkDropdowns.employmentType}
                            placeholder="Choose employment type"
                        />
                    )}

                    <div className="grid grid-cols-3 gap-3">
                        <CommonDatePicker
                            label="Valid From"
                            value={bulkAllocation.valid_from}
                            onChange={(val) => setBulkAllocation({ ...bulkAllocation, valid_from: val })}
                            placeholder="Start date"
                        />
                        <CommonDatePicker
                            label="Valid To"
                            value={bulkAllocation.valid_to}
                            onChange={(val) => setBulkAllocation({ ...bulkAllocation, valid_to: val })}
                            placeholder="End date"
                        />
                        <CommonInputField
                            label="Note (Optional)"
                            value={bulkAllocation.note}
                            onChange={(e) => setBulkAllocation({ ...bulkAllocation, note: e.target.value })}
                            placeholder="Add any notes for this bulk allocation"
                        />
                    </div>

                    <div className="pt-1">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-900">Select Leave Types to Allocate</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => selectAllLeaves('bulk')}
                                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => deselectAllLeaves('bulk')}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>

                        <div className="border border-indigo-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Select</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Leave Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Default Days</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Allocated Days</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Applicable To</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bulkLeaveSelections.map((selection, index) => (
                                        <tr key={selection.leave_code} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selection.selected}
                                                    onChange={() => toggleBulkLeaveSelection(index)}
                                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selection.leave_color || 'bg-gray-100 text-gray-700'}`}>
                                                    {selection.leave_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm">{selection.default_days} days</td>
                                            <td className="px-4 py-2">
                                                <input
                                                    type="number"
                                                    value={selection.allocated_days}
                                                    onChange={(e) => updateBulkLeaveSelection(index, 'allocated_days', e.target.value)}
                                                    disabled={!selection.selected}
                                                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                                                    min="0"
                                                    max="365"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex gap-1 flex-wrap">
                                                    {(selection.applicable_to || []).map(type => (
                                                        <span key={type} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Preview Summary */}
                    {getSelectedLeavesCount() > 0 && getTargetEmployeesCount() > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Layers className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Bulk Allocation Preview</p>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This will create <span className="font-semibold">{getTotalAllocationsCount()}</span> leave allocations:
                                    </p>
                                    <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside">
                                        <li>{getSelectedLeavesCount()} leave type(s) selected</li>
                                        <li>{getTargetEmployeesCount()} employee(s) targeted</li>
                                        <li>Valid from {bulkAllocation.valid_from || 'start date'} to {bulkAllocation.valid_to || 'end date'}</li>
                                        <li>Only employees with applicable employment type will receive each leave type</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default BulkLeaveAllocation