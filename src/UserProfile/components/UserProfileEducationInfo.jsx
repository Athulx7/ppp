import React from 'react'
import { FileText } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import SectionHeading from './SectionHeading'

function UserProfileEducationInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-6">
            <SectionHeading
                icon={<FileText className="w-4 h-4" />}
                title="Education"
                subtitle="Highest qualification on record"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <CommonInputField
                    label="Highest Qualification"
                    value={profileData.highestQualification || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('highestQualification', e.target.value)}
                    placeholder="Enter highest qualification"
                />

                <CommonInputField
                    label="University/Institution"
                    value={profileData.university || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('university', e.target.value)}
                    placeholder="Enter university/institution"
                />

                <CommonInputField
                    label="Year of Passing"
                    value={profileData.yearOfPassing || ''}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('yearOfPassing', e.target.value)}
                    placeholder="Enter year of passing"
                />
            </div>
        </div>
    )
}

export default UserProfileEducationInfo
