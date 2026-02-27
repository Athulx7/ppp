import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonCheckbox from '../../basicComponents/CommonCheckBox'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import { ApiCall, getRoleBasePath } from '../../library/constants'
import CommonToggleButton from '../../basicComponents/CommonToggleButton'
import { useNavigate } from 'react-router-dom'

function EmpMstAddEditInputs({ isLoading, isDisabled, empMstControls, setIsDisabled, setIsLoading, statusPopup, setStatusPopup, autoCode, employeeId }) {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({})
    const [dropdownOptions, setDropdownOptions] = useState({})
    const [errors, setErrors] = useState({})

    const [roles, setRoles] = useState({ hr: false, admin: false, payroll_manager: false })

    useEffect(() => {
        if (!employeeId) return
        loadEmployeeData()
    }, [employeeId])

    const loadEmployeeData = async () => {
        setIsLoading(true)
        try {
            const res = await ApiCall('get', `/empmst/getemployee/${employeeId}`)
            console.log('res load empbyid', res)
            if (res?.data?.success) {
                setFormData(res.data.data)
            }
        } catch (err) {
            console.log("Error loading employee", err)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if (employeeId) return
        if (!autoCode || !empMstControls.length) return
        const autoControl = empMstControls.find(c => c.is_auto_code == 1)
        if (autoControl) {
            setFormData(prev => ({
                ...prev,
                [autoControl.column_name]: autoCode
            }))
        }

    }, [autoCode, empMstControls])

    useEffect(() => {
        if (!empMstControls.length) return

        const independentDropdowns = empMstControls.filter(
            control =>
                control.field_type === "dropdown" &&
                !control.depends_on &&
                control.visible &&
                !control.is_disable
        )
        independentDropdowns.forEach(control => {
            fetchDropdown(control)
        })

    }, [empMstControls])

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

    useEffect(() => {

        if (!employeeId) return
        if (!empMstControls.length) return
        if (!Object.keys(formData).length) return

        empMstControls.forEach(control => {
            if (control.depends_on) {
                const parentValue = formData[control.depends_on]
                if (parentValue) {
                    fetchDropdown(control, parentValue)
                }
            }
        })

    }, [employeeId, empMstControls])

    // useEffect(() => {

    //     if (!formData.joining_date || !formData.probation_months) return

    //     const joiningDate = new Date(formData.joining_date)
    //     const months = Number(formData.probation_months)

    //     if (isNaN(months)) return

    //     const probationEnd = new Date(joiningDate)
    //     probationEnd.setMonth(probationEnd.getMonth() + months)

    //     const formatted = probationEnd.toISOString().split("T")[0]

    //     setFormData(prev => ({
    //         ...prev,
    //         probation_end_date: formatted
    //     }))

    // }, [formData.joining_date, formData.probation_months])

    const renderField = (control) => {

        if (!control.visible || control.is_disable) return null

        const commonProps = {
            label: control.label,
            value: formData[control.column_name] || '',
            onChange: (val) => handleChange(control.column_name, val),
            disabled: isDisabled || control.readonly,
            required: control.required,
            loading: isLoading
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
                            value={formData[control.column_name] !== undefined ? Number(formData[control.column_name]) : 1}
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

            if (formData.date_of_birth && formData.joining_date) {

                const dob = new Date(formData.date_of_birth)
                const joining = new Date(formData.joining_date)

                if (dob >= joining) {
                    newErrors.date_of_birth = "Date of Birth must be before Joining Date"
                }

                const age = joining.getFullYear() - dob.getFullYear()

                if (age < 18) {
                    newErrors.date_of_birth = "Employee must be at least 18 years old at joining"
                }
            }
        })

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSave = async () => {

        const isValid = validateForm()

        if (!isValid) {
            setStatusPopup({
                show: true,
                type: "error",
                title: "Validation Error",
                message: "Please fix the highlighted errors.",
                autoClose: false
            })
            return
        }

        setIsLoading(true)

        const payload = {}

        empMstControls.forEach(control => {
            if (control.visible && !control.is_disable) {
                payload[control.column_name] = formData[control.column_name] ?? null
            }
        })

        payload.roles = roles

        try {

            const url = employeeId ? `/empmst/updateempmaster/${employeeId}` : `/empmst/saveempmaster`
            const method = employeeId ? 'put' : 'post'
            const res = await ApiCall(method, url, payload)

            if (res?.data?.success) {
                setStatusPopup({
                    show: true,
                    type: "success",
                    title: "Success",
                    message: `Employee ${employeeId ? 'Updated' : 'saved'} successfully.`,
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

            <div className="grid grid-cols-4">
                <CommonDropDown
                    label="Role"
                    value={formData.role_code || 'EMPLOYEE'}
                    options={[
                        { value: 'ADMIN', label: 'Admin' },
                        { value: 'HR', label: 'HR' },
                        { value: 'PAYROLL_MANAGER', label: 'Payroll Manager' },
                        { value: 'EMPLOYEE', label: 'Employee' }
                    ]}
                    onChange={(val) => handleChange('role_code', val)}
                    required
                    loading={isLoading}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-300 animate-pulse">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>

                    <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                </div>
            ) : (
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-300">

                    <button
                        onClick={() => navigate(`${getRoleBasePath()}/employee_master_entry`)}
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                    >
                        {employeeId ? 'Update' : 'Save'}
                    </button>

                </div>
            )}

        </div>
    )
}

export default EmpMstAddEditInputs
