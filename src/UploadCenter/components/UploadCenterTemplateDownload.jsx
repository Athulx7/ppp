import { Database, Download } from 'lucide-react'
import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'

function UploadCenterTemplateDownload({ isLoading,navigate,selectedDownloadMaster, setSelectedDownloadMaster,uploadMasters }) {
    return (
        <>
            <div className=" rounded-xl shadow-sm bg-white p-6">
                <div className='flex justify-between'>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Download className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Download Template</h2>
                            <p className="text-sm text-gray-500">Select master and download Excel template with headers</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/uploadHistory')}
                        className="px-4 h-10 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Database className="w-4 h-4" />
                        Upload History
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-4 flex">
                        <CommonDropDown
                            label="Select Upload Master"
                            value={selectedDownloadMaster}
                            onChange={(val) => setSelectedDownloadMaster(val)}
                            options={uploadMasters.map(m => ({
                                label: m.upload_name,
                                value: m.upload_code,
                            }))}
                            placeholder="Choose master for template download"
                            required
                            loading={isLoading.normal}
                        />

                        <button
                            onClick={() => console.log('Downloading')}
                            disabled={!selectedDownloadMaster}
                            className={`w-[200px] py-3 mt-6 h-10 rounded-lg flex items-center justify-center gap-2 transition-colors ${selectedDownloadMaster
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Download className="w-5 h-5" />
                            Download Template
                        </button>
                    </div>
                    {selectedDownloadMaster && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-medium text-blue-800 mb-2">Template Details</h3>
                            {uploadMasters.filter(m => m.upload_code === selectedDownloadMaster).map(master => (
                                <div key={master.upload_id} className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Total Fields:</span>
                                        <span className="font-semibold text-blue-900">{master.total_fields}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Mandatory Fields:</span>
                                        <span className="font-semibold text-red-600">{master.mandatory_fields}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Last Download:</span>
                                        <span className="text-blue-900">{master.last_upload}</span>
                                    </div>
                                    <div className="mt-3 text-xs text-blue-700">
                                        <span className="font-medium">Note:</span> Mandatory fields are marked with red headers in Excel
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UploadCenterTemplateDownload