import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import LeaveApprovalMain from '../components/LeaveApprovalMain'

function LeaveApprovalEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Leave Approval' }]}
                title="Leave Approval"
                description="Manage and process employee leave requests"
                loading={isLoading.normal}
            />

            <LeaveApprovalMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default LeaveApprovalEntry