import { CheckCircle, CreditCard, DollarSign, FileText, Loader, Search, XCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import CommonDropDown from "../../basicComponents/CommonDropDown";
import SalaryAdvanceApprovalReq from "./SalaryAdvanceApprovalReq";
import ApprovalDetails from "./ApprovalDetails";
import SalaryAdvApproActionModal from "./SalaryAdvApproActionModal";

function SalaryAdvanceApprovalMain({ isLoading, setIsLoading }) {
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
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-1.5 bg-blue-100 rounded-md">
                            <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Pending</p>
                            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="p-1.5 bg-yellow-100 rounded-md">
                            <Loader className="w-4 h-4 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Approved</p>
                            <p className="text-lg font-bold text-green-600">{stats.approved}</p>
                        </div>
                        <div className="p-1.5 bg-green-100 rounded-md">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Rejected</p>
                            <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
                        </div>
                        <div className="p-1.5 bg-red-100 rounded-md">
                            <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Disbursed</p>
                            <p className="text-lg font-bold text-blue-600">{stats.disbursed}</p>
                        </div>
                        <div className="p-1.5 bg-blue-100 rounded-md">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 md:p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Pending Amt</p>
                            <p className="text-lg font-bold text-purple-600">₹{stats.pendingAmount.toLocaleString()}</p>
                        </div>
                        <div className="p-1.5 bg-purple-100 rounded-md">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm">
                <div className="flex border-b border-gray-300 flex-wrap gap-1 overflow-x-auto scrollbar p-1">
                    <button
                        onClick={() => setSelectedTab('pending')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors ${selectedTab === 'pending'
                            ? 'bg-yellow-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setSelectedTab('approved')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors ${selectedTab === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Approved ({stats.approved})
                    </button>
                    <button
                        onClick={() => setSelectedTab('rejected')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors ${selectedTab === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Rejected ({stats.rejected})
                    </button>
                    <button
                        onClick={() => setSelectedTab('disbursed')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors ${selectedTab === 'disbursed'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Disbursed ({stats.disbursed})
                    </button>
                    <button
                        onClick={() => setSelectedTab('all')}
                        className={`cursor-pointer px-6 py-3 font-medium text-sm whitespace-nowrap rounded-sm flex items-center gap-2 transition-colors ${selectedTab === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All ({stats.total})
                    </button>
                </div>

                <div className="p-3 md:p-4 border-b border-b-gray-200">
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

                <SalaryAdvanceApprovalReq
                    filteredRequests={filteredRequests}
                    handleViewDetails={handleViewDetails}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                    handleDisburse={handleDisburse}
                />
            </div>

            {showDetailsModal && selectedRequest && (
                <ApprovalDetails
                    setShowDetailsModal={setShowDetailsModal}
                    setSelectedRequest={setSelectedRequest}
                    selectedRequest={selectedRequest}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                    handleDisburse={handleDisburse}
                />
            )}

            {showActionModal && selectedRequest && (
                <SalaryAdvApproActionModal
                    setShowActionModal={setShowActionModal}
                    actionType={actionType}
                    selectedRequest={selectedRequest}
                    handleActionSubmit={handleActionSubmit}
                    actionComment={actionComment}
                    setActionComment={setActionComment}
                    disbursementDetails={disbursementDetails}
                    setDisbursementDetails={setDisbursementDetails}
                    StatusBadge={StatusBadge}
                />
            )}
        </>
    )
}

export default SalaryAdvanceApprovalMain