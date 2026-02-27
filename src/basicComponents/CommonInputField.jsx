import React from "react"

function CommonInputField({
    label = "",
    required = false,
    type = "text",
    value = "",
    onChange = () => { },
    onBlurChange,
    placeholder = "",
    disabled = false,
    errorMessage = "",
    className = "",
    style = {},
    maxLength,
    onlyNumber = false,
    regex,
    step,
    autoComplete = "off",
    onKeyDown,
    spellCheck = false,
    loading = false
}) {

    const checkForNumber = (val) => {
        const numberRegex = /^[0-9\b]+$/
        return val === "" || numberRegex.test(val)
    }

    const handleChange = (e) => {
        let inputValue = e.target.value.replaceAll("\\", "")

        if (onlyNumber && !checkForNumber(inputValue)) return
        if (maxLength && inputValue.length > maxLength) return

        onChange(inputValue)
    }

    const handleBlur = () => {
        onBlurChange?.(value)
    }

    return (
        <div className={`w-full ${className}`} style={style}>
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
                <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={onKeyDown}
                    spellCheck={spellCheck}
                    step={step}
                    min="0"
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-all
          ${disabled
                            ? "bg-gray-100 text-gray-900 border border-indigo-500"
                            : "bg-white border border-indigo-500 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"}
          ${errorMessage ? "border-red-500 focus:ring-red-500" : ""}
        `}
                />)}

            {errorMessage && (
                loading ? (
                    <div className="mb-2 h-4 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) :
                    <div className="mt-1 text-xs text-red-500">
                        {errorMessage}
                    </div>
            )}
        </div>
    )
}

export default CommonInputField
