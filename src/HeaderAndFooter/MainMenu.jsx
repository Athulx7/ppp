import React, { useEffect, useState, useCallback } from 'react'
import hrmsIllustration from '../assets/hrmsillustatrion.png'
import { useNavigate } from 'react-router-dom'
import { ApiCall, getRoleBasePath } from '../library/constants'
import { Star, Search, X, ArrowRight, Building2, LayoutGrid } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useFavourites } from './context/FavouritesContext'

const fadeUp = (delay = 0) => ({
    animation: `hrmsMenuFadeUp 0.32s ease both`,
    animationDelay: `${delay}ms`,
})

function getTheme(dark) {
    if (dark) return {
        overlay: 'var(--color-gray-100)',
        sidebarBg: 'var(--color-gray-50)',
        border: '1px solid var(--color-gray-200)',
        cardBg: 'var(--color-gray-200)',
        cardHoverBg: 'var(--color-gray-300)',
        cardBorder: '1px solid var(--color-gray-200)',
        cardHoverBorder: '1px solid var(--color-indigo-400)',
        text: 'var(--color-gray-900)',
        textSub: 'var(--color-gray-600)',
        textMuted: 'var(--color-gray-400)',
        searchBg: 'var(--color-gray-200)',
        searchBorder: '1px solid var(--color-gray-300)',
        pillActiveBg: 'var(--color-indigo-600)',
        pillActiveTxt: '#fff',
        pillBg: 'var(--color-gray-200)',
        pillTxt: 'var(--color-gray-700)',
        catActiveBg: 'var(--color-indigo-200)',
        catActiveTxt: 'var(--color-indigo-900)',
        catHoverBg: 'var(--color-gray-200)',
        catTxt: 'var(--color-gray-600)',
        dot: 'var(--color-indigo-400)',
        statBg: 'var(--color-gray-200)',
        favStatBg: 'rgba(245,158,11,0.10)',
        favStatTxt: '#f59e0b',
        footerBg: 'var(--color-gray-50)',
        kbdBg: 'var(--color-gray-200)',
        kbdBorder: '1px solid var(--color-gray-300)',
        btnBg: 'var(--color-gray-200)',
        btnBorder: '1px solid var(--color-gray-300)',
        favBtnActiveBg: 'rgba(245,158,11,0.15)',
        catBadgeBg: 'var(--color-indigo-200)',
        catBadgeTxt: 'var(--color-indigo-600)',
    }
    return {
        overlay: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#3730a3 70%,#4338ca 100%)',
        sidebarBg: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        cardBg: 'rgba(255,255,255,0.06)',
        cardHoverBg: 'rgba(255,255,255,0.13)',
        cardBorder: '1px solid rgba(255,255,255,0.08)',
        cardHoverBorder: '1px solid rgba(255,255,255,0.25)',
        text: 'rgba(255,255,255,0.93)',
        textSub: 'rgba(255,255,255,0.60)',
        textMuted: 'rgba(255,255,255,0.38)',
        searchBg: 'rgba(255,255,255,0.10)',
        searchBorder: '1px solid rgba(255,255,255,0.15)',
        pillActiveBg: '#fff',
        pillActiveTxt: '#3730a3',
        pillBg: 'rgba(255,255,255,0.10)',
        pillTxt: 'rgba(255,255,255,0.70)',
        catActiveBg: 'linear-gradient(135deg,#4f46e5,#6366f1)',
        catActiveTxt: '#fff',
        catHoverBg: 'rgba(255,255,255,0.09)',
        catTxt: 'rgba(255,255,255,0.58)',
        dot: 'rgba(165,180,252,0.70)',
        statBg: 'rgba(255,255,255,0.08)',
        favStatBg: 'rgba(245,158,11,0.12)',
        favStatTxt: '#fcd34d',
        footerBg: 'transparent',
        kbdBg: 'rgba(255,255,255,0.10)',
        kbdBorder: '1px solid rgba(255,255,255,0.15)',
        btnBg: 'rgba(255,255,255,0.10)',
        btnBorder: '1px solid rgba(255,255,255,0.15)',
        favBtnActiveBg: 'rgba(245,158,11,0.15)',
        catBadgeBg: 'rgba(129,140,248,0.20)',
        catBadgeTxt: 'rgba(165,180,252,0.90)',
    }
}

function Skeleton({ dark }) {
    return (
        <div style={{
            height: 82, borderRadius: 14,
            background: dark ? 'var(--color-gray-200)' : 'rgba(255,255,255,0.07)',
            animation: 'hrmsPulse 1.5s ease-in-out infinite',
        }} />
    )
}

function MainMenu({ onClose }) {
    const navigate = useNavigate()
    const { isDark: dark } = useTheme()
    const t = getTheme(dark)

    const { favRoutes, toggleFavourite } = useFavourites()

    const [loading, setLoading] = useState(false)
    const [menuData, setMenuData] = useState([])
    const [activeCategory, setActiveCategory] = useState('')
    const [search, setSearch] = useState('')
    const [showFavs, setShowFavs] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const h = (e) => { if (e.key === 'Escape') onClose?.() }
        window.addEventListener('keydown', h)
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', h) }
    }, [onClose])

    useEffect(() => {
        setLoading(true)
        ApiCall('GET', '/mainMenu')
            .then(res => {
                if (res?.data?.success) {
                    setMenuData(res.data.data)
                    setActiveCategory(res.data.data[0]?.category || '')
                }
            })
            .catch(err => console.error('menu load error', err))
            .finally(() => setLoading(false))
    }, [])

    const navigate_ = (route) => {
        navigate(`${getRoleBasePath()}${route}`)
        onClose?.()
    }

    const handleFavClick = useCallback((item, e) => {
        e.stopPropagation()
        toggleFavourite(item)
    }, [toggleFavourite])

    const allItems = menuData.flatMap(m => m.items.map(i => ({ ...i, category: m.category })))

    const visibleItems = search.trim()
        ? allItems.filter(i =>
            i.label.toLowerCase().includes(search.toLowerCase()) ||
            i.category.toLowerCase().includes(search.toLowerCase())
        )
        : showFavs
            ? allItems.filter(i => favRoutes.includes(i.routes))
            : menuData.find(m => m.category === activeCategory)?.items || []

    const heading = search.trim() ? `"${search}"` : showFavs ? 'Favourites' : activeCategory

    const inputStyle = {
        width: '100%', boxSizing: 'border-box',
        paddingLeft: 34, paddingRight: 34,
        paddingTop: 8, paddingBottom: 8,
        background: t.searchBg,
        border: t.searchBorder,
        borderRadius: 12,
        fontSize: 13,
        color: t.text,
        outline: 'none',
    }

    return (
        <>
            <style>{`
                @keyframes hrmsMenuFadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
                @keyframes hrmsOverlayIn   { from{opacity:0} to{opacity:1} }
                @keyframes hrmsPulse       { 0%,100%{opacity:1} 50%{opacity:0.45} }
                .hmcard { transition:background .16s,border-color .16s,transform .16s,box-shadow .16s; }
                .hmcard:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.18); }
                .hmcard:hover .hm-arr      { opacity:1!important; transform:translateX(0)!important; }
                .hmcard:hover .hm-favbtn   { opacity:1!important; }
                .hm-favbtn { transition:transform .15s,opacity .15s; }
                .hm-favbtn:hover { transform:scale(1.25)!important; }
                .hm-scroll::-webkit-scrollbar       { width:4px; height:4px; }
                .hm-scroll::-webkit-scrollbar-track { background:transparent; }
                .hm-scroll::-webkit-scrollbar-thumb { background:rgba(128,128,128,0.25); border-radius:4px; }
                .hm-grid {
                    display:grid; gap:10px;
                    grid-template-columns:repeat(1,1fr);
                }
                @media(min-width:520px)  { .hm-grid { grid-template-columns:repeat(2,1fr); } }
                @media(min-width:960px)  { .hm-grid { grid-template-columns:repeat(3,1fr); } }
                @media(min-width:1440px) { .hm-grid { grid-template-columns:repeat(4,1fr); } }
                #hm-sidebar { display:none!important; }
                #hm-right   { display:none!important; }
                @media(min-width:900px)  { #hm-sidebar { display:flex!important; flex-direction:column; } }
                @media(min-width:1300px) { #hm-right   { display:flex!important; flex-direction:column; } }
                @media(hover:none) { .hm-favbtn { opacity:0.75!important; } }
            `}</style>

            <div
                className="fixed inset-0 z-[999] flex flex-col"
                style={{ background: t.overlay, animation: 'hrmsOverlayIn 0.22s ease both' }}
            >
                <div style={{
                    ...fadeUp(0), flexShrink: 0,
                    display: 'flex', alignItems: 'center',
                    gap: 10, flexWrap: 'wrap',
                    padding: '12px 16px',
                    borderBottom: t.border,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: dark ? 'var(--color-indigo-200)' : 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Building2 size={16} color={dark ? 'var(--color-indigo-600)' : '#fff'} />
                        </div>
                        <span style={{ color: t.text, fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px' }}>PPP</span>
                        <span style={{ color: t.textMuted, fontSize: 12 }} className="hidden sm:inline">/ Navigation</span>
                    </div>

                    <div style={{ flex: 1, minWidth: 120, position: 'relative' }}>
                        <Search size={13} style={{
                            position: 'absolute', left: 10, top: '50%',
                            transform: 'translateY(-50%)', color: t.textMuted,
                        }} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setShowFavs(false) }}
                            placeholder="Search pages…"
                            style={inputStyle}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{
                                position: 'absolute', right: 8, top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: t.textMuted, display: 'flex', padding: 2,
                            }}>
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => { setShowFavs(p => !p); setSearch('') }}
                        style={{
                            flexShrink: 0,
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 13px', borderRadius: 11, fontSize: 12, fontWeight: 500,
                            cursor: 'pointer',
                            border: showFavs ? '1px solid #f59e0b' : t.btnBorder,
                            background: showFavs
                                ? (dark ? 'rgba(245,158,11,0.14)' : '#f59e0b')
                                : t.btnBg,
                            color: showFavs ? (dark ? '#f59e0b' : '#1e1b4b') : t.textSub,
                        }}
                    >
                        <Star size={12} style={{ fill: showFavs ? (dark ? '#f59e0b' : '#1e1b4b') : 'none' }} />
                        <span className="hidden sm:inline">Favourites</span>
                        {favRoutes.length > 0 && (
                            <span style={{
                                fontSize: 10, fontWeight: 700,
                                padding: '1px 5px', borderRadius: 20,
                                background: 'rgba(0,0,0,0.15)',
                                color: showFavs ? (dark ? '#f59e0b' : '#1e1b4b') : '#f59e0b',
                            }}>
                                {favRoutes.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            flexShrink: 0, width: 34, height: 34, borderRadius: 9,
                            background: t.btnBg, border: t.btnBorder, color: t.textSub,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                    {!search && !showFavs && (
                        <div
                            id="hm-sidebar"
                            className="hm-scroll"
                            style={{
                                ...fadeUp(70),
                                width: 210, flexShrink: 0,
                                borderRight: t.border,
                                background: t.sidebarBg,
                                padding: '18px 10px',
                                overflowY: 'auto',
                            }}
                        >
                            <p style={{
                                fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                                letterSpacing: '0.08em', color: t.textMuted,
                                marginBottom: 10, paddingLeft: 8,
                            }}>Categories</p>

                            {menuData.map((menu, i) => {
                                const isActive = activeCategory === menu.category
                                return (
                                    <button
                                        key={menu.category}
                                        onClick={() => setActiveCategory(menu.category)}
                                        style={{
                                            ...fadeUp(90 + i * 22),
                                            width: '100%', textAlign: 'left',
                                            padding: '9px 11px', borderRadius: 10,
                                            fontSize: 13, fontWeight: isActive ? 600 : 400,
                                            background: isActive ? t.catActiveBg : 'transparent',
                                            color: isActive ? t.catActiveTxt : t.catTxt,
                                            border: 'none', cursor: 'pointer', marginBottom: 2,
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.catHoverBg }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                                    >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {menu.category}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                                            {menu.items.some(it => favRoutes.includes(it.routes)) && (
                                                <Star size={9} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                            )}
                                            <span style={{
                                                fontSize: 10, fontWeight: 700,
                                                padding: '1px 6px', borderRadius: 8,
                                                background: isActive
                                                    ? (dark ? 'rgba(129,140,248,0.25)' : 'rgba(255,255,255,0.20)')
                                                    : (dark ? 'var(--color-gray-300)' : 'rgba(255,255,255,0.10)'),
                                                color: isActive ? t.catActiveTxt : t.textMuted,
                                            }}>
                                                {menu.items.length}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <div
                        className="hm-scroll"
                        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
                    >
                        {!search && !showFavs && menuData.length > 0 && (
                            <div
                                className="hm-scroll sm-only-pills"
                                style={{
                                    flexShrink: 0, display: 'flex', gap: 6,
                                    padding: '12px 14px 0', overflowX: 'auto',
                                }}
                            >
                                {menuData.map(menu => {
                                    const isActive = activeCategory === menu.category
                                    return (
                                        <button
                                            key={menu.category}
                                            onClick={() => setActiveCategory(menu.category)}
                                            style={{
                                                flexShrink: 0,
                                                padding: '6px 14px', borderRadius: 20,
                                                fontSize: 12, fontWeight: isActive ? 600 : 400,
                                                border: 'none', cursor: 'pointer',
                                                background: isActive ? t.pillActiveBg : t.pillBg,
                                                color: isActive ? t.pillActiveTxt : t.pillTxt,
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                transition: 'all 0.14s ease',
                                            }}
                                        >
                                            {menu.category}
                                            {menu.items.some(it => favRoutes.includes(it.routes)) && (
                                                <Star size={9} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        <div style={{
                            ...fadeUp(110), flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 18px 10px',
                        }}>
                            <div>
                                <h2 style={{ fontSize: 17, fontWeight: 700, color: t.text, margin: 0 }}>{heading}</h2>
                                <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                                    {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
                                </p>
                            </div>
                            {!showFavs && !search && favRoutes.length > 0 && (
                                <button onClick={() => setShowFavs(true)} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    fontSize: 11, color: '#f59e0b',
                                    background: 'rgba(245,158,11,0.10)',
                                    border: '1px solid rgba(245,158,11,0.20)',
                                    padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                                }}>
                                    <Star size={10} style={{ fill: '#f59e0b' }} /> {favRoutes.length} saved
                                </button>
                            )}
                        </div>

                        {loading && (
                            <div className="hm-grid" style={{ padding: '0 14px 20px' }}>
                                {[...Array(9)].map((_, i) => <Skeleton key={i} dark={dark} />)}
                            </div>
                        )}

                        {!loading && visibleItems.length === 0 && (
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                padding: '60px 24px', color: t.textMuted, textAlign: 'center',
                            }}>
                                {showFavs ? (
                                    <>
                                        <Star size={34} style={{ marginBottom: 12, opacity: 0.3 }} />
                                        <p style={{ fontSize: 14, fontWeight: 500 }}>No favourites yet</p>
                                        <p style={{ fontSize: 12, marginTop: 4 }}>Hover any card and click ★ to save it</p>
                                    </>
                                ) : (
                                    <>
                                        <Search size={34} style={{ marginBottom: 12, opacity: 0.3 }} />
                                        <p style={{ fontSize: 14, fontWeight: 500 }}>No results for "{search}"</p>
                                    </>
                                )}
                            </div>
                        )}

                        {!loading && visibleItems.length > 0 && (
                            <div className="hm-grid" style={{ ...fadeUp(130), padding: '0 14px 24px' }}>
                                {visibleItems.map((item, i) => {
                                    const isFav = favRoutes.includes(item.routes)
                                    return (
                                        <div
                                            key={item.routes}
                                            className="hmcard"
                                            style={{
                                                ...fadeUp(140 + Math.min(i, 8) * 18),
                                                position: 'relative',
                                                background: t.cardBg,
                                                border: t.cardBorder,
                                                borderRadius: 14,
                                                padding: '14px 14px 12px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => navigate_(item.routes)}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = t.cardHoverBg
                                                e.currentTarget.style.border = t.cardHoverBorder
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = t.cardBg
                                                e.currentTarget.style.border = t.cardBorder
                                            }}
                                        >
                                            <button
                                                className="hm-favbtn"
                                                onClick={e => handleFavClick(item, e)}
                                                style={{
                                                    position: 'absolute', top: 10, right: 10,
                                                    padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                                                    background: isFav ? t.favBtnActiveBg : t.btnBg,
                                                    color: isFav ? '#f59e0b' : t.textMuted,
                                                    opacity: isFav ? 1 : 0,
                                                    display: 'flex',
                                                }}
                                            >
                                                <Star size={12} style={{ fill: isFav ? '#f59e0b' : 'none' }} />
                                            </button>

                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingRight: 28 }}>
                                                <div style={{
                                                    marginTop: 5, width: 7, height: 7,
                                                    borderRadius: '50%', background: t.dot, flexShrink: 0,
                                                }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <span style={{
                                                            fontSize: 13, fontWeight: 600, color: t.text,
                                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                        }}>
                                                            {item.label}
                                                        </span>
                                                        <ArrowRight
                                                            size={12}
                                                            className="hm-arr"
                                                            style={{
                                                                flexShrink: 0, color: t.textSub,
                                                                opacity: 0, transform: 'translateX(-5px)',
                                                                transition: 'opacity .18s,transform .18s',
                                                            }}
                                                        />
                                                    </div>
                                                    <p style={{
                                                        marginTop: 4, fontSize: 11, color: t.textMuted,
                                                        lineHeight: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}>
                                                        {item.description || `Manage ${item.label.toLowerCase()} and related settings`}
                                                    </p>
                                                    {(search || showFavs) && item.category && (
                                                        <span style={{
                                                            marginTop: 6, display: 'inline-block',
                                                            fontSize: 10, fontWeight: 600,
                                                            padding: '2px 7px', borderRadius: 6,
                                                            background: t.catBadgeBg,
                                                            color: t.catBadgeTxt,
                                                        }}>
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div
                        id="hm-right"
                        style={{
                            ...fadeUp(50),
                            width: 190, flexShrink: 0,
                            borderLeft: t.border,
                            background: t.sidebarBg,
                            padding: '24px 14px',
                            alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <img
                            src={hrmsIllustration}
                            alt="HRMS"
                            style={{
                                width: '100%', objectFit: 'contain',
                                opacity: dark ? 0.65 : 0.9,
                                filter: dark ? 'brightness(0.8) saturate(0.65)' : 'none',
                            }}
                        />
                        {!loading && menuData.length > 0 && (
                            <div style={{ marginTop: 18, width: '100%' }}>
                                {[
                                    { label: 'Modules', val: menuData.length, bg: t.statBg, color: t.text },
                                    { label: 'Total Pages', val: allItems.length, bg: t.statBg, color: t.text },
                                    { label: 'Favourites', val: favRoutes.length, bg: t.favStatBg, color: t.favStatTxt },
                                ].map(s => (
                                    <div key={s.label} style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '7px 11px', borderRadius: 9,
                                        background: s.bg, marginBottom: 5,
                                    }}>
                                        <span style={{ fontSize: 11, color: t.textMuted }}>{s.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14,
                    padding: '9px 18px',
                    borderTop: t.border,
                    background: t.footerBg,
                    fontSize: 11, color: t.textMuted,
                }}>
                    <span>
                        <kbd style={{
                            padding: '2px 7px', borderRadius: 5,
                            background: t.kbdBg, border: t.kbdBorder,
                            fontFamily: 'monospace', fontSize: 11, color: t.textSub,
                        }}>Esc</kbd>
                        {' '}to close
                    </span>
                    <span className="hidden sm:inline">Click ★ on any card to save favourites</span>
                    <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <LayoutGrid size={12} /> HRMS
                    </span>
                </div>

                <style>{`
                    @media(min-width:900px) { .sm-only-pills { display:none!important; } }
                `}</style>
            </div>
        </>
    )
}

export default MainMenu