import { useState } from "react"
import Breadcrumb from "../../basicComponents/BreadCrumb"
import ExCmdMain from "../components/ExCmdMain"

function ExCmdEntry() {
    const [isLoading, setIsLoading] = useState(false)
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Execute Query' }]}
                title="SQL Command Terminal (excmd)"
                description="Run SELECT queries directly against your active tenant database. Modifications are strictly blocked."
                loading={isLoading}
            />

            <ExCmdMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default ExCmdEntry