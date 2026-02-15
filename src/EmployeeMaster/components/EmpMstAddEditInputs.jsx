import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonCheckbox from '../../basicComponents/CommonCheckBox'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import { ApiCall, getRoleBasePath } from '../../library/constants'
import CommonToggleButton from '../../basicComponents/CommonToggleButton'
import { useNavigate } from 'react-router-dom'

function EmpMstAddEditInputs({ isDisabled, empMstControls, setIsDisabled, setIsLoading, statusPopup, setStatusPopup, autoCode }) {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [dropdownOptions, setDropdownOptions] = useState({})
    const [errors, setErrors] = useState({})

    const [roles, setRoles] = useState({ hr: false, admin: false, payroll_manager: false })

    useEffect(() => {
        if (!autoCode || !empMstControls.length) return

        const autoControl = empMstControls.find(c => c.is_auto_code == 1)

        if (autoControl) {
            setFormData(prev => ({
                ...prev,
                [autoControl.column_name]: autoCode
            }))
        }

    }, [autoCode, empMstControls])

    const fetchDropdown = async (control, parentValue = null) => {
        setIsLoading(true)
        try {
            let url = `/empmst/getempmstdropdowndata/${control.column_name}`

            if (parentValue) { url += `?${control.depends_on}=${parentValue}` }

            const res = await ApiCall('get', url)

            if (res?.data?.success) {
                setDropdownOptions(prev => ({
                    ...prev,
                    [control.column_name]: res.data.data
                }))
            }
        } catch (err) {
            console.log('error i the fetch dropdown Data', err)
        }
        setIsLoading(false)
    }

    const handleChange = (name, value) => {
        const finalValue = value?.code ? value.code : value

        setFormData(prev => {
            const updated = { ...prev, [name]: finalValue }

            const dependentFields = empMstControls.filter(c => c.depends_on === name)

            dependentFields.forEach(field => {
                updated[field.column_name] = ''
            })

            return updated
        })
        const dependentFields = empMstControls.filter(
            c => c.depends_on === name
        )

        dependentFields.forEach(field => {
            fetchDropdown(field, finalValue)
        })
    }

    const renderField = (control) => {

        if (!control.visible || control.is_disable) return null

        const commonProps = {
            label: control.label,
            value: formData[control.column_name] || '',
            onChange: (val) => handleChange(control.column_name, val),
            disabled: isDisabled || control.readonly,
            required: control.required
        }

        switch (control.field_type) {

            case "text":
            case "number":
                return (
                    <CommonInputField
                        key={control.id}
                        {...commonProps}
                        placeholder={`Enter ${control.label}`}
                        regex={control.regex}
                        errorMessage={errors[control.column_name]}
                    />
                )

            case "date":
                return (
                    <CommonDatePicker
                        key={control.id}
                        {...commonProps}
                        placeholder="dd-mm-yyyy"
                        errorMessage={errors[control.column_name]}
                    />
                )

            case "dropdown":
                return (
                    <CommonDropDown
                        key={control.id}
                        {...commonProps}
                        options={dropdownOptions[control.column_name] || []}
                        placeholder={`Select ${control.label}`}
                        errorMessage={errors[control.column_name]}
                    />
                )

            case "toggle":
                return (
                    <div>
                        <CommonToggleButton
                            label='Active'
                            value={formData[control.column_name] ?? 0}
                            onChange={v =>
                                handleChange(control.column_name, v)
                            }
                        />
                    </div>
                )

            default:
                return null
        }
    }

    const validateForm = () => {

        let newErrors = {}

        empMstControls.forEach(control => {

            if (!control.visible || control.is_disable) return

            const value = formData[control.column_name]

            if (control.required && !value) {
                newErrors[control.column_name] =
                    `${control.label} is required`
            }

            if (control.regex && value) {
                const regex = new RegExp(control.regex)
                if (!regex.test(value)) {
                    newErrors[control.column_name] =
                        control.error_message || `${control.label} is invalid`
                }
            }
        })

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {

        const validationError = validateForm()
        if (validationError) {
            setStatusPopup({
                show: true,
                type: "error",
                title: "Validation Error",
                message: validationError,
                autoClose: false
            })
            return
        }

        setIsLoading(true)

        const payload = { ...formData, roles }

        try {
            const res = await ApiCall('post', '/empmst/save', payload)

            if (res?.data?.success) {
                setStatusPopup({
                    show: true,
                    type: "success",
                    title: "Success",
                    message: "Employee saved successfully.",
                    autoClose: true
                })
            } else {
                setStatusPopup({
                    show: true,
                    type: "error",
                    title: "Error",
                    message: res?.data?.message || "Something went wrong.",
                    autoClose: false
                })
            }

        } catch (err) {
            setStatusPopup({
                show: true,
                type: "error",
                title: "Server Error",
                message: "Unable to save employee.",
                autoClose: false
            })
        }

        setIsLoading(false)
    }

    return (
        <div className="bg-white rounded-xl p-5 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {empMstControls.sort((a, b) => a.priority - b.priority).map(control => renderField(control))}
            </div>

            <div className='flex justify-end'>
                <label className="block text-sm font-medium mr-2">
                    Assign Roles
                </label>

                <div className="flex gap-6">
                    <CommonCheckbox
                        label="HR"
                        checked={roles.hr}
                        onChange={(val) => setRoles(prev => ({ ...prev, hr: val }))}
                    />

                    <CommonCheckbox
                        label="Admin"
                        checked={roles.admin}
                        onChange={(val) => setRoles(prev => ({ ...prev, admin: val }))}
                    />

                    <CommonCheckbox
                        label="Payroll Manager"
                        checked={roles.payroll_manager}
                        onChange={(val) => setRoles(prev => ({ ...prev, payroll_manager: val }))}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-300">

                <button onClick={() => navigate(`${getRoleBasePath()}/employee_master_entry`)}
                    className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                    Cancel
                </button>

                <button onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                >
                    Save
                </button>

            </div>

        </div>
    )
}

export default EmpMstAddEditInputs
