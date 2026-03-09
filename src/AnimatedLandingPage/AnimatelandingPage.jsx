import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Indigo-500 palette tokens ──────────────────────────────────────
// Primary:   #6366f1  (indigo-500)
// Dark:      #4338ca  (indigo-700)
// Light bg:  #eef2ff  (indigo-50)
// Mid bg:    #e0e7ff  (indigo-100)
// Text dark: #1e1b4b  (indigo-950)
// Text mid:  #4338ca  (indigo-700)

/* ─── Particle Canvas Background ─────────────────────────────────── */
function ParticleCanvas({ mousePos }) {
    const canvasRef = useRef(null)
    const particlesRef = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const COUNT = 80
        particlesRef.current = Array.from({ length: COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2.2 + 0.6,
            alpha: Math.random() * 0.45 + 0.15,
        }))

        const CONNECT_DIST = 130
        const MOUSE_REPEL = 110

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const mx = mousePos.current.x
            const my = mousePos.current.y

            const pts = particlesRef.current
            pts.forEach(p => {
                const dx = p.x - mx
                const dy = p.y - my
                const d = Math.sqrt(dx * dx + dy * dy)
                if (d < MOUSE_REPEL && d > 0) {
                    const force = (MOUSE_REPEL - d) / MOUSE_REPEL
                    p.vx += (dx / d) * force * 0.55
                    p.vy += (dy / d) * force * 0.55
                }
                p.vx *= 0.98
                p.vy *= 0.98
                p.x += p.vx
                p.y += p.vy

                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0

                // indigo-500 dots
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(99,102,241,${p.alpha})`
                ctx.fill()
            })

            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x
                    const dy = pts[i].y - pts[j].y
                    const d = Math.sqrt(dx * dx + dy * dy)
                    if (d < CONNECT_DIST) {
                        ctx.beginPath()
                        ctx.moveTo(pts[i].x, pts[i].y)
                        ctx.lineTo(pts[j].x, pts[j].y)
                        ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - d / CONNECT_DIST)})`
                        ctx.lineWidth = 0.8
                        ctx.stroke()
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        />
    )
}

/* ─── Floating gradient orbs (indigo palette) ────────────────────── */
function FloatingOrbs({ mousePos }) {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const rafRef = useRef(null)
    const smooth = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const animate = () => {
            smooth.current.x += (mousePos.current.x - smooth.current.x) * 0.05
            smooth.current.y += (mousePos.current.y - smooth.current.y) * 0.05
            setPos({ x: smooth.current.x, y: smooth.current.y })
            rafRef.current = requestAnimationFrame(animate)
        }
        animate()
        return () => cancelAnimationFrame(rafRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const nx = (pos.x / window.innerWidth - 0.5) * 70
    const ny = (pos.y / window.innerHeight - 0.5) * 70

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            {/* primary indigo orb */}
            <div style={{
                position: 'absolute', width: 620, height: 620, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
                top: `calc(15% + ${ny}px)`, left: `calc(8% + ${nx}px)`,
                transform: 'translate(-50%,-50%)', filter: 'blur(2px)',
            }} />
            {/* secondary lighter orb */}
            <div style={{
                position: 'absolute', width: 520, height: 520, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 70%)',
                bottom: `calc(10% - ${ny * 0.6}px)`, right: `calc(6% - ${nx * 0.6}px)`,
                transform: 'translate(50%,50%)', filter: 'blur(2px)',
            }} />
            {/* soft accent top-right */}
            <div style={{
                position: 'absolute', width: 360, height: 360, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(199,210,254,0.22) 0%, transparent 70%)',
                top: `calc(5% + ${ny * 0.3}px)`, right: `calc(15% + ${nx * 0.3}px)`,
                transform: 'translate(50%,-50%)', filter: 'blur(3px)',
            }} />
        </div>
    )
}

/* ─── Feature card (white card, indigo accents) ──────────────────── */
function FeatureCard({ icon, title, desc, delay }) {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay)
        return () => clearTimeout(t)
    }, [delay])

    return (
        <div style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(99,102,241,0.18)',
            borderRadius: 16, padding: '24px 20px',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, opacity 0.6s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(99,102,241,0.18)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.07)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.18)'
            }}
        >
            <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
            <div style={{ color: '#1e1b4b', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
            <div style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.7 }}>{desc}</div>
        </div>
    )
}

/* ─── Role badge (indigo only) ───────────────────────────────────── */
function RoleBadge({ label }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.28)',
            borderRadius: 999, padding: '4px 13px',
            fontSize: 12, fontWeight: 600,
            color: '#4338ca', letterSpacing: '0.3px',
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#6366f1',
                boxShadow: '0 0 6px rgba(99,102,241,0.7)',
                display: 'inline-block',
            }} />
            {label}
        </span>
    )
}

/* ─── Main Landing Page ──────────────────────────────────────────── */
function AnimatelandingPage() {
    const navigate = useNavigate()
    const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const [heroVisible, setHeroVisible] = useState(false)
    const [btnHover, setBtnHover] = useState(false)

    useEffect(() => {
        const move = e => { mousePos.current = { x: e.clientX, y: e.clientY } }
        window.addEventListener('mousemove', move)
        const t = setTimeout(() => setHeroVisible(true), 100)
        return () => { window.removeEventListener('mousemove', move); clearTimeout(t) }
    }, [])

    const features = [
        { icon: '⏱️', title: 'Punch In / Punch Out', desc: 'Real-time attendance tracking with geo-tagged clock in/out for every employee.' },
        { icon: '📅', title: 'Leave Management', desc: 'Apply, approve, and track leaves with multi-level workflow automation.' },
        { icon: '📆', title: 'My Calendar', desc: 'Personal calendar showing holidays, shifts, leaves, and upcoming events.' },
        { icon: '💰', title: 'Payslips & CTC', desc: 'Instant digital payslips, CTC breakdowns, and salary structure visibility.' },
        { icon: '📊', title: 'Payroll Runs', desc: 'Automated payroll processing with components, advances, and deductions.' },
        { icon: '🏢', title: 'Multi-Tenant', desc: 'Isolated database per client ensures full data privacy and scalability.' },
    ]

    return (
        <div style={{
            minHeight: '100vh',
            // White base with a very subtle indigo tint at top
            background: 'linear-gradient(165deg, #eef2ff 0%, #ffffff 40%, #f5f7ff 100%)',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background layers */}
            <ParticleCanvas mousePos={mousePos} />
            <FloatingOrbs mousePos={mousePos} />

            {/* Subtle dot grid overlay */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                backgroundImage: `radial-gradient(rgba(99,102,241,0.1) 1px, transparent 1px)`,
                backgroundSize: '32px 32px',
            }} />

            {/* ── Navbar ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 48px', height: 64,
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(99,102,241,0.12)',
                boxShadow: '0 2px 20px rgba(99,102,241,0.06)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                        borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff', fontSize: 13, letterSpacing: '-0.5px',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                    }}>PPP</div>
                    <span style={{ color: '#1e1b4b', fontWeight: 700, fontSize: 17 }}>
                        PeoplePro<span style={{ color: '#6366f1' }}>Plus</span>
                    </span>
                </div>

                {/* Role badges */}
                <div style={{ display: 'flex', gap: 8 }}>
                    {['Admin', 'HR', 'Payroll', 'Employee'].map(r => <RoleBadge key={r} label={r} />)}
                </div>

                {/* Login CTA */}
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                        color: '#fff', border: 'none', borderRadius: 8,
                        padding: '9px 22px', fontWeight: 600, fontSize: 13,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)' }}
                >
                    Login →
                </button>
            </nav>

            {/* ── Hero Section ── */}
            <section style={{
                position: 'relative', zIndex: 10,
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center',
                padding: '120px 24px 80px',
            }}>
                {/* Eyebrow badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(99,102,241,0.08)',
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
                    Human Resource Management System
                </div>

                {/* Headline */}
                <h1 style={{
                    fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                    fontWeight: 800, lineHeight: 1.1,
                    color: '#1e1b4b', margin: '0 0 16px',
                    letterSpacing: '-1.5px', maxWidth: 820,
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.8s ease 0.1s',
                }}>
                    Manage Your{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 60%, #4338ca 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Workforce
                    </span>
                    <br />Smarter &amp; Faster
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: '#6b7280', maxWidth: 560,
                    lineHeight: 1.75, margin: '0 0 44px', fontWeight: 400,
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.2s',
                }}>
                    From punch-in to payslips — a complete HRMS platform for employees, HR teams, and payroll managers. Multi-tenant, secure, and lightning fast.
                </p>

                {/* CTA buttons */}
                <div style={{
                    display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center',
                    opacity: heroVisible ? 1 : 0,
                    transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.3s',
                }}>
                    <button
                        onClick={() => navigate('/')}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => setBtnHover(false)}
                        style={{
                            background: btnHover
                                ? 'linear-gradient(135deg, #4338ca, #3730a3)'
                                : 'linear-gradient(135deg, #6366f1, #4338ca)',
                            color: '#fff', border: 'none', borderRadius: 10,
                            padding: '13px 36px', fontWeight: 700, fontSize: 15,
                            cursor: 'pointer',
                            boxShadow: btnHover
                                ? '0 12px 36px rgba(99,102,241,0.5)'
                                : '0 6px 20px rgba(99,102,241,0.35)',
                            transform: btnHover ? 'translateY(-2px)' : 'translateY(0)',
                            transition: 'all 0.2s ease',
                        }}>
                        Get Started →
                    </button>
                    <button
                        style={{
                            background: '#fff',
                            color: '#4338ca',
                            border: '1.5px solid rgba(99,102,241,0.35)',
                            borderRadius: 10, padding: '13px 32px',
                            fontWeight: 600, fontSize: 15, cursor: 'pointer',
                            boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.08)' }}
                    >
                        Learn More
                    </button>
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'flex', gap: 52, marginTop: 64, flexWrap: 'wrap', justifyContent: 'center',
                    opacity: heroVisible ? 1 : 0,
                    transition: 'all 0.9s ease 0.5s',
                }}>
                    {[
                        { value: '4 Roles', label: 'Access Levels' },
                        { value: '100%', label: 'Multi-Tenant' },
                        { value: 'Real-time', label: 'Attendance' },
                        { value: 'Secure', label: 'JWT Auth' },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#4338ca', letterSpacing: '-0.5px' }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Feature Grid ── */}
            <section style={{
                position: 'relative', zIndex: 10,
                padding: '80px 48px 120px',
                maxWidth: 1100, margin: '0 auto',
            }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <h2 style={{
                        fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
                        fontWeight: 800, color: '#1e1b4b',
                        letterSpacing: '-0.8px', margin: 0,
                    }}>
                        Everything Your Team Needs
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: 15, marginTop: 10 }}>
                        Powerful features designed for modern HR operations
                    </p>
                    {/* indigo underline accent */}
                    <div style={{
                        width: 56, height: 3, borderRadius: 99,
                        background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                        margin: '14px auto 0',
                    }} />
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 20,
                }}>
                    {features.map((f, i) => (
                        <FeatureCard key={i} {...f} delay={200 + i * 100} />
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{
                position: 'relative', zIndex: 10,
                textAlign: 'center', padding: '28px 24px',
                borderTop: '1px solid rgba(99,102,241,0.12)',
                color: '#9ca3af', fontSize: 13,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
            }}>
                © 2025 PeopleProPlus · HRMS · Built with ❤️
            </footer>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes hrms-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
        </div>
    )
}

export default AnimatelandingPage