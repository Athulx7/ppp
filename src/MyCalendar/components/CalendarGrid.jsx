import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES, DAY_NAMES, minutesToHHMM } from '../hooks/useCalendarState'

function CalendarGrid({
    year, month, firstDay, daysInMonth,
    view, setView,
    prevMonth, nextMonth, goToToday,
    selectedDate, handleDateClick,
    getEvents, getExtra, attendance,
    workSchedule, holidays = [],
    isOvertimeApplicable = true
}) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const activeWorkWeek = workSchedule?.work_week && Array.isArray(workSchedule.work_week)
        ? workSchedule.work_week.map(w => String(w).toLowerCase()) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const formatDateLocal = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateStr = (d) => formatDateLocal(year, month, d);
    const todayObj = new Date();
    const todayDs = formatDateLocal(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());
    const selDs = formatDateLocal(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    const getWeekDays = () => {
        const curr = new Date(selectedDate);
        const first = curr.getDate() - curr.getDay();
        const days = [];
        for (let i = 0; i < 7; i++) {
            const dayObj = new Date(curr.getFullYear(), curr.getMonth(), first + i);
            const ds = formatDateLocal(dayObj.getFullYear(), dayObj.getMonth(), dayObj.getDate());
            days.push({ dayObj, ds, dayNum: dayObj.getDate(), dayIdx: dayObj.getDay() });
        }
        return days;
    };

    const weekDays = getWeekDays();

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                    <button onClick={goToToday}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer">
                        Today
                    </button>
                    <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 border-r border-gray-300 cursor-pointer" title={view === 'week' ? 'Previous Week' : 'Previous Month'}>
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-semibold min-w-[150px] text-center">
                            {view === 'week'
                                ? `${weekDays[0]?.dayNum} ${MONTH_NAMES[weekDays[0]?.dayObj.getMonth()]} - ${weekDays[6]?.dayNum} ${MONTH_NAMES[weekDays[6]?.dayObj.getMonth()]}`
                                : `${MONTH_NAMES[month]} ${year}`
                            }
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 border-l border-gray-300 cursor-pointer" title={view === 'week' ? 'Next Week' : 'Next Month'}>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex bg-white border border-gray-300 rounded-md overflow-hidden">
                    {['month', 'week'].map(v => (
                        <button key={v} onClick={() => setView(v)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize cursor-pointer
                                ${view === v ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-200">
                {DAY_NAMES.map((d, i) => {
                    const isHeaderOffDay = !activeWorkWeek.includes(dayNames[i]);
                    return (
                        <div key={d} className={`py-2.5 text-center text-xs font-semibold uppercase tracking-wider
                            ${isHeaderOffDay ? 'bg-red-50/70 text-red-600 font-bold border-b-2 border-red-200' : 'bg-gray-50 text-gray-600'}`}>
                            {d}
                        </div>
                    );
                })}
            </div>

            {view === 'month' && (
                <div className="grid grid-cols-7">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e${i}`} className="min-h-[95px] border-b border-r border-gray-100 bg-gray-50" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const d = i + 1;
                        const ds = dateStr(d);
                        const date = new Date(year, month, d);
                        const isToday = ds === todayDs;
                        const isSelected = ds === selDs;
                        const dayName = dayNames[date.getDay()];
                        const isWorkDay = activeWorkWeek.includes(dayName);
                        const holiday = (holidays || []).find(h => h.holiday_date === ds);

                        const events = getEvents(ds);
                        const hasLeave = (events || []).some(ev => ev.category === 'My Leave' || ev.type === 'leave');
                        const hasReg = (events || []).some(ev => ev.category === 'Regularization');
                        const extra = getExtra(ds);
                        const attRec = (attendance || []).find(a => a.date === ds || a.attendance_date === ds);
                        const hasPunch = attRec && (attRec.punch_in_time || attRec.punch_in) && (attRec.punch_out_time || attRec.punch_out);
                        const isPresent = hasPunch || attRec?.status === 'present';
                        const isPast = ds < todayDs;
                        const isExplicitAbsent = attRec?.status === 'absent';
                        const isImplicitAbsent = isPast && isWorkDay && !holiday && !hasPunch && !hasLeave && !hasReg;
                        const isAbsent = isExplicitAbsent || isImplicitAbsent;

                        return (
                            <div key={d}
                                onClick={() => handleDateClick(d)}
                                className={`min-h-[95px] border-b border-r border-gray-100 p-1.5 cursor-pointer
                                    transition-all hover:opacity-90 relative
                                    ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}
                                    ${holiday ? 'bg-amber-100/90 border-amber-300' : ''}
                                    ${hasLeave && !holiday ? 'bg-indigo-100/90 border-indigo-300' : ''}
                                    ${hasReg && !holiday && !hasLeave ? 'bg-blue-100/90 border-blue-300' : ''}
                                    ${isPresent && !holiday && !hasLeave && !hasReg ? 'bg-emerald-100/90 border-emerald-300' : ''}
                                    ${!isWorkDay && !holiday && !hasLeave && !isPresent ? 'bg-red-100/70 border-red-200' : ''}
                                    ${isAbsent && !holiday && !hasLeave && !hasReg && !isPresent && isWorkDay ? 'bg-rose-100 border-rose-300' : ''}
                                `}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                                        ${isToday ? 'bg-indigo-600 text-white' : ''}
                                        ${holiday ? 'text-amber-900 font-bold' : ''}
                                        ${hasLeave && !holiday ? 'text-indigo-900 font-bold' : ''}
                                        ${hasReg && !holiday && !hasLeave ? 'text-blue-900 font-bold' : ''}
                                        ${isPresent && !holiday && !hasLeave && !hasReg ? 'text-emerald-900 font-bold' : ''}
                                        ${isAbsent && !holiday && !hasLeave && !hasReg && isWorkDay ? 'text-rose-900 font-bold' : ''}
                                        ${!isWorkDay && !holiday && !hasLeave && !isPresent ? 'text-red-700 font-bold' : 'text-gray-700'}
                                    `}>
                                        {d}
                                    </span>
                                    {holiday ? (
                                        <span className="text-[9px] bg-amber-200 text-amber-900 border border-amber-400 px-1.5 py-0.5 rounded font-bold truncate max-w-[65px]" title={holiday.holiday_name}>
                                            🎉 {holiday.holiday_name}
                                        </span>
                                    ) : hasLeave ? (
                                        <span className="text-[9px] bg-indigo-200 text-indigo-900 border border-indigo-400 px-1.5 py-0.5 rounded font-bold">
                                            Leave
                                        </span>
                                    ) : hasReg ? (
                                        <span className="text-[9px] bg-blue-200 text-blue-900 border border-blue-400 px-1.5 py-0.5 rounded font-bold">
                                            Reg
                                        </span>
                                    ) : isPresent ? (
                                        <span className="text-[9px] bg-emerald-200 text-emerald-900 border border-emerald-400 px-1.5 py-0.5 rounded font-bold">
                                            {isOvertimeApplicable && extra > 0 ? `+${minutesToHHMM(extra)}` : 'Present'}
                                        </span>
                                    ) : !isWorkDay ? (
                                        <span className="text-[9px] bg-red-200 text-red-800 border border-red-300 px-1.5 py-0.5 rounded font-bold">
                                            Off
                                        </span>
                                    ) : isAbsent ? (
                                        <span className="text-[9px] bg-rose-200 text-rose-900 border border-rose-400 px-1.5 py-0.5 rounded font-bold">
                                            Abs
                                        </span>
                                    ) : null}
                                </div>

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
                        );
                    })}
                </div>
            )}

            {view === 'week' && (
                <div className="grid grid-cols-1 md:grid-cols-7 min-h-[300px]">
                    {weekDays.map(({ dayObj, ds, dayNum, dayIdx }) => {
                        const isToday = ds === todayDs;
                        const isSelected = ds === selDs;
                        const dayName = dayNames[dayIdx];
                        const isWorkDay = activeWorkWeek.includes(dayName);
                        const holiday = (holidays || []).find(h => h.holiday_date === ds);
                        const events = getEvents(ds);
                        const hasLeave = (events || []).some(ev => ev.category === 'My Leave' || ev.type === 'leave');
                        const hasReg = (events || []).some(ev => ev.category === 'Regularization');
                        const attRec = (attendance || []).find(a => a.date === ds || a.attendance_date === ds);
                        const hasPunch = attRec && (attRec.punch_in_time || attRec.punch_in) && (attRec.punch_out_time || attRec.punch_out);
                        const isPresent = hasPunch || attRec?.status === 'present';
                        const isPast = ds < todayDs;
                        const isExplicitAbsent = attRec?.status === 'absent';
                        const isImplicitAbsent = isPast && isWorkDay && !holiday && !hasPunch && !hasLeave && !hasReg;
                        const isAbsent = isExplicitAbsent || isImplicitAbsent;

                        return (
                            <div key={ds}
                                onClick={() => handleDateClick(dayNum)}
                                className={`p-3 border-b md:border-b-0 md:border-r border-gray-200 cursor-pointer transition-all hover:opacity-90
                                   ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}
                                    ${holiday ? 'bg-amber-100/90 border border-amber-300' : ''}
                                    ${hasLeave && !holiday ? 'bg-indigo-100/90 border border-indigo-300' : ''}
                                    ${hasReg && !holiday && !hasLeave ? 'bg-blue-100/90 border border-blue-300' : ''}
                                    ${isPresent && !holiday && !hasLeave && !hasReg ? 'bg-emerald-100/90 border border-emerald-300' : ''}
                                    ${!isWorkDay && !holiday && !hasLeave && !isPresent ? 'bg-red-100/70 border border-red-200' : ''}
                                    ${isAbsent && !holiday && !hasLeave && !hasReg && !isPresent && isWorkDay ? 'bg-rose-100 border border-rose-300' : ''}
                                `}
                            >
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                                            ${isToday ? 'bg-indigo-600 text-white' : isWorkDay ? 'text-gray-800' : 'text-red-600'}
                                        `}>
                                            {dayNum}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium capitalize">
                                            {DAY_NAMES[dayIdx]}
                                        </span>
                                    </div>
                                    {holiday ? (
                                        <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-medium">
                                            Holiday
                                        </span>
                                    ) : hasLeave ? (
                                        <span className="text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-300 px-1.5 py-0.5 rounded font-medium">
                                            Leave
                                        </span>
                                    ) : hasReg ? (
                                        <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-300 px-1.5 py-0.5 rounded font-medium">
                                            Reg
                                        </span>
                                    ) : isPresent ? (
                                        <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-bold">
                                            Present
                                        </span>
                                    ) : !isWorkDay ? (
                                        <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                                            Off
                                        </span>
                                    ) : isAbsent ? (
                                        <span className="text-[9px] bg-rose-200 text-rose-900 border border-rose-300 px-1.5 py-0.5 rounded font-bold">
                                            Abs
                                        </span>
                                    ) : null}
                                </div>

                                {attRec && (attRec.punch_in_time || attRec.punch_out_time) && (
                                    <div className="mb-2 p-1.5 bg-emerald-50 border border-emerald-100 rounded text-[11px] text-emerald-800">
                                        <p className="font-semibold">In: {attRec.punch_in_time || '--'}</p>
                                        <p className="font-semibold">Out: {attRec.punch_out_time || '--'}</p>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    {events.length === 0 ? (
                                        <p className="text-[10px] text-gray-400 italic">No events</p>
                                    ) : (
                                        events.map((ev, ei) => (
                                            <div key={ei} className={`text-[10px] p-1.5 rounded font-medium ${ev.color || 'bg-gray-100 text-gray-700'}`}>
                                                <p className="font-semibold truncate">{ev.title || ev.name}</p>
                                                {ev.category && <p className="opacity-75 text-[9px]">{ev.category}</p>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CalendarGrid;
