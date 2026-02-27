import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import SalaryComponentMain from '../components/SalaryComponentMain'

function SalaryComponentEntry() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <>
            <Breadcrumb
                items={[{ label: "Salary Components", to: "/salary_components" }]}
                title="Salary Components"
                description="Create and manage salary components, earnings, deductions, and employer contributions"
                loading={isLoading}
            />

            <div>
                <SalaryComponentMain isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>
        </>
    )
}

export default SalaryComponentEntry