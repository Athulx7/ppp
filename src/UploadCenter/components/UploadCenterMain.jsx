import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UploadCenterTemplateDownload from './UploadCenterTemplateDownload'
import UploadCenterUploadSection from './UploadCenterUploadSection'
import { ApiCall, getRoleBasePath } from '../../library/constants'
import axios from 'axios'
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp'

function UploadCenterMain({ isLoading, setIsLoading }) {
    const navigate = useNavigate()
    const [selectedDownloadMaster, setSelectedDownloadMaster] = useState('')
    const [selectedUploadMaster, setSelectedUploadMaster] = useState('')
    const [uploadMasters, setUploadMasters] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        const fetchMasters = async () => {
            try {
                setIsLoading(prev => ({ ...prev, normal: true }))
                const res = await ApiCall('get', '/upload/masters')
                if (res?.data?.data) {
                    setUploadMasters(res.data.data)
                }
            } catch (err) {
                console.error('Failed to fetch upload masters:', err)
            } finally {
                setIsLoading(prev => ({ ...prev, normal: false }))
            }
        }
        fetchMasters()
    }, [])

    const handleDownload = async () => {
        if (!selectedDownloadMaster) return
        try {
            setDownloading(true)
            const token = sessionStorage.getItem('token')
            const res = await axios.get(
                `http://localhost:3000/api/upload/template/${selectedDownloadMaster}`,
                {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const a = document.createElement('a')
            a.href = url
            a.download = `${selectedDownloadMaster}_template.xlsx`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Template download failed:', err)
        } finally {
            setDownloading(false)
        }
    }
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
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!selectedUploadMaster) {
            showStatusToast({
                type: 'error',
                title: 'No Master Selected',
                message: 'Please select an upload master before uploading a file.',
                autoClose: true,
            })
            return
        }

        if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
            showStatusToast({
                type: 'error',
                title: 'Invalid File Type',
                message: 'Please upload only Excel (.xlsx, .xls) or CSV files.',
                autoClose: true,
            })
            return
        }

        setUploadFile(file)

        try {
            setIsLoading(prev => ({ ...prev, spinner: true }))

            const formData = new FormData()
            formData.append('file', file)
            formData.append('uploadCode', selectedUploadMaster)

            const token = sessionStorage.getItem('token')
            const res = await axios.post('http://localhost:3000/api/upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('upload res',res)

            if (res.data?.success) {
                navigate(`${getRoleBasePath()}/uploadProgress/${res.data.data.batch_id}`)
            } else {
                showStatusToast({
                    type: 'error',
                    title: 'Upload Failed',
                    message: res.data?.message || 'Upload failed. Please try again.',
                    autoClose: false,
                })
                setUploadFile(null)
            }
        } catch (err) {
            console.error('Upload failed:', err)
            const msg = err?.response?.data?.message || 'Upload failed. Please try again.'
            showStatusToast({
                type: 'error',
                title: 'Upload Error',
                message: msg,
                autoClose: false,
            })
            setUploadFile(null)
        } finally {
            setIsLoading(prev => ({ ...prev, spinner: false }))
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
                handleDownload={handleDownload}
                downloading={downloading}
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