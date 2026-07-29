import React from "react"
import { MessageSquarePlus, MessageSquare, Calendar, Users, Briefcase, Clock, DollarSign, ShieldAlert, UserCheck, History, ArrowLeft, Trash2 } from "lucide-react"

const QUICK_TEMPLATES_BY_ROLE = {
    HR: [
        { icon: ShieldAlert, label: "Review Leave Requests", query: "Show all pending leave requests" },
        { icon: Users, label: "Department Headcount", query: "How many employees are in each department?" },
        { icon: Briefcase, label: "Sales Directory", query: "List all employees in Sales" }
    ],
    ADMIN: [
        { icon: Briefcase, label: "Show Designations List", query: "Show designations in this company" },
        { icon: Users, label: "Company Headcounts", query: "How many employees are in each department?" },
        { icon: Briefcase, label: "Engineering Directory", query: "List all employees in Engineering" }
    ],
    MANAGER: [
        { icon: ShieldAlert, label: "Team Leave Requests", query: "Show pending leave requests from my team" },
        { icon: Users, label: "Department Staff", query: "List employees in my department" }
    ],
    EMPLOYEE: [
        { icon: ShieldAlert, label: "My Leave Balance", query: "How many leaves are pending for me?" },
        { icon: UserCheck, label: "My Reporting Manager", query: "Who is my reporting manager?" },
        { icon: Clock, label: "My Attendance Rates", query: "Show my attendance this month" },
        { icon: DollarSign, label: "My Latest Payslip", query: "Show my latest payslip" }
    ]
}

function ChatSidebar({
    sessions,
    activeSessionId,
    switchSession,
    startNewChat,
    sendMessage,
    deleteSession,
    role,
    isMobile,
    onToggleSidebar
}) {
    const templates = QUICK_TEMPLATES_BY_ROLE[role] || QUICK_TEMPLATES_BY_ROLE.EMPLOYEE

    return (
        <div className="w-full md:w-80 border-r border-gray-200 bg-white flex flex-col h-full shrink-0 select-none">
            <div className="shrink-0 p-5 border-b border-gray-150 bg-slate-50/50 space-y-4">
                {isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={14} />
                        Back to Chat View
                    </button>
                )}

                <button
                    onClick={() => {
                        startNewChat()
                        if (isMobile) {
                            onToggleSidebar()
                        }
                    }}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                    <MessageSquarePlus size={16} />
                    Start New Chat
                </button>

                <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        Quick Actions
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                        {templates.map((t, idx) => {
                            const Icon = t.icon
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        sendMessage(t.query)
                                        if (isMobile) {
                                            onToggleSidebar()
                                        }
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40 rounded-xl text-left text-xs font-semibold text-gray-700 hover:text-indigo-800 transition-all cursor-pointer group"
                                >
                                    <Icon size={13} className="text-gray-400 group-hover:text-indigo-600 shrink-0" />
                                    <span className="truncate">{t.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3.5 scrollbar bg-white">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <History size={13} className="text-gray-400 shrink-0" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Chat History
                    </span>
                </div>

                <div className="space-y-1.5">
                    {sessions.map((s) => {
                        const isActive = s.id === activeSessionId
                        return (
                            <div key={s.id} className="relative group w-full flex items-center">
                                <button
                                    onClick={() => {
                                        switchSession(s.id)
                                        if (isMobile) {
                                            onToggleSidebar()
                                        }
                                    }}
                                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${isActive
                                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                                        : "border-transparent hover:bg-slate-50 text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    <MessageSquare size={15} className={`shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                                    <div className="flex-1 min-w-0 pr-7">
                                        <p className={`text-xs truncate font-bold ${isActive ? "text-indigo-900" : "text-gray-700"}`}>
                                            {s.title}
                                        </p>
                                        <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">
                                            {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (window.confirm("Are you sure you want to delete this chat history?")) {
                                            deleteSession(s.id)
                                        }
                                    }}
                                    className="absolute right-3 p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
                                    title="Delete session"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )
                    })}

                    {sessions.length === 0 && (
                        <p className="text-[11px] text-gray-400 italic text-center py-6">
                            No chat history available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatSidebar
