import { ChevronDown, ChevronRight, ChevronUp, LogOutIcon, User } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasePath } from '../library/constants';

function UserDropDown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
        navigate('/')
    }
    const userDetails = JSON.parse(sessionStorage.getItem('user'));

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {  navigate(`${getRoleBasePath()}/profile`) }}
                className='flex items-center py-1 px-2 md:px-3 cursor-pointer rounded-lg hover:bg-gray-50 transition-colors'
                aria-label="User menu"
                aria-expanded={open}
            >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 text-indigo-600 flex items-center justify-center font-bold">
                    {userDetails.user_code.charAt(0).toUpperCase()}
                </div>
                <div className="ms-2 hidden md:flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                        User Name
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                        {userDetails.user_code}
                    </span>
                </div>
               <ChevronRight className='text-indigo-500 ms-1 md:ms-2 text-sm' />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-48 border border-gray-200 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                    <ul className="py-1">
                        <li
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex items-center"
                            onClick={() => {
                                navigate(`${getRoleBasePath()}/profile`);
                                setOpen(false);
                            }}
                        >
                            <User className="text-gray-500 mr-2" />
                            <span className="font-medium">My Profile</span>
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="text-red-500 mr-2" />
                            <span className="font-medium text-red-500">Logout</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default UserDropDown;