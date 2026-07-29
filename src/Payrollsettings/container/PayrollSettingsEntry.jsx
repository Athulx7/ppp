import { useState } from "react"
import Breadcrumb from "../../basicComponents/BreadCrumb"
import PayrollSettingsMain from "../components/PayrollSettingsMain"

function PayrollSettingsEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Payroll Settings' }]}
                title="Payroll Settings"
                description="Configure payroll rules for this company"
                loading={isLoading.normal}
            />
            <PayrollSettingsMain setIsLoading={setIsLoading} isLoading={isLoading} />
        </>
    )
}

export default PayrollSettingsEntry