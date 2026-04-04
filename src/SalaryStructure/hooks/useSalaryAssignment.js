import { useState } from "react"
import { ApiCall } from "../../library/constants"
import { showStatusToast } from "../../basicComponents/CommonStatusPopUp"

export default function useSalaryAssignment(onClose) {

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const saveAssignment = async (formData, isEditMode, assignmentId) => {
        try {
            setLoading(true)

            const payload = {
                assignmentType: formData.assignmentType,
                target_code: formData.targetId,
                structure_id: formData.structureId,
                effective_date: formData.effectiveDate,
                end_date: formData.isPermanent ? null : formData.endDate,
                reason: formData.reason,
                status: formData.status === 'active' ? 1 : 0
            }

            let res

            if (isEditMode) {
                res = await ApiCall("put", `/salarystructure/assignment/${assignmentId}`, payload)  // ✅ now defined
            } else {
                res = await ApiCall("post", "/salarystructure/assignment", payload)
            }

            if (res?.data?.success) {
                showStatusToast({
                    type: "success",
                    title: "Success",
                    message: isEditMode
                        ? "Assignment updated successfully."
                        : "Salary structure assigned successfully.",
                    autoClose: true,
                    onClose: () => onClose(),
                })
            } else {
                showStatusToast({
                    type: "error",
                    title: "Error",
                    message: res?.data?.message || "Failed to save assignment.",
                    autoClose: false,
                })
            }

        } catch (err) {
            console.error("saveAssignment:", err)
            showStatusToast({
                type: "error",
                title: "Server Error",
                message: "An error occurred while saving the assignment.",
                autoClose: false,
            })
            setErrors({ submit: "An error occurred while saving the assignment." })
        } finally {
            setLoading(false)
        }
    }

    const fetchAssignmentById = async (id, empCode) => {
        try {
            const res = await ApiCall(
                "get",
                `/salarystructure/assignment/${id}?emp_code=${empCode || ''}`
            )

            if (res?.data?.success) {
                return res.data.data
            }

        } catch (err) {
            console.error("fetchAssignmentById:", err)
        }
    }

    return {
        saveAssignment,
        fetchAssignmentById,
        loading,
        errors,
        setErrors,
        setLoading,
    }
}