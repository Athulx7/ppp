import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import PayslipsMain from '../components/PayslipsMain'

function PayslipsEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Payroll', to: '/payroll' },
                    { label: 'Payslips' }
                ]}
                title="Payslip Management"
                description="View and manage employee payslips"
                loading={isLoading.normal}
            />

            <PayslipsMain isLoading={isLoading} setIsLoading={setIsLoading} />

        </>
    )
}

export default PayslipsEntry