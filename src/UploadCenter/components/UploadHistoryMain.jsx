import React, { useState } from 'react'
import UploadHistory from './UploadHistory'
import UploadHistorySelections from './UploadHistorySelections'

function UploadHistoryMain({ isLoading }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [historyFilters, setHistoryFilters] = useState({
        uploadType: '',
        status: '',
        frmTime: '',
        toTIme: ''
    })
    const [filteredData, setFilteredData] = useState([]);
    const [historyData, setHistoryData] = useState([]);
    const [uploadStats, setUploadStats] = useState([])
    const handleSeting = () => {
        setHistoryData([])
        setUploadStats([])
    }
    return (
        <>
            <UploadHistorySelections
                isLoading={isLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                historyFilters={historyFilters}
                setHistoryFilters={setHistoryFilters}
            />
            <UploadHistory
                isLoading={isLoading}
                filteredData={filteredData}
                setFilteredData={setFilteredData}
                historyData={historyData}
                uploadStats={uploadStats}
                handleSeting={handleSeting}
            />
        </>
    )
}

export default UploadHistoryMain