import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import SalaryStructureMain from '../components/SalaryStructureMain'

function SalaryStructureEntry() {
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    return (
        <>
            <Breadcrumb
                items={[{ label: "Salary Structure Management", to: `/admin/salary_structure` }, { label: `Create Salary Structure` }]}
                title="Salary Structure Management"
                description="Create and manage salary structures, assign to designations or employees, and track history"
                loading={isLoading.normal}
            />

            <SalaryStructureMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default SalaryStructureEntry