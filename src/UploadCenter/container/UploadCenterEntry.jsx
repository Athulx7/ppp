import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, FileText, CheckCircle, AlertCircle, XCircle, HelpCircle, Database } from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonDropDown from '../../basicComponents/CommonDropDown';

function UploadDashboard() {
    const navigate = useNavigate()
    const [selectedUploadMaster, setSelectedUploadMaster] = useState('')
    const [selectedDownloadMaster, setSelectedDownloadMaster] = useState('')
    const [uploadMasters, setUploadMasters] = useState([])
    const [recentBatches, setRecentBatches] = useState([])
    const [uploadFile, setUploadFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0
    })

    useEffect(() => {
        const masters = [
            {
                upload_id: 'EMP_MAST',
                upload_code: 'EMP_MASTER',
                upload_name: 'Employee Master Upload',
                color: 'bg-blue-500',
                total_fields: 18,
                mandatory_fields: 8,
                last_upload: '2024-01-15 10:30 AM'
            },
            {
                upload_id: 'DEP_MSt',
                upload_code: 'DEPT_MASTER',
                upload_name: 'Department Master Upload',
                color: 'bg-green-500',
                total_fields: 5,
                mandatory_fields: 2,
                last_upload: '2024-01-14 03:15 PM'
            },
            {
                upload_id: 3,
                upload_code: 'DESIG_MASTER',
                upload_name: 'Designation Master Upload',
                color: 'bg-purple-500',
                total_fields: 5,
                mandatory_fields: 3,
                last_upload: '2024-01-13 11:45 AM'
            },
            {
                upload_id: 4,
                upload_code: 'ATTENDANCE',
                upload_name: 'Attendance Upload',
                color: 'bg-orange-500',
                total_fields: 6,
                mandatory_fields: 4,
                last_upload: '2024-01-15 09:20 AM'
            },
            {
                upload_id: 5,
                upload_code: 'PAYROLL',
                upload_name: 'Payroll Upload',
                color: 'bg-red-500',
                total_fields: 12,
                mandatory_fields: 6,
                last_upload: '2024-01-12 02:30 PM'
            }
        ]
        setUploadMasters(masters)

        const batches = [
            {
                batch_id: 'BATCH001',
                upload_name: 'Employee Master Upload',
                total_records: 150,
                success_records: 145,
                error_records: 5,
                status: 'completed',
                uploaded_by: 'Admin',
                uploaded_at: '2024-01-15 10:30 AM',
                progress: 100
            },
            {
                batch_id: 'BATCH002',
                upload_name: 'Department Master Upload',
                total_records: 25,
                success_records: 25,
                error_records: 0,
                status: 'completed',
                uploaded_by: 'HR User',
                uploaded_at: '2024-01-15 09:15 AM',
                progress: 100
            },
            {
                batch_id: 'BATCH003',
                upload_name: 'Attendance Upload',
                total_records: 500,
                success_records: 450,
                error_records: 50,
                status: 'partial_success',
                uploaded_by: 'Manager',
                uploaded_at: '2024-01-14 04:20 PM',
                progress: 100
            },
            {
                batch_id: 'BATCH004',
                upload_name: 'Employee Master Upload',
                total_records: 75,
                success_records: 0,
                error_records: 75,
                status: 'failed',
                uploaded_by: 'Admin',
                uploaded_at: '2024-01-14 02:10 PM',
                progress: 100
            },
            {
                batch_id: 'BATCH005',
                upload_name: 'Payroll Upload',
                total_records: 200,
                success_records: 180,
                error_records: 20,
                status: 'processing',
                uploaded_by: 'Payroll Manager',
                uploaded_at: '2024-01-15 11:45 AM',
                progress: 65
            }
        ]
        setRecentBatches(batches)

        setUploadProgress({
            total: 1250,
            pending: 0,
            processing: 200,
            completed: 950,
            failed: 100
        })
    }, [])

    const handleDownloadTemplate = () => {
        if (!selectedDownloadMaster) {
            alert('Please select a master to download template')
            return
        }

        const master = uploadMasters.find(m => m.upload_code === selectedDownloadMaster)
        alert(`Downloading template for ${master.upload_name}`)
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

    return (
        <div className="p-2">
            <BreadCrumb
                items={[{ label: 'Upload Management' }]}
                title="Data Upload Management"
                description="Download templates and bulk upload data"
            />
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
                        />

                        <button
                            onClick={handleDownloadTemplate}
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
                                    className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors${selectedUploadMaster
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
        </div>
    )
}

export default UploadDashboard