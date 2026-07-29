import React from 'react'
import { Lock, Mail, UserCircle } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import SectionHeading from './SectionHeading'

function UserProfileBasicInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<UserCircle className="w-4 h-4" />}
                title="Identity"
                subtitle="Your name and how colleagues reach you"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <CommonInputField
                    label="Employee Code"
                    value={profileData.employeeCode || ''}
                    disabled={true}
                    onChange={(e) => handleChange('employeeCode', e.target.value)}
                    placeholder="Employee code"
                />

                <CommonInputField
                    label="Employee ID"
                    value={profileData.employeeId || ''}
                    disabled={true}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    placeholder="Employee ID"
                />

                <CommonInputField
                    label="First Name"
                    value={profileData.firstName || ''}
                    disabled={true}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required={true}
                />

                <CommonInputField
                    label="Last Name"
                    value={profileData.lastName || ''}
                    disabled={true}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required={true}
                />

                <CommonInputField
                    label="Email Address"
                    type="email"
                    value={profileData.email || ''}
                    disabled={true}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    required={true}
                />
            </div>

            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Roles
                </label>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {profileData.roles?.map((role, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${role === 'Admin'
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
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5">
                        <Lock className="w-3 h-3" />
                        Roles are managed by system administrators
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserProfileBasicInfo