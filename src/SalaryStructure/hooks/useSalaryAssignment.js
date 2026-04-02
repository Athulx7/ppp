import { useState } from "react"
import { ApiCall } from "../../library/constants"

export default function useSalaryAssignment(onClose) {

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [showSuccess, setShowSuccess] = useState(false)

    const saveAssignment = async (formData, isEditMode) => {
        try {
            setLoading(true)

            const payload = {
                assignment_type: formData.assignmentType,
                target_code: formData.targetId,
                structure_id: formData.structureId,
                effective_date: formData.effectiveDate,
                end_date: formData.isPermanent ? null : formData.endDate,
                reason: formData.reason,
                status: formData.status
            }

            if (isEditMode) {
                payload.assignment_type = "employee"
            }

            const res = await ApiCall("post", "/salarystructure/saveassign", payload)

            if (res?.data?.success) {
                setShowSuccess(true)

                setTimeout(() => {
                    setShowSuccess(false)
                    onClose()
                }, 1200)
            }

        } catch (err) {
            console.error(err)
            setErrors({
                submit: err?.response?.data?.message || "Save failed"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchAssignmentById = async (id) => {
        const res = await ApiCall("get", `/salarystructure/assignment/${id}`)
        return res?.data?.data
    }

    return {
        saveAssignment,
        fetchAssignmentById,
        loading,
        errors,
        showSuccess,
        setErrors,
        setLoading,
        setShowSuccess
    }
}