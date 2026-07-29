import React, { useEffect, useState } from "react"
import ChatBotMain from "../components/ChatBotMain"

function ChatBotEntry() {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    const getCurrentUser = () => {
        try {
            return JSON.parse(sessionStorage.getItem("user") || "{}")
        } catch {
            return { name: "User" }
        }
    }
    const currentUser = getCurrentUser()
    return (
        <ChatBotMain
            isMobile={isMobile}
            setIsMobile={setIsMobile}
            currentUser={currentUser}
        />
    )
}

export default ChatBotEntry