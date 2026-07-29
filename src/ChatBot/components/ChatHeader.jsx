import React from "react"
import { Bot, RefreshCw, Sparkles, Building2, PanelLeftClose, PanelLeft, X, ArrowLeft, ExternalLink } from "lucide-react"

function ChatHeader({
    connected = true,
    role,
    tenant,
    clearChat,
    onToggleSidebar,
    isSidebarOpen,
    isDrawer,
    onClose,
    isMobile,
    onNavigateFullPage
}) {
    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-3.5 shadow-sm select-none">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="relative group focus:outline-none cursor-pointer"
                        title={isSidebarOpen ? "Hide chat history" : "Show chat history"}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-all duration-200 ${isSidebarOpen
                                ? "bg-indigo-700 border-indigo-800 text-white"
                                : "bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white"
                            }`}>
                            {isMobile && isSidebarOpen ? (
                                <ArrowLeft size={18} />
                            ) : (
                                <Bot size={20} />
                            )}
                        </div>

                        {!isMobile && (
                            <div className="absolute -top-1 -left-1 bg-white border border-gray-200 shadow-md text-gray-500 hover:text-indigo-600 p-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {isSidebarOpen ? <PanelLeftClose size={10} /> : <PanelLeft size={10} />}
                            </div>
                        )}

                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${connected ? "bg-green-400" : "bg-gray-300"
                            }`} />
                    </button>

                    <div>
                        <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-gray-900 leading-tight">HRMS Support Bot</p>
                            <div className="flex items-center gap-0.5 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full border border-indigo-100">
                                <Sparkles size={8} />
                                <span className="text-[8px] font-bold uppercase tracking-wider">AI</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Building2 size={10} className="text-gray-400 shrink-0" />
                            <span className="font-semibold text-gray-500">{tenant}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isMobile && (
                        <button
                            onClick={onToggleSidebar}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-slate-50 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 rounded-md text-xs font-bold transition-all cursor-pointer"
                        >
                            {isSidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
                            <span>History</span>
                        </button>
                    )}

                    <button
                        onClick={clearChat}
                        className="p-2 hover:bg-slate-100/80 rounded-md border border-gray-200 hover:border-gray-300 transition-all cursor-pointer text-gray-500 hover:text-indigo-600"
                        title="Clear current screen"
                    >
                        <RefreshCw size={14} />
                    </button>

                    {isDrawer && (
                        <button
                            onClick={onNavigateFullPage}
                            className="p-2 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-md transition-all cursor-pointer"
                            title="Open full page view"
                        >
                            <ExternalLink size={14} />
                        </button>
                    )}

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-rose-50 text-gray-500 hover:text-rose-600 border border-gray-200 hover:border-rose-200 rounded-md transition-all cursor-pointer"
                            title={isDrawer ? "Close chat drawer" : "Close chatbot"}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatHeader