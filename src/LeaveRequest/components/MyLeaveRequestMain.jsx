import { Award, Calendar, CalendarPlus, Clock, Download, Loader, CheckCircle, Eye, FileText, History, MinusCircle, Send, XCircle, Upload, Info, Sun, Heart, User } from 'lucide-react';
import { StatusBadge } from "../../JobTracking/components/commonFunc";
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import LeaveRequestApply from './LeaveRequestApply';
import LeaveRequestHistory from './LeaveRequestHistory';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonInputField from '../../basicComponents/CommonInputField';
import { ApiCall } from '../../library/constants';
import CommonConfirmPopup from '../../basicComponents/CommonConfirmPopup';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';

function MyLeaveRequestMain() {

    const [workSchedule, setWorkSchedule] = useState(null)
    const [leaveBalance, setLeaveBalance] = useState([])
    const [leaveRequests, setLeaveRequests] = useState([])
    const [filteredRequests, setFilteredRequests] = useState([])
    const [holidays, setHolidays] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false, requestId: null, loading: false })

    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedStartDate, setSelectedStartDate] = useState(null)
    const [selectedEndDate, setSelectedEndDate] = useState(null)
    const [isSelecting, setIsSelecting] = useState(false)
    const [showApplyModal, setShowApplyModal] = useState(false)
    const [hoverDate, setHoverDate] = useState(null)

    const [selectedTab, setSelectedTab] = useState('apply')
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateRange, setDateRange] = useState({ from: '', to: '' })

    const [newRequest, setNewRequest] = useState({
        leave_type: '',
        from_date: '',
        to_date: '',
        half_day: false,
        half_day_type: 'first_half',
        reason: '',
        contact_number: '',
        address_during_leave: '',
        handover_notes: '',
        documents: [],
        urgent: false
    })

    useEffect(() => {
        fetchInitialData()
    }, [])

    async function fetchInitialData() {
        try {
            const schedRes = await ApiCall('GET', '/leaverequest/userWorkSchedule')
            if (schedRes?.data?.data) {
                setWorkSchedule(schedRes.data.data)
            }

            const holidayRes = await ApiCall('GET', '/leaverequest/holidays')
            if (holidayRes?.data?.data) {
                setHolidays(Array.isArray(holidayRes.data.data) ? holidayRes.data.data : [])
            }

            const balanceRes = await ApiCall('GET', '/myleaves/getAllMyLeaves')
            const resData = balanceRes?.data?.data?.data || balanceRes?.data?.data || balanceRes?.data || {}
            const rawBalance = resData.leaveBalance || resData.leave_balance || resData.balances || (Array.isArray(resData) ? resData : [])
            if (Array.isArray(rawBalance)) {
                const formattedBalance = rawBalance.map(item => ({
                    id: item.id,
                    leave_type_id: item.leave_type_id,
                    leave_code: item.LeaveTypeCode || item.leave_code || '',
                    leave_name: item.LeaveTypeName || item.leave_name || '',
                    total: Number(item.allocated_days ?? item.total ?? 0),
                    used: Number(item.used_days ?? item.used ?? 0),
                    pending: Number(item.pending_days ?? item.pending ?? 0),
                    available: Number(item.available_days ?? item.available ?? 0),
                    carry_forward: Number(item.carry_forward_days ?? item.carry_forward ?? 0)
                }))
                setLeaveBalance(formattedBalance)
            }

            const reqRes = await ApiCall('GET', '/leaverequest/myRequests')
            const reqList = reqRes?.data?.data || []
            if (Array.isArray(reqList)) {
                setLeaveRequests(reqList)
                setFilteredRequests(reqList)
            }
        } catch (err) {
            console.error('Error fetching initial leave request data:', err)
        }
    }

    const leaveTypes = useMemo(() => {
        const defaultStyleMap = {
            CL: { icon: <Calendar className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', description: 'For urgent matters, personal work' },
            SL: { icon: <Award className="w-4 h-4" />, color: 'bg-green-100 text-green-800', description: 'Medical emergencies, health issues' },
            EL: { icon: <Clock className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', description: 'Accumulated leave' },
            CO: { icon: <Award className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800', description: 'For working on holidays' },
            LWP: { icon: <MinusCircle className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800', description: 'Unpaid leave' },
            ML: { icon: <Heart className="w-4 h-4" />, color: 'bg-pink-100 text-pink-800', description: 'Maternity leave' },
            PL: { icon: <User className="w-4 h-4" />, color: 'bg-indigo-100 text-indigo-800', description: 'Paternity leave' }
        }

        if (!leaveBalance || leaveBalance.length === 0) return []

        return leaveBalance.map(item => {
            const code = (item.leave_code || '').toUpperCase()
            const style = defaultStyleMap[code] || {
                icon: <Award className="w-4 h-4" />,
                color: 'bg-indigo-100 text-indigo-800',
                description: `${item.leave_name} Policy`
            }

            return {
                code: item.leave_code,
                name: item.leave_name,
                balance: item.available,
                total: item.total,
                leave_type_id: item.leave_type_id,
                ...style
            }
        })
    }, [leaveBalance])

    useEffect(() => {
        let filtered = leaveRequests

        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(req =>
                req.leave_name.toLowerCase().includes(query) ||
                req.reason.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query)
            )
        }

        if (dateRange.from) {
            filtered = filtered.filter(req => req.from_date >= dateRange.from)
        }
        if (dateRange.to) {
            filtered = filtered.filter(req => req.to_date <= dateRange.to)
        }

        setFilteredRequests(filtered)
    }, [leaveRequests, statusFilter, searchQuery, dateRange])

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        const dateStr = clickedDate.toISOString().split('T')[0]

        if (clickedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            return
        }

        if (!isSelecting && !selectedStartDate) {
            setSelectedStartDate(dateStr)
            setIsSelecting(true)
        } else if (isSelecting && selectedStartDate && !selectedEndDate) {
            if (new Date(dateStr) >= new Date(selectedStartDate)) {
                setSelectedEndDate(dateStr)
                setIsSelecting(false)
                setNewRequest({
                    ...newRequest,
                    from_date: selectedStartDate,
                    to_date: dateStr
                })
                setShowApplyModal(true)
            } else {
                setSelectedStartDate(dateStr)
                setSelectedEndDate(null)
            }
        } else {
            setSelectedStartDate(dateStr)
            setSelectedEndDate(null)
            setIsSelecting(true)
        }
    }

    const handleDateHover = (day) => {
        if (isSelecting && selectedStartDate && !selectedEndDate) {
            const hoverDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]
            setHoverDate(hoverDateStr)
        }
    }

    const handleClearSelection = () => {
        setSelectedStartDate(null)
        setSelectedEndDate(null)
        setIsSelecting(false)
        setHoverDate(null)
    }

    const isDateInRange = (dateStr) => {
        if (!selectedStartDate) return false
        if (selectedEndDate) {
            return dateStr >= selectedStartDate && dateStr <= selectedEndDate
        }
        if (hoverDate && isSelecting) {
            return (dateStr >= selectedStartDate && dateStr <= hoverDate) || (dateStr <= selectedStartDate && dateStr >= hoverDate)
        }
        return dateStr === selectedStartDate
    }

    const isDateSelected = (dateStr) => {
        return dateStr === selectedStartDate || dateStr === selectedEndDate
    }

    const handleApplyLeave = async () => {
        if (!newRequest.leave_type || !newRequest.reason || !newRequest.from_date || !newRequest.to_date) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'Please select leave type, dates, and provide a reason' })
            return
        }

        // 1. Validation: Overlapping existing pending or approved leave request
        const hasOverlap = leaveRequests.some(req => {
            if (req.status === 'cancelled' || req.status === 'rejected') return false
            return (newRequest.from_date <= req.to_date && newRequest.to_date >= req.from_date)
        })

        if (hasOverlap) {
            showStatusToast({ type: 'warning', title: 'Overlapping Request', message: 'You have already applied or been approved for leave on date(s) within this range.' })
            return
        }

        const selectedLeaveType = leaveBalance.find(l => l.leave_code === newRequest.leave_type);
        if (!selectedLeaveType) {
            showStatusToast({ type: 'warning', title: 'Invalid Selection', message: 'Selected leave type is invalid or not allocated' })
            return;
        }

        const days = calculateLeaveDays(newRequest.from_date, newRequest.to_date, newRequest.half_day);

        // 2. Validation: No working days in range (all holidays or off-days)
        if (days <= 0) {
            showStatusToast({ type: 'warning', title: 'Invalid Date Range', message: 'The selected date range contains no working days (all selected days are holidays or off-days).' })
            return;
        }

        // 3. Validation: Insufficient balance
        if (selectedLeaveType.available < days && newRequest.leave_type !== 'LWP' && newRequest.leave_type !== 'UL') {
            showStatusToast({ type: 'warning', title: 'Insufficient Balance', message: `Insufficient leave balance. Available: ${selectedLeaveType.available} days` })
            return;
        }

        try {
            const payload = {
                leave_type_id: selectedLeaveType.leave_type_id,
                from_date: newRequest.from_date,
                to_date: newRequest.to_date,
                total_days: days,
                is_half_day: newRequest.half_day,
                half_day_session: newRequest.half_day ? newRequest.half_day_type : null,
                reason: newRequest.reason,
                contact_number: newRequest.contact_number,
                address_during_leave: newRequest.address_during_leave,
                handover_notes: newRequest.handover_notes,
                is_urgent: newRequest.urgent
            };

            const response = await ApiCall('POST', '/leaverequest/apply', payload);
            if (response?.data?.success) {
                showStatusToast({ type: 'success', title: 'Success', message: 'Leave request submitted successfully!' })
                setShowApplyModal(false);
                handleClearSelection();
                setNewRequest({
                    leave_type: '',
                    from_date: '',
                    to_date: '',
                    half_day: false,
                    half_day_type: 'first_half',
                    reason: '',
                    contact_number: '',
                    address_during_leave: '',
                    handover_notes: '',
                    documents: [],
                    urgent: false
                });
                fetchInitialData();
            }
        } catch (err) {
            showStatusToast({ type: 'error', title: 'Error', message: 'Failed to submit leave request: ' + (err.data?.message || err.message || 'Error occurred') })
        }
    }

    const calculateLeaveDays = (fromDate, toDate, halfDay = false) => {
        if (!fromDate || !toDate) return 0
        const start = new Date(fromDate)
        const end = new Date(toDate)
        let days = 0

        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const activeWorkWeek = workSchedule?.work_week && Array.isArray(workSchedule.work_week)
            ? workSchedule.work_week.map(w => String(w).toLowerCase()) : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const dayPad = String(d.getDate()).padStart(2, '0')
            const dayStr = `${y}-${m}-${dayPad}`
            const dayName = dayNames[d.getDay()]
            const isWorkDay = activeWorkWeek.includes(dayName)
            const isHoliday = (holidays || []).some(h => h.holiday_date === dayStr)

            if (isWorkDay && !isHoliday) {
                days++
            }
        }

        return halfDay ? Math.max(0.5, days - 0.5) : days
    }

    const handleCancelRequest = (id) => {
        setConfirmState({ open: true, requestId: id, loading: false })
    }

    const executeCancelRequest = async () => {
        if (!confirmState.requestId) return
        setConfirmState(prev => ({ ...prev, loading: true }))
        try {
            const res = await ApiCall('POST', '/leaverequest/cancel', { id: confirmState.requestId })
            if (res?.data?.success) {
                showStatusToast({ type: 'success', title: 'Success', message: 'Leave request cancelled successfully' })
                fetchInitialData()
            } else {
                showStatusToast({ type: 'error', title: 'Error', message: res?.data?.message || 'Failed to cancel request' })
            }
        } catch (err) {
            showStatusToast({ type: 'error', title: 'Error', message: 'Failed to cancel leave request: ' + (err.data?.message || err.message || 'Error occurred') })
        }
        setConfirmState({ open: false, requestId: null, loading: false })
    }

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    }

    const StatusBadge = ({ status }) => {
        const config = {
            'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader, label: 'Pending' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', icon: MinusCircle, label: 'Cancelled' }
        };
        const cfg = config[status] || config.pending;
        const Icon = cfg.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };

    const requestColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                    >
                        <Eye className="w-3 h-3" />
                    </button>
                    {row.status === 'pending' && (
                        <button
                            onClick={() => handleCancelRequest(row.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancel Request"
                        >
                            <XCircle className="w-3 h-3" />
                        </button>
                    )}
                </div>
            ),
            width: "80px"
        },
        {
            header: "Request ID",
            accessor: "id",
            cell: row => (
                <span className="font-mono text-sm font-medium text-indigo-600">
                    {row.id}
                </span>
            )
        },
        {
            header: "Leave Type",
            cell: row => {
                const leave = leaveTypes.find(l => l.code === row.leave_type);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave?.color || 'bg-gray-100'}`}>
                        {row.leave_name}
                    </span>
                );
            }
        },
        {
            header: "Duration",
            cell: row => (
                <div>
                    <div>{row.from_date} to {row.to_date}</div>
                    <div className="text-xs text-gray-500">{row.days} {row.days === 1 ? 'day' : 'days'}</div>
                </div>
            )
        },
        {
            header: "Reason",
            accessor: "reason",
            cell: row => (
                <div className="max-w-[200px] truncate" title={row.reason}>
                    {row.reason}
                </div>
            )
        },
        {
            header: "Applied On",
            accessor: "applied_on"
        },
        {
            header: "Status",
            cell: row => <StatusBadge status={row.status} />
        }
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {leaveTypes.map(leave => (
                    <div key={leave.code} className="bg-white rounded-md shadow-sm border border-gray-300 p-4 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${leave.color}`}>
                                {leave.icon}
                            </div>
                            {leave.code !== 'UL' && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {leave.balance}/{leave.total}
                                </span>
                            )}
                        </div>
                        <h3 className="font-medium text-gray-900">{leave.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{leave.description}</p>
                        {leave.code !== 'UL' && (
                            <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${leave.color.split(' ')[0]}`}
                                        style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="flex gap-1 border-b border-b-gray-300">
                    <button
                        onClick={() => setSelectedTab('apply')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors  ${selectedTab === 'apply'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <CalendarPlus className="w-4 h-4" />
                        Request Leave
                    </button>

                    <button
                        onClick={() => setSelectedTab('history')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'history'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        Request History
                    </button>
                </div>


                {selectedTab === 'apply' && (
                    <LeaveRequestApply
                        selectedStartDate={selectedStartDate}
                        handleClearSelection={handleClearSelection}
                        handlePrevMonth={handlePrevMonth}
                        monthNames={monthNames}
                        currentDate={currentDate}
                        handleNextMonth={handleNextMonth}
                        weekDays={weekDays}
                        isDateInRange={isDateInRange}
                        leaveRequests={leaveRequests}
                        isDateSelected={isDateSelected}
                        handleDateClick={handleDateClick}
                        handleDateHover={handleDateHover}
                        selectedEndDate={selectedEndDate}
                        calculateLeaveDays={calculateLeaveDays}
                        workSchedule={workSchedule}
                        holidays={holidays}
                    />)}

                {selectedTab === 'history' && (<LeaveRequestHistory
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    requestColumns={requestColumns}
                    filteredRequests={filteredRequests}
                />)}
            </div>



            {showApplyModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
                            <button
                                onClick={() => {
                                    setShowApplyModal(false);
                                    handleClearSelection();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-indigo-700">Selected Dates</p>
                                        <p className="font-medium text-indigo-900">
                                            {newRequest.from_date} to {newRequest.to_date}
                                        </p>
                                        <p className="text-sm text-indigo-600 mt-1">
                                            Total: {calculateLeaveDays(newRequest.from_date, newRequest.to_date)} days
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <CommonDropDown
                                required
                                label="Leave Type"
                                value={newRequest.leave_type}
                                onChange={(val) => setNewRequest({ ...newRequest, leave_type: val })}
                                options={leaveTypes.map(l => ({
                                    label: `${l.name} (${l.balance} days left)`,
                                    value: l.code,
                                    description: l.description
                                }))}
                                placeholder="Select leave type"
                            />

                            {/* Half Day Option - Only if single day */}
                            {newRequest.from_date === newRequest.to_date && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                                        <input
                                            type="checkbox"
                                            checked={newRequest.half_day}
                                            onChange={(e) => setNewRequest({ ...newRequest, half_day: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Apply for Half Day</span>
                                    </label>

                                    {newRequest.half_day && (
                                        <div className="flex gap-3">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="half_day_type"
                                                    value="first_half"
                                                    checked={newRequest.half_day_type === 'first_half'}
                                                    onChange={(e) => setNewRequest({ ...newRequest, half_day_type: e.target.value })}
                                                    className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm">First Half</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="half_day_type"
                                                    value="second_half"
                                                    checked={newRequest.half_day_type === 'second_half'}
                                                    onChange={(e) => setNewRequest({ ...newRequest, half_day_type: e.target.value })}
                                                    className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm">Second Half</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            )}

                            <CommonInputField
                                required
                                label="Reason for Leave"
                                value={newRequest.reason}
                                onChange={(e) => setNewRequest({ ...newRequest, reason: e })}
                                placeholder="Brief description of your leave reason"
                                multiline
                                rows={3}
                            />

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newRequest.urgent}
                                        onChange={(e) => setNewRequest({ ...newRequest, urgent: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Mark as Urgent</span>
                                </label>
                                {newRequest.urgent && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                        Will be prioritized
                                    </span>
                                )}
                            </div>

                            <CommonInputField
                                label="Work Handover Notes"
                                value={newRequest.handover_notes}
                                onChange={(e) => setNewRequest({ ...newRequest, handover_notes: e })}
                                placeholder="Who will handle your work? Any important tasks to note?"
                                multiline
                                rows={2}
                            />

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">Upload supporting documents</p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                                <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Browse Files
                                </button>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Important Information</p>
                                        <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                                            <li>Your request will be sent to for approval</li>
                                            <li>You can track request status in the History tab</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowApplyModal(false);
                                    handleClearSelection();
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApplyLeave}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Leave Request Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Request ID</p>
                                    <p className="font-mono font-medium text-indigo-600">{selectedRequest.id}</p>
                                </div>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {/* Leave Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Leave Type</p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypes.find(l => l.code === selectedRequest.leave_type)?.color
                                        }`}>
                                        {selectedRequest.leave_name}
                                    </span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <p className="font-medium">{selectedRequest.days} {selectedRequest.days === 1 ? 'day' : 'days'}</p>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">From Date</p>
                                    <p className="font-medium">{selectedRequest.from_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">To Date</p>
                                    <p className="font-medium">{selectedRequest.to_date}</p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Reason</p>
                                <p className="bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Contact Number</p>
                                    <p className="font-medium">{selectedRequest.contact_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">{selectedRequest.address || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Documents */}
                            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Attached Documents</p>
                                    <div className="space-y-2">
                                        {selectedRequest.documents.map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm">{doc}</span>
                                                </div>
                                                <button className="text-indigo-600 hover:text-indigo-800">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Approval Timeline */}
                            <div className="border-t pt-4">
                                <p className="font-medium mb-3">Timeline</p>
                                <div className="space-y-3">
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium">Applied on {selectedRequest.applied_on}</p>
                                            <p className="text-xs text-gray-500">via Employee Self Service</p>
                                        </div>
                                    </div>
                                    {selectedRequest.status === 'approved' && (
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Approved by {selectedRequest.approved_by} on {selectedRequest.approved_on}</p>
                                                {selectedRequest.comments && (
                                                    <p className="text-xs text-gray-600 mt-1">Comments: {selectedRequest.comments}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {selectedRequest.status === 'rejected' && (
                                        <div className="flex gap-3">
                                            <div className="w-2 h-2 mt-2 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium">Rejected by {selectedRequest.rejected_by} on {selectedRequest.rejected_on}</p>
                                                {selectedRequest.comments && (
                                                    <p className="text-xs text-gray-600 mt-1">Reason: {selectedRequest.comments}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CommonConfirmPopup
                isOpen={confirmState.open}
                onConfirm={executeCancelRequest}
                onCancel={() => setConfirmState({ open: false, requestId: null, loading: false })}
                title="Cancel Leave Request"
                message="Are you sure you want to cancel this leave request?"
                confirmLabel="Yes, Cancel"
                cancelLabel="No, Keep"
                variant="danger"
                loading={confirmState.loading}
            />
        </>
    )
}

export default MyLeaveRequestMain