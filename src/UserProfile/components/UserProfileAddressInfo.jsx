import React from 'react'
import { Home, MapPin } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import SectionHeading from './SectionHeading'

function UserProfileAddressInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<Home className="w-4 h-4" />}
                title="Residential Address"
                subtitle="Used for correspondence and payroll documents"
            />
            <div className="grid grid-cols-1 gap-6">
                <CommonInputField
                    label="Address Line 1"
                    value={profileData.addressLine1 || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                    placeholder="Enter address line 1"
                    required={true}
                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Address Line 2"
                    value={profileData.addressLine2 || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                    placeholder="Enter address line 2"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CommonInputField
                        label="City"
                        value={profileData.city || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter city"
                        required={true}
                    />

                    <CommonInputField
                        label="State"
                        value={profileData.state || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Enter state"
                        required={true}
                    />

                    <CommonInputField
                        label="PIN Code"
                        value={profileData.pincode || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        placeholder="Enter PIN code"
                        required={true}
                    />
                </div>

                <CommonInputField
                    label="Country"
                    value={profileData.country || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Enter country"
                    required={true}
                />
            </div>
        </div>
    )
}

export default UserProfileAddressInfo
