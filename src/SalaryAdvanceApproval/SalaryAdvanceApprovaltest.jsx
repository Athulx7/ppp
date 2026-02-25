import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Wallet, Calendar, User, Briefcase,
    FileText, CheckCircle, XCircle, AlertCircle, Info,
    HelpCircle, Loader, ChevronRight, ChevronDown, Clock,
    DollarSign, Percent, CreditCard, Home, TrendingUp,
    Shield, ShieldCheck, Plus, Minus, Upload, Download,
    Eye, Edit, Trash2, Copy, Check, AlertTriangle,
    Building, Users, Settings, RefreshCw, Filter, Search,
    ThumbsUp, ThumbsDown, UserCheck, UserX, BarChart,
    PieChart, DownloadCloud, Printer, MessageSquare
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';

function SalaryAdvanceApproval() {
    const navigate = useNavigate();

    // Current user (approver)
    const [currentUser, setCurrentUser] = useState({
        emp_code: 'ADMIN001',
        emp_name: 'John Admin',
        role: 'hr',
        designation: 'HR Manager',
        department: 'Human Resources'
    });

    // State for different views
    const [selectedTab, setSelectedTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all', 'disbursed'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [amountRange, setAmountRange] = useState({ min: '', max: '' });

    // Data states
    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'approve', 'reject', 'disburse'
    const [actionComment, setActionComment] = useState('');
    const [disbursementDetails, setDisbursementDetails] = useState({
        mode: 'bank_transfer',
        reference: '',
        date: new Date().toISOString().split('T')[0],
        amount: ''
    });

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        disbursed: 0,
        totalAmount: 0,
        avgAmount: 0,
        pendingAmount: 0
    });

    // Departments
    const departments = [
        { value: '', label: 'All Departments' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'HR', label: 'Human Resources' },
        { value: 'Sales', label: 'Sales' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' }
    ];

    // Dummy data
    useEffect(() => {
        const dummyRequests = [
            {
                id: 'SAR001',
                emp_code: 'EMP002',
                emp_name: 'Athul Krishna',
                designation: 'Junior Software Engineer',
                department: 'Engineering',
                doj: '2023-06-15',
                salary: 45000,
                request_date: '2024-02-15',
                amount: 30000,
                purpose: 'Medical emergency - Father hospitalized',
                tenure: 3,
                monthly_deduction: 10000,
                preferred_date: '2024-02-25',
                emergency_contact: '9876543210',
                emergency_relation: 'Spouse',
                comments: 'Urgent requirement',
                status: 'pending',
                documents: ['medical_report.pdf'],
                eligibility: {
                    max_eligible: 90000,
                    used: 25000,
                    remaining: 65000
                }
            },
            {
                id: 'SAR002',
                emp_code: 'EMP005',
                emp_name: 'David Kumar',
                designation: 'Accountant',
                department: 'Finance',
                doj: '2022-03-10',
                salary: 55000,
                request_date: '2024-02-10',
                amount: 50000,
                purpose: 'Home renovation - Bathroom repair',
                tenure: 4,
                monthly_deduction: 12500,
                preferred_date: '2024-02-20',
                emergency_contact: '9876543215',
                emergency_relation: 'Brother',
                comments: '',
                status: 'pending',
                documents: ['quotation.pdf'],
                eligibility: {
                    max_eligible: 110000,
                    used: 0,
                    remaining: 110000
                }
            },
            {
                id: 'SAR003',
                emp_code: 'EMP008',
                emp_name: 'Lisa Wong',
                designation: 'Marketing Specialist',
                department: 'Marketing',
                doj: '2023-11-01',
                salary: 50000,
                request_date: '2024-02-12',
                amount: 25000,
                purpose: 'Education fees - Child school fees',
                tenure: 3,
                monthly_deduction: 8333,
                preferred_date: '2024-02-22',
                emergency_contact: '9876543218',
                emergency_relation: 'Spouse',
                comments: 'Fee payment deadline 28th Feb',
                status: 'approved',
                approved_by: 'John Admin',
                approved_date: '2024-02-13',
                approved_comments: 'Approved as per policy',
                documents: ['fee_slip.pdf'],
                eligibility: {
                    max_eligible: 100000,
                    used: 0,
                    remaining: 100000
                }
            },
            {
                id: 'SAR004',
                emp_code: 'EMP003',
                emp_name: 'Michael Chen',
                designation: 'Tech Lead',
                department: 'Engineering',
                doj: '2021-08-15',
                salary: 85000,
                request_date: '2024-02-08',
                amount: 100000,
                purpose: 'Wedding expenses - Sister marriage',
                tenure: 5,
                monthly_deduction: 20000,
                preferred_date: '2024-02-18',
                emergency_contact: '9876543213',
                emergency_relation: 'Father',
                comments: 'Need advance for marriage arrangements',
                status: 'rejected',
                rejected_by: 'John Admin',
                rejected_date: '2024-02-09',
                rejection_reason: 'Amount exceeds eligible limit. Max eligible is ₹85,000 (2 months salary)',
                eligibility: {
                    max_eligible: 170000,
                    used: 50000,
                    remaining: 120000
                }
            },
            {
                id: 'SAR005',
                emp_code: 'EMP006',
                emp_name: 'Priya Patel',
                designation: 'HR Executive',
                department: 'HR',
                doj: '2023-01-15',
                salary: 40000,
                request_date: '2024-02-05',
                amount: 20000,
                purpose: 'Travel advance for official trip',
                tenure: 2,
                monthly_deduction: 10000,
                preferred_date: '2024-02-15',
                emergency_contact: '9876543216',
                emergency_relation: 'Brother',
                comments: 'Travel advance - will be settled with bills',
                status: 'disbursed',
                approved_by: 'John Admin',
                approved_date: '2024-02-06',
                disbursed_by: 'Finance Dept',
                disbursed_date: '2024-02-07',
                disbursement_ref: 'TRX123456',
                documents: ['travel_approval.pdf'],
                eligibility: {
                    max_eligible: 80000,
                    used: 0,
                    remaining: 80000
                }
            },
            {
                id: 'SAR006',
                emp_code: 'EMP009',
                emp_name: 'Thomas Brown',
                designation: 'Sales Executive',
                department: 'Sales',
                doj: '2023-09-01',
                salary: 38000,
                request_date: '2024-02-14',
                amount: 15000,
                purpose: 'Vehicle repair - Essential for work commute',
                tenure: 2,
                monthly_deduction: 7500,
                preferred_date: '2024-02-24',
                emergency_contact: '9876543219',
                emergency_relation: 'Spouse',
                comments: 'Bike breakdown, need for client visits',
                status: 'pending',
                documents: ['repair_estimate.pdf'],
                eligibility: {
                    max_eligible: 76000,
                    used: 0,
                    remaining: 76000
                }
            }
        ];

        setAllRequests(dummyRequests);
        setFilteredRequests(dummyRequests);
        calculateStats(dummyRequests);
    }, []);

    // Filter requests
    useEffect(() => {
        let filtered = allRequests;

        // Tab filter
        if (selectedTab === 'pending') {
            filtered = filtered.filter(r => r.status === 'pending');
        } else if (selectedTab === 'approved') {
            filtered = filtered.filter(r => r.status === 'approved');
        } else if (selectedTab === 'rejected') {
            filtered = filtered.filter(r => r.status === 'rejected');
        } else if (selectedTab === 'disbursed') {
            filtered = filtered.filter(r => r.status === 'disbursed');
        }

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.emp_name.toLowerCase().includes(query) ||
                r.emp_code.toLowerCase().includes(query) ||
                r.purpose.toLowerCase().includes(query) ||
                r.id.toLowerCase().includes(query)
            );
        }

        // Department filter
        if (selectedDepartment) {
            filtered = filtered.filter(r => r.department === selectedDepartment);
        }

        // Date range
        if (dateRange.from) {
            filtered = filtered.filter(r => r.request_date >= dateRange.from);
        }
        if (dateRange.to) {
            filtered = filtered.filter(r => r.request_date <= dateRange.to);
        }

        // Amount range
        if (amountRange.min) {
            filtered = filtered.filter(r => r.amount >= parseInt(amountRange.min));
        }
        if (amountRange.max) {
            filtered = filtered.filter(r => r.amount <= parseInt(amountRange.max));
        }

        setFilteredRequests(filtered);
    }, [allRequests, selectedTab, searchQuery, selectedDepartment, dateRange, amountRange]);

    const calculateStats = (requests) => {
        const total = requests.length;
        const pending = requests.filter(r => r.status === 'pending').length;
        const approved = requests.filter(r => r.status === 'approved').length;
        const rejected = requests.filter(r => r.status === 'rejected').length;
        const disbursed = requests.filter(r => r.status === 'disbursed').length;

        const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);
        const pendingAmount = requests
            .filter(r => r.status === 'pending')
            .reduce((sum, r) => sum + r.amount, 0);
        const avgAmount = Math.round(totalAmount / (total || 1));

        setStats({
            total,
            pending,
            approved,
            rejected,
            disbursed,
            totalAmount,
            avgAmount,
            pendingAmount
        });
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setActionType('approve');
        setActionComment('');
        setShowActionModal(true);
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setActionType('reject');
        setActionComment('');
        setShowActionModal(true);
    };

    const handleDisburse = (request) => {
        setSelectedRequest(request);
        setActionType('disburse');
        setActionComment('');
        setDisbursementDetails({
            mode: 'bank_transfer',
            reference: '',
            date: new Date().toISOString().split('T')[0],
            amount: request.amount
        });
        setShowActionModal(true);
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const handleActionSubmit = () => {
        if (actionType === 'reject' && !actionComment) {
            alert('Please provide a reason for rejection');
            return;
        }

        if (actionType === 'disburse') {
            if (!disbursementDetails.reference) {
                alert('Please provide transaction reference');
                return;
            }
            if (!disbursementDetails.date) {
                alert('Please select disbursement date');
                return;
            }
        }

        const updatedRequests = allRequests.map(r => {
            if (r.id === selectedRequest.id) {
                if (actionType === 'approve') {
                    return {
                        ...r,
                        status: 'approved',
                        approved_by: currentUser.emp_name,
                        approved_date: new Date().toISOString().split('T')[0],
                        approved_comments: actionComment
                    };
                } else if (actionType === 'reject') {
                    return {
                        ...r,
                        status: 'rejected',
                        rejected_by: currentUser.emp_name,
                        rejected_date: new Date().toISOString().split('T')[0],
                        rejection_reason: actionComment
                    };
                } else if (actionType === 'disburse') {
                    return {
                        ...r,
                        status: 'disbursed',
                        disbursed_by: currentUser.emp_name,
                        disbursed_date: disbursementDetails.date,
                        disbursement_ref: disbursementDetails.reference,
                        disbursement_mode: disbursementDetails.mode
                    };
                }
            }
            return r;
        });

        setAllRequests(updatedRequests);
        calculateStats(updatedRequests);

        setShowActionModal(false);
        setSelectedRequest(null);
        setActionComment('');

        alert(`Request ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'marked as disbursed'} successfully`);
    };

    // Status badge
    const StatusBadge = ({ status }) => {
        const config = {
            'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader, label: 'Pending' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            'disbursed': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CreditCard, label: 'Disbursed' }
        };
        const cfg = config[status] || config.pending;
        const Icon = cfg.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Salary Advance', to: '/salary-advance' },
                    { label: 'Approval' }
                ]}
                title="Salary Advance Approval"
                description="Review and process salary advance requests"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Pending</p>
                            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="p-1.5 bg-yellow-100 rounded-lg">
                            <Loader className="w-4 h-4 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Approved</p>
                            <p className="text-lg font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="p-1.5 bg-green-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Rejected</p>
                            <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="p-1.5 bg-red-100 rounded-lg">
                            <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Disbursed</p>
                            <p className="text-lg font-bold text-blue-600">{stats.disbursed}</p>
                        </div>
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Pending Amt</p>
                            <p className="text-lg font-bold text-purple-600">₹{stats.pendingAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-1.5 bg-purple-100 rounded-lg">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm">
                {/* Tabs */}
                <div className="flex flex-wrap p-2 gap-1 border-b overflow-x-auto">
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`px-3 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedTab === 'pending'
                                ? 'bg-yellow-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setSelectedTab('approved')}
                        className={`px-3 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedTab === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Approved ({stats.approved})
                    </button>
                    <button
                        onClick={() => setSelectedTab('rejected')}
                        className={`px-3 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedTab === 'rejected'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Rejected ({stats.rejected})
                    </button>
                    <button
                        onClick={() => setSelectedTab('disbursed')}
                        className={`px-3 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedTab === 'disbursed'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Disbursed ({stats.disbursed})
                    </button>
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`px-3 py-2 text-xs md:text-sm font-medium whitespace-nowrap rounded-lg transition-all ${selectedTab === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All ({stats.total})
                    </button>
                </div>

                {/* Filters */}
                <div className="p-3 md:p-4 border-b">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, purpose..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <CommonDropDown
                            label=""
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            options={departments}
                            placeholder="Department"
                        />

                        <div className="flex gap-1">
                            <input
                                type="number"
                                placeholder="Min Amt"
                                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500"
                                value={amountRange.min}
                                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Max Amt"
                                className="w-1/2 px-2 py-2 text-sm border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500"
                                value={amountRange.max}
                                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedDepartment('');
                                setDateRange({ from: '', to: '' });
                                setAmountRange({ min: '', max: '' });
                            }}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Requests List */}
                <div className="p-3 md:p-4">
                    {filteredRequests.length === 0 ? (
                        <div className="text-center py-8">
                            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No salary advance requests found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRequests.map(request => (
                                <div
                                    key={request.id}
                                    className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleViewDetails(request)}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${request.status === 'approved' ? 'bg-green-100' :
                                                    request.status === 'pending' ? 'bg-yellow-100' :
                                                        request.status === 'rejected' ? 'bg-red-100' :
                                                            'bg-blue-100'
                                                }`}>
                                                <Wallet className={`w-4 h-4 ${request.status === 'approved' ? 'text-green-600' :
                                                        request.status === 'pending' ? 'text-yellow-600' :
                                                            request.status === 'rejected' ? 'text-red-600' :
                                                                'text-blue-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{request.emp_name}</span>
                                                    <span className="text-xs text-gray-500">{request.emp_code}</span>
                                                    <StatusBadge status={request.status} />
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">{request.department} • {request.designation}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{request.purpose}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 ml-9 lg:ml-0">
                                            <div className="text-right">
                                                <p className="font-semibold text-indigo-600">₹{request.amount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{request.tenure} months</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm">Monthly: ₹{request.monthly_deduction}</p>
                                                <p className="text-xs text-gray-500">Requested: {request.request_date}</p>
                                            </div>

                                            {request.status === 'pending' && (
                                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => handleApprove(request)}
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                                        title="Approve"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Reject"
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {request.status === 'approved' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDisburse(request);
                                                    }}
                                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                                >
                                                    <CreditCard className="w-3 h-3" />
                                                    Disburse
                                                </button>
                                            )}

                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Salary Advance Details</h3>
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedRequest(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Request ID: {selectedRequest.id}</p>
                                    <p className="text-xs text-gray-400">Requested on: {selectedRequest.request_date}</p>
                                </div>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {/* Employee Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Employee Name</p>
                                            <p className="text-sm font-medium">{selectedRequest.emp_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Employee Code</p>
                                            <p className="text-sm font-medium">{selectedRequest.emp_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Department</p>
                                            <p className="text-sm font-medium">{selectedRequest.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Designation</p>
                                            <p className="text-sm font-medium">{selectedRequest.designation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Card */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white mb-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-indigo-100 text-xs">Requested Amount</p>
                                        <p className="text-xl font-bold">₹{selectedRequest.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-indigo-100 text-xs">Tenure</p>
                                        <p className="text-xl font-bold">{selectedRequest.tenure} months</p>
                                    </div>
                                    <div>
                                        <p className="text-indigo-100 text-xs">Monthly Deduction</p>
                                        <p className="text-xl font-bold">₹{selectedRequest.monthly_deduction}</p>
                                    </div>
                                    <div>
                                        <p className="text-indigo-100 text-xs">Preferred Date</p>
                                        <p className="text-xl font-bold">{selectedRequest.preferred_date}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Purpose */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Purpose</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm">{selectedRequest.purpose}</p>
                                </div>
                            </div>

                            {/* Eligibility Check */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility Check</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Max Eligible</p>
                                        <p className="text-sm font-medium">₹{selectedRequest.eligibility.max_eligible.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Used</p>
                                        <p className="text-sm font-medium">₹{selectedRequest.eligibility.used.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Remaining</p>
                                        <p className="text-sm font-medium">₹{selectedRequest.eligibility.remaining.toLocaleString()}</p>
                                    </div>
                                </div>
                                {selectedRequest.amount > selectedRequest.eligibility.remaining && (
                                    <div className="mt-2 bg-red-50 p-2 rounded-lg flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <span className="text-xs text-red-600">Amount exceeds remaining eligibility!</span>
                                    </div>
                                )}
                            </div>

                            {/* Emergency Contact */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contact</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Contact Number</p>
                                        <p className="text-sm font-medium">{selectedRequest.emergency_contact}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Relationship</p>
                                        <p className="text-sm font-medium">{selectedRequest.emergency_relation}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Comments */}
                            {selectedRequest.comments && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Employee Comments</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm">{selectedRequest.comments}</p>
                                    </div>
                                </div>
                            )}

                            {/* Approval/Rejection Info */}
                            {(selectedRequest.approved_by || selectedRequest.rejected_by) && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        {selectedRequest.status === 'approved' ? 'Approval' : 'Rejection'} Details
                                    </h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">
                                                    {selectedRequest.status === 'approved' ? 'Approved By' : 'Rejected By'}
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {selectedRequest.approved_by || selectedRequest.rejected_by}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm font-medium">
                                                    {selectedRequest.approved_date || selectedRequest.rejected_date}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedRequest.approved_comments && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">Comments</p>
                                                <p className="text-sm">{selectedRequest.approved_comments}</p>
                                            </div>
                                        )}
                                        {selectedRequest.rejection_reason && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-500">Reason</p>
                                                <p className="text-sm text-red-600">{selectedRequest.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Disbursement Info */}
                            {selectedRequest.disbursed_date && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Disbursement Details</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Disbursed By</p>
                                                <p className="text-sm font-medium">{selectedRequest.disbursed_by}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Date</p>
                                                <p className="text-sm font-medium">{selectedRequest.disbursed_date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Reference</p>
                                                <p className="text-sm font-medium">{selectedRequest.disbursement_ref}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
                                    <div className="space-y-2">
                                        {selectedRequest.documents.map((doc, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm flex-1">{doc}</span>
                                                <button className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleReject(selectedRequest);
                                            }}
                                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowDetailsModal(false);
                                                handleApprove(selectedRequest);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            Approve
                                        </button>
                                    </>
                                )}
                                {selectedRequest.status === 'approved' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleDisburse(selectedRequest);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        Mark as Disbursed
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedRequest(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal (Approve/Reject/Disburse) */}
            {showActionModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 rounded-full ${actionType === 'approve' ? 'bg-green-100' :
                                        actionType === 'reject' ? 'bg-red-100' :
                                            'bg-blue-100'
                                    }`}>
                                    {actionType === 'approve' && <ThumbsUp className="w-6 h-6 text-green-600" />}
                                    {actionType === 'reject' && <ThumbsDown className="w-6 h-6 text-red-600" />}
                                    {actionType === 'disburse' && <CreditCard className="w-6 h-6 text-blue-600" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {actionType === 'approve' ? 'Approve Request' :
                                            actionType === 'reject' ? 'Reject Request' :
                                                'Mark as Disbursed'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedRequest.emp_name} - ₹{selectedRequest.amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Disbursement Form */}
                            {actionType === 'disburse' && (
                                <div className="space-y-3 mb-4">
                                    <CommonDropDown
                                        label="Disbursement Mode"
                                        value={disbursementDetails.mode}
                                        onChange={(val) => setDisbursementDetails({ ...disbursementDetails, mode: val })}
                                        options={[
                                            { value: 'bank_transfer', label: 'Bank Transfer' },
                                            { value: 'cheque', label: 'Cheque' },
                                            { value: 'cash', label: 'Cash' }
                                        ]}
                                    />
                                    <CommonInputField
                                        label="Transaction Reference *"
                                        value={disbursementDetails.reference}
                                        onChange={(e) => setDisbursementDetails({ ...disbursementDetails, reference: e.target.value })}
                                        placeholder="Enter reference number"
                                    />
                                    <CommonDatePicker
                                        label="Disbursement Date *"
                                        value={disbursementDetails.date}
                                        onChange={(val) => setDisbursementDetails({ ...disbursementDetails, date: val })}
                                    />
                                    <CommonInputField
                                        label="Amount"
                                        type="number"
                                        value={disbursementDetails.amount}
                                        onChange={(e) => setDisbursementDetails({ ...disbursementDetails, amount: e.target.value })}
                                        disabled
                                    />
                                </div>
                            )}

                            {/* Comment Field */}
                            {actionType !== 'disburse' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {actionType === 'approve' ? 'Add Comments (Optional)' : 'Reason for Rejection *'}
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder={actionType === 'approve' ? 'Any comments...' : 'Please provide reason...'}
                                        value={actionComment}
                                        onChange={(e) => setActionComment(e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Request Summary</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-medium">₹{selectedRequest.amount.toLocaleString()}</span>
                                    <span className="text-gray-500">Tenure:</span>
                                    <span className="font-medium">{selectedRequest.tenure} months</span>
                                    <span className="text-gray-500">Monthly:</span>
                                    <span className="font-medium">₹{selectedRequest.monthly_deduction}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        setActionComment('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleActionSubmit}
                                    className={`px-4 py-2 text-white rounded-lg text-sm ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                                            actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                                                'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {actionType === 'approve' ? 'Approve' :
                                        actionType === 'reject' ? 'Reject' :
                                            'Confirm Disbursement'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalaryAdvanceApproval;