import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, Clock, User, Briefcase, FileText, CheckCircle,
    XCircle, AlertCircle, ChevronRight, Download, Eye,
    Filter, Search, Award, Info, HelpCircle, Loader,
    MinusCircle, PlusCircle, TrendingUp, PieChart,
    BarChart, Sun, Cloud, Umbrella, Heart, Gift,
    ChevronLeft, ChevronRight as ChevronRightIcon,
    Building, Users, CalendarDays, Clock3, History
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function MyLeaves() {
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
        profile_pic: null
    });

    // State for different views
    const [selectedTab, setSelectedTab] = useState('overview'); // 'overview', 'history', 'calendar', 'analytics'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Data states
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [upcomingLeaves, setUpcomingLeaves] = useState([]);
    const [leaveStats, setLeaveStats] = useState({});
    const [holidays, setHolidays] = useState([]);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showLeaveDetails, setShowLeaveDetails] = useState(false);
    const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);

    // Year options
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
    }));

    // Month options
    const months = [
        { value: '', label: 'All Months' },
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Leave types with details
    const leaveTypes = [
        {
            code: 'CL',
            name: 'Casual Leave',
            icon: <Sun className="w-5 h-5" />,
            color: 'bg-blue-100 text-blue-800',
            gradient: 'from-blue-500 to-blue-600',
            lightBg: 'bg-blue-50',
            borderColor: 'border-blue-200',
            description: 'For urgent matters, personal work'
        },
        {
            code: 'SL',
            name: 'Sick Leave',
            icon: <Heart className="w-5 h-5" />,
            color: 'bg-green-100 text-green-800',
            gradient: 'from-green-500 to-green-600',
            lightBg: 'bg-green-50',
            borderColor: 'border-green-200',
            description: 'Medical emergencies, health issues'
        },
        {
            code: 'EL',
            name: 'Earned Leave',
            icon: <Award className="w-5 h-5" />,
            color: 'bg-purple-100 text-purple-800',
            gradient: 'from-purple-500 to-purple-600',
            lightBg: 'bg-purple-50',
            borderColor: 'border-purple-200',
            description: 'Accumulated leave'
        },
        {
            code: 'CO',
            name: 'Compensatory Off',
            icon: <Clock className="w-5 h-5" />,
            color: 'bg-orange-100 text-orange-800',
            gradient: 'from-orange-500 to-orange-600',
            lightBg: 'bg-orange-50',
            borderColor: 'border-orange-200',
            description: 'For working on holidays'
        },
        {
            code: 'LWP',
            name: 'Leave Without Pay',
            icon: <MinusCircle className="w-5 h-5" />,
            color: 'bg-gray-100 text-gray-800',
            gradient: 'from-gray-500 to-gray-600',
            lightBg: 'bg-gray-50',
            borderColor: 'border-gray-200',
            description: 'Unpaid leave'
        },
        {
            code: 'ML',
            name: 'Maternity Leave',
            icon: <Heart className="w-5 h-5" />,
            color: 'bg-pink-100 text-pink-800',
            gradient: 'from-pink-500 to-pink-600',
            lightBg: 'bg-pink-50',
            borderColor: 'border-pink-200',
            description: 'Maternity leave'
        },
        {
            code: 'PL',
            name: 'Paternity Leave',
            icon: <User className="w-5 h-5" />,
            color: 'bg-indigo-100 text-indigo-800',
            gradient: 'from-indigo-500 to-indigo-600',
            lightBg: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            description: 'Paternity leave'
        }
    ];

    // Dummy leave balance data
    useEffect(() => {
        const dummyBalance = [
            {
                leave_code: 'CL',
                leave_name: 'Casual Leave',
                total: 12,
                used: 4,
                pending: 1,
                available: 7,
                carry_forward: 2,
                expiring_on: '2026-12-31',
                color: 'blue'
            },
            {
                leave_code: 'SL',
                leave_name: 'Sick Leave',
                total: 10,
                used: 5,
                pending: 0,
                available: 5,
                carry_forward: 0,
                expiring_on: null,
                color: 'green'
            },
            {
                leave_code: 'EL',
                leave_name: 'Earned Leave',
                total: 18,
                used: 6,
                pending: 2,
                available: 10,
                carry_forward: 8,
                expiring_on: '2025-12-31',
                color: 'purple'
            },
            {
                leave_code: 'CO',
                leave_name: 'Compensatory Off',
                total: 2,
                used: 0,
                pending: 0,
                available: 2,
                carry_forward: 2,
                expiring_on: '2026-06-30',
                color: 'orange'
            },
            {
                leave_code: 'LWP',
                leave_name: 'Leave Without Pay',
                total: 0,
                used: 0,
                pending: 0,
                available: 0,
                carry_forward: 0,
                expiring_on: null,
                color: 'gray'
            }
        ];
        setLeaveBalance(dummyBalance);
    }, []);

    // Dummy leave history data
    useEffect(() => {
        const dummyHistory = [
            {
                id: 'LR001',
                leave_type: 'CL',
                leave_name: 'Casual Leave',
                from_date: '2026-02-15',
                to_date: '2026-02-17',
                days: 3,
                reason: 'Family function',
                status: 'approved',
                applied_on: '2026-02-10',
                approved_by: 'Michael Chen',
                approved_on: '2026-02-11',
                comments: 'Approved',
                contact_number: '9876543210'
            },
            {
                id: 'LR002',
                leave_type: 'SL',
                leave_name: 'Sick Leave',
                from_date: '2026-02-05',
                to_date: '2026-02-06',
                days: 2,
                reason: 'Viral fever',
                status: 'approved',
                applied_on: '2026-02-05',
                approved_by: 'Michael Chen',
                approved_on: '2026-02-05',
                comments: 'Take care',
                contact_number: '9876543210'
            },
            {
                id: 'LR003',
                leave_type: 'EL',
                leave_name: 'Earned Leave',
                from_date: '2026-03-01',
                to_date: '2026-03-05',
                days: 5,
                reason: 'Vacation',
                status: 'pending',
                applied_on: '2026-02-20',
                contact_number: '9876543210'
            },
            {
                id: 'LR004',
                leave_type: 'CL',
                leave_name: 'Casual Leave',
                from_date: '2026-01-10',
                to_date: '2026-01-12',
                days: 3,
                reason: 'Personal work',
                status: 'rejected',
                applied_on: '2026-01-05',
                rejected_by: 'Michael Chen',
                rejected_on: '2026-01-06',
                comments: 'Team already has 3 members on leave',
                contact_number: '9876543210'
            },
            {
                id: 'LR005',
                leave_type: 'CO',
                leave_name: 'Compensatory Off',
                from_date: '2026-02-25',
                to_date: '2026-02-26',
                days: 2,
                reason: 'Comp off for Sunday work',
                status: 'approved',
                applied_on: '2026-02-18',
                approved_by: 'Michael Chen',
                approved_on: '2026-02-19',
                comments: 'Approved',
                contact_number: '9876543210'
            },
            {
                id: 'LR006',
                leave_type: 'SL',
                leave_name: 'Sick Leave',
                from_date: '2026-01-20',
                to_date: '2026-01-22',
                days: 3,
                reason: 'Medical checkup',
                status: 'approved',
                applied_on: '2026-01-19',
                approved_by: 'Michael Chen',
                approved_on: '2026-01-19',
                comments: 'Get well soon',
                contact_number: '9876543210'
            }
        ];
        setLeaveHistory(dummyHistory);
        setFilteredHistory(dummyHistory);
    }, []);

    // Dummy upcoming leaves
    useEffect(() => {
        const dummyUpcoming = [
            {
                id: 'UP001',
                leave_type: 'EL',
                leave_name: 'Earned Leave',
                from_date: '2026-03-01',
                to_date: '2026-03-05',
                days: 5,
                status: 'approved',
                reason: 'Vacation'
            },
            {
                id: 'UP002',
                leave_type: 'CL',
                leave_name: 'Casual Leave',
                from_date: '2026-03-10',
                to_date: '2026-03-10',
                days: 1,
                status: 'pending',
                reason: 'Personal work'
            }
        ];
        setUpcomingLeaves(dummyUpcoming);
    }, []);

    // Dummy holidays
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const dummyHolidays = [
            { date: `${currentYear}-01-26`, name: 'Republic Day', type: 'national' },
            { date: `${currentYear}-08-15`, name: 'Independence Day', type: 'national' },
            { date: `${currentYear}-10-02`, name: 'Gandhi Jayanti', type: 'national' },
            { date: `${currentYear}-11-12`, name: 'Diwali', type: 'festival' },
            { date: `${currentYear}-12-25`, name: 'Christmas', type: 'festival' }
        ];
        setHolidays(dummyHolidays);
    }, []);

    // Calculate leave statistics
    useEffect(() => {
        const totalLeaves = leaveBalance.reduce((sum, item) => sum + item.total, 0);
        const totalUsed = leaveBalance.reduce((sum, item) => sum + item.used, 0);
        const totalPending = leaveBalance.reduce((sum, item) => sum + item.pending, 0);
        const totalAvailable = leaveBalance.reduce((sum, item) => sum + item.available, 0);

        const utilizationRate = ((totalUsed / totalLeaves) * 100).toFixed(1);

        // Monthly trend data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyLeaves = months.map((_, index) => {
            const month = String(index + 1).padStart(2, '0');
            return leaveHistory.filter(l => l.from_date?.startsWith(`2026-${month}`)).length;
        });

        setLeaveStats({
            totalLeaves,
            totalUsed,
            totalPending,
            totalAvailable,
            utilizationRate,
            monthlyLeaves,
            averagePerMonth: (totalUsed / 12).toFixed(1),
            mostUsedLeave: leaveBalance.reduce((max, item) => item.used > max.used ? item : max, leaveBalance[0]),
            leastUsedLeave: leaveBalance.reduce((min, item) => item.used < min.used ? item : min, leaveBalance[0])
        });
    }, [leaveBalance, leaveHistory]);

    // Filter history based on search and filters
    useEffect(() => {
        let filtered = leaveHistory;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => req.status === statusFilter);
        }

        if (selectedYear) {
            filtered = filtered.filter(req => req.from_date?.startsWith(selectedYear));
        }

        if (selectedMonth) {
            filtered = filtered.filter(req => req.from_date?.includes(`-${selectedMonth}-`));
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(req =>
                req.leave_name.toLowerCase().includes(query) ||
                req.reason.toLowerCase().includes(query) ||
                req.id.toLowerCase().includes(query)
            );
        }

        setFilteredHistory(filtered);
    }, [leaveHistory, statusFilter, selectedYear, selectedMonth, searchQuery]);

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
        return leaveHistory.filter(l =>
            (l.status === 'approved' || l.status === 'pending') &&
            dateStr >= l.from_date && dateStr <= l.to_date
        );
    };

    const handleDateClick = (day) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        const leaves = getLeavesForDate(dateStr);
        if (leaves.length > 0) {
            setSelectedDate(dateStr);
            setSelectedLeaveDetails(leaves);
            setShowLeaveDetails(true);
        }
    };

    // Check if date has leave
    const hasLeave = (dateStr) => {
        return leaveHistory.some(l =>
            (l.status === 'approved' || l.status === 'pending') &&
            dateStr >= l.from_date && dateStr <= l.to_date
        );
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
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };

    // History table columns
    const historyColumns = [
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
        },
        {
            header: "Approved By",
            accessor: "approved_by",
            cell: row => row.approved_by || '—'
        }
    ];

    // Chart data
    const barChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Leaves Taken',
                data: leaveStats.monthlyLeaves || [],
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
            }
        ]
    };

    const pieChartData = {
        labels: leaveBalance.map(l => l.leave_name),
        datasets: [
            {
                data: leaveBalance.map(l => l.used),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#6b7280', '#ec4899', '#6366f1'
                ]
            }
        ]
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="p-3 md:p-2 lg:p-2 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Employee Self Service', to: '/ess' },
                    { label: 'My Leaves' }
                ]}
                title="My Leaves"
                description="View your leave balance, history, and analytics"
            />

            {/* Main Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-4 md:mb-6">
                <div className="flex flex-wrap p-2 gap-1 border-b border-b-gray-300 overflow-x-auto">
                    <button
                        onClick={() => setSelectedTab('overview')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'overview'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <PieChart className="w-3 h-3 md:w-4 md:h-4" />
                        Overview
                    </button>
                    <button
                        onClick={() => setSelectedTab('history')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'history'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <History className="w-3 h-3 md:w-4 md:h-4" />
                        Leave History
                    </button>
                    <button
                        onClick={() => setSelectedTab('analytics')}
                        className={`px-3 md:px-4 py-2 font-medium text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 rounded-lg transition-all ${selectedTab === 'analytics'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <BarChart className="w-3 h-3 md:w-4 md:h-4" />
                        Analytics
                    </button>
                </div>

                {/* Tab Content */}
                <div className="">
                    {/* Overview Tab */}
                    {selectedTab === 'overview' && (
                        <div className="space-y-6 p-4">
                            {/* Leave Balance Cards */}
                            <div>
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                    {leaveBalance.map(item => {
                                        const leaveType = leaveTypes.find(l => l.code === item.leave_code);
                                        return (
                                            <div key={item.leave_code} className={`border rounded-lg p-3 md:p-4 ${leaveType?.borderColor}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className={`p-2 rounded-lg ${leaveType?.color}`}>
                                                        {leaveType?.icon}
                                                    </div>
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                        {item.used}/{item.total} used
                                                    </span>
                                                </div>
                                                <h4 className="font-medium text-gray-900 text-sm md:text-base">{item.leave_name}</h4>

                                                <div className="grid grid-cols-3 gap-2 text-center my-3">
                                                    <div>
                                                        <div className="text-lg md:text-xl font-bold text-gray-900">{item.total}</div>
                                                        <div className="text-xs text-gray-500">Total</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg md:text-xl font-bold text-indigo-600">{item.available}</div>
                                                        <div className="text-xs text-gray-500">Available</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-lg md:text-xl font-bold text-orange-600">{item.pending}</div>
                                                        <div className="text-xs text-gray-500">Pending</div>
                                                    </div>
                                                </div>

                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                                    <div
                                                        className={`h-1.5 rounded-full bg-${item.color}-600`}
                                                        style={{ width: `${(item.used / item.total) * 100}%` }}
                                                    />
                                                </div>

                                                {item.carry_forward > 0 && (
                                                    <p className="text-xs text-green-600 mt-2">
                                                        ✓ {item.carry_forward} days carried forward
                                                    </p>
                                                )}
                                                {item.expiring_on && (
                                                    <p className="text-xs text-orange-600 mt-1">
                                                        ⚠️ Expires on {item.expiring_on}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Upcoming Leaves & Holidays */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                                {/* Upcoming Leaves */}
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                                        <h4 className="font-medium text-gray-900">Upcoming Leaves</h4>
                                    </div>
                                    <div className="p-4">
                                        {upcomingLeaves.length > 0 ? (
                                            <div className="space-y-3">
                                                {upcomingLeaves.map(leave => (
                                                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${leaveTypes.find(l => l.code === leave.leave_type)?.color
                                                                }`}>
                                                                {leaveTypes.find(l => l.code === leave.leave_type)?.icon}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{leave.leave_name}</p>
                                                                <p className="text-xs text-gray-500">{leave.from_date} to {leave.to_date} • {leave.days} days</p>
                                                            </div>
                                                        </div>
                                                        <StatusBadge status={leave.status} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">No upcoming leaves</p>
                                        )}
                                    </div>
                                </div>

                                {/* Upcoming Holidays */}
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                                        <h4 className="font-medium text-gray-900">Upcoming Holidays</h4>
                                    </div>
                                    <div className="p-4">
                                        {holidays.length > 0 ? (
                                            <div className="space-y-3">
                                                {holidays.map((holiday, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-red-100 rounded-lg">
                                                                <Gift className="w-4 h-4 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{holiday.name}</p>
                                                                <p className="text-xs text-gray-500">{holiday.date}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                            {holiday.type}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">No upcoming holidays</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                                <div className="space-y-3">
                                    {leaveHistory.slice(0, 3).map(leave => (
                                        <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${leaveTypes.find(l => l.code === leave.leave_type)?.color
                                                    }`}>
                                                    {leaveTypes.find(l => l.code === leave.leave_type)?.icon}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{leave.leave_name}</p>
                                                    <p className="text-xs text-gray-500">{leave.from_date} to {leave.to_date} • {leave.days} days</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={leave.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {selectedTab === 'history' && (
                        <div>
                            {/* Filters */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 p-3">

                                <CommonDropDown
                                    label=""
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={[
                                        { label: 'All Status', value: 'all' },
                                        { label: 'Approved', value: 'approved' },
                                        { label: 'Pending', value: 'pending' },
                                        { label: 'Rejected', value: 'rejected' },
                                        { label: 'Cancelled', value: 'cancelled' }
                                    ]}
                                    placeholder="Filter by Status"
                                />

                                <CommonDropDown
                                    label=""
                                    value={selectedYear}
                                    onChange={setSelectedYear}
                                    options={years}
                                    placeholder="Select Year"
                                />

                                <CommonDropDown
                                    label=""
                                    value={selectedMonth}
                                    onChange={setSelectedMonth}
                                    options={months}
                                    placeholder="Select Month"
                                />
                            </div>

                                    <CommonTable
                                        columns={historyColumns}
                                        data={filteredHistory}
                                        itemsPerPage={10}
                                        showSearch={false}
                                        showPagination={true}
                                    />
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {selectedTab === 'analytics' && (
                        <div className="space-y-6 p-4">
                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-300 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Monthly Leave Trend</h4>
                                    <div className="h-64">
                                        <Bar
                                            data={barChartData}
                                            options={{
                                                maintainAspectRatio: false,
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        display: false
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-300 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Leave Distribution</h4>
                                    <div className="h-64">
                                        <Pie
                                            data={pieChartData}
                                            options={{
                                                maintainAspectRatio: false,
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom'
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-1">Average per Month</p>
                                    <p className="text-2xl font-bold text-gray-900">{leaveStats.averagePerMonth} days</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-1">Most Used Leave</p>
                                    <p className="text-lg font-bold text-gray-900">{leaveStats.mostUsedLeave?.leave_name}</p>
                                    <p className="text-xs text-gray-500">{leaveStats.mostUsedLeave?.used} days used</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-1">Least Used Leave</p>
                                    <p className="text-lg font-bold text-gray-900">{leaveStats.leastUsedLeave?.leave_name}</p>
                                    <p className="text-xs text-gray-500">{leaveStats.leastUsedLeave?.used} days used</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-500 mb-1">Utilization Rate</p>
                                    <p className="text-2xl font-bold text-indigo-600">{leaveStats.utilizationRate}%</p>
                                </div>
                            </div>

                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                                    <h4 className="font-medium text-gray-900">Leave Balance Summary</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Leave Type</th>
                                                <th className="px-4 py-2 text-right">Total</th>
                                                <th className="px-4 py-2 text-right">Used</th>
                                                <th className="px-4 py-2 text-right">Pending</th>
                                                <th className="px-4 py-2 text-right">Available</th>
                                                <th className="px-4 py-2 text-right">Carry Forward</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-300">
                                            {leaveBalance.map(item => (
                                                <tr key={item.leave_code} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypes.find(l => l.code === item.leave_code)?.color
                                                            }`}>
                                                            {item.leave_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">{item.total}</td>
                                                    <td className="px-4 py-2 text-right">{item.used}</td>
                                                    <td className="px-4 py-2 text-right">{item.pending}</td>
                                                    <td className="px-4 py-2 text-right font-semibold text-green-600">{item.available}</td>
                                                    <td className="px-4 py-2 text-right">{item.carry_forward}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Leave Details Modal */}
            {showLeaveDetails && selectedLeaveDetails && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 md:p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-b-gray-300 flex justify-between items-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                Leaves on {selectedDate}
                            </h3>
                            <button
                                onClick={() => setShowLeaveDetails(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-4 md:p-6 space-y-3">
                            {selectedLeaveDetails.map((leave, index) => (
                                <div key={leave.id || index} className="border border-gray-300 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${leaveTypes.find(l => l.code === leave.leave_type)?.color
                                                }`}>
                                                {leaveTypes.find(l => l.code === leave.leave_type)?.icon}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{leave.leave_name}</p>
                                                <p className="text-xs text-gray-500">{leave.reason}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={leave.status} />
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {leave.from_date} to {leave.to_date} • {leave.days} days
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 md:px-6 py-3 border-t border-t-gray-300 flex justify-end">
                            <button
                                onClick={() => setShowLeaveDetails(false)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
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

export default MyLeaves;