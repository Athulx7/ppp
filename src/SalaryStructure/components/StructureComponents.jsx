import React, { useState } from "react"
import ComponentCard from "./StructureComponents/ComponentCard"
import ComponentModal from "./StructureComponents/ComponentModal"
import { buildTypeMap, FALLBACK_COLOR, TYPE_COLOR_PALETTE } from "./StructureComponents/typeUtils"
import { Package, Plus } from "lucide-react"


function StructureComponents({ structure, addComponent, updateComponent, removeComponent, salaryComponents,
    calculationOptions, componentTypes, baseOptions, isLoading, calculatedValues, isBasicInfoComplete, isViewMode
}) {


    const [modalOpen, setModalOpen] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [initialData, setInitialData] = useState(null)

    const typeMap = buildTypeMap(componentTypes)

    const handleOpenAdd = () => {
        setEditIndex(null)
        setInitialData(null)
        setModalOpen(true)
    }

    const handleOpenEdit = (index) => {
        setEditIndex(index)
        setInitialData(structure.components[index])
        setModalOpen(true)
    }

    const handleModalSave = (formData, index) => {
        if (index !== null) {
            updateComponent(index, "__bulk__", formData)
        } else {
            addComponent(formData)
        }
    }

    const countByType = {}
    structure.components.forEach(c => {
        if (c.type_code) countByType[c.type_code] = (countByType[c.type_code] || 0) + 1
    })

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-indigo-600" />
                            Salary Components
                        </h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Add earnings, deductions and employer contributions
                        </p>
                    </div>
                    <div
                        title={!isBasicInfoComplete ? 'Please fill in Structure Name and Effective Date first' : undefined}
                    >
                        {!isViewMode && (
                            <button type="button" onClick={handleOpenAdd}
                                disabled={!isBasicInfoComplete}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold
                                            hover:bg-indigo-700 active:bg-indigo-800 transition-colors
                                            flex items-center gap-2 shadow-sm flex-shrink-0
                                            disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none">
                                <Plus size={15} />
                                Add Component
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-2.5">
                    {structure.components.length === 0 ? (
                        <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-semibold text-gray-500">No components yet</p>
                            {!isViewMode && (
                                <p className="text-xs text-gray-400 mt-1">
                                    Click{' '}
                                    <button type="button" onClick={handleOpenAdd}
                                        className="text-indigo-500 font-semibold hover:underline">
                                        Add Component
                                    </button>{' '}
                                    to start building your salary structure
                                </p>
                            )}
                        </div>
                    ) : (
                        structure.components.map((component, index) => (
                            <ComponentCard
                                key={index}
                                component={component}
                                index={index}
                                calculationOptions={calculationOptions}
                                typeMap={typeMap}
                                onEdit={handleOpenEdit}
                                onRemove={removeComponent}
                                calculatedValues={calculatedValues}
                                isViewMode={isViewMode}
                            />
                        ))
                    )}
                </div>
                {structure.components.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-gray-400">
                            {structure.components.length} component{structure.components.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-4 flex-wrap">
                            {componentTypes.map((type, i) => {
                                const count = countByType[type.value] || 0
                                const colors = TYPE_COLOR_PALETTE[i] || FALLBACK_COLOR
                                if (count === 0) return null
                                return (
                                    <span key={type.value} className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <span className={`w-2 h-2 rounded-full ${colors.dot} inline-block`} />
                                        {count} {type.label.toLowerCase()}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            <ComponentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleModalSave}
                initialData={initialData}
                editIndex={editIndex}
                salaryComponents={salaryComponents}
                calculationOptions={calculationOptions}
                componentTypes={componentTypes}
                baseOptions={baseOptions}
                isLoading={isLoading}
                existingComponents={structure.components}
            />
        </>
    )
}

export default StructureComponents