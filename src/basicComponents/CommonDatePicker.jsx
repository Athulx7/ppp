import React from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "lucide-react";

function CommonDatePicker({
    label = "",
    required = false,
    value,
    onChange = () => { },
    placeholder = "Select date",
    className = "",
    style = {},
    disabled = false,
    minDate = null,
    maxDate = null
}) {
    return (
        <div className={`w-full ${className}`} style={style}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className={`flex items-center justify-between p-1.5 rounded-lg transition-all duration-200 cursor-pointer
          ${disabled
                        ? "bg-gray-100 text-gray-400 border border-gray-200"
                        : "bg-white border border-indigo-500 hover:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-500"}
        `}
            >
                <DatePicker
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    format="YYYY/MM/DD"
                    inputClass="bg-transparent outline-none w-full text-sm text-gray-800"
                    className="w-full"
                    containerClassName="w-full"
                    minDate={minDate}
                    maxDate={maxDate}
                />
                <Calendar
                    size={16}
                    className={`${disabled ? "text-gray-400" : "text-indigo-500"} ml-2`}
                />
            </div>
        </div>
    )
}

export default CommonDatePicker;