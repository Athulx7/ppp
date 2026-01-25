import React, { useState } from 'react';
function MainMenu({ onClose }) {
    const SIDEBAR_WIDTH = "80px"

    const [activeCategory, setActiveCategory] = useState("Operational")

    const HRMS_MENU = [
        {
            category: "All Master",
            items: ["Employee Master", "Division Master", "Designation Master"]
        },
        {
            category: "HR Module",
            items: ["Employee Onboarding", "Leave Application", "Attendance"]
        },
        {
            category: "Operational",
            items: [
                "TP Template",
                "RPS Submission",
                "Doctor Request Entry",
                "Candidate Request Entry"
            ]
        },
        {
            category: "Reports",
            items: ["HR Reports", "PRP & RPS Reports", "Sales Report"]
        }
    ]

    return (
        <div
            className="fixed top-0 right-0 bottom-0 z-50 bg-gradient-to-br from-blue-700 to-teal-400 text-white"
            style={{ left: SIDEBAR_WIDTH }}
        >

            <button
                className="absolute top-6 right-6 w-10 h-10 bg-white text-gray-700 rounded-full flex items-center justify-center"
                onClick={onClose}
            >
                ✕
            </button>

            <div className="flex h-full px-16 py-12">

                <div className="w-1/4 space-y-4">
                    {HRMS_MENU.map(menu => (
                        <div
                            key={menu.category}
                            className={`cursor-pointer ${activeCategory === menu.category
                                    ? "font-bold text-white"
                                    : "opacity-80"
                                }`}
                            onClick={() => setActiveCategory(menu.category)}
                        >
                            {menu.category} →
                        </div>
                    ))}
                </div>

                <div className="w-1/2">
                    <h2 className="text-xl font-semibold mb-6">
                        {activeCategory}
                    </h2>

                    <ul className="space-y-3">
                        {HRMS_MENU
                            .find(m => m.category === activeCategory)
                            ?.items.map(item => (
                                <li
                                    key={item}
                                    className="cursor-pointer hover:underline"
                                >
                                    {item}
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="w-1/4 flex items-center justify-center opacity-90">
                    {/* image / svg */}
                </div>

            </div>
        </div>
    )
}

export default MainMenu;