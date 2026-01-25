import React, { useState } from 'react'
import { Grid3X3, Search } from "lucide-react";
import { Link } from 'react-router-dom'
import MainMenu from './MainMenu';

function TopHeader() {
    const [showMobileSearch, setShowMobileSearch] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    return (
        <>
            <div className="flex items-center justify-between w-full h-full px-2 md:px-2">

                <div className="flex-1 hidden md:flex items-center gap-2 py-2">
                    <input
                        type="text"
                        placeholder="Search Here..."
                        className="w-full max-w-md px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <Grid3X3 size={30} onClick={() => setOpenMenu(true)} className='cursor-pointer' />
                </div>

                <button
                    className="md:hidden p-2 text-gray-500 hover:text-indigo-500"
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                    <Search />
                </button>

                {showMobileSearch && (
                    <div className="absolute top-14 left-0 right-0 bg-white p-2 shadow-md md:hidden z-40">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            autoFocus
                        />
                    </div>
                )}

                <div className="flex items-center">
                </div>
            </div>
            {openMenu && (
                <MainMenu onClose={() => setOpenMenu(false)} />
            )}
        </>
    )
}

export default TopHeader