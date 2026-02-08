import React, { useState, useRef, useEffect } from 'react'
import { Grid3X3, Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ApiCall, getRoleBasePath } from '../library/constants';

function TopHeader({ openMenu, setOpenMenu }) {
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef(null)
    const navigate = useNavigate()

    const handleSearch = async (query) => {
        setSearchQuery(query)
        if (query.trim() === '') {
            setSearchResults([])
            setShowResults(false)
            return
        }

        try {
            const res = await ApiCall("GET", `/searchMenu?q=${encodeURIComponent(query)}`)

            if (res?.data?.success) {
                setSearchResults(res.data.data.slice(0, 8))
                setShowResults(true)
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
                    
                    {showResults && searchResults.length > 0 && (
                        <div style={{marginTop:'-5px'}} className="absolute top-full left-0 w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-600 z-50 max-h-96 overflow-y-auto scrollbar">
                            <div className="p-2">
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
                        
                        {showResults && searchResults.length > 0 && (
                            <div className="mt-2 bg-white rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                                <div className="p-2">
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
                                                    <div className="text-xs text-gray-400 ml-2">
                                                        ID: {result.id}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center">
                    {/* messgae, nottificatiom etc..*/}
                </div>
            </div>
        </>
    )
}

export default TopHeader;