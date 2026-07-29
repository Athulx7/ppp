import React from 'react'
import { Phone, Smartphone } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import SectionHeading from './SectionHeading'

function UserProfileEmergencyInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<Smartphone className="w-4 h-4" />}
                title="Emergency Contact"
                subtitle="Who we should call if something happens at work"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <CommonInputField
                    label="Emergency Contact Name"
                    value={profileData.emergencyContactName || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    placeholder="Enter emergency contact name"
                    required={true}
                />

                <CommonInputField
                    label="Emergency Contact Number"
                    type="tel"
                    value={profileData.emergencyContactNumber || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                    placeholder="Enter emergency contact number"
                    required={true}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Relationship"
                    value={profileData.emergencyContactRelation || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                    placeholder="Enter relationship"
                />
            </div>
        </div>
    )
}

export default UserProfileEmergencyInfo
