import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react'

function CalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateEvents, setSelectedDateEvents] = useState([]);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const eventsData = {
        '2026-01-25': [
            { type: 'holiday', title: 'Christmas', color: 'bg-red-100 text-red-800' }
        ],
        '2026-01-15': [
            { type: 'birthday', title: 'John\'s Birthday', color: 'bg-pink-100 text-pink-800' },
            { type: 'deadline', title: 'Project Submission', color: 'bg-orange-100 text-orange-800' }
        ],
        '2026-01-20': [
            { type: 'deadline', title: 'Tax Filing', color: 'bg-orange-100 text-orange-800' }
        ],
        '2026-01-05': [
            { type: 'meeting', title: 'Team Meeting', color: 'bg-blue-100 text-blue-800' }
        ],
        '2026-01-10': [
            { type: 'event', title: 'Company Party', color: 'bg-green-100 text-green-800' }
        ]
    };

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
        loadEventsForDate(today.getDate())
    }

    const getDayEvents = (day) => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return eventsData[dateKey] || [];
    };

    const loadEventsForDate = (day) => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDateEvents(eventsData[dateKey] || []);
    };

    const handleDateClick = (day) => {
        const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newSelectedDate);
        loadEventsForDate(day);
    };

    const formatSelectedDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return selectedDate.toLocaleDateString('en-US', options);
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-5">
                {selectedDateEvents.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-900">
                                Events for {formatSelectedDate()}
                            </h3>
                            <button
                                onClick={() => setSelectedDateEvents([])}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="space-y-2">
                            {selectedDateEvents.map((event, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${event.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                                    <span className={`px-2 py-1 rounded text-sm ${event.color}`}>
                                        {event.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                                    onClick={() => handleDateClick(day)}
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
                                        {events.length > 0 && (
                                            <div className="flex gap-1">
                                                {events.map((event, idx) => (
                                                    <div key={idx} className={`w-2 h-2 rounded-full ${event.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {events.length > 0 && (
                                        <div className="mt-1 space-y-1">
                                            {events.slice(0, 2).map((event, idx) => (
                                                <div key={idx} className="text-xs truncate">
                                                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${event.color.replace('bg-', 'bg-').replace('-100', '-500')}`}></span>
                                                    {event.title}
                                                </div>
                                            ))}
                                            {events.length > 2 && (
                                                <div className="text-xs text-gray-500">
                                                    +{events.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Holidays</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CalendarSection