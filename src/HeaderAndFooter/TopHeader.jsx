import React, { useState, useRef, useEffect } from 'react'
import { Download, Grid3X3, Search, Sun, Moon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ApiCall, getRoleBasePath } from '../library/constants';
import { usePwaInstall } from '../usePwaInstall';
import Notifications from './Notifications';
import { useTheme } from '../context/useTheme';

function TopHeader({ openMenu, setOpenMenu }) {
    const { isDark, toggleTheme } = useTheme()
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    const handleSearch = async (query) => {
        setSearchQuery(query)
        if (query.trim() === '') {
            setSearchResults([])
            setShowResults(false)
            setNoResults(false)
            return
        }

        try {
            const res = await ApiCall("GET", `/searchMenu?q=${encodeURIComponent(query)}`)

            if (res?.data?.success) {
                const results = res.data.data.slice(0, 8)
                setSearchResults(results)
                setShowResults(true)
                setNoResults(results.length === 0)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleResultClick = (routePath) => {
        const basePath = getRoleBasePath()
        navigate(`${basePath}${routePath}`)
        setSearchQuery("")
        setSearchResults([]);
        setShowResults(false);
        setNoResults(false);
        setShowMobileSearch(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '' && searchResults.length > 0) {
            handleResultClick(searchResults[0].route);
        }
    };

    function PwaInstallButton() {
        const { isInstallable, install } = usePwaInstall();
        if (!isInstallable) return null;
        return (
            <button
                onClick={install} className=' flex bg-indigo-600 text-white px-4 py-2 border-none rounded-lg text-sm font-medium'
            >
                <Download className="h-4 w-4 mr-3" />
                Install App
            </button>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between w-full h-full px-2 md:px-2" ref={searchRef}>
                <div className="flex-1 hidden md:flex items-center gap-2 py-2 relative">
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search Pages..."
                            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {showResults && (
                        <div style={{ marginTop: '-5px' }} className="absolute top-full left-0 w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-600 z-50 max-h-96 overflow-y-auto scrollbar">
                            <div className="p-2">
                                {noResults ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <Search className="w-8 h-8 mb-2 opacity-40" />
                                        <div className="text-sm font-medium">No results found</div>
                                        <div className="text-xs mt-1">Try a different search term</div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                                            {searchResults.length} results found
                                        </div>
                                        <div className="space-y-1">
                                            {searchResults.map((result) => (
                                                <button
                                                    key={result.id}
                                                    className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 rounded-md transition-colors"
                                                    onClick={() => handleResultClick(result.route)}
                                                >
                                                    <div className="flex items-center justify-between cursor-pointer">
                                                        <div className="font-medium text-gray-900">{result.title}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">{result.category}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <Grid3X3
                        className="text-gray-600 cursor-pointer w-6 h-6 hover:text-indigo-600 transition-colors"
                        onClick={() => setOpenMenu(true)}
                    />
                </div>
                <button
                    className="md:hidden p-2 text-gray-500 hover:text-indigo-500"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                    <Search />
                </button>

                {showMobileSearch && (
                    <div className="absolute top-14 left-0 right-0 bg-white p-3 shadow-md md:hidden z-40" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search HRMS..."
                                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {showResults && (
                            <div className="mt-2 bg-white rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                <div className="p-2">
                                    {noResults ? (
                                        <div className="flex flex-col items-center justify-center py-6 text-gray-400">
                                            <Search className="w-7 h-7 mb-2 opacity-40" />
                                            <div className="text-sm font-medium">No results found</div>
                                            <div className="text-xs mt-1">Try a different search term</div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="text-xs font-semibold text-gray-500 px-2 py-1.5">
                                                {searchResults.length} results found
                                            </div>
                                            <div className="space-y-1">
                                                {searchResults.map((result) => (
                                                    <button
                                                        key={result.id}
                                                        className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-md transition-colors"
                                                        onClick={() => handleResultClick(result.route)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900">{result.title}</div>
                                                                <div className="text-xs text-gray-500 mt-0.5">{result.category}</div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {/* messgae, nottificatiom etc..*/}
                    <Notifications />
                    <button
                        onClick={toggleTheme}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <PwaInstallButton />
                </div>
            </div>
        </>
    )
}

export default TopHeader;