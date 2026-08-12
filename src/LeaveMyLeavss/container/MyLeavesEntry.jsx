import { useState } from "react"
import Breadcrumb from "../../basicComponents/BreadCrumb"
import MyLeavesMain from "../components/MyLeavesMain"

function MyLeavesEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })

    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Leaves' }]}
                title="My Leaves"
                description="View and manage your leave balances"
                loading={isLoading.normal}
            />

            <MyLeavesMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )

}
export default MyLeavesEntry
