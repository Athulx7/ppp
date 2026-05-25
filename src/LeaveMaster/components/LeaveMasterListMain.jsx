import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import CommonTable from '../../basicComponents/commonTable'
import { ApiCall, getRoleBasePath } from '../../library/constants'
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp'
import CommonConfirmPopup from '../../basicComponents/CommonConfirmPopup'

function LeaveMasterList({ isLoading, setIsLoading, navigate }) {

    const [leaveTypes, setLeaveTypes] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false, row: null, loading: false })
    useEffect(() => {
        loadLeaveTypes()
    }, [])

    async function loadLeaveTypes() {
        setIsLoading({ normal: false, spinner: true })
        try {
            const res = await ApiCall('GET', '/leavemaster/savedLeaveTypeList')
            if (res?.data?.success) {
                setLeaveTypes(res.data.data || [])
            }
        } catch (err) {
            console.log('loadLeaveTypes error:', err)
        }
        setIsLoading({ normal: false, spinner: false })
    }

    function handleDelete(row) {
        setConfirmState({ open: true, row, loading: false })
    }

    async function handleConfirmDelete() {
        const row = confirmState.row
        setConfirmState((prev) => ({ ...prev, loading: true }))
        setIsLoading({ normal: false, spinner: true })
        try {
            const res = await ApiCall('DELETE', `/leavemaster/deleteLeaveType/${row.id}`)
            if (res?.data?.success) {
                showStatusToast({
                    type: 'success',
                    title: 'Deleted',
                    message: res.data.message || 'Leave type deleted successfully',
                    autoClose: true,
                })
                setLeaveTypes(prev => prev.filter(item => item.id !== row.id))
            }
        } catch (err) {
            console.log('delete error:', err)
            showStatusToast({
                type: 'error',
                title: 'Error',
                message: err?.response?.data?.message || 'Delete failed',
                autoClose: false,
            })
        } finally {
            setConfirmState({ open: false, row: null, loading: false })
            setIsLoading({ normal: false, spinner: false })
        }
    }

    const columns = [
        {
            header: 'Action',
            cell: (row) => (
                <div className="flex items-center gap-2">

                    <button
                        onClick={() =>
                            navigate(
                                `${getRoleBasePath()}/leaveMaster/edit/${row.id}`,
                                {
                                    state: {
                                        leaveType: row,
                                        mode: 'edit'
                                    }
                                }
                            )
                        }
                        className=" p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 "
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>

                    <button
                        onClick={() => handleDelete(row)}
                        className=" p-1.5 rounded-md text-red-600 hover:bg-red-50"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>

                </div>
            )
        },

        {
            header: 'Leave Code',
            accessor: 'LeaveTypeCode',
            cell: row => (
                <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold">
                    {row.LeaveTypeCode}
                </span>
            )
        },

        {
            header: 'Leave Name',
            accessor: 'LeaveTypeName',
        },

        {
            header: 'Description',
            accessor: 'Description',
            cell: row => (
                <span className="text-sm text-gray-600">
                    {row.Description || '-'}
                </span>
            )
        },

        {
            header: 'Category',
            accessor: 'LeaveCategoryName',
            cell: row => (
                <span className="">
                    {row.LeaveCategoryName || '-'}
                </span>
            )
        },

        {
            header: 'Accrual Type',
            accessor: 'AccrualTypeName',
            cell: row => (
                <span className="text-sm">
                    {row.AccrualTypeName || '-'}
                </span>
            )
        },

        {
            header: 'Maximum Days',
            accessor: 'MaximumDays',
            cell: row => (
                <span className="font-medium">
                    {row.MaximumDays || '-'}
                </span>
            )
        },

        {
            header: 'Status',
            accessor: 'IsActive',
            cell: row => (
                <span
                    className={` px-3 py-1 rounded-full text-xs font-medium
                        ${row.IsActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }
                    `}
                >
                    {row.IsActive ? 'Active' : 'Inactive'}
                </span>
            )
        }

    ]

    return (
        <>
            <CommonTable
                columns={columns}
                data={leaveTypes}
                itemsPerPage={10}
                showSearch={true}
                showPagination={true}
                loading={isLoading.spinner}
            />

            <CommonConfirmPopup
                isOpen={confirmState.open}
                variant="danger"
                title="Delete Leave Type"
                message={`Are you sure you want to delete "${confirmState.row?.LeaveTypeName}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                loading={confirmState.loading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmState({ open: false, row: null, loading: false })}
            />
        </>
    )
}

export default LeaveMasterList