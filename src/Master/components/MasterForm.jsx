import React, { useEffect, useState } from "react"
import CommonInputField from "../../basicComponents/CommonInputField"
import CommonDropDown from "../../basicComponents/CommonDropDown"
import CommonToggleButton from "../../basicComponents/CommonToggleButton"
import CommonDatePicker from "../../basicComponents/CommonDatePicker"
import { ApiCall } from "../../library/constants"
import LoadingSpinner from "../../basicComponents/LoadingSpinner"
import CommonStatusPopUp from "../../basicComponents/CommonStatusPopUp"

function MasterForm({ meta, initialData, onCancel, isEdit, isLoading, setIsLoading }) {
    const [statusPopup, setStatusPopup] = useState({
        open: false,
        type: "success",
        title: "",
        body: ""
    })
    const closePopup = () => {
        setStatusPopup(prev => ({ ...prev, open: false }))
    }
    const [formData, setFormData] = useState({})
    const [dropdownOptions, setDropdownOptions] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!initialData) return
        setFormData(prev => ({
            ...prev,
            ...initialData
        }))
    }, [initialData])

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        if (!meta?.fields || !meta?.menu_id) return

        meta.fields.forEach(field => {
            if (field.field_type === "dropdown" && !field.depends_on) {
                ApiCall("GET", `/master/${meta.menu_id}/dropdown/${field.column_name}`).then(res => {
                    if (res?.data?.success) {
                        setDropdownOptions(prev => ({
                            ...prev,
                            [field.column_name]: res.data.data
                        }))
                    }
                })
            }
        })
    }, [meta])

    useEffect(() => {
        if (!meta?.fields || !meta?.menu_id) return

        meta.fields.forEach(field => {
            if (!field.depends_on) return

            const parentValue = formData[field.depends_on]
            if (!parentValue) {
                setDropdownOptions(prev => ({
                    ...prev,
                    [field.column_name]: []
                }))
                return
            }

            ApiCall("GET", `/master/${meta.menu_id}/dropdown/${field.column_name}?${field.depends_on}=${parentValue}`).then(res => {
                if (res?.data?.success) {
                    setDropdownOptions(prev => ({
                        ...prev,
                        [field.column_name]: res.data.data
                    }))
                }
            })
        })
    }, [meta, meta?.fields?.map(f => formData[f.depends_on]).join("|")])

    useEffect(() => {
        if (!meta?.autocode || !meta?.fields) return
        if (isEdit) return

        const autoField = meta.fields.find(f => f.is_auto_code === 1)
        if (!autoField) return

        setFormData(prev => {
            if (prev[autoField.column_name]) return prev

            return {
                ...prev,
                [autoField.column_name]: meta.autocode
            }
        })
    }, [meta?.autocode, meta?.fields, isEdit])

    const handleSave = async () => {
        setIsLoading(true)
        setSaving(true)
        try {
            const res = await ApiCall("POST", `/master/${meta.menu_id}/save`, formData)

            if (res?.data?.success) {
                setStatusPopup({
                    open: true,
                    type: "success",
                    title: isEdit ? "Updated Successfully" : "Saved Successfully",
                    body: isEdit
                        ? "The record has been updated successfully."
                        : "The record has been created successfully."
                })
            }
        } catch (err) {
            console.error("Save failed", err)
            setStatusPopup({
                open: true,
                type: "error",
                title: "Save Failed",
                body: "Something went wrong while saving."
            })
        } finally {
            setSaving(false)
            setIsLoading(false)
        }
    }

    const renderField = field => {
        const value = formData[field.column_name]

        switch (field.field_type) {
            case "text":
                return (
                    <CommonInputField
                        label={field.label}
                        value={value || ""}
                        disabled={field.is_auto_code === 1}
                        onChange={v =>
                            handleChange(field.column_name, v)
                        }
                        placeholder={`Enter ${field.label}`}
                        required={field.required === 1 ? true : false}
                        loading={isLoading}
                    />
                )

            case "dropdown":
                return (
                    <CommonDropDown
                        label={field.label}
                        value={value || ""}
                        options={
                            dropdownOptions[field.column_name] || []
                        }
                        disabled={
                            field.is_disable === 1 ||
                            (field.depends_on &&
                                !formData[field.depends_on])
                        }
                        onChange={v =>
                            handleChange(field.column_name, v)
                        }
                        required={field.required === 1 ? true : false}
                        loading={isLoading}
                    />
                )

            case "toggle":
                return (
                    <CommonToggleButton
                        label={field.label}
                        value={value ?? 0}
                        onChange={v =>
                            handleChange(field.column_name, v)
                        }
                        loading={isLoading}
                    />
                )

            case "date":
                return (
                    <CommonDatePicker
                        label={field.label}
                        value={value || null}
                        onChange={v =>
                            handleChange(field.column_name, v)
                        }
                        required={field.required === 1 ? true : false}
                        loading={isLoading}
                    />
                )

            default:
                return null
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {meta.fields
                    .filter(f => f.visible !== 0)
                    .sort((a, b) => a.priority - b.priority)
                    .map(field => (
                        <div key={field.id}>
                            {renderField(field)}
                        </div>
                    ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    className="text-red-600 px-5 py-1 border border-red-600 rounded-md cursor-pointer"
                    onClick={onCancel}
                >
                    Cancel
                </button>

                <button
                    className="bg-indigo-600 text-white px-7 py-1 rounded-md cursor-pointer"
                    disabled={saving}
                    onClick={handleSave}
                >
                    {isEdit ? "Update" : "Save"}
                </button>
            </div>
            {isLoading && <LoadingSpinner />}
            <CommonStatusPopUp
                isOpen={statusPopup.open}
                type={statusPopup.type}
                title={statusPopup.title}
                body={statusPopup.body}
                onClose={() => {
                    closePopup()
                    if (statusPopup.type === "success") {
                        onCancel()
                    }
                }}
                primaryButtonText={statusPopup.type === "error" ? "OK" : ""}
                onPrimaryButtonClick={closePopup}
            />
        </div>
    )
}

export default MasterForm
