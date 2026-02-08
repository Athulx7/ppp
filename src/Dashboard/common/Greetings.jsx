import { ChevronRight, Cloud, Gift, Moon, Sun, Building, Users, MapPin, Phone, Mail, Globe, Calendar, Clock, CheckCircle, UserCheck } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function Greetings() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const userName = "User Name";

    const userRole = JSON.parse(sessionStorage.getItem('user')).role_code || 'employee'

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

    const companyInfo = {
        name: "Company Name",
        location: "Location,locat",
        hremail: "hr@company.com",
        companyInfo: "www.company.com",
        companyMobile: "+1234567890"
    };

    const getWelcomeMessage = () => {
        switch (userRole) {
            case 'ADMIN':
                return `Welcome to Admin Portal of ${companyInfo.name} HRMS System`;
            case 'HR':
                return `Welcome to HR Portal of ${companyInfo.name} HRMS System`;
            case 'PAYROLL_MANAGER':
                return `Welcome to Payroll Portal of ${companyInfo.name} HRMS System`;
            default:
                return `Welcome to ${companyInfo.name} HRMS Portal`;
        }
    };

    const todaysStats = [
        {
            label: "Attendance Today",
            value: userRole === 'ADMIN' ? "Total: 320" : "92%",
            icon: UserCheck,
            color: "bg-green-100 text-green-600",
            action: userRole !== 'ADMIN' ? "markAttendance" : null
        },
        {
            label: userRole === 'ADMIN' ? "Avg. On Time" : "On Time",
            value: userRole === 'ADMIN' ? "89%" : "87%",
            icon: Clock,
            color: "bg-blue-100 text-blue-600"
        },
        {
            label: userRole === 'ADMIN' ? "Total On Leave" : "On Leave",
            value: userRole === 'ADMIN' ? "16" : "5%",
            icon: Calendar,
            color: "bg-amber-100 text-amber-600"
        },
    ];

    const isAttendanceMarked = localStorage.getItem('attendanceMarkedToday') === 'true';

    const handleMarkAttendance = () => {
        const currentDate = new Date().toDateString();
        const lastMarkedDate = localStorage.getItem('lastAttendanceDate');

        if (lastMarkedDate !== currentDate) {
            localStorage.setItem('attendanceMarkedToday', 'true');
            localStorage.setItem('lastAttendanceDate', currentDate);

            alert('Attendance marked successfully for today!');
            window.location.reload()
        } else {
            alert('Attendance already marked for today!');
        }
    };

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
                            <p className="text-gray-600 text-sm md:text-base mb-4">
                                {getWelcomeMessage()}
                            </p>

                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    {todaysStats.map((stat, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${stat.color.split(' ')[0]}`}>
                                                <stat.icon className={`w-4 h-4 ${stat.color.split(' ')[1]}`} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                                                <span className="text-xs text-gray-500 ml-1">{stat.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {userRole !== 'ADMIN' && todaysStats[0]?.action && (
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={handleMarkAttendance}
                                            disabled={isAttendanceMarked}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${isAttendanceMarked
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'}`}
                                        >
                                            {isAttendanceMarked ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Marked Today</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserCheck className="w-4 h-4" />
                                                    <span>Mark Attendance</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full -mr-6 -mb-6"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="rounded-xl shadow-sm p-4 md:p-5 h-full border border-gray-100 flex flex-col">
                        <div className="space-y-3 mb-4 flex-1">
                            <div>
                                <div className='flex justify-between'>
                                    <h4 className="text-lg font-bold text-gray-900">{companyInfo.name}</h4>
                                    <p className="text-sm text-gray-600">{companyInfo.location}</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p className="text-sm text-gray-600">{companyInfo.companyInfo}</p>
                                    <p className="text-sm text-gray-600">{companyInfo.hremail}</p>
                                </div>

                                <p className="text-sm text-end text-gray-600">{companyInfo.companyMobile}</p>
                            </div>
                        </div>

                        <Link
                            to="/attendance"
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg transition-all group border border-indigo-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h5 className="font-semibold text-gray-900">
                                        {userRole === 'ADMIN' ? 'Attendance Dashboard' : 'Attendance Tracking'}
                                    </h5>
                                    <p className="text-xs text-gray-600">
                                        {userRole === 'ADMIN'
                                            ? 'View company-wide attendance analytics'
                                            : 'View detailed attendance records'}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Greetings
