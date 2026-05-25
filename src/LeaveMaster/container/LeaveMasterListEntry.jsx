import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import LoadingSpinner from '../../basicComponents/LoadingSpinner'
import { getRoleBasePath } from '../../library/constants'
import LeaveMasterList from '../components/LeaveMasterListMain'

function LeaveMasterListEntry() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    return (
        <>
            <BreadCrumb
                items={[{ label: 'Leave Master' }]}
                title="Leave Master"
                description="Configure leave types and rules per company policy"
                actions={
                    <button
                        onClick={() => navigate(`${getRoleBasePath()}/leaveMaster/add`)}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Leave Type
                    </button>
                }
                loading={isLoading.normal}
            />
            <LeaveMasterList isLoading={isLoading.normal} setIsLoading={setIsLoading} navigate={navigate} />
            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default LeaveMasterListEntry