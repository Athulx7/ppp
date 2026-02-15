import React from "react";
import DatePicker from "react-multi-date-picker";
import { Calendar } from "lucide-react";
import moment from "moment";

function CommonDatePicker({
    label = "",
    required = false,
    value = "",
    onChange = () => { },
    placeholder = "Select date",
    className = "",
    style = {},
    disabled = false,
    minDate = null,
    maxDate = null,
    errorMessage
}) {

    const handleChange = (date) => {
        if (!date) {
            onChange("");
            return;
        }

        const formatted = moment(date.toDate()).format("DD/MM/YYYY");
        onChange(formatted);
    }

    return (
        <div className={`w-full ${className}`} style={style}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg
                ${disabled
                        ? "bg-gray-100 text-gray-900 border border-indigo-500"
                        : "bg-white border border-indigo-500 hover:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-500"}
                        ${errorMessage ? "border-red-500 focus:ring-red-500" : ""}
            `}
            >
                <DatePicker
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder={placeholder}
                    format="DD/MM/YYYY"
                    inputClass="bg-transparent outline-none w-full text-sm text-gray-800"
                    containerClassName="w-full"
                    minDate={minDate}
                    maxDate={maxDate}
                    highlightToday
                    calendarPosition="bottom-left"
                />

                <Calendar
                    size={14}
                    className={`${disabled ? "text-gray-400" : "text-indigo-500"} ml-2`}
                />
            </div>


             {errorMessage && (
                    <div className="mt-1 text-xs text-red-500">
                        {errorMessage}
                    </div>
                )}
        </div>
    )
}

export default CommonDatePicker;