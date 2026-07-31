import React, { useState } from "react"
import Breadcrumb from "../../basicComponents/BreadCrumb"
import MyLeaveRequestMain from "../components/MyLeaveRequestMain"

function MyLeaveRequestEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Leave Request' }]}
                title="Leave Request"
                description="Apply for leave and track your requests"
                loading={isLoading.normal}
            />

            <MyLeaveRequestMain isLoading={isLoading} setIsLoading={setIsLoading} />

        </>
    )
}

export default MyLeaveRequestEntry