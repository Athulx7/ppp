import React from 'react'
import { CheckCircle2, IndianRupee, Lock, Shield } from 'lucide-react'
import SectionHeading from './SectionHeading'

function UserProfileSecurityInfo({ profileData }) {
    if (!profileData) return null

    const lastLoginDate = profileData.lastLogin ? profileData.lastLogin.split(' ')[0] : 'N/A'
    const lastLoginTime = profileData.lastLogin ? profileData.lastLogin.split(' ')[1] : ''

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<Shield className="w-4 h-4" />}
                title="Login & Security"
                subtitle="Manage how you sign in and keep your account safe"
            />
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">Password</div>
                            <div className="text-sm text-gray-500">Last changed 30 days ago</div>
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shrink-0 cursor-pointer">
                        Change Password
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <IndianRupee className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">Default Password</div>
                            <div className="text-sm text-gray-500">Employee Code: {profileData.employeeCode}</div>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold shrink-0">
                        Auto-generated
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div>
                        <div className="font-medium text-gray-800">Account Status</div>
                        <div className="text-sm text-gray-500">Current status of your account</div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {profileData.status}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div>
                        <div className="font-medium text-gray-800">Last Login</div>
                        <div className="text-sm text-gray-500">Date and time of your last login</div>
                    </div>
                    <div className="text-right">
                        <div className="font-medium text-gray-800 text-sm">
                            {lastLoginDate}
                        </div>
                        {lastLoginTime && (
                            <div className="text-xs text-gray-500">
                                {lastLoginTime}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileSecurityInfo
