import React from 'react'
import { CreditCard, Shield } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import SectionHeading from './SectionHeading'

function UserProfileBankInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<CreditCard className="w-4 h-4" />}
                title="Salary Account"
                subtitle="Where your payslip payments are sent"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <CommonInputField
                    label="Account Holder Name"
                    value={profileData.accountHolderName || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('accountHolderName', e.target.value)}
                    placeholder="Enter account holder name"
                    required={true}
                />

                <CommonInputField
                    label="Account Number"
                    value={profileData.accountNumber || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    required={true}
                    icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Bank Name"
                    value={profileData.bankName || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Enter bank name"
                    required={true}
                />

                <CommonInputField
                    label="IFSC Code"
                    value={profileData.ifscCode || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('ifscCode', e.target.value)}
                    placeholder="Enter IFSC code"
                    required={true}
                />

                <CommonInputField
                    label="Branch Name"
                    value={profileData.branchName || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('branchName', e.target.value)}
                    placeholder="Enter branch name"
                />

                <CommonDropDown
                    label="Account Type"
                    value={profileData.accountType || ''}
                    options={[
                        { label: 'Savings', value: 'Savings' },
                        { label: 'Current', value: 'Current' },
                        { label: 'Salary', value: 'Salary' },
                        { label: 'Fixed Deposit', value: 'Fixed Deposit' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('accountType', value)}
                    placeholder="Select account type"
                />
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
                <Shield className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                Bank detail changes may require HR approval before your next payroll cycle.
            </div>
        </div>
    )
}

export default UserProfileBankInfo
