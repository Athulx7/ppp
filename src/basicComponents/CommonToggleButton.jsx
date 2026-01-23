import React from "react"
import { Check, X } from "lucide-react"

function CommonToggleButton({
    value = 0,
    onChange = () => { },
    yesLabel = "Yes",
    noLabel = "No",
    disabled = false,
    className = "",
    style = {}
}) {

    const toggle = () => {
        if (disabled) return
        onChange(value === 1 ? 0 : 1)
    }

    const isYes = value === 1

    return (
        <div
            className={`inline-flex items-center rounded-lg border cursor-pointer select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}  ${className}`} style={style} onClick={toggle}
        >
            <div className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-l-lg transition
          ${isYes ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"} `}
            >
                <Check size={14} />
                {yesLabel}
            </div>

            <div
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-r-lg transition
          ${!isYes ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"}`}
            >
                <X size={14} />
                {noLabel}
            </div>
        </div>
    )
}

export default CommonToggleButton
