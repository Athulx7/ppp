import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import LeaveMasterAddNewEdit from '../components/LeaveMasterAddNewEdit'
import LoadingSpinner from '../../basicComponents/LoadingSpinner'
import { getRoleBasePath } from '../../library/constants'

function LeaveMasterEntry() {
    const { id } = useParams()
    const mode = id ? 'edit' : 'add'

    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Leave Master List', to: `${getRoleBasePath()}/leaveMasterList` },
                    { label: mode === 'edit' ? 'Edit Leave Type' : 'Add Leave Type' }
                ]}
                title={mode === 'edit' ? 'Edit Leave Type' : 'Add Leave Type'}
                description="Manage Leaves"
                loading={isLoading.normal}
            />
            <LeaveMasterAddNewEdit
                id={id}
                mode={mode}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default LeaveMasterEntry