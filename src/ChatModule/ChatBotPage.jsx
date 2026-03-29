import React, { useState, useEffect, useRef } from 'react'
import {
    Send, Bot, User, Loader2, RefreshCw,
    ChevronRight, Sparkles, BarChart2,
    Calendar, Clock, DollarSign, Users,
    AlertCircle, CheckCircle,
} from 'lucide-react'
import { io } from 'socket.io-client'
import { ApiCall } from '../library/constants'

// ─── Get current user from session ───────────────────────────────────────────
function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}') } catch { return {} }
}

// ─── Format time ──────────────────────────────────────────────────────────────
function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// ─── Simple markdown renderer ─────────────────────────────────────────────────
// Converts the bot's markdown replies into styled HTML
function MarkdownMessage({ text }) {
    if (!text) return null

    const lines = text.split('\n')
    const result = []
    let tableRows = []
    let inTable = false

    const flushTable = () => {
        if (!tableRows.length) return
        const [headerRow, , ...bodyRows] = tableRows
        const headers = headerRow.split('|').map(h => h.trim()).filter(Boolean)
        result.push(
            <div key={`tbl-${result.length}`} className="overflow-x-auto my-2">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-indigo-50 text-indigo-800">
                            {headers.map((h, i) => (
                                <th key={i} className="px-3 py-2 text-left font-semibold border border-indigo-200">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, ri) => {
                            const cells = row.split('|').map(c => c.trim()).filter(Boolean)
                            return (
                                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    {cells.map((cell, ci) => (
                                        <td key={ci} className="px-3 py-1.5 border border-gray-200 text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
        tableRows = []
        inTable = false
    }

    lines.forEach((line, i) => {
        // Table detection
        if (line.startsWith('|')) {
            inTable = true
            tableRows.push(line)
            return
        }
        if (inTable) flushTable()

        if (!line.trim()) {
            result.push(<div key={i} className="h-1.5" />)
            return
        }

        // Heading: **text**
        if (/^\*\*.*\*\*$/.test(line.trim())) {
            const txt = line.trim().replace(/\*\*/g, '')
            result.push(<p key={i} className="font-bold text-gray-900 text-sm mb-1 mt-2 first:mt-0">{txt}</p>)
            return
        }

        // Bullet
        if (line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./)) {
            result.push(
                <div key={i} className="flex gap-2 text-sm text-gray-700 mb-0.5">
                    <span className="text-indigo-500 flex-shrink-0 mt-0.5">
                        {line.startsWith('•') ? '•' : line.match(/^\d+\./) ? line.match(/^\d+\./)[0] : '•'}
                    </span>
                    <span dangerouslySetInnerHTML={{
                        __html: inlineMarkdown(
                            line.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '')
                        )
                    }} />
                </div>
            )
            return
        }

        // Italic line (starts with _)
        if (line.trim().startsWith('_') && line.trim().endsWith('_')) {
            result.push(<p key={i} className="text-xs text-gray-400 italic mt-1">{line.trim().slice(1, -1)}</p>)
            return
        }

        // Normal paragraph
        result.push(
            <p key={i} className="text-sm text-gray-800 mb-0.5 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }} />
        )
    })

    if (inTable) flushTable()
    return <div className="space-y-0.5">{result}</div>
}

// Inline markdown: **bold**, _italic_, [link](url)
function inlineMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 underline hover:text-indigo-800">$1</a>')
}

// ─── Quick prompt suggestions (role-aware) ────────────────────────────────────
const QUICK_PROMPTS = {
    EMPLOYEE: [
        { icon: Calendar, label: 'Leave balance', msg: 'What is my leave balance?' },
        { icon: Clock, label: 'My attendance', msg: 'Show my attendance this month' },
        { icon: DollarSign, label: 'My payslip', msg: 'Show my latest payslip' },
        { icon: AlertCircle, label: 'Pending leaves', msg: 'How many leaves are pending for me?' },
        { icon: Users, label: 'My manager', msg: 'Who is my reporting manager?' },
        { icon: Calendar, label: 'Upcoming holidays', msg: 'What are the upcoming holidays?' },
    ],
    HR: [
        { icon: BarChart2, label: 'Attendance report', msg: 'Make a report of employee attendance for this month' },
        { icon: Users, label: 'IT dept attendance', msg: 'Make attendance report for IT department for June' },
        { icon: Calendar, label: 'Pending leaves', msg: 'Show all pending leave requests' },
        { icon: AlertCircle, label: 'Absent report', msg: 'Who was absent this month from IT department?' },
        { icon: Users, label: 'Employee count', msg: 'How many employees are in each department?' },
        { icon: DollarSign, label: 'Salary report', msg: 'Show payroll summary for this month' },
    ],
    ADMIN: [
        { icon: BarChart2, label: 'Attendance report', msg: 'Attendance report for June for engineering department' },
        { icon: Users, label: 'Employee list', msg: 'List all employees in sales department' },
        { icon: DollarSign, label: 'Payroll summary', msg: 'Show total salary for IT department this month' },
        { icon: Calendar, label: 'Leave report', msg: 'Leave report for June for all departments' },
        { icon: AlertCircle, label: 'Late comers', msg: 'Show late comers this month' },
        { icon: CheckCircle, label: 'Headcount', msg: 'What is total headcount by department?' },
    ],
    MANAGER: [
        { icon: BarChart2, label: 'Team attendance', msg: 'Show my team attendance this month' },
        { icon: Calendar, label: 'Team pending leaves', msg: 'Show pending leave requests from my team' },
        { icon: AlertCircle, label: 'Team absent', msg: 'Who was absent from my team this month?' },
        { icon: Users, label: 'My team', msg: 'List employees in my team' },
        { icon: Clock, label: 'My attendance', msg: 'Show my attendance this month' },
        { icon: Calendar, label: 'My leave balance', msg: 'What is my leave balance?' },
    ],
    PAYROLL_MANAGER: [
        { icon: DollarSign, label: 'Payroll summary', msg: 'Payroll report for this month' },
        { icon: BarChart2, label: 'Dept salary', msg: 'Show salary report by department' },
        { icon: Calendar, label: 'Leave balance all', msg: 'Leave balance for all employees' },
        { icon: Users, label: 'Headcount', msg: 'Employee count by department' },
    ],
}

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, currentUser }) {
    const isMine = msg.sender === 'user'
    const isBot = msg.sender === 'bot'

    if (msg.sender === 'system') {
        return (
            <div className="flex justify-center my-3">
                <span className="text-xs text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                    {msg.content}
                </span>
            </div>
        )
    }

    return (
        <div className={`flex gap-3 mb-4 ${isMine ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                ${isBot ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                {isBot
                    ? <Bot size={16} className="text-white" />
                    : <span className="text-xs font-semibold text-gray-600">
                        {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                    </span>
                }
            </div>

            {/* Content */}
            <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm
                    ${isMine
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : msg.isError
                            ? 'bg-red-50 border border-red-200 rounded-bl-sm'
                            : 'bg-white border border-gray-200 rounded-bl-sm'
                    }`}
                >
                    {isMine ? (
                        <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    ) : (
                        <MarkdownMessage text={msg.content} />
                    )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {formatTime(msg.timestamp)}
                </span>
            </div>
        </div>
    )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                    {[0, 150, 300].map(delay => (
                        <div key={delay}
                            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${delay}ms`, animationDuration: '0.8s' }}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">HRMS Bot is thinking...</span>
                </div>
            </div>
        </div>
    )
}

// ─── Main ChatBotPage ──────────────────────────────────────────────────────────
function ChatBotPage() {
    const currentUser = getCurrentUser()
    const role = currentUser?.role || 'EMPLOYEE'
    const quickPrompts = QUICK_PROMPTS[role] || QUICK_PROMPTS.EMPLOYEE

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [roomId, setRoomId] = useState(null)
    const [connected, setConnected] = useState(false)
    const [showPrompts, setShowPrompts] = useState(true)

    const bottomRef = useRef(null)
    const inputRef = useRef(null)
    const socketRef = useRef(null)

    // ── Setup socket + bot room ────────────────────────────────────────────────
    useEffect(() => {
        const token = sessionStorage.getItem('token')

        // Get or create bot room
        ApiCall('POST', '/chat/rooms/bot').then(res => {
            if (!res?.data?.success) return
            const id = res.data.data.id
            setRoomId(id)

            // Load existing messages
            ApiCall('GET', `/chat/rooms/${id}/messages`).then(hist => {
                if (hist?.data?.success) {
                    const mapped = hist.data.data.map(m => ({
                        id: m.id,
                        sender: m.sender_code === 'bot' ? 'bot' : 'user',
                        content: m.content,
                        timestamp: m.sent_at,
                    }))
                    setMessages(mapped)
                    if (mapped.length === 0) {
                        // First time — show welcome
                        setMessages([{
                            id: 'welcome',
                            sender: 'bot',
                            content: buildWelcome(currentUser, role),
                            timestamp: new Date(),
                        }])
                    }
                }
            })

            // Socket for real-time bot replies
            socketRef.current = io(import.meta.env.VITE_API_URL || '', {
                path: '/socket.io',
                auth: { token },
                transports: ['websocket'],
            })

            socketRef.current.on('connect', () => setConnected(true))
            socketRef.current.on('disconnect', () => setConnected(false))

            socketRef.current.on('message:new', (msg) => {
                if (msg.room_id !== id) return
                setIsTyping(false)
                if (msg.sender_code === 'bot' || msg.message_type === 'bot_reply') {
                    setMessages(prev => [...prev, {
                        id: msg.id,
                        sender: 'bot',
                        content: msg.content,
                        timestamp: msg.sent_at,
                    }])
                }
            })

            if (socketRef.current.connected) setConnected(true)
        })

        return () => { socketRef.current?.disconnect() }
    }, [])

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        if (messages.length > 0) setShowPrompts(false)
    }, [messages, isTyping])

    // ── Build welcome message ──────────────────────────────────────────────────
    function buildWelcome(user, role) {
        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
        const name = user?.name?.split(' ')[0] || 'there'

        const roleGreeting = {
            HR: `As HR, you can ask me for attendance reports, leave summaries, employee lists, and more — for any department or employee.`,
            ADMIN: `As Admin, you have full access — ask me for any report across all departments.`,
            MANAGER: `As a Manager, you can ask me for your team's attendance, pending leaves, and more.`,
            PAYROLL_MANAGER: `As Payroll Manager, you can ask me for salary reports and payroll summaries.`,
            EMPLOYEE: `You can ask me about your leave balance, attendance, payslip, and upcoming holidays.`,
        }

        return [
            `**${greeting}, ${name}! 👋 I am your HRMS Assistant.**`,
            '',
            roleGreeting[role] || roleGreeting.EMPLOYEE,
            '',
            'Try asking something like:',
            role === 'HR' || role === 'ADMIN'
                ? '• _"Make an attendance report for IT department for June"_'
                : '• _"How many leaves are pending for me?"_',
            role === 'HR' || role === 'ADMIN'
                ? '• _"Who was absent this month from engineering department?"_'
                : '• _"Show my attendance this month"_',
            '',
            'Or tap a quick prompt below to get started!',
        ].join('\n')
    }

    // ── Send message ───────────────────────────────────────────────────────────
    const handleSend = (text) => {
        const msg = (text || input).trim()
        if (!msg || !roomId || !socketRef.current) return

        // Optimistically add user message
        setMessages(prev => [...prev, {
            id: `local-${Date.now()}`,
            sender: 'user',
            content: msg,
            timestamp: new Date(),
        }])
        setInput('')
        setIsTyping(true)
        setShowPrompts(false)

        // Emit via socket — server handles DB insert + bot response
        socketRef.current.emit('message:send', {
            room_id: roomId,
            content: msg,
            message_type: 'text',
        })

        inputRef.current?.focus()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
    }

    const handleClear = () => {
        setMessages([{
            id: `clear-${Date.now()}`,
            sender: 'bot',
            content: buildWelcome(currentUser, role),
            timestamp: new Date(),
        }])
        setShowPrompts(true)
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">

            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-5 py-3.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
                                ${connected ? 'bg-green-400' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-gray-900">HRMS Bot</p>
                                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                    <Sparkles size={10} />
                                    <span className="text-[10px] font-semibold">AI Powered</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                {connected ? 'Online · Responds instantly' : 'Connecting...'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full
                            ${role === 'HR' || role === 'ADMIN' ? 'bg-purple-100 text-purple-700'
                                : role === 'MANAGER' ? 'bg-amber-100 text-amber-700'
                                    : 'bg-indigo-100 text-indigo-700'}`}>
                            {role}
                        </span>
                        <button onClick={handleClear}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Clear chat">
                            <RefreshCw size={16} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Messages ──────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar">
                <div className="max-w-3xl mx-auto">

                    {messages.map(msg => (
                        <MessageBubble key={msg.id} msg={msg} currentUser={currentUser} />
                    ))}

                    {isTyping && <TypingIndicator />}

                    {/* Quick prompts — shown at start or after clearing */}
                    {showPrompts && !isTyping && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-400 text-center mb-3">Quick prompts for you</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {quickPrompts.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(p.msg)}
                                        className="flex items-center gap-3 p-3.5 bg-white border border-gray-200
                                                   rounded-2xl hover:border-indigo-300 hover:bg-indigo-50
                                                   transition-all text-left group"
                                    >
                                        <div className="w-8 h-8 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl
                                                        flex items-center justify-center flex-shrink-0 transition-colors">
                                            <p.icon size={15} className="text-indigo-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 flex-1">
                                            {p.label}
                                        </span>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {/* ── Input ─────────────────────────────────────────────────────── */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3.5">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    role === 'HR' || role === 'ADMIN'
                                        ? 'e.g. "Attendance report for IT department for June"...'
                                        : 'Ask me about your leaves, attendance, payslip...'
                                }
                                rows={1}
                                className="flex-1 bg-transparent text-sm text-gray-900 resize-none
                                           focus:outline-none max-h-24 scrollbar leading-relaxed"
                            />
                        </div>
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="w-11 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl
                                       flex items-center justify-center disabled:opacity-40
                                       transition-colors flex-shrink-0"
                        >
                            {isTyping
                                ? <Loader2 size={18} className="animate-spin" />
                                : <Send size={17} />
                            }
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                        Press Enter to send · Shift+Enter for new line · Powered by HRMS AI
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatBotPage