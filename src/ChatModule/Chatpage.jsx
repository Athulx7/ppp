import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    Search, Plus, X, Send, MoreVertical, Users, Bot,
    ChevronLeft, Paperclip, Smile, Check, CheckCheck,
    Circle, UserPlus, Hash, MessageSquare, Wifi, WifiOff,
    Trash2, Reply, CornerUpLeft, Info,
} from 'lucide-react'
import { useChat } from './Hooks/Usechat'
import { ApiCall } from '../library/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCurrentUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}') } catch { return {} }
}

function timeAgo(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const sec = Math.floor((now - d) / 1000)
    if (sec < 60) return 'now'
    if (sec < 3600) return `${Math.floor(sec / 60)}m`
    if (sec < 86400) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function fullTime(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
    })
}

function initials(name = '') {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, url, size = 'md', status }) {
    const sz = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-11 h-11 text-sm' }
    const statusColor = { online: 'bg-green-400', away: 'bg-yellow-400', busy: 'bg-red-400', offline: 'bg-gray-300' }
    return (
        <div className="relative flex-shrink-0">
            {url ? (
                <img src={url} alt={name} className={`${sz[size]} rounded-full object-cover`} />
            ) : (
                <div className={`${sz[size]} rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold`}>
                    {initials(name)}
                </div>
            )}
            {status && (
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColor[status] || 'bg-gray-300'}`} />
            )}
        </div>
    )
}

// ─── New Chat / Group modal ────────────────────────────────────────────────────
function NewChatModal({ onClose, onDM, onGroup }) {
    const [mode, setMode] = useState('select')  // select | dm | group
    const [search, setSearch] = useState('')
    const [employees, setEmployees] = useState([])
    const [selected, setSelected] = useState([])
    const [groupName, setGroupName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ApiCall('GET', '/chat/employees').then(res => {
            if (res?.data?.success) setEmployees(res.data.data)
        })
    }, [])

    const filtered = employees.filter(e =>
        e.emp_name.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase())
    )

    const handleDM = async (emp) => {
        setLoading(true)
        await onDM(emp.emp_code)
        onClose()
    }

    const handleGroup = async () => {
        if (!groupName.trim() || selected.length < 1) return
        setLoading(true)
        await onGroup(groupName, '', selected.map(e => e.emp_code))
        onClose()
    }

    const statusColor = { online: 'text-green-500', away: 'text-yellow-500', offline: 'text-gray-400' }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {mode !== 'select' && (
                            <button onClick={() => setMode('select')} className="p-1 hover:bg-gray-100 rounded-lg">
                                <ChevronLeft size={16} className="text-gray-500" />
                            </button>
                        )}
                        <p className="text-base font-semibold text-gray-900">
                            {mode === 'select' ? 'New conversation' : mode === 'dm' ? 'New direct message' : 'Create group'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-xl">
                        <X size={16} className="text-gray-500" />
                    </button>
                </div>

                {mode === 'select' && (
                    <div className="p-5 grid grid-cols-2 gap-3">
                        <button onClick={() => setMode('dm')}
                            className="flex flex-col items-center gap-2.5 p-5 border-2 border-gray-200
                                       hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl transition-all">
                            <MessageSquare size={24} className="text-indigo-600" />
                            <p className="text-sm font-semibold text-gray-800">Direct message</p>
                            <p className="text-xs text-gray-400 text-center">Chat one-on-one</p>
                        </button>
                        <button onClick={() => setMode('group')}
                            className="flex flex-col items-center gap-2.5 p-5 border-2 border-gray-200
                                       hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl transition-all">
                            <Users size={24} className="text-indigo-600" />
                            <p className="text-sm font-semibold text-gray-800">Group chat</p>
                            <p className="text-xs text-gray-400 text-center">Team conversations</p>
                        </button>
                    </div>
                )}

                {(mode === 'dm' || mode === 'group') && (
                    <>
                        {mode === 'group' && (
                            <div className="px-5 pt-4 pb-0">
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={e => setGroupName(e.target.value)}
                                    placeholder="Group name..."
                                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200
                                               rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
                                />
                                {selected.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {selected.map(e => (
                                            <span key={e.emp_code}
                                                className="flex items-center gap-1.5 bg-indigo-100 text-indigo-700
                                                           text-xs font-medium pl-2.5 pr-1.5 py-1 rounded-full">
                                                {e.emp_name.split(' ')[0]}
                                                <button onClick={() => setSelected(s => s.filter(x => x.emp_code !== e.emp_code))}>
                                                    <X size={11} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="px-5 py-3">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search employees..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200
                                               rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-3 pb-3">
                            {filtered.map(emp => (
                                <button
                                    key={emp.emp_code}
                                    onClick={() => mode === 'dm' ? handleDM(emp) : setSelected(s =>
                                        s.some(x => x.emp_code === emp.emp_code)
                                            ? s.filter(x => x.emp_code !== emp.emp_code)
                                            : [...s, emp]
                                    )}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                                        ${mode === 'group' && selected.some(x => x.emp_code === emp.emp_code)
                                            ? 'bg-indigo-50 border border-indigo-200'
                                            : 'hover:bg-gray-50'}`}
                                >
                                    <Avatar name={emp.emp_name} url={emp.avatar_url}
                                        status={emp.online_status} />
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{emp.emp_name}</p>
                                        <p className="text-xs text-gray-400 truncate">{emp.designation} · {emp.department}</p>
                                    </div>
                                    <span className={`text-xs font-medium capitalize ${statusColor[emp.online_status] || 'text-gray-400'}`}>
                                        {emp.online_status || 'offline'}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {mode === 'group' && (
                            <div className="px-5 py-4 border-t border-gray-100">
                                <button
                                    onClick={handleGroup}
                                    disabled={!groupName.trim() || selected.length < 1 || loading}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold
                                               disabled:opacity-40 flex items-center justify-center gap-2"
                                >
                                    <Users size={15} />
                                    Create group ({selected.length} members)
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

// ─── Room list item ────────────────────────────────────────────────────────────
function RoomItem({ room, isActive, onClick, currentUser, presence }) {
    const isDM = room.room_type === 'dm'
    const isBot = room.room_type === 'bot'
    const otherName = room.other_name || room.name || 'Unknown'
    const status = isDM ? presence[room.other_emp_code] : null

    return (
        <button onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left
                ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-900'}`}>
            {isBot ? (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                    ${isActive ? 'bg-white/20' : 'bg-indigo-100'}`}>
                    <Bot size={18} className={isActive ? 'text-white' : 'text-indigo-600'} />
                </div>
            ) : isDM ? (
                <Avatar name={otherName} url={room.other_avatar} status={status} />
            ) : (
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                    ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <Hash size={16} className={isActive ? 'text-white' : 'text-gray-600'} />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {isBot ? 'HRMS Bot' : otherName}
                    </p>
                    <span className={`text-[10px] flex-shrink-0 ml-1 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                        {timeAgo(room.last_message_at)}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <p className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                        {room.last_message || 'No messages yet'}
                    </p>
                    {Number(room.unread_count) > 0 && !isActive && (
                        <span className="flex-shrink-0 ml-1 bg-indigo-600 text-white text-[10px]
                                         font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                            {room.unread_count > 99 ? '99+' : room.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
}

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine, showAvatar, onDelete, onReply }) {
    const [showMenu, setShowMenu] = useState(false)

    if (msg.message_type === 'system') {
        return (
            <div className="flex justify-center my-2">
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {msg.content}
                </span>
            </div>
        )
    }

    const isBot = msg.sender_code === 'bot'

    return (
        <div className={`flex gap-2.5 mb-1 group ${isMine ? 'flex-row-reverse' : ''}`}
            onMouseLeave={() => setShowMenu(false)}>
            {!isMine && (
                <div className="flex-shrink-0 mt-auto">
                    {showAvatar ? (
                        <Avatar name={isBot ? 'HRMS Bot' : msg.sender_name} size="sm" />
                    ) : <div className="w-7" />}
                </div>
            )}

            <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                {showAvatar && !isMine && (
                    <p className="text-xs text-gray-400 mb-1 px-1">{isBot ? 'HRMS Bot' : msg.sender_name}</p>
                )}

                {/* Reply preview */}
                {msg.reply_to_id && (
                    <div className={`text-xs px-3 py-1.5 rounded-lg mb-1 border-l-2 border-indigo-400
                        ${isMine ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                        Replying to a message
                    </div>
                )}

                <div className="relative flex items-end gap-1.5">
                    {/* Hover actions */}
                    <div className={`hidden group-hover:flex items-center gap-1
                        ${isMine ? 'order-first' : 'order-last'}`}>
                        <button onClick={() => onReply(msg)}
                            className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                            <Reply size={12} className="text-gray-500" />
                        </button>
                        {isMine && !msg.is_deleted && (
                            <button onClick={() => onDelete(msg.id)}
                                className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-red-50 shadow-sm">
                                <Trash2 size={12} className="text-red-400" />
                            </button>
                        )}
                    </div>

                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${msg.is_deleted
                            ? 'bg-gray-100 text-gray-400 italic'
                            : isMine
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : isBot
                                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-bl-sm'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        }`}
                    >
                        {msg.content}
                    </div>
                </div>

                <div className={`flex items-center gap-1.5 mt-0.5 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-gray-400">{fullTime(msg.sent_at)}</span>
                    {isMine && !msg.is_deleted && (
                        msg.read_by?.length > 0
                            ? <CheckCheck size={12} className="text-indigo-500" />
                            : <Check size={12} className="text-gray-400" />
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Chat message area ────────────────────────────────────────────────────────
function MessageArea({ room, messages, typing, presence, currentUser, onSend, onDelete, onLoadMore }) {
    const [input, setInput] = useState('')
    const [replyTo, setReplyTo] = useState(null)
    const bottomRef = useRef(null)
    const inputRef = useRef(null)
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        onSend(input, replyTo ? { reply_to_id: replyTo.id } : {})
        setInput('')
        setReplyTo(null)
        inputRef.current?.focus()
    }

    const handleScroll = async (e) => {
        if (e.target.scrollTop < 50 && !loadingMore) {
            setLoadingMore(true)
            await onLoadMore()
            setLoadingMore(false)
        }
    }

    if (!room) return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-base font-medium">Select a conversation</p>
            <p className="text-sm mt-1">Choose from the list or start a new chat</p>
        </div>
    )

    const isDM = room.room_type === 'dm'
    const isBot = room.room_type === 'bot'
    const otherStatus = isDM ? presence[room.other_emp_code] : null

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between
                            px-5 py-3.5 bg-white border-b border-gray-200">
                <div className="flex items-center gap-3">
                    {isBot ? (
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Bot size={18} className="text-indigo-600" />
                        </div>
                    ) : isDM ? (
                        <Avatar name={room.other_name} url={room.other_avatar} status={otherStatus} />
                    ) : (
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                            <Hash size={16} className="text-gray-600" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {isBot ? 'HRMS Bot' : room.other_name || room.name}
                        </p>
                        <p className="text-xs text-gray-400">
                            {isBot ? 'Your HR assistant'
                                : isDM ? (otherStatus === 'online' ? 'Online' : `Last seen ${timeAgo(room.other_last_seen)}`)
                                    : `${room.member_count || ''} members`}
                        </p>
                    </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-xl">
                    <Info size={18} className="text-gray-500" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5 scrollbar"
                onScroll={handleScroll}>
                {loadingMore && (
                    <div className="flex justify-center py-2">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMine = msg.sender_code === currentUser.emp_code
                    const showAvatar = !isMine && (i === 0 || messages[i - 1]?.sender_code !== msg.sender_code)
                    return (
                        <MessageBubble
                            key={msg.id}
                            msg={msg}
                            isMine={isMine}
                            showAvatar={showAvatar}
                            onDelete={(id) => onDelete(room.id, id)}
                            onReply={(m) => { setReplyTo(m); inputRef.current?.focus() }}
                        />
                    )
                })}

                {/* Typing indicator */}
                {typing.length > 0 && (
                    <div className="flex gap-2.5 items-end">
                        <div className="w-7" />
                        <div className="flex items-center gap-1 bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                            <div className="flex gap-1">
                                {[0, 150, 300].map(d => (
                                    <div key={d} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                        style={{ animationDelay: `${d}ms` }} />
                                ))}
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 mb-1">
                            {typing[0].name} is typing…
                        </span>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Reply bar */}
            {replyTo && (
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5
                                bg-indigo-50 border-t border-indigo-200">
                    <CornerUpLeft size={14} className="text-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-indigo-600">{replyTo.sender_name}</p>
                        <p className="text-xs text-indigo-700 truncate">{replyTo.content}</p>
                    </div>
                    <button onClick={() => setReplyTo(null)}
                        className="p-1 hover:bg-indigo-100 rounded-lg flex-shrink-0">
                        <X size={13} className="text-indigo-500" />
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-end gap-2.5">
                    <div className="flex-1 flex items-end bg-gray-100 rounded-2xl px-4 py-2.5 gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                            }}
                            placeholder={isBot ? 'Ask me anything about your HR...' : 'Type a message...'}
                            rows={1}
                            className="flex-1 bg-transparent text-sm text-gray-900 resize-none
                                       focus:outline-none max-h-24 scrollbar"
                            style={{ lineHeight: '1.5' }}
                        />
                        <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
                            <Paperclip size={17} />
                        </button>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center
                                   justify-center disabled:opacity-40 hover:bg-indigo-700 transition-colors
                                   flex-shrink-0"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main ChatPage ─────────────────────────────────────────────────────────────
function ChatPage() {
    const currentUser = getCurrentUser()
    const {
        rooms, currentRoomMessages, currentRoomTyping, presence,
        connected, loading, activeRoomId, setActiveRoomId,
        sendMessage, sendTyping, deleteMessage,
        createDM, createGroup, openBotChat, loadMore, reload,
    } = useChat()

    const [search, setSearch] = useState('')
    const [showNewChat, setShowNewChat] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)  // mobile: hide sidebar when chat open

    // Enrich DM rooms with other person's info (hack: store in room during creation)
    // In production, the API should JOIN empmst to return other_name, other_avatar etc.
    const activeRoom = rooms.find(r => r.id === activeRoomId) || null

    const filteredRooms = rooms.filter(r => {
        const name = r.room_type === 'bot' ? 'HRMS Bot' : r.other_name || r.name || ''
        return name.toLowerCase().includes(search.toLowerCase())
    })

    const handleSelectRoom = (roomId) => {
        setActiveRoomId(roomId)
        setShowSidebar(false)
    }

    const handleSend = (content, extras) => {
        if (!activeRoomId) return
        sendMessage(activeRoomId, content, extras)
    }

    const handleBotOpen = async () => {
        const id = await openBotChat()
        if (id) { setActiveRoomId(id); setShowSidebar(false) }
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">

            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <div className={`
                flex-shrink-0 w-72 xl:w-80 flex flex-col
                border-r border-gray-200 bg-white
                ${showSidebar ? 'flex' : 'hidden md:flex'}
            `}>
                {/* Sidebar header */}
                <div className="flex-shrink-0 px-4 pt-4 pb-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                        <div className="flex items-center gap-1">
                            {/* Connection status */}
                            <div className="flex items-center gap-1 mr-1">
                                {connected
                                    ? <Wifi size={14} className="text-green-500" />
                                    : <WifiOff size={14} className="text-red-400" />}
                            </div>
                            {/* HRMS Bot shortcut */}
                            <button onClick={handleBotOpen}
                                className="w-8 h-8 flex items-center justify-center
                                           bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                title="HRMS Bot">
                                <Bot size={16} className="text-indigo-600" />
                            </button>
                            {/* New chat */}
                            <button onClick={() => setShowNewChat(true)}
                                className="w-8 h-8 flex items-center justify-center
                                           bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
                                <Plus size={16} className="text-white" />
                            </button>
                        </div>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm
                                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>
                </div>

                {/* Room list */}
                <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar">
                    {loading ? (
                        <div className="space-y-2 px-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                    <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRooms.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No conversations yet</p>
                            <button onClick={() => setShowNewChat(true)}
                                className="mt-2 text-xs text-indigo-600 font-medium">
                                Start one
                            </button>
                        </div>
                    ) : filteredRooms.map(room => (
                        <RoomItem
                            key={room.id}
                            room={room}
                            isActive={room.id === activeRoomId}
                            onClick={() => handleSelectRoom(room.id)}
                            currentUser={currentUser}
                            presence={presence}
                        />
                    ))}
                </div>
            </div>

            {/* ── Message area ──────────────────────────────────────────────── */}
            <div className={`flex-1 flex flex-col overflow-hidden
                ${!showSidebar || activeRoomId ? 'flex' : 'hidden md:flex'}`}>
                {/* Mobile back button */}
                {!showSidebar && (
                    <div className="md:hidden">
                        <button onClick={() => setShowSidebar(true)}
                            className="absolute top-4 left-4 z-10 p-2 bg-white rounded-xl shadow-sm">
                            <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                    </div>
                )}
                <MessageArea
                    room={activeRoom}
                    messages={currentRoomMessages}
                    typing={currentRoomTyping}
                    presence={presence}
                    currentUser={currentUser}
                    onSend={handleSend}
                    onDelete={deleteMessage}
                    onLoadMore={() => loadMore(activeRoomId)}
                />
            </div>

            {/* New chat modal */}
            {showNewChat && (
                <NewChatModal
                    onClose={() => setShowNewChat(false)}
                    onDM={async (code) => {
                        const id = await createDM(code)
                        if (id) { setActiveRoomId(id); setShowSidebar(false) }
                    }}
                    onGroup={async (name, desc, codes) => {
                        const id = await createGroup(name, desc, codes)
                        if (id) { setActiveRoomId(id); setShowSidebar(false) }
                    }}
                />
            )}
        </div>
    )
}

export default ChatPage