import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function CommonDropDown({
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Select an option',
  showSearch = true,
  disabled = false,
  className = '',
  style = {}
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} style={style}>
 
      <div
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 text-gray-400 border border-gray-200' 
            : 'bg-white border border-indigo-500 hover:border-indigo-400 focus:border-indigo-500'}
          ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm text-gray-800 focus:outline-none bg-transparent"
            autoFocus
          />
        ) : (
          <span className={`truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {value === '' || value === null || value === undefined
              ? placeholder
              : options.find(opt => opt.value === value)?.label || placeholder}
          </span>
        )}

        <div className="ml-2 pl-2 border-l border-gray-200">
          <FontAwesomeIcon 
            icon={isOpen ? faChevronUp : faChevronDown} 
            className={`text-sm ${disabled ? 'text-gray-400' : 'text-indigo-500'}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          <div className="max-h-60 border-indigo-400 border-1 rounded-lg overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-center text-gray-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 text-sm cursor-pointer transition-colors duration-150
                    hover:bg-indigo-50 border-b border-indigo-400 last:border-b-0
                    ${value === option.value ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-700'}
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommonDropDown
