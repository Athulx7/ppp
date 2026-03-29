import { useEffect } from "react"
import useSalaryStructure from "../hooks/useSalaryStructure"
import useSalaryDropdowns from "../hooks/useSalaryDropdowns"
import StructureBasicInformation from "./StructureBasicInformation"
import StructureComponents from "./StructureComponents"
import SalaryStructureCoastSummurySaveButtons from "./SalaryStructureCoastSummurySaveButtons"
import { useCallback, useMemo } from "react"
import { calculateSalaryComponents } from "./StructureComponents/calculateSalaryComponents"
import { ApiCall, getRoleBasePath } from "../../library/constants"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { showStatusToast } from "../../basicComponents/CommonStatusPopUp"

function SalaryStructureAddEditMain({ isLoading, setIsLoading }) {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const isEditMode = !!id
    const isViewMode = location.pathname.includes('/view/')

    const {
        structure,
        handleChange,
        addComponent,
        updateComponent,
        removeComponent,
        fetchStructureById
    } = useSalaryStructure()

    useEffect(() => {
        if (isEditMode) {
            fetchStructureById(id, setIsLoading)
        }
    }, [id])

    const {
        salaryComponents,
        calculationOptions,
        componentTypes,
        baseOptions
    } = useSalaryDropdowns(setIsLoading)

    const { values, netCost, breakdown } = useMemo(() => {
        return calculateSalaryComponents(structure.components, componentTypes, calculationOptions)
    }, [structure.components, componentTypes, calculationOptions])

    const isBasicInfoComplete = Boolean(structure.name?.trim() && structure.effectiveDate)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setIsLoading({ normal: false, spinner: true })

            const payload = {
                structureCode: structure.code,
                structureName: structure.name,
                description: structure.description,
                effectiveDate: structure.effectiveDate,
                status: structure.status,

                components: structure.components.map(c => ({
                    componentId: c.componentId,
                    calc_code: c.calc_code,
                    fixed_amount: c.fixed_amount || null,
                    percentage_value: c.percentage_value || null,
                    base_component_code: c.base_component_code || null,
                    formula_expression: c.formula_expression || null,
                }))
            }

            console.log("🚀 Sending payload:", payload)

            const res = await ApiCall("post", "/salarystructure/save", payload)
            console.log('save api res', res)

            if (res?.data?.success) {
                showStatusToast({
                    type: "success",
                    title: "Success",
                    message: isEditMode ? "Salary Structure updated successfully." : "Salary Structure created successfully.",
                    autoClose: true,
                })
                handleCancel()
            } else {
                showStatusToast({
                    type: "error",
                    title: "Error",
                    message: res?.data?.message || "Failed to save structure.",
                    autoClose: false,
                })
            }

        } catch (err) {
            console.error("Save Error:", err)
            showStatusToast({
                type: "error",
                title: "Server Error",
                message: "An error occurred while saving the structure.",
                autoClose: false,
            })
        } finally {
            setIsLoading({ normal: false, spinner: false })
        }
    }

    const handleCancel = () => {
        navigate(`${getRoleBasePath()}/salary_structure`)
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

                <StructureBasicInformation
                    structure={structure}
                    handleChange={handleChange}
                    isLoading={isLoading}
                    isViewMode={isViewMode}
                />

                <StructureComponents
                    structure={structure}
                    addComponent={addComponent}
                    updateComponent={updateComponent}
                    removeComponent={removeComponent}
                    calculatedValues={values}
                    salaryComponents={salaryComponents}
                    calculationOptions={calculationOptions}
                    componentTypes={componentTypes}
                    baseOptions={baseOptions}
                    isLoading={isLoading}
                    isBasicInfoComplete={isBasicInfoComplete}
                    isViewMode={isViewMode}
                />

            </div>

            <SalaryStructureCoastSummurySaveButtons
                structure={structure}
                calculationOptions={calculationOptions}
                componentTypes={componentTypes}
                calculatedValues={values}
                netCost={netCost}
                breakdown={breakdown}
                isBasicInfoComplete={isBasicInfoComplete}
                isViewMode={isViewMode}
                isEditMode={isEditMode}
                handleCancel={handleCancel}
            />

        </form>
    )
}

export default SalaryStructureAddEditMain