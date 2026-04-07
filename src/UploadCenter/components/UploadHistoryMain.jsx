import React, { useState, useEffect, useCallback } from 'react'
import UploadHistory from './UploadHistory'
import UploadHistorySelections from './UploadHistorySelections'
import { ApiCall } from '../../library/constants'

function UploadHistoryMain({ isLoading, setIsLoading }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [historyFilters, setHistoryFilters] = useState({
        uploadType: '', status: '', frmTime: '', toTime: ''
    })
    const [historyData, setHistoryData] = useState([])
    const [uploadTypes, setUploadTypes] = useState([])

    useEffect(() => {
        ApiCall('get', '/upload/history/types')
            .then(res => {
                if (res?.data?.data) setUploadTypes(res.data.data)
            })
            .catch(console.error)
    }, [])

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoading(prev => ({ ...prev, normal: true }))
            const params = new URLSearchParams()
            if (historyFilters.uploadType) params.append('uploadType', historyFilters.uploadType)
            if (historyFilters.status) params.append('status', historyFilters.status)
            if (historyFilters.frmTime) params.append('frmTime', historyFilters.frmTime)
            if (historyFilters.toTime) params.append('toTime', historyFilters.toTime)
            if (searchQuery) params.append('search', searchQuery)

            const res = await ApiCall('get', `/upload/history?${params.toString()}`)
            if (res?.data?.data) setHistoryData(res.data.data)
        } catch (err) {
            console.error('Failed to fetch history:', err)
        } finally {
            setIsLoading(prev => ({ ...prev, normal: false }))
        }
    }, [historyFilters, searchQuery])

    useEffect(() => { fetchHistory() }, [])

    const handleReset = () => {
        setHistoryFilters({ uploadType: '', status: '', frmTime: '', toTime: '' })
        setSearchQuery('')
        setHistoryData([])
    }

    return (
        <>
            <UploadHistorySelections
                isLoading={isLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                historyFilters={historyFilters}
                setHistoryFilters={setHistoryFilters}
                uploadTypes={uploadTypes}
                onFilter={fetchHistory}
                onRefresh={fetchHistory}
            />
            <UploadHistory
                isLoading={isLoading}
                historyData={historyData}
            />
        </>
    )
}

export default UploadHistoryMain