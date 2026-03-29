import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import {
    ArrowLeft, Clock, Send, X, CheckCircle, XCircle,
    AlertCircle, Eye, AlarmClock, Plus, ChevronLeft, ChevronRight
} from 'lucide-react'

// ─── Pure helpers ─────────────────────────────────────────────────────────────
function parseHHMM(str) {
    if (!str) return 0
    const [h, m] = str.split(':').map(Number)
    return h * 60 + (m || 0)
}
function minutesToHHMM(mins) {
    if (!mins || mins <= 0) return '0h 0m'
    return `${Math.floor(Math.abs(mins) / 60)}h ${Math.abs(mins) % 60}m`
}
const STANDARD = 9 * 60

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        approved: { cls: 'bg-green-100 text-green-800', icon: <CheckCircle size={10} /> },
        pending: { cls: 'bg-yellow-100 text-yellow-800', icon: <Clock size={10} /> },
        rejected: { cls: 'bg-red-100 text-red-800', icon: <XCircle size={10} /> },
        present: { cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={10} /> },
        absent: { cls: 'bg-rose-100 text-rose-700', icon: <AlertCircle size={10} /> },
    }
    const cfg = map[status] || map.pending
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.cls}`}>
            {cfg.icon}{status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

// ─── Colour rules (priority order, first match wins) ─────────────────────────
// Each day gets exactly one background + label based on the highest-priority state.
//
//  Priority  State                         bg              dot         label
//  1         regularize approved           indigo-600      indigo      Reg ✓
//  2         regularize pending            violet-400      violet      Reg…
//  3         leave approved                blue-500        blue        Leave
//  4         leave pending                 sky-400         sky         Leave?
//  5         present + overtime            emerald-600     emerald     + extra
//  6         present, all ok              green-400       green       Present
//  7         present, missing punch        amber-400       amber       Missing
//  8         absent                        rose-500        rose        Absent
//  9         weekend / no data             gray-100        —           —

function getDayMeta(dateStr, attendance, leaveRequests, regHistory) {
    // Check regularize first (highest priority)
    const reg = regHistory.find(r => r.date === dateStr)
    if (reg?.status === 'approved') return {
        bg: 'bg-indigo-600', text: 'text-white',
        dot: 'bg-indigo-400', label: 'Reg ✓',
        kind: 'reg_approved', reg,
    }
    if (reg?.status === 'pending') return {
        bg: 'bg-violet-400', text: 'text-white',
        dot: 'bg-violet-300', label: 'Reg…',
        kind: 'reg_pending', reg,
    }

    // Check leave
    const leave = leaveRequests.find(l =>
        l.status !== 'rejected' && dateStr >= l.from_date && dateStr <= l.to_date
    )
    if (leave?.status === 'approved') return {
        bg: 'bg-blue-500', text: 'text-white',
        dot: 'bg-blue-300', label: 'Leave',
        kind: 'leave_approved', leave,
    }
    if (leave?.status === 'pending') return {
        bg: 'bg-sky-400', text: 'text-white',
        dot: 'bg-sky-200', label: 'Leave?',
        kind: 'leave_pending', leave,
    }

    // Attendance
    const att = attendance.find(a => a.date === dateStr)
    if (!att) return { bg: 'bg-gray-100', text: 'text-gray-400', dot: '', label: '', kind: 'empty' }

    if (att.status === 'absent') return {
        bg: 'bg-rose-500', text: 'text-white',
        dot: 'bg-rose-300', label: 'Absent',
        kind: 'absent', att,
    }
    if (att.status === 'present') {
        const worked = parseHHMM(att.punch_out) - parseHHMM(att.punch_in)
        const extra = worked - STANDARD
        const missing = !att.punch_in || !att.punch_out

        if (missing) return {
            bg: 'bg-amber-400', text: 'text-white',
            dot: 'bg-amber-200', label: 'Miss',
            kind: 'missing', att,
        }
        if (extra > 0) return {
            bg: 'bg-emerald-600', text: 'text-white',
            dot: 'bg-emerald-300', label: '+' + minutesToHHMM(extra),
            kind: 'overtime', att, extra,
        }
        return {
            bg: 'bg-green-400', text: 'text-white',
            dot: 'bg-green-200', label: 'Present',
            kind: 'present', att,
        }
    }
    return { bg: 'bg-gray-100', text: 'text-gray-400', dot: '', label: '', kind: 'empty' }
}

// ─── Legend strip ─────────────────────────────────────────────────────────────
const LEGEND = [
    { color: 'bg-green-400', label: 'Present' },
    { color: 'bg-emerald-600', label: 'Overtime' },
    { color: 'bg-amber-400', label: 'Missing' },
    { color: 'bg-rose-500', label: 'Absent' },
    { color: 'bg-blue-500', label: 'Leave ✓' },
    { color: 'bg-sky-400', label: 'Leave Req' },
    { color: 'bg-indigo-600', label: 'Reg ✓' },
    { color: 'bg-violet-400', label: 'Reg Req' },
]

// ─── Day detail bottom sheet ──────────────────────────────────────────────────
function DayDetailSheet({ isOpen, dayMeta, dateStr, onClose, onRegularize }) {
    if (!isOpen || !dayMeta) return null

    const att = dayMeta.att
    const reg = dayMeta.reg
    const leave = dayMeta.leave

    const worked = att?.punch_in && att?.punch_out
        ? parseHHMM(att.punch_out) - parseHHMM(att.punch_in) : 0
    const extra = worked - STANDARD

    const canReg = ['absent', 'missing', 'present'].includes(dayMeta.kind) &&
        !['reg_approved', 'reg_pending'].includes(dayMeta.kind)

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[75vh] flex flex-col">

                {/* Handle + header */}
                <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-base font-bold text-gray-900">
                                {new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
                                    weekday: 'long', day: 'numeric', month: 'long'
                                })}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${dayMeta.bg}`} />
                                <span className="text-xs text-gray-500 capitalize">{dayMeta.kind?.replace('_', ' ')}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                            <X size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-3">

                    {/* Attendance row */}
                    {att && (
                        <div className="bg-gray-50 rounded-2xl p-4">
                            <p className="text-xs font-semibold text-gray-500 mb-3">Attendance</p>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Punch In</p>
                                    <p className="text-sm font-bold text-gray-900">{att.punch_in || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Punch Out</p>
                                    <p className="text-sm font-bold text-gray-900">{att.punch_out || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Hours</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {worked > 0 ? minutesToHHMM(worked) : '—'}
                                    </p>
                                </div>
                            </div>
                            {worked > 0 && (
                                <div className={`mt-3 p-2.5 rounded-xl text-center text-xs font-semibold
                                    ${extra > 0 ? 'bg-emerald-50 text-emerald-700' : extra < 0 ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {extra > 0 ? `+${minutesToHHMM(extra)} overtime · eligible for carry-forward`
                                        : extra < 0 ? `−${minutesToHHMM(Math.abs(extra))} short`
                                            : 'Exact standard hours'}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Leave info */}
                    {leave && (
                        <div className={`p-4 rounded-2xl border
                            ${leave.status === 'approved' ? 'bg-blue-50 border-blue-200' : 'bg-sky-50 border-sky-200'}`}>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Leave</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{leave.leave_name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {leave.from_date} → {leave.to_date} · {leave.days} days
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{leave.reason}</p>
                                </div>
                                <StatusBadge status={leave.status} />
                            </div>
                        </div>
                    )}

                    {/* Regularize info */}
                    {reg && (
                        <div className={`p-4 rounded-2xl border
                            ${reg.status === 'approved' ? 'bg-indigo-50 border-indigo-200' : 'bg-violet-50 border-violet-200'}`}>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Regularization</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{reg.punch_in} → {reg.punch_out}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{reg.reason}</p>
                                    {reg.remarks && <p className="text-xs text-indigo-600 mt-0.5">"{reg.remarks}"</p>}
                                </div>
                                <StatusBadge status={reg.status} />
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {dayMeta.kind === 'empty' && (
                        <div className="text-center py-8 text-gray-400">
                            <AlarmClock size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No records for this date</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
                    {canReg && (
                        <button onClick={() => { onClose(); onRegularize(dateStr) }}
                            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-semibold
                                       flex items-center justify-center gap-2">
                            <AlarmClock size={15} /> Regularize
                        </button>
                    )}
                    <button onClick={onClose}
                        className={`py-3 rounded-2xl text-sm font-semibold border border-gray-200 text-gray-600
                            ${canReg ? 'flex-none px-5' : 'flex-1'}`}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Regularize form sheet ────────────────────────────────────────────────────
function RegularizeSheet({ isOpen, onClose, prefillDate, onSubmit }) {
    const [form, setForm] = useState({ date: prefillDate || '', punch_in: '', punch_out: '', reason: '' })

    React.useEffect(() => {
        if (isOpen) setForm(f => ({ ...f, date: prefillDate || '' }))
    }, [isOpen, prefillDate])

    if (!isOpen) return null

    const worked = form.punch_in && form.punch_out
        ? parseHHMM(form.punch_out) - parseHHMM(form.punch_in) : 0
    const extra = worked - STANDARD

    const handleSubmit = () => {
        if (!form.date || !form.punch_in || !form.punch_out || !form.reason.trim()) {
            alert('Please fill all required fields'); return
        }
        onSubmit(form); onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
                    <div>
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                        <p className="text-base font-semibold text-gray-900">Regularize Attendance</p>
                        <p className="text-xs text-gray-500 mt-0.5">Correct missing or wrong punch times</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-4">
                    <div className="flex gap-2.5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <AlarmClock size={15} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-700">
                            Your manager will review and approve. Extra hours are tracked for carry-forward.
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1.5">Date *</p>
                        <input type="date" value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                       text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-1.5">Punch In *</p>
                            <input type="time" value={form.punch_in}
                                onChange={e => setForm(f => ({ ...f, punch_in: e.target.value }))}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                           text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-1.5">Punch Out *</p>
                            <input type="time" value={form.punch_out}
                                onChange={e => setForm(f => ({ ...f, punch_out: e.target.value }))}
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                           text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                        </div>
                    </div>

                    {worked > 0 && (
                        <div className="grid grid-cols-3 gap-2.5">
                            <div className="bg-gray-50 rounded-2xl p-3 text-center">
                                <p className="text-base font-bold text-gray-900">{minutesToHHMM(worked)}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Total</p>
                            </div>
                            <div className={`rounded-2xl p-3 text-center ${extra > 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                                <p className={`text-base font-bold ${extra > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {extra > 0 ? '+' : '−'}{minutesToHHMM(Math.abs(extra))}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Extra/Deficit</p>
                            </div>
                            <div className={`rounded-2xl p-3 text-center ${extra > 0 ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                                <p className={`text-base font-bold ${extra > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    {extra > 0 ? minutesToHHMM(extra) : '—'}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Carry Fwd</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1.5">Reason *</p>
                        <textarea value={form.reason}
                            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                            rows={3}
                            placeholder="e.g., Forgot to punch out, system error, WFH..."
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                       text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
                    </div>
                </div>

                <div className="flex-shrink-0 flex gap-3 px-5 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm font-medium">
                        Cancel
                    </button>
                    <button onClick={handleSubmit}
                        className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-semibold
                                   flex items-center justify-center gap-2">
                        <Send size={14} /> Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── History detail sheet ─────────────────────────────────────────────────────
function HistoryDetailSheet({ request, onClose }) {
    if (!request) return null
    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[70vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
                    <div>
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                        <p className="text-base font-semibold text-gray-900">Regularization Details</p>
                        <p className="font-mono text-xs text-indigo-600 mt-0.5">{request.id}</p>
                    </div>
                    <StatusBadge status={request.status} />
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                        {[
                            { label: 'Date', value: request.date },
                            { label: 'Punch In', value: request.punch_in },
                            { label: 'Punch Out', value: request.punch_out },
                            { label: 'Applied On', value: request.applied_on },
                        ].map(d => (
                            <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                                <p className="text-[10px] text-gray-400 mb-0.5">{d.label}</p>
                                <p className="text-sm font-semibold text-gray-900">{d.value || '—'}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Reason</p>
                        <p className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-800">{request.reason}</p>
                    </div>
                    {request.remarks && (
                        <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">Manager Remarks</p>
                            <p className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-sm">{request.remarks}</p>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold">Close</button>
                </div>
            </div>
        </div>
    )
}

// ─── Attendance Calendar ──────────────────────────────────────────────────────
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function AttendanceCalendar({ attendance, leaveRequests, regHistory, onRegularize }) {
    const [current, setCurrent] = useState(new Date())
    const [dayDetail, setDayDetail] = useState(null)   // { dateStr, meta }

    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const todayStr = new Date().toISOString().split('T')[0]

    // Month summary counts
    const countByKind = {}
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = new Date(year, month, d).toISOString().split('T')[0]
        const meta = getDayMeta(ds, attendance, leaveRequests, regHistory)
        countByKind[meta.kind] = (countByKind[meta.kind] || 0) + 1
    }

    // Overtime total for month
    const overtimeMins = attendance
        .filter(a => {
            const d = new Date(a.date)
            return d.getFullYear() === year && d.getMonth() === month
        })
        .reduce((sum, a) => {
            if (!a.punch_in || !a.punch_out) return sum
            const extra = parseHHMM(a.punch_out) - parseHHMM(a.punch_in) - STANDARD
            return sum + (extra > 0 ? extra : 0)
        }, 0)

    return (
        <div className="flex flex-col h-full">

            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
                <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
                    className="p-2 rounded-xl hover:bg-gray-100">
                    <ChevronLeft size={18} className="text-gray-600" />
                </button>
                <p className="text-sm font-bold text-gray-900">{MONTH_NAMES[month]} {year}</p>
                <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
                    className="p-2 rounded-xl hover:bg-gray-100">
                    <ChevronRight size={18} className="text-gray-600" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">

                {/* Summary strip */}
                <div className="flex gap-2 px-3 py-3 overflow-x-auto hide-scrollbar">
                    {[
                        { label: 'Present', value: (countByKind['present'] || 0) + (countByKind['overtime'] || 0), color: 'bg-green-400' },
                        { label: 'Absent', value: countByKind['absent'] || 0, color: 'bg-rose-500' },
                        { label: 'Missing', value: countByKind['missing'] || 0, color: 'bg-amber-400' },
                        { label: 'On Leave', value: (countByKind['leave_approved'] || 0) + (countByKind['leave_pending'] || 0), color: 'bg-blue-500' },
                        { label: 'OT', value: overtimeMins > 0 ? minutesToHHMM(overtimeMins) : '0h', color: 'bg-emerald-600' },
                    ].map(s => (
                        <div key={s.label}
                            className="flex-shrink-0 flex flex-col items-center bg-white border border-gray-100
                                       rounded-2xl px-3 py-2.5 min-w-[64px]">
                            <div className={`w-2.5 h-2.5 rounded-full ${s.color} mb-1.5`} />
                            <p className="text-sm font-bold text-gray-900">{s.value}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 text-center">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 px-2 pb-1">
                    {DAY_NAMES.map((d, i) => (
                        <div key={d}
                            className={`text-center text-[10px] font-bold py-1
                                ${i === 0 || i === 6 ? 'text-rose-400' : 'text-gray-400'}`}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1.5 px-2 pb-4">
                    {/* Empty cells for month offset */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`e${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const d = i + 1
                        const ds = new Date(year, month, d).toISOString().split('T')[0]
                        const meta = getDayMeta(ds, attendance, leaveRequests, regHistory)
                        const isToday = ds === todayStr
                        const isWknd = new Date(year, month, d).getDay() === 0 ||
                            new Date(year, month, d).getDay() === 6

                        return (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setDayDetail({ dateStr: ds, meta })}
                                className={`relative flex flex-col items-center justify-start
                                           rounded-2xl pt-2 pb-1.5 transition-all
                                           min-h-[64px]
                                           ${meta.kind === 'empty' || isWknd
                                        ? 'bg-gray-50'
                                        : meta.bg}
                                           ${isToday ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}
                                           active:scale-95`}
                            >
                                {/* Date number */}
                                <span className={`text-xs font-bold leading-none
                                    ${meta.kind === 'empty' || isWknd ? (isWknd ? 'text-rose-300' : 'text-gray-300') : meta.text}`}>
                                    {d}
                                </span>

                                {/* Label pill */}
                                {meta.label && meta.kind !== 'empty' && (
                                    <span className={`mt-1 text-[8px] font-semibold leading-none
                                        px-1 py-0.5 rounded-md
                                        ${meta.text} bg-black/10`}>
                                        {meta.label}
                                    </span>
                                )}

                                {/* Overtime dot */}
                                {meta.kind === 'overtime' && (
                                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-yellow-300" />
                                )}

                                {/* Today indicator */}
                                {isToday && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                                                     w-1 h-1 rounded-full bg-indigo-600" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mx-3 mb-4 p-3 bg-white border border-gray-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Legend</p>
                    <div className="grid grid-cols-4 gap-y-2 gap-x-1">
                        {LEGEND.map(l => (
                            <div key={l.label} className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${l.color}`} />
                                <span className="text-[10px] text-gray-500 truncate">{l.label}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 flex-shrink-0" />
                            <span className="text-[10px] text-gray-500">OT dot</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full border-2 border-indigo-500 flex-shrink-0" />
                            <span className="text-[10px] text-gray-500">Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Day detail sheet */}
            <DayDetailSheet
                isOpen={!!dayDetail}
                dayMeta={dayDetail?.meta}
                dateStr={dayDetail?.dateStr}
                onClose={() => setDayDetail(null)}
                onRegularize={(ds) => { setDayDetail(null); onRegularize(ds) }}
            />
        </div>
    )
}

// ─── Main RegularizeMobile ────────────────────────────────────────────────────
function RegularizeMobile() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('attendance')
    const [sheetOpen, setSheetOpen] = useState(false)
    const [prefillDate, setPrefillDate] = useState('')
    const [detailReq, setDetailReq] = useState(null)

    const [attendance] = useState([
        { date: '2026-03-18', punch_in: '09:05', punch_out: '19:30', status: 'present' },
        { date: '2026-03-17', punch_in: '08:55', punch_out: '18:00', status: 'present' },
        { date: '2026-03-16', punch_in: '09:10', punch_out: '20:45', status: 'present' },
        { date: '2026-03-15', punch_in: '', punch_out: '', status: 'absent' },
        { date: '2026-03-14', punch_in: '09:00', punch_out: '18:05', status: 'present' },
        { date: '2026-03-13', punch_in: '09:15', punch_out: '', status: 'present' },
        { date: '2026-03-12', punch_in: '', punch_out: '', status: 'absent' },
        { date: '2026-03-11', punch_in: '08:50', punch_out: '19:00', status: 'present' },
        { date: '2026-03-10', punch_in: '09:00', punch_out: '18:00', status: 'present' },
        { date: '2026-03-07', punch_in: '09:05', punch_out: '21:00', status: 'present' },
        { date: '2026-03-06', punch_in: '09:00', punch_out: '18:00', status: 'present' },
        { date: '2026-03-05', punch_in: '08:45', punch_out: '20:00', status: 'present' },
        { date: '2026-03-04', punch_in: '', punch_out: '', status: 'absent' },
        { date: '2026-03-03', punch_in: '09:00', punch_out: '18:00', status: 'present' },
    ])

    const [leaveRequests] = useState([
        { id: 'LR001', leave_type: 'CL', leave_name: 'Casual Leave', from_date: '2026-03-20', to_date: '2026-03-22', days: 3, reason: 'Family function', status: 'approved' },
        { id: 'LR002', leave_type: 'EL', leave_name: 'Earned Leave', from_date: '2026-03-25', to_date: '2026-03-26', days: 2, reason: 'Vacation', status: 'pending' },
    ])

    const [regHistory, setRegHistory] = useState([
        { id: 'REG001', date: '2026-03-10', punch_in: '09:00', punch_out: '18:30', reason: 'System issue', status: 'approved', applied_on: '2026-03-11', remarks: 'Approved' },
        { id: 'REG002', date: '2026-03-08', punch_in: '08:45', punch_out: '18:00', reason: 'Forgot to punch', status: 'pending', applied_on: '2026-03-09' },
        { id: 'REG003', date: '2026-03-05', punch_in: '09:00', punch_out: '17:30', reason: 'WFH - no biometric', status: 'rejected', applied_on: '2026-03-06', remarks: 'WFH not approved' },
    ])

    const handleOpen = (date = '') => {
        setPrefillDate(date)
        setSheetOpen(true)
    }

    const handleSubmit = (form) => {
        const newReq = {
            id: `REG${String(regHistory.length + 1).padStart(3, '0')}`,
            date: form.date,
            punch_in: form.punch_in,
            punch_out: form.punch_out,
            reason: form.reason,
            status: 'pending',
            applied_on: new Date().toISOString().split('T')[0],
        }
        setRegHistory(prev => [newReq, ...prev])
        setTab('history')
    }

    const pendingCount = regHistory.filter(r => r.status === 'pending').length

    return (
        <div className="flex flex-col h-full bg-gray-50">

            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 pt-4 pb-3">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <p className="text-base font-semibold text-gray-900">Attendance & Regularize</p>
                    </div>
                    <button onClick={() => handleOpen()}
                        className="bg-emerald-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-1">
                        <Plus size={14} /> New
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1">
                    {[
                        { id: 'attendance', label: '📅 Calendar' },
                        { id: 'history', label: `🕐 History${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                                ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">

                {/* ── Calendar tab ── */}
                {tab === 'attendance' && (
                    <AttendanceCalendar
                        attendance={attendance}
                        leaveRequests={leaveRequests}
                        regHistory={regHistory}
                        onRegularize={handleOpen}
                    />
                )}

                {/* ── History tab ── */}
                {tab === 'history' && (
                    <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-2.5">
                        {regHistory.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <AlarmClock size={36} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No regularization requests</p>
                            </div>
                        ) : regHistory.map(r => (
                            <div key={r.id}
                                className={`bg-white border border-gray-200 border-l-4 rounded-2xl p-4
                                    ${r.status === 'approved' ? 'border-l-indigo-500'
                                        : r.status === 'rejected' ? 'border-l-red-400'
                                            : 'border-l-violet-400'}`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{r.date}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{r.punch_in} → {r.punch_out}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                                <p className="text-xs text-gray-400 mb-2.5">{r.reason}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">Applied {r.applied_on}</span>
                                    <button onClick={() => setDetailReq(r)}
                                        className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                                        <Eye size={12} /> Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <RegularizeSheet
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                prefillDate={prefillDate}
                onSubmit={handleSubmit}
            />
            <HistoryDetailSheet request={detailReq} onClose={() => setDetailReq(null)} />
        </div>
    )
}

export default RegularizeMobile