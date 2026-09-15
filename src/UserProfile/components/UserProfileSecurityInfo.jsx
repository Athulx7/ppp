import React, { useState } from 'react'
import {
    CheckCircle2, IndianRupee, Lock, Shield,
    Eye, EyeOff, AlertCircle, KeyRound, Loader2, Check
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import CommonModal from '../../basicComponents/CommonModal'
import { ApiCall } from '../../library/constants'

function UserProfileSecurityInfo({ profileData }) {
    if (!profileData) return null

    const lastLoginDate = profileData.lastLogin ? profileData.lastLogin.split(' ')[0] : 'N/A'
    const lastLoginTime = profileData.lastLogin ? profileData.lastLogin.split(' ')[1] : ''

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [passwordStatusText, setPasswordStatusText] = useState('Default is Employee Code')

    const trimmedNew = newPassword.trim()
    const isSingleCharDisallowed = trimmedNew.length === 1 && !/^\d$/.test(trimmedNew)
    const isNewPasswordValid = trimmedNew.length > 0 && !isSingleCharDisallowed
    const isConfirmMatching = confirmPassword.length > 0 && confirmPassword === newPassword

    const handleOpenModal = () => {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setErrorMessage('')
        setSuccessMessage('')
        setShowCurrent(false)
        setShowNew(false)
        setShowConfirm(false)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        if (isSubmitting) return
        setIsModalOpen(false)
        setErrorMessage('')
        setSuccessMessage('')
    }

    const handleSubmitChangePassword = async (e) => {
        e?.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')

        if (!currentPassword) {
            setErrorMessage('Current password is required.')
            return
        }

        if (!trimmedNew) {
            setErrorMessage('New password is required.')
            return
        }

        if (trimmedNew.length === 1 && !/^\d$/.test(trimmedNew)) {
            setErrorMessage('Single letter or single symbol is not allowed. Single characters must be a digit (0-9). For letters or symbols, please use 2 or more characters.')
            return
        }

        if (trimmedNew !== confirmPassword.trim()) {
            setErrorMessage('New password and confirm password do not match.')
            return
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            setErrorMessage('New password and confirm password do not match.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await ApiCall('post', '/userprofile/changepassword', {
                currentPassword: currentPassword.trim(),
                newPassword: newPassword.trim(),
                confirmPassword: confirmPassword.trim()
            })

            if (res.data?.success) {
                setSuccessMessage('Password changed successfully in both company and central authentication databases!')
                setPasswordStatusText('Recently updated')
                setTimeout(() => {
                    handleCloseModal()
                }, 1600)
            } else {
                setErrorMessage(res.data?.message || 'Failed to change password.')
            }
        } catch (error) {
            console.error('Password update error:', error)
            setErrorMessage(error.response?.data?.message || error.message || 'Failed to update password. Please check your current password.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<Shield className="w-4 h-4" />}
                title="Login & Security"
                subtitle="Manage how you sign in and keep your account safe"
            />
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">Password</div>
                            <div className="text-sm text-gray-500">{passwordStatusText}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleOpenModal}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shrink-0 cursor-pointer shadow-sm shadow-indigo-100 flex items-center gap-1.5"
                    >
                        <KeyRound className="w-4 h-4" />
                        Change Password
                    </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <IndianRupee className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-800">Default Password Logic</div>
                            <div className="text-sm text-gray-500">Employee Code: <span className="font-semibold text-gray-700">{profileData.employeeCode}</span></div>
                        </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold shrink-0">
                        Default: Emp Code
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div>
                        <div className="font-medium text-gray-800">Account Status</div>
                        <div className="text-sm text-gray-500">Current status of your account</div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {profileData.status}
                    </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
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

            {/* Change Password Modal */}
            <CommonModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Change Account Password"
                size="md"
            >
                <form onSubmit={handleSubmitChangePassword} className="space-y-4">
                    <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-lg p-3.5 text-xs text-indigo-900 leading-relaxed">
                        <div className="font-semibold flex items-center gap-1.5 text-indigo-950 mb-1">
                            <Shield className="w-3.5 h-3.5 text-indigo-600" />
                            Password Requirements
                        </div>
                        The new password can be a <strong>single digit</strong> (e.g. <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">1</code>), <strong>multiple digits</strong> (e.g. <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">1234</code>), or <strong>letters & symbols</strong> (2 or more characters, e.g. <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">Pass@123</code>). A <em>single letter or single symbol alone is not allowed</em>.
                    </div>

                    {errorMessage && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div className="flex-1">{errorMessage}</div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex-1">{successMessage}</div>
                        </div>
                    )}

                    {/* Current Password Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Current Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                disabled={isSubmitting}
                                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                            Default initial password is your Employee Code: <span className="font-semibold text-gray-700">{profileData.employeeCode}</span>
                        </p>
                    </div>

                    {/* New Password Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            New Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (e.g. 1, 1234, Pass@123)"
                                disabled={isSubmitting}
                                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                                    isSingleCharDisallowed
                                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                                        : isNewPasswordValid
                                            ? 'border-emerald-400 bg-emerald-50/20 focus:ring-emerald-400'
                                            : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {isSingleCharDisallowed && (
                            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" /> Single letter or symbol is not allowed. A single character must be a digit (0-9). For letters or symbols, use 2 or more characters.
                            </p>
                        )}
                        {isNewPasswordValid && (
                            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                                <Check className="w-3 h-3" /> Valid password ({trimmedNew.length} character{trimmedNew.length > 1 ? 's' : ''}).
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Confirm New Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                disabled={isSubmitting}
                                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                                    confirmPassword && !isConfirmMatching
                                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                                        : isConfirmMatching
                                            ? 'border-emerald-400 bg-emerald-50/20 focus:ring-emerald-400'
                                            : 'border-gray-300 focus:ring-indigo-500'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {confirmPassword && !isConfirmMatching && (
                            <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" /> Passwords do not match.
                            </p>
                        )}
                        {isConfirmMatching && (
                            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                                <Check className="w-3 h-3" /> Passwords match.
                            </p>
                        )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !currentPassword || !isNewPasswordValid || !isConfirmMatching}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </CommonModal>
        </div>
    )
}

export default UserProfileSecurityInfo
