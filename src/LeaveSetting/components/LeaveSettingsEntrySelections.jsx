import { RefreshCw } from "lucide-react";
import CommonDropDown from "../../basicComponents/CommonDropDown";

function LeaveSettingsEntrySelections({
    selection,
    setSelection,
    selectionDropdowns,
    handleFilterChange,
    onClearFilters
}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <CommonDropDown
                        label="Department"
                        value={selection.departments}
                        onChange={(val) => handleFilterChange('departments', val)}
                        options={selectionDropdowns.departments}
                        placeholder="Filter by Department"
                    />
                    <CommonDropDown
                        label="Designation"
                        value={selection.designation}
                        onChange={(val) => handleFilterChange('designation', val)}
                        options={selectionDropdowns.designation}
                        placeholder="Filter by Designation"
                    />
                    <CommonDropDown
                        label="Hierarchy Level"
                        value={selection.hierarchyLevel}
                        onChange={(val) => handleFilterChange('hierarchyLevel', val)}
                        options={selectionDropdowns.hierarchyLevel}
                        placeholder="Filter by Hierarchy Level"
                    />
                    <CommonDropDown
                        label="Employee Type"
                        value={selection.employmentType}
                        onChange={(val) => handleFilterChange('employmentType', val)}
                        options={selectionDropdowns.employmentType}
                        placeholder="Filter by Employee Type"
                    />

                    <CommonDropDown
                        label="Employee"
                        value={selection.employee}
                        onChange={(val) => handleFilterChange('employee', val)}
                        options={selectionDropdowns.employee}
                        placeholder="Select Employee"
                    />

                    <div className="flex items-end">
                        <button
                            onClick={onClearFilters}
                            className="h-8 w-8 flex items-center justify-center border bg-gray-200 border-gray-400 rounded-md"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeaveSettingsEntrySelections