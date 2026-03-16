import useSalaryStructure from "../hooks/useSalaryStructure"
import useSalaryDropdowns from "../hooks/useSalaryDropdowns"
import StructureBasicInformation from "./StructureBasicInformation"
import StructureComponents from "./StructureComponents"
import SalaryStructureCoastSummurySaveButtons from "./SalaryStructureCoastSummurySaveButtons"
import { useCallback } from "react"

function SalaryStructureAddEditMain({ isLoading, setIsLoading }) {

    const {
        structure,
        handleChange,
        addComponent,
        updateComponent,
        removeComponent
    } = useSalaryStructure()

    const {
        salaryComponents,
        calculationOptions,
        componentTypes,
        baseOptions
    } = useSalaryDropdowns(setIsLoading)

    const calculateTotalCost = useCallback(() => {
        let total = 0

        const fixedAmountByCode = {}
        structure.components.forEach(comp => {
            const calcType = calculationOptions.find(c => c.value === comp.calc_code)
            if (calcType && !calcType.requires_formula && !calcType.requires_percentage) {
                fixedAmountByCode[comp.component_code] = parseFloat(comp.fixed_amount) || 0
            }
        })

        structure.components.forEach(comp => {
            const calcType = calculationOptions.find(c => c.value === comp.calc_code)
            if (!calcType) return

            if (!calcType.requires_formula && !calcType.requires_percentage) {
                total += parseFloat(comp.fixed_amount) || 0

            } else if (calcType.requires_percentage && comp.base_component_code) {
                const baseAmount = fixedAmountByCode[comp.base_component_code] || 0
                total += ((parseFloat(comp.percentage_value) || 0) / 100) * baseAmount
            }
        })
        return total
    }, [structure.components, calculationOptions])

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

                <StructureBasicInformation
                    structure={structure}
                    handleChange={handleChange}
                    isLoading={isLoading}
                />

                <StructureComponents
                    structure={structure}
                    addComponent={addComponent}
                    updateComponent={updateComponent}
                    removeComponent={removeComponent}
                    salaryComponents={salaryComponents}
                    calculationOptions={calculationOptions}
                    componentTypes={componentTypes}
                    baseOptions={baseOptions}
                    isLoading={isLoading}
                />

            </div>

            <SalaryStructureCoastSummurySaveButtons
                structure={structure}
                calculationOptions={calculationOptions}
                componentTypes={componentTypes}
                calculateTotalCost={calculateTotalCost}
            />

        </div>
    )
}

export default SalaryStructureAddEditMain