import React, { useEffect, useState } from 'react';
import hrmsIllustration from '../assets/hrmsillustatrion.png';
import { Link, useNavigate } from 'react-router-dom';
import { ApiCall, getRoleBasePath } from '../library/constants';

function MainMenu({ onClose }) {

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [menuData, setMenuData] = useState([]);
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        loadMenuList()
    }, [])

    const loadMenuList = async () => {
        setIsLoading(true)
        try {
            const result = await ApiCall('GET', '/mainMenu')
            if (result?.data?.success) {
                setMenuData(result.data.data);
                setActiveCategory(result.data.data[0]?.category || "");
            }
        }
        catch (err) {
            console.log('eroor in getting menus', err)
        }
        setIsLoading(false)
    }

    const handleNavigate = routePath => {
        console.log('routepath',menuData.find(m => m.category === activeCategory).items)
        const basePath = getRoleBasePath();
        navigate(`${basePath}${routePath}`);
        onClose && onClose();
    };

    return (
        <div
            className="fixed top-0 overflow-y-auto scrollbar right-0 z-999 bottom-0  bg-white text-indigo-600"
        >
            <button
                className="absolute cursor-pointer top-6 right-6 w-10 h-10 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all z-10"
                onClick={onClose}
            >
                ✕
            </button>

            <div className="flex flex-col lg:flex-row h-full px-4 md:px-8 lg:px-16 py-8 md:py-12">
                <div className="w-full lg:w-1/4 lg:pr-8 mb-6 lg:mb-0">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">{/* {activeCategory} */} </h2>
                    <div className="space-y-2">
                        {menuData.map(menu => (
                            <button
                                key={menu.category}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${activeCategory === menu.category
                                    ? "bg-white/20 font-bold shadow-lg"
                                    : "opacity-80 hover:opacity-100 hover:bg-white/10"
                                    }`}
                                onClick={() => setActiveCategory(menu.category)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{menu.category}</span>
                                    <span className={activeCategory === menu.category ? "opacity-100" : "opacity-0"}>→</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-1/2 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white"> </h2>
                    <div className="max-h-[60vh] overflow-y-auto scrollbar  pr-2">
                        <div className="space-y-3">
                            {menuData
                                .find(m => m.category === activeCategory)
                                ?.items.map((item) => (
                                    <div
                                        key={item.routes}
                                        className="group cursor-pointer bg-white/5 rounded-lg p-4 transition-all hover:translate-x-1"
                                        onClick={() => handleNavigate(item.routes)}
                                    >
                                        <div className="flex items-start">
                                            <div className="shrink-0 w-2 h-2 bg-white/50 rounded-full mr-3 mt-2"></div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg transition-colors">
                                                        {item.label}
                                                    </span>
                                                    <span className="text-white/50 transition-colors opacity-0 group-hover:opacity-100">
                                                        →
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-sm opacity-70">
                                                    Manage {item.label.toLowerCase()} and related settings
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex w-1/4 items-center justify-center opacity-90">
                    <div className="relative w-full h-full max-h-[500px]">
                        <img
                            src={hrmsIllustration}
                            alt="HRMS Illustration"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>

            <div className="lg:hidden absolute bottom-0 left-0 right-0 h-32 opacity-20">
                <img
                    src={hrmsIllustration}
                    alt="HRMS Illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-800 to-transparent"></div>
            </div>
        </div>
    );
}

export default MainMenu;