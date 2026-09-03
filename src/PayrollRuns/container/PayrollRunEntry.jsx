import { useState } from "react"
import Breadcrumb from "../../basicComponents/BreadCrumb"
import PayRollRunMain from "../components/PayRollRunMain"

function PayrollRunEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    return (
        <>
            <Breadcrumb
                title="Payroll Run & Execution"
                items={[{ label: 'Run Payroll' }]}
                description="Manage salary inputs, verifylop and overtime data, and run payroll for employees"
                loading={isLoading.normal}
            />

            <PayRollRunMain isLoading={isLoading} setIsLoading={setIsLoading} />

        </>
    )
}

export default PayrollRunEntry