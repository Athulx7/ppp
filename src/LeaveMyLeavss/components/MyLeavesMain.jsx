import { BarChart, Heart, History, PieChart, Sun, Award, Clock, MinusCircle, User, CheckCircle, Loader, XCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import MyLeaveOverView from "./MyLeaveOverView";
import MyLeaveHistory from "./MyLeaveHistory";
import MyLeaveAnalytics from "./MyLeaveAnalytics";
import { ApiCall } from "../../library/constants";

function MyLeavesMain({ isLoading, setIsLoading }) {
    const [selectedTab, setSelectedTab] = useState('overview');
    const [allMyLeaves, setAllMyLeaves] = useState([])

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

    useEffect(() => {
        getAllMyLeaveData()
    }, [])

    async function getAllMyLeaveData() {
        setIsLoading({ normal: true, spinner: false })
        try {
            const response = await ApiCall('GET', '/myleaves/getAllMyLeaves')
            console.log('myleaves response:', response)

            const resData = response?.data?.data?.data || response?.data?.data || response?.data || {}

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
                    upcoming: Number(item.upcoming_days ?? item.upcoming ?? 0),
                    available: Number(item.available_days ?? item.available ?? 0),
                    carry_forward: Number(item.carry_forward_days ?? item.carry_forward ?? 0),
                    expiring_on: item.carry_forward_expiry || item.expiring_on || null,
                    valid_from: item.valid_from,
                    valid_to: item.valid_to,
                    utilization_percentage: item.utilization_percentage
                }))
                setLeaveBalance(formattedBalance)
            }

            const history = resData.leaveHistory || resData.leave_history || resData.history
            if (Array.isArray(history)) {
                setLeaveHistory(history)
                setFilteredHistory(history)
            }

            const upcoming = resData.upcomingLeaves || resData.upcoming_leaves || resData.upcoming
            if (Array.isArray(upcoming)) {
                setUpcomingLeaves(upcoming)
            }

            const holidayList = resData.holidays || resData.holidayList || resData.holiday_list
            if (Array.isArray(holidayList)) {
                setHolidays(holidayList)
            }

            // Fetch leave history from dedicated history API
            fetchLeaveHistory()
        }
        catch (err) {
            console.error('Error fetching all my leaves data:', err)
        }
        setIsLoading({ normal: false, spinner: false })
    }

    async function fetchLeaveHistory(year = selectedYear, month = selectedMonth, status = statusFilter) {
        try {
            const params = new URLSearchParams()
            if (year) params.append('year', year)
            if (month) params.append('month', month)
            if (status && status !== 'all') params.append('status', status)

            const query = params.toString() ? `?${params.toString()}` : ''
            const response = await ApiCall('GET', `/myleaves/getLeaveHistory${query}`)
            const resData = response?.data?.data || response?.data || []
            if (Array.isArray(resData)) {
                setLeaveHistory(resData)
                setFilteredHistory(resData)
            }
        } catch (err) {
            console.warn('Dedicated leave history API error or not available:', err)
        }
    }

    async function fetchLeaveAnalytics(year = selectedYear) {
        try {
            const query = year ? `?year=${year}` : ''
            const response = await ApiCall('GET', `/myleaves/getLeaveAnalytics${query}`)
            const resData = response?.data?.data || response?.data
            if (resData) {
                if (resData.leaveStats) setLeaveStats(resData.leaveStats)
                if (Array.isArray(resData.leaveBalance) && resData.leaveBalance.length > 0) {
                    const formattedBalance = resData.leaveBalance.map(item => ({
                        id: item.id,
                        leave_type_id: item.leave_type_id,
                        leave_code: item.leave_code || item.LeaveTypeCode || '',
                        leave_name: item.leave_name || item.LeaveTypeName || '',
                        total: Number(item.total ?? item.allocated_days ?? 0),
                        used: Number(item.used ?? item.used_days ?? 0),
                        pending: Number(item.pending ?? item.pending_days ?? 0),
                        upcoming: Number(item.upcoming ?? item.upcoming_days ?? 0),
                        available: Number(item.available ?? item.available_days ?? 0),
                        carry_forward: Number(item.carry_forward ?? item.carry_forward_days ?? 0),
                        expiring_on: item.expiring_on || item.carry_forward_expiry || null
                    }))
                    setLeaveBalance(formattedBalance)
                }
            }
        } catch (err) {
            console.warn('Leave analytics API error:', err)
        }
    }

    // Dynamic Leave types metadata helper
    const leaveTypes = useMemo(() => {
        const defaultLeaveStyleMap = {
            CL: { icon: <Sun className="w-5 h-5" />, color: 'bg-blue-100 text-blue-800', gradient: 'from-blue-500 to-blue-600', lightBg: 'bg-blue-50', borderColor: 'border-blue-200', hex: '#3b82f6' },
            SL: { icon: <Heart className="w-5 h-5" />, color: 'bg-green-100 text-green-800', gradient: 'from-green-500 to-green-600', lightBg: 'bg-green-50', borderColor: 'border-green-200', hex: '#10b981' },
            EL: { icon: <Award className="w-5 h-5" />, color: 'bg-purple-100 text-purple-800', gradient: 'from-purple-500 to-purple-600', lightBg: 'bg-purple-50', borderColor: 'border-purple-200', hex: '#8b5cf6' },
            CO: { icon: <Clock className="w-5 h-5" />, color: 'bg-orange-100 text-orange-800', gradient: 'from-orange-500 to-orange-600', lightBg: 'bg-orange-50', borderColor: 'border-orange-200', hex: '#f59e0b' },
            LWP: { icon: <MinusCircle className="w-5 h-5" />, color: 'bg-gray-100 text-gray-800', gradient: 'from-gray-500 to-gray-600', lightBg: 'bg-gray-50', borderColor: 'border-gray-200', hex: '#6b7280' },
            ML: { icon: <Heart className="w-5 h-5" />, color: 'bg-pink-100 text-pink-800', gradient: 'from-pink-500 to-pink-600', lightBg: 'bg-pink-50', borderColor: 'border-pink-200', hex: '#ec4899' },
            PL: { icon: <User className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-800', gradient: 'from-indigo-500 to-indigo-600', lightBg: 'bg-indigo-50', borderColor: 'border-indigo-200', hex: '#6366f1' }
        };

        if (!leaveBalance || leaveBalance.length === 0) return [];

        return leaveBalance.map(item => {
            const code = (item.leave_code || '').toUpperCase();
            const style = defaultLeaveStyleMap[code] || {
                icon: <Award className="w-5 h-5" />,
                color: 'bg-indigo-100 text-indigo-800',
                gradient: 'from-indigo-500 to-indigo-600',
                lightBg: 'bg-indigo-50',
                borderColor: 'border-indigo-200',
                hex: '#6366f1'
            };

            return {
                code: item.leave_code,
                name: item.leave_name,
                description: item.description || `${item.leave_name} Policy`,
                ...style
            };
        });
    }, [leaveBalance]);

    // Calculate leave statistics (feeds the Analytics tab)
    useEffect(() => {
        if (!leaveBalance || leaveBalance.length === 0) {
            setLeaveStats({
                totalLeaves: 0,
                totalUsed: 0,
                totalPending: 0,
                totalAvailable: 0,
                utilizationRate: '0.0',
                monthlyLeaves: Array(12).fill(0),
                averagePerMonth: '0.0',
                mostUsedLeave: null,
                leastUsedLeave: null
            });
            return;
        }

        const totalLeaves = leaveBalance.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
        const totalUsed = leaveBalance.reduce((sum, item) => sum + (Number(item.used) || 0), 0);
        const totalPending = leaveBalance.reduce((sum, item) => sum + (Number(item.pending) || 0), 0);
        const totalAvailable = leaveBalance.reduce((sum, item) => sum + (Number(item.available) || 0), 0);

        const utilizationRate = totalLeaves > 0 ? ((totalUsed / totalLeaves) * 100).toFixed(1) : '0.0';

        // Monthly trend data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYearStr = selectedYear || new Date().getFullYear().toString();
        const monthlyLeaves = monthNames.map((_, index) => {
            const monthStr = String(index + 1).padStart(2, '0');
            return leaveHistory.filter(l => l.from_date?.startsWith(`${currentYearStr}-${monthStr}`)).length;
        });

        const mostUsed = leaveBalance.length > 0
            ? leaveBalance.reduce((max, item) => ((item.used || 0) > (max?.used || 0) ? item : max), leaveBalance[0])
            : null;

        const leastUsed = leaveBalance.length > 0
            ? leaveBalance.reduce((min, item) => ((item.used || 0) < (min?.used || 0) ? item : min), leaveBalance[0])
            : null;

        setLeaveStats({
            totalLeaves,
            totalUsed,
            totalPending,
            totalAvailable,
            utilizationRate,
            monthlyLeaves,
            averagePerMonth: (totalUsed / 12).toFixed(1),
            mostUsedLeave: mostUsed,
            leastUsedLeave: leastUsed
        });
    }, [leaveBalance, leaveHistory, selectedYear]);

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
                        onClick={() => {
                            setSelectedTab('overview');
                            getAllMyLeaveData();
                        }}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'overview'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <PieChart className="w-3 h-3 md:w-4 md:h-4" />
                        Overview
                    </button>

                    <button
                        onClick={() => {
                            setSelectedTab('history');
                            fetchLeaveHistory();
                        }}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${selectedTab === 'history'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <History className="w-3 h-3 md:w-4 md:h-4" />
                        Leave History
                    </button>

                    <button
                        onClick={() => {
                            setSelectedTab('analytics');
                            fetchLeaveAnalytics();
                        }}
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
