import { useState, useCallback } from "react"
import { ApiCall } from "../../library/constants"

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

    const fetchStructureById = async (id, setIsLoading) => {
        try {
            setIsLoading({ normal: false, spinner: true })

            const res = await ApiCall('get', `/salarystructure/${id}`)

            if (res?.data?.success) {
                setStructure(res.data.data)
            }

        } catch (err) {
            console.error('fetchStructureById:', err)
        } finally {
            setIsLoading({ normal: false, spinner: false })
        }
    }

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
        fetchStructureById,
        handleChange,
        addComponent,
        updateComponent,
        removeComponent
    }
}