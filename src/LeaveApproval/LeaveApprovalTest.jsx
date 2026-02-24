import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Briefcase, FileText, CheckCircle,
    XCircle, AlertCircle, ChevronRight, Download, Eye,
    Filter, Search, Plus, Upload, Trash2, Edit, Save,
    ArrowLeft, Send, History, Award, Bell, MessageSquare,
    ThumbsUp, ThumbsDown, MinusCircle, PlusCircle, Info,
    HelpCircle, Loader, ChevronLeft, ChevronRight as ChevronRightIcon,
    Building, Users, CheckSquare, XSquare, MessageCircle,
    Printer, DownloadCloud, RefreshCw, PieChart, BarChart,
    Settings, Shield, UserCheck, UserX, Clock3, CalendarDays
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonInputField from '../basicComponents/CommonInputField';

function LeaveApproval() {
    const navigate = useNavigate();

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
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Leave Management', to: '/leave' },
                    { label: 'Leave Approval' }
                ]}
                title="Leave Approval"
                description="Manage and process employee leave requests"
            />

            {/* User Role Banner */}
            <div className={`${roleBadge.bg} rounded-xl p-3 md:p-4 mb-4 md:mb-6 flex items-center justify-between`}>
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-white rounded-lg">
                        <RoleIcon className={`w-4 h-4 md:w-5 md:h-5 ${roleBadge.text}`} />
                    </div>
                    <div>
                        <span className={`font-medium text-xs md:text-sm ${roleBadge.text}`}>
                            Logged in as: {currentUser.emp_name}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 bg-white ${roleBadge.text} rounded-full text-[10px] md:text-xs font-medium`}>
                            {roleBadge.label}
                        </span>
                        {currentUser.role === 'manager' && (
                            <span className="ml-2 text-xs text-green-700">
                                • Managing {currentUser.reportees.length} team members
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className={`w-3 h-3 md:w-4 md:h-4 ${roleBadge.text}`} />
                    <span className={`text-[10px] md:text-xs ${roleBadge.text}`}>
                        {currentUser.role === 'admin' ? 'Full Access' :
                            currentUser.role === 'hr' ? 'HR Access' :
                                'Team Access'}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total Requests</p>
                            <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Pending</p>
                            <p className="text-lg md:text-xl lg:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="p-1.5 md:p-2 bg-yellow-100 rounded-lg">
                            <Loader className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.pendingDays} days pending</p>
                </div>

                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Approved</p>
                            <p className="text-lg md:text-xl lg:text-2xl font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="p-1.5 md:p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stats.approvedDays} days approved</p>
                </div>

                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Rejected</p>
                            <p className="text-lg md:text-xl lg:text-2xl font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="p-1.5 md:p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Avg Response</p>
                            <p className="text-lg md:text-xl lg:text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
                        </div>
                        <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg">
                            <Clock3 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-4 md:mb-6">
                <div className="flex flex-wrap p-2 gap-1 border-b border-b-gray-300 overflow-x-auto">
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'pending'
                                ? 'bg-yellow-500 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Loader className="w-3 h-3 md:w-4 md:h-4" />
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setSelectedTab('approved')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'approved'
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Approved ({stats.approved})
                    </button>
                    <button
                        onClick={() => setSelectedTab('rejected')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'rejected'
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                        Rejected ({stats.rejected})
                    </button>
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'all'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <CalendarDays className="w-3 h-3 md:w-4 md:h-4" />
                        All Requests
                    </button>
                </div>

                {/* Filters Section */}
                <div className="p-3 md:p-4 border-b">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-3">
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, reason..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

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

                    {/* Bulk Actions */}
                    {selectedTab === 'pending' && filteredRequests.length > 0 && (
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => handleBulkAction('approve')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs flex items-center gap-1"
                            >
                                <CheckSquare className="w-3 h-3" />
                                Approve All
                            </button>
                            <button
                                onClick={() => handleBulkAction('reject')}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs flex items-center gap-1"
                            >
                                <XSquare className="w-3 h-3" />
                                Reject All
                            </button>
                        </div>
                    )}
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px] lg:min-w-0 p-3 md:p-4">
                        <CommonTable
                            columns={requestColumns}
                            data={filteredRequests}
                            itemsPerPage={10}
                            showSearch={false}
                            showPagination={true}
                        />
                    </div>
                </div>
            </div>

            {/* Calendar View Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Leave Calendar</h3>

                {/* Calendar Navigation */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <h4 className="text-sm md:text-base font-medium">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h4>
                    <button
                        onClick={handleNextMonth}
                        className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-7 bg-gray-50 border-b">
                        {weekDays.map((day, index) => (
                            <div
                                key={day}
                                className={`p-2 text-center text-xs md:text-sm font-medium ${index === 0 || index === 6 ? 'text-red-500' : 'text-gray-600'
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {Array.from({ length: getDaysInMonth(currentDate).startingDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="p-2 border-b border-r bg-gray-50"></div>
                        ))}

                        {Array.from({ length: getDaysInMonth(currentDate).daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                            const hasLeave = hasLeaveOnDate(dateStr);
                            const leavesOnDate = getLeavesForDate(dateStr);

                            return (
                                <div
                                    key={day}
                                    onClick={() => hasLeave && handleDateClick(day)}
                                    className={`p-2 border-b border-r relative transition-all min-h-[60px] md:min-h-[80px]
                                        ${hasLeave ? 'bg-indigo-50 cursor-pointer hover:bg-indigo-100' : ''}
                                        ${!hasLeave ? 'hover:bg-gray-50' : ''}
                                    `}
                                >
                                    <div className="flex flex-col items-center">
                                        <span className={`text-xs md:text-sm font-medium
                                            ${hasLeave ? 'text-indigo-700 font-semibold' : 'text-gray-700'}
                                        `}>
                                            {day}
                                        </span>
                                        {hasLeave && (
                                            <div className="mt-1 flex flex-wrap items-center justify-center gap-0.5">
                                                {leavesOnDate.slice(0, 3).map((leave, i) => (
                                                    <div
                                                        key={i}
                                                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${leave.status === 'approved' ? 'bg-green-500' :
                                                                leave.status === 'pending' ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                            }`}
                                                        title={`${leave.emp_name} - ${leave.leave_name} (${leave.status})`}
                                                    />
                                                ))}
                                                {leavesOnDate.length > 3 && (
                                                    <span className="text-[8px] md:text-[10px] text-gray-500 font-medium">
                                                        +{leavesOnDate.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Approved</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] md:text-xs text-gray-600">Rejected</span>
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-500 ml-auto">
                        Click on highlighted dates to see leave details
                    </span>
                </div>
            </div>

            {/* Action Modal (Approve/Reject) */}
            {showActionModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-full ${actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
                                    }`}>
                                    {actionType === 'approve' ? (
                                        <ThumbsUp className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <ThumbsDown className="w-6 h-6 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedRequest.emp_name} - {selectedRequest.leave_name}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Duration:</span> {selectedRequest.from_date} to {selectedRequest.to_date} ({selectedRequest.days} days)
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Reason:</span> {selectedRequest.reason}
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {actionType === 'approve' ? 'Add Comments (Optional)' : 'Reason for Rejection *'}
                                </label>
                                <textarea
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder={actionType === 'approve' ? 'Add any comments...' : 'Please provide a reason for rejection...'}
                                    value={actionComment}
                                    onChange={(e) => setActionComment(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowActionModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleActionSubmit}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${actionType === 'approve'
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                >
                                    {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Leave Request Details</h3>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-4">
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {/* Request Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Request ID</p>
                                    <p className="font-medium">{selectedRequest.id}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Applied On</p>
                                    <p className="font-medium">{selectedRequest.applied_on}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Employee</p>
                                    <p className="font-medium">{selectedRequest.emp_name}</p>
                                    <p className="text-xs text-gray-500">{selectedRequest.emp_code}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="font-medium">{selectedRequest.department}</p>
                                    <p className="text-xs text-gray-500">{selectedRequest.designation}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Leave Type</p>
                                    <p className="font-medium">{selectedRequest.leave_name}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Duration</p>
                                    <p className="font-medium">{selectedRequest.days} days</p>
                                    <p className="text-xs text-gray-500">{selectedRequest.from_date} to {selectedRequest.to_date}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Reporting Manager</p>
                                    <p className="font-medium">{selectedRequest.reporting_manager}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">Contact Number</p>
                                    <p className="font-medium">{selectedRequest.contact_number}</p>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Reason for Leave</h4>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{selectedRequest.reason}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Address During Leave</h4>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">{selectedRequest.address}</p>
                                </div>
                            </div>

                            {/* Documents */}
                            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Documents</h4>
                                    <div className="space-y-2">
                                        {selectedRequest.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm">{doc}</span>
                                                <button className="ml-auto text-indigo-600 hover:text-indigo-800">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Approval/Rejection Info */}
                            {(selectedRequest.approved_by || selectedRequest.rejected_by) && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        {selectedRequest.status === 'approved' ? 'Approval' : 'Rejection'} Details
                                    </h4>
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            {selectedRequest.status === 'approved' ? 'Approved by:' : 'Rejected by:'}
                                        </span>{' '}
                                        {selectedRequest.approved_by || selectedRequest.rejected_by}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Date:</span>{' '}
                                        {selectedRequest.approved_on || selectedRequest.rejected_on}
                                    </p>
                                    {selectedRequest.comments && (
                                        <p className="text-sm mt-1">
                                            <span className="font-medium">Comments:</span> {selectedRequest.comments}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons for Pending Requests */}
                            {selectedRequest.status === 'pending' && (
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleReject(selectedRequest);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleApprove(selectedRequest);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Approve
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Date Leave Details Modal */}
            {showDateLeaves && selectedDate && dateLeaveDetails.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Leaves on {selectedDate}</h3>
                                    <p className="text-sm text-gray-500">{dateLeaveDetails.length} employee(s) on leave</p>
                                </div>
                                <button
                                    onClick={() => setShowDateLeaves(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <XCircle className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {dateLeaveDetails.map((leave, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{leave.emp_name}</p>
                                                <p className="text-xs text-gray-500">{leave.department} - {leave.designation}</p>
                                            </div>
                                            <StatusBadge status={leave.status} />
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                            <div>
                                                <span className="text-gray-500">Leave Type:</span>
                                                <p className="font-medium">{leave.leave_name}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Duration:</span>
                                                <p className="font-medium">{leave.days} days</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {leave.from_date} to {leave.to_date}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowDateLeaves(false);
                                                setSelectedRequest(leave);
                                                setShowDetailsModal(true);
                                            }}
                                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setShowDateLeaves(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaveApproval;