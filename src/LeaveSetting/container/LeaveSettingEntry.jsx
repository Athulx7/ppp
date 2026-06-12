import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import LoadingSpinner from '../../basicComponents/LoadingSpinner'
import { getRoleBasePath } from '../../library/constants'
import LeaveSettingMain from '../components/LeaveSettingMain'

function LeaveSettingEntry() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    return (
        <>
            <BreadCrumb
                items={[{ label: 'Leave Settings' }]}
                title="Leave Allocation Settings"
                description="Configure leave allocations for employees based on various criteria"
                actions={
                    <button
                        onClick={() =>
                            navigate(`${getRoleBasePath()}/leave-settings/add`, {
                                state: { mode: 'add' }
                            })
                        }
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Allocation
                    </button>
                }
                loading={isLoading.normal}
            />
            <LeaveSettingMain
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                navigate={navigate}
            />
            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default LeaveSettingEntry
