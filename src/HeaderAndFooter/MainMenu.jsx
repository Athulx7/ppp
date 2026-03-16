import React, { useEffect, useState, useCallback } from 'react';
import hrmsIllustration from '../assets/hrmsillustatrion.png';
import { useNavigate } from 'react-router-dom';
import { ApiCall, getRoleBasePath } from '../library/constants';
import { Star, Search, X, ArrowRight, ChevronRight, Layers, Building2 } from 'lucide-react';

const FAV_KEY = 'hrms_menu_favourites';
function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
    catch { return []; }
}
function saveFavs(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

const fadeUp = (delay = 0) => ({
    animation: `hrmsMenuFadeUp 0.35s ease both`,
    animationDelay: `${delay}ms`,
});

function MainMenu({ onClose }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [menuData, setMenuData] = useState([])
    const [activeCategory, setActiveCategory] = useState('')
    const [search, setSearch] = useState('')
    const [favourites, setFavourites] = useState(loadFavs)
    const [showFavs, setShowFavs] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = 'auto' }
    }, [])

    useEffect(() => { loadMenuList(); }, [])

    const loadMenuList = async () => {
        setIsLoading(true)
        try {
            const result = await ApiCall('GET', '/mainMenu')
            if (result?.data?.success) {
                setMenuData(result.data.data);
                setActiveCategory(result.data.data[0]?.category || '')
            }
        } catch (err) {
            console.error('menu load error:', err)
        }
        setIsLoading(false)
    }

    const handleNavigate = (routePath) => {
        const basePath = getRoleBasePath()
        navigate(`${basePath}${routePath}`)
        onClose?.();
    }

    const toggleFavourite = useCallback((route, e) => {
        e.stopPropagation()
        setFavourites(prev => {
            const next = prev.includes(route)
                ? prev.filter(r => r !== route)
                : [...prev, route]
            saveFavs(next)
            return next
        })
    }, [])

    const allItems = menuData.flatMap(m => m.items.map(i => ({ ...i, category: m.category })))

    const searchResults = search.trim().length > 0
        ? allItems.filter(i =>
            i.label.toLowerCase().includes(search.toLowerCase()) ||
            i.category.toLowerCase().includes(search.toLowerCase())
        )
        : []

    const favItems = allItems.filter(i => favourites.includes(i.routes))

    const visibleItems = search.trim()
        ? searchResults
        : showFavs
            ? favItems
            : menuData.find(m => m.category === activeCategory)?.items || []

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose?.() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <>
            <style>{`
                @keyframes hrmsMenuFadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes hrmsOverlayIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .hrms-menu-item:hover .hrms-item-arrow { opacity: 1; transform: translateX(0); }
                .hrms-item-arrow { opacity: 0; transform: translateX(-6px); transition: all 0.2s ease; }
                .fav-btn { transition: transform 0.15s ease, color 0.15s ease; }
                .fav-btn:hover { transform: scale(1.2); }
                .fav-btn.active { color: #f59e0b; }
                .cat-btn.active { background: linear-gradient(135deg, #4f46e5, #6366f1); color: white; box-shadow: 0 4px 14px rgba(79,70,229,0.35); }
                .cat-btn { transition: all 0.18s ease; }
            `}</style>

            <div
                className="fixed inset-0 z-[999] flex flex-col"
                style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 70%, #4338ca 100%)',
                    animation: 'hrmsOverlayIn 0.25s ease both',
                }}
            >
                <div className="flex-shrink-0 flex items-center justify-between px-6 md:px-10 pt-6 pb-4 border-b border-white/10">
                    <div style={fadeUp(0)} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                            <Building2 size={16} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">PPP</span>
                        <span className="text-white/40 text-sm hidden sm:inline">/ Navigation</span>
                    </div>

                    <div style={fadeUp(40)} className="flex-1 max-w-sm mx-6 hidden md:block">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setShowFavs(false); }}
                                placeholder="Search menu…"
                                className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/15
                                           rounded-xl text-sm text-white placeholder:text-white/35
                                           focus:outline-none focus:bg-white/15 focus:border-white/30
                                           transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={fadeUp(60)} className="flex items-center gap-3">
                        <button
                            onClick={() => { setShowFavs(p => !p); setSearch(''); }}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                                        transition-all border
                                        ${showFavs
                                    ? 'bg-amber-400 text-indigo-900 border-amber-400'
                                    : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/15'}`}
                        >
                            <Star size={13} className={showFavs ? 'fill-indigo-900' : ''} />
                            <span className="hidden sm:inline text-white">Favourites</span>
                            {favourites.length > 0 && (
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
                                    ${showFavs ? 'bg-indigo-900/20 text-indigo-900' : 'bg-amber-400/20 text-amber-300'}`}>
                                    {favourites.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/15
                                       text-white rounded-xl flex items-center justify-center transition-all"
                            aria-label="Close menu"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="md:hidden px-6 pt-3 flex-shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setShowFavs(false); }}
                            placeholder="Search menu…"
                            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/15
                                       rounded-xl text-sm text-white placeholder:text-white/35
                                       focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">

                    {!search && !showFavs && (
                        <div style={fadeUp(80)}
                            className="hidden lg:flex w-64 xl:w-72 flex-col flex-shrink-0
                                       px-6 py-6 border-r border-white/10 overflow-y-auto scrollbar">
                            <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4 px-1">
                                Categories
                            </p>
                            <div className="space-y-1.5">
                                {menuData.map((menu, i) => (
                                    <button
                                        key={menu.category}
                                        onClick={() => setActiveCategory(menu.category)}
                                        className={`cat-btn w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                                                    ${activeCategory === menu.category
                                                ? 'active'
                                                : 'text-white/65 hover:text-white hover:bg-white/10'}`}
                                        style={fadeUp(100 + i * 30)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{menu.category}</span>
                                            <div className="flex items-center gap-2">
                                                {menu.items.some(it => favourites.includes(it.routes)) && (
                                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                                )}
                                                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold
                                                    ${activeCategory === menu.category
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-white/10 text-white/50'}`}>
                                                    {menu.items.length}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {!search && !showFavs && (
                        <div className="lg:hidden flex-shrink-0 px-4 pt-4">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar">
                                {menuData.map(menu => (
                                    <button
                                        key={menu.category}
                                        onClick={() => setActiveCategory(menu.category)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all
                                            ${activeCategory === menu.category
                                                ? 'bg-white text-indigo-700'
                                                : 'bg-white/10 text-white/70 hover:bg-white/15'}`}
                                    >
                                        {menu.category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto scrollbar px-4 md:px-8 lg:px-10 py-6">

                        <div style={fadeUp(120)} className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {search
                                        ? `Search: "${search}"`
                                        : showFavs
                                            ? 'Your Favourites'
                                            : activeCategory}
                                </h2>
                                <p className="text-xs text-white/40 mt-0.5">
                                    {visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'}
                                </p>
                            </div>
                            {!showFavs && !search && favourites.length > 0 && (
                                <button onClick={() => setShowFavs(true)}
                                    className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200
                                               bg-amber-400/10 hover:bg-amber-400/20 px-3 py-1.5 rounded-lg transition-all">
                                    <Star size={11} className="fill-amber-300" />
                                    {favourites.length} saved
                                </button>
                            )}
                        </div>

                        {isLoading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        )}

                        {!isLoading && visibleItems.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-white/30">
                                {showFavs
                                    ? <><Star size={36} className="mb-3" /><p className="text-sm">No favourites yet</p><p className="text-xs mt-1">Hover any menu item and click ★ to save it</p></>
                                    : <><Search size={36} className="mb-3" /><p className="text-sm">No results found</p></>
                                }
                            </div>
                        )}

                        {!isLoading && visibleItems.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {visibleItems.map((item, i) => {
                                    const isFav = favourites.includes(item.routes);
                                    return (
                                        <div
                                            key={item.routes}
                                            className="hrms-menu-item group relative bg-white/6 hover:bg-white/12
                                                       border border-white/8 hover:border-white/20
                                                       rounded-2xl p-4 cursor-pointer transition-all duration-200
                                                       hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                                            style={fadeUp(140 + Math.min(i, 8) * 25)}
                                            onClick={() => handleNavigate(item.routes)}
                                        >
                                            <button
                                                className={`fav-btn absolute top-3 right-3 p-1.5 rounded-lg
                                                            opacity-0 group-hover:opacity-100
                                                            ${isFav ? 'active !opacity-100' : 'text-white/30 hover:text-amber-400'}
                                                            bg-white/10 hover:bg-white/15 transition-all`}
                                                onClick={e => toggleFavourite(item.routes, e)}
                                                title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                                            >
                                                <Star size={12} className={isFav ? 'fill-amber-400' : ''} />
                                            </button>

                                            <div className="flex items-start gap-3 pr-7">
                                                <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-300/60
                                                                group-hover:bg-white/70 transition-colors flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-white/90
                                                                         group-hover:text-white transition-colors truncate">
                                                            {item.label}
                                                        </span>
                                                        <ArrowRight size={13}
                                                            className="hrms-item-arrow flex-shrink-0 text-white/60" />
                                                    </div>
                                                    <p className="mt-1 text-xs text-white/40 group-hover:text-white/55
                                                                  transition-colors leading-relaxed">
                                                        {item.description || `Manage ${item.label.toLowerCase()} and related settings`}
                                                    </p>
                                                    {(search || showFavs) && item.category && (
                                                        <span className="mt-2 inline-block text-xs px-2 py-0.5
                                                                         bg-indigo-400/20 text-indigo-200 rounded-md">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div style={fadeUp(60)}
                        className="hidden xl:flex w-56 2xl:w-64 flex-shrink-0 flex-col items-center
                                   justify-center px-6 border-l border-white/10 py-10">
                        <div className="relative w-full">
                            <img
                                src={hrmsIllustration}
                                alt="HRMS"
                                className="w-full object-contain drop-shadow-2xl opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 to-transparent rounded-full blur-2xl -z-10" />
                        </div>

                        {!isLoading && menuData.length > 0 && (
                            <div className="mt-6 w-full space-y-2" style={fadeUp(300)}>
                                <div className="flex items-center justify-between px-3 py-2 bg-white/8 rounded-xl">
                                    <span className="text-xs text-white/50">Modules</span>
                                    <span className="text-xs font-bold text-white">{menuData.length}</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 bg-white/8 rounded-xl">
                                    <span className="text-xs text-white/50">Total Pages</span>
                                    <span className="text-xs font-bold text-white">{allItems.length}</span>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2 bg-amber-400/10 rounded-xl">
                                    <span className="text-xs text-amber-300/70">Favourites</span>
                                    <span className="text-xs font-bold text-amber-300">{favourites.length}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 px-6 md:px-10 py-3 border-t border-white/8
                                flex items-center gap-4 text-xs text-white">
                    <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono text-[11px]">Esc</kbd> to close</span>
                    <span className="hidden sm:inline">Click ★ on any item to save to favourites</span>
                </div>
            </div>
        </>
    );
}

export default MainMenu;