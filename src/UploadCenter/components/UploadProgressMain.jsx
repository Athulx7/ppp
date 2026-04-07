import React, { useEffect, useState, useRef, useCallback } from 'react'
import UploadProgress from './UploadProgress'
import { useParams } from 'react-router-dom'
import { ApiCall } from '../../library/constants'

const POLLING_INTERVAL = 3000
const ACTIVE_STATUSES = ['processing', 'queued']

function UploadProgressMain() {
    const { batchId } = useParams()
    const [batchDetails, setBatchDetails] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [errors, setErrors] = useState([])
    const [records, setRecords] = useState([])
    const [activeTab, setActiveTab] = useState('records')
    const pollingRef = useRef(null)

    const fetchBatchData = useCallback(async (silent = false) => {
        if (!batchId) return
        if (!silent) setIsRefreshing(true)
        try {
            const [batchRes, errorsRes, recordsRes] = await Promise.all([
                ApiCall('get', `/upload/batch/${batchId}`),
                ApiCall('get', `/upload/batch/${batchId}/errors`),
                ApiCall('get', `/upload/batch/${batchId}/records`)
            ])
            if (batchRes?.data?.data) {
                setBatchDetails(batchRes.data.data)
            }

            setErrors(errorsRes?.data?.data || [])
            setRecords(recordsRes?.data?.data || [])

        } catch (err) {
            console.error('Failed to fetch batch data:', err)
        } finally {
            if (!silent) setIsRefreshing(false)
        }
    }, [batchId])

    useEffect(() => {
        fetchBatchData(false)

        pollingRef.current = setInterval(() => {
            fetchBatchData(true)
        }, POLLING_INTERVAL)

        return () => clearInterval(pollingRef.current)
    }, [fetchBatchData])

    useEffect(() => {
        if (!batchDetails) return
        if (!ACTIVE_STATUSES.includes(batchDetails.status)) {
            clearInterval(pollingRef.current)
        }
    }, [batchDetails?.status])

    const handleRefresh = () => fetchBatchData(false)

    const errorsColumns = [
        {
            header: "Row",
            accessor: "row_number",
        },
        {
            header: "Field",
            accessor: "excel_header",
            cell: row => (
                <span className="font-medium text-gray-900">{row.excel_header}</span>
            )
        },
        {
            header: "Value",
            accessor: "provided_value",
            cell: row => (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {row.provided_value || '—'}
                </span>
            )
        },
        {
            header: "Error Type",
            accessor: "error_type",
            cell: row => (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    {row.error_type}
                </span>
            )
        },
        {
            header: "Error Message",
            accessor: "error_message",
            cell: row => (
                <span className="text-red-600 text-sm">{row.error_message}</span>
            )
        }
    ]

    return (
        <UploadProgress
            batchDetails={batchDetails}
            handleRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            errorsColumns={errorsColumns}
            errors={errors}
            records={records}
        />
    )
}

export default UploadProgressMain