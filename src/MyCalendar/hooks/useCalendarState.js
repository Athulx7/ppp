import { useState } from 'react'

export function calculateLeaveDays(from, to) {
    if (!from || !to) return 0
    const start = new Date(from), end = new Date(to)
    let days = 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()
        if (day !== 0 && day !== 6) days++
    }
    return days
}

export function parseHHMM(str) {
    if (!str) return 0
    const [h, m] = str.split(':').map(Number)
    return h * 60 + (m || 0)
}

export function minutesToHHMM(mins) {
    if (mins <= 0) return '0h 0m'
    const h = Math.floor(Math.abs(mins) / 60)
    const m = Math.abs(mins) % 60
    return `${h}h ${m}m`
}

export const LEAVE_TYPES = [
    { code: 'CL', name: 'Casual Leave', balance: 8, total: 12, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    { code: 'SL', name: 'Sick Leave', balance: 5, total: 10, color: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    { code: 'EL', name: 'Earned Leave', balance: 12, total: 18, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { code: 'CO', name: 'Comp Off', balance: 2, total: 2, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    { code: 'UL', name: 'Unpaid Leave', balance: 0, total: 0, color: 'bg-gray-400', light: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
]

export const COMPANY_HOLIDAYS = [
    { date: '2026-01-26', title: 'Republic Day', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-08-15', title: 'Independence Day', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-10-02', title: 'Gandhi Jayanti', type: 'holiday', color: 'bg-red-100 text-red-700' },
    { date: '2026-12-25', title: 'Christmas', type: 'holiday', color: 'bg-red-100 text-red-700' },
]

export const TEAM_BIRTHDAYS = [
    { date: '2026-03-15', name: 'John Smith', department: 'Engineering', type: 'birthday' },
    { date: '2026-03-20', name: 'Sarah Johnson', department: 'HR', type: 'birthday' },
    { date: '2026-03-28', name: 'Mike Chen', department: 'Sales', type: 'birthday' },
]

export const WORK_ANNIVERSARIES = [
    { date: '2026-03-10', name: 'David Lee', department: 'Engineering', years: 5, type: 'anniversary' },
    { date: '2026-03-18', name: 'Maria Garcia', department: 'HR', years: 3, type: 'anniversary' },
]

export const IMPORTANT_DATES = [
    { date: '2026-03-31', title: 'Year-End Review', type: 'meeting', color: 'bg-indigo-100 text-indigo-700' },
    { date: '2026-03-25', title: 'Payroll Processing', type: 'deadline', color: 'bg-red-100 text-red-700' },
]

export const STANDARD_WORK_MINS = 9 * 60

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const TEAM_MEMBERS = [
    { id: 'emp1', name: 'John Smith', role: 'Developer' },
    { id: 'emp2', name: 'Sarah Johnson', role: 'Designer' },
    { id: 'emp3', name: 'Mike Chen', role: 'QA' },
]

export function useCalendarState() {
    const userRole = localStorage.getItem('userRole') || 'employee'
    const isManager = ['admin', 'hr', 'payroll_manager', 'manager'].includes(userRole)

    const [currentDate, setCurrent] = useState(new Date())
    const [selectedDate, setSelected] = useState(new Date())
    const [view, setView] = useState('month')

    const [modal, setModal] = useState(null)
    const openModal = (name) => setModal(name)
    const closeModal = () => setModal(null)
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

    const [regForm, setRegForm] = useState({ date: '', punch_in: '', punch_out: '', reason: '' })
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

    const [reminderForm, setReminderForm] = useState({
        title: '', time: '09:00', type: 'personal', priority: 'medium', note: '', forUserId: null,
    })
    const [reminders, setReminders] = useState([
        { id: 1, title: 'Submit monthly report', date: '2026-03-25', time: '10:00', type: 'personal', priority: 'high', note: 'Submit before EOD', status: 'pending' },
        { id: 2, title: 'Team weekly sync', date: '2026-03-21', time: '14:00', type: 'team', priority: 'medium', note: 'Prepare agenda', status: 'pending' },
        { id: 3, title: 'Performance review', date: '2026-03-28', time: '09:00', type: 'employee', priority: 'high', note: 'Review with John Smith', status: 'pending' },
        { id: 4, title: 'Submit timesheet', date: '2026-03-31', time: '17:00', type: 'personal', priority: 'medium', note: 'Weekly timesheet', status: 'pending' },
    ])

    const [detailDate, setDetailDate] = useState(null)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const getDaysInMonth = () => {
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        return { firstDay, daysInMonth }
    }

    const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1))
    const goToToday = () => { const t = new Date(); setCurrent(t); setSelected(t) }

    const dateStr = (d) => new Date(year, month, d).toISOString().split('T')[0]

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

    const getExtra = (ds) => {
        const rec = attendance.find(a => a.date === ds)
        if (!rec || !rec.punch_in || !rec.punch_out) return 0
        const worked = parseHHMM(rec.punch_out) - parseHHMM(rec.punch_in)
        return worked - STANDARD_WORK_MINS
    }

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

    const totalExtraMins = attendance.reduce((sum, a) => {
        const extra = getExtra(a.date)
        return sum + (extra > 0 ? extra : 0)
    }, 0)
    const totalDeficitMins = attendance.reduce((sum, a) => {
        const extra = getExtra(a.date)
        return sum + (extra < 0 ? Math.abs(extra) : 0)
    }, 0)

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

    return {
        // state
        currentDate, selectedDate, view, setView,
        modal, openModal, closeModal,
        leaveForm, setLeaveForm, leaveRequests,
        regForm, setRegForm, attendance, regRequests,
        reminderForm, setReminderForm, reminders,
        detailDate,
        // derived
        year, month, firstDay, daysInMonth, selDs,
        totalExtraMins, totalDeficitMins,
        upcomingReminders, upcomingEvents,
        // helpers
        dateStr, getEvents, getExtra,
        // handlers
        prevMonth, nextMonth, goToToday,
        handleLeaveSubmit, handleRegSubmit,
        handleReminderSubmit, handleReminderComplete, handleReminderDelete,
        handleDateClick,
        // meta
        isManager,
    }
}
