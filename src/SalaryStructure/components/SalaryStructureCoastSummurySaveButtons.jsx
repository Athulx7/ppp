import { Calculator, Clock, Eye, Save } from 'lucide-react'
import React from 'react'

function SalaryStructureCoastSummurySaveButtons({ structure, calculateTotalCost, isSaving, isEditMode, handleCancel }) {
    return (
        <>
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-indigo-600" />
                        Cost Summary
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Number of Components</span>
                            <span className="font-medium text-gray-900">{structure.components.length}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Earnings</span>
                            <span className="font-medium text-green-600">
                                {structure.components.filter(c => c.type === 'earning').length}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Deductions</span>
                            <span className="font-medium text-red-600">
                                {structure.components.filter(c => c.type === 'deduction').length}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-900">Estimated Monthly Cost</span>
                                <span className="text-2xl font-bold text-indigo-600">
                                    ₹{calculateTotalCost().toLocaleString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Based on basic salary calculation
                            </p>
                        </div>
                    </div>
                </div>

                {/* Component Statistics Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-indigo-600" />
                        Component Statistics
                    </h2>

                    <div className="space-y-2 max-h-72 overflow-y-auto scrollbar">
                        {structure.components.length > 0 ? (
                            <div className="space-y-2">
                                {structure.components.map((comp, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${comp.type === 'earning' ? 'bg-green-500' : 'bg-red-500'
                                                }`}></div>
                                            <span className="text-sm text-gray-700 truncate">{comp.name || 'Unnamed'}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {comp.calculation === 'percentage'
                                                    ? `${comp.amount}%`
                                                    : `₹${(comp.amount || 0).toLocaleString()}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No components added yet</p>
                        )}
                    </div>
                </div>

                {/* Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {isEditMode ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {isEditMode ? 'Update Structure' : 'Create Structure'}
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <div className="pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={14} />
                                    <span>Last saved: {new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="text-xs">
                                    {structure.components.length === 0
                                        ? 'Add at least one component to save'
                                        : 'All changes will be saved when you submit'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalaryStructureCoastSummurySaveButtons