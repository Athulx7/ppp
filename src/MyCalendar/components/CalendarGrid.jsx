import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES, DAY_NAMES, COMPANY_HOLIDAYS } from '../hooks/useCalendarState'

function CalendarGrid({
    year, month, firstDay, daysInMonth,
    view, setView,
    prevMonth, nextMonth, goToToday,
    selectedDate, handleDateClick,
    getEvents, getExtra, attendance,
}) {
    const selDs = selectedDate.toISOString().split('T')[0]
    const dateStr = (d) => new Date(year, month, d).toISOString().split('T')[0]

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                    <button onClick={goToToday}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
                        Today
                    </button>
                    <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 border-r border-gray-300">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-semibold min-w-[140px] text-center">
                            {MONTH_NAMES[month]} {year}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 border-l border-gray-300">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
                    {['month', 'week'].map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize
                                ${view === v ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                {DAY_NAMES.map((d, i) => (
                    <div key={d} className={`py-2.5 text-center text-xs font-semibold
                        ${i === 0 || i === 6 ? 'text-red-400' : 'text-gray-500'}`}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e${i}`} className="min-h-[90px] border-b border-r border-gray-100 bg-gray-50" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1
                    const ds = dateStr(d)
                    const date = new Date(year, month, d)
                    const isToday = ds === new Date().toISOString().split('T')[0]
                    const isSelected = ds === selDs
                    const events = getEvents(ds)
                    const extra = getExtra(ds)
                    const attRec = attendance.find(a => a.date === ds)
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6
                    const isHoliday = COMPANY_HOLIDAYS.some(h => h.date === ds)
                    const isAbsent = attRec?.status === 'absent'

                    return (
                        <div key={d}
                            onClick={() => handleDateClick(d)}
                            className={`min-h-[90px] border-b border-r border-gray-100 p-1.5 cursor-pointer
                                transition-all hover:bg-indigo-50 relative
                                ${isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50' : ''}
                                ${isHoliday || isWeekend ? 'bg-red-50/40' : ''}
                                ${isAbsent ? 'bg-rose-50' : ''}
                            `}
                        >
                            {/* Date number */}
                            <div className="flex items-start justify-between mb-1">
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday ? 'bg-indigo-600 text-white' : ''}
                                    ${isWeekend ? 'text-red-400' : 'text-gray-700'}
                                    ${isHoliday ? 'text-red-600' : ''}
                                `}>
                                    {d}
                                </span>
                                {extra > 0 && (
                                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded font-medium">
                                        +{Math.floor(extra / 60)}h
                                    </span>
                                )}
                                {isAbsent && (
                                    <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-medium">Abs</span>
                                )}
                            </div>

                            {/* Event pills — max 2 */}
                            <div className="space-y-0.5">
                                {events.slice(0, 2).map((ev, ei) => (
                                    <div key={ei}
                                        className={`text-[10px] px-1 py-0.5 rounded truncate font-medium ${ev.color || 'bg-gray-100 text-gray-600'}`}>
                                        {ev.title || ev.name || ev.type}
                                    </div>
                                ))}
                                {events.length > 2 && (
                                    <div className="text-[10px] text-gray-400 px-1">+{events.length - 2} more</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CalendarGrid
