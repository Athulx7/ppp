import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Briefcase, FileText, CheckCircle,
    XCircle, AlertCircle, ChevronRight, Download, Eye,
    Filter, Search, Plus, Upload, Trash2, Edit, Save,
    ArrowLeft, Send, History, Award, Bell, MessageSquare,
    ThumbsUp, ThumbsDown, MinusCircle, PlusCircle, Info,
    HelpCircle, Loader, ChevronLeft,
    CalendarPlus
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonTable from '../basicComponents/commonTable';

function LeaveRequest() {
    const navigate = useNavigate();

    // Mock current user
    const [currentUser, setCurrentUser] = useState({
        emp_code: 'EMP002',
        emp_name: 'Athul Krishna',
        designation: 'Junior Software Engineer',
        department: 'Engineering',
        employment_type: 'Permanent',
        doj: '2023-06-15',
        manager: 'Michael Chen',
        manager_code: 'EMP003',
        leave_balance: {
            casual: 8,
            sick: 5,
            earned: 12,
            comp_off: 2,
            unpaid: 0
        }
    });

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [hoverDate, setHoverDate] = useState(null);

    // State for new leave request
    const [selectedTab, setSelectedTab] = useState('apply'); // 'apply', 'history', 'balance'
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    // New leave request form
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
    });

    // Leave types with details
    const leaveTypes = [
        {
            code: 'CL',
            name: 'Casual Leave',
            balance: 8,
            total: 12,
            color: 'bg-blue-100 text-blue-800',
            icon: <Calendar className="w-4 h-4" />,
            description: 'For urgent matters, personal work',
            max_consecutive: 5,
            min_notice: 1,
            requires_document: false
        },
        {
            code: 'SL',
            name: 'Sick Leave',
            balance: 5,
            total: 10,
            color: 'bg-green-100 text-green-800',
            icon: <Award className="w-4 h-4" />,
            description: 'Medical emergencies, health issues',
            max_consecutive: 3,
            min_notice: 0,
            requires_document: true
        },
        {
            code: 'EL',
            name: 'Earned Leave',
            balance: 12,
            total: 18,
            color: 'bg-purple-100 text-purple-800',
            icon: <Clock className="w-4 h-4" />,
            description: 'Accumulated leave',
            max_consecutive: 10,
            min_notice: 7,
            requires_document: false
        },
        {
            code: 'CO',
            name: 'Compensatory Off',
            balance: 2,
            total: 2,
            color: 'bg-orange-100 text-orange-800',
            icon: <Award className="w-4 h-4" />,
            description: 'For working on holidays',
            max_consecutive: 2,
            min_notice: 1,
            requires_document: false
        },
        {
            code: 'UL',
            name: 'Unpaid Leave',
            balance: 0,
            total: 0,
            color: 'bg-gray-100 text-gray-800',
            icon: <MinusCircle className="w-4 h-4" />,
            description: 'Leave without pay',
            max_consecutive: 15,
            min_notice: 3,
            requires_document: false
        }
    ];

    // Dummy leave requests data
    useEffect(() => {
        const dummyRequests = [
            {
                id: 'LR001',
                leave_type: 'CL',
                leave_name: 'Casual Leave',
                from_date: '2024-02-15',
                to_date: '2024-02-17',
                days: 3,
                reason: 'Family function',
                status: 'approved',
                applied_on: '2024-02-10',
                approved_by: 'Michael Chen',
                approved_on: '2024-02-11',
                comments: 'Approved',
                contact_number: '9876543210',
                address: 'Bangalore'
            },
            {
                id: 'LR002',
                leave_type: 'SL',
                leave_name: 'Sick Leave',
                from_date: '2024-02-05',
                to_date: '2024-02-06',
                days: 2,
                reason: 'Viral fever',
                status: 'approved',
                applied_on: '2024-02-05',
                approved_by: 'Michael Chen',
                approved_on: '2024-02-05',
                comments: 'Take care',
                contact_number: '9876543210',
                address: 'Bangalore',
                documents: ['medical_certificate.pdf']
            },
            {
                id: 'LR003',
                leave_type: 'EL',
                leave_name: 'Earned Leave',
                from_date: '2024-03-01',
                to_date: '2024-03-05',
                days: 5,
                reason: 'Vacation',
                status: 'pending',
                applied_on: '2024-02-20',
                contact_number: '9876543210',
                address: 'Goa'
            },
            {
                id: 'LR004',
                leave_type: 'CL',
                leave_name: 'Casual Leave',
                from_date: '2024-01-10',
                to_date: '2024-01-12',
                days: 3,
                reason: 'Personal work',
                status: 'rejected',
                applied_on: '2024-01-05',
                rejected_by: 'Michael Chen',
                rejected_on: '2024-01-06',
                comments: 'Team already has 3 members on leave',
                contact_number: '9876543210',
                address: 'Bangalore'
            },
            {
                id: 'LR005',
                leave_type: 'CO',
                leave_name: 'Compensatory Off',
                from_date: '2024-02-25',
                to_date: '2024-02-26',
                days: 2,
                reason: 'Comp off for Sunday work',
                status: 'pending',
                applied_on: '2024-02-18',
                contact_number: '9876543210',
                address: 'Bangalore'
            },
            {
                id: 'LR006',
                leave_type: 'SL',
                leave_name: 'Sick Leave',
                from_date: '2024-01-20',
                to_date: '2024-01-22',
                days: 3,
                reason: 'Medical checkup',
                status: 'approved',
                applied_on: '2024-01-19',
                approved_by: 'Michael Chen',
                approved_on: '2024-01-19',
                comments: 'Get well soon',
                contact_number: '9876543210',
                address: 'Bangalore'
            }
        ];
        setLeaveRequests(dummyRequests);
        setFilteredRequests(dummyRequests);
    }, []);

    // Filter requests based on search and filters
    useEffect(() => {
        let filtered = leaveRequests;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(req =>
                req.leave_name.toLowerCase().includes(query) ||
                req.reason.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query)
            );
        }

        if (dateRange.from) {
            filtered = filtered.filter(req => req.from_date >= dateRange.from);
        }
        if (dateRange.to) {
            filtered = filtered.filter(req => req.to_date <= dateRange.to);
        }

        setFilteredRequests(filtered);
    }, [leaveRequests, statusFilter, searchQuery, dateRange]);

    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        return { daysInMonth, startingDay };
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateStr = clickedDate.toISOString().split('T')[0];

        // Don't allow past dates
        if (clickedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            return;
        }

        if (!isSelecting && !selectedStartDate) {
            // Start selection
            setSelectedStartDate(dateStr);
            setIsSelecting(true);
        } else if (isSelecting && selectedStartDate && !selectedEndDate) {
            // Complete selection
            if (new Date(dateStr) >= new Date(selectedStartDate)) {
                setSelectedEndDate(dateStr);
                setIsSelecting(false);

                // Open apply modal with selected dates
                setNewRequest({
                    ...newRequest,
                    from_date: selectedStartDate,
                    to_date: dateStr
                });
                setShowApplyModal(true);
            } else {
                // If end date is before start date, reset and start new selection
                setSelectedStartDate(dateStr);
                setSelectedEndDate(null);
            }
        } else {
            // Reset and start new selection
            setSelectedStartDate(dateStr);
            setSelectedEndDate(null);
            setIsSelecting(true);
        }
    };

    const handleDateHover = (day) => {
        if (isSelecting && selectedStartDate && !selectedEndDate) {
            const hoverDateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
            setHoverDate(hoverDateStr);
        }
    };

    const handleClearSelection = () => {
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setIsSelecting(false);
        setHoverDate(null);
    };

    const isDateInRange = (dateStr) => {
        if (!selectedStartDate) return false;
        if (selectedEndDate) {
            return dateStr >= selectedStartDate && dateStr <= selectedEndDate;
        }
        if (hoverDate && isSelecting) {
            return (dateStr >= selectedStartDate && dateStr <= hoverDate) ||
                (dateStr <= selectedStartDate && dateStr >= hoverDate);
        }
        return dateStr === selectedStartDate;
    };

    const isDateSelected = (dateStr) => {
        return dateStr === selectedStartDate || dateStr === selectedEndDate;
    };

    const handleApplyLeave = () => {
        // Validate form
        if (!newRequest.leave_type || !newRequest.reason) {
            alert('Please select leave type and provide reason');
            return;
        }

        const days = calculateLeaveDays(newRequest.from_date, newRequest.to_date, newRequest.half_day);

        // Check leave balance
        const leaveType = leaveTypes.find(l => l.code === newRequest.leave_type);
        if (leaveType && leaveType.balance < days && newRequest.leave_type !== 'UL') {
            alert(`Insufficient leave balance. Available: ${leaveType.balance} days`);
            return;
        }

        // Create new request
        const newLeaveRequest = {
            id: `LR${String(leaveRequests.length + 1).padStart(3, '0')}`,
            leave_type: newRequest.leave_type,
            leave_name: leaveTypes.find(l => l.code === newRequest.leave_type)?.name,
            from_date: newRequest.from_date,
            to_date: newRequest.to_date,
            days: days,
            half_day: newRequest.half_day,
            half_day_type: newRequest.half_day ? newRequest.half_day_type : null,
            reason: newRequest.reason,
            status: 'pending',
            applied_on: new Date().toISOString().split('T')[0],
            contact_number: newRequest.contact_number || currentUser.contact_number,
            address: newRequest.address_during_leave,
            handover_notes: newRequest.handover_notes,
            urgent: newRequest.urgent
        };

        setLeaveRequests([newLeaveRequest, ...leaveRequests]);
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
    };

    // Calculate leave days (excluding weekends)
    const calculateLeaveDays = (fromDate, toDate, halfDay = false) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        let days = 0;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            if (day !== 0 && day !== 6) { // Exclude weekends (0 = Sunday, 6 = Saturday)
                days++;
            }
        }

        return halfDay ? days - 0.5 : days;
    };

    const handleCancelRequest = (id) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            setLeaveRequests(leaveRequests.map(req =>
                req.id === id ? { ...req, status: 'cancelled' } : req
            ));
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    // Status badge component
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

    // Requests Table Columns
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
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Employee Self Service', to: '/ess' },
                    { label: 'Leave Request' }
                ]}
                title="Leave Request"
                description="Apply for leave and track your requests"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {leaveTypes.map(leave => (
                    <div key={leave.code} className="bg-white rounded-xl shadow-sm border border-gray-300 p-4 hover:shadow-md transition-all">
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

            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex p-2 gap-1 border-b border-b-gray-300">
                    <button
                        onClick={() => setSelectedTab('apply')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${selectedTab === 'apply'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CalendarPlus className="w-4 h-4" />
                        Request Leave
                    </button>
                    <button
                        onClick={() => setSelectedTab('history')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${selectedTab === 'history'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        Request History
                    </button>
                </div>

                <div className="">
                    {selectedTab === 'apply' && (
                        <div className='p-3'>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Select Leave Dates
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-indigo-200 rounded"></div>
                                        <span className="text-sm text-gray-600">Selected Range</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                                        <span className="text-sm text-gray-600">Existing Leave</span>
                                    </div>
                                    {selectedStartDate && (
                                        <button
                                            onClick={handleClearSelection}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Clear Selection
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h4 className="text-lg font-medium">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h4>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                {/* Week Days Header */}
                                <div className="grid grid-cols-7 bg-gray-50 border-b border-b-gray-300">
                                    {weekDays.map(day => (
                                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7">
                                    {Array.from({ length: getDaysInMonth(currentDate).startingDay }).map((_, index) => (
                                        <div key={`empty-${index}`} className="p-3 border-b border-r border-b-gray-300 border-r-gray-300 bg-gray-50"></div>
                                    ))}

                                    {Array.from({ length: getDaysInMonth(currentDate).daysInMonth }).map((_, index) => {
                                        const day = index + 1;
                                        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                                        const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));
                                        const isInRange = isDateInRange(dateStr);
                                        const isSelected = isDateSelected(dateStr);

                                        // Check if there's an existing leave on this date
                                        const hasLeave = leaveRequests.some(req =>
                                            req.status !== 'rejected' && req.status !== 'cancelled' &&
                                            dateStr >= req.from_date && dateStr <= req.to_date
                                        );

                                        return (
                                            <div
                                                key={day}
                                                onClick={() => !isPast && handleDateClick(day)}
                                                onMouseEnter={() => !isPast && handleDateHover(day)}
                                                className={`p-3 border-b border-r border-b-gray-300 border-r-gray-300 relative cursor-pointer h-16 transition-all
                                                    ${isPast ? ' cursor-not-allowed' : 'hover:bg-gray-50'}
                                                    ${isInRange ? 'bg-indigo-50' : ''}
                                                    ${isSelected ? 'bg-indigo-100 border-indigo-300' : ''}
                                                    ${hasLeave ? 'bg-red-50' : ''}
                                                `}
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-sm font-medium
                                                        ${isPast ? 'text-gray-400' : 'text-gray-700'}
                                                        ${isSelected ? 'text-indigo-700' : ''}
                                                        ${hasLeave ? 'text-red-700' : ''}
                                                    `}>
                                                        {day}
                                                    </span>
                                                    {hasLeave && (
                                                        <span className="text-xs text-red-600 mt-1">Leave</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedStartDate && (
                                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-indigo-700">Selected Dates</p>
                                            <p className="font-medium text-indigo-900">
                                                {selectedStartDate} {selectedEndDate ? `to ${selectedEndDate}` : '(select end date)'}
                                            </p>
                                            {selectedStartDate && selectedEndDate && (
                                                <p className="text-sm text-indigo-600 mt-1">
                                                    Total: {calculateLeaveDays(selectedStartDate, selectedEndDate)} days
                                                </p>
                                            )}
                                        </div>
                                        {!selectedEndDate && (
                                            <p className="text-sm text-indigo-600">
                                                Click another date to complete selection
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'history' && (
                        <div>
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-3">

                                <CommonDropDown
                                    label=""
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { label: 'All Status', value: 'all' },
                                        { label: 'Pending', value: 'pending' },
                                        { label: 'Approved', value: 'approved' },
                                        { label: 'Rejected', value: 'rejected' },
                                        { label: 'Cancelled', value: 'cancelled' }
                                    ]}
                                    placeholder="Filter by Status"
                                />

                                <CommonDatePicker
                                    label=""
                                    value={dateRange.from}
                                    onChange={(val) => setDateRange({ ...dateRange, from: val })}
                                    placeholder="From Date"
                                />

                                <CommonDatePicker
                                    label=""
                                    value={dateRange.to}
                                    onChange={(val) => setDateRange({ ...dateRange, to: val })}
                                    placeholder="To Date"
                                />
                            </div>

                            <CommonTable
                                columns={requestColumns}
                                data={filteredRequests}
                                itemsPerPage={5}
                                showSearch={false}
                                showPagination={true}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Leave Modal */}
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
                            {/* Selected Dates Summary */}
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

                            {/* Leave Type */}
                            <CommonDropDown
                                label="Leave Type *"
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

                            {/* Reason */}
                            <CommonInputField
                                label="Reason for Leave *"
                                value={newRequest.reason}
                                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                                placeholder="Brief description of your leave reason"
                                multiline
                                rows={3}
                            />

                            {/* Urgent Flag */}
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

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CommonInputField
                                    label="Contact Number During Leave"
                                    value={newRequest.contact_number}
                                    onChange={(e) => setNewRequest({ ...newRequest, contact_number: e.target.value })}
                                    placeholder="Your mobile number"
                                />
                                <CommonInputField
                                    label="Address During Leave"
                                    value={newRequest.address_during_leave}
                                    onChange={(e) => setNewRequest({ ...newRequest, address_during_leave: e.target.value })}
                                    placeholder="Where can you be reached?"
                                />
                            </div>

                            {/* Handover Notes */}
                            <CommonInputField
                                label="Work Handover Notes"
                                value={newRequest.handover_notes}
                                onChange={(e) => setNewRequest({ ...newRequest, handover_notes: e.target.value })}
                                placeholder="Who will handle your work? Any important tasks to note?"
                                multiline
                                rows={2}
                            />

                            {/* Document Upload */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">Upload supporting documents</p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                                <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                                    Browse Files
                                </button>
                            </div>

                            {/* Important Notes */}
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-yellow-800">Important Information</p>
                                        <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                                            <li>Your request will be sent to {currentUser.manager} for approval</li>
                                            <li>Medical certificate required for sick leaves longer than 2 days</li>
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
        </div>
    );
}

export default LeaveRequest;