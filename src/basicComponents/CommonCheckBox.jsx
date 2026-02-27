import React from "react"
import { Check } from "lucide-react"

function CommonCheckbox({
    checked = false,
    onChange = () => { },
    label = "",
    disabled = false,
    className = "",
    style = {},
    loading = false
}) {
    return (
        <label
            className={`inline-flex items-center gap-2 select-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}`}
            style={style}
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>

                    {label && (
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    )}
                </>
            ) : (
                <>
                    <div
                        onClick={() => !disabled && !loading && onChange(!checked)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition cursor-pointer
                        ${checked
                                ? "bg-indigo-500 border-indigo-500"
                                : "bg-white border-gray-300"}`}
                    >
                        {checked && <Check size={14} className="text-white" />}
                    </div>

                    {label && (
                        <span className="text-sm text-gray-700">
                            {label}
                        </span>
                    )}
                </>
            )}
        </label>
    )
}

export default CommonCheckbox
