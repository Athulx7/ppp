import React, { useState } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Gift, Coffee,
    Cake, Home, Briefcase, Heart, GraduationCap, Award, Bell, Clock,
    AlertCircle, CheckCircle, X, Plus, Filter, Download, Printer,
    CalendarDays, Sun, Moon, Building, User, MapPin
} from 'lucide-react';

function MyCalendarEntry() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', 'day'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);

    // Get current month and year
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    // Navigation functions
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    // Generate days in month
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        
        // Previous month days
        for (let i = 0; i < startingDay; i++) {
            const prevDate = new Date(year, month, -i);
            days.unshift({
                date: prevDate.getDate(),
                month: 'prev',
                fullDate: prevDate,
                isToday: false,
                isSelected: false
            });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push({
                date: i,
                month: 'current',
                fullDate: date,
                isToday: date.toDateString() === today.toDateString(),
                isSelected: date.toDateString() === selectedDate.toDateString()
            });
        }

        return days;
    };

    // Sample data - Company holidays
    const companyHolidays = [
        { date: '2024-12-25', title: 'Christmas', type: 'holiday', color: 'bg-red-100 text-red-800' },
        { date: '2024-01-01', title: 'New Year', type: 'holiday', color: 'bg-blue-100 text-blue-800' },
        { date: '2024-01-26', title: 'Republic Day', type: 'holiday', color: 'bg-green-100 text-green-800' },
        { date: '2024-03-25', title: 'Holi', type: 'holiday', color: 'bg-pink-100 text-pink-800' },
        { date: '2024-08-15', title: 'Independence Day', type: 'holiday', color: 'bg-orange-100 text-orange-800' },
        { date: '2024-10-02', title: 'Gandhi Jayanti', type: 'holiday', color: 'bg-teal-100 text-teal-800' },
    ];

    // Sample data - Team birthdays
    const teamBirthdays = [
        { date: '2024-12-15', name: 'John Smith', department: 'Engineering', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2024-12-20', name: 'Sarah Johnson', department: 'HR', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2024-12-28', name: 'Mike Chen', department: 'Sales', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2025-01-05', name: 'Lisa Wang', department: 'Marketing', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2025-01-15', name: 'Raj Kumar', department: 'Operations', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
    ];

    // Sample data - Work anniversaries
    const workAnniversaries = [
        { date: '2024-12-10', name: 'David Lee', department: 'Engineering', years: 5, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
        { date: '2024-12-18', name: 'Maria Garcia', department: 'HR', years: 3, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
        { date: '2024-12-22', name: 'Alex Turner', department: 'Sales', years: 2, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
        { date: '2025-01-08', name: 'Priya Sharma', department: 'Marketing', years: 4, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
    ];

    // Sample data - Employee leaves (for current user)
    const myLeaves = [
        { date: '2024-12-20', dateEnd: '2024-12-22', type: 'Annual Leave', status: 'approved', color: 'bg-blue-100 text-blue-800' },
        { date: '2024-12-25', dateEnd: '2024-12-25', type: 'Public Holiday', status: 'holiday', color: 'bg-red-100 text-red-800' },
        { date: '2025-01-10', dateEnd: '2025-01-10', type: 'Medical Leave', status: 'pending', color: 'bg-amber-100 text-amber-800' },
    ];

    // Sample data - Important company dates
    const importantDates = [
        { date: '2024-12-31', title: 'Year-End Review', type: 'meeting', color: 'bg-indigo-100 text-indigo-800' },
        { date: '2025-01-15', title: 'Quarterly Meeting', type: 'meeting', color: 'bg-indigo-100 text-indigo-800' },
        { date: '2025-01-25', title: 'Payroll Processing', type: 'deadline', color: 'bg-red-100 text-red-800' },
        { date: '2025-01-30', title: 'Tax Filing Deadline', type: 'deadline', color: 'bg-red-100 text-red-800' },
        { date: '2025-02-10', title: 'Team Building Event', type: 'event', color: 'bg-green-100 text-green-800' },
    ];

    // Team leaves (visible to HR and Admin)
    const teamLeaves = [
        { date: '2024-12-18', name: 'Raj Kumar', department: 'Engineering', type: 'Sick Leave', status: 'approved' },
        { date: '2024-12-19', name: 'Maria Garcia', department: 'HR', type: 'Annual Leave', status: 'approved' },
        { date: '2024-12-20', name: 'Alex Turner', department: 'Sales', type: 'WFH', status: 'approved' },
        { date: '2024-12-23', name: 'David Lee', department: 'Operations', type: 'Emergency Leave', status: 'pending' },
    ];

    // Get events for a specific date
    const getEventsForDate = (dateString) => {
        const dateStr = dateString.split('T')[0];
        const events = [];

        // Check company holidays
        const holiday = companyHolidays.find(h => h.date === dateStr);
        if (holiday) events.push(holiday);

        // Check birthdays
        const birthday = teamBirthdays.find(b => b.date === dateStr);
        if (birthday) events.push(birthday);

        // Check anniversaries
        const anniversary = workAnniversaries.find(a => a.date === dateStr);
        if (anniversary) events.push(anniversary);

        // Check important dates
        const important = importantDates.find(i => i.date === dateStr);
        if (important) events.push(important);

        // Check my leaves
        const myLeave = myLeaves.find(l => l.date === dateStr);
        if (myLeave) events.push(myLeave);

        return events;
    };

    // Get upcoming events (next 7 days)
    const getUpcomingEvents = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const allEvents = [
            ...companyHolidays.map(e => ({ ...e, category: 'Holiday', icon: Home })),
            ...teamBirthdays.map(e => ({ ...e, category: 'Birthday', icon: Cake })),
            ...workAnniversaries.map(e => ({ ...e, category: 'Work Anniversary', icon: Award })),
            ...importantDates.map(e => ({ ...e, category: 'Company Event', icon: Building })),
            ...myLeaves.map(e => ({ ...e, category: 'My Leave', icon: CalendarDays })),
        ];

        return allEvents
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= today && eventDate <= nextWeek;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 10);
    };

    const days = getDaysInMonth();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const upcomingEvents = getUpcomingEvents();

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Company Calendar</h1>
                            <p className="text-gray-600">Important dates, leaves, celebrations and company events</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Today
                            </button>
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-gray-50 border-r border-gray-300"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium min-w-[180px] text-center">
                                    {currentMonth} {currentYear}
                                </span>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-gray-50 border-l border-gray-300"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex bg-white border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setView('month')}
                                    className={`px-3 py-1.5 text-sm font-medium ${view === 'month' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                >
                                    Month
                                </button>
                                <button
                                    onClick={() => setView('week')}
                                    className={`px-3 py-1.5 text-sm font-medium ${view === 'week' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setView('day')}
                                    className={`px-3 py-1.5 text-sm font-medium ${view === 'day' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                >
                                    Day
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                            <span className="text-xs text-gray-600">Holiday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-pink-100 border border-pink-300 rounded"></div>
                            <span className="text-xs text-gray-600">Birthday</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                            <span className="text-xs text-gray-600">Anniversary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                            <span className="text-xs text-gray-600">Leave</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div>
                            <span className="text-xs text-gray-600">Meeting</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                            <span className="text-xs text-gray-600">Event</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar View */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-gray-200">
                                {dayNames.map(day => (
                                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7">
                                {days.map((day, index) => {
                                    const dateStr = day.fullDate.toISOString().split('T')[0];
                                    const events = getEventsForDate(dateStr);
                                    
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedDate(day.fullDate)}
                                            className={`min-h-[100px] p-2 border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${day.month === 'prev' || day.month === 'next' ? 'bg-gray-50' : ''} ${day.isToday ? 'bg-blue-50' : ''} ${day.isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-sm font-medium ${day.month === 'current' ? 'text-gray-900' : 'text-gray-400'} ${day.isToday ? 'text-blue-600' : ''}`}>
                                                    {day.date}
                                                </span>
                                                {day.month === 'current' && events.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {events.slice(0, 2).map((event, i) => (
                                                            <div key={i} className="w-2 h-2 rounded-full bg-current" style={{
                                                                color: event.color.split(' ')[1]
                                                            }}></div>
                                                        ))}
                                                        {events.length > 2 && (
                                                            <span className="text-xs text-gray-400">+{events.length - 2}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Events for the day */}
                                            <div className="space-y-1">
                                                {events.slice(0, 2).map((event, i) => (
                                                    <div
                                                        key={i}
                                                        className={`text-xs px-2 py-1 rounded truncate ${event.color}`}
                                                        title={`${event.title || event.name || event.type}: ${event.description || ''}`}
                                                    >
                                                        {event.title || event.name || event.type}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected Date Details */}
                        {selectedDate && (
                            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h3>
                                <div className="space-y-3">
                                    {getEventsForDate(selectedDate.toISOString()).map((event, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                                            <div className={`p-2 rounded-lg ${event.color.split(' ')[0]} ${event.color.split(' ')[1].replace('text', 'text')}`}>
                                                {event.type === 'birthday' ? <Cake size={18} /> :
                                                 event.type === 'anniversary' ? <Award size={18} /> :
                                                 event.type === 'holiday' ? <Home size={18} /> :
                                                 event.type === 'meeting' ? <Briefcase size={18} /> :
                                                 event.type === 'event' ? <Users size={18} /> :
                                                 <CalendarDays size={18} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">{event.title || event.name || event.type}</span>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${event.color}`}>
                                                        {event.type?.charAt(0).toUpperCase() + event.type?.slice(1)}
                                                    </span>
                                                </div>
                                                {event.department && (
                                                    <p className="text-sm text-gray-600 mt-1">{event.department}</p>
                                                )}
                                                {event.years && (
                                                    <p className="text-sm text-gray-600 mt-1">{event.years} years at company</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {getEventsForDate(selectedDate.toISOString()).length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No events scheduled for this day</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Upcoming Events */}
                    <div className="space-y-6">
                        {/* Upcoming Events */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Bell size={18} />
                                    Upcoming Events (Next 7 Days)
                                </h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-3">
                                {upcomingEvents.map((event, index) => (
                                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded ${event.color.split(' ')[0]}`}>
                                                    <event.icon size={16} className={event.color.split(' ')[1]} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{event.title || event.name || event.type}</p>
                                                    <p className="text-xs text-gray-500">{event.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team Leaves (Visible to HR/Admin) */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Users size={18} />
                                    Team Leaves This Week
                                </h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                                    View All
                                </button>
                            </div>
                            <div className="space-y-3">
                                {teamLeaves.map((leave, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{leave.name}</p>
                                            <p className="text-sm text-gray-500">{leave.department}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {leave.status}
                                            </span>
                                            <p className="text-sm text-gray-600 mt-1">{leave.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Leaves */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <CalendarDays size={18} />
                                    My Leaves
                                </h3>
                                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                                    Apply Leave
                                </button>
                            </div>
                            <div className="space-y-3">
                                {myLeaves.map((leave, index) => (
                                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{leave.type}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(leave.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    {leave.dateEnd !== leave.date && ` - ${new Date(leave.dateEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : leave.status === 'holiday' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {leave.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Celebration Statistics */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 mb-4">This Month Celebrations</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-pink-50 rounded-lg">
                                    <div className="text-2xl font-bold text-pink-600">{teamBirthdays.filter(b => new Date(b.date).getMonth() === currentDate.getMonth()).length}</div>
                                    <div className="text-sm text-gray-600">Birthdays</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{workAnniversaries.filter(a => new Date(a.date).getMonth() === currentDate.getMonth()).length}</div>
                                    <div className="text-sm text-gray-600">Anniversaries</div>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{companyHolidays.filter(h => new Date(h.date).getMonth() === currentDate.getMonth()).length}</div>
                                    <div className="text-sm text-gray-600">Holidays</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{importantDates.filter(i => new Date(i.date).getMonth() === currentDate.getMonth()).length}</div>
                                    <div className="text-sm text-gray-600">Events</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyCalendarEntry;