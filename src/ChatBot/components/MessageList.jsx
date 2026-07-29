import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot } from "lucide-react"
import MessageItem from "./MessageItem"

function MessageList({ messages, isTyping, handleAction, user }) {
    const scrollBottomRef = useRef(null)

    useEffect(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isTyping])

    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar">
            <div className="max-w-4xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <MessageItem
                                msg={msg}
                                handleAction={handleAction}
                                user={user}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3.5 mb-5"
                    >
                        <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white border border-indigo-700 shadow-sm shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="bg-slate-50 border border-gray-150 rounded-3xl rounded-tl-sm px-5 py-3 shadow-sm flex items-center">
                            <div className="flex items-center gap-1.5">
                                {[0, 150, 300].map((delay) => (
                                    <span
                                        key={delay}
                                        className="w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block animate-bounce"
                                        style={{
                                            animationDelay: `${delay}ms`,
                                            animationDuration: "0.8s"
                                        }}
                                    />
                                ))}
                                <span className="text-xs text-gray-500 font-semibold ml-2">HRMS AI is writing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={scrollBottomRef} />
            </div>
        </div>
    )
}

export default MessageList
