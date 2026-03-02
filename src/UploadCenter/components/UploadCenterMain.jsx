import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UploadCenterTemplateDownload from './UploadCenterTemplateDownload'
import UploadCenterUploadSection from './UploadCenterUploadSection'

function UploadCenterMain({ isLoading, setIsLoading }) {
    const navigate = useNavigate()
    const [selectedDownloadMaster, setSelectedDownloadMaster] = useState('')
    const [selectedUploadMaster, setSelectedUploadMaster] = useState('')
    const [uploadMasters, setUploadMasters] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            setUploadFile(file)
        }
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            setUploadFile(file)
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
                alert('Please upload only Excel (.xlsx, .xls) or CSV files')
                return
            }

            navigate('/upload/preview/new', {
                state: {
                    uploadMasterId: selectedUploadMaster,
                    fileName: file.name,
                    fileSize: file.size
                }
            })
        }
    }
    return (
        <>
            <UploadCenterTemplateDownload
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                navigate={navigate}
                selectedDownloadMaster={selectedDownloadMaster}
                setSelectedDownloadMaster={setSelectedDownloadMaster}
                uploadMasters={uploadMasters}
            />

            <UploadCenterUploadSection
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                navigate={navigate}
                selectedUploadMaster={selectedUploadMaster}
                setSelectedUploadMaster={setSelectedUploadMaster}
                uploadMasters={uploadMasters}
                setUploadMasters={setUploadMasters}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                isDragging={isDragging}
                handleFileUpload={handleFileUpload}
                uploadFile={uploadFile}
                setUploadFile={setUploadFile}
            />
        </>
    )
}

export default UploadCenterMain