import React, { useState } from 'react'
import { Timer, ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES, STANDARD_WORK_MINS, parseHHMM, minutesToHHMM } from '../hooks/useCalendarState'

function HoursSummary({ month, attendance = [], totalExtraMins, totalDeficitMins, totalCarryForwardMins = 0, openModal, setRegForm, isOvertimeApplicable = true, selectedDate }) {
    const [weekOffset, setWeekOffset] = useState(0);
    const [filterMode, setFilterMode] = useState('week'); // 'week' | 'month'

    // Compute active reference date based on weekOffset
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();
    const activeRefDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + (weekOffset * 7));

    // Calculate Week Start (Monday) and Week End (Sunday)
    const dayOfWeek = activeRefDate.getDay(); // 0 = Sun, 1 = Mon ...
    const distToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(activeRefDate.getFullYear(), activeRefDate.getMonth(), activeRefDate.getDate() + distToMon);
    const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);

    const formatDateLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const startDs = formatDateLocal(weekStart);
    const endDs = formatDateLocal(weekEnd);

    // Compute dynamic Month Header string
    const startMonthName = MONTH_NAMES[weekStart.getMonth()];
    const endMonthName = MONTH_NAMES[weekEnd.getMonth()];
    const displayMonthHeader = weekStart.getMonth() === weekEnd.getMonth()
        ? `${startMonthName} ${weekStart.getFullYear()}`
        : `${startMonthName} - ${endMonthName} ${weekStart.getFullYear()}`;

    // Filter attendance records based on mode
    const displayedAttendance = filterMode === 'week'
        ? (attendance || []).filter(a => {
            const d = a.date || a.attendance_date;
            return d >= startDs && d <= endDs;
        })
        : (attendance || []);

    // Recalculate metrics for displayed records
    const displayedWorkedMins = displayedAttendance.reduce((sum, a) => {
        const punchIn = a.punch_in_time || a.punch_in;
        const punchOut = a.punch_out_time || a.punch_out;
        if (!punchIn || !punchOut) return sum;
        return sum + (parseHHMM(punchOut) - parseHHMM(punchIn));
    }, 0);

    const displayedExtraMins = displayedAttendance.reduce((sum, a) => {
        const punchIn = a.punch_in_time || a.punch_in;
        const punchOut = a.punch_out_time || a.punch_out;
        if (!punchIn || !punchOut) return sum;
        const extra = (parseHHMM(punchOut) - parseHHMM(punchIn)) - STANDARD_WORK_MINS;
        return sum + (extra > 0 ? extra : 0);
    }, 0);

    const displayedDeficitMins = displayedAttendance.reduce((sum, a) => {
        const punchIn = a.punch_in_time || a.punch_in;
        const punchOut = a.punch_out_time || a.punch_out;
        if (!punchIn || !punchOut) return sum;
        const extra = (parseHHMM(punchOut) - parseHHMM(punchIn)) - STANDARD_WORK_MINS;
        return sum + (extra < 0 ? Math.abs(extra) : 0);
    }, 0);

    const statCards = isOvertimeApplicable ? [
        { label: 'Extra Hours', value: minutesToHHMM(displayedExtraMins), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Deficit Hours', value: minutesToHHMM(displayedDeficitMins), color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        { label: 'Carry Forward', value: minutesToHHMM(totalCarryForwardMins), color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Working Days', value: displayedAttendance.filter(a => a.status === 'present').length + 'd', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
    ] : [
        { label: 'Total Hours Worked', value: minutesToHHMM(displayedWorkedMins), color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Working Days', value: displayedAttendance.filter(a => a.status === 'present').length + 'd', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                <div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <Timer size={18} className="text-indigo-600" />
                        Hours Summary — <span className="text-indigo-600">{displayMonthHeader}</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {filterMode === 'week'
                            ? `Week Range: ${weekStart.getDate()} ${startMonthName.slice(0, 3)} - ${weekEnd.getDate()} ${endMonthName.slice(0, 3)} (${displayedAttendance.length} records)`
                            : `Full Month Attendance (${displayedAttendance.length} records)`
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex bg-gray-100 p-0.5 rounded-md text-xs font-medium border border-gray-200">
                        <button
                            onClick={() => setFilterMode('week')}
                            className={`px-2.5 py-1 rounded cursor-pointer transition-all ${filterMode === 'week' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setFilterMode('month')}
                            className={`px-2.5 py-1 rounded cursor-pointer transition-all ${filterMode === 'month' ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Month
                        </button>
                    </div>

                    {filterMode === 'week' && (
                        <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
                            <button
                                onClick={() => setWeekOffset(w => w - 1)}
                                className="p-1.5 hover:bg-gray-50 border-r border-gray-300 text-gray-600 cursor-pointer"
                                title="Previous Week"
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <button
                                onClick={() => setWeekOffset(0)}
                                className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                                title="Reset to Current Week"
                            >
                                Current
                            </button>
                            <button
                                onClick={() => setWeekOffset(w => w + 1)}
                                className="p-1.5 hover:bg-gray-50 border-l border-gray-300 text-gray-600 cursor-pointer"
                                title="Next Week"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`grid grid-cols-2 ${isOvertimeApplicable ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-3 mb-5`}>
                {statCards.map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-lg p-3.5 text-center`}>
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50/50">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Date</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">In</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Out</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Hours</th>
                            {isOvertimeApplicable && <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Extra / Deficit</th>}
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {displayedAttendance.length === 0 ? (
                            <tr>
                                <td colSpan={isOvertimeApplicable ? 6 : 5} className="py-6 text-center text-xs text-gray-400">
                                    No attendance records found for this period.
                                </td>
                            </tr>
                        ) : (
                            displayedAttendance.map(a => {
                                const punchIn = a.punch_in_time || a.punch_in;
                                const punchOut = a.punch_out_time || a.punch_out;
                                const attDate = a.date || a.attendance_date;
                                const worked = punchIn && punchOut
                                    ? parseHHMM(punchOut) - parseHHMM(punchIn)
                                    : 0;
                                const extra = worked - STANDARD_WORK_MINS;
                                return (
                                    <tr key={attDate || Math.random()} className="hover:bg-gray-50">
                                        <td className="py-2 px-3 text-xs text-gray-700 font-medium">{attDate}</td>
                                        <td className="py-2 px-3 text-xs text-center text-gray-600">{punchIn || '—'}</td>
                                        <td className="py-2 px-3 text-xs text-center text-gray-600">{punchOut || '—'}</td>
                                        <td className="py-2 px-3 text-xs text-center font-medium text-gray-900">
                                            {worked > 0 ? minutesToHHMM(worked) : '—'}
                                        </td>
                                        {isOvertimeApplicable && (
                                            <td className="py-2 px-3 text-xs text-center">
                                                {a.status === 'absent' ? (
                                                    <span className="text-rose-600 font-medium">Absent</span>
                                                ) : extra > 0 ? (
                                                    <span className="text-emerald-600 font-semibold">+{minutesToHHMM(extra)}</span>
                                                ) : extra < 0 ? (
                                                    <span className="text-rose-600 font-semibold">−{minutesToHHMM(Math.abs(extra))}</span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                        )}
                                        <td className="py-2 px-3 text-center">
                                            {(a.status === 'absent' || !punchIn || !punchOut) && (
                                                <button
                                                    onClick={() => {
                                                        setRegForm(f => ({ ...f, date: attDate }))
                                                        openModal('regularize')
                                                    }}
                                                    className="text-xs text-indigo-600 hover:underline font-medium">
                                                    Regularize
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HoursSummary
