import React, { useEffect, useState } from "react"
import SalaryComponentModal from "./SalaryComponentModal"
import LoadingSpinner from "../../basicComponents/LoadingSpinner"
import { Plus, Edit, Trash2 } from "lucide-react"
import { ApiCall } from "../../library/constants"
import CommonTable from "../../basicComponents/commonTable"
import CommonStatusPopUp from "../../basicComponents/CommonStatusPopUp"

function SalaryComponentMain({ isLoading, setIsLoading }) {

    const [controls, setControls] = useState([])
    const [dropdownOptions, setDropdownOptions] = useState({})
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedComponent, setSelectedComponent] = useState(null)
    const [errors, setErrors] = useState({})

    const [newComponent, setNewComponent] = useState({})

    const [components, setComponents] = useState([])
    const [statusPopup, setStatusPopup] = useState({
        show: false,
        type: "default",
        title: "",
        message: "",
        autoClose: false
    })

    const allComponentCodes = components.map(c => ({
        value: c.component_code,
        label: c.component_code
    }))

    const resetModal = () => {
        const defaultState = {}
        controls.forEach(c => {
            defaultState[c.column_name] = ""
        })
        defaultState.formula = ""
        setNewComponent(defaultState)
        setSelectedComponent(null)
        setShowCreateModal(false)
        setErrors({})
    }

    useEffect(() => {
        getSalaryComponentControls()
        getSalaryComponents()
    }, [])

    async function getSalaryComponentControls() {
        setIsLoading(true);
        try {
            const result = await ApiCall("get", "/getmenubasedcontrols/29")
            const controlsData = result.data.data.controls
            const dropdownData = result.data.data.dropdowns

            setControls(controlsData)
            setDropdownOptions(dropdownData)

            const defaultState = {}
            controlsData.forEach(c => {
                defaultState[c.column_name] = ""
            })

            defaultState.formula = ""

            setNewComponent(defaultState)

        } catch (err) {
            console.log("error loading controls", err)
        }
        setIsLoading(false)
    }

    async function getSalaryComponents() {
        setIsLoading(true)
        try {
            const result = await ApiCall("get", "/salarycomponent/list")
            const componentsData = result.data.data
            setComponents(componentsData)
        } catch (err) {
            console.log("error loading components", err)
        }
        setIsLoading(false)
    }

    const handleChange = (field, value) => {
        setNewComponent(prev => ({ ...prev, [field]: value }))
    }

    const insertOperator = (operator) => {
        setNewComponent(prev => ({
            ...prev,
            formula: (prev.formula || "") + ` ${operator} `
        }))
    }

    const insertComponentCode = (code) => {
        setNewComponent(prev => ({
            ...prev,
            formula: (prev.formula || "") + ` ${code} `
        }))
    }

    function validateForm() {
        const newErrors = {}
        controls.forEach(control => {
            const value = newComponent[control.column_name]

            if (control.required && !value) {
                newErrors[control.column_name] = `${control.label} is required`
                return
            }

            if (control.regex && value) {

                const regex = new RegExp(control.regex)

                if (!regex.test(value)) {
                    newErrors[control.column_name] =
                        `${control.label} format is invalid`
                }
            }

            if (control.min_length && value?.length < control.min_length) {
                newErrors[control.column_name] =
                    `${control.label} must be at least ${control.min_length} characters`
            }

            if (control.max_length && value?.length > control.max_length) {
                newErrors[control.column_name] =
                    `${control.label} must be less than ${control.max_length} characters`
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleCreateComponent() {
        if (!validateForm()) return
        try {
            const payload = {}
            controls.forEach(control => {
                const key = control.column_name
                if (newComponent[key] !== undefined) {
                    payload[key] = newComponent[key]
                }
            })
            const calcOptions = dropdownOptions["calc_code"] || []
            const selectedCalc = calcOptions.find(
                c => c.value === newComponent.calc_code
            )
            if (selectedCalc?.requires_formula) {
                payload.formula_expression = newComponent.formula
            }
            else if (selectedCalc?.requires_percentage) {
                payload.percentage_value = newComponent.formula
                payload.base_component_code = newComponent.base_component_code
            }
            else {
                payload.fixed_amount = newComponent.formula
            }
            let result
            if (selectedComponent) {
                payload.id = selectedComponent.id
                result = await ApiCall("put", "/salarycomponent/update", payload)
            } else {
                result = await ApiCall("post", "/salarycomponent/save", payload)
            }
            if (result.data.success) {
                setStatusPopup({
                    show: true,
                    type: "success",
                    title: "Success",
                    message: result.data.message,
                    autoClose: true
                })
                setSelectedComponent(null)
                await getSalaryComponents()
            }
        } catch (error) {
            setStatusPopup({
                show: true,
                type: "error",
                title: "Error",
                message: error?.response?.data?.message || "Save failed",
                autoClose: false
            })
        }
    }

    function handleEditComponent(row) {
        const editData = {
            ...row,
            formula:
                row.formula_expression ||
                row.percentage_value ||
                row.fixed_amount ||
                ""
        }
        setNewComponent(editData)
        setSelectedComponent(row)
        setShowCreateModal(true)
    }

    async function handleDeleteComponent(row) {
        if (!window.confirm("Delete this salary component?")) return
        try {
            const result = await ApiCall(
                "delete",
                `/salarycomponent/delete/${row.id}`
            )
            if (result.data.success) {
                setStatusPopup({
                    show: true,
                    type: "success",
                    title: "Deleted",
                    message: result.data.message,
                    autoClose: true
                })
                await getSalaryComponents()
            }
        } catch (err) {
            setStatusPopup({
                show: true,
                type: "error",
                title: "Error",
                message: "Delete failed",
                autoClose: false
            })
        }
    }

    const tableColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEditComponent(row)}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteComponent(row)}
                        className="text-red-600 hover:text-red-800"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Code",
            accessor: "component_code"
        },
        {
            header: "Component Name",
            accessor: "component_name"
        },
        {
            header: "Component Type",
            accessor: "type_code",
            cell: row => {
                const typeMap = Object.fromEntries(
                    (dropdownOptions.type_code || []).map(x => [x.value, x.label])
                );
                return typeMap[row.type_code] || row.type_code;
            }
        },
        {
            header: "Calculation Type",
            accessor: "calc_code",
            cell: row => {
                const calcMap = Object.fromEntries(
                    (dropdownOptions.calc_code || []).map(x => [x.value, x.label])
                );
                return calcMap[row.calc_code] || row.calc_code;
            }
        },
        {
            header: "Formula / Value",
            accessor: "formula",
            cell: row => {
                if (row.formula_expression) {
                    return row.formula_expression
                }
                if (row.percentage_value) {
                    return `${row.percentage_value}% of ${row.base_component_code}`
                }
                if (row.fixed_amount) {
                    return row.fixed_amount
                }
                return "-"
            }
        },
        {
            header: "Active",
            accessor: "status",
            cell: row => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${row.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                >
                    {row.status ? "Active" : "Inactive"}
                </span>
            )
        }
    ]

    return (
        <>
            <CommonTable
                columns={tableColumns}
                data={components}
                loading={isLoading}
                tableControls={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 h-7 text-sm font-semibold cursor-pointer bg-indigo-600 text-white rounded-md flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create
                    </button>
                }
            />

            {showCreateModal && (
                <SalaryComponentModal
                    controls={controls}
                    dropdownOptions={dropdownOptions}
                    newComponent={newComponent}
                    handleChange={handleChange}
                    insertOperator={insertOperator}
                    insertComponentCode={insertComponentCode}
                    handleCreateComponent={handleCreateComponent}
                    onClose={resetModal}
                    selectedComponent={selectedComponent}
                    allComponentCodes={allComponentCodes}
                    errors={errors}
                />
            )}

            {isLoading && <LoadingSpinner />}

            <CommonStatusPopUp
                isOpen={statusPopup.show}
                type={statusPopup.type}
                title={statusPopup.title}
                body={statusPopup.message}
                autoClose={statusPopup.autoClose}
                onClose={() => {
                    setStatusPopup(prev => ({ ...prev, show: false }))
                    if (statusPopup.type === "success") {
                        resetModal()
                    }
                }}
            />
        </>
    )
}

export default SalaryComponentMain