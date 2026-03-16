import React from "react"
import { Pencil, Trash2 } from "lucide-react"
import { FALLBACK_COLOR } from "./typeUtils"

function ComponentCard({
    component,
    index,
    typeMap,
    calculationOptions,
    onEdit,
    onRemove
}) {

    const calcType = calculationOptions.find(c => c.value === component.calc_code)
    const borderColor = typeMap[component.type_code]?.colors?.border || FALLBACK_COLOR.border

    return (
        <div className={`border border-gray-200 border-l-4 ${borderColor} rounded-xl p-4`}>
            <div className="flex justify-between">
                <div>
                    <p className="font-semibold">
                        {component.component_name}
                    </p>

                    <p className="text-xs text-gray-400">
                        {component.component_code}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => onEdit(index)}>
                        <Pencil size={14} />
                    </button>

                    <button onClick={() => onRemove(index)}>
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ComponentCard