import React, { useState } from 'react';
import { Calendar, Users, DollarSign, Clock, TrendingUp, Bell, Gift, CalendarDays, Download, MoreVertical, ChevronLeft, ChevronRight, Plus, Moon, Sun, Cloud } from 'lucide-react';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';

function AdminDashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const hrMetrics = [
        { title: "Total Employees", value: "124", icon: Users, color: "bg-blue-500", change: "+5.2%" },
        { title: "Monthly Payroll", value: "$124,580", icon: DollarSign, color: "bg-green-500", change: "+8.1%" },
        { title: "Active Leaves", value: "18", icon: CalendarDays, color: "bg-orange-500", change: "-2.3%" },
        { title: "Avg. Attendance", value: "94.2%", icon: TrendingUp, color: "bg-purple-500", change: "+1.4%" },
    ];

    const celebrations = [
        { name: "John Doe", date: "Today", type: "birthday", role: "Software Engineer" },
        { name: "Sarah Smith", date: "Tomorrow", type: "work-anniversary", role: "HR Manager" },
        { name: "Mike Johnson", date: "Dec 28", type: "birthday", role: "Sales Executive" },
        { name: "Lisa Brown", date: "Dec 29", type: "work-anniversary", role: "Marketing Head" },
    ];

    const importantDates = [
        { title: "Tax Filing Deadline", date: "Dec 31, 2023", priority: "high", type: "deadline" },
        { title: "Quarterly Review Meeting", date: "Jan 15, 2024", priority: "medium", type: "meeting" },
        { title: "Payroll Processing", date: "Jan 25, 2024", priority: "high", type: "process" },
        { title: "Team Building Event", date: "Jan 30, 2024", priority: "low", type: "event" },
    ];

    const recentActivities = [
        { action: "New employee onboarded", person: "Alex Turner", time: "2 hours ago" },
        { action: "Leave request approved", person: "Maria Garcia", time: "4 hours ago" },
        { action: "Payroll processed", person: "System", time: "1 day ago" },
        { action: "Performance review completed", person: "David Lee", time: "2 days ago" },
    ];

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        const today = new Date()
        setCurrentDate(today)
        setSelectedDate(today)
    }

    const getDayEvents = (day) => {
        const events = [];
        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;

        if (day === 15 || day === 25) {
            events.push({ type: 'birthday', count: day === 15 ? 2 : 1 });
        }

        if (day === 5 || day === 20) {
            events.push({ type: 'deadline', count: 1 });
        }

        return events;
    };

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const userName = "User Name";

    let greeting = "";
    let greetingIcon = null;
    let bgGradient = "";
    let textColor = "";
    let iconBg = "";

    if (currentHour < 12) {
        greeting = "Good Morning";
        greetingIcon = <Sun className="w-5 h-5" />;
        bgGradient = "from-amber-100 to-orange-50";
        textColor = "text-amber-800";
        iconBg = "bg-amber-200";
    } else if (currentHour < 17) {
        greeting = "Good Afternoon";
        greetingIcon = <Sun className="w-5 h-5" />;
        bgGradient = "from-orange-100 to-yellow-50";
        textColor = "text-orange-800";
        iconBg = "bg-orange-200";
    } else if (currentHour < 20) {
        greeting = "Good Evening";
        greetingIcon = <Cloud className="w-5 h-5" />;
        bgGradient = "from-indigo-100 to-purple-50";
        textColor = "text-indigo-800";
        iconBg = "bg-indigo-200";
    } else {
        greeting = "Good Night";
        greetingIcon = <Moon className="w-5 h-5" />;
        bgGradient = "from-blue-100 to-indigo-50";
        textColor = "text-blue-800";
        iconBg = "bg-blue-200";
    }

    const upcomingHoliday = {
        date: "17 Jul Mon",
        name: "Ashura",
        daysLeft: 3
    };

    const [isLoading, setIsLoading] = useState(false);


    return (
        <div className=" bg-gray-50 min-h-screen">
            {isLoading && <LoadingSpinner fullScreen message="Loading..." />}
            <div className=" bg-gray-50">
                <div className="">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className={`flex-1 rounded-2xl ${bgGradient} p-3 relative overflow-hidden`}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`${iconBg} p-2 rounded-full`}>
                                        {greetingIcon}
                                    </div>
                                    <span className={`${textColor} font-medium`}>
                                        {greeting}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    Hello, <span className="text-indigo-600">{userName}</span>
                                    <span className="text-3xl md:text-4xl ml-2">👋</span>
                                </h1>
                                <p className="text-gray-600">
                                    Welcome back! Here's what's happening today.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {hrMetrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                                <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.change} from last month
                                </p>
                            </div>
                            <div className={`${metric.color} p-3 rounded-lg`}>
                                <metric.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium"
                            >
                                Today
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                                    <div key={`empty-${index}`} className="h-20"></div>
                                ))}
                                {daysArray.map(day => {
                                    const events = getDayEvents(day);
                                    const isToday = day === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();
                                    const isSelected = day === selectedDate.getDate() &&
                                        currentDate.getMonth() === selectedDate.getMonth() &&
                                        currentDate.getFullYear() === selectedDate.getFullYear();

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                            className={`h-20 p-2 border rounded-lg text-left transition-colors hover:bg-gray-50
                        ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                        ${isSelected ? 'bg-indigo-50 border-indigo-300' : ''}
                      `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : isSelected ? 'text-indigo-600' : 'text-gray-900'
                                                    }`}>
                                                    {day}
                                                </span>
                                                <div className="flex gap-1">
                                                    {events.map((event, idx) => (
                                                        <div key={idx} className={`w-2 h-2 rounded-full ${event.type === 'birthday' ? 'bg-pink-500' : 'bg-orange-500'
                                                            }`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {events.map((event, idx) => (
                                                    <div key={idx} className="text-xs truncate">
                                                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${event.type === 'birthday' ? 'bg-pink-500' : 'bg-orange-500'
                                                            }`}></span>
                                                        {event.count} {event.type === 'birthday' ? 'Birthday' : 'Deadline'}
                                                    </div>
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                                <span>Birthdays & Anniversaries</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span>Important Deadlines</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Today</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Important Dates</h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {importantDates.map((date, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${date.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            date.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{date.title}</p>
                                            <p className="text-sm text-gray-500">{date.date}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${date.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        date.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {date.type.charAt(0).toUpperCase() + date.type.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Gift size={20} />
                                Upcoming Celebrations
                            </h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {celebrations.map((celebration, index) => (
                                <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${celebration.type === 'birthday' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {celebration.type === 'birthday' ? <Gift size={18} /> : <CalendarDays size={18} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{celebration.name}</p>
                                            <p className="text-sm text-gray-500">{celebration.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{celebration.date}</p>
                                            <p className="text-xs text-gray-500 capitalize">{celebration.type.replace('-', ' ')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Bell size={20} />
                                Recent Activities
                            </h2>
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock size={16} className="text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900">{activity.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500">by {activity.person}</span>
                                            <span className="text-xs text-gray-400">•</span>
                                            <span className="text-sm text-gray-500">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-5 text-white">
                        <h3 className="text-lg font-bold mb-3">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Pending Leave Requests</span>
                                <span className="font-bold">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Expiring Documents</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Upcoming Interviews</span>
                                <span className="font-bold">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Open Positions</span>
                                <span className="font-bold">3</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard