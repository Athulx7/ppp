import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Filter, Download, Eye, RefreshCw,
    CheckCircle, XCircle, AlertCircle, Clock, FileText,
    Users, Briefcase, Search, ChevronRight, BarChart,
    TrendingUp, PieChart, DownloadCloud, Trash2, Archive, Upload, Building, Activity, User, Grid,
} from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';

function UploadHistory() {
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [masterFilter, setMasterFilter] = useState('all');
    const [summary, setSummary] = useState({
        total: 0,
        completed: 0,
        failed: 0,
        processing: 0,
        totalRecords: 0,
        successRecords: 0,
        errorRecords: 0
    });
    const [uploadStats, setUploadStats] = useState([
        {
            id: 1,
            name: 'Hospital-Fs Multiple Mapping',
            completed: 100,
            status: 'completed',
            icon: <Building className="w-5 h-5 text-blue-600" />,
            bgColor: 'bg-blue-50'
        },
        {
            id: 2,
            name: 'Hospital Master',
            completed: 100,
            status: 'completed',
            icon: <Building className="w-5 h-5 text-green-600" />,
            bgColor: 'bg-green-50'
        },
        {
            id: 3,
            name: 'molecule Mapping',
            completed: 100,
            status: 'completed',
            icon: <Activity className="w-5 h-5 text-purple-600" />,
            bgColor: 'bg-purple-50'
        },
        {
            id: 4,
            name: 'Hospital Master Additional Input',
            completed: 100,
            status: 'completed',
            icon: <FileText className="w-5 h-5 text-orange-600" />,
            bgColor: 'bg-orange-50'
        },
        {
            id: 5,
            name: 'Doctor Sub Area Multiple Mapping',
            completed: 100,
            total: 1026,
            success: 1021,
            error: 5,
            status: 'partial',
            icon: <User className="w-5 h-5 text-red-600" />,
            bgColor: 'bg-red-50'
        },
        {
            id: 6,
            name: 'Doctor Master',
            completed: 0,
            status: 'pending',
            icon: <User className="w-5 h-5 text-gray-600" />,
            bgColor: 'bg-gray-50'
        }
    ]);


    // Dummy upload history data
    useEffect(() => {
        const dummyHistory = [
            {
                batch_id: 'BATCH001',
                upload_name: 'Employee Master Upload',
                upload_code: 'EMP_MASTER',
                file_name: 'employee_upload_jan15.xlsx',
                total_records: 150,
                success_records: 145,
                error_records: 5,
                status: 'completed',
                uploaded_by: 'Admin User',
                uploaded_at: '2024-01-15 10:30:45',
                completed_at: '2024-01-15 10:32:15',
                processing_time: '1m 30s',
                error_file_path: '/downloads/errors/BATCH001_errors.xlsx'
            },
            {
                batch_id: 'BATCH002',
                upload_name: 'Department Master Upload',
                upload_code: 'DEPT_MASTER',
                file_name: 'departments_jan15.xlsx',
                total_records: 25,
                success_records: 25,
                error_records: 0,
                status: 'completed',
                uploaded_by: 'HR Manager',
                uploaded_at: '2024-01-15 09:15:22',
                completed_at: '2024-01-15 09:16:05',
                processing_time: '43s'
            },
            {
                batch_id: 'BATCH003',
                upload_name: 'Attendance Upload',
                upload_code: 'ATTENDANCE',
                file_name: 'attendance_jan14.xlsx',
                total_records: 500,
                success_records: 450,
                error_records: 50,
                status: 'partial_success',
                uploaded_by: 'Team Lead',
                uploaded_at: '2024-01-14 16:20:10',
                completed_at: '2024-01-14 16:25:45',
                processing_time: '5m 35s',
                error_file_path: '/downloads/errors/BATCH003_errors.xlsx'
            },
            {
                batch_id: 'BATCH004',
                upload_name: 'Employee Master Upload',
                upload_code: 'EMP_MASTER',
                file_name: 'employees_update.xlsx',
                total_records: 75,
                success_records: 0,
                error_records: 75,
                status: 'failed',
                uploaded_by: 'Admin User',
                uploaded_at: '2024-01-14 14:10:30',
                completed_at: '2024-01-14 14:11:20',
                processing_time: '50s',
                error_file_path: '/downloads/errors/BATCH004_errors.xlsx'
            },
            {
                batch_id: 'BATCH005',
                upload_name: 'Payroll Upload',
                upload_code: 'PAYROLL',
                file_name: 'payroll_jan2024.xlsx',
                total_records: 200,
                success_records: 180,
                error_records: 20,
                status: 'processing',
                uploaded_by: 'Payroll Manager',
                uploaded_at: '2024-01-15 11:45:30',
                completed_at: null,
                processing_time: 'In Progress',
                progress: 65
            },
            {
                batch_id: 'BATCH006',
                upload_name: 'Designation Master Upload',
                upload_code: 'DESIG_MASTER',
                file_name: 'designations_update.xlsx',
                total_records: 18,
                success_records: 18,
                error_records: 0,
                status: 'completed',
                uploaded_by: 'HR Manager',
                uploaded_at: '2024-01-13 11:20:15',
                completed_at: '2024-01-13 11:21:00',
                processing_time: '45s'
            },
            {
                batch_id: 'BATCH007',
                upload_name: 'Employee Master Upload',
                upload_code: 'EMP_MASTER',
                file_name: 'bulk_hire_jan.xlsx',
                total_records: 45,
                success_records: 42,
                error_records: 3,
                status: 'completed',
                uploaded_by: 'Recruiter',
                uploaded_at: '2024-01-12 15:30:00',
                completed_at: '2024-01-12 15:31:15',
                processing_time: '1m 15s',
                error_file_path: '/downloads/errors/BATCH007_errors.xlsx'
            },
            {
                batch_id: 'BATCH008',
                upload_name: 'Employee Master Upload',
                upload_code: 'EMP_MASTER',
                file_name: 'interns_upload.xlsx',
                total_records: 12,
                success_records: 10,
                error_records: 2,
                status: 'completed',
                uploaded_by: 'HR Executive',
                uploaded_at: '2024-01-11 10:05:30',
                completed_at: '2024-01-11 10:06:20',
                processing_time: '50s',
                error_file_path: '/downloads/errors/BATCH008_errors.xlsx'
            },
            {
                batch_id: 'BATCH009',
                upload_name: 'Attendance Upload',
                upload_code: 'ATTENDANCE',
                file_name: 'attendance_week2.xlsx',
                total_records: 350,
                success_records: 320,
                error_records: 30,
                status: 'completed',
                uploaded_by: 'Team Lead',
                uploaded_at: '2024-01-10 09:45:20',
                completed_at: '2024-01-10 09:50:10',
                processing_time: '4m 50s',
                error_file_path: '/downloads/errors/BATCH009_errors.xlsx'
            },
            {
                batch_id: 'BATCH010',
                upload_name: 'Payroll Upload',
                upload_code: 'PAYROLL',
                file_name: 'payroll_correction.xlsx',
                total_records: 15,
                success_records: 15,
                error_records: 0,
                status: 'completed',
                uploaded_by: 'Finance Manager',
                uploaded_at: '2024-01-09 14:20:45',
                completed_at: '2024-01-09 14:21:30',
                processing_time: '45s'
            }
        ];

        setHistoryData(dummyHistory);
        setFilteredData(dummyHistory);

        // Calculate summary
        const summary = {
            total: dummyHistory.length,
            completed: dummyHistory.filter(b => b.status === 'completed').length,
            failed: dummyHistory.filter(b => b.status === 'failed').length,
            processing: dummyHistory.filter(b => b.status === 'processing').length,
            totalRecords: dummyHistory.reduce((acc, b) => acc + b.total_records, 0),
            successRecords: dummyHistory.reduce((acc, b) => acc + b.success_records, 0),
            errorRecords: dummyHistory.reduce((acc, b) => acc + b.error_records, 0)
        };
        setSummary(summary);
    }, []);

    // Filter data based on search and filters
    useEffect(() => {
        let filtered = historyData;

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.batch_id.toLowerCase().includes(query) ||
                item.upload_name.toLowerCase().includes(query) ||
                item.uploaded_by.toLowerCase().includes(query) ||
                item.file_name.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Apply master filter
        if (masterFilter !== 'all') {
            filtered = filtered.filter(item => item.upload_code === masterFilter);
        }

        // Apply date range
        if (dateRange.from) {
            filtered = filtered.filter(item =>
                new Date(item.uploaded_at) >= new Date(dateRange.from)
            );
        }
        if (dateRange.to) {
            filtered = filtered.filter(item =>
                new Date(item.uploaded_at) <= new Date(dateRange.to)
            );
        }

        setFilteredData(filtered);
    }, [searchQuery, statusFilter, masterFilter, dateRange, historyData]);

    const handleViewDetails = (batchId) => {
        navigate(`/upload/progress/${batchId}`);
    };

    const handleDownloadErrorReport = (errorFilePath) => {
        if (errorFilePath) {
            alert(`Downloading error report: ${errorFilePath}`);
        } else {
            alert('No error report available for this batch');
        }
    };

    const handleDownloadOriginalFile = (fileName) => {
        alert(`Downloading original file: ${fileName}`);
    };

    const handleArchiveBatch = (batchId) => {
        if (window.confirm(`Are you sure you want to archive batch ${batchId}?`)) {
            alert(`Batch ${batchId} archived successfully`);
        }
    };

    const handleDeleteBatch = (batchId) => {
        if (window.confirm(`Are you sure you want to delete batch ${batchId}? This action cannot be undone.`)) {
            setHistoryData(prev => prev.filter(b => b.batch_id !== batchId));
            alert(`Batch ${batchId} deleted successfully`);
        }
    };

    const handleExportHistory = () => {
        alert('Exporting upload history...');
    };

    const handleRefresh = () => {
        alert('Refreshing data...');
    };

    // Get unique masters for filter
    const masters = [...new Set(historyData.map(item => item.upload_code))].map(code => ({
        label: historyData.find(item => item.upload_code === code)?.upload_name || code,
        value: code
    }));

    // Status badge component
    const StatusBadge = ({ status, progress }) => {
        const config = {
            'completed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Completed' },
            'processing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw, label: 'Processing' },
            'failed': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Failed' },
            'partial_success': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle, label: 'Partial Success' }
        };
        const cfg = config[status] || config.completed;
        const Icon = cfg.icon;

        return (
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                </span>
                {status === 'processing' && progress && (
                    <span className="text-xs text-gray-500">{progress}%</span>
                )}
            </div>
        );
    };

    // Table Columns
    const historyColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewDetails(row.batch_id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {row.error_records > 0 && (
                        <button
                            onClick={() => handleDownloadErrorReport(row.error_file_path)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Download Error Report"
                        >
                            <DownloadCloud className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => handleDownloadOriginalFile(row.file_name)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Download Original File"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleArchiveBatch(row.batch_id)}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded-lg"
                        title="Archive"
                    >
                        <Archive className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteBatch(row.batch_id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
            width: "180px"
        },
        {
            header: "Batch ID",
            accessor: "batch_id",
            cell: row => (
                <span className="font-mono text-sm font-medium text-indigo-600">
                    {row.batch_id}
                </span>
            )
        },
        {
            header: "Upload Type",
            accessor: "upload_name",
            cell: row => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.upload_code === 'EMP_MASTER' ? 'bg-blue-500' :
                        row.upload_code === 'DEPT_MASTER' ? 'bg-green-500' :
                            row.upload_code === 'DESIG_MASTER' ? 'bg-purple-500' :
                                row.upload_code === 'ATTENDANCE' ? 'bg-orange-500' :
                                    'bg-red-500'
                        }`} />
                    <span>{row.upload_name}</span>
                </div>
            )
        },
        {
            header: "File Name",
            accessor: "file_name",
            cell: row => (
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{row.file_name}</span>
                </div>
            )
        },
        {
            header: "Records",
            cell: row => (
                <div className="text-sm">
                    <span className="font-medium">{row.total_records}</span>
                    <span className="text-gray-500 mx-1">total</span>
                    <br />
                    <span className="text-green-600 font-medium">{row.success_records}</span>
                    <span className="text-gray-500 mx-1">success</span>
                    <span className="text-red-600 font-medium">{row.error_records}</span>
                    <span className="text-gray-500"> errors</span>
                </div>
            )
        },
        {
            header: "Status",
            cell: row => <StatusBadge status={row.status} progress={row.progress} />
        },
        {
            header: "Uploaded By",
            accessor: "uploaded_by"
        },
        {
            header: "Uploaded At",
            accessor: "uploaded_at",
            cell: row => (
                <div>
                    <div className="text-sm">{new Date(row.uploaded_at).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(row.uploaded_at).toLocaleTimeString()}</div>
                </div>
            )
        },
        {
            header: "Processing Time",
            accessor: "processing_time",
            cell: row => (
                <span className={`text-sm ${row.status === 'processing' ? 'text-blue-600' : 'text-gray-600'}`}>
                    {row.processing_time}
                </span>
            )
        }
    ];

    return (
        <div className="p-3">
            <BreadCrumb
                items={[
                    { label: 'Upload Management', to: '/admin/uploadDash' },
                    { label: 'Upload History' }
                ]}
                title={`Upload History `}
                description={`View and manage all your past uploads`}
            />

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
                        value={masterFilter}
                        onChange={setMasterFilter}
                        options={[
                            { label: 'All Upload Types', value: 'all' },
                            ...masters
                        ]}
                        placeholder="Filter by Upload Type"
                    />

                    <CommonDropDown
                        label="From Date"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Processing', value: 'processing' },
                            { label: 'Failed', value: 'failed' },
                            { label: 'Partial Success', value: 'partial_success' }
                        ]}
                        placeholder="Filter by Status"
                    />

                    <CommonDatePicker
                        label="From Date"
                        value={dateRange.from}
                        onChange={(val) => setDateRange({ ...dateRange, from: val })}
                        placeholder="Select start date"
                    />
                    <CommonDatePicker
                        label="To Date"
                        value={dateRange.to}
                        onChange={(val) => setDateRange({ ...dateRange, to: val })}
                        placeholder="Select end date"
                    />

                </div>
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={handleExportHistory}
                        className="px-10 py-2 h-10 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex  gap-2"
                    >
                        Filter
                    </button>
                </div>
            </div>

            {/* Upload History Table */}
            <div className="bg-white rounded-xl shadow-sm  overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-900">Upload History</h2>
                        <p className="text-sm text-gray-500">
                            Showing {filteredData.length} of {historyData.length} uploads
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 p-3">
                    {uploadStats.map((stat) => (
                        <div key={stat.id} className="bg-white p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-2">{stat.name}</h3>

                                    {stat.status === 'completed' && (
                                        <div className="space-y-1 bg-cyan-100 rounded-lg p-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Upload Completed:</span>
                                                <span className="font-medium text-indigo-700">View</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${stat.completed}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-green-600">{stat.completed}% completed</span>
                                            </div>
                                        </div>
                                    )}

                                    {stat.status === 'partial' && (
                                        <div className="space-y-2 bg-yellow-100 rounded-lg p-4">
                                            <div className="text-sm">
                                                <span className="text-green-600 font-medium">Upload Complete: </span>
                                                <span className="text-gray-900">{stat.success} data has been uploaded successfully.</span>
                                                
                                            </div>
                                            <span className="font-medium text-indigo-700 text-end">View</span>
                                            <div className="text-sm">
                                                <span className="text-red-600 font-medium">Upload Error: </span>
                                                <span className="text-gray-900">{stat.error} data failed to upload</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-yellow-500 rounded-full"
                                                        style={{ width: `${(stat.success / stat.total) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-green-600">
                                                    {Math.round((stat.success / stat.total) * 100)}% completed
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {stat.status === 'pending' && (
                                        <div className="space-y-1 bg-gray-100 rounded-lg p-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Upload Completed:</span>
                                                <span className="font-medium text-indigo-700">View</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gray-300 rounded-full w-0" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-500">0% completed</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default UploadHistory;