import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2, Paperclip, Mic, Sparkles } from "lucide-react"

function ChatInput({ sendMessage, isTyping, role }) {
    const [input, setInput] = useState("")
    const textareaRef = useRef(null)

    const getPlaceholderText = () => {
        if (isTyping) return "HRMS AI is formulating response..."
        switch (role) {
            case "ADMIN":
                return "Ask for headcount summary, employee list, holidays, active roles..."
            case "HR":
                return "Ask to review pending leave requests, check department count, sales directory..."
            case "MANAGER":
                return "Ask for pending team leaves, employee directories..."
            case "EMPLOYEE":
            default:
                return "Ask for your leave balance, manager name, attendance cycles, payslip..."
        }
    }

    const handleSend = () => {
        const text = input.trim()
        if (!text || isTyping) return
        sendMessage(text)
        setInput("")

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [input])

    useEffect(() => {
        textareaRef.current?.focus()
    }, [])

    return (
        <div className=" border-t border-gray-200 px-6 py-4.5 shrink-0">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-3.5">
                    <div className="flex-1 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-3xl px-4.5 py-3.5 transition-all flex items-end gap-2.5 shadow-sm group focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400">
                        <button 
                            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
                            title="Attach document (visual only)"
                            type="button"
                        >
                            <Paperclip size={16} />
                        </button>
                        
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={getPlaceholderText()}
                            rows={1}
                            disabled={isTyping}
                            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-28 leading-relaxed font-medium"
                        />

                        <button 
                            className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors cursor-pointer"
                            title="Dictate message (visual only)"
                            type="button"
                        >
                            <Mic size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-3xl flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                    >
                        {isTyping ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2.5 px-3">
                    <span className="text-[10px] text-gray-400 font-semibold select-none flex items-center gap-1.5">
                        <Sparkles size={11} className="text-indigo-400" />
                        Press Enter to Send · Shift + Enter for newline
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ChatInput
