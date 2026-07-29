import { useState, useEffect, useCallback, useRef } from "react"
import { ApiCall } from "../../library/constants"

function getCurrentSessionUser() {
    try {
        return JSON.parse(sessionStorage.getItem("user") || "{}")
    } catch {
        return {}
    }
}

function getCurrentCompany() {
    try {
        return JSON.parse(sessionStorage.getItem("company") || "{}")
    }
    catch {
        return {}
    }
}

export function useChatBot() {
    const sessionUser = getCurrentSessionUser()
    const sessionCompany = getCurrentCompany()
    const role = ["ADMIN", "HR", "EMPLOYEE", "MANAGER"].includes(sessionUser.role_code?.toUpperCase()) ? sessionUser.role_code.toUpperCase() : "HR"
    const tenant = sessionCompany.company_name || "Company"
    const [isTyping, setIsTyping] = useState(false)
    const [sessions, setSessions] = useState([])
    const [activeSessionId, setActiveSessionId] = useState(null)
    const [loadingHistory, setLoadingHistory] = useState(true)
    const activeSession = sessions.find(s => s.id === activeSessionId) || { messages: [] }
    const messages = activeSession.messages || []
    const stateRef = useRef({ role, tenant, activeSessionId, sessions })
    useEffect(() => {
        stateRef.current = { role, tenant, activeSessionId, sessions }
    }, [role, tenant, activeSessionId, sessions])

    const loadSessions = useCallback(async (selectFirst = true) => {
        try {
            setLoadingHistory(true)
            const res = await ApiCall("GET", "/chatbot/sessions")
            if (res?.data?.success && res.data.data) {
                const formatted = res.data.data.map(s => ({
                    id: s.session_id,
                    title: s.title,
                    timestamp: new Date(s.updated_at),
                    messages: []
                }))
                setSessions(prev => {
                    return formatted.map(newSession => {
                        const existing = prev.find(x => x.id === newSession.id)
                        return {
                            ...newSession,
                            messages: existing ? existing.messages : []
                        }
                    })
                })

                if (formatted.length > 0) {
                    if (selectFirst) {
                        setActiveSessionId(formatted[0].id)
                    }
                } else {
                    await startNewChat()
                }
            }
        } catch (err) {
            console.error("Failed to load chatbot sessions:", err)
        } finally {
            setLoadingHistory(false)
        }
    }, [])

    useEffect(() => {
        loadSessions(true)
    }, [loadSessions])

    const startNewChat = useCallback(async () => {
        try {
            setIsTyping(true)
            const res = await ApiCall("POST", "/chatbot/sessions/new")
            if (res?.data?.success && res.data.session) {
                const s = res.data.session
                const newSession = {
                    id: s.session_id,
                    title: s.title,
                    timestamp: new Date(),
                    messages: res.data.messages.map((m, idx) => ({
                        id: `msg-${idx}-${Date.now()}`,
                        sender: m.sender,
                        content: m.content,
                        timestamp: new Date(m.timestamp)
                    }))
                }

                setSessions(prev => [newSession, ...prev.filter(x => x.id !== newSession.id)])
                setActiveSessionId(newSession.id)
            }
        } catch (err) {
            console.error("Failed to create chatbot session:", err)
        } finally {
            setIsTyping(false)
        }
    }, [])

    useEffect(() => {
        if (!activeSessionId) return

        const currentSession = stateRef.current.sessions.find(s => s.id === activeSessionId)
        if (currentSession && currentSession.messages && currentSession.messages.length > 0) {
            return
        }

        async function fetchMessages() {
            try {
                const res = await ApiCall("GET", `/chatbot/sessions/${activeSessionId}/messages`)
                if (res?.data?.success && res.data.data) {
                    const formattedMsgs = res.data.data.map(m => ({
                        id: m.message_id,
                        sender: m.sender,
                        content: m.content,
                        timestamp: new Date(m.timestamp)
                    }))

                    setSessions(prev =>
                        prev.map(s => s.id === activeSessionId ? { ...s, messages: formattedMsgs } : s)
                    )
                }
            } catch (err) {
                console.error("Failed to fetch messages for session:", activeSessionId, err)
            }
        }

        fetchMessages()
    }, [activeSessionId])

    const switchSession = useCallback((sessionId) => {
        setActiveSessionId(sessionId)
    }, [])

    const handleAction = useCallback((actionType, actionData) => {
        console.log("Action card trigger received:", actionType, actionData)
    }, [])

    const sendMessage = useCallback(async (content) => {
        if (!content.trim()) return

        const userMessage = {
            id: `usr-${Date.now()}`,
            sender: "user",
            content: content,
            timestamp: new Date()
        }

        const { activeSessionId: curSessionId } = stateRef.current
        if (!curSessionId) return

        setSessions(prev => {
            return prev.map(s => {
                if (s.id !== curSessionId) return s

                const newTitle = s.title.startsWith("Active Assistant Session") && content.length > 5
                    ? content.slice(0, 24) + (content.length > 24 ? "..." : "")
                    : s.title

                return {
                    ...s,
                    title: newTitle,
                    timestamp: new Date(),
                    messages: [...s.messages, userMessage]
                }
            })
        })

        setIsTyping(true)

        try {
            const res = await ApiCall("POST", "/chatbot/query", {
                message: content,
                sessionId: curSessionId
            })

            setIsTyping(false)

            const replyContent = res?.data?.reply || "No response from AI assistant."

            const botMessage = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                content: replyContent,
                timestamp: new Date()
            }

            setSessions(prev => {
                return prev.map(s => {
                    if (s.id !== curSessionId) return s
                    return {
                        ...s,
                        messages: [...s.messages, botMessage]
                    }
                })
            })

            loadSessions(false)

        } catch (error) {
            console.error("Chatbot query error:", error)
            setIsTyping(false)

            const errorMessage = error?.data?.message || error?.message || "Connection error. Unable to reach the chatbot service."
            const botMessage = {
                id: `bot-err-${Date.now()}`,
                sender: "bot",
                content: `❌ **Error**: ${errorMessage}`,
                timestamp: new Date()
            }

            setSessions(prev => {
                return prev.map(s => {
                    if (s.id !== curSessionId) return s
                    return {
                        ...s,
                        messages: [...s.messages, botMessage]
                    }
                })
            })
        }
    }, [loadSessions])

    const deleteSession = useCallback(async (sessionId) => {
        if (!sessionId) return

        try {
            const res = await ApiCall("DELETE", `/chatbot/sessions/${sessionId}`)
            if (res?.data?.success) {
                setSessions(prev => prev.filter(s => s.id !== sessionId))
                const { activeSessionId: curActiveId } = stateRef.current
                if (curActiveId === sessionId) {
                    setSessions(prev => {
                        const filtered = prev.filter(s => s.id !== sessionId)
                        if (filtered.length > 0) {
                            setActiveSessionId(filtered[0].id)
                        } else {
                            startNewChat()
                        }
                        return prev
                    })
                }
            }
        } catch (err) {
            console.error("Failed to delete chatbot session:", err)
        }
    }, [startNewChat])

    const clearChat = useCallback(async () => {
        const { activeSessionId: curSessionId } = stateRef.current
        if (curSessionId) {
            await deleteSession(curSessionId)
        }
    }, [deleteSession])

    return {
        messages,
        role,
        tenant,
        isTyping,
        sessions,
        activeSessionId,
        sendMessage,
        switchSession,
        startNewChat,
        clearChat,
        deleteSession,
        handleAction,
        loadingHistory
    }
}
