import React from "react"
import { Check, X } from "lucide-react"

function CommonToggleButton({
    label = "",
    required = false,
    value = 0,
    onChange = () => { },
    yesLabel = "Yes",
    noLabel = "No",
    disabled = false,
    className = "",
    style = {},
    loading = false
}) {

    const toggle = () => {
        if (disabled || loading) return
        onChange(value === 1 ? 0 : 1)
    }

    const isYes = value === 1

    return (
        <>
            {label && (
                loading ? (
                    <div className="mb-2 h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )
            )}
            {loading ? (
                <div className="inline-flex items-center gap-2 animate-pulse">
                    <div className="h-8 w-20 bg-gray-200 rounded-l-lg"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-r-lg"></div>
                </div>
            ) : (
                <div
                    className={`inline-flex items-center rounded-lg cursor-pointer select-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}`}
                    style={style}
                    onClick={toggle}
                >
                    <div
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-indigo-500 rounded-l-lg transition
                ${value === 1 ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                        <Check size={14} />
                        {yesLabel}
                    </div>

                    <div
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium border border-red-500 rounded-r-lg transition
                ${value !== 1 ? "bg-red-500 text-white" : "text-gray-600"}`}
                    >
                        <X size={14} />
                        {noLabel}
                    </div>
                </div>
            )}
        </>
    )
}

export default CommonToggleButton
