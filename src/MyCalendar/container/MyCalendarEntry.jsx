import React, { useState, useEffect } from 'react'
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight,
    Users, Cake, Home, Briefcase, Award, Bell, X, Plus,
    CalendarDays, User, UserPlus, Check, Trash2, Building,
    BellPlus, BellRing, Clock, AlarmClock, Send, Info,
    CheckCircle, XCircle, TrendingUp, ArrowRight,
    Timer, PlusCircle, FileText, Upload
} from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        holiday: 'bg-red-100 text-red-700',
        completed: 'bg-gray-100 text-gray-600',
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

function calculateLeaveDays(from, to) {
    if (!from || !to) return 0
    const start = new Date(from), end = new Date(to)
    let days = 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()
        if (day !== 0 && day !== 6) days++
    }
    return days
}

function parseHHMM(str) {
    if (!str) return 0
    const [h, m] = str.split(':').map(Number)
    return h * 60 + (m || 0)
}

function minutesToHHMM(mins) {
    if (mins <= 0) return '0h 0m'
    const h = Math.floor(Math.abs(mins) / 60)
    const m = Math.abs(mins) % 60
    return `${h}h ${m}m`
}

// ─── Leave types ──────────────────────────────────────────────────────────────
const LEAVE_TYPES = [
    { code: 'CL', name: 'Casual Leave', balance: 8, total: 12, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { code: 'SL', name: 'Sick Leave', balance: 5, total: 10, color: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    { code: 'EL', name: 'Earned Leave', balance: 12, total: 18, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { code: 'CO', name: 'Comp Off', balance: 2, total: 2, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    { code: 'UL', name: 'Unpaid Leave', balance: 0, total: 0, color: 'bg-gray-400', light: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
]

// ─── Static company data ──────────────────────────────────────────────────────
const COMPANY_HOLIDAYS = [
    { date: '2026-01-26', title: 'Republic Day', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-08-15', title: 'Independence Day', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-10-02', title: 'Gandhi Jayanti', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-12-25', title: 'Christmas', type: 'holiday', color: 'bg-red-100 text-red-700' },
]

const TEAM_BIRTHDAYS = [
    { date: '2026-03-15', name: 'John Smith', department: 'Engineering', type: 'birthday' },
    { date: '2026-03-20', name: 'Sarah Johnson', department: 'HR', type: 'birthday' },
    { date: '2026-03-28', name: 'Mike Chen', department: 'Sales', type: 'birthday' },
]

const WORK_ANNIVERSARIES = [
    { date: '2026-03-10', name: 'David Lee', department: 'Engineering', years: 5, type: 'anniversary' },
    { date: '2026-03-18', name: 'Maria Garcia', department: 'HR', years: 3, type: 'anniversary' },
]

const IMPORTANT_DATES = [
    { date: '2026-03-31', title: 'Year-End Review', type: 'meeting', color: 'bg-indigo-100 text-indigo-700' },
    { date: '2026-03-25', title: 'Payroll Processing', type: 'deadline', color: 'bg-red-100 text-red-700' },
]

// Standard work hours per day in minutes
const STANDARD_WORK_MINS = 9 * 60  // 9 hours

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar">
                    {children}
                </div>
                {footer && (
                    <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
function MyCalendarEntry() {
    const userRole = localStorage.getItem('userRole') || 'employee'
    const isManager = ['admin', 'hr', 'payroll_manager', 'manager'].includes(userRole)

    const [currentDate, setCurrent] = useState(new Date())
    const [selectedDate, setSelected] = useState(new Date())
    const [view, setView] = useState('month')   // month | week

    // ── Modal visibility ──────────────────────────────────────────────────────
    const [modal, setModal] = useState(null)
    // null | 'leave' | 'regularize' | 'reminder' | 'dateDetail'

    const openModal = (name) => setModal(name)
    const closeModal = () => setModal(null)

    // ── Leave apply form ──────────────────────────────────────────────────────
    const [leaveForm, setLeaveForm] = useState({
        leave_type: '', from_date: '', to_date: '',
        half_day: false, half_day_type: 'first_half',
        reason: '', contact_number: '', address: '',
        handover_notes: '', urgent: false,
    })
    const [leaveRequests, setLeaveRequests] = useState([
        { id: 'LR001', leave_type: 'CL', leave_name: 'Casual Leave', from_date: '2026-03-20', to_date: '2026-03-22', days: 3, reason: 'Family function', status: 'approved', applied_on: '2026-03-10' },
        { id: 'LR002', leave_type: 'SL', leave_name: 'Sick Leave', from_date: '2026-03-05', to_date: '2026-03-06', days: 2, reason: 'Fever', status: 'approved', applied_on: '2026-03-05' },
        { id: 'LR003', leave_type: 'EL', leave_name: 'Earned Leave', from_date: '2026-04-01', to_date: '2026-04-05', days: 5, reason: 'Vacation', status: 'pending', applied_on: '2026-03-16' },
    ])

    // ── Regularize form ───────────────────────────────────────────────────────
    const [regForm, setRegForm] = useState({
        date: '', punch_in: '', punch_out: '', reason: '',
    })
    // Attendance records — punch_in / punch_out / extra_minutes / carry_forward
    const [attendance, setAttendance] = useState([
        { date: '2026-03-18', punch_in: '09:05', punch_out: '19:30', status: 'present', regularized: false },
        { date: '2026-03-17', punch_in: '08:55', punch_out: '18:00', status: 'present', regularized: false },
        { date: '2026-03-16', punch_in: '09:10', punch_out: '20:45', status: 'present', regularized: false },
        { date: '2026-03-15', punch_in: '', punch_out: '', status: 'absent', regularized: false },
        { date: '2026-03-14', punch_in: '09:00', punch_out: '18:00', status: 'present', regularized: false },
    ])
    const [regRequests, setRegRequests] = useState([
        { id: 'REG001', date: '2026-03-12', punch_in: '09:00', punch_out: '18:30', reason: 'System issue', status: 'approved' },
        { id: 'REG002', date: '2026-03-10', punch_in: '08:45', punch_out: '18:00', reason: 'Forgot to punch', status: 'pending' },
    ])

    // ── Reminders ─────────────────────────────────────────────────────────────
    const [reminderForm, setReminderForm] = useState({
        title: '', time: '09:00', type: 'personal', priority: 'medium', note: '', forUserId: null,
    })
    const [reminders, setReminders] = useState([
        { id: 1, title: 'Submit monthly report', date: '2026-03-25', time: '10:00', type: 'personal', priority: 'high', note: 'Submit before EOD', status: 'pending' },
        { id: 2, title: 'Team weekly sync', date: '2026-03-21', time: '14:00', type: 'team', priority: 'medium', note: 'Prepare agenda', status: 'pending' },
        { id: 3, title: 'Performance review', date: '2026-03-28', time: '09:00', type: 'employee', priority: 'high', note: 'Review with John Smith', status: 'pending' },
        { id: 4, title: 'Submit timesheet', date: '2026-03-31', time: '17:00', type: 'personal', priority: 'medium', note: 'Weekly timesheet', status: 'pending' },
    ])

    const TEAM_MEMBERS = [
        { id: 'emp1', name: 'John Smith', role: 'Developer' },
        { id: 'emp2', name: 'Sarah Johnson', role: 'Designer' },
        { id: 'emp3', name: 'Mike Chen', role: 'QA' },
    ]

    // ── Date detail ───────────────────────────────────────────────────────────
    const [detailDate, setDetailDate] = useState(null)

    // ── Calendar helpers ──────────────────────────────────────────────────────
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const getDaysInMonth = () => {
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        return { firstDay, daysInMonth }
    }

    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1))
    const goToToday = () => { const t = new Date(); setCurrent(t); setSelected(t) }

    const dateStr = (d) => new Date(year, month, d).toISOString().split('T')[0]

    // All events for a date
    const getEvents = (ds) => {
        const events = []
        COMPANY_HOLIDAYS.filter(e => e.date === ds).forEach(e => events.push({ ...e, category: 'Holiday' }))
        TEAM_BIRTHDAYS.filter(e => e.date === ds).forEach(e => events.push({ ...e, category: 'Birthday' }))
        WORK_ANNIVERSARIES.filter(e => e.date === ds).forEach(e => events.push({ ...e, category: 'Anniversary' }))
        IMPORTANT_DATES.filter(e => e.date === ds).forEach(e => events.push({ ...e, category: 'Event' }))
        leaveRequests.filter(l => l.status !== 'rejected' && ds >= l.from_date && ds <= l.to_date)
            .forEach(l => events.push({ ...l, category: 'My Leave', color: 'bg-blue-100 text-blue-700', title: l.leave_name }))
        reminders.filter(r => r.status === 'pending' && r.date === ds)
            .forEach(r => events.push({ ...r, category: 'Reminder', color: 'bg-yellow-100 text-yellow-700' }))
        return events
    }

    // Extra/carry-forward minutes for a date
    const getExtra = (ds) => {
        const rec = attendance.find(a => a.date === ds)
        if (!rec || !rec.punch_in || !rec.punch_out) return 0
        const worked = parseHHMM(rec.punch_out) - parseHHMM(rec.punch_in)
        return worked - STANDARD_WORK_MINS
    }

    // ── Upcoming items ────────────────────────────────────────────────────────
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 14)

    const upcomingReminders = reminders
        .filter(r => r.status === 'pending' && new Date(r.date) >= today && new Date(r.date) <= nextWeek)
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    const upcomingEvents = [
        ...COMPANY_HOLIDAYS.map(e => ({ ...e, category: 'Holiday' })),
        ...TEAM_BIRTHDAYS.map(e => ({ ...e, category: 'Birthday', title: e.name })),
        ...WORK_ANNIVERSARIES.map(e => ({ ...e, category: 'Anniversary', title: `${e.name} (${e.years}y)` })),
        ...IMPORTANT_DATES.map(e => ({ ...e, category: 'Event' })),
    ].filter(e => { const d = new Date(e.date); return d >= today && d <= nextWeek })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    // ── Carry-forward summary ─────────────────────────────────────────────────
    const totalExtraMins = attendance.reduce((sum, a) => {
        const extra = getExtra(a.date)
        return sum + (extra > 0 ? extra : 0)
    }, 0)
    const totalDeficitMins = attendance.reduce((sum, a) => {
        const extra = getExtra(a.date)
        return sum + (extra < 0 ? Math.abs(extra) : 0)
    }, 0)

    // ── Leave apply submit ────────────────────────────────────────────────────
    const handleLeaveSubmit = () => {
        if (!leaveForm.leave_type || !leaveForm.from_date || !leaveForm.to_date || !leaveForm.reason.trim()) {
            alert('Please fill all required fields'); return
        }
        const lt = LEAVE_TYPES.find(l => l.code === leaveForm.leave_type)
        const days = calculateLeaveDays(leaveForm.from_date, leaveForm.to_date)
        const newReq = {
            id: `LR${String(leaveRequests.length + 1).padStart(3, '0')}`,
            leave_type: leaveForm.leave_type,
            leave_name: lt?.name || '',
            from_date: leaveForm.from_date,
            to_date: leaveForm.to_date,
            days,
            reason: leaveForm.reason,
            status: 'pending',
            applied_on: new Date().toISOString().split('T')[0],
        }
        setLeaveRequests(prev => [newReq, ...prev])
        setLeaveForm({ leave_type: '', from_date: '', to_date: '', half_day: false, half_day_type: 'first_half', reason: '', contact_number: '', address: '', handover_notes: '', urgent: false })
        closeModal()
        alert('Leave request submitted!')
    }

    // ── Regularize submit ─────────────────────────────────────────────────────
    const handleRegSubmit = () => {
        if (!regForm.date || !regForm.punch_in || !regForm.punch_out || !regForm.reason.trim()) {
            alert('Please fill all required fields'); return
        }
        const newReg = {
            id: `REG${String(regRequests.length + 1).padStart(3, '0')}`,
            date: regForm.date,
            punch_in: regForm.punch_in,
            punch_out: regForm.punch_out,
            reason: regForm.reason,
            status: 'pending',
        }
        setRegRequests(prev => [newReg, ...prev])
        setRegForm({ date: '', punch_in: '', punch_out: '', reason: '' })
        closeModal()
        alert('Regularization request submitted!')
    }

    // ── Reminder submit ───────────────────────────────────────────────────────
    const handleReminderSubmit = () => {
        if (!reminderForm.title.trim()) { alert('Please enter a title'); return }
        const newRem = {
            id: Date.now(),
            ...reminderForm,
            date: selectedDate.toISOString().split('T')[0],
            status: 'pending',
        }
        setReminders(prev => [...prev, newRem])
        setReminderForm({ title: '', time: '09:00', type: 'personal', priority: 'medium', note: '', forUserId: null })
        closeModal()
    }

    const handleReminderComplete = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r))
    const handleReminderDelete = (id) => setReminders(prev => prev.filter(r => r.id !== id))

    // ── Date click ────────────────────────────────────────────────────────────
    const handleDateClick = (d) => {
        const ds = dateStr(d)
        setSelected(new Date(year, month, d))
        const events = getEvents(ds)
        const attRec = attendance.find(a => a.date === ds)
        const extra = getExtra(ds)
        setDetailDate({ ds, events, attRec, extra })
        openModal('dateDetail')
    }

    const { firstDay, daysInMonth } = getDaysInMonth()
    const selDs = selectedDate.toISOString().split('T')[0]

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <BreadCrumb
                items={[{ label: 'My Calendar' }]}
                title="My Calendar"
                description="Leave apply, regularization, reminders, important dates and time tracking"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => openModal('leave')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <Plus size={15} /> Apply Leave
                        </button>
                        <button onClick={() => openModal('regularize')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <AlarmClock size={15} /> Regularize
                        </button>
                        <button onClick={() => { setSelected(selectedDate); openModal('reminder') }}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
                            <BellPlus size={15} /> Add Reminder
                        </button>
                    </div>
                }
            />

            {/* ── Legend ───────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-5">
                {[
                    { color: 'bg-red-400', label: 'Holiday' },
                    { color: 'bg-pink-400', label: 'Birthday' },
                    { color: 'bg-purple-400', label: 'Anniversary' },
                    { color: 'bg-blue-400', label: 'My Leave' },
                    { color: 'bg-yellow-400', label: 'Reminder' },
                    { color: 'bg-indigo-400', label: 'Event' },
                    { color: 'bg-emerald-400', label: 'Extra Hours' },
                    { color: 'bg-rose-400', label: 'Absent' },
                ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                        <span className="text-xs text-gray-600">{l.label}</span>
                    </div>
                ))}
            </div>

            {/* ── Main grid ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left: Calendar + stats ─────────────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Calendar card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Nav bar */}
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
                                            {/* Extra hours dot */}
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

                    {/* ── Time / Carry-forward summary ───────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Timer size={18} className="text-indigo-600" />
                            Hours Summary — {MONTH_NAMES[month]}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                            {[
                                { label: 'Extra Hours', value: minutesToHHMM(totalExtraMins), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                { label: 'Deficit Hours', value: minutesToHHMM(totalDeficitMins), color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                                { label: 'Carry Forward', value: minutesToHHMM(Math.max(0, totalExtraMins - totalDeficitMins)), color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                                { label: 'Working Days', value: attendance.filter(a => a.status === 'present').length + 'd', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
                            ].map(s => (
                                <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 text-center`}>
                                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Per-day attendance table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Date</th>
                                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">In</th>
                                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Out</th>
                                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Hours</th>
                                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Extra / Deficit</th>
                                        <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendance.map(a => {
                                        const worked = a.punch_in && a.punch_out
                                            ? parseHHMM(a.punch_out) - parseHHMM(a.punch_in)
                                            : 0
                                        const extra = worked - STANDARD_WORK_MINS
                                        return (
                                            <tr key={a.date} className="hover:bg-gray-50">
                                                <td className="py-2 px-3 text-xs text-gray-700 font-medium">{a.date}</td>
                                                <td className="py-2 px-3 text-xs text-center text-gray-600">{a.punch_in || '—'}</td>
                                                <td className="py-2 px-3 text-xs text-center text-gray-600">{a.punch_out || '—'}</td>
                                                <td className="py-2 px-3 text-xs text-center font-medium text-gray-900">
                                                    {worked > 0 ? minutesToHHMM(worked) : '—'}
                                                </td>
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
                                                <td className="py-2 px-3 text-center">
                                                    {(a.status === 'absent' || !a.punch_in || !a.punch_out) && (
                                                        <button
                                                            onClick={() => {
                                                                setRegForm(f => ({ ...f, date: a.date }))
                                                                openModal('regularize')
                                                            }}
                                                            className="text-xs text-indigo-600 hover:underline font-medium">
                                                            Regularize
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Team leaves this month ─────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-indigo-600" />
                            Team Leaves This Month
                        </h3>
                        <div className="space-y-2">
                            {[
                                { name: 'Raj Kumar', department: 'Engineering', type: 'Sick Leave', status: 'approved', date: '2026-03-18' },
                                { name: 'Maria Garcia', department: 'HR', type: 'Annual Leave', status: 'approved', date: '2026-03-19' },
                                { name: 'Alex Turner', department: 'Sales', type: 'WFH', status: 'approved', date: '2026-03-20' },
                            ].map((l, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                                            {l.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                                            <p className="text-xs text-gray-500">{l.department} · {l.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <StatusBadge status={l.status} />
                                        <p className="text-xs text-gray-400 mt-0.5">{l.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right sidebar ──────────────────────────────────────── */}
                <div className="space-y-5">

                    {/* Selected day panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-sm">
                                {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </h3>
                            <button onClick={() => openModal('reminder')}
                                className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-xl">
                                <BellPlus size={12} /> Remind
                            </button>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                            {getEvents(selDs).length === 0 ? (
                                <div className="text-center py-5 text-gray-400">
                                    <CalendarDays size={28} className="mx-auto mb-1 opacity-30" />
                                    <p className="text-xs">No events</p>
                                </div>
                            ) : getEvents(selDs).map((ev, i) => (
                                <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl border ${ev.color || 'bg-gray-50 text-gray-700'}`}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate">{ev.title || ev.name || ev.type}</p>
                                        <p className="text-[10px] opacity-70 mt-0.5">{ev.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leave balance mini */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-sm">Leave Balance</h3>
                            <button onClick={() => openModal('leave')}
                                className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-xl">
                                + Apply
                            </button>
                        </div>
                        <div className="space-y-2.5">
                            {LEAVE_TYPES.filter(lt => lt.code !== 'UL').map(lt => (
                                <div key={lt.code}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs text-gray-700 font-medium">{lt.name}</span>
                                        <span className={`text-xs font-bold ${lt.text}`}>{lt.balance}/{lt.total}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${lt.color} rounded-full`}
                                            style={{ width: `${(lt.balance / lt.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming events */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                            <CalendarDays size={15} className="text-indigo-600" /> Upcoming (14 days)
                        </h3>
                        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4">No upcoming events</p>
                            ) : upcomingEvents.map((ev, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                                    <div className={`text-center min-w-[36px] p-1.5 rounded-lg ${ev.color || 'bg-indigo-100 text-indigo-700'}`}>
                                        <p className="text-xs font-bold leading-none">
                                            {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit' })}
                                        </p>
                                        <p className="text-[9px] leading-none mt-0.5">
                                            {new Date(ev.date).toLocaleDateString('en-IN', { month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-900 truncate">{ev.title || ev.name}</p>
                                        <p className="text-[10px] text-gray-500">{ev.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming reminders */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <BellRing size={15} className="text-amber-500" /> Reminders
                            </h3>
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                {upcomingReminders.length}
                            </span>
                        </div>
                        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                            {upcomingReminders.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-4">No upcoming reminders</p>
                            ) : upcomingReminders.map(r => (
                                <div key={r.id} className="p-2.5 border border-amber-100 bg-amber-50 rounded-xl">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 truncate">{r.title}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{r.date} · {r.time}</p>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button onClick={() => handleReminderComplete(r.id)}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                                                <Check size={12} />
                                            </button>
                                            <button onClick={() => handleReminderDelete(r.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-1.5">
                                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full
                                            ${r.priority === 'high' ? 'bg-red-100 text-red-700' : r.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {r.priority}
                                        </span>
                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                            {r.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* My Regularize requests */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                <AlarmClock size={15} className="text-emerald-600" /> Regularizations
                            </h3>
                            <button onClick={() => openModal('regularize')}
                                className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-xl">+ New</button>
                        </div>
                        <div className="space-y-2">
                            {regRequests.slice(0, 3).map(r => (
                                <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900">{r.date}</p>
                                        <p className="text-[10px] text-gray-500">{r.punch_in} → {r.punch_out}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ MODALS ════════════════════════════════════════════════════ */}

            {/* Apply Leave Modal */}
            <Modal isOpen={modal === 'leave'} onClose={closeModal} title="Apply for Leave"
                footer={<>
                    <button onClick={closeModal}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleLeaveSubmit}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700">
                        <Send size={14} /> Submit Request
                    </button>
                </>}>

                <div className="space-y-5">
                    {/* Leave type cards */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Leave Type *</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {LEAVE_TYPES.map(lt => (
                                <button key={lt.code} type="button"
                                    onClick={() => setLeaveForm(f => ({ ...f, leave_type: lt.code }))}
                                    className={`p-3 rounded-xl border-2 text-left transition-all
                                        ${leaveForm.leave_type === lt.code ? `${lt.light} ${lt.border}` : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    <p className={`text-xs font-bold ${leaveForm.leave_type === lt.code ? lt.text : 'text-gray-700'}`}>{lt.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {lt.code !== 'UL' ? `${lt.balance} days left` : 'No pay'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">From Date *</p>
                            <input type="date" value={leaveForm.from_date}
                                onChange={e => setLeaveForm(f => ({ ...f, from_date: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">To Date *</p>
                            <input type="date" value={leaveForm.to_date}
                                onChange={e => setLeaveForm(f => ({ ...f, to_date: e.target.value }))}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>
                    </div>

                    {/* Days preview */}
                    {leaveForm.from_date && leaveForm.to_date && (
                        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-700">
                            <strong>{calculateLeaveDays(leaveForm.from_date, leaveForm.to_date)} working days</strong> selected
                            ({leaveForm.from_date} → {leaveForm.to_date})
                        </div>
                    )}

                    {/* Half day */}
                    {leaveForm.from_date && leaveForm.to_date && leaveForm.from_date === leaveForm.to_date && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <label className="flex items-center gap-2 cursor-pointer mb-3">
                                <input type="checkbox" checked={leaveForm.half_day}
                                    onChange={e => setLeaveForm(f => ({ ...f, half_day: e.target.checked }))}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700">Apply for Half Day</span>
                            </label>
                            {leaveForm.half_day && (
                                <div className="flex gap-3">
                                    {['first_half', 'second_half'].map(h => (
                                        <label key={h} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="half_day_type" value={h}
                                                checked={leaveForm.half_day_type === h}
                                                onChange={e => setLeaveForm(f => ({ ...f, half_day_type: e.target.value }))}
                                                className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm">{h === 'first_half' ? 'First Half' : 'Second Half'}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Urgent */}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={leaveForm.urgent}
                            onChange={e => setLeaveForm(f => ({ ...f, urgent: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 text-red-500" />
                        <span className="text-sm text-gray-700">Mark as Urgent</span>
                        {leaveForm.urgent && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Will be prioritised</span>}
                    </label>

                    {/* Reason */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Reason *</p>
                        <textarea value={leaveForm.reason}
                            onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))}
                            rows={3} placeholder="Brief reason for leave..."
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" />
                    </div>

                    {/* Contact + address */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Contact Number</p>
                            <input type="tel" value={leaveForm.contact_number}
                                onChange={e => setLeaveForm(f => ({ ...f, contact_number: e.target.value }))}
                                placeholder="Mobile number"
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Address During Leave</p>
                            <input type="text" value={leaveForm.address}
                                onChange={e => setLeaveForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="City / address"
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        </div>
                    </div>

                    {/* Handover */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Work Handover Notes</p>
                        <textarea value={leaveForm.handover_notes}
                            onChange={e => setLeaveForm(f => ({ ...f, handover_notes: e.target.value }))}
                            rows={2} placeholder="Who will handle your work?"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" />
                    </div>

                    {/* Document upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center">
                        <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Upload supporting documents</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                        <button className="mt-2 px-4 py-1.5 border border-gray-300 rounded-xl text-xs hover:bg-gray-50">Browse</button>
                    </div>

                    {/* Info note */}
                    <div className="flex gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            Your request will be sent to your reporting manager for approval. You can track status in the Leave Request page.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Regularize Modal */}
            <Modal isOpen={modal === 'regularize'} onClose={closeModal} title="Attendance Regularization"
                footer={<>
                    <button onClick={closeModal}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleRegSubmit}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-emerald-700">
                        <Send size={14} /> Submit
                    </button>
                </>}>

                <div className="space-y-4">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                        Use this to correct missing or wrong punch-in / punch-out times. Your manager will review and approve.
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Date *</p>
                        <input type="date" value={regForm.date}
                            onChange={e => setRegForm(f => ({ ...f, date: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Punch In Time *</p>
                            <input type="time" value={regForm.punch_in}
                                onChange={e => setRegForm(f => ({ ...f, punch_in: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Punch Out Time *</p>
                            <input type="time" value={regForm.punch_out}
                                onChange={e => setRegForm(f => ({ ...f, punch_out: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                        </div>
                    </div>

                    {/* Duration preview */}
                    {regForm.punch_in && regForm.punch_out && (
                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                            Total: <strong>{minutesToHHMM(parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in))}</strong>
                            {parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in) > STANDARD_WORK_MINS && (
                                <span className="ml-2 text-emerald-600 text-xs font-medium">
                                    (+{minutesToHHMM(parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in) - STANDARD_WORK_MINS)} extra)
                                </span>
                            )}
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Reason *</p>
                        <textarea value={regForm.reason}
                            onChange={e => setRegForm(f => ({ ...f, reason: e.target.value }))}
                            rows={3} placeholder="Reason for regularization (e.g., Forgot to punch out, system error)..."
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
                    </div>

                    {/* Past requests */}
                    {regRequests.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">Recent Regularization Requests</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar">
                                {regRequests.map(r => (
                                    <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                                        <div>
                                            <p className="font-semibold text-gray-900">{r.date}</p>
                                            <p className="text-gray-500">{r.punch_in} → {r.punch_out} · {r.reason}</p>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Add Reminder Modal */}
            <Modal isOpen={modal === 'reminder'} onClose={closeModal}
                title={`Add Reminder — ${selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                footer={<>
                    <button onClick={closeModal}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button onClick={handleReminderSubmit}
                        className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-amber-600">
                        <Bell size={14} /> Save Reminder
                    </button>
                </>}>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Title *</p>
                        <input type="text" value={reminderForm.title}
                            onChange={e => setReminderForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="e.g., Submit report, Team meeting..."
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                            <input type="time" value={reminderForm.time}
                                onChange={e => setReminderForm(f => ({ ...f, time: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Priority</p>
                            <select value={reminderForm.priority}
                                onChange={e => setReminderForm(f => ({ ...f, priority: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Type selector */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Reminder Type</p>
                        <div className={`grid gap-2 ${isManager ? 'grid-cols-3' : 'grid-cols-1'}`}>
                            {[
                                { id: 'personal', label: 'Personal', icon: User },
                                ...(isManager ? [
                                    { id: 'team', label: 'Team', icon: Users },
                                    { id: 'employee', label: 'Employee', icon: UserPlus },
                                ] : [])
                            ].map(t => (
                                <button key={t.id} type="button"
                                    onClick={() => setReminderForm(f => ({ ...f, type: t.id, forUserId: t.id === 'personal' ? null : f.forUserId }))}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                                        ${reminderForm.type === t.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <t.icon size={16} className={reminderForm.type === t.id ? 'text-amber-600' : 'text-gray-500'} />
                                    <span className="text-xs font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Employee selector for employee-type reminders */}
                    {reminderForm.type === 'employee' && isManager && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Select Employee</p>
                            <select value={reminderForm.forUserId || ''}
                                onChange={e => setReminderForm(f => ({ ...f, forUserId: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                                <option value="">Select employee...</option>
                                {TEAM_MEMBERS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <textarea value={reminderForm.note}
                            onChange={e => setReminderForm(f => ({ ...f, note: e.target.value }))}
                            rows={3} placeholder="Additional notes..."
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none" />
                    </div>
                </div>
            </Modal>

            {/* Date Detail Modal */}
            <Modal isOpen={modal === 'dateDetail' && !!detailDate} onClose={closeModal}
                title={`${detailDate?.ds} — Day Details`}
                footer={
                    <div className="flex gap-2">
                        <button onClick={() => { closeModal(); openModal('leave') }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                            <Plus size={12} /> Leave
                        </button>
                        <button onClick={() => { closeModal(); openModal('regularize') }}
                            className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                            <AlarmClock size={12} /> Regularize
                        </button>
                        <button onClick={() => { closeModal(); openModal('reminder') }}
                            className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                            <BellPlus size={12} /> Remind
                        </button>
                        <button onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 ml-auto">
                            Close
                        </button>
                    </div>
                }>
                {detailDate && (
                    <div className="space-y-4">
                        {/* Attendance */}
                        {detailDate.attRec && (
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Attendance</p>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-xs text-gray-400">Punch In</p>
                                        <p className="text-sm font-bold text-gray-900">{detailDate.attRec.punch_in || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Punch Out</p>
                                        <p className="text-sm font-bold text-gray-900">{detailDate.attRec.punch_out || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Extra</p>
                                        <p className={`text-sm font-bold ${detailDate.extra > 0 ? 'text-emerald-600' : detailDate.extra < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                                            {detailDate.extra !== 0 ? (detailDate.extra > 0 ? '+' : '−') + minutesToHHMM(Math.abs(detailDate.extra)) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Events */}
                        {detailDate.events.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Events & Leaves</p>
                                <div className="space-y-2">
                                    {detailDate.events.map((ev, i) => (
                                        <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${ev.color || 'bg-gray-50 text-gray-700'}`}>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold">{ev.title || ev.name || ev.type}</p>
                                                <p className="text-[10px] opacity-70 mt-0.5">{ev.category}</p>
                                            </div>
                                            {ev.status && <StatusBadge status={ev.status} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!detailDate.attRec && detailDate.events.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <CalendarDays size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No records for this date</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default MyCalendarEntry