import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import SalaryAdvanceApprovalMain from '../components/SalaryAdvanceApprovalMain'

function SalaryAdvanceApprovalEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false,
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Salary Advance Approval' }]}
                title="Salary Advance Approval"
                description="Review and process salary advance requests"
                loading={isLoading.normal}
            />

            <SalaryAdvanceApprovalMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default SalaryAdvanceApprovalEntry