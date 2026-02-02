import React, { useEffect, useState } from 'react';
import hrmsIllustration from '../assets/hrmsillustatrion.png';
import { Link, useNavigate } from 'react-router-dom';

function MainMenu({ onClose }) {

    const navigate = useNavigate()
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const [activeCategory, setActiveCategory] = useState("All Master");

    const HRMS_MENU = [
        {
            category: "All Master",
            items: ["Hierarchy Master", "Division Master", "Designation Master", "Department Master", "Location Master"],
            url : "/admin/master/101"
        },
        {
            category: "HR Module",
            items: ["Employee Onboarding", "Leave Application", "Attendance", "Recruitment", "Training"]
        },
        {
            category: "Leave Management",
            items: [
                "Leave Applications",
                "Leave Approval",
                "Leave Balance",
                "Leave Policy",
                "Leave Calendar",
                "Leave Reports"
            ]
        },
        {
            category: "Payroll Management",
            items: [
                "Salary Processing",
                "Salary Components",
                "Salary Structure",
                "Payroll Run",
                "Payslip Generation",
                "Statutory Compliance"
            ]
        },
        {
            category: "Claims & Advances",
            items: [
                "Advance Requests",
                "Reimbursements",
                "Loan Management",
                "Claim Approval",
                "Expense Claims"
            ]
        },
        {
            category: "Reports",
            items: ["HR Reports", "Payroll Reports", "Attendance Reports", "CTC Reports", "Compliance Reports"]
        },
        {
            category: "Operational",
            items: [
                "TP Template",
                "RPS Submission",
                "Doctor Request Entry",
                "Candidate Request Entry"
            ]
        }
    ];

    return (
        <div
            className="fixed top-0 overflow-y-auto scrollbar right-0 z-999 bottom-0  bg-white text-indigo-600"
        >
            <button
                className="absolute cursor-pointer top-6 right-6 w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10"
                onClick={onClose}
            >
                ✕
            </button>

            <div className="flex flex-col lg:flex-row h-full px-4 md:px-8 lg:px-16 py-8 md:py-12">
                <div className="w-full lg:w-1/4 lg:pr-8 mb-6 lg:mb-0">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{/* {activeCategory} */} </h2>
                    <div className="space-y-2">
                        {HRMS_MENU.map(menu => (
                            <button
                                key={menu.category}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeCategory === menu.category
                                    ? "bg-white/20 font-bold shadow-lg"
                                    : "opacity-80 hover:opacity-100 hover:bg-white/10"
                                    }`}
                                onClick={() => setActiveCategory(menu.category)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{menu.category}</span>
                                    <span className={activeCategory === menu.category ? "opacity-100" : "opacity-0"}>→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white"> {/* {activeCategory} */}</h2>
                    <div className="max-h-[60vh] overflow-y-auto scrollbar  pr-2">
                        <div className="space-y-3">
                            {HRMS_MENU
                                .find(m => m.category === activeCategory)
                                ?.items.map((item, index) => (
                                    <div
                                        key={item}
                                        className="group cursor-pointer bg-white/5 rounded-lg p-4 transition-all hover:translate-x-1"
                                        onClick={() => console.log(`Navigating to: ${item}`)}
                                    >
                                        <div className="flex items-start">
                                            <div className="shrink-0 w-2 h-2 bg-white/50 rounded-full mr-3 mt-2"></div>
                                            <Link to={'/admin/master/101'} className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg transition-colors">{item}</span>
                                                    <span className="text-white/50  transition-colors opacity-0 group-hover:opacity-100">
                                                        →
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-sm opacity-70">
                                                    Manage {item.toLowerCase()} and related settings
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex w-1/4 items-center justify-center opacity-90">
                    <div className="relative w-full h-full max-h-[500px]">
                        <img
                            src={hrmsIllustration}
                            alt="HRMS Illustration"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden absolute bottom-0 left-0 right-0 h-32 opacity-20">
                <img
                    src={hrmsIllustration}
                    alt="HRMS Illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-800 to-transparent"></div>
            </div>

            {/* <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:bottom-8 text-center lg:text-right">
                <p className="text-sm opacity-70">HR Management System • v2.0</p>
                <p className="text-xs opacity-50 mt-1">Navigate through all HR modules</p>
            </div> */}
        </div>
    );
}

export default MainMenu;