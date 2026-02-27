import { Building, Minus, Plus } from 'lucide-react'
import React from 'react'

function SalaryComponentTabSection({ activeTab, components, setActiveTab, setShowCreateModal }) {
    return (
        <div className='flex justify-between border-b border-gray-200'>
            <div className="flex ">
                <button
                    onClick={() => setActiveTab('earnings')}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'earnings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Plus size={16} />
                    Earnings
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        {components.earnings.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('deductions')}
                    className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'deductions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Minus size={16} />
                    Deductions
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        {components.deductions.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('employer')}
                    className={` px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'employer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Building size={16} />
                    Employer Contributions
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {components.employerContributions.length}
                    </span>
                </button>
            </div>

            <button
                onClick={() => setShowCreateModal(true)}
                className="mb-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
                <Plus size={16} />
                Create New Component
            </button>
        </div>
    )
}

export default SalaryComponentTabSection