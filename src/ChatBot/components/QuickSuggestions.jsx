import React from "react"
import { Calendar, Clock, DollarSign, Users, AlertCircle, ShieldAlert, UserCheck, Briefcase } from "lucide-react"

const SUGGESTIONS_BY_ROLE = {
    EMPLOYEE: [
        { icon: AlertCircle, label: "My Pending Leaves", query: "How many leaves are pending for me?" },
        { icon: UserCheck, label: "My Reporting Manager", query: "Who is my reporting manager?" },
        { icon: Clock, label: "My Attendance Rates", query: "Show my attendance this month" },
        { icon: DollarSign, label: "My Latest Payslip", query: "Show my latest payslip" },
        { icon: Calendar, label: "Official Holidays", query: "What are the upcoming holidays?" }
    ],
    HR: [
        { icon: ShieldAlert, label: "Review Leave Requests", query: "Show all pending leave requests" },
        { icon: Users, label: "Department Headcount", query: "How many employees are in each department?" },
        { icon: Briefcase, label: "Sales Dept Employees", query: "List all employees in Sales" },
        { icon: Calendar, label: "Holidays Directory", query: "Show upcoming holidays" }
    ],
    ADMIN: [
        { icon: Briefcase, label: "Show Designations List", query: "Show designations in this company" },
        { icon: Users, label: "Company Headcounts", query: "How many employees are in each department?" },
        { icon: Briefcase, label: "Engineering Staff", query: "List all employees in Engineering" },
        { icon: Calendar, label: "Standard Holidays", query: "Show upcoming holidays" }
    ],
    MANAGER: [
        { icon: ShieldAlert, label: "Team Leave Requests", query: "Show pending leave requests from my team" },
        { icon: Users, label: "Department Directory", query: "List employees in my department" },
        { icon: Calendar, label: "Holidays List", query: "Show upcoming holidays" }
    ]
}

function QuickSuggestions({ role, sendMessage, isTyping }) {
    const list = SUGGESTIONS_BY_ROLE[role] || SUGGESTIONS_BY_ROLE.EMPLOYEE

    if (isTyping) return null

    return (
        <div className="px-6 py-2 bg-white flex flex-col shrink-0">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 select-none">
                Suggested Questions
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
                {list.map((s, idx) => {
                    const Icon = s.icon
                    return (
                        <button
                            key={idx}
                            onClick={() => sendMessage(s.query)}
                            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-full text-xs font-semibold text-gray-600 hover:text-indigo-700 transition-all select-none shadow-sm active:scale-95 shrink-0"
                        >
                            <Icon size={12} className="text-gray-400 group-hover:text-indigo-600 shrink-0" />
                            <span>{s.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default QuickSuggestions
