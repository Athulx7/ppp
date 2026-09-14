import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import CtcReportMain from '../components/CtcReportMain'

function CtcReportEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Reports', to: '/reports' },
                    { label: 'CTC Report' }
                ]}
                loading={isLoading.normal}
            />

            <CtcReportMain
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />

        </>
    )
}

export default CtcReportEntry