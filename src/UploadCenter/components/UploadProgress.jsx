import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw, FileText, } from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonTable from '../../basicComponents/commonTable';
import UploadProgressBar from './UploadProgressBar';

function UploadProgress() {
    const navigate = useNavigate();
    const { batchId } = useParams();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('errors')

    const [batchDetails, setBatchDetails] = useState(null);
    const [records, setRecords] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dummy batch data
    useEffect(() => {
        // Simulate API call
        const dummyBatch = {
            batch_id: batchId || 'BATCH001',
            upload_name: 'Employee Master Upload',
            upload_code: 'EMP_MASTER',
            status: 'processing',
            total_records: 150,
            processed_records: 98,
            success_records: 92,
            error_records: 6,
            progress: 65,
            uploaded_by: 'Admin User',
            uploaded_at: '2024-01-15 10:30:45',
            estimated_completion: '2024-01-15 10:35:00',
            file_name: 'employee_upload_jan15.xlsx',
            file_size: '1.2 MB',
            error_file_path: '/downloads/errors/BATCH001_errors.xlsx'
        };

        setBatchDetails(dummyBatch);

        // Dummy records data
        const dummyRecords = Array.from({ length: 20 }, (_, i) => ({
            record_id: i + 1,
            row_number: i + 1,
            employee_code: `EMP${String(i + 1).padStart(3, '0')}`,
            first_name: `Employee${i + 1}`,
            last_name: 'Test',
            department_code: 'DEPT001',
            designation_code: 'DES001',
            status: i < 12 ? 'success' : i < 15 ? 'error' : 'pending',
            errors: i === 13 ? ['Invalid email format', 'Department code not found'] :
                i === 14 ? ['PAN number already exists'] : [],
            processed_at: i < 15 ? '2024-01-15 10:32:45' : null
        }));

        setRecords(dummyRecords);

        // Dummy errors data
        const dummyErrors = [
            { row: 14, field: 'email', value: 'invalid-email', error: 'Invalid email format' },
            { row: 14, field: 'department_code', value: 'DEPT999', error: 'Department code not found' },
            { row: 15, field: 'pan_number', value: 'ABCDE1234F', error: 'PAN number already exists' },
            { row: 16, field: 'mobile_number', value: '12345', error: 'Invalid mobile number format' },
            { row: 17, field: 'joining_date', value: '35-01-2024', error: 'Invalid date format' },
            { row: 18, field: 'employee_code', value: 'EMP001', error: 'Duplicate employee code' }
        ];

        setErrors(dummyErrors);
    }, [batchId]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

    const handleDownloadErrorReport = () => {
        alert('Downloading error report...');
    };

    const handleProcessBatch = () => {
        alert('Processing batch...');
    };

    const handlePauseBatch = () => {
        alert('Pausing batch...');
    };

    // Records Table Columns
    const recordsColumns = [
        {
            header: "Row",
            accessor: "row_number",
            width: "80px"
        },
        {
            header: "Employee Code",
            accessor: "employee_code",
            cell: row => (
                <span className="font-mono text-sm font-medium text-indigo-600">
                    {row.employee_code}
                </span>
            )
        },
        {
            header: "Name",
            cell: row => `${row.first_name} ${row.last_name}`
        },
        {
            header: "Department",
            accessor: "department_code"
        },
        {
            header: "Designation",
            accessor: "designation_code"
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => {
                const statusConfig = {
                    'success': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Success' },
                    'error': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Error' },
                    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' }
                };
                const config = statusConfig[row.status];
                const Icon = config.icon;

                return (
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bg} ${config.text}`}>
                            <Icon className="w-3 h-3" />
                            {config.label}
                        </span>
                    </div>
                );
            }
        },
        {
            header: "Processed At",
            accessor: "processed_at",
            cell: row => row.processed_at || '—'
        },
        {
            header: "Actions",
            cell: row => (
                row.errors && row.errors.length > 0 ? (
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                    </button>
                ) : (
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                    </button>
                )
            )
        }
    ];

    // Errors Table Columns
    const errorsColumns = [
        {
            header: "Row",
            accessor: "row",
            width: "80px"
        },
        {
            header: "Field",
            accessor: "field",
            cell: row => (
                <span className="font-medium text-gray-900">{row.field}</span>
            )
        },
        {
            header: "Value",
            accessor: "value",
            cell: row => (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {row.value}
                </span>
            )
        },
        {
            header: "Error Message",
            accessor: "error",
            cell: row => (
                <span className="text-red-600">{row.error}</span>
            )
        }
    ];

    return (
        <div className="p-3">
            <BreadCrumb
                items={[
                    { label: 'Upload Management', to: '/admin/uploadDash' },
                    { label: `Upload Progress`, },
                ]}
                title={`Upload Progress `}
                description={`Check Upload Progreess of ${batchDetails.upload_name}`}
            />

            {batchDetails && (
                <div className="">
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <div className='flex justify-between'>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">{batchDetails.upload_name}</h2>
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
                                onClick={''}
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
                                onClick={''}
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