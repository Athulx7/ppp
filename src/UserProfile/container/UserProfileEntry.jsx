import React, { useEffect, useState } from 'react'
import { Loader2, Pencil, Save, X } from 'lucide-react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import UserProfileMain from '../components/UserProfileMain'
import { ApiCall } from '../../library/constants'

function UserProfileEntry() {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState(null)
    const [savedBackup, setSavedBackup] = useState(null)

    const fetchProfile = async () => {
        setIsLoading({ normal: true, spinner: false })
        try {
            const res = await ApiCall('get', '/userprofile/getprofile')
            if (res.data?.success) {
                setProfileData(res.data.data)
                setSavedBackup(res.data.data)
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
        } finally {
            setIsLoading({ normal: false, spinner: false })
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleEdit = () => {
        setSavedBackup({ ...profileData })
        setIsEditing(true)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const res = await ApiCall('put', '/userprofile/updateprofile', profileData)
            if (res.data?.success) {
                setIsEditing(false)
                setSavedBackup({ ...profileData })
                alert('Profile updated successfully!')
            } else {
                alert(res.data?.message || 'Failed to update profile.')
            }
        } catch (error) {
            console.error('Failed to update profile:', error)
            alert('Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setProfileData({ ...savedBackup })
        setIsEditing(false)
    }

    return (
        <>
            <Breadcrumb
                items={[{ label: "User Profile" }]}
                title="User Profile"
                description="Manage your personal and professional information"
                loading={isLoading.normal}
                actions={
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium shadow-sm shadow-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                }
            />

            {!isLoading.normal && <UserProfileMain
                profileData={profileData}
                setProfileData={setProfileData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                handleCancel={handleCancel}
            />}

        </>
    )
}

export default UserProfileEntry