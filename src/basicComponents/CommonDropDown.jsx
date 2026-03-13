import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import InlineMasterModal from "./InlineMasterModal"

function CommonDropDown({
    label = "",
    required = false,
    options = [],
    value = "",
    onChange = () => { },
    placeholder = "Select an option",
    showSearch = true,
    disabled = false,
    className = "",
    style = {},
    errorMessage,
    loading = false,

    allowInlineCreate = false,
    inlineMasterCode = null,
    onInlineCreated = () => { }
}) {
    const [inlineOpen, setInlineOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const containerRef = useRef(null)

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false)
                setSearchTerm("")
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleSelect = (selectedValue) => {
        onChange(selectedValue)
        setIsOpen(false)
        setSearchTerm("")

    }

    return (
        <div
            className={`relative ${className}`}
            style={style}
            ref={containerRef}
        >
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
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
                <div
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all
                    ${disabled
                            ? "bg-gray-100 text-gray-900 border border-indigo-500"
                            : "bg-white border border-indigo-500 hover:border-indigo-400"}
                    ${isOpen ? "ring-1 ring-indigo-500" : ""}
                    ${errorMessage ? "border-red-500" : ""}
                `}
                    onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
                >
                    {isOpen && showSearch ? (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full text-sm bg-transparent outline-none"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className={`truncate text-sm ${value ? "text-gray-800" : "text-gray-400"}`}>
                            {value
                                ? options.find(opt => opt.value === value)?.label
                                : placeholder}
                        </span>
                    )}

                    <div className="ml-2 pl-2 border-l border-gray-200">
                        {isOpen ?
                            <ChevronUp size={16} className="text-indigo-500" /> :
                            <ChevronDown size={16} className="text-indigo-500" />
                        }
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="mt-1 text-xs text-red-500">
                    {errorMessage}
                </div>
            )}

            {isOpen && (

                <div
                    className="absolute left-0 top-full mt-1 w-full bg-white rounded-lg shadow-xl border border-indigo-500 z-50"
                >
                    <div className="max-h-60 overflow-y-auto scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="p-3 text-sm text-center text-gray-500">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={`p-3 text-sm cursor-pointer hover:bg-indigo-50 border-b border-indigo-100
                                    ${value === option.value
                                            ? "bg-indigo-100 text-indigo-700 font-medium"
                                            : "text-gray-700"}
                                    `}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleSelect(option.value)
                                    }}
                                >
                                    {option.label}
                                </div>
                            ))
                        )}

                    </div>

                    {allowInlineCreate && (
                        <div
                            className="p-3 text-sm text-indigo-600 cursor-pointer hover:bg-indigo-50 border-t border-indigo-200 font-medium"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsOpen(false)
                                setInlineOpen(true)
                            }}
                        >
                            + Add New
                        </div>
                    )}

                </div>

            )}
            <InlineMasterModal
                open={inlineOpen}
                masterCode={inlineMasterCode}
                onClose={() => setInlineOpen(false)}
                onCreated={(newRecord) => {
                    onInlineCreated(newRecord)
                    setInlineOpen(false)
                }}
            />
        </div>
    )
}

export default CommonDropDown
