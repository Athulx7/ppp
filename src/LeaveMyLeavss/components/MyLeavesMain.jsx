import { BarChart, Heart, History, PieChart, Sun, Award, Clock, MinusCircle, User, CheckCircle, Loader, XCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import MyLeaveOverView from "./MyLeaveOverView";
import MyLeaveHistory from "./MyLeaveHistory";
import MyLeaveAnalytics from "./MyLeaveAnalytics";

function MyLeavesMain({ isLoading, setIsLoading }) {
    const [selectedTab, setSelectedTab] = useState('overview');
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
            hex: '#3b82f6',
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
            hex: '#10b981',
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
            hex: '#8b5cf6',
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
            hex: '#f59e0b',
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
            hex: '#6b7280',
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
            hex: '#ec4899',
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
            hex: '#6366f1',
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

    // Calculate leave statistics (feeds the Analytics tab)
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

    // ---------- Overview tab: derived / dynamic data ----------

    // Hero stats computed live from leaveBalance instead of hardcoded numbers
    const overviewStats = useMemo(() => {
        const totalAvailable = leaveBalance.reduce((sum, item) => sum + item.available, 0);
        const totalUsed = leaveBalance.reduce((sum, item) => sum + item.used, 0);
        const totalPending = leaveBalance.reduce((sum, item) => sum + item.pending, 0);
        const totalAllocated = leaveBalance.reduce((sum, item) => sum + item.total, 0);
        const utilizationRate = totalAllocated > 0 ? Math.round((totalUsed / totalAllocated) * 100) : 0;
        return { totalAvailable, totalUsed, totalPending, totalAllocated, utilizationRate };
    }, [leaveBalance]);

    // Upcoming leaves, nearest first
    const sortedUpcomingLeaves = useMemo(() => {
        return [...upcomingLeaves].sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
    }, [upcomingLeaves]);

    // Holidays still ahead of today, nearest first (past holidays drop off automatically)
    const upcomingHolidays = useMemo(() => {
        const today = new Date(new Date().toDateString());
        return holidays
            .filter(h => new Date(h.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [holidays]);

    // Most recently applied requests, regardless of the order they arrive in
    const recentActivity = useMemo(() => {
        return [...leaveHistory]
            .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on))
            .slice(0, 3);
    }, [leaveHistory]);

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
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto scrollbar">
                    <button
                        onClick={() => setSelectedTab('overview')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'overview'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <PieChart className="w-3 h-3 md:w-4 md:h-4" />
                        Overview
                    </button>

                    <button
                        onClick={() => setSelectedTab('history')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'history'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <History className="w-3 h-3 md:w-4 md:h-4" />
                        Leave History
                    </button>

                    <button
                        onClick={() => setSelectedTab('analytics')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'analytics'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <BarChart className="w-3 h-3 md:w-4 md:h-4" />
                        Analytics
                    </button>
                </div>
                {selectedTab === 'overview' && (
                    <MyLeaveOverView
                        leaveBalance={leaveBalance}
                        leaveTypes={leaveTypes}
                        holidays={holidays}
                        sortedUpcomingLeaves={sortedUpcomingLeaves}
                        upcomingHolidays={upcomingHolidays}
                        recentActivity={recentActivity}
                    />)}

                {selectedTab === 'history' && (
                    <MyLeaveHistory
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        years={years}
                        months={months}
                        filteredHistory={filteredHistory}
                        historyColumns={historyColumns}
                    />)}
                {selectedTab === 'analytics' && (
                    <MyLeaveAnalytics
                        leaveBalance={leaveBalance}
                        leaveTypes={leaveTypes}
                        barChartData={barChartData}
                        pieChartData={pieChartData}
                        leaveStats={leaveStats}
                    />)}

            </div>
        </>
    )
}
export default MyLeavesMain
