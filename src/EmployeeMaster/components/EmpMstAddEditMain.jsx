import React, { useEffect, useState } from 'react'
import EmpMstAddEditInputs from './EmpMstAddEditInputs'
import { ApiCall, getRoleBasePath } from '../../library/constants';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';
import { useNavigate } from 'react-router-dom';

function EmpMstAddEditMain({ employeeId, isLoading, setIsLoading }) {
    const navigate = useNavigate()
    const [isDisabled, setIsDisabled] = useState(false)
    const [empMstControls, setEmpMstControls] = useState([]);
    const [autoCode, setAutocode] = useState('')

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

    // Called by EmpMstAddEditInputs after save
    function handleToast({ type, title, message, autoClose = true }) {
        showStatusToast({
            type,
            title,
            message,
            autoClose,
            onClose: () => {
                if (type === 'success') {
                    navigate(`${getRoleBasePath()}/employee_master_entry`)
                }
            }
        })
    }

    return (
        <div>
            <EmpMstAddEditInputs
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                empMstControls={empMstControls}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                showToast={handleToast}
                autoCode={autoCode}
                employeeId={employeeId}
            />

            {isLoading && <LoadingSpinner />}
        </div>
    )
}

export default EmpMstAddEditMain
