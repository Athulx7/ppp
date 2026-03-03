import { Check, Layers, MenuIcon, RefreshCw, Save, Search, X } from 'lucide-react';
import React from 'react'

function MenuMappingMenuSection({
    activeMainMenu,
    setActiveMainMenu,
    mainMenus,
    selectedSubMenus,
    setSelectedSubMenus,
    subMenus,
    searchQuery,
    setSearchQuery,
    handleSubMenuToggle,
    loading,
    saveStatus,
    mappingType,
    selectedRole,
    selectedDesignation,
    selectedEmployee,
    handleExpandAll,
    expandedMenus,
    getFilteredSubMenus
}) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto p-2 gap-1">
                    <button
                        onClick={() => setActiveMainMenu('all')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeMainMenu === 'all'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Layers className="w-4 h-4" />
                        All Menus
                    </button>
                    {mainMenus.map(menu => (
                        <button
                            key={menu.main_menu_id}
                            onClick={() => setActiveMainMenu(menu.main_menu_id.toString())}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeMainMenu === menu.main_menu_id.toString()
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${menu.color}`} />
                            {menu.menu_name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Menu Access Configuration</h2>
                            <p className="text-sm text-gray-500">
                                {selectedSubMenus.length} menus selected • {subMenus.length} total menus
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by menu name or path..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleExpandAll}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1 whitespace-nowrap"
                            >
                                <Layers className="w-4 h-4" />
                                {expandedMenus.length === mainMenus.length ? 'Collapse All' : 'Expand All'}
                            </button>
                            <button
                                onClick={() => console.log('errr')}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1 whitespace-nowrap"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600">Loading menu configuration...</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">
                                Menu List
                            </h3>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectedSubMenus.length === getFilteredSubMenus().length && getFilteredSubMenus().length > 0}
                                    onChange={() => {
                                        const filteredMenus = getFilteredSubMenus().map(sm => sm.sub_menu_id);
                                        if (selectedSubMenus.length === filteredMenus.length) {
                                            setSelectedSubMenus([]);
                                        } else {
                                            setSelectedSubMenus(filteredMenus);
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-600">Select All</span>
                            </label>
                        </div>

                        <div className="h-112.5 overflow-y-auto scrollbar pr-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {getFilteredSubMenus().map(subMenu => (
                                    <label
                                        key={subMenu.sub_menu_id}
                                        className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all group"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedSubMenus.includes(subMenu.sub_menu_id)}
                                            onChange={() => handleSubMenuToggle(subMenu.sub_menu_id)}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">
                                                {subMenu.sub_menu_name}
                                            </div>
                                            <div className="text-xs text-gray-400 group-hover:text-indigo-400 mt-0.5">
                                                {subMenu.route_path}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {getFilteredSubMenus().length === 0 && (
                                <div className="p-12 text-center">
                                    <MenuIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Menus Found</h3>
                                    <p className="text-gray-600">
                                        {searchQuery ? 'Try adjusting your search criteria' : 'Select a filter to view menus'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={() => console.log('helllo')}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
                <button
                    onClick={() => alert('save')}
                    disabled={loading || saveStatus === 'saving' ||
                        (mappingType === 'role' && !selectedRole) ||
                        (mappingType === 'designation' && !selectedDesignation) ||
                        (mappingType === 'employee' && !selectedEmployee)
                    }
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all ${saveStatus === 'success'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } ${(!selectedRole && !selectedDesignation && !selectedEmployee) ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow'}`}
                >
                    {saveStatus === 'saving' ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                        </>
                    ) : saveStatus === 'success' ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved Successfully
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>

        </>
    )
}

export default MenuMappingMenuSection