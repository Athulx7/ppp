import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import './basicCss/comCss.css'

function CommonMultiSelectionDropdown({
    label = "",
    required = false,
    options = [],
    value = [],
    onChange = () => { },
    placeholder = "Select options",
    showSearch = true,
    disabled = false,
    className = "",
    style = {},
    showSelectAll = false,
    maxSelection = null,
    minSelection = 0,
    maxVisibleChips = 3,
    chipDisplayMode = "count"
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [dropdownStyle, setDropdownStyle] = useState({})

    const containerRef = useRef(null)
    const inputContainerRef = useRef(null)
    const dropdownMenuRef = useRef(null)

    const filteredOptions = options.filter(opt => opt.label?.toLowerCase().includes(searchTerm?.toLowerCase()))

    const isSelected = (val) => value.includes(val)
    const isMaxReached = maxSelection !== null && value.length >= maxSelection
    const isAllSelected = options.length > 0 && value.length === options.length

    const updatePosition = () => {
        if (inputContainerRef.current) {
            const rect = inputContainerRef.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const openUpwards = spaceBelow < 240 && rect.top > 240

            setDropdownStyle({
                position: "fixed",
                width: `${rect.width}px`,
                left: `${rect.left}px`,
                top: openUpwards ? "auto" : `${rect.bottom + 4}px`,
                bottom: openUpwards ? `${window.innerHeight - rect.top + 4}px` : "auto",
                zIndex: 99999,
            })
        }
    }

    useEffect(() => {
        if (isOpen) {
            updatePosition()

            const handleClickOutside = (event) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target) &&
                    dropdownMenuRef.current &&
                    !dropdownMenuRef.current.contains(event.target)
                ) {
                    setIsOpen(false)
                    setSearchTerm("")
                }
            }

            const handleScrollOrResize = () => {
                updatePosition()
            }

            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("resize", handleScrollOrResize)
            window.addEventListener("scroll", handleScrollOrResize, true)

            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
                window.removeEventListener("resize", handleScrollOrResize)
                window.removeEventListener("scroll", handleScrollOrResize, true)
            }
        }
    }, [isOpen])

    const toggleSelect = (val) => {
        if (isSelected(val) && value.length <= minSelection) return
        if (!isSelected(val) && isMaxReached) return

        if (isSelected(val)) {
            onChange(value.filter(v => v !== val))
        } else {
            onChange([...value, val])
        }
    }

    const removeItem = (val) => {
        if (value.length <= minSelection) return
        onChange(value.filter(v => v !== val))
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            if (minSelection > 0) return
            onChange([])
        } else {
            const allValues = options.map(o => o.value)
            onChange(
                maxSelection ? allValues.slice(0, maxSelection) : allValues
            )
        }
    }

    return (
        <div className={`relative ${className}`} style={style} ref={containerRef}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <div
                ref={inputContainerRef}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${disabled ? "bg-gray-100 text-gray-900 border border-indigo-500"
                    : "bg-white border border-indigo-500 hover:border-indigo-400"}
          ${isOpen ? "ring-1 ring-indigo-500" : ""} `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {value.length > 0 ? (
                    <div className={`flex items-center gap-2 max-w-[85%] ${chipDisplayMode === "scroll"
                        ? "overflow-x-auto whitespace-nowrap hide-scrollbar" : "overflow-hidden"}`}
                    >
                        {(chipDisplayMode === "count"
                            ? value.slice(0, maxVisibleChips)
                            : value
                        ).map(val => {
                            const label = options.find(o => o.value === val)?.label;
                            return (
                                <span
                                    key={val}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md whitespace-nowrap"
                                >
                                    {label}
                                    {!disabled && (
                                        <X
                                            size={12}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeItem(val)
                                            }}
                                        />
                                    )}
                                </span>
                            )
                        })}

                        {chipDisplayMode === "count" &&
                            value.length > maxVisibleChips && (
                                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-md whitespace-nowrap">
                                    +{value.length - maxVisibleChips} more
                                </span>
                            )}
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm">{placeholder}</span>
                )}

                <div className="ml-auto pl-2 border-l border-gray-200">
                    {isOpen ? (
                        <ChevronUp size={16} className="text-indigo-500" />
                    ) : (
                        <ChevronDown size={16} className="text-indigo-500" />
                    )}
                </div>
            </div>

            {isOpen && createPortal(
                <div
                    ref={dropdownMenuRef}
                    style={dropdownStyle}
                    className="bg-white rounded-lg shadow-xl border border-indigo-500"
                >
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 text-sm border-b border-indigo-400 outline-none rounded-t-lg"
                            autoFocus
                        />
                    )}

                    {showSelectAll && (
                        <div
                            className="flex items-center p-3 text-sm cursor-pointer text-indigo-500 font-semibold border-b border-indigo-400 bg-gray-50 hover:bg-gray-100"
                            onClick={handleSelectAll}
                        >
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                readOnly
                                className="mr-2"
                            />
                            Select All
                        </div>
                    )}

                    <div className="max-h-60 overflow-y-auto scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="p-3 text-sm text-center text-gray-500">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map(option => {
                                const disabledOption =
                                    !isSelected(option.value) && isMaxReached;

                                return (
                                    <div key={option.value}
                                        className={`flex items-center p-3 text-sm border-b last:border-b-0 border-indigo-300 ${disabledOption
                                            ? "text-gray-400 cursor-not-allowed bg-gray-50"
                                            : "cursor-pointer hover:bg-indigo-50"}
                                                  ${isSelected(option.value)
                                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                                : "text-gray-700"}`}
                                        onClick={() => !disabledOption && toggleSelect(option.value)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected(option.value)}
                                            disabled={disabledOption}
                                            readOnly
                                            className="mr-2"
                                        />
                                        {option.label}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default CommonMultiSelectionDropdown