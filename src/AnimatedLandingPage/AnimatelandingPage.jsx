import React, { useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ZCursorTracker from '../ZCursorTracker'
import { usePwaInstall } from '../usePwaInstall'

function ParticleCanvas({ mousePos }) {
    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const COLORS = [
            [71, 71, 241],
            [9, 168, 236],
            [20, 243, 102],
            [252, 15, 134],
            [255, 207, 11],
        ]

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const COUNT = 500
        const MOUSE_REPEL = 150

        particlesRef.current = Array.from({ length: COUNT }, () => {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)]
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.5 - 0.2,
                r: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.5 + 0.1,
                phase: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02,
                color,
            }
        })
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mousePos.current.x
            const my = mousePos.current.y
            const pts = particlesRef.current

            pts.forEach(p => {
                p.phase += p.wobbleSpeed
                p.x += Math.sin(p.phase) * 0.2 + p.vx
                p.y += p.vy

                const dx = p.x - mx
                const dy = p.y - my
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < MOUSE_REPEL) {
                    const angle = Math.atan2(dy, dx)
                    const force = (MOUSE_REPEL - d) / MOUSE_REPEL
                    p.x += Math.cos(angle) * force * 4
                    p.y += Math.sin(angle) * force * 4
                }

                if (p.x < -20) p.x = canvas.width + 20
                if (p.x > canvas.width + 20) p.x = -20
                if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                // ctx.fillStyle = `rgba(99,102,241,${p.alpha})`
                ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha})`
                ctx.fill()
            })

            // for (let i = 0; i < pts.length; i++) {
            //     for (let j = i + 1; j < pts.length; j++) {
            //         const dx = pts[i].x - pts[j].x
            //         const dy = pts[i].y - pts[j].y
            //         const d = Math.sqrt(dx * dx + dy * dy)
            //         if (d < CONNECT_DIST) {
            //             ctx.beginPath()
            //             ctx.moveTo(pts[i].x, pts[i].y)
            //             ctx.lineTo(pts[j].x, pts[j].y)
            //             ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - d / CONNECT_DIST)})`
            //             ctx.lineWidth = 0.8
            //             ctx.stroke()
            //         }
            //     }
            // }

            animRef.current = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animRef.current)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        />
    )
}

const WORDS = ['Smarter', 'Faster', 'Simpler']
function TypeWriter() {
    const [wordIdx, setWordIdx] = useState(0)
    const [text, setText] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const word = WORDS[wordIdx]
        let timer
        if (!deleting && text.length < word.length) {
            timer = setTimeout(() => setText(word.slice(0, text.length + 1)), 90)
        } else if (!deleting && text.length === word.length) {
            timer = setTimeout(() => setDeleting(true), 1600)
        } else if (deleting && text.length > 0) {
            timer = setTimeout(() => setText(text.slice(0, -1)), 50)
        } else {
            setDeleting(false)
            setWordIdx(i => (i + 1) % WORDS.length)
        }
        return () => clearTimeout(timer)
    }, [text, deleting, wordIdx])

    return (
        <span style={{ color: '#6366f1' }}>
            {text}
            <span style={{
                display: 'inline-block', width: 3, height: '0.85em',
                background: '#6366f1', marginLeft: 2, verticalAlign: 'middle',
                animation: 'lp-cursor 1s step-end infinite',
            }} />
        </span>
    )
}

function PwaInstallButton() {
    const { isInstallable, install } = usePwaInstall()
    if (!isInstallable) return null
    return (
        <button
            onClick={install}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-50 cursor-pointer transition-colors"
        >
            <Download className="h-4 w-4" />
            Install App
        </button>
    )
}

function AnimatelandingPage() {
    const navigate = useNavigate()
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [heroVisible, setHeroVisible] = useState(false)

    useEffect(() => {
        const move = e => { mousePos.current = { x: e.clientX, y: e.clientY } }
        window.addEventListener('mousemove', move)
        const t = setTimeout(() => setHeroVisible(true), 100)
        return () => { window.removeEventListener('mousemove', move); clearTimeout(t) }
    }, [])

    const fade = (delay = 0) => ({
        opacity: heroVisible ? 1 : 0,
        transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    })

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f9fafb',
            backgroundImage: `linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
        }}>
            <style>{`
                @keyframes lp-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes lp-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 60%{box-shadow:0 0 0 6px rgba(99,102,241,0)} }
            `}</style>

            <ParticleCanvas mousePos={mousePos} />

            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 h-16 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{
                        width: 34, height: 34,
                        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                        borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff', fontSize: 12, letterSpacing: '-0.3px',
                        boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
                    }}>PPP</div>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#1e1b4b' }}>
                        People<span style={{ color: '#6366f1' }}>Pro</span>Plus
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <PwaInstallButton />
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 border-none rounded-lg text-sm font-medium cursor-pointer transition-colors"
                    >
                        Login →
                    </button>
                </div>
            </nav>

            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">

                <div style={{
                    ...fade(0),
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: 999, padding: '6px 18px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
                    color: '#4338ca', textTransform: 'uppercase',
                    marginBottom: 28,
                    background: 'rgba(99,102,241,0.05)',
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#6366f1', boxShadow: '0 0 8px #6366f1',
                        display: 'inline-block', animation: 'lp-pulse 2s infinite',
                    }} />
                    Human Resource Management System
                </div>

                <h1 style={{
                    ...fade(0.15),
                    fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                    fontWeight: 900, color: '#1e1b4b',
                    lineHeight: 1.13, letterSpacing: '-1.2px',
                    maxWidth: 780, margin: '0 auto',
                }}>
                    Manage Your Workforce&nbsp;<br />
                    <TypeWriter />
                </h1>

                <p style={{ ...fade(0.3) }} className="text-gray-500 text-lg max-w-2xl leading-relaxed mt-4">
                    From punch-in to payslips — a complete HRMS platform for employees,
                    HR teams, and payroll managers. Multi-tenant, secure, and fast.
                </p>

                <div style={{ ...fade(0.45) }} className="flex gap-4 flex-wrap justify-center mt-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 border-none rounded-lg text-sm font-semibold cursor-pointer transition-colors"
                        style={{ boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
                    >
                        Get Started →
                    </button>
                    <PwaInstallButton />
                </div>
            </section>

            <div className="hidden sm:block">
                <ZCursorTracker />
            </div>
        </div>
    )
}

export default AnimatelandingPage