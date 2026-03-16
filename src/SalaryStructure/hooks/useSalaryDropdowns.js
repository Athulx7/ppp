import { useState, useEffect } from "react";
import { ApiCall } from "../../library/constants";

export default function useSalaryDropdowns(setIsLoading) {

    const [salaryComponents, setSalaryComponents] = useState([])
    const [calculationOptions, setCalculationOptions] = useState([])
    const [componentTypes, setComponentTypes] = useState([])
    const [baseOptions, setBaseOptions] = useState([])

    useEffect(() => {
        fetchComponentDropdown()
        fetchCalculationTypeDropdown()
        fetchComponentTypeDropdown()
    }, [])

    async function fetchComponentDropdown() {
        try {
            setIsLoading(prev => ({ ...prev, normal: true }))
            const result = await ApiCall('get', '/salarystructure/dropdownCcomponent')
            const raw = result.data.data
            setSalaryComponents(raw)
            setBaseOptions(
                raw.map(c => ({
                    value: c.component_code,
                    label: `${c.component_name} (${c.component_code})`
                }))
            )
        } finally {
            setIsLoading(prev => ({ ...prev, normal: false }))
        }
    }

    async function fetchCalculationTypeDropdown() {
        const result = await ApiCall('get', '/salarystructure/dropdownCalculationtype')
        setCalculationOptions(
            result.data.data.map(c => ({
                value: c.value,
                label: c.label,
                requires_formula: c.requires_formula,
                requires_percentage: c.requires_percentage
            }))
        )
    }

    async function fetchComponentTypeDropdown() {
        const result = await ApiCall('get', '/salarystructure/dropdownComponentType')
        setComponentTypes(
            result.data.data.map(t => ({
                value: t.value,
                label: t.label
            }))
        )
    }

    return {
        salaryComponents,
        calculationOptions,
        componentTypes,
        baseOptions
    }
}