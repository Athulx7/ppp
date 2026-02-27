import React from 'react'
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import { Plus, Save, X } from 'lucide-react';
import CommonToggleButton from '../../basicComponents/CommonToggleButton';

function SalaryComponentModal({ insertComponentCode, baseComponentOptions, allComponentCodes, setShowCreateModal, setSelectedComponent, selectedComponent, newComponent, handleChange, insertOperator, componentTypeOptions, calculationTypeOptions, handleCreateComponent }) {
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
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedComponent(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <CommonInputField
                                    label="Component Code"
                                    value={newComponent.code}
                                    onChange={v => handleChange('code', v.toUpperCase())}
                                    placeholder="e.g., BASIC, HRA, EPF"
                                    required={true}
                                />
                                <CommonInputField
                                    label="Component Name"
                                    value={newComponent.name}
                                    onChange={v => handleChange('name', v)}
                                    placeholder="e.g., Basic Salary, House Rent Allowance"
                                    required={true}
                                />
                                <CommonDropDown
                                    label="Component Type"
                                    value={newComponent.type}
                                    options={componentTypeOptions}
                                    onChange={v => handleChange('type', v)}
                                    required={true}
                                />
                                <CommonInputField
                                    label="Priority Order"
                                    value={newComponent.priority.toString()}
                                    onChange={v => handleChange('priority', parseInt(v) || 1)}
                                    placeholder="1"
                                    type="number"
                                />
                            </div>

                            <div className="space-y-4">
                                <CommonDropDown
                                    label="Calculation Type"
                                    value={newComponent.calculationType}
                                    options={calculationTypeOptions}
                                    onChange={v => handleChange('calculationType', v)}
                                />

                                {newComponent.calculationType === 'formula' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Formula *
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
                                                    placeholder="Enter formula using component codes (e.g., BASIC * 0.5 + HRA)"
                                                    className="font-mono"
                                                />
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
                                ) : newComponent.calculationType === 'percentage' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Percentage Configuration *
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
                                                options={baseComponentOptions}
                                                onChange={v => handleChange('formula', newComponent.formula + ' of ' + v)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <CommonInputField
                                        label="Description *"
                                        value={newComponent.formula}
                                        onChange={v => handleChange('formula', v)}
                                        placeholder={
                                            newComponent.calculationType === 'fixed' ? 'e.g., ₹200 per month' :
                                                newComponent.calculationType === 'attendance' ? 'e.g., Daily Rate × Present Days' :
                                                    newComponent.calculationType === 'sales' ? 'e.g., Sales Amount × Commission %' :
                                                        'e.g., Based on KPI Score'
                                        }
                                    />
                                )}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Affects Gross Salary</p>
                                            <p className="text-xs text-gray-500">Include in gross salary calculation</p>
                                        </div>
                                        <CommonToggleButton
                                            value={newComponent.affectsGross}
                                            onChange={v => handleChange('affectsGross', v)}
                                            yesLabel="Yes"
                                            noLabel="No"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setSelectedComponent(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateComponent}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
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