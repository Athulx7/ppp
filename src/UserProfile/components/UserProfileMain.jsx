import React, { useMemo, useState } from 'react'
import {
    User, Briefcase, CreditCard, Home, Smartphone, FileText,
    Shield, UserCircle, ChevronRight, Pencil, Download, X
} from 'lucide-react'

import UserProfileView from './UserProfileView'
import UserProfileBasicInfo from './UserProfileBasicInfo'
import UserProfileEmploymentInfo from './UserProfileEmploymentInfo'
import UserProfilePersonalInfo from './UserProfilePersonalInfo'
import UserProfileAddressInfo from './UserProfileAddressInfo'
import UserProfileBankInfo from './UserProfileBankInfo'
import UserProfileEmergencyInfo from './UserProfileEmergencyInfo'
import UserProfileEducationInfo from './UserProfileEducationInfo'
import UserProfileSecurityInfo from './UserProfileSecurityInfo'

function UserProfileMain({
    profileData,
    setProfileData,
    isEditing,
    handleCancel
}) {
    const [activeTab, setActiveTab] = useState('basic')

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <UserCircle className="w-4 h-4" />, fields: ['firstName', 'lastName', 'email'] },
        { id: 'employment', label: 'Employment', icon: <Briefcase className="w-4 h-4" />, fields: ['department', 'designation', 'joiningDate', 'employeeType'] },
        { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" />, fields: ['panNumber', 'mobileNumber', 'dateOfBirth', 'gender', 'maritalStatus'] },
        { id: 'address', label: 'Address', icon: <Home className="w-4 h-4" />, fields: ['addressLine1', 'city', 'state', 'pincode', 'country'] },
        { id: 'bank', label: 'Bank Details', icon: <CreditCard className="w-4 h-4" />, fields: ['accountHolderName', 'accountNumber', 'bankName', 'ifscCode'] },
        { id: 'emergency', label: 'Emergency', icon: <Smartphone className="w-4 h-4" />, fields: ['emergencyContactName', 'emergencyContactNumber'] },
        { id: 'education', label: 'Education', icon: <FileText className="w-4 h-4" />, fields: ['highestQualification', 'university'] },
        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" />, fields: [] }
    ]

    const completion = useMemo(() => {
        if (!profileData) return 0
        const trackedFields = tabs.flatMap(t => t.fields)
        const filled = trackedFields.filter(f => String(profileData[f] ?? '').trim().length > 0)
        return Math.round((filled.length / trackedFields.length) * 100)
    }, [profileData])

    const handleChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'basic':
                return (
                    <UserProfileBasicInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'employment':
                return (
                    <UserProfileEmploymentInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'personal':
                return (
                    <UserProfilePersonalInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'address':
                return (
                    <UserProfileAddressInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'bank':
                return (
                    <UserProfileBankInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'emergency':
                return (
                    <UserProfileEmergencyInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'education':
                return (
                    <UserProfileEducationInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
            case 'security':
                return (
                    <UserProfileSecurityInfo
                        profileData={profileData}
                    />
                )
            default:
                return (
                    <UserProfileBasicInfo
                        profileData={profileData}
                        isEditing={isEditing}
                        handleChange={handleChange}
                    />
                )
        }
    }

    const activeTabMeta = tabs.find(t => t.id === activeTab)

    return (
        <>
            <UserProfileView
                profileData={profileData}
                completion={completion}
            />

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-48 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/60">
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible scrollbar gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded- text-sm font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'}`}
                                >
                                    <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>
                                        {tab.icon}
                                    </span>
                                    <span className="flex-1 text-left">{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <ChevronRight className="w-3.5 h-3.5 hidden lg:block" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        {isEditing && (
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Pencil className="w-3 h-3" />
                                Editing
                            </span>
                        )}
                        <div className="p-6">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfileMain