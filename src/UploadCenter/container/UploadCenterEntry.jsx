import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import UploadCenterMain from '../components/UploadCenterMain'

function UploadCenterEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false,
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Upload Management' }]}
                title="Data Upload Management"
                description="Download templates and bulk upload data"
                loading={isLoading.normal}
            />

            <UploadCenterMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default UploadCenterEntry