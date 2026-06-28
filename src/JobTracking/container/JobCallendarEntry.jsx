import React, { useState, useEffect } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import JobCalendarMain from '../components/JobCalendarMain'
import jobApi from '../components/jobApi'
import { getRoleBasePath } from '../../library/constants'

function JobCallendarEntry() {
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(p => ({ ...p, normal: true }))
            try {
                const sessionUser = JSON.parse(sessionStorage.getItem('user'))
                if (sessionUser?.user_code) {
                    const data = await jobApi.fetchEmployeeByCode(sessionUser.user_code)
                    if (data) {
                        const user = {
                            emp_code: data.emp_code,
                            emp_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                            depart_code: data.department_code,
                            designation_code: data.designation_code
                        }
                        setCurrentUser(user)
                    }
                }
            } catch (err) {
                console.error("Failed to load user", err)
            } finally {
                setIsLoading(p => ({ ...p, normal: false }))
            }
        }
        fetchUser()
    }, [])

    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Jobs', to: `${getRoleBasePath()}/jobtracking` }, { label: 'Job Calendar' }]}
                title="Job Calendar"
                description="Visual overview of your time-logged job sessions by day"
                loading={isLoading.normal}
            />

            {currentUser && <JobCalendarMain loading={isLoading} setLoading={setIsLoading} currentUser={currentUser} />}

        </>
    )
}

export default JobCallendarEntry