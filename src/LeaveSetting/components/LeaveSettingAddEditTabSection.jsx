import { User, Users } from 'lucide-react'
import React from 'react'

function LeaveSettingAddEditTabSection({ isLoading, activeTab, setActiveTab }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto scrollbar">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'single'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Single Allocation
                    </button>

                    <button
                        onClick={() => setActiveTab('bulk')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'bulk'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Users className="w-4 h-4" />
                        Bulk Allocation
                    </button>
                </div>
            </div>
        </>
    )
}

export default LeaveSettingAddEditTabSection