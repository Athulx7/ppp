import React from 'react'
import { Phone, User } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import SectionHeading from './SectionHeading'

function UserProfilePersonalInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-8">
            <div>
                <SectionHeading
                    icon={<Phone className="w-4 h-4" />}
                    title="Contact"
                    subtitle="How we reach you outside of email"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <CommonInputField
                        label="Mobile Number"
                        type="tel"
                        value={profileData.mobileNumber || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('mobileNumber', e.target.value)}
                        placeholder="Enter mobile number"
                        required={true}
                    />

                    <CommonInputField
                        label="Alternate Mobile Number"
                        type="tel"
                        value={profileData.alternateMobile || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('alternateMobile', e.target.value)}
                        placeholder="Enter alternate mobile number"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <SectionHeading
                    icon={<User className="w-4 h-4" />}
                    title="About You"
                    subtitle="Personal and statutory details"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <CommonInputField
                        label="PAN Number"
                        value={profileData.panNumber || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('panNumber', e.target.value)}
                        placeholder="Enter PAN number"
                    />

                    <CommonDatePicker
                        label="Date of Birth"
                        value={profileData.dateOfBirth || ''}
                        onChange={(value) => handleChange('dateOfBirth', value)}
                        disabled={!isEditing}
                    />

                    <CommonDropDown
                        label="Gender"
                        value={profileData.gender || ''}
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                            { label: 'Other', value: 'Other' }
                        ]}
                        disabled={!isEditing}
                        onChange={(value) => handleChange('gender', value)}
                        placeholder="Select gender"
                    />

                    <CommonDropDown
                        label="Marital Status"
                        value={profileData.maritalStatus || ''}
                        options={[
                            { label: 'Single', value: 'Single' },
                            { label: 'Married', value: 'Married' },
                            { label: 'Divorced', value: 'Divorced' },
                            { label: 'Widowed', value: 'Widowed' }
                        ]}
                        disabled={!isEditing}
                        onChange={(value) => handleChange('maritalStatus', value)}
                        placeholder="Select marital status"
                    />
                </div>
            </div>
        </div>
    )
}

export default UserProfilePersonalInfo
