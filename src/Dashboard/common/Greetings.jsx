import { ChevronRight, Cloud, Gift, Moon, Sun, Building, Users, MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react';
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

    const companyInfo = {
        name: "Company Name",
        employees: "1,247",
        departments: "14",
        location: "location, loc",
        email: "hr@comapany.com",
        phone: "+1 (555) 123-4567",
        website: "www.company.com",
        founded: "2015",
        industry: "Technology & Software"
    };

    // Today's Company Stats
    const todaysStats = [
        { label: "Employees Present", value: "1,230", icon: Users, color: "bg-green-100 text-green-600" },
        { label: "On Leave", value: "17", icon: Calendar, color: "bg-amber-100 text-amber-600" },
        { label: "Departments", value: "14", icon: Building, color: "bg-blue-100 text-blue-600" },
    ];

    // Quick Company Contacts
    const companyContacts = [
        { type: "Location", value: companyInfo.location, icon: MapPin, color: "text-blue-600" },
        { type: "HR Email", value: companyInfo.email, icon: Mail, color: "text-purple-600" },
        { type: "Phone", value: companyInfo.phone, icon: Phone, color: "text-green-600" },
        { type: "Website", value: companyInfo.website, icon: Globe, color: "text-indigo-600" },
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
                            <p className="text-gray-600 text-sm md:text-base mb-4">
                                Welcome to <span className="font-semibold text-indigo-600">{companyInfo.name}</span> HRMS Portal
                            </p>
                            
                            <div className="flex items-center gap-4 flex-wrap">
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
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full -mr-6 -mb-6"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="rounded-xl shadow-sm p-4 md:p-5 h-full border border-gray-100">

                        <div className="space-y-3 mb-4">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{companyInfo.name}</h4>
                                <p className="text-sm text-gray-600">{companyInfo.industry}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                {companyContacts.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <div className={`p-1.5 rounded ${contact.color.replace('text', 'bg').replace('-600', '-100')}`}>
                                            <contact.icon className={`w-3.5 h-3.5 ${contact.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">{contact.type}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{contact.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Greetings
