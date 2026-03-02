import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import { RefreshCw } from 'lucide-react'

function UploadHistorySelections({ isLoading, searchQuery, setSearchQuery, historyFilters, setHistoryFilters }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className='lg:col-span-2 relative'>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <div className="">
                            {/* <Search className="absolute left-3 top-[20px] transform -translate-y-1/2 text-gray-400 w-5 h-5" /> */}
                            <input
                                type="text"
                                placeholder="Search by batch ID, upload type, uploaded by..."
                                className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <CommonDropDown
                        label="From Date"
                        value={historyFilters.uploadType}
                        onChange={(value) => setHistoryFilters({ ...historyFilters, uploadType: value })}
                        options={[
                            { label: 'All Upload Types', value: 'all' },
                        ]}
                        placeholder="Filter by Upload Type"
                        loading={isLoading.normal}
                    />

                    <CommonDropDown
                        label="From Date"
                        value={historyFilters.status}
                        onChange={(value) => setHistoryFilters({ ...historyFilters, status: value })}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Processing', value: 'processing' },
                            { label: 'Failed', value: 'failed' },
                            { label: 'Partial Success', value: 'partial_success' }
                        ]}
                        placeholder="Filter by Status"
                        loading={isLoading.normal}
                    />

                    <CommonDatePicker
                        label="From Date"
                        value={historyFilters.frmTime}
                        onChange={(val) => setHistoryFilters({ ...historyFilters, frmTime: val })}
                        placeholder="Select start date"
                        loading={isLoading.normal}
                    />
                    <CommonDatePicker
                        label="To Date"
                        value={historyFilters.toTime}
                        onChange={(val) => setHistoryFilters({ ...historyFilters, toTime: val })}
                        placeholder="Select end date"
                        loading={isLoading.normal}
                    />

                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        onClick={() => console.log('Refreshing')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => console.log('Filtering history')}
                        className="px-10 py-2 h-10 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex  gap-2"
                    >
                        Filter
                    </button>
                </div>
            </div>
        </>
    )
}

export default UploadHistorySelections