import React from "react";
import CommonDropDown from "../../basicComponents/CommonDropDown";

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
    designations,
    employees,
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
                                options={roles}
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
                                    options={departments}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={designations}
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
                                    options={departments}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={designations}
                                    placeholder="Choose designation"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Employee"
                                    value={selectedEmployee}
                                    onChange={setSelectedEmployee}
                                    options={employees}
                                    placeholder="Choose an employee"
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
export default MenuMappingTypeSection