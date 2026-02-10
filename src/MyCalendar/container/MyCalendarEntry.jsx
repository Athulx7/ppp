import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users,
    Cake, Home, Briefcase, Award, Bell, X, Plus,
    CalendarDays, User, UserPlus, Check, Trash2, Building,
    BellPlus, BellRing
} from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';

function MyCalendarEntry() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showAddReminderPopup, setShowAddReminderPopup] = useState(false);
    const [reminderSettings, setReminderSettings] = useState(false)

    const [reminders, setReminders] = useState([
        {
            id: 1,
            title: 'Complete monthly report',
            date: '2026-01-15',
            time: '10:00',
            type: 'personal',
            priority: 'high',
            note: 'Submit before EOD',
            createdBy: 'currentUser',
            forUserId: null,
            status: 'pending'
        },
        {
            id: 2,
            title: 'Team weekly sync',
            date: '2026-01-16',
            time: '14:00',
            type: 'team',
            priority: 'medium',
            note: 'Prepare agenda',
            createdBy: 'currentUser',
            forUserId: 'team',
            status: 'pending'
        },
        {
            id: 3,
            title: 'Performance review reminder',
            date: '2026-01-20',
            time: '09:00',
            type: 'employee',
            priority: 'high',
            note: 'Review with John Smith',
            createdBy: 'hrUser',
            forUserId: 'john123',
            status: 'pending'
        },
        {
            id: 4,
            title: 'Submit timesheet',
            date: '2026-01-25',
            time: '17:00',
            type: 'personal',
            priority: 'medium',
            note: 'Weekly timesheet submission',
            createdBy: 'currentUser',
            forUserId: null,
            status: 'pending'
        }
    ]);

    const [newReminder, setNewReminder] = useState({
        title: '',
        time: '09:00',
        type: 'personal',
        priority: 'medium',
        note: '',
        forUserId: null
    });

    const [teamMembers] = useState([
        { id: 'emp1', name: 'John Smith', role: 'Developer' },
        { id: 'emp2', name: 'Sarah Johnson', role: 'Designer' },
        { id: 'emp3', name: 'Mike Chen', role: 'QA' },
        { id: 'emp4', name: 'Lisa Wong', role: 'Manager' },
    ]);
    const userRole = localStorage.getItem('userRole') || 'employee';
    const isManager = userRole === 'admin' || userRole === 'hr' || userRole === 'payroll_manager';
    const currentUserId = 'currentUser';

    const isDateTodayOrPast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate <= today;
    };

    const handleAddReminder = () => {
        if (!newReminder.title.trim()) return;

        const newRem = {
            id: Date.now(),
            ...newReminder,
            date: selectedDate.toISOString().split('T')[0],
            createdBy: currentUserId,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        setReminders([...reminders, newRem]);
        setNewReminder({
            title: '',
            time: '09:00',
            type: 'personal',
            priority: 'medium',
            note: '',
            forUserId: null
        });
        setShowAddReminderPopup(false);
        alert('Reminder added successfully!');
    };

    const handleDeleteReminder = (id) => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            setReminders(reminders.filter(r => r.id !== id));
        }
    };

    const handleMarkComplete = (id) => {
        setReminders(reminders.map(r =>
            r.id === id ? { ...r, status: 'completed' } : r
        ));
    };

    const getRemindersForDate = (dateString) => {
        const dateStr = dateString.split('T')[0];
        return reminders.filter(r => r.date === dateStr && r.status === 'pending');
    };

    const getUpcomingReminders = () => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        return reminders
            .filter(r => {
                const reminderDate = new Date(r.date);
                return reminderDate >= today && reminderDate <= nextWeek && r.status === 'pending';
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getRemindersForTeam = () => {
        if (!isManager) return [];
        return reminders.filter(r =>
            (r.type === 'team' || r.type === 'employee') &&
            r.createdBy === currentUserId &&
            r.status === 'pending'
        );
    };

    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (!isDateTodayOrPast(date)) {
            setReminderSettings(true);
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
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

    const companyHolidays = [
        { date: '2025-12-25', title: 'Christmas', type: 'holiday', color: 'bg-red-100 text-red-800' },
        { date: '2026-01-01', title: 'New Year', type: 'holiday', color: 'bg-blue-100 text-blue-800' },
        { date: '2026-01-26', title: 'Republic Day', type: 'holiday', color: 'bg-green-100 text-green-800' },
    ];

    const teamBirthdays = [
        { date: '2026-01-15', name: 'John Smith', department: 'Engineering', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2026-01-20', name: 'Sarah Johnson', department: 'HR', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
        { date: '2026-01-28', name: 'Mike Chen', department: 'Sales', type: 'birthday', color: 'bg-pink-100 text-pink-800' },
    ];

    const workAnniversaries = [
        { date: '2026-01-10', name: 'David Lee', department: 'Engineering', years: 5, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
        { date: '2026-01-18', name: 'Maria Garcia', department: 'HR', years: 3, type: 'anniversary', color: 'bg-purple-100 text-purple-800' },
    ];

    const myLeaves = [
        { date: '2026-01-20', dateEnd: '2026-01-22', type: 'Annual Leave', status: 'approved', color: 'bg-blue-100 text-blue-800' },
        { date: '2026-01-25', dateEnd: '2026-01-25', type: 'Public Holiday', status: 'holiday', color: 'bg-red-100 text-red-800' },
        { date: '2026-02-10', dateEnd: '2026-02-10', type: 'Medical Leave', status: 'pending', color: 'bg-amber-100 text-amber-800' },
    ];

    const importantDates = [
        { date: '2026-01-31', title: 'Year-End Review', type: 'meeting', color: 'bg-indigo-100 text-indigo-800' },
        { date: '2026-02-15', title: 'Quarterly Meeting', type: 'meeting', color: 'bg-indigo-100 text-indigo-800' },
        { date: '2026-01-25', title: 'Payroll Processing', type: 'deadline', color: 'bg-red-100 text-red-800' },
    ];

    const teamLeaves = [
        { date: '2026-01-18', name: 'Raj Kumar', department: 'Engineering', type: 'Sick Leave', status: 'approved' },
        { date: '2026-01-19', name: 'Maria Garcia', department: 'HR', type: 'Annual Leave', status: 'approved' },
        { date: '2026-01-20', name: 'Alex Turner', department: 'Sales', type: 'WFH', status: 'approved' },
    ];

    const getEventsForDate = (dateString) => {
        const dateStr = dateString.split('T')[0];
        const events = [];

        const holiday = companyHolidays.find(h => h.date === dateStr);
        if (holiday) events.push(holiday);

        const birthday = teamBirthdays.find(b => b.date === dateStr);
        if (birthday) events.push(birthday);

        const anniversary = workAnniversaries.find(a => a.date === dateStr);
        if (anniversary) events.push(anniversary);

        const important = importantDates.find(i => i.date === dateStr);
        if (important) events.push(important);

        const myLeave = myLeaves.find(l => l.date === dateStr);
        if (myLeave) events.push(myLeave);

        return events;
    };

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
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const days = getDaysInMonth();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const upcomingEvents = getUpcomingEvents();

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="mb-6">
                <BreadCrumb
                    headerName="My Calendar"
                    subcontent="Important dates, leaves, celebrations, reminders and company events"
                    buttonContent={reminderSettings ? (
                        <button
                            onClick={() => setShowAddReminderPopup(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <BellPlus size={16} />
                            Add Reminder for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </button>
                    ) : null}
                />

                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
                        <span className="text-xs text-gray-600">Holiday</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-pink-100 border border-pink-300 rounded"></div>
                        <span className="text-xs text-gray-600">Birthday</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-100 border border-purple-300 rounded"></div>
                        <span className="text-xs text-gray-600">Anniversary</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-100 border border-blue-300 rounded"></div>
                        <span className="text-xs text-gray-600">Leave</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-100 border border-yellow-300 rounded"></div>
                        <span className="text-xs text-gray-600">Reminder</span>
                    </div>
                </div>
            </div>

            {showAddReminderPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Add New Reminder</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        For {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAddReminderPopup(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <CommonInputField
                                    label="Reminder Title *"
                                    value={newReminder.title}
                                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                                    placeholder="E.g., Submit report, Team meeting, etc."
                                    required={true}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Time *
                                        </label>
                                        <input
                                            type="time"
                                            value={newReminder.time}
                                            onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority *
                                        </label>
                                        <CommonDropDown
                                            value={newReminder.priority}
                                            options={[
                                                { label: 'Low', value: 'low' },
                                                { label: 'Medium', value: 'medium' },
                                                { label: 'High', value: 'high' }
                                            ]}
                                            onChange={(value) => setNewReminder({ ...newReminder, priority: value })}
                                            placeholder="Select priority"
                                            required={true}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reminder Type *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewReminder({ ...newReminder, type: 'personal', forUserId: null })}
                                            className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center ${newReminder.type === 'personal' ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                                        >
                                            <User size={18} className="mb-1" />
                                            Personal
                                        </button>
                                        {isManager && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewReminder({ ...newReminder, type: 'team', forUserId: 'team' })}
                                                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center ${newReminder.type === 'team' ? 'bg-green-100 text-green-800 border-2 border-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                                                >
                                                    <Users size={18} className="mb-1" />
                                                    Team
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewReminder({ ...newReminder, type: 'employee', forUserId: null })}
                                                    className={`px-3 py-3 rounded-lg text-sm font-medium transition-colors flex flex-col items-center justify-center ${newReminder.type === 'employee' ? 'bg-purple-100 text-purple-800 border-2 border-purple-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'}`}
                                                >
                                                    <UserPlus size={18} className="mb-1" />
                                                    Employee
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {newReminder.type === 'employee' && isManager && (
                                    <CommonDropDown
                                        label="Select Employee *"
                                        value={newReminder.forUserId || ''}
                                        options={teamMembers.map(member => ({
                                            label: `${member.name} (${member.role})`,
                                            value: member.id
                                        }))}
                                        onChange={(value) => setNewReminder({ ...newReminder, forUserId: value })}
                                        placeholder="Select employee..."
                                        required={true}
                                    />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={newReminder.note}
                                        onChange={(e) => setNewReminder({ ...newReminder, note: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        rows="3"
                                        placeholder="Add additional notes..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleAddReminder}
                                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Save Reminder
                                    </button>
                                    <button
                                        onClick={() => setShowAddReminderPopup(false)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={goToToday}
                                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Today
                                    </button>
                                    <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                                        <button
                                            onClick={prevMonth}
                                            className="p-1.5 hover:bg-gray-50 border-r border-gray-300"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span className="px-3 py-1.5 text-sm font-medium min-w-[140px] text-center">
                                            {currentMonth} {currentYear}
                                        </span>
                                        <button
                                            onClick={nextMonth}
                                            className="p-1.5 hover:bg-gray-50 border-l border-gray-300"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex bg-white border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setView('month')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'month' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        Month
                                    </button>
                                    <button
                                        onClick={() => setView('week')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'week' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        Week
                                    </button>
                                    <button
                                        onClick={() => setView('day')}
                                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'day' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}
                                    >
                                        Day
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                            {dayNames.map(day => (
                                <div key={day} className="p-2 text-center text-xs font-medium text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7">
                            {days.map((day, index) => {
                                const dateStr = day.fullDate.toISOString().split('T')[0];
                                const events = getEventsForDate(dateStr);
                                const dateReminders = getRemindersForDate(dateStr);
                                const isPastOrToday = isDateTodayOrPast(day.fullDate);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateSelect(day.fullDate)}
                                        className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer transition-colors relative
                                            ${day.month === 'prev' || day.month === 'next' ? 'bg-gray-50' : ''} 
                                            ${day.isToday ? 'bg-blue-50' : ''} 
                                            ${day.isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50' : ''}
                                            ${isPastOrToday ? 'opacity-80' : 'hover:bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-medium ${day.month === 'current' ? 'text-gray-900' : 'text-gray-400'} ${day.isToday ? 'text-blue-600 font-bold' : ''}`}>
                                                {day.date}
                                            </span>
                                            {day.month === 'current' && (events.length > 0 || dateReminders.length > 0) && (
                                                <div className="flex gap-1">
                                                    {events.slice(0, 1).map((event, i) => (
                                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-current" style={{
                                                            color: event.color.split(' ')[1]
                                                        }}></div>
                                                    ))}
                                                    {dateReminders.length > 0 && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                    )}
                                                    {events.length + dateReminders.length > 2 && (
                                                        <span className="text-xs text-gray-400">+{events.length + dateReminders.length - 2}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-0.5">
                                            {dateReminders.slice(0, 1).map((reminder, i) => (
                                                <div
                                                    key={`rem-${i}`}
                                                    className="text-xs px-1.5 py-0.5 rounded truncate bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                    title={`Reminder: ${reminder.title}`}
                                                >
                                                    ⏰ {reminder.title}
                                                </div>
                                            ))}
                                            {events.slice(0, 2 - dateReminders.length).map((event, i) => (
                                                <div
                                                    key={i}
                                                    className={`text-xs px-1.5 py-0.5 rounded truncate border ${event.color}`}
                                                    title={`${event.title || event.name || event.type}`}
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

                    <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Users size={16} />
                                <span className="text-sm">Team Leaves This Month</span>
                            </h3>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                {teamLeaves.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {teamLeaves.map((leave, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="w-6 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold flex-shrink-0">
                                            {leave.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{leave.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{leave.department}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {leave.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(leave.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-sm">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </h3>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                                {getEventsForDate(selectedDate.toISOString()).length + getRemindersForDate(selectedDate.toISOString()).length} items
                            </span>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {getEventsForDate(selectedDate.toISOString()).length > 0 || getRemindersForDate(selectedDate.toISOString()).length > 0 ? (
                                <>
                                    {getRemindersForDate(selectedDate.toISOString()).map((reminder, index) => (
                                        <div key={`rem-${index}`} className="flex items-start gap-2 p-2 border border-yellow-200 bg-yellow-50 rounded-lg hover:bg-yellow-100">
                                            <div className="p-1.5 rounded bg-yellow-100 text-yellow-600">
                                                <Bell size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-gray-900 truncate">{reminder.title}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${reminder.priority === 'high' ? 'bg-red-100 text-red-800' : reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {reminder.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-600">{reminder.time}</span>
                                                    <span className="text-xs text-gray-400">•</span>
                                                    <span className="text-xs text-gray-600">
                                                        {reminder.type === 'personal' ? 'Personal' :
                                                            reminder.type === 'team' ? 'Team' :
                                                                'Employee'}
                                                    </span>
                                                </div>
                                                {reminder.note && (
                                                    <p className="text-xs text-gray-600 mt-1">{reminder.note}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleMarkComplete(reminder.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Mark as complete"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReminder(reminder.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete reminder"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {getEventsForDate(selectedDate.toISOString()).map((event, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className={`p-1.5 rounded ${event.color.split(' ')[0]} ${event.color.split(' ')[1].replace('text', 'text')}`}>
                                                {event.type === 'birthday' ? <Cake size={14} /> :
                                                    event.type === 'anniversary' ? <Award size={14} /> :
                                                        event.type === 'holiday' ? <Home size={14} /> :
                                                            event.type === 'meeting' ? <Briefcase size={14} /> :
                                                                <CalendarDays size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium text-gray-900 truncate">{event.title || event.name || event.type}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${event.color}`}>
                                                        {event.type?.charAt(0).toUpperCase() + event.type?.slice(1)}
                                                    </span>
                                                </div>
                                                {event.department && (
                                                    <p className="text-xs text-gray-600 mt-0.5 truncate">{event.department}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-3">
                                    <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500">No events or reminders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[300px] flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <BellRing size={16} />
                                <span className="text-sm">Upcoming Reminders</span>
                            </h3>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                                {getUpcomingReminders().length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {getUpcomingReminders().length > 0 ? (
                                getUpcomingReminders().map(reminder => (
                                    <div key={reminder.id} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div className={`p-1.5 rounded ${reminder.priority === 'high' ? 'bg-red-100 text-red-600' : reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Bell size={12} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <span>{new Date(reminder.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                        <span>•</span>
                                                        <span>{reminder.time}</span>
                                                        {reminder.type !== 'personal' && (
                                                            <>
                                                                <span>•</span>
                                                                <span className={`px-1 rounded ${reminder.type === 'team' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                                                    {reminder.type}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleMarkComplete(reminder.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Mark as complete"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReminder(reminder.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete reminder"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        {reminder.note && (
                                            <p className="text-xs text-gray-600 mt-1 pl-8">{reminder.note}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Bell className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500">No upcoming reminders</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-[250px] flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <CalendarDays size={16} />
                                <span className="text-sm">Upcoming Events</span>
                            </h3>
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                                {upcomingEvents.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, index) => (
                                    <div key={index} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded ${event.color.split(' ')[0]}`}>
                                                    <event.icon size={14} className={event.color.split(' ')[1]} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{event.title || event.name || event.type}</p>
                                                    <p className="text-xs text-gray-500">{event.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-medium text-gray-900">
                                                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500">No upcoming events</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-3">This Month Celebrations</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-pink-50 rounded-lg border border-pink-100">
                                <div className="text-lg font-bold text-pink-600">{teamBirthdays.filter(b => new Date(b.date).getMonth() === currentDate.getMonth()).length}</div>
                                <div className="text-xs text-gray-600">Birthdays</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded-lg border border-purple-100">
                                <div className="text-lg font-bold text-purple-600">{workAnniversaries.filter(a => new Date(a.date).getMonth() === currentDate.getMonth()).length}</div>
                                <div className="text-xs text-gray-600">Anniversaries</div>
                            </div>
                            <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100">
                                <div className="text-lg font-bold text-red-600">{companyHolidays.filter(h => new Date(h.date).getMonth() === currentDate.getMonth()).length}</div>
                                <div className="text-xs text-gray-600">Holidays</div>
                            </div>
                            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-lg font-bold text-blue-600">{importantDates.filter(i => new Date(i.date).getMonth() === currentDate.getMonth()).length}</div>
                                <div className="text-xs text-gray-600">Events</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyCalendarEntry;