import React from 'react'
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import { Plus, Save, X } from 'lucide-react';
import CommonToggleButton from '../../basicComponents/CommonToggleButton';

function SalaryComponentModal({
    controls,
    dropdownOptions,
    newComponent,
    handleChange,
    insertOperator,
    insertComponentCode,
    handleCreateComponent,
    onClose,
    selectedComponent,
    allComponentCodes = [],
    errors
}) {
    const calcOptions = dropdownOptions["calc_code"] || []

    const selectedCalc = calcOptions.find(
        c => c.value === newComponent.calc_code
    )

    const getDropdownOptions = (control) => {
        return dropdownOptions[control.column_name] || []
    }

    const renderField = (control) => {

        if (!control.visible) return null
        if (control.field_type !== "toggle" && control.is_disable) return null

        const commonProps = {
            label: control.label,
            value: newComponent[control.column_name] || "",
            onChange: v => handleChange(control.column_name, v),
            required: control.required,
            disabled: control.readonly,
            errorMessage: errors[control.column_name]
        }

        if (control.field_type === "text") {
            return (
                <CommonInputField
                    key={control.id}
                    placeholder={`Enter ${control.label}`}
                    {...commonProps}
                    regex={control.regex}
                />
            )
        }

        if (control.field_type === "dropdown") {
            return (
                <CommonDropDown
                    key={control.id}
                    placeholder={`Select ${control.label}`}
                    {...commonProps}
                    options={getDropdownOptions(control)}
                />
            )
        }

        if (control.field_type === "toggle") {
            return (
                <CommonToggleButton
                    key={control.id}
                    label={control.label}
                    value={newComponent[control.column_name] || 0}
                    onChange={v => handleChange(control.column_name, v)}
                    required={control.required}
                    disabled={control.readonly}
                />
            )
        }
        return null
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/80 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedComponent ? 'Edit Component' : 'Create New Component'}
                                </h3>
                                <p className="text-gray-600">Configure salary component details and calculation</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar">
                                {controls
                                    .filter(c => c.priority <= 4 || c.field_type === "toggle")
                                    .map(control => renderField(control))}
                            </div>

                            <div className="space-y-4">
                                <CommonDropDown
                                    label="Calculation Type"
                                    value={newComponent.calc_code}
                                    options={dropdownOptions["calc_code"] || []}
                                    onChange={v => handleChange("calc_code", v)}
                                />

                                {selectedCalc?.requires_formula && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Formula <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Formula:</span>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => insertOperator('+')}
                                                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => insertOperator('-')}
                                                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                        >
                                                            -
                                                        </button>
                                                        <button
                                                            onClick={() => insertOperator('*')}
                                                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                        >
                                                            ×
                                                        </button>
                                                        <button
                                                            onClick={() => insertOperator('/')}
                                                            className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                        >
                                                            ÷
                                                        </button>
                                                    </div>
                                                </div>
                                                <CommonInputField
                                                    label=""
                                                    value={newComponent.formula}
                                                    onChange={v => handleChange('formula', v)}
                                                    placeholder="Select formula using component codes"
                                                    className="font-mono"
                                                />
                                                <div className="text-sm text-gray-500 mt-1"> (e.g., BASIC * 0.5 + HRA)</div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-700 mb-2">Available Components:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {allComponentCodes.map(comp => (
                                                        <button
                                                            key={comp.value}
                                                            onClick={() => insertComponentCode(comp.value)}
                                                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                                                        >
                                                            {comp.value}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )}
                                {selectedCalc?.requires_percentage && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Percentage Configuration <span className="ml-1 text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <CommonInputField
                                                label=""
                                                value={newComponent.formula}
                                                onChange={v => handleChange('formula', v)}
                                                placeholder="e.g., 40"
                                                className="w-24"
                                            />
                                            <span className="text-gray-700">% of</span>
                                            <CommonDropDown
                                                label=""
                                                value=""
                                                options={allComponentCodes}
                                                onChange={v => handleChange('formula', newComponent.formula + ' of ' + v)}
                                            />
                                        </div>
                                    </div>
                                )}
                                {!selectedCalc?.requires_formula &&
                                    !selectedCalc?.requires_percentage && (
                                        <CommonInputField
                                            required
                                            label="Fixed Value"
                                            value={newComponent.formula}
                                            onChange={v => handleChange('formula', v)}
                                            placeholder={'Enter the value'}
                                        />
                                    )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 cursor-pointer py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateComponent}
                                className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                {selectedComponent ? (
                                    <>
                                        <Save size={16} />
                                        Update Component
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        Create Component
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalaryComponentModal