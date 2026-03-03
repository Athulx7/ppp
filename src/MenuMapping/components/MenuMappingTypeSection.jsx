import React from "react";
import CommonDropDown from "../../basicComponents/CommonDropDown";
import { Download } from "lucide-react";

function MenuMappingTypeSection({
    mappingType,
    selectedRole,
    setSelectedRole,
    selectedDesignation,
    setSelectedDesignation,
    selectedDepartment,
    setSelectedDepartment,
    selectedEmployee,
    setSelectedEmployee,
    roles,
    departments,
    filteredDesignations,
    filteredEmployees,
    handleLoadMapping
}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mappingType === 'role' && (
                        <div className="col-span-1">
                            <CommonDropDown
                                label="Select Role"
                                value={selectedRole}
                                onChange={setSelectedRole}
                                options={roles.map(r => ({
                                    label: r.role_name,
                                    value: r.role_code,
                                    description: `Role ID: ${r.role_id}`
                                }))}
                                placeholder="Choose a role"
                                required
                            />
                        </div>
                    )}

                    {mappingType === 'designation' && (
                        <>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Department"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments.map(d => ({
                                        label: d.dept_name,
                                        value: d.dept_code
                                    }))}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={filteredDesignations.map(d => ({
                                        label: d.designation_name,
                                        value: d.designation_code,
                                        description: d.dept
                                    }))}
                                    placeholder="Choose a designation"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {mappingType === 'employee' && (
                        <>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Department"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments.map(d => ({
                                        label: d.dept_name,
                                        value: d.dept_code
                                    }))}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={filteredDesignations.map(d => ({
                                        label: d.designation_name,
                                        value: d.designation_code,
                                        description: d.dept
                                    }))}
                                    placeholder="Choose designation"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Employee"
                                    value={selectedEmployee}
                                    onChange={setSelectedEmployee}
                                    options={filteredEmployees.map(e => ({
                                        label: e.emp_name,
                                        value: e.emp_code,
                                        description: `${e.designation} - ${e.department}`
                                    }))}
                                    placeholder="Choose an employee"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-end">
                        <button
                            onClick={handleLoadMapping}
                            disabled={
                                (mappingType === 'role' && !selectedRole) ||
                                (mappingType === 'designation' && !selectedDesignation) ||
                                (mappingType === 'employee' && !selectedEmployee)
                            }
                            className={`w-full px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${(mappingType === 'role' && !selectedRole) ||
                                (mappingType === 'designation' && !selectedDesignation) ||
                                (mappingType === 'employee' && !selectedEmployee)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                                }`}
                        >
                            <Download className="w-4 h-4" />
                            Load Mapping
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default MenuMappingTypeSection