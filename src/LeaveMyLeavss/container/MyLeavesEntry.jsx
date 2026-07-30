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
                items={[{ label: 'Leave Master' }]}
                title="Leave Master"
                description="Configure leave types and rules per company policy"
                loading={isLoading.normal}
            />

            <MyLeavesMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )

}
export default MyLeavesEntry
