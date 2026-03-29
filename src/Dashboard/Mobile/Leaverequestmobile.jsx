import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Plus, X, Send, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Clock, AlertCircle, Eye,
    Upload, Info, Calendar
} from 'lucide-react'

function StatusBadge({ status }) {
    const map = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-600',
    }
    const icons = {
        approved: <CheckCircle size={10} />,
        pending: <Clock size={10} />,
        rejected: <XCircle size={10} />,
        cancelled: <AlertCircle size={10} />,
    }
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {icons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

function calculateLeaveDays(from, to, halfDay = false) {
    if (!from || !to) return 0
    const start = new Date(from)
    const end = new Date(to)
    let days = 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay()
        if (day !== 0 && day !== 6) days++
    }
    return halfDay ? days - 0.5 : days
}

const LEAVE_TYPES = [
    { code: 'CL', name: 'Casual Leave', balance: 8, total: 12, color: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    { code: 'SL', name: 'Sick Leave', balance: 5, total: 10, color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { code: 'EL', name: 'Earned Leave', balance: 12, total: 18, color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    { code: 'CO', name: 'Compensatory Off', balance: 2, total: 2, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    { code: 'UL', name: 'Unpaid Leave', balance: 0, total: 0, color: 'bg-gray-400', light: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
]

const BLANK_FORM = {
    leave_type: '', from_date: '', to_date: '',
    half_day: false, half_day_type: 'first_half',
    reason: '', contact_number: '', address: '',
    handover_notes: '', urgent: false,
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function MiniCalendar({ onRangeSelected, existingLeaves }) {
    const [current, setCurrent] = useState(new Date())
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [hoverDate, setHoverDate] = useState(null)

    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date(); today.setHours(0, 0, 0, 0)

    const dateStr = (day) => new Date(year, month, day).toISOString().split('T')[0]

    const isInRange = (d) => {
        const ds = dateStr(d)
        if (endDate) return ds >= startDate && ds <= endDate
        if (hoverDate && startDate) return ds >= startDate && ds <= hoverDate
        return ds === startDate
    }

    const handleClick = (day) => {
        const ds = dateStr(day)
        const date = new Date(year, month, day)
        if (date < today) return
        if (!startDate || endDate) {
            setStartDate(ds); setEndDate(null)
        } else {
            if (ds >= startDate) {
                setEndDate(ds)
                onRangeSelected(startDate, ds)
            } else {
                setStartDate(ds); setEndDate(null)
            }
        }
    }

    const hasLeave = (d) => {
        const ds = dateStr(d)
        return existingLeaves.some(l =>
            l.status !== 'rejected' && l.status !== 'cancelled' &&
            ds >= l.from_date && ds <= l.to_date
        )
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100">
                    <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <span className="text-sm font-semibold text-gray-900">
                    {MONTH_NAMES[month]} {year}
                </span>
                <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
                    className="p-1.5 rounded-lg hover:bg-gray-100">
                    <ChevronRight size={16} className="text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                {WEEK_DAYS.map(d => (
                    <div key={d} className="py-1.5 text-center text-[10px] font-semibold text-gray-400">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 p-2 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const ds = dateStr(day)
                    const date = new Date(year, month, day)
                    const isPast = date < today
                    const inRange = isInRange(day)
                    const isStart = ds === startDate
                    const isEnd = ds === endDate
                    const leave = hasLeave(day)

                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={isPast}
                            onClick={() => handleClick(day)}
                            onMouseEnter={() => { if (startDate && !endDate) setHoverDate(ds) }}
                            onMouseLeave={() => setHoverDate(null)}
                            className={`relative h-8 w-full text-xs rounded-lg flex items-center justify-center transition-all
                                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                                ${inRange && !isStart && !isEnd ? 'bg-indigo-100 text-indigo-700 rounded-none' : ''}
                                ${isStart || isEnd ? 'bg-indigo-600 text-white font-semibold' : ''}
                                ${leave && !isStart && !isEnd ? 'text-red-500' : ''}
                                ${!inRange && !isPast && !leave ? 'hover:bg-gray-100 text-gray-700' : ''}
                            `}
                        >
                            {day}
                            {leave && !isStart && !isEnd && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="flex items-center gap-4 px-4 pb-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" /> Selected</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> On Leave</span>
            </div>

            {startDate && (
                <div className="mx-3 mb-3 px-3 py-2.5 bg-indigo-50 rounded-xl text-xs text-indigo-700">
                    {!endDate
                        ? <span>From <b>{startDate}</b> — tap end date</span>
                        : <span><b>{startDate}</b> → <b>{endDate}</b> · {calculateLeaveDays(startDate, endDate)} working days</span>
                    }
                </div>
            )}
        </div>
    )
}

function ApplyLeaveSheet({ isOpen, onClose, fromDate, toDate, onSubmit }) {
    const [form, setForm] = useState({ ...BLANK_FORM, from_date: fromDate, to_date: toDate })

    useEffect(() => {
        setForm(prev => ({ ...prev, from_date: fromDate, to_date: toDate }))
    }, [fromDate, toDate])

    if (!isOpen) return null

    const days = calculateLeaveDays(form.from_date, form.to_date, form.half_day)
    const isSingleDay = form.from_date === form.to_date
    const leaveType = LEAVE_TYPES.find(l => l.code === form.leave_type)

    const handleSubmit = () => {
        if (!form.leave_type || !form.reason.trim()) {
            alert('Please select leave type and enter reason')
            return
        }
        if (leaveType && leaveType.balance < days && form.leave_type !== 'UL') {
            alert(`Insufficient balance. Available: ${leaveType.balance} days`)
            return
        }
        onSubmit(form, days)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col">
 
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                    <div>
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                        <p className="text-base font-semibold text-gray-900">Apply Leave</p>
                        <p className="text-xs text-gray-500 mt-0.5">{fromDate} → {toDate} · {days} days</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>


                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-4">

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">Leave Type *</p>
                        <div className="grid grid-cols-2 gap-2">
                            {LEAVE_TYPES.map(lt => (
                                <button
                                    key={lt.code}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, leave_type: lt.code }))}
                                    className={`p-3 rounded-xl border text-left transition-all
                                        ${form.leave_type === lt.code
                                            ? `${lt.light} ${lt.border} border-2`
                                            : 'border-gray-200 bg-white'}`}
                                >
                                    <p className={`text-xs font-semibold ${form.leave_type === lt.code ? lt.text : 'text-gray-700'}`}>
                                        {lt.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        {lt.code !== 'UL' ? `${lt.balance} days left` : 'No pay'}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {isSingleDay && (
                        <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Half Day</p>
                                <p className="text-xs text-gray-500">Apply for half day only</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm(f => ({ ...f, half_day: !f.half_day }))}
                                className={`w-11 h-6 rounded-full transition-colors ${form.half_day ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <span className={`block w-5 h-5 rounded-full bg-white shadow mx-0.5 transition-transform ${form.half_day ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    )}
                    {isSingleDay && form.half_day && (
                        <div className="flex gap-3">
                            {['first_half', 'second_half'].map(h => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, half_day_type: h }))}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                                        ${form.half_day_type === h
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-gray-600 border-gray-200'}`}
                                >
                                    {h === 'first_half' ? 'First Half' : 'Second Half'}
                                </button>
                            ))}
                        </div>
                    )}

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1.5">Reason *</p>
                        <textarea
                            value={form.reason}
                            onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                            rows={3}
                            placeholder="Briefly describe your reason..."
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm
                                       focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-red-50 border border-red-100 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-red-800">Mark as Urgent</p>
                            <p className="text-xs text-red-500">Will be prioritised by manager</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, urgent: !f.urgent }))}
                            className={`w-11 h-6 rounded-full transition-colors ${form.urgent ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            <span className={`block w-5 h-5 rounded-full bg-white shadow mx-0.5 transition-transform ${form.urgent ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-1.5">Contact No.</p>
                            <input
                                type="tel"
                                value={form.contact_number}
                                onChange={e => setForm(f => ({ ...f, contact_number: e.target.value }))}
                                placeholder="Mobile"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-700 mb-1.5">Address</p>
                            <input
                                type="text"
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="City"
                                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1.5">Handover Notes</p>
                        <textarea
                            value={form.handover_notes}
                            onChange={e => setForm(f => ({ ...f, handover_notes: e.target.value }))}
                            rows={2}
                            placeholder="Who will handle your work?"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />
                    </div>

                    <div className="flex gap-2.5 p-3.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <Info size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            Your request will be sent to your manager for approval. You can track status in the History tab.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                        Cancel
                    </button>
                    <button onClick={handleSubmit}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <Send size={14} /> Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

function DetailSheet({ request, onClose }) {
    if (!request) return null
    const lt = LEAVE_TYPES.find(l => l.code === request.leave_type)

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
                    <div>
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
                        <p className="text-base font-semibold text-gray-900">Leave Details</p>
                        <p className="font-mono text-xs text-indigo-600 mt-0.5">{request.id}</p>
                    </div>
                    <StatusBadge status={request.status} />
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl ${lt?.light || 'bg-gray-50'}`}>
                            <p className="text-[10px] text-gray-500 mb-1">Leave Type</p>
                            <p className={`text-sm font-semibold ${lt?.text || 'text-gray-700'}`}>{request.leave_name}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-[10px] text-gray-500 mb-1">Duration</p>
                            <p className="text-sm font-semibold text-gray-900">{request.days} days</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-[10px] text-gray-500 mb-1">From</p>
                            <p className="text-sm font-semibold text-gray-900">{request.from_date}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50">
                            <p className="text-[10px] text-gray-500 mb-1">To</p>
                            <p className="text-sm font-semibold text-gray-900">{request.to_date}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1.5">Reason</p>
                        <p className="p-3 bg-gray-50 rounded-xl text-sm text-gray-800">{request.reason}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Timeline</p>
                        <div className="space-y-2.5">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs font-medium text-gray-900">Applied on {request.applied_on}</p>
                                    <p className="text-[10px] text-gray-400">via Employee Self Service</p>
                                </div>
                            </div>
                            {request.status === 'approved' && (
                                <div className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Approved by {request.approved_by} on {request.approved_on}</p>
                                        {request.comments && <p className="text-[10px] text-gray-500 mt-0.5">{request.comments}</p>}
                                    </div>
                                </div>
                            )}
                            {request.status === 'rejected' && (
                                <div className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Rejected by {request.rejected_by} on {request.rejected_on}</p>
                                        {request.comments && <p className="text-[10px] text-red-500 mt-0.5">{request.comments}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
                    <button onClick={onClose}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

function LeaveRequestMobile() {
    const [tab, setTab] = useState('apply')
    const [sheetOpen, setSheetOpen] = useState(false)
    const [selectedFrom, setSelectedFrom] = useState('')
    const [selectedTo, setSelectedTo] = useState('')
    const [detailRequest, setDetailRequest] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const [requests, setRequests] = useState([
        { id: 'LR001', leave_type: 'CL', leave_name: 'Casual Leave', from_date: '2024-02-15', to_date: '2024-02-17', days: 3, reason: 'Family function', status: 'approved', applied_on: '2024-02-10', approved_by: 'Michael Chen', approved_on: '2024-02-11', comments: 'Approved' },
        { id: 'LR002', leave_type: 'SL', leave_name: 'Sick Leave', from_date: '2024-02-05', to_date: '2024-02-06', days: 2, reason: 'Viral fever', status: 'approved', applied_on: '2024-02-05', approved_by: 'Michael Chen', approved_on: '2024-02-05', comments: 'Take care' },
        { id: 'LR003', leave_type: 'EL', leave_name: 'Earned Leave', from_date: '2024-03-01', to_date: '2024-03-05', days: 5, reason: 'Vacation', status: 'pending', applied_on: '2024-02-20' },
        { id: 'LR004', leave_type: 'CL', leave_name: 'Casual Leave', from_date: '2024-01-10', to_date: '2024-01-12', days: 3, reason: 'Personal work', status: 'rejected', applied_on: '2024-01-05', rejected_by: 'Michael Chen', rejected_on: '2024-01-06', comments: 'Team full' },
    ])

    const handleRangeSelected = (from, to) => {
        setSelectedFrom(from); setSelectedTo(to); setSheetOpen(true)
    }

    const handleSubmit = (form, days) => {
        const lt = LEAVE_TYPES.find(l => l.code === form.leave_type)
        const newReq = {
            id: `LR${String(requests.length + 1).padStart(3, '0')}`,
            leave_type: form.leave_type,
            leave_name: lt?.name || '',
            from_date: form.from_date,
            to_date: form.to_date,
            days,
            reason: form.reason,
            status: 'pending',
            applied_on: new Date().toISOString().split('T')[0],
            urgent: form.urgent,
        }
        setRequests(prev => [newReq, ...prev])
        setTab('history')
    }

    const filtered = statusFilter === 'all'
        ? requests
        : requests.filter(r => r.status === statusFilter)

    const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected', 'cancelled']

    const navigate = useNavigate()

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 pt-4 pb-3">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <p className="text-base font-semibold text-gray-900">Leave Request</p>
                </div>
                <div className="flex gap-1">
                    {[
                        { id: 'apply', label: 'Apply' },
                        { id: 'history', label: 'History' },
                        { id: 'balance', label: 'Balance' },
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all
                                ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">

                {tab === 'apply' && (
                    <div className="p-4 space-y-4">
                        <p className="text-xs text-gray-500 text-center">
                            Tap a start date, then an end date on the calendar to apply
                        </p>
                        <MiniCalendar onRangeSelected={handleRangeSelected} existingLeaves={requests} />
                    </div>
                )}

                {tab === 'history' && (
                    <div className="p-4">
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
                            {STATUS_FILTERS.map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                        ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            {filtered.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No leave requests found</p>
                                </div>
                            ) : filtered.map(r => {
                                const lt = LEAVE_TYPES.find(l => l.code === r.leave_type)
                                return (
                                    <div key={r.id}
                                        className={`bg-white border-l-4 ${lt?.border || 'border-gray-200'} border border-gray-200 rounded-xl p-4`}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{r.leave_name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{r.from_date} → {r.to_date} · {r.days} days</p>
                                            </div>
                                            <StatusBadge status={r.status} />
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3">{r.reason}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-gray-400">Applied {r.applied_on}</span>
                                            <button onClick={() => setDetailRequest(r)}
                                                className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                                                <Eye size={12} /> Details
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {tab === 'balance' && (
                    <div className="p-4 space-y-3">
                        {LEAVE_TYPES.filter(lt => lt.code !== 'UL').map(lt => (
                            <div key={lt.code} className={`bg-white border ${lt.border} rounded-2xl p-4`}>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-gray-900">{lt.name}</p>
                                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${lt.light} ${lt.text}`}>
                                        {lt.balance}/{lt.total}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                    {[
                                        { label: 'Total', value: lt.total, color: 'text-gray-900' },
                                        { label: 'Used', value: lt.total - lt.balance, color: 'text-red-600' },
                                        { label: 'Available', value: lt.balance, color: lt.text },
                                    ].map(s => (
                                        <div key={s.label} className="bg-gray-50 rounded-xl py-2">
                                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`${lt.color} h-1.5 rounded-full`}
                                        style={{ width: `${((lt.total - lt.balance) / lt.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ApplyLeaveSheet
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                fromDate={selectedFrom}
                toDate={selectedTo}
                onSubmit={handleSubmit}
            />

            <DetailSheet
                request={detailRequest}
                onClose={() => setDetailRequest(null)}
            />
        </div>
    )
}

export default LeaveRequestMobile