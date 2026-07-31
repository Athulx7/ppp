import { CalendarDays, CheckCircle, Eye, Loader, ThumbsDown, ThumbsUp, XCircle, Shield, Users, UserCheck, User, CheckSquare, XSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import CommonTable from '../../basicComponents/commonTable';
import LeaveApprovalCalendar from './LeaveApprovalCalendar';
import ApproveRejectActionModal from './ApproveRejectActionModal';
import LeaveApprovalDetailModal from './LeaveApprovalDetailModal';
import DateLeaveDetailsModal from './DateLeaveDetailsModal';

function LeaveApprovalMain({ isLoading, setIsLoading }) {

    // Mock current user (Admin/HR/Manager)
    const [currentUser, setCurrentUser] = useState({
        emp_code: 'ADMIN001',
        emp_name: 'John Admin',
        role: 'hr', // 'admin', 'hr', 'manager'
        designation: 'HR Manager',
        department: 'Human Resources',
        managed_teams: ['Engineering', 'Sales', 'Marketing'],
        reportees: ['EMP002', 'EMP003', 'EMP004', 'EMP005', 'EMP006']
    });

    // State for different views
    const [selectedTab, setSelectedTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all', 'calendar', 'reports'
    const [selectedView, setSelectedView] = useState('list'); // 'list', 'calendar', 'reports'
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedLeaveType, setSelectedLeaveType] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [searchQuery, setSearchQuery] = useState('');

    // Data states
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'approve', 'reject'
    const [actionComment, setActionComment] = useState('');

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateLeaves, setShowDateLeaves] = useState(false);
    const [dateLeaveDetails, setDateLeaveDetails] = useState([]);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        pendingDays: 0,
        approvedDays: 0,
        avgResponseTime: 0,
        byDepartment: {},
        byLeaveType: {}
    });

    // Dummy employees data
    const employees = [
        { emp_code: 'EMP001', emp_name: 'John Doe', designation: 'HR Manager', department: 'HR' },
        { emp_code: 'EMP002', emp_name: 'Athul Krishna', designation: 'Junior Software Engineer', department: 'Engineering' },
        { emp_code: 'EMP003', emp_name: 'Michael Chen', designation: 'Tech Lead', department: 'Engineering' },
        { emp_code: 'EMP004', emp_name: 'Sarah Johnson', designation: 'Sales Manager', department: 'Sales' },
        { emp_code: 'EMP005', emp_name: 'David Kumar', designation: 'Accountant', department: 'Finance' },
        { emp_code: 'EMP006', emp_name: 'Priya Patel', designation: 'HR Executive', department: 'HR' },
        { emp_code: 'EMP007', emp_name: 'Robert Wilson', designation: 'Software Engineer', department: 'Engineering' },
        { emp_code: 'EMP008', emp_name: 'Lisa Wong', designation: 'Marketing Specialist', department: 'Marketing' },
        { emp_code: 'EMP009', emp_name: 'Thomas Brown', designation: 'Sales Executive', department: 'Sales' },
        { emp_code: 'EMP010', emp_name: 'Amanda Lee', designation: 'Financial Analyst', department: 'Finance' }
    ];

    // Departments
    const departments = [
        { value: '', label: 'All Departments' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Operations', label: 'Operations' }
    ];

    // Leave types
    const leaveTypes = [
        { value: '', label: 'All Leave Types' },
        { value: 'CL', label: 'Casual Leave' },
        { value: 'SL', label: 'Sick Leave' },
        { value: 'EL', label: 'Earned Leave' },
        { value: 'CO', label: 'Compensatory Off' },
        { value: 'ML', label: 'Maternity Leave' },
        { value: 'PL', label: 'Paternity Leave' },
        { value: 'LWP', label: 'Leave Without Pay' }
    ];

    // Dummy leave requests data
    useEffect(() => {
        const generateDummyRequests = () => {
            const requests = [
                {
                    id: 'LR001',
                    emp_code: 'EMP002',
                    emp_name: 'Athul Krishna',
                    designation: 'Junior Software Engineer',
                    department: 'Engineering',
                    leave_type: 'CL',
                    leave_name: 'Casual Leave',
                    from_date: '2026-03-15',
                    to_date: '2026-03-17',
                    days: 3,
                    reason: 'Family function',
                    status: 'pending',
                    applied_on: '2026-03-10',
                    contact_number: '9876543210',
                    address: 'Bangalore',
                    documents: [],
                    reporting_manager: 'Michael Chen',
                    reporting_manager_code: 'EMP003'
                },
                {
                    id: 'LR002',
                    emp_code: 'EMP007',
                    emp_name: 'Robert Wilson',
                    designation: 'Software Engineer',
                    department: 'Engineering',
                    leave_type: 'SL',
                    leave_name: 'Sick Leave',
                    from_date: '2026-03-12',
                    to_date: '2026-03-13',
                    days: 2,
                    reason: 'Viral fever',
                    status: 'pending',
                    applied_on: '2026-03-11',
                    contact_number: '9876543217',
                    address: 'Bangalore',
                    documents: ['medical_certificate.pdf'],
                    reporting_manager: 'Michael Chen',
                    reporting_manager_code: 'EMP003'
                },
                {
                    id: 'LR003',
                    emp_code: 'EMP004',
                    emp_name: 'Sarah Johnson',
                    designation: 'Sales Manager',
                    department: 'Sales',
                    leave_type: 'EL',
                    leave_name: 'Earned Leave',
                    from_date: '2026-03-20',
                    to_date: '2026-03-25',
                    days: 6,
                    reason: 'Vacation with family',
                    status: 'pending',
                    applied_on: '2026-03-05',
                    contact_number: '9876543214',
                    address: 'Goa',
                    documents: [],
                    reporting_manager: 'John Doe',
                    reporting_manager_code: 'EMP001'
                },
                {
                    id: 'LR004',
                    emp_code: 'EMP006',
                    emp_name: 'Priya Patel',
                    designation: 'HR Executive',
                    department: 'HR',
                    leave_type: 'CL',
                    leave_name: 'Casual Leave',
                    from_date: '2026-03-18',
                    to_date: '2026-03-19',
                    days: 2,
                    reason: 'Personal work',
                    status: 'approved',
                    applied_on: '2026-03-08',
                    approved_by: 'John Admin',
                    approved_on: '2026-03-09',
                    comments: 'Approved',
                    contact_number: '9876543216',
                    address: 'Bangalore',
                    reporting_manager: 'John Doe',
                    reporting_manager_code: 'EMP001'
                },
                {
                    id: 'LR005',
                    emp_code: 'EMP009',
                    emp_name: 'Thomas Brown',
                    designation: 'Sales Executive',
                    department: 'Sales',
                    leave_type: 'CO',
                    leave_name: 'Compensatory Off',
                    from_date: '2026-03-14',
                    to_date: '2026-03-14',
                    days: 1,
                    reason: 'Comp off for Sunday work',
                    status: 'approved',
                    applied_on: '2026-03-07',
                    approved_by: 'Sarah Johnson',
                    approved_on: '2026-03-08',
                    comments: 'Approved',
                    contact_number: '9876543219',
                    address: 'Bangalore',
                    reporting_manager: 'Sarah Johnson',
                    reporting_manager_code: 'EMP004'
                },
                {
                    id: 'LR006',
                    emp_code: 'EMP005',
                    emp_name: 'David Kumar',
                    designation: 'Accountant',
                    department: 'Finance',
                    leave_type: 'SL',
                    leave_name: 'Sick Leave',
                    from_date: '2026-03-05',
                    to_date: '2026-03-07',
                    days: 3,
                    reason: 'Medical checkup',
                    status: 'rejected',
                    applied_on: '2026-03-01',
                    rejected_by: 'John Admin',
                    rejected_on: '2026-03-02',
                    comments: 'Team already has 2 members on leave',
                    contact_number: '9876543215',
                    address: 'Bangalore',
                    reporting_manager: 'Amanda Lee',
                    reporting_manager_code: 'EMP010'
                },
                {
                    id: 'LR007',
                    emp_code: 'EMP003',
                    emp_name: 'Michael Chen',
                    designation: 'Tech Lead',
                    department: 'Engineering',
                    leave_type: 'EL',
                    leave_name: 'Earned Leave',
                    from_date: '2026-03-25',
                    to_date: '2026-03-30',
                    days: 6,
                    reason: 'Family trip',
                    status: 'pending',
                    applied_on: '2026-03-12',
                    contact_number: '9876543213',
                    address: 'Kerala',
                    documents: [],
                    reporting_manager: 'John Doe',
                    reporting_manager_code: 'EMP001'
                },
                {
                    id: 'LR008',
                    emp_code: 'EMP008',
                    emp_name: 'Lisa Wong',
                    designation: 'Marketing Specialist',
                    department: 'Marketing',
                    leave_type: 'CL',
                    leave_name: 'Casual Leave',
                    from_date: '2026-03-22',
                    to_date: '2026-03-23',
                    days: 2,
                    reason: 'Personal work',
                    status: 'pending',
                    applied_on: '2026-03-13',
                    contact_number: '9876543218',
                    address: 'Bangalore',
                    reporting_manager: 'Sarah Johnson',
                    reporting_manager_code: 'EMP004'
                }
            ];

            // Split into categories
            const pending = requests.filter(r => r.status === 'pending');
            const approved = requests.filter(r => r.status === 'approved');
            const rejected = requests.filter(r => r.status === 'rejected');

            setPendingRequests(pending);
            setApprovedRequests(approved);
            setRejectedRequests(rejected);
            setAllRequests(requests);
            setFilteredRequests(requests);

            // Calculate stats
            calculateStats(requests);
        };

        generateDummyRequests();
    }, []);

    // Filter requests based on user role and selections
    useEffect(() => {
        let filtered = [];

        // Role-based filtering
        if (currentUser.role === 'manager') {
            // Managers see only their team's requests
            filtered = allRequests.filter(r =>
                currentUser.reportees.includes(r.emp_code) ||
                r.reporting_manager_code === currentUser.emp_code
            );
        } else {
            // Admin and HR see all requests
            filtered = [...allRequests];
        }

        // Apply tab filter
        if (selectedTab === 'pending') {
            filtered = filtered.filter(r => r.status === 'pending');
        } else if (selectedTab === 'approved') {
            filtered = filtered.filter(r => r.status === 'approved');
        } else if (selectedTab === 'rejected') {
            filtered = filtered.filter(r => r.status === 'rejected');
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.emp_name.toLowerCase().includes(query) ||
                r.emp_code.toLowerCase().includes(query) ||
                r.reason.toLowerCase().includes(query) ||
                r.id.toLowerCase().includes(query)
            );
        }

        // Apply department filter
        if (selectedDepartment) {
            filtered = filtered.filter(r => r.department === selectedDepartment);
        }

        // Apply employee filter
        if (selectedEmployee) {
            filtered = filtered.filter(r => r.emp_code === selectedEmployee);
        }

        // Apply leave type filter
        if (selectedLeaveType) {
            filtered = filtered.filter(r => r.leave_type === selectedLeaveType);
        }

        // Apply date range
        if (dateRange.from) {
            filtered = filtered.filter(r => r.from_date >= dateRange.from);
        }
        if (dateRange.to) {
            filtered = filtered.filter(r => r.from_date <= dateRange.to);
        }

        setFilteredRequests(filtered);
    }, [allRequests, selectedTab, searchQuery, selectedDepartment, selectedEmployee, selectedLeaveType, dateRange, currentUser]);

    // Calculate statistics
    const calculateStats = (requests) => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const approved = requests.filter(r => r.status === 'approved').length;
        const rejected = requests.filter(r => r.status === 'rejected').length;

        const pendingDays = requests
            .filter(r => r.status === 'pending')
            .reduce((sum, r) => sum + r.days, 0);

        const approvedDays = requests
            .filter(r => r.status === 'approved')
            .reduce((sum, r) => sum + r.days, 0);

        // By department
        const byDepartment = {};
        requests.forEach(r => {
            if (!byDepartment[r.department]) {
                byDepartment[r.department] = { total: 0, pending: 0, approved: 0, rejected: 0 };
            }
            byDepartment[r.department].total++;
            byDepartment[r.department][r.status]++;
        });

        // By leave type
        const byLeaveType = {};
        requests.forEach(r => {
            if (!byLeaveType[r.leave_type]) {
                byLeaveType[r.leave_type] = { total: 0, name: r.leave_name };
            }
            byLeaveType[r.leave_type].total++;
        });

        setStats({
            total,
            pending,
            approved,
            rejected,
            pendingDays,
            approvedDays,
            avgResponseTime: '2.5 days',
            byDepartment,
            byLeaveType
        });
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setActionType('approve');
        setActionComment('');
        setShowActionModal(true);
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setActionType('reject');
        setActionComment('');
        setShowActionModal(true);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleActionSubmit = () => {
        if (!actionComment && actionType === 'reject') {
            alert('Please provide a reason for rejection');
            return;
        }

        // Update request status
        const updatedRequests = allRequests.map(r => {
            if (r.id === selectedRequest.id) {
                return {
                    ...r,
                    status: actionType === 'approve' ? 'approved' : 'rejected',
                    [`${actionType}d_by`]: currentUser.emp_name,
                    [`${actionType}d_on`]: new Date().toISOString().split('T')[0],
                    comments: actionComment || (actionType === 'approve' ? 'Approved' : 'Rejected')
                };
            }
            return r;
        });

        // Update state
        setAllRequests(updatedRequests);

        // Update filtered lists
        const pending = updatedRequests.filter(r => r.status === 'pending');
        const approved = updatedRequests.filter(r => r.status === 'approved');
        const rejected = updatedRequests.filter(r => r.status === 'rejected');

        setPendingRequests(pending);
        setApprovedRequests(approved);
        setRejectedRequests(rejected);

        // Close modal
        setShowActionModal(false);
        setSelectedRequest(null);
        setActionComment('');

        // Show success message
        alert(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
    };

    const handleBulkAction = (action) => {
        if (filteredRequests.length === 0) return;

        const selectedIds = filteredRequests
            .filter(r => r.status === 'pending')
            .map(r => r.id);

        if (selectedIds.length === 0) {
            alert('No pending requests to process');
            return;
        }

        if (window.confirm(`Are you sure you want to ${action} ${selectedIds.length} requests?`)) {
            const updatedRequests = allRequests.map(r => {
                if (selectedIds.includes(r.id)) {
                    return {
                        ...r,
                        status: action,
                        [`${action}d_by`]: currentUser.emp_name,
                        [`${action}d_on`]: new Date().toISOString().split('T')[0],
                        comments: action === 'approve' ? 'Bulk approved' : 'Bulk rejected'
                    };
                }
                return r;
            });

            setAllRequests(updatedRequests);

            const pending = updatedRequests.filter(r => r.status === 'pending');
            const approved = updatedRequests.filter(r => r.status === 'approved');
            const rejected = updatedRequests.filter(r => r.status === 'rejected');

            setPendingRequests(pending);
            setApprovedRequests(approved);
            setRejectedRequests(rejected);

            alert(`${selectedIds.length} requests ${action}d successfully`);
        }
    };

    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay };
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getLeavesForDate = (dateStr) => {
        return allRequests.filter(r =>
            r.status !== 'rejected' &&
            dateStr >= r.from_date && dateStr <= r.to_date
        );
    };

    const handleDateClick = (day) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        const leaves = getLeavesForDate(dateStr);
        if (leaves.length > 0) {
            setSelectedDate(dateStr);
            setDateLeaveDetails(leaves);
            setShowDateLeaves(true);
        }
    };

    const hasLeaveOnDate = (dateStr) => {
        return allRequests.some(r =>
            r.status !== 'rejected' &&
            dateStr >= r.from_date && dateStr <= r.to_date
        );
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const config = {
            'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader, label: 'Pending' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' }
        };
        const cfg = config[status];
        const Icon = cfg.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };

    // Table columns
    const requestColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={() => handleViewDetails(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                    >
                        <Eye className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    {row.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleApprove(row)}
                                className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                                title="Approve"
                            >
                                <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                            <button
                                onClick={() => handleReject(row)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                                title="Reject"
                            >
                                <ThumbsDown className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
            width: "100px"
        },
        {
            header: "Request ID",
            accessor: "id",
            cell: row => (
                <span className="font-mono text-xs font-medium text-indigo-600">
                    {row.id}
                </span>
            )
        },
        {
            header: "Employee",
            cell: row => (
                <div>
                    <div className="font-medium text-xs md:text-sm">{row.emp_name}</div>
                    <div className="text-xs text-gray-500">{row.emp_code}</div>
                </div>
            )
        },
        {
            header: "Department",
            accessor: "department"
        },
        {
            header: "Leave Type",
            cell: row => {
                const colors = {
                    'CL': 'bg-blue-100 text-blue-800',
                    'SL': 'bg-green-100 text-green-800',
                    'EL': 'bg-purple-100 text-purple-800',
                    'CO': 'bg-orange-100 text-orange-800',
                    'ML': 'bg-pink-100 text-pink-800',
                    'PL': 'bg-indigo-100 text-indigo-800',
                    'LWP': 'bg-gray-100 text-gray-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[row.leave_type] || 'bg-gray-100'}`}>
                        {row.leave_name}
                    </span>
                );
            }
        },
        {
            header: "Duration",
            cell: row => (
                <div>
                    <div className="text-xs">{row.from_date} to {row.to_date}</div>
                    <div className="text-xs text-gray-500">{row.days} {row.days === 1 ? 'day' : 'days'}</div>
                </div>
            )
        },
        {
            header: "Reason",
            accessor: "reason",
            cell: row => (
                <div className="max-w-[150px] truncate text-xs" title={row.reason}>
                    {row.reason}
                </div>
            )
        },
        {
            header: "Applied On",
            accessor: "applied_on",
            cell: row => <span className="text-xs">{row.applied_on}</span>
        },
        {
            header: "Status",
            cell: row => <StatusBadge status={row.status} />
        }
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get role-based access info
    const getRoleBadge = () => {
        switch (currentUser.role) {
            case 'admin':
                return { bg: 'bg-red-100', text: 'text-red-800', label: 'Administrator', icon: Shield };
            case 'hr':
                return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'HR Manager', icon: Users };
            case 'manager':
                return { bg: 'bg-green-100', text: 'text-green-800', label: 'Department Manager', icon: UserCheck };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'User', icon: User };
        }
    };

    const roleBadge = getRoleBadge();
    const RoleIcon = roleBadge.icon;
    return (
        <>
            <div className="bg-white rounded-md shadow-sm mb-4 md:mb-6">
                <div className="flex  border-b border-gray-300 flex-wrap gap-1 overflow-x-auto p-1">
                    <button onClick={() => setSelectedTab('pending')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors  ${selectedTab === 'pending'
                            ? 'bg-yellow-500 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Loader className="w-3 h-3 md:w-4 md:h-4" />
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setSelectedTab('approved')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm rounded-sm whitespace-nowrap flex items-center gap-2 transition-colors  ${selectedTab === 'approved'
                            ? 'bg-green-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Approved ({stats.approved})
                    </button>
                    <button onClick={() => setSelectedTab('rejected')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm rounded-sm whitespace-nowrap flex items-center gap-2 transition-colors  ${selectedTab === 'rejected'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Rejected ({stats.rejected})
                    </button>
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm rounded-sm whitespace-nowrap flex items-center gap-2 transition-colors  ${selectedTab === 'all'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CalendarDays className="w-3 h-3 md:w-4 md:h-4" />
                        All Requests
                    </button>
                </div>

                <div className="p-3 md:p-4 ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-3">
                        <CommonDropDown
                            label=""
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            options={departments}
                            placeholder="Department"
                        />
                        <CommonDropDown
                            label=""
                            value={selectedLeaveType}
                            onChange={setSelectedLeaveType}
                            options={leaveTypes}
                            placeholder="Leave Type"
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
                </div>

                <CommonTable
                    columns={requestColumns}
                    data={filteredRequests}
                    itemsPerPage={10}
                    showSearch={false}
                    showPagination={true}
                    tableControls={selectedTab === 'pending' && filteredRequests.length > 0 && (
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => handleBulkAction('approve')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-sm cursor-pointer hover:bg-green-700 text-xs flex items-center gap-1"
                            >
                                <CheckSquare className="w-3 h-3" />
                                Approve All
                            </button>
                            <button
                                onClick={() => handleBulkAction('reject')}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-sm cursor-pointer hover:bg-red-700 text-xs flex items-center gap-1"
                            >
                                <XSquare className="w-3 h-3" />
                                Reject All
                            </button>
                        </div>
                    )}
                />
            </div>

            <LeaveApprovalCalendar
                handlePrevMonth={handlePrevMonth}
                getLeavesForDate={getLeavesForDate}
                handleDateClick={handleDateClick}
                monthNames={monthNames}
                currentDate={currentDate} handleNextMonth={handleNextMonth}
                weekDays={weekDays}
                getDaysInMonth={getDaysInMonth} hasLeaveOnDate={hasLeaveOnDate}
            />

            {showActionModal && selectedRequest && (
                <ApproveRejectActionModal
                    actionType={actionType}
                    selectedRequest={selectedRequest} actionComment={actionComment}
                    setActionComment={setActionComment} setShowActionModal={setShowActionModal}
                    handleActionSubmit={handleActionSubmit}
                />
            )}

            {showDetailsModal && selectedRequest && (
                <LeaveApprovalDetailModal
                    setShowDetailsModal={setShowDetailsModal}
                    selectedRequest={selectedRequest}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                />
            )}

            {showDateLeaves && selectedDate && dateLeaveDetails.length > 0 && (
                <DateLeaveDetailsModal
                    selectedDate={selectedDate}
                    dateLeaveDetails={dateLeaveDetails}
                    setShowDateLeaves={setShowDateLeaves}
                    setSelectedRequest={setSelectedRequest}
                    setShowDetailsModal={setShowDetailsModal}
                />
            )}

        </>
    )
}

export default LeaveApprovalMain