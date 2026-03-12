import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonInputField from '../../basicComponents/CommonInputField'
import { Package, Plus, X } from 'lucide-react'

function StructureComponents({ isLoading, addComponent, structure, removeComponent, salaryComponents, updateComponent, calculationOptions, baseOptions }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        Salary Components
                    </h2>
                    <button
                        type="button"
                        onClick={addComponent}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Component
                    </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar">
                    {structure.components.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No components added</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Click "Add Component" to start building your salary structure
                            </p>
                        </div>
                    ) : (
                        structure.components.map((component, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            Component #{index + 1}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${component.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {component.type === 'earning' ? 'Earning' : 'Deduction'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeComponent(index)}
                                        className="p-1 hover:bg-red-50 text-red-600 hover:text-red-800 rounded"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <CommonDropDown
                                        label="Component *"
                                        value={component.componentId?.toString() || ''}
                                        options={salaryComponents.map(c => ({
                                            value: c.id.toString(),
                                            label: `${c.name} (${c.code})`
                                        }))}
                                        onChange={v => updateComponent(index, 'componentId', v)}
                                        loading={isLoading.normal}
                                    />

                                    <CommonDropDown
                                        label="Calculation Type *"
                                        value={component.calculation}
                                        options={calculationOptions}
                                        onChange={v => updateComponent(index, 'calculation', v)}
                                    />

                                    <CommonInputField
                                        label={component.calculation === 'percentage' ? 'Percentage *' : 'Amount *'}
                                        value={component.amount?.toString() || ''}
                                        onChange={v => updateComponent(index, 'amount', parseFloat(v) || 0)}
                                        placeholder={component.calculation === 'percentage' ? 'e.g., 40' : 'e.g., 50000'}
                                        type="number"
                                        required
                                    />

                                    {component.calculation === 'percentage' && (
                                        <CommonDropDown
                                            label="Based On *"
                                            value={component.basedOn || ''}
                                            options={baseOptions}
                                            onChange={v => updateComponent(index, 'basedOn', v)}
                                        />
                                    )}
                                </div>

                                {/* Component Preview */}
                                <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-gray-900">{component.name || 'Unnamed Component'}</span>
                                            <span className="ml-2 text-sm text-gray-500 font-mono">({component.code || 'CODE'})</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium text-gray-900">
                                                {component.calculation === 'percentage'
                                                    ? `${component.amount || 0}%`
                                                    : `₹${(component.amount || 0).toLocaleString()}`
                                                }
                                            </span>
                                            {component.calculation === 'percentage' && component.basedOn && (
                                                <div className="text-xs text-gray-500">of {component.basedOn}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default StructureComponents