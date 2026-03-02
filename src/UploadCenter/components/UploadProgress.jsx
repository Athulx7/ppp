import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, FileText, } from 'lucide-react';
import CommonTable from '../../basicComponents/commonTable';
import UploadProgressBar from './UploadProgressBar';

function UploadProgress({ batchDetails, handleRefresh, isRefreshing, activeTab, setActiveTab, recordsColumns, errorsColumns, errors, records }) {

    return (
        <div className="p-3">

            {batchDetails && (
                <div className="">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <div className='flex justify-between'>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{batchDetails?.upload_name || 'Unnamed Batch'}</h2>
                                            <p className="text-sm text-gray-500">Uploaded by {batchDetails.uploaded_by} • {batchDetails.uploaded_at}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleRefresh}
                                        className="px-4 py-2 border h-10 justify-end border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
                                </div>


                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">File Name</div>
                                        <div className="font-medium text-gray-900">{batchDetails.file_name}</div>
                                        <div className="text-xs text-gray-500">{batchDetails.file_size}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Total Records</div>
                                        <div className="text-2xl font-bold text-gray-900">{batchDetails.total_records}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Processed</div>
                                        <div className="text-2xl font-bold text-blue-600">{batchDetails.processed_records}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Est. Completion</div>
                                        <div className="font-medium text-gray-900">{batchDetails.estimated_completion}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-80 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                    </div>
                                    <UploadProgressBar progress={batchDetails.progress} size="lg" />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-green-700">{batchDetails.success_records}</div>
                                        <div className="text-xs text-green-600">Success</div>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <XCircle className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-red-700">{batchDetails.error_records}</div>
                                        <div className="text-xs text-red-600">Errors</div>
                                    </div>
                                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                        <Clock className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                                        <div className="text-lg font-bold text-yellow-700">
                                            {batchDetails.total_records - batchDetails.processed_records}
                                        </div>
                                        <div className="text-xs text-yellow-600">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('records')}
                                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'records'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <FileText className="w-4 h-4" />
                                Records
                                <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                                    {batchDetails.total_records}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('errors')}
                                className={`px-6 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === 'errors'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <AlertCircle className="w-4 h-4" />
                                Errors
                                {batchDetails.error_records > 0 && (
                                    <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                        {batchDetails.error_records}
                                    </span>
                                )}
                            </button>
                        </div>


                        {activeTab === 'records' && (
                            <CommonTable
                                columns={recordsColumns}
                                data={records}
                                itemsPerPage={10}
                                showSearch={true}
                                showPagination={true}
                                customClass='my-0'
                            />
                        )}

                        {activeTab === 'errors' && (
                            <CommonTable
                                columns={errorsColumns}
                                data={errors}
                                itemsPerPage={10}
                                showSearch={false}
                                showPagination={true}
                                customClass='my-0'
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadProgress