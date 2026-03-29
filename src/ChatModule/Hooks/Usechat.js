import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { ApiCall } from '../../library/constants'

// ─── Singleton socket — one connection for the whole app ──────────────────────
let socket = null

function getSocket(token) {
    if (!socket || !socket.connected) {
        socket = io(import.meta.env.VITE_API_URL || '', {
            path: '/socket.io',
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        })
    }
    return socket
}

// ─── useChat ─────────────────────────────────────────────────────────────────
// Central hook — import this anywhere in the chat UI.
// Returns everything the UI needs: rooms, messages, send functions, presence.
export function useChat() {
    const token = sessionStorage.getItem('token')

    const [rooms, setRooms] = useState([])
    const [activeRoomId, setActiveRoomId] = useState(null)
    const [messages, setMessages] = useState({})  // { room_id: [msg, ...] }
    const [presence, setPresence] = useState({})  // { emp_code: status }
    const [typing, setTyping] = useState({})  // { room_id: [{ emp_code, name }] }
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(true)
    const typingTimers = useRef({})

    // ── Load rooms from REST API ───────────────────────────────────────────────
    const loadRooms = useCallback(async () => {
        try {
            const res = await ApiCall('GET', '/chat/rooms')
            if (res?.data?.success) setRooms(res.data.data)
        } catch (err) { console.error('load rooms', err) }
        finally { setLoading(false) }
    }, [])

    // ── Load messages for a room ───────────────────────────────────────────────
    const loadMessages = useCallback(async (roomId, before = null) => {
        try {
            const url = `/chat/rooms/${roomId}/messages${before ? `?before=${before}` : ''}`
            const res = await ApiCall('GET', url)
            if (res?.data?.success) {
                setMessages(prev => {
                    const existing = prev[roomId] || []
                    const newMsgs = res.data.data
                    if (before) {
                        // Prepend older messages (infinite scroll up)
                        const ids = new Set(existing.map(m => m.id))
                        return { ...prev, [roomId]: [...newMsgs.filter(m => !ids.has(m.id)), ...existing] }
                    }
                    return { ...prev, [roomId]: newMsgs }
                })
            }
        } catch (err) { console.error('load messages', err) }
    }, [])

    // ── Socket setup ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!token) return
        const s = getSocket(token)

        s.on('connect', () => { setConnected(true); loadRooms() })
        s.on('disconnect', () => setConnected(false))

        // New message arrives
        s.on('message:new', (msg) => {
            setMessages(prev => {
                const room = prev[msg.room_id] || []
                // Avoid duplicates
                if (room.some(m => m.id === msg.id)) return prev
                return { ...prev, [msg.room_id]: [...room, msg] }
            })
            // Update room's last message preview
            setRooms(prev => prev.map(r =>
                r.id === msg.room_id
                    ? {
                        ...r, last_message: msg.content, last_message_at: msg.sent_at,
                        unread_count: msg.room_id === activeRoomId ? 0 : (Number(r.unread_count || 0) + 1)
                    }
                    : r
            ).sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)))
        })

        // Message deleted
        s.on('message:deleted', ({ message_id }) => {
            setMessages(prev => {
                const updated = {}
                for (const [rid, msgs] of Object.entries(prev)) {
                    updated[rid] = msgs.map(m => m.id === message_id ? { ...m, is_deleted: true, content: 'This message was deleted' } : m)
                }
                return updated
            })
        })

        // Presence update
        s.on('presence:update', ({ emp_code, status }) => {
            setPresence(prev => ({ ...prev, [emp_code]: status }))
        })

        // Typing indicator
        s.on('typing:update', ({ emp_code, name, room_id, typing: isTyping }) => {
            setTyping(prev => {
                const current = prev[room_id] || []
                if (isTyping) {
                    const exists = current.some(t => t.emp_code === emp_code)
                    return { ...prev, [room_id]: exists ? current : [...current, { emp_code, name }] }
                } else {
                    return { ...prev, [room_id]: current.filter(t => t.emp_code !== emp_code) }
                }
            })
        })

        // Read receipts
        s.on('message:read_by', ({ message_id, emp_code }) => {
            setMessages(prev => {
                const updated = {}
                for (const [rid, msgs] of Object.entries(prev)) {
                    updated[rid] = msgs.map(m => m.id === message_id
                        ? { ...m, read_by: [...(m.read_by || []), emp_code] }
                        : m
                    )
                }
                return updated
            })
        })

        if (s.connected) { setConnected(true); loadRooms() }

        return () => {
            s.off('message:new')
            s.off('message:deleted')
            s.off('presence:update')
            s.off('typing:update')
            s.off('message:read_by')
        }
    }, [token])

    // ── Active room change: load messages + mark read ─────────────────────────
    useEffect(() => {
        if (!activeRoomId) return
        if (!messages[activeRoomId]) loadMessages(activeRoomId)
        // Mark last message as read
        const roomMsgs = messages[activeRoomId] || []
        const last = roomMsgs[roomMsgs.length - 1]
        if (last) socket?.emit('message:read', { room_id: activeRoomId, message_id: last.id })
        // Clear unread count for this room
        setRooms(prev => prev.map(r => r.id === activeRoomId ? { ...r, unread_count: 0 } : r))
    }, [activeRoomId])

    // ── Send message ──────────────────────────────────────────────────────────
    const sendMessage = useCallback((roomId, content, extras = {}) => {
        if (!socket || !content?.trim()) return
        socket.emit('message:send', {
            room_id: roomId,
            content: content.trim(),
            message_type: extras.message_type || 'text',
            file_url: extras.file_url,
            file_name: extras.file_name,
            reply_to_id: extras.reply_to_id,
        })
    }, [])

    // ── Typing signals ─────────────────────────────────────────────────────────
    const sendTyping = useCallback((roomId) => {
        if (!socket) return
        socket.emit('typing:start', { room_id: roomId })
        clearTimeout(typingTimers.current[roomId])
        typingTimers.current[roomId] = setTimeout(() => {
            socket.emit('typing:stop', { room_id: roomId })
        }, 2000)
    }, [])

    // ── Delete message ─────────────────────────────────────────────────────────
    const deleteMessage = useCallback((roomId, messageId) => {
        if (!socket) return
        socket.emit('message:delete', { room_id: roomId, message_id: messageId })
    }, [])

    // ── Set presence status ────────────────────────────────────────────────────
    const setStatus = useCallback((status) => {
        socket?.emit('presence:set', { status })
    }, [])

    // ── Create DM ─────────────────────────────────────────────────────────────
    const createDM = useCallback(async (targetEmpCode) => {
        const res = await ApiCall('POST', '/chat/rooms/dm', { target_emp_code: targetEmpCode })
        if (res?.data?.success) {
            await loadRooms()
            return res.data.data.id
        }
    }, [loadRooms])

    // ── Create group ───────────────────────────────────────────────────────────
    const createGroup = useCallback(async (name, description, memberCodes) => {
        const res = await ApiCall('POST', '/chat/rooms/group', {
            name, description, member_codes: memberCodes,
        })
        if (res?.data?.success) {
            await loadRooms()
            return res.data.data.id
        }
    }, [loadRooms])

    // ── Open bot chat ──────────────────────────────────────────────────────────
    const openBotChat = useCallback(async () => {
        const res = await ApiCall('POST', '/chat/rooms/bot')
        if (res?.data?.success) {
            const roomId = res.data.data.id
            await loadRooms()
            if (!messages[roomId]) await loadMessages(roomId)
            setActiveRoomId(roomId)
            return roomId
        }
    }, [loadRooms, loadMessages])

    // ── Load more (infinite scroll) ────────────────────────────────────────────
    const loadMore = useCallback(async (roomId) => {
        const msgs = messages[roomId] || []
        if (msgs.length === 0) return
        await loadMessages(roomId, msgs[0].sent_at)
    }, [messages, loadMessages])

    return {
        // State
        rooms, messages, presence, typing, connected, loading,
        activeRoomId, setActiveRoomId,
        currentRoomMessages: messages[activeRoomId] || [],
        currentRoomTyping: typing[activeRoomId] || [],
        // Actions
        sendMessage, sendTyping, deleteMessage,
        setStatus, createDM, createGroup, openBotChat, loadMore,
        reload: loadRooms,
    }
}