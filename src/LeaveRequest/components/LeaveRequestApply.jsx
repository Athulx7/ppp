import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    return { daysInMonth, startingDay }
}

function LeaveRequestApply({
    selectedStartDate,
    handleClearSelection,
    handlePrevMonth,
    monthNames, currentDate, handleNextMonth, weekDays, isDateInRange,
    leaveRequests, isDateSelected, handleDateClick, handleDateHover, selectedEndDate,
    calculateLeaveDays,
    workSchedule,
    holidays = []
}) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const activeWorkWeek = workSchedule?.work_week && Array.isArray(workSchedule.work_week)
        ? workSchedule.work_week.map(w => String(w).toLowerCase()) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

    return (
        <>
            <div className='p-3'>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Select Leave Dates
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-indigo-200 rounded"></div>
                            <span className="text-sm text-gray-600">Selected Range</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                            <span className="text-sm text-gray-600">Existing Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                            <span className="text-sm text-gray-600">Holiday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                            <span className="text-sm text-gray-600">Off Day</span>
                        </div>
                        {selectedStartDate && (
                            <button
                                onClick={handleClearSelection}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="text-lg font-medium">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">

                    <div className="grid grid-cols-7 bg-gray-50 border-b border-b-gray-300">
                        {weekDays.map(day => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>


                    <div className="grid grid-cols-7">
                        {Array.from({ length: getDaysInMonth(currentDate).startingDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="p-3 border-b border-r border-b-gray-300 border-r-gray-300 bg-gray-50"></div>
                        ))}

                        {Array.from({ length: getDaysInMonth(currentDate).daysInMonth }).map((_, index) => {
                            const day = index + 1
                            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                            const year = currentDate.getFullYear()
                            const month = String(currentDate.getMonth() + 1).padStart(2, '0')
                            const dayPad = String(day).padStart(2, '0')
                            const dateStr = `${year}-${month}-${dayPad}`
                            const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0))
                            const isInRange = isDateInRange(dateStr)
                            const isSelected = isDateSelected(dateStr)
                            const dayName = dayNames[dateObj.getDay()]
                            const isWorkDay = activeWorkWeek.includes(dayName)
                            const holiday = (holidays || []).find(h => h.holiday_date === dateStr)

                            const hasLeave = leaveRequests.some(req =>
                                req.status !== 'rejected' && req.status !== 'cancelled' &&
                                dateStr >= req.from_date && dateStr <= req.to_date
                            )

                            return (
                                <div
                                    key={day}
                                    onClick={() => !isPast && handleDateClick(day)}
                                    onMouseEnter={() => !isPast && handleDateHover(day)}
                                    className={`p-3 border-b border-r border-b-gray-300 border-r-gray-300 relative cursor-pointer h-16 transition-all
                                                    ${isPast ? ' cursor-not-allowed text-gray-400' : 'hover:bg-gray-50'}
                                                    ${!isWorkDay ? 'bg-gray-100/60' : ''}
                                                    ${holiday ? 'bg-amber-50/80 border-amber-200' : ''}
                                                    ${isInRange ? 'bg-indigo-50' : ''}
                                                    ${isSelected ? 'bg-indigo-100 border-indigo-300' : ''}
                                                    ${hasLeave ? 'bg-red-50' : ''}
                                                `}
                                >
                                    <div className="flex flex-col items-center justify-between h-full">
                                        <span className={`text-sm font-medium
                                                        ${isPast ? 'text-gray-400' : 'text-gray-700'}
                                                        ${isSelected ? 'text-indigo-700' : ''}
                                                        ${hasLeave ? 'text-red-700' : ''}
                                                        ${holiday ? 'text-amber-800' : ''}
                                                    `}>
                                            {day}
                                        </span>
                                        {hasLeave ? (
                                            <span className="text-xs text-red-600 font-medium">Leave</span>
                                        ) : holiday ? (
                                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded truncate max-w-full" title={holiday.holiday_name}>
                                                🎉 {holiday.holiday_name}
                                            </span>
                                        ) : !isWorkDay ? (
                                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Off</span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {selectedStartDate && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-indigo-700">Selected Dates</p>
                                <p className="font-medium text-indigo-900">
                                    {selectedStartDate} {selectedEndDate ? `to ${selectedEndDate}` : '(select end date)'}
                                </p>
                                {selectedStartDate && selectedEndDate && (
                                    <p className="text-sm text-indigo-600 mt-1">
                                        Total: {calculateLeaveDays(selectedStartDate, selectedEndDate)} days
                                    </p>
                                )}
                            </div>
                            {!selectedEndDate && (
                                <p className="text-sm text-indigo-600">
                                    Click another date to complete selection
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default LeaveRequestApply