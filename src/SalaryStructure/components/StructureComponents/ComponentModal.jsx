import { ChevronRight, Pencil, Plus, X } from "lucide-react"
import FormulaBuilder from "./FormulaBuilder"
import { BLANK_FORM, buildTypeMap } from "./typeUtils"
import CommonDropDown from "../../../basicComponents/CommonDropDown"
import CommonInputField from "../../../basicComponents/CommonInputField"
import { showStatusToast } from "../../../basicComponents/CommonStatusPopUp"
import { useEffect, useState } from "react"

function ComponentModal({
    isOpen, onClose, onSave,
    initialData, editIndex,
    salaryComponents, calculationOptions, baseOptions,
    componentTypes, isLoading,
    existingComponents = [],
}) {
    const [form, setForm] = useState({ ...BLANK_FORM })
    const [duplicateError, setDuplicateError] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setForm(initialData ? { ...initialData } : { ...BLANK_FORM })
            setDuplicateError(false)
        }
    }, [isOpen, initialData])

    if (!isOpen) return null

    const calcType = calculationOptions.find(c => c.value === form.calc_code)
    const isFixed = calcType && !calcType.requires_formula && !calcType.requires_percentage
    const isPercentage = calcType?.requires_percentage
    const isFormula = calcType?.requires_formula
    const isEditing = editIndex !== null && editIndex !== undefined

    const typeMap = buildTypeMap(componentTypes)

    const componentOptions = salaryComponents.map(c => ({
        value: c.id,
        label: `${c.component_name} (${c.component_code})`,
    }))

    const handleFieldChange = (field, value) => {
        if (field === 'componentId') setDuplicateError(false)
        setForm(prev => {
            const updated = { ...prev, [field]: value }
            if (field === 'componentId') {
                const found = salaryComponents.find(c => c.id === value || c.id === Number(value))
                if (found) {
                    return {
                        ...updated,
                        component_code: found.component_code,
                        component_name: found.component_name,
                        type_code: found.type_code,
                        calc_code: found.calc_code ?? '',
                        fixed_amount: found.fixed_amount ?? '',
                        percentage_value: found.percentage_value ?? '',
                        base_component_code: found.base_component_code ?? '',
                        formula_expression: found.formula_expression ?? '',
                    }
                }
            }
            return updated
        })
    }

    const handleSave = () => {
        if (!form.componentId) {
            showStatusToast({
                type: 'warning',
                title: 'Validation',
                message: 'Please select a component.',
                autoClose: true
            });
            return;
        }
        if (!isEditing) {
            const alreadyAdded = existingComponents.some(
                c => String(c.componentId) === String(form.componentId)
            )
            if (alreadyAdded) {
                setDuplicateError(true)
                return
            }
        }
        onSave(form, isEditing ? editIndex : null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl
                            flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                            {isEditing
                                ? <Pencil className="w-4 h-4 text-indigo-600" />
                                : <Plus className="w-5 h-5 text-indigo-600" />}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                {isEditing ? 'Edit Component' : 'Add Component'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {isEditing
                                    ? 'Modify the values for this component'
                                    : 'Choose a component and configure its calculation'}
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <CommonDropDown
                        label="Component *"
                        value={form.componentId || ''}
                        options={componentOptions}
                        onChange={v => handleFieldChange('componentId', v)}
                        loading={isLoading.normal}
                        required
                    />
                    {duplicateError && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                            <span className="text-base leading-none">⚠️</span>
                            This component is already added to the structure. Each component can only be used once.
                        </div>
                    )}
                    {form.component_code && (
                        <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <span className="text-xs text-gray-400 font-medium mr-1">Auto-filled →</span>
                            <span className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono font-semibold text-gray-700">
                                {form.component_code}
                            </span>
                            {form.type_code && (
                                <TypeBadge typeCode={form.type_code} typeMap={typeMap} />
                            )}
                            {calcType && (
                                <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-semibold text-indigo-700">
                                    {calcType.label}
                                </span>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">You can override values below</span>
                        </div>
                    )}
                    {form.component_code && (
                        <div className="border-t border-dashed border-gray-200" />
                    )}
                    {isFixed && (
                        <CommonInputField
                            label="Amount (₹) *"
                            value={form.fixed_amount ?? ''}
                            onChange={v => handleFieldChange('fixed_amount', v)}
                            placeholder="e.g. 20000"
                            type="number"
                            required
                        />
                    )}

                    {isPercentage && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CommonInputField
                                label="Percentage (%) *"
                                value={form.percentage_value ?? ''}
                                onChange={v => handleFieldChange('percentage_value', v)}
                                placeholder="e.g. 40"
                                type="number"
                                required
                            />
                            <CommonDropDown
                                label="Based On *"
                                value={form.base_component_code || ''}
                                options={baseOptions}
                                onChange={v => handleFieldChange('base_component_code', v)}
                                required
                            />
                        </div>
                    )}

                    {isFormula && (
                        <FormulaBuilder
                            value={form.formula_expression}
                            onChange={v => handleFieldChange('formula_expression', v)}
                            salaryComponents={salaryComponents}
                        />
                    )}

                    {!form.component_code && (
                        <div className="text-center py-10 text-gray-300">
                            <ChevronRight className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm text-gray-400">Select a component above to configure it</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex-shrink-0">
                    <button type="button" onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300
                                   rounded-xl hover:bg-gray-100 transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSave}
                        className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white
                                   rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors
                                   shadow-sm flex items-center gap-2">
                        {isEditing ? <Pencil size={14} /> : <Plus size={14} />}
                        {isEditing ? 'Save Changes' : 'Add Component'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ComponentModal

export function TypeBadge({ typeCode, typeMap }) {
    const entry = typeMap[typeCode]
    const label = entry?.label || typeCode || '—'
    const colors = entry?.colors || FALLBACK_COLOR
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg}`}>
            {label}
        </span>
    )
}