import React from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "lucide-react";

function CommonDatePicker({
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
        <div className={`relative ${className}`} style={style}>
            <div
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
          ${disabled
                        ? "bg-gray-100 text-gray-400 border border-gray-200"
                        : "bg-white border border-indigo-500 hover:border-indigo-400 focus:border-indigo-500"}
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