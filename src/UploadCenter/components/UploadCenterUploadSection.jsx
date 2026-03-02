import { AlertCircle, CheckCircle, FileText, HelpCircle, Upload, XCircle } from 'lucide-react'
import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'

function UploadCenterUploadSection({ isLoading, selectedUploadMaster, setSelectedUploadMaster, uploadMasters, isDragging, handleDragOver, handleDragLeave, handleDrop, handleFileUpload, uploadFile, setUploadFile }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
                <div className=" gap-3 mb-6">
                    <div className=' flex items-center gap-3 mb-6'>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Upload className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Upload Data</h2>
                            <p className="text-sm text-gray-500">Upload Excel file and validate before processing</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-5 gap-4 flex">
                            <CommonDropDown
                                label="Select Upload Master"
                                value={selectedUploadMaster}
                                onChange={(value) => setSelectedUploadMaster(value)}
                                options={uploadMasters.map(m => ({
                                    label: m.upload_name,
                                    value: m.upload_code,
                                    description: `${m.total_fields} fields`
                                }))}
                                placeholder="Choose master for data upload"
                                required
                                loading={isLoading.normal}
                            />
                        </div>
                        <div className='grid grid-cols-1'>
                            <div
                                className={` border-2 border-dashed rounded-lg p-6 text-center transition-colors flex flex-col items-center justify-center gap-2 ${isDragging
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload
                                    className={`w-10 h-10 ${isDragging ? 'text-green-500' : 'text-gray-400'
                                        }`}
                                />

                                <p className="text-gray-700">
                                    <span className="font-semibold text-green-600 cursor-pointer">
                                        Click to upload
                                    </span>{" "}
                                    or drag and drop
                                </p>

                                <p className="text-sm text-gray-500">
                                    Excel files (.xlsx, .xls) or CSV (Max: 10MB)
                                </p>

                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="hidden"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileUpload}
                                    disabled={!selectedUploadMaster}
                                />

                                <button
                                    onClick={() => document.getElementById('fileUpload').click()}
                                    disabled={!selectedUploadMaster}
                                    className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${ selectedUploadMaster
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    Browse Files
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {uploadFile && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-green-600" />
                                <div>
                                    <div className="font-medium text-green-800">{uploadFile.name}</div>
                                    <div className="text-xs text-green-600">
                                        {(uploadFile.size / 1024).toFixed(2)} KB
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setUploadFile(null)}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Guidelines:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Download template first to ensure correct column headers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>Mandatory fields (marked with *) must be filled</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>Use codes for lookup fields (Department Code, Designation Code)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span>Maximum 5000 records per upload</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default UploadCenterUploadSection