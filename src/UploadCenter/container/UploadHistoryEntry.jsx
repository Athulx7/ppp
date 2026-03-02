import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import UploadHistoryMain from '../components/UploadHistoryMain'

function UploadHistoryEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false,
    })
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Upload Management', to: '/admin/uploadDash' },
                    { label: 'Upload History' }
                ]}
                title={`Upload History `}
                description={`View and manage all your past uploads`}
                loading={isLoading.normal}
            />

            <UploadHistoryMain isLoading={isLoading} setIsLoading={setIsLoading} />

        </>
    )
}

export default UploadHistoryEntry