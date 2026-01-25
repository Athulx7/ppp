import { ChevronRight, Cloud, Gift, Moon, Sun } from 'lucide-react';
import React from 'react'

function Greetings() {

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

    const upcomingHolidays = [
        { date: "25 Dec", name: "Christmas", daysToGo: 3 },
    ];
    return (
        <>
            <div className="flex flex-col lg:flex-row justify-between gap-4 md:gap-6 mb-6">
                <div className="flex-1">
                    <div className={`rounded-2xl ${bgGradient} p-4 md:p-5 relative overflow-hidden min-h-[160px]`}>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`${iconBg} p-2 rounded-full`}>
                                    {greetingIcon}
                                </div>
                                <span className={`${textColor} font-medium`}>
                                    {greeting}
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                Hello, <span className="text-indigo-600">{userName}</span>
                                <span className="text-2xl md:text-3xl ml-2">👋</span>
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                Welcome back! Here's what's happening today.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="rounded-xl shadow-sm p-4 md:p-5 h-full">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                                    <Gift className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-gray-900">Upcoming Holidays</h3>
                            </div>
                            <span className="text-xs text-gray-500">
                                {upcomingHolidays.length} days
                            </span>
                        </div>

                        <div className="">
                            {upcomingHolidays.map((holiday, index) => (
                                <div key={index} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="text-center min-w-[45px]">
                                            <div className="text-sm font-bold text-gray-900">{holiday.date.split(' ')[0]}</div>
                                            <div className="text-xs text-gray-500">{holiday.date.split(' ')[1]}</div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm truncate">{holiday.name}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {holiday.daysToGo} {holiday.daysToGo === 1 ? 'day' : 'days'} to go
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Greetings
