import React from 'react'
import { Banknote, Briefcase, Calendar } from 'lucide-react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import SectionHeading from './SectionHeading'

function UserProfileEmploymentInfo({ profileData, isEditing, handleChange }) {
    if (!profileData) return null

    return (
        <div className="space-y-8">
            <div>
                <SectionHeading
                    icon={<Briefcase className="w-4 h-4" />}
                    title="Role & Reporting"
                    subtitle="Where you sit in the org and who you report to"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <CommonDropDown
                        label="Department"
                        value={profileData.department || ''}
                        options={[
                            { label: profileData.department || 'Human Resources', value: profileData.department || 'Human Resources' }
                        ]}
                        disabled={true}
                        onChange={(value) => handleChange('department', value)}
                        placeholder="Select department"
                        required={true}
                    />

                    <CommonInputField
                        label="Designation"
                        value={profileData.designation || ''}
                        disabled={true}
                        onChange={(e) => handleChange('designation', e.target.value)}
                        placeholder="Enter designation"
                        required={true}
                    />

                    <CommonInputField
                        label="Reporting Manager"
                        value={profileData.reportingManager || ''}
                        disabled={true}
                        onChange={(e) => handleChange('reportingManager', e.target.value)}
                        placeholder="Enter reporting manager"
                    />

                    <CommonDropDown
                        label="Currency"
                        value={profileData.currency || ''}
                        options={[
                            { label: profileData.currency || 'INR - Indian Rupee', value: profileData.currency || 'INR - Indian Rupee' }
                        ]}
                        disabled={true}
                        onChange={(value) => handleChange('currency', value)}
                        placeholder="Select currency"
                        icon={<Banknote className="w-4 h-4 text-gray-400" />}
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <SectionHeading
                    icon={<Calendar className="w-4 h-4" />}
                    title="Tenure"
                    subtitle="Joining and probation timeline"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <CommonDatePicker
                        label="Joining Date"
                        value={profileData.joiningDate || ''}
                        onChange={(value) => handleChange('joiningDate', value)}
                        disabled={true}
                        required={true}
                    />

                    <CommonDropDown
                        label="Employee Type"
                        value={profileData.employeeType || ''}
                        options={[
                            { label: profileData.employeeType || 'Permanent', value: profileData.employeeType || 'Permanent' }
                        ]}
                        disabled={true}
                        onChange={(value) => handleChange('employeeType', value)}
                        placeholder="Select employee type"
                        required={true}
                    />

                    <CommonInputField
                        label="Probation Period (Months)"
                        type="number"
                        value={profileData.probationPeriod || ''}
                        disabled={true}
                        onChange={(e) => handleChange('probationPeriod', e.target.value)}
                        placeholder="Enter probation period"
                    />

                    <CommonDatePicker
                        label="Probation End Date"
                        value={profileData.probationEndDate || ''}
                        onChange={(value) => handleChange('probationEndDate', value)}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default UserProfileEmploymentInfo
