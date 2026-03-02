import React, { useEffect, useState } from 'react'
import UploadProgress from './UploadProgress'
import { AlertCircle, CheckCircle,XCircle,Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';

function UploadProgressMain() {
    const { batchId } = useParams();
    const [batchDetails, setBatchDetails] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [records, setRecords] = useState([]);
    const [errors, setErrors] = useState([]);
    const [activeTab, setActiveTab] = useState('errors')

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1000);
    };

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
    return (
        <>
            <UploadProgress
                batchDetails={batchDetails}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                recordsColumns={recordsColumns}
                errorsColumns={errorsColumns}
                error={errors}
                records={records}
            />
        </>
    )
}

export default UploadProgressMain