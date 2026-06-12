import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import LoadingSpinner from '../../basicComponents/LoadingSpinner'
import { getRoleBasePath } from '../../library/constants'
import LeaveSettingAddEditMain from '../components/LeaveSettingAddEditMain'

function LeaveSettingAddEditEntry() {
    const location = useLocation()
    const { mode, activeTab } = location.state || { mode: 'add', activeTab: 'single' }

    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    const getBreadcrumbLabel = () => {
        if (mode === 'edit') return 'Edit Allocation'
        return activeTab === 'bulk' ? 'Bulk Allocation' : 'Add Allocation'
    }

    const getTitle = () => {
        if (mode === 'edit') return 'Edit Leave Allocation'
        return activeTab === 'bulk' ? 'Bulk Leave Allocation' : 'Add Leave Allocation'
    }

    const getDescription = () => {
        if (mode === 'edit') return 'Modify existing leave allocation'
        return activeTab === 'bulk'
            ? 'Allocate multiple leave types to multiple employees at once'
            : 'Allocate leaves to an individual employee'
    }

    return (
        <>
            <BreadCrumb
                items={[
                    { label: 'Leave Settings', to: `${getRoleBasePath()}/leavesetting` },
                    { label: getBreadcrumbLabel() }
                ]}
                title={getTitle()}
                description={getDescription()}
                loading={isLoading.normal}
            />
            <LeaveSettingAddEditMain
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default LeaveSettingAddEditEntry
