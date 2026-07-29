import React from "react"
import { Bot, User, Check, Sparkles, Calendar, FileText } from "lucide-react"

function formatTime(date) {
    if (!date) return ""
    return new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

function inlineMarkdown(text) {
    if (!text) return ""
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<span class='px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-xs font-semibold text-indigo-700'>$1</span>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 underline hover:text-indigo-800">$1</a>')
}

function MarkdownMessage({ text }) {
    if (!text) return null

    const lines = text.split("\n")
    const result = []
    let tableRows = []
    let inTable = false

    const flushTable = () => {
        if (!tableRows.length) return
        const [headerRow, , ...bodyRows] = tableRows
        const headers = headerRow.split("|").map(h => h.trim()).filter(Boolean)

        result.push(
            <div key={`tbl-${result.length}`} className="overflow-hidden border border-gray-200 rounded-xl my-3 shadow-sm bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-gray-200">
                                {headers.map((h, i) => (
                                    <th key={i} className="px-4 py-3 font-semibold text-gray-700 first:pl-5 last:pr-5">
                                        {h.replace(/\*\*/g, "")}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bodyRows.map((row, ri) => {
                                const cells = row.split("|").map(c => c.trim()).filter(Boolean)
                                return (
                                    <tr key={ri} className="hover:bg-slate-50/50 transition-colors">
                                        {cells.map((cell, ci) => (
                                            <td key={ci} className="px-4 py-2.5 text-gray-600 first:pl-5 last:pr-5"
                                                dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
        tableRows = []
        inTable = false
    }

    lines.forEach((line, i) => {
        if (line.startsWith("|")) {
            inTable = true
            tableRows.push(line)
            return
        }
        if (inTable) flushTable()

        const trimmed = line.trim()
        if (!trimmed) {
            result.push(<div key={i} className="h-2" />)
            return
        }

        if (/^\*\*.*\*\*$/.test(trimmed)) {
            const txt = trimmed.replace(/\*\*/g, "")
            result.push(
                <p key={i} className="font-bold text-gray-900 text-sm mb-1.5 mt-3.5 first:mt-0 leading-none">
                    {txt}
                </p>
            )
            return
        }

        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.match(/^\d+\./)) {
            const bulletChar = trimmed.startsWith("•") ? "•" : trimmed.startsWith("-") ? "•" : trimmed.match(/^\d+\./)[0]
            const cleanContent = trimmed.replace(/^[•\-]\s*/, "").replace(/^\d+\.\s*/, "")
            result.push(
                <div key={i} className="flex gap-2 text-sm text-gray-700 mb-1 pl-1">
                    <span className="text-indigo-500 font-bold flex-shrink-0">{bulletChar}</span>
                    <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cleanContent) }} />
                </div>
            )
            return
        }

        result.push(
            <p key={i} className="text-sm text-gray-700 leading-relaxed mb-1"
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />
        )
    })

    if (inTable) flushTable()
    return <div className="space-y-0.5">{result}</div>
}

function MessageItem({ msg, handleAction, user }) {
    const isMine = msg.sender === "user"
    const isBot = msg.sender === "bot"

    return (
        <div className={`flex gap-3.5 mb-5 ${isMine ? "flex-row-reverse" : ""}`}>
            <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-sm transition-transform duration-250 ${isBot
                    ? "bg-indigo-600 border-indigo-700 text-white"
                    : "bg-gradient-to-tr from-slate-100 to-slate-50 border-gray-200 text-gray-700"
                }`}>
                {isBot ? (
                    <Bot size={18} />
                ) : (
                    <span className="text-xs font-bold tracking-wider">
                        {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "ME"}
                    </span>
                )}
            </div>

            <div className={`max-w-[78%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div className={`rounded-3xl px-5 py-3.5 border transition-all ${isMine
                        ? "bg-indigo-600 border-indigo-700 text-white rounded-tr-sm shadow-sm"
                        : "bg-white border-gray-200 rounded-tl-sm text-gray-800 shadow-sm"
                    }`}>
                    {isMine ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                        <MarkdownMessage text={msg.content} />
                    )}
                </div>

                {isBot && msg.isActionCard && msg.actionType === "approve_leave" && (
                    <div className="w-full mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.actionDataList.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 hover:border-indigo-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                                        <span className="text-[9px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                                            {item.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Calendar size={11} />
                                        <span className="text-[10px] font-medium">{item.dates}</span>
                                    </div>
                                    <div className="flex items-start gap-1.5 text-gray-500">
                                        <FileText size={11} className="mt-0.5 shrink-0" />
                                        <p className="text-[10px] italic leading-tight">"{item.reason}"</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAction("approve_leave", { id: item.id, name: item.name })}
                                    className="mt-3.5 w-full py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 border border-indigo-100 hover:border-transparent transition-all active:scale-[0.98]"
                                >
                                    <Check size={12} />
                                    Approve Request
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <span className="text-[9px] text-gray-400 font-medium mt-1 px-1.5">
                    {formatTime(msg.timestamp)}
                </span>
            </div>
        </div>
    )
}

export default MessageItem
