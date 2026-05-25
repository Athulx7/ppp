import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonToggleButton from '../../basicComponents/CommonToggleButton'
import { ApiCall, getRoleBasePath } from '../../library/constants'
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp'


function DynamicField({ config, value, onChange, dropdownOptions, loading }) {
    const { FieldKey, FieldLabel, InputType, Placeholder, IsRequired, StaticOptions, DropdownSource } = config

    const options = dropdownOptions?.[FieldKey] ?? (StaticOptions ? JSON.parse(StaticOptions) : [])

    switch (InputType) {
        case 'dropdown':
            return (
                <CommonDropDown
                    key={FieldKey}
                    label={FieldLabel}
                    value={value}
                    options={options}
                    disabled={false}
                    onChange={onChange}
                    required={!!IsRequired}
                    loading={loading}
                    allowInlineCreate={false}
                    inlineMasterCode={''}
                />
            )

        case 'toggle':
            if (typeof CommonToggle !== 'undefined') {
                return (
                    <CommonToggleButton
                        key={FieldKey}
                        label={FieldLabel}
                        value={value === 'true' || value === true}
                        onChange={(v) => onChange(String(v))}
                        required={!!IsRequired}
                    />
                )
            }
            return (
                <div key={FieldKey} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        {FieldLabel}
                        {IsRequired ? <span className="text-red-500 ml-1">*</span> : null}
                    </label>
                    <label className="inline-flex items-center cursor-pointer gap-2">
                        <input
                            type="checkbox"
                            checked={value === 'true' || value === true}
                            onChange={(e) => onChange(String(e.target.checked))}
                            className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-600">{value === 'true' ? 'Yes' : 'No'}</span>
                    </label>
                </div>
            )

        case 'textarea':
            if (typeof CommonTextArea !== 'undefined') {
                return (
                    <CommonInputField
                        key={FieldKey}
                        label={FieldLabel}
                        value={value}
                        onChange={onChange}
                        placeholder={Placeholder || ''}
                        required={!!IsRequired}
                        loading={loading}
                    />
                )
            }
            return (
                <div key={FieldKey} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        {FieldLabel}
                        {IsRequired ? <span className="text-red-500 ml-1">*</span> : null}
                    </label>
                    <textarea
                        className="border rounded px-3 py-2 text-sm"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={Placeholder || ''}
                        rows={3}
                    />
                </div>
            )

        case 'number':
        case 'input':
        default:
            return (
                <CommonInputField
                    key={FieldKey}
                    label={FieldLabel}
                    value={value}
                    disabled={false}
                    onChange={onChange}
                    placeholder={Placeholder || ''}
                    required={!!IsRequired}
                    loading={loading}
                    type={InputType === 'number' ? 'number' : 'text'}
                />
            )
    }
}

export default function LeaveMasterAddNewEdit({ id, mode = 'add' }) {
    const navigate = useNavigate()

    const [fieldConfig, setFieldConfig] = useState([])
    const [loadingConfig, setLoadingConfig] = useState(true)
    const [loadingEditData, setLoadingEditData] = useState(false)

    const [dropdownOptions, setDropdownOptions] = useState({})

    const [selectedCategoryData, setSelectedCategoryData] = useState(null)
    const [loadingCategoryDetails, setLoadingCategoryDetails] = useState(false)

    const [formData, setFormData] = useState({})
    const [saving, setSaving] = useState(false)

    // ── 1. Load field config ──────────────────────────────────────────────────
    useEffect(() => {
        async function loadConfig() {
            setLoadingConfig(true)
            try {
                const res = await ApiCall('GET', '/leavemaster/fieldConfig')
                const configs = res?.data?.data ?? []
                setFieldConfig(configs)

                const initial = {}
                configs.forEach((c) => { initial[c.FieldKey] = '' })
                setFormData(initial)

                const dynamicDropdowns = configs.filter(
                    (c) => c.InputType === 'dropdown' && c.DropdownSource && !c.StaticOptions
                )
                await Promise.all(dynamicDropdowns.map(fetchDropdownOptions))
            } catch (err) {
                console.error('loadConfig error:', err)
            } finally {
                setLoadingConfig(false)
            }
        }
        loadConfig()
    }, [])

    // ── 2. Load existing data when in edit mode ───────────────────────────────
    useEffect(() => {
        if (mode !== 'edit' || !id || loadingConfig) return

        async function loadEditData() {
            setLoadingEditData(true)
            try {
                const res = await ApiCall('GET', `/leavemaster/leaveType/${id}`)
                const data = res?.data?.data
                if (!data) return

                // Map API response keys → form field keys
                // The API returns camelCase which matches the FieldKey values directly
                setFormData((prev) => {
                    const updated = { ...prev }
                    Object.keys(data).forEach((apiKey) => {
                        if (apiKey in updated) {
                            const val = data[apiKey]
                            updated[apiKey] = val === null || val === undefined ? '' : String(val)
                        }
                    })
                    return updated
                })
            } catch (err) {
                console.error('loadEditData error:', err)
            } finally {
                setLoadingEditData(false)
            }
        }
        loadEditData()
    }, [mode, id, loadingConfig])

    const fetchDropdownOptions = useCallback(async (config) => {
        try {
            const res = await ApiCall('GET', config.DropdownSource)
            const raw = res?.data?.data ?? []

            const options = raw.map((item) => {
                const keys = Object.keys(item)
                const valueKey = keys.find((k) =>
                    /id|code|value/i.test(k)
                ) ?? keys[0]
                const labelKey = keys.find((k) =>
                    /name|label|title|text/i.test(k)
                ) ?? keys[1] ?? keys[0]

                return {
                    label: String(item[labelKey] ?? ''),
                    value: String(item[valueKey] ?? ''),
                }
            })

            setDropdownOptions((prev) => ({ ...prev, [config.FieldKey]: options }))
        } catch (err) {
            console.error(`fetchDropdownOptions(${config.FieldKey}) error:`, err)
        }
    }, [])

    useEffect(() => {
        if (!formData.leaveCategory) {
            setSelectedCategoryData(null)
            return
        }
        async function loadCategoryDetails() {
            setLoadingCategoryDetails(true)
            try {
                const res = await ApiCall('GET', `/leavemaster/categoryData/${formData.leaveCategory}`)
                const data = res?.data?.data
                setSelectedCategoryData(Array.isArray(data) ? data[0] : data)
            } catch (err) {
                console.error('loadCategoryDetails error:', err)
                setSelectedCategoryData(null)
            } finally {
                setLoadingCategoryDetails(false)
            }
        }
        loadCategoryDetails()

        setFormData((prev) => {
            const cleared = { ...prev }
            fieldConfig
                .filter((c) => c.DependsOnFlag && c.DependsOnFlag !== 'accrualTypeSelected')
                .forEach((c) => { cleared[c.FieldKey] = '' })
            return cleared
        })
    }, [formData.leaveCategory])

    useEffect(() => {
        if (!formData.accrualType) {
            setFormData((prev) => ({ ...prev, maximumDays: '' }))
        }
    }, [formData.accrualType])

    const handleChange = (key) => (value) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    function resolveFlag(flagKey) {
        if (!selectedCategoryData || !flagKey) return false
        const normalize = (s) => s.replace(/[_\s-]/g, '').toLowerCase()
        const normalizedFlag = normalize(flagKey)
        const matchingKey = Object.keys(selectedCategoryData).find(
            (k) => normalize(k) === normalizedFlag
        )
        if (!matchingKey) return false
        const val = selectedCategoryData[matchingKey]
        return val === 1 || val === true || val === '1' || val === 'true' || val === 'yes'
    }

    function isFieldVisible(config) {
        if (!config.DependsOnFlag) return true
        if (config.DependsOnFlag === 'accrualTypeSelected') return !!formData.accrualType
        return resolveFlag(config.DependsOnFlag)
    }

    const visibleFields = fieldConfig.filter(isFieldVisible)
    const sections = [...new Set(visibleFields.map((c) => c.Section))]

    const sectionLabels = {
        basic: 'Basic Information',
        accrual: 'Accrual Settings',
        rules: 'Leave Rules',
        general: 'Other Settings',
    }

    if (loadingConfig || loadingEditData) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-sm text-gray-500">
                    {loadingEditData ? 'Loading leave type data...' : 'Loading form configuration...'}
                </div>
            </div>
        )
    }

    const handleSave = async () => {
        try {
            if (!formData.leaveTypeCode?.trim()) {
                showStatusToast({ type: 'warning', title: 'Validation', message: 'Leave Type Code is required', autoClose: false })
                return
            }
            if (!formData.leaveTypeName?.trim()) {
                showStatusToast({ type: 'warning', title: 'Validation', message: 'Leave Type Name is required', autoClose: false })
                return
            }
            if (!formData.leaveCategory) {
                showStatusToast({ type: 'warning', title: 'Validation', message: 'Leave Category is required', autoClose: false })
                return
            }

            const requiredVisibleFields = visibleFields.filter((f) => f.IsRequired)
            for (const field of requiredVisibleFields) {
                const value = formData[field.FieldKey]
                if (value === undefined || value === null || value === '') {
                    showStatusToast({ type: 'warning', title: 'Validation', message: `${field.FieldLabel} is required`, autoClose: false })
                    return
                }
            }

            setSaving(true)
            const payload = {
                ...formData,
                leaveTypeCode: formData.leaveTypeCode?.trim()?.toUpperCase(),
                leaveTypeName: formData.leaveTypeName?.trim(),
                leaveTypeDescription: formData.leaveTypeDescription || null,
                maximumDays: formData.maximumDays !== '' ? Number(formData.maximumDays) : null,
            }

            let res
            if (mode === 'edit' && id) {
                // UPDATE existing leave type
                res = await ApiCall('PUT', `/leavemaster/updateLeaveType/${id}`, payload)
            } else {
                // CREATE new leave type
                res = await ApiCall('POST', '/leavemaster/saveLeaveType', payload)
            }

            if (res?.data?.success) {
                showStatusToast({
                    type: 'success',
                    title: 'Success',
                    message: res.data.message || (mode === 'edit' ? 'Leave Type Updated Successfully' : 'Leave Type Saved Successfully'),
                    autoClose: true,
                    onClose: () => navigate(`${getRoleBasePath()}/leaveMasterList`),
                })
            } else {
                showStatusToast({
                    type: 'error',
                    title: 'Error',
                    message: res?.data?.message || 'Save failed',
                    autoClose: false,
                })
            }

        } catch (err) {
            console.error('saveLeaveType error:', err)
            showStatusToast({
                type: 'error',
                title: 'Error',
                message: err?.response?.data?.message || err?.message || 'Something went wrong',
                autoClose: false,
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            {sections.map((section) => {
                const sectionFields = visibleFields
                    .filter((c) => c.Section === section)
                    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)

                return (
                    <div key={section}>
                        {sections.length > 1 && (
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b">
                                {sectionLabels[section] ?? section}
                            </h3>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {sectionFields.map((config) => (
                                <DynamicField
                                    key={config.FieldKey}
                                    config={config}
                                    value={formData[config.FieldKey] ?? ''}
                                    onChange={handleChange(config.FieldKey)}
                                    dropdownOptions={dropdownOptions}
                                    loading={
                                        config.FieldKey === 'leaveCategory'
                                            ? loadingCategoryDetails
                                            : false
                                    }
                                />
                            ))}
                        </div>
                    </div>
                )
            })}
            <div className="flex justify-end pt-4 border-t">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="
            px-5 py-2
            rounded-md
            bg-blue-600
            text-white
            text-sm
            font-medium
            hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed
        "
                >
                    {saving
                        ? mode === 'add'
                            ? 'Adding...'
                            : 'Updating...'
                        : mode === 'add'
                            ? 'Add'
                            : 'Update'
                    }
                </button>
            </div>
        </div>
    )
}