import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import UploadProgressMain from '../components/UploadProgressMain'

function UploadProgressEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false,
    })
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Upload Management', to: '/admin/uploadDash' },
                    { label: `Upload Progress`, },
                ]}
                title={`Upload Progress `}
                description={`Check Upload Progreess of Batch Upload`}
                loading={isLoading.normal}
            />

            <UploadProgressMain isLoading={isLoading} setIsLoading={setIsLoading} />

        </>
    )
}

export default UploadProgressEntry