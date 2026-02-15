import React, { useEffect, useState } from 'react'
import EmpMstAddEditInputs from './EmpMstAddEditInputs'
import { ApiCall } from '../../library/constants';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import CommonStatusPopUp from '../../basicComponents/CommonStatusPopUp';

function EmpMstAddEditMain() {
    const [isDisabled, setIsDisabled] = useState(false)
    const [empMstControls, setEmpMstControls] = useState([]);
    const [autoCode,setAutocode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [statusPopup, setStatusPopup] = useState({
        show: false,
        type: "default",
        title: "",
        message: "",
        autoClose: false
    })

    useEffect(() => {
        getControlsData()
    }, [])

    async function getControlsData() {
        setIsLoading(true)
        try {
            const result = await ApiCall('get', '/empmst/getcontrols')
            setEmpMstControls(result.data.data.data)
            setAutocode(result.data.data.autoCodePreview)
        }
        catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }
    return (
        <div>
            <EmpMstAddEditInputs
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                empMstControls={empMstControls}
                setIsLoading={setIsLoading}
                statusPopup={statusPopup}
                setStatusPopup={setStatusPopup}
                autoCode = {autoCode}
            />

            {isLoading && <LoadingSpinner />}

            <CommonStatusPopUp
                isOpen={statusPopup.show}
                type={statusPopup.type}
                title={statusPopup.title}
                body={statusPopup.message}
                autoClose={statusPopup.autoClose}
                onClose={() =>
                    setStatusPopup(prev => ({ ...prev, show: false }))
                }
            />
        </div>
    )
}

export default EmpMstAddEditMain
