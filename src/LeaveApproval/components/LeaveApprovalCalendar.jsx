import { ChevronLeft, ChevronRightIcon } from 'lucide-react';
import React from 'react'

function LeaveApprovalCalendar({
    handlePrevMonth, getLeavesForDate, handleDateClick,
    monthNames, currentDate, handleNextMonth, weekDays, getDaysInMonth, hasLeaveOnDate,
    workSchedule, holidays = []
}) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const activeWorkWeek = workSchedule?.work_week && Array.isArray(workSchedule.work_week)
        ? workSchedule.work_week.map(w => String(w).toLowerCase()) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Leave Calendar</h3>

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <h4 className="text-sm md:text-base font-medium">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                        <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-7 bg-gray-50 border-b">
                        {weekDays.map((day, index) => (
                            <div
                                key={day}
                                className={`p-2 text-center text-xs md:text-sm font-medium ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {Array.from({ length: getDaysInMonth(currentDate).startingDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="p-2 border-b border-r bg-gray-50"></div>
                        ))}

                        {Array.from({ length: getDaysInMonth(currentDate).daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const year = currentDate.getFullYear();
                            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                            const dayPad = String(day).padStart(2, '0');
                            const dateStr = `${year}-${month}-${dayPad}`;
                            const dayName = dayNames[cellDate.getDay()];
                            const isWorkDay = activeWorkWeek.includes(dayName);
                            const holiday = (holidays || []).find(h => h.holiday_date === dateStr);

                            const hasLeave = hasLeaveOnDate(dateStr);
                            const leavesOnDate = getLeavesForDate(dateStr);

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasLeave && handleDateClick(day)}
                                    className={`p-2 border-b border-r relative transition-all min-h-[60px] md:min-h-[80px]
                                        ${holiday ? 'bg-amber-100/80' : ''}
                                        ${!isWorkDay && !holiday ? 'bg-gray-100/60' : ''}
                                        ${hasLeave ? 'bg-indigo-50 cursor-pointer hover:bg-indigo-100' : ''}
                                        ${!hasLeave && !holiday && isWorkDay ? 'hover:bg-gray-50' : ''}
                                    `}
                                >
                                    <div className="flex flex-col items-center h-full justify-between">
                                        <span className={`text-xs md:text-sm font-medium
                                            ${hasLeave ? 'text-indigo-700 font-semibold' : ''}
                                            ${holiday ? 'text-amber-800 font-semibold' : ''}
                                            ${!hasLeave && !holiday ? 'text-gray-700' : ''}
                                        `}>
                                            {day}
                                        </span>
                                        {hasLeave ? (
                                            <div className="mt-1 flex flex-wrap items-center justify-center gap-0.5">
                                                {leavesOnDate.slice(0, 3).map((leave, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${leave.status === 'approved' ? 'bg-green-500' :
                                                            leave.status === 'pending' ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                        title={`${leave.emp_name} - ${leave.leave_name} (${leave.status})`}
                                                    />
                                                ))}
                                                {leavesOnDate.length > 3 && (
                                                    <span className="text-[8px] md:text-[10px] text-gray-500 font-medium">
                                                        +{leavesOnDate.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : holiday ? (
                                            <span className="text-[9px] md:text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1 py-0.5 rounded truncate max-w-full" title={holiday.holiday_name}>
                                                🎉 {holiday.holiday_name}
                                            </span>
                                        ) : !isWorkDay ? (
                                            <span className="text-[9px] md:text-[10px] bg-gray-200 text-gray-600 px-1 py-0.5 rounded">Off</span>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Approved</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Rejected</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-100 border border-amber-300 rounded"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Holiday</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-200 border border-gray-300 rounded"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Off Day</span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 ml-auto">
                        Click on highlighted dates to see leave details
                    </span>
                </div>
            </div>
        </>
    )
}

export default LeaveApprovalCalendar