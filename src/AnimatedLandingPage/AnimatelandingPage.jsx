import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ZCursorTracker from '../ZCursorTracker'

function ParticleCanvas({ mousePos }) {
    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const COLORS = [
            [71, 71, 241],   // indigo
            [9, 168, 236],   // sky blue
            [20, 243, 102],    // green
            [252, 15, 134],   // pink
            [255, 207, 11],   // yellow
        ]

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const COUNT = 500
        const CONNECT_DIST = 150
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
                color: color
            }
        })
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mousePos.current.x
            const my = mousePos.current.y
            const pts = particlesRef.current

            pts.forEach(p => {
                p.phase += p.wobbleSpeed
                p.x += Math.sin(p.phase) * 0.2

                p.x += p.vx
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
                if (p.y < -20) {
                    p.y = canvas.height + 20
                    p.x = Math.random() * canvas.width
                }

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

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            <ParticleCanvas mousePos={mousePos} />

            <div style={{
                position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                backgroundSize: '32px 32px',
            }} />

            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16 bg-white/90 shadow-sm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff', fontSize: 13, letterSpacing: '-0.5px',
                    }}>PPP</div>
                    {/* <span style={{ color: '#1e1b4b', fontWeight: 700, fontSize: 17 }}>
                        PeoplePro<span style={{ color: '#6366f1' }}>Plus</span>
                    </span> */}
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className='bg-indigo-600 text-white px-4 py-2 border-none rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer'>
                    Login →
                </button>
            </nav>

            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: 999, padding: '6px 18px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
                    color: '#4338ca', textTransform: 'uppercase',
                    marginBottom: 28,
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.7s ease',
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#6366f1', boxShadow: '0 0 8px #6366f1',
                        display: 'inline-block', animation: 'hrms-pulse 2s infinite',
                    }} />
                    {/* Human Resource Management System */}
                    Lorem ipsum dolor sit amet consectetur
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-950 leading-tight tracking-tight max-w-5xl">
                    {/* Manage Your Workforce */}
                    Lorem ipsum dolor sit amet
                    {/* <br />Smarter &amp; Faster */}
                    <br />Lorem ipsum &amp; dolor
                </h1>

                <p className="text-gray-500 text-lg max-w-3xl leading-relaxed mt-4">
                    {/* From punch-in to payslips — a complete HRMS platform for employees, HR teams, and payroll managers. Multi-tenant, secure, and lightning fast. */}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum sed nobis consequuntur voluptatem aperiam natus voluptate earum animi, maiores quia
                </p>

                <div
                    className='flex gap-5 flex-wrap justify-center mt-4'>
                    <button
                        onClick={() => navigate('/login')}
                        className='bg-indigo-600 text-white px-4 py-2 border-none rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer'>
                        Get Started →
                    </button>
                    <button className='bg-white text-indigo-600 px-4 py-2 border-none rounded-lg text-sm font-medium hover:bg-indigo-50 cursor-pointer'>
                        Learn More
                    </button>
                </div>
            </section>

            <ZCursorTracker />
        </div>
    )
}

export default AnimatelandingPage