import React, { useRef } from "react"
import { FunctionSquare, X } from "lucide-react"

function FormulaBuilder({ value, onChange, salaryComponents }) {
    const inputRef = useRef(null)
    const insertAtCursor = (text) => {
        const el = inputRef.current
        if (!el) {
            onChange((value || '') + text)
            return
        }
        const start = el.selectionStart ?? value.length
        const end = el.selectionEnd ?? value.length
        const current = value || ''

        const inserted = ['+', '-', '*', '/'].includes(text) ? ` ${text} ` : text

        onChange(current.slice(0, start) + inserted + current.slice(end))
        const newCursor = start + inserted.length
        requestAnimationFrame(() => {
            el.focus()
            el.setSelectionRange(newCursor, newCursor)
        })
    }

    return (
        <div className="space-y-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <div className="flex items-center gap-2">
                <FunctionSquare className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-800">
                    Formula Builder
                </span>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-300 rounded-lg"
            />

            <div className="flex flex-wrap gap-2">
                {salaryComponents.map(comp => (
                    <button
                        key={comp.component_code}
                        type="button"
                        onClick={() => insertAtCursor(comp.component_code)}
                        className="px-2 py-1 text-xs bg-white border rounded"
                    >
                        {comp.component_code}
                    </button>

                ))}
            </div>
        </div>
    )
}

export default FormulaBuilder