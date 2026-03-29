import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye, X, Check, Users, AlarmClock, Calendar, } from 'lucide-react'

function StatusBadge({ status }) {
    const map = {
        pending: { cls: 'bg-yellow-100 text-yellow-800', icon: <Clock size={10} /> },
        approved: { cls: 'bg-green-100 text-green-800', icon: <CheckCircle size={10} /> },
        rejected: { cls: 'bg-red-100 text-red-800', icon: <XCircle size={10} /> },
    }
    const cfg = map[status] || map.pending
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.cls}`}>
            {cfg.icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

function ActionSheet({ isOpen, onClose, request, actionType, onConfirm, requestKind }) {
    const [remarks, setRemarks] = useState('')

    React.useEffect(() => { if (isOpen) setRemarks('') }, [isOpen])

    if (!isOpen || !request) return null
    const isApprove = actionType === 'approve'

    const handleConfirm = () => {
        if (!isApprove && !remarks.trim()) { alert('Please provide a rejection reason'); return }
        onConfirm(request.id, actionType, remarks)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl">
                <div className="px-5 pt-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                            ${isApprove ? 'bg-green-100' : 'bg-red-100'}`}>
                            {isApprove
                                ? <Check size={18} className="text-green-600" />
                                : <X size={18} className="text-red-500" />}
                        </div>
                        <div>
                            <p className="text-base font-semibold text-gray-900">
                                {isApprove ? 'Approve' : 'Reject'} {requestKind === 'leave' ? 'Leave' : 'Regularization'}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{request.emp_name}</p>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-3.5 space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Employee</span>
                            <span className="font-medium text-gray-900">{request.emp_name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">
                                {requestKind === 'leave' ? 'Leave Type' : 'Date'}
                            </span>
                            <span className="font-medium text-gray-900">
                                {requestKind === 'leave' ? request.leave_name : request.date}
                            </span>
                        </div>
                        {requestKind === 'leave' && (
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-medium text-gray-900">
                                    {request.from_date} → {request.to_date} · {request.days} days
                                </span>
                            </div>
                        )}
                        {requestKind === 'regularize' && (
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Times</span>
                                <span className="font-medium text-gray-900">{request.punch_in} → {request.punch_out}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Reason</span>
                            <span className="font-medium text-gray-900 text-right max-w-[55%]">{request.reason}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-gray-700 mb-1.5">
                            Remarks {!isApprove && <span className="text-red-500">*</span>}
                        </p>
                        <textarea value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            rows={3}
                            placeholder={isApprove ? 'Optional comments...' : 'Reason for rejection (required)...'}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl
                                       text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
                    </div>
                </div>

                <div className="flex gap-3 px-5 pb-6">
                    <button onClick={onClose}
                        className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm font-medium">
                        Cancel
                    </button>
                    <button onClick={handleConfirm}
                        disabled={!isApprove && !remarks.trim()}
                        className={`flex-1 py-3 text-white rounded-2xl text-sm font-semibold
                            flex items-center justify-center gap-2 disabled:opacity-40
                            ${isApprove ? 'bg-green-600' : 'bg-red-500'}`}>
                        {isApprove
                            ? <><Check size={15} /> Approve</>
                            : <><X size={15} /> Reject</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

function DetailSheet({ request, onClose, onApprove, onReject, requestKind }) {
    if (!request) return null

    return (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
                <div className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100">
                    <div>
                        <div className="w-10 h-1 bg-gray-300 rounded-full mb-3" />
                        <p className="text-base font-semibold text-gray-900">
                            {requestKind === 'leave' ? 'Leave' : 'Regularization'} Details
                        </p>
                        <p className="font-mono text-xs text-indigo-600 mt-0.5">{request.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge status={request.status} />
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
                            <X size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-4 space-y-3">
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center
                                        text-white text-sm font-semibold flex-shrink-0">
                            {request.emp_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{request.emp_name}</p>
                            <p className="text-xs text-gray-500">{request.designation} · {request.department}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {requestKind === 'leave' ? [
                            { label: 'Leave Type', value: request.leave_name },
                            { label: 'Duration', value: `${request.days} days` },
                            { label: 'From', value: request.from_date },
                            { label: 'To', value: request.to_date },
                            { label: 'Applied On', value: request.applied_on },
                            request.urgent ? { label: 'Priority', value: '🔴 Urgent' } : null,
                        ].filter(Boolean) : [
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
                        {requestKind === 'leave' && [
                            { label: 'Leave Type', value: request.leave_name },
                            { label: 'Duration', value: `${request.days} days` },
                            { label: 'From', value: request.from_date },
                            { label: 'To', value: request.to_date },
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
                            <p className="text-xs font-medium text-gray-500 mb-1.5">Remarks</p>
                            <p className="p-3.5 bg-amber-50 border border-amber-100 rounded-2xl text-sm">{request.remarks}</p>
                        </div>
                    )}
                </div>

                {request.status === 'pending' ? (
                    <div className="flex-shrink-0 flex gap-3 px-5 py-4 border-t border-gray-100">
                        <button onClick={() => { onReject(request); onClose() }}
                            className="flex-1 py-3 bg-red-50 border border-red-200 text-red-600
                                       rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
                            <XCircle size={15} /> Reject
                        </button>
                        <button onClick={() => { onApprove(request); onClose() }}
                            className="flex-1 py-3 bg-green-600 text-white rounded-2xl text-sm font-semibold
                                       flex items-center justify-center gap-2">
                            <CheckCircle size={15} /> Approve
                        </button>
                    </div>
                ) : (
                    <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100">
                        <button onClick={onClose}
                            className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const LEAVE_BORDER = {
    CL: 'border-l-indigo-400', SL: 'border-l-emerald-400',
    EL: 'border-l-purple-400', CO: 'border-l-amber-400',
    LWP: 'border-l-gray-300',
}

function LeaveApprovals() {
    const [filter, setFilter] = useState('pending')
    const [detailReq, setDetailReq] = useState(null)
    const [actionReq, setActionReq] = useState(null)
    const [actionType, setActionType] = useState(null)

    const [requests, setRequests] = useState([
        { id: 'LR001', emp_name: 'Athul Krishna', emp_code: 'EMP002', designation: 'Jr. Software Engineer', department: 'Engineering', leave_name: 'Casual Leave', leave_type: 'CL', from_date: '2026-03-20', to_date: '2026-03-22', days: 3, reason: 'Family function', status: 'pending', applied_on: '2026-03-15', urgent: false },
        { id: 'LR002', emp_name: 'Sara Thomas', emp_code: 'EMP005', designation: 'UI Designer', department: 'Design', leave_name: 'Sick Leave', leave_type: 'SL', from_date: '2026-03-18', to_date: '2026-03-18', days: 1, reason: 'Fever', status: 'pending', applied_on: '2026-03-18', urgent: true },
        { id: 'LR003', emp_name: 'Ravi Nair', emp_code: 'EMP008', designation: 'QA Engineer', department: 'Engineering', leave_name: 'Earned Leave', leave_type: 'EL', from_date: '2026-04-01', to_date: '2026-04-05', days: 5, reason: 'Vacation', status: 'pending', applied_on: '2026-03-16', urgent: false },
        { id: 'LR004', emp_name: 'Priya Menon', emp_code: 'EMP003', designation: 'Product Manager', department: 'Product', leave_name: 'Casual Leave', leave_type: 'CL', from_date: '2026-03-10', to_date: '2026-03-11', days: 2, reason: 'Personal work', status: 'approved', applied_on: '2026-03-08', remarks: 'Approved' },
        { id: 'LR005', emp_name: 'Arun Dev', emp_code: 'EMP007', designation: 'Backend Engineer', department: 'Engineering', leave_name: 'Casual Leave', leave_type: 'CL', from_date: '2026-03-05', to_date: '2026-03-07', days: 3, reason: 'Personal', status: 'rejected', applied_on: '2026-03-04', remarks: 'Team short-staffed' },
    ])

    const handleAction = (id, type, remarks) => {
        setRequests(prev => prev.map(r =>
            r.id === id ? { ...r, status: type === 'approve' ? 'approved' : 'rejected', remarks } : r
        ))
    }

    const openApprove = (r) => { setActionReq(r); setActionType('approve') }
    const openReject = (r) => { setActionReq(r); setActionType('reject') }

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
    const pendingCount = requests.filter(r => r.status === 'pending').length

    return (
        <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {[
                    { id: 'pending', label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                    { id: 'approved', label: 'Approved' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'All' },
                ].map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all
                            ${filter === f.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-14 text-gray-400">
                    <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No {filter} leave requests</p>
                </div>
            ) : filtered.map(r => (
                <div key={r.id}
                    className={`bg-white border border-gray-200 border-l-4 ${LEAVE_BORDER[r.leave_type] || 'border-l-gray-300'} rounded-2xl p-4`}>

                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center
                                            text-indigo-600 text-xs font-bold flex-shrink-0">
                                {r.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-semibold text-gray-900">{r.emp_name}</p>
                                    {r.urgent && (
                                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-full">URGENT</span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">{r.department}</p>
                            </div>
                        </div>
                        <StatusBadge status={r.status} />
                    </div>

                    <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {r.leave_name}
                        </span>
                        <span className="text-xs text-gray-500">{r.from_date} → {r.to_date} · {r.days} days</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{r.reason}</p>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">Applied {r.applied_on}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setDetailReq(r)}
                                className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200
                                           bg-gray-50 px-2.5 py-1.5 rounded-xl font-medium">
                                <Eye size={11} /> Details
                            </button>
                            {r.status === 'pending' && (
                                <>
                                    <button onClick={() => openReject(r)}
                                        className="flex items-center gap-1 text-xs text-red-600 border border-red-200
                                                   bg-red-50 px-2.5 py-1.5 rounded-xl font-semibold">
                                        <XCircle size={11} /> Reject
                                    </button>
                                    <button onClick={() => openApprove(r)}
                                        className="flex items-center gap-1 text-xs text-white bg-green-600
                                                   px-2.5 py-1.5 rounded-xl font-semibold">
                                        <CheckCircle size={11} /> Approve
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <DetailSheet
                request={detailReq}
                onClose={() => setDetailReq(null)}
                onApprove={openApprove}
                onReject={openReject}
                requestKind="leave"
            />
            <ActionSheet
                isOpen={!!actionReq}
                onClose={() => setActionReq(null)}
                request={actionReq}
                actionType={actionType}
                onConfirm={handleAction}
                requestKind="leave"
            />
        </div>
    )
}

function RegularizeApprovals() {
    const [filter, setFilter] = useState('pending')
    const [detailReq, setDetailReq] = useState(null)
    const [actionReq, setActionReq] = useState(null)
    const [actionType, setActionType] = useState(null)

    const [requests, setRequests] = useState([
        { id: 'REG001', emp_name: 'Athul Krishna', emp_code: 'EMP002', designation: 'Jr. Software Engineer', department: 'Engineering', date: '2026-03-15', punch_in: '09:00', punch_out: '19:30', reason: 'System malfunction', status: 'pending', applied_on: '2026-03-16' },
        { id: 'REG002', emp_name: 'Sara Thomas', emp_code: 'EMP005', designation: 'UI Designer', department: 'Design', date: '2026-03-12', punch_in: '08:45', punch_out: '18:00', reason: 'Forgot to punch out', status: 'pending', applied_on: '2026-03-13' },
        { id: 'REG003', emp_name: 'Ravi Nair', emp_code: 'EMP008', designation: 'QA Engineer', department: 'Engineering', date: '2026-03-10', punch_in: '09:00', punch_out: '18:30', reason: 'WFH - no biometric', status: 'approved', applied_on: '2026-03-11', remarks: 'Approved' },
        { id: 'REG004', emp_name: 'Arun Dev', emp_code: 'EMP007', designation: 'Backend Engineer', department: 'Engineering', date: '2026-03-08', punch_in: '09:00', punch_out: '17:00', reason: 'Doctor appointment', status: 'rejected', applied_on: '2026-03-09', remarks: 'Policy: min 8h required' },
    ])

    function parseHHMM(str) {
        if (!str) return 0
        const [h, m] = str.split(':').map(Number)
        return h * 60 + (m || 0)
    }
    function minutesToHHMM(mins) {
        if (mins <= 0) return '0h 0m'
        return `${Math.floor(mins / 60)}h ${mins % 60}m`
    }

    const handleAction = (id, type, remarks) => {
        setRequests(prev => prev.map(r =>
            r.id === id ? { ...r, status: type === 'approve' ? 'approved' : 'rejected', remarks } : r
        ))
    }

    const openApprove = (r) => { setActionReq(r); setActionType('approve') }
    const openReject = (r) => { setActionReq(r); setActionType('reject') }

    const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter)
    const pendingCount = requests.filter(r => r.status === 'pending').length

    return (
        <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {[
                    { id: 'pending', label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
                    { id: 'approved', label: 'Approved' },
                    { id: 'rejected', label: 'Rejected' },
                    { id: 'all', label: 'All' },
                ].map(f => (
                    <button key={f.id} onClick={() => setFilter(f.id)}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all
                            ${filter === f.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                        {f.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-14 text-gray-400">
                    <AlarmClock size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No {filter} regularization requests</p>
                </div>
            ) : filtered.map(r => {
                const worked = parseHHMM(r.punch_out) - parseHHMM(r.punch_in)
                const extra = worked - 9 * 60

                return (
                    <div key={r.id}
                        className={`bg-white border border-gray-200 border-l-4 rounded-2xl p-4
                            ${r.status === 'approved' ? 'border-l-emerald-400'
                                : r.status === 'rejected' ? 'border-l-red-400'
                                    : 'border-l-amber-400'}`}>

                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center
                                                text-emerald-700 text-xs font-bold flex-shrink-0">
                                    {r.emp_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{r.emp_name}</p>
                                    <p className="text-xs text-gray-500">{r.department}</p>
                                </div>
                            </div>
                            <StatusBadge status={r.status} />
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {r.date}
                            </span>
                            <span className="text-xs text-gray-500">{r.punch_in} → {r.punch_out}</span>
                            <span className={`text-xs font-semibold ${extra > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {extra > 0 ? '+' : '−'}{minutesToHHMM(Math.abs(extra))}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">{r.reason}</p>

                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400">Applied {r.applied_on}</span>
                            <div className="flex gap-2">
                                <button onClick={() => setDetailReq(r)}
                                    className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200
                                               bg-gray-50 px-2.5 py-1.5 rounded-xl font-medium">
                                    <Eye size={11} /> Details
                                </button>
                                {r.status === 'pending' && (
                                    <>
                                        <button onClick={() => openReject(r)}
                                            className="flex items-center gap-1 text-xs text-red-600 border border-red-200
                                                       bg-red-50 px-2.5 py-1.5 rounded-xl font-semibold">
                                            <XCircle size={11} /> Reject
                                        </button>
                                        <button onClick={() => openApprove(r)}
                                            className="flex items-center gap-1 text-xs text-white bg-green-600
                                                       px-2.5 py-1.5 rounded-xl font-semibold">
                                            <CheckCircle size={11} /> Approve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}

            <DetailSheet
                request={detailReq}
                onClose={() => setDetailReq(null)}
                onApprove={openApprove}
                onReject={openReject}
                requestKind="regularize"
            />
            <ActionSheet
                isOpen={!!actionReq}
                onClose={() => setActionReq(null)}
                request={actionReq}
                actionType={actionType}
                onConfirm={handleAction}
                requestKind="regularize"
            />
        </div>
    )
}

function ManagerApprovalsMobile() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('leave')

    return (
        <div className="flex flex-col h-full bg-gray-50">

            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 pt-4 pb-3">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <p className="text-base font-semibold text-gray-900">Team Approvals</p>
                </div>

                <div className="flex gap-1.5">
                    <button onClick={() => setTab('leave')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                            ${tab === 'leave' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Calendar size={13} /> Leave
                    </button>
                    <button onClick={() => setTab('regularize')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all
                            ${tab === 'regularize' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <AlarmClock size={13} /> Regularize
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
                {tab === 'leave' && <LeaveApprovals />}
                {tab === 'regularize' && <RegularizeApprovals />}
            </div>
        </div>
    )
}

export default ManagerApprovalsMobile