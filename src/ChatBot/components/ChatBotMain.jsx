import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useChatBot } from "../hooks/useChatBot"
import { getRoleBasePath } from "../../library/constants"
import ChatSidebar from "./ChatSidebar"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"

function ChatBotMain({ isDrawer = false, onClose, isMobile, currentUser }) {
    const navigate = useNavigate()
    const {
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
        handleAction
    } = useChatBot()

    const [isSidebarOpen, setIsSidebarOpen] = useState(!isDrawer)

    useEffect(() => {
        if (isDrawer) return

        const mainEl = document.querySelector("main")
        if (mainEl) {
            const originalOverflow = mainEl.style.overflow
            mainEl.style.overflow = "hidden"
            return () => {
                mainEl.style.overflow = originalOverflow
            }
        }
    }, [isDrawer])

    const handleNavigateFullPage = () => {
        const basePath = getRoleBasePath()
        navigate(`${basePath}/chatbot`)
        if (onClose) onClose()
    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        } else {
            navigate(-1)
        }
    }

    if (isMobile) {
        return (
            <div className={`flex w-full h-full bg-white overflow-hidden relative ${isDrawer ? "border border-gray-200 md:-m-6 mt-2 rounded-3xl" : ""}`}>
                {isSidebarOpen ? (
                    <ChatSidebar
                        sessions={sessions}
                        activeSessionId={activeSessionId}
                        switchSession={switchSession}
                        startNewChat={startNewChat}
                        sendMessage={sendMessage}
                        deleteSession={deleteSession}
                        role={role}
                        isMobile={true}
                        onToggleSidebar={() => setIsSidebarOpen(false)}
                    />
                ) : (
                    <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden">
                        <ChatHeader
                            connected={true}
                            role={role}
                            tenant={tenant}
                            clearChat={clearChat}
                            onToggleSidebar={() => setIsSidebarOpen(true)}
                            isSidebarOpen={isSidebarOpen}
                            isDrawer={isDrawer}
                            onClose={handleClose}
                            isMobile={true}
                            onNavigateFullPage={handleNavigateFullPage}
                        />

                        <MessageList
                            messages={messages}
                            isTyping={isTyping}
                            handleAction={handleAction}
                            user={currentUser}
                        />

                        <ChatInput
                            sendMessage={sendMessage}
                            isTyping={isTyping}
                            role={role}
                        />
                    </div>
                )}
            </div>
        )
    }

    const containerClasses = isDrawer
        ? `flex h-full overflow-hidden bg-white relative transition-all duration-350 ease-in-out ${isSidebarOpen ? "w-[780px]" : "w-[460px]"}`
        : "flex h-screen w-screen bg-white overflow-hidden relative"

    return (
        <div className={containerClasses}>
            <AnimatePresence initial={false}>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden h-full shrink-0 border-r border-gray-200"
                    >
                        <div className="w-80 h-full">
                            <ChatSidebar
                                sessions={sessions}
                                activeSessionId={activeSessionId}
                                switchSession={switchSession}
                                startNewChat={startNewChat}
                                sendMessage={sendMessage}
                                deleteSession={deleteSession}
                                role={role}
                                isMobile={false}
                                onToggleSidebar={() => setIsSidebarOpen(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col h-full bg-slate-50/30 overflow-hidden">
                <ChatHeader
                    connected={true}
                    role={role}
                    tenant={tenant}
                    clearChat={clearChat}
                    onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                    isSidebarOpen={isSidebarOpen}
                    isDrawer={isDrawer}
                    onClose={handleClose}
                    isMobile={false}
                    onNavigateFullPage={handleNavigateFullPage}
                />

                <MessageList
                    messages={messages}
                    isTyping={isTyping}
                    handleAction={handleAction}
                    user={currentUser}
                />

                <ChatInput
                    sendMessage={sendMessage}
                    isTyping={isTyping}
                    role={role}
                />
            </div>
        </div>
    )
}

export default ChatBotMain