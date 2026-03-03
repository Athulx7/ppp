import { Briefcase, Shield, User } from 'lucide-react'
import React from 'react'

function MenuMappingTabSection({ isLoading, handleMappingTypeChange, mappingType }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto">
                    <button
                        onClick={() => handleMappingTypeChange('role')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'role'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        Role-wise Mapping
                    </button>

                    <button
                        onClick={() => handleMappingTypeChange('designation')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'designation'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Designation-wise Mapping
                    </button>

                    <button
                        onClick={() => handleMappingTypeChange('employee')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'employee'
                            ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Employee-wise Mapping
                    </button>
                </div>
            </div>
        </>
    )
}

export default MenuMappingTabSection