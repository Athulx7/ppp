import React, { useEffect, useRef, useState } from "react"

function ZCursorTracker() {
    const mouse = useRef({ x: 0, y: 0 })
    const cursor = useRef({ x: 0, y: 0 })

    const [renderPos, setRenderPos] = useState({ x: 0, y: 0 })
    const [inner, setInner] = useState({ x: 0, y: 0 })

    const OUTER_RADIUS = 20
    const INNER_RADIUS = 10
    const MAX_DISTANCE = OUTER_RADIUS - INNER_RADIUS
    const LAG = 0.11

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY }

            const dx = e.movementX
            const dy = e.movementY
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist > 0) {
                const clamped = Math.min(dist, MAX_DISTANCE)
                setInner({
                    x: (dx / dist) * clamped,
                    y: (dy / dist) * clamped,
                })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        const animate = () => {
            cursor.current.x += (mouse.current.x - cursor.current.x) * LAG
            cursor.current.y += (mouse.current.y - cursor.current.y) * LAG
            setRenderPos({
                x: cursor.current.x,
                y: cursor.current.y,
            })

            requestAnimationFrame(animate)
        }

        animate()

        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div style={{
            position: "fixed", top: renderPos.y, left: renderPos.x, transform: "translate(-50%, -50%)",
            width: 35, height: 35, borderRadius: "50%", border: "2px solid #4f39f6", pointerEvents: "none", zIndex: 9999,
        }}
        >
            <div style={{
                position: "absolute", top: "50%", left: "50%", width: 10, height: 10,
                borderRadius: "50%", background: "#322f4b", transform: `translate(${inner.x}px, ${inner.y}px) translate(-50%, -50%)`,
                transition: "transform 0.06s ease-out",
            }}
            />
        </div>
    )
}

export default ZCursorTracker
