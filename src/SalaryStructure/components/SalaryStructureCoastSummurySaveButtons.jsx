import { Calculator, Clock, Eye, Save, TrendingUp, TrendingDown, Building2 } from 'lucide-react'
import React from 'react'

const TYPE_ICON_POOL = [TrendingUp, TrendingDown, Building2, TrendingUp, TrendingDown, Building2]
const TYPE_COLOR_POOL = [
    { icon: 'text-emerald-500', count: 'text-emerald-600' },
    { icon: 'text-red-500', count: 'text-red-600' },
    { icon: 'text-blue-500', count: 'text-blue-600' },
    { icon: 'text-violet-500', count: 'text-violet-600' },
    { icon: 'text-amber-500', count: 'text-amber-600' },
    { icon: 'text-cyan-500', count: 'text-cyan-600' },
]
const FALLBACK_DOT_COLOR = 'bg-gray-300'
const DOT_COLOR_POOL = [
    'bg-emerald-400', 'bg-red-400', 'bg-blue-400',
    'bg-violet-400', 'bg-amber-400', 'bg-cyan-400',
]

function compValueDisplay(comp, calculationOptions, values) {
    const calcType = calculationOptions.find(c => c.value === comp.calc_code)
    if (!calcType) return '—'
    if (!calcType.requires_formula && !calcType.requires_percentage) {
        return comp.fixed_amount
            ? `₹${Number(comp.fixed_amount).toLocaleString('en-IN')}`
            : '—'
    }
    if (calcType.requires_percentage) {
        return comp.percentage_value
            ? `${comp.percentage_value}% of ${comp.base_component_code || '—'}`
            : '—'
    }
    if (calcType.requires_formula) {
        return comp.formula_expression
            ? <span className="font-mono text-xs">{comp.formula_expression}</span>
            : '—'
    }
    return '—'
}

function SalaryStructureCoastSummurySaveButtons({
    structure,
    calculationOptions,
    componentTypes,
    calculatedValues,
    netCost,
    breakdown,
    isSaving,
    isEditMode,
    isBasicInfoComplete,
    handleCancel,
    isViewMode,
}) {

    const hasComponents = structure.components.length > 0
    const canSave = isBasicInfoComplete && hasComponents

    const countByType = {}
    structure.components.forEach(c => {
        if (c.type_code) countByType[c.type_code] = (countByType[c.type_code] || 0) + 1
    })

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    Cost Summary
                </h2>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Total Components</span>
                        <span className="font-semibold text-gray-900">{structure.components.length}</span>
                    </div>

                    {componentTypes.map((type, i) => {
                        const count = countByType[type.value] || 0
                        const IconComp = TYPE_ICON_POOL[i] || TrendingUp
                        const colorEntry = TYPE_COLOR_POOL[i] || { icon: 'text-gray-400', count: 'text-gray-600' }
                        return (
                            <div key={type.value} className="flex items-center justify-between text-sm">
                                <span className={`flex items-center gap-1.5 text-gray-500`}>
                                    <IconComp size={13} className={colorEntry.icon} />
                                    {type.label}
                                </span>
                                <span className={`font-semibold ${colorEntry.count}`}>{count}</span>
                            </div>
                        )
                    })}

                    <div className="border-t border-gray-200 pt-3 mt-1">
                        <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-gray-700 leading-tight">
                                Est. Monthly Cost
                            </span>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-indigo-600 leading-none">
                                    ₹{netCost.toLocaleString('en-IN')}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">fixed + percentage only</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Component Breakdown
                </h2>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                    {structure.components.length > 0 ? (
                        structure.components.map((comp, index) => {
                            const typeIndex = componentTypes.findIndex(t => t.value === comp.type_code)
                            const dotColor = typeIndex >= 0
                                ? (DOT_COLOR_POOL[typeIndex] || FALLBACK_DOT_COLOR)
                                : FALLBACK_DOT_COLOR

                            return (
                                <div key={index}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-800 truncate font-medium">
                                                {comp.component_name || 'Unnamed'}
                                            </p>
                                            <p className="text-xs text-gray-400 font-mono">
                                                {comp.component_code || '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {compValueDisplay(comp, calculationOptions)}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-sm text-gray-400 text-center py-6">No components added yet</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-base font-bold text-gray-900 mb-4">Actions</h2>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={isSaving || !canSave || isViewMode}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold
                                   hover:bg-indigo-700 active:bg-indigo-800 transition-colors
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2 shadow-sm"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                {isEditMode ? 'Updating…' : 'Creating…'}
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {isEditMode ? 'Update Structure' : 'Create Structure'}
                            </>
                        )}
                    </button>

                    <button type="button" onClick={handleCancel}
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl
                                   font-semibold hover:bg-gray-50 active:bg-gray-100 transition-colors">
                        Cancel
                    </button>

                    <div className="pt-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                            <Clock size={11} />
                            <span>Today: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        {!isBasicInfoComplete && (
                            <p className="text-amber-500">⚠ Fill in Structure Name and Effective Date.</p>
                        )}
                        {isBasicInfoComplete && !hasComponents && (
                            <p className="text-amber-500">⚠ Add at least one component before saving.</p>
                        )}
                        {canSave && (
                            <p className="text-green-500">✓ {structure.components.length} component{structure.components.length !== 1 ? 's' : ''} ready to save.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SalaryStructureCoastSummurySaveButtons