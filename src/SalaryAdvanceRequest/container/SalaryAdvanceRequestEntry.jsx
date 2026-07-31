import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import SalaryAdvanceRequestMain from '../components/SalaryAdvanceRequestMain'

function SalaryAdvanceRequestEntry() {
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Salary Advance Request' }]}
                title="Salary Advance Request"
                description="Request salary advance with easy repayment options"
                loading={isLoading.normal}
            />

            <SalaryAdvanceRequestMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default SalaryAdvanceRequestEntry