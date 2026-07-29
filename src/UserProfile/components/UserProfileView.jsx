import React from 'react'
import { Briefcase, Building, Mail } from 'lucide-react'

function UserProfileView({ profileData, completion }) {
    if (!profileData) return null

    const firstInitial = profileData.firstName ? profileData.firstName.charAt(0) : ''
    const lastInitial = profileData.lastName ? profileData.lastName.charAt(0) : ''

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="h-20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-400" />
            <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-10">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-md">
                            {firstInitial}{lastInitial}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>

                    <div className="flex-1 md:pb-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {profileData.firstName} {profileData.lastName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                {profileData.designation}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-gray-400" />
                                {profileData.department}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                {profileData.email}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {profileData.roles?.map((role, index) => (
                                <span
                                    key={index}
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${role === 'Admin'
                                        ? 'bg-red-100 text-red-700'
                                        : role === 'HR'
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : role === 'Payroll Manager'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                        }`}
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg w-full md:w-64 shrink-0">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-gray-500 font-medium">Profile completeness</span>
                            <span className="text-indigo-600 font-semibold">{completion}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${completion}%` }}
                            />
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Employee ID</span>
                                <span className="font-semibold text-gray-800">{profileData.employeeCode}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status</span>
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                    {profileData.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileView