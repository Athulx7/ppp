import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import SalaryStructureAddEditMain from '../components/SalaryStructureAddEditMain'
import { useParams } from 'react-router-dom';

function SalaryStructureAddEditEntry() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    return (
        <>
            <Breadcrumb
                items={[{ label: "Salary Structure Management", to: `/admin/salary_structure` }, { label: isEditMode ? `Edit Salary Structure` : `Create Salary Structure` }]}
                title={isEditMode ? 'Edit Salary Structure' : 'Create Salary Structure'}
                description={isEditMode ? 'Modify existing salary structure components and configuration' : 'Configure new salary structure with components and calculations'}
                loading={isLoading.normal}
            />

            <div>
                <SalaryStructureAddEditMain isLoading={isLoading} setIsLoading={setIsLoading} isEditMode={isEditMode} id={id} />
            </div>
        </>
    )
}

export default SalaryStructureAddEditEntry