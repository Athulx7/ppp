import React from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import { getRoleBasePath } from '../../library/constants'
import { useParams } from 'react-router-dom'
import EmpMstAddEditMain from '../components/EmpMstAddEditMain'

function EmpMstAddEditEntry() {
    const { id } = useParams()
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Employee Master', to: `${getRoleBasePath()}/employee_master_entry` }, { label: `Employee Master ${id ? 'Edit' : 'Add'}` }]}
                title={`Employee Master ${id ? 'Edit' : 'Add'}`}
                description="Manage employee profiles and information"
            />

            <div>
                <EmpMstAddEditMain />
            </div>

        </>
    )
}

export default EmpMstAddEditEntry
