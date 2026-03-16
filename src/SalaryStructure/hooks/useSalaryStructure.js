import { useState, useCallback } from "react"

const EMPTY_STRUCTURE = {
    name: '',
    code: '',
    description: '',
    components: [],
    status: 'active',
    effectiveDate: new Date().toISOString().split('T')[0]
}

export default function useSalaryStructure() {
    const [structure, setStructure] = useState(EMPTY_STRUCTURE)
    const handleChange = useCallback((field, value) => {
        setStructure(prev => ({ ...prev, [field]: value }))
    }, [])

    const addComponent = useCallback((component) => {
        setStructure(prev => ({
            ...prev,
            components: [...prev.components, component]
        }))
    }, [])

    const updateComponent = useCallback((index, data) => {
        setStructure(prev => {
            const updated = [...prev.components]
            updated[index] = { ...updated[index], ...data }
            return { ...prev, components: updated }
        })
    }, [])

    const removeComponent = useCallback((index) => {
        setStructure(prev => ({
            ...prev,
            components: prev.components.filter((_, i) => i !== index)
        }))
    }, [])

    return {
        structure,
        setStructure,
        handleChange,
        addComponent,
        updateComponent,
        removeComponent
    }
}