import { Layers } from 'lucide-react'
import React from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'

function StructureBasicInformation({ isLoading, structure, handleChange, isViewMode }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Basic Information
                </h2>

                <div className="space-y-4">
                    <CommonInputField
                        label="Structure Code"
                        value={structure.code}
                        onChange={v => handleChange('code', v.toUpperCase())}
                        placeholder="e.g., JSE-STR"
                        required
                        disabled={isViewMode}
                    />

                    <CommonInputField
                        label="Structure Name"
                        value={structure.name}
                        onChange={v => handleChange('name', v)}
                        placeholder="e.g., Junior Software Engineer Structure"
                        required
                        loading={isLoading.normal}
                        disabled={isViewMode}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={structure.description}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="3"
                            placeholder="Describe the purpose and usage of this structure..."
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonDatePicker
                            label="Effective Date *"
                            value={structure.effectiveDate}
                            onChange={v => handleChange('effectiveDate', v)}
                            required
                            loading={isLoading.normal}
                            disabled={isViewMode}
                        />

                        <CommonDropDown
                            label="Status *"
                            value={structure.status}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' }
                            ]}
                            onChange={v => handleChange('status', v)}
                            disabled={isViewMode}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default StructureBasicInformation