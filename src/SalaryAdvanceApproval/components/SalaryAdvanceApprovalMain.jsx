import { CheckCircle, CreditCard, DollarSign, FileText, Loader, Search, XCircle } from "lucide-react"
import React, { useEffect, useState } from "react"
import CommonDropDown from "../../basicComponents/CommonDropDown";
import SalaryAdvanceApprovalReq from "./SalaryAdvanceApprovalReq";
import ApprovalDetails from "./ApprovalDetails";
import SalaryAdvApproActionModal from "./SalaryAdvApproActionModal";
import { ApiCall } from "../../library/constants";

function SalaryAdvanceApprovalMain({ isLoading, setIsLoading }) {
    const [loading, setLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState({
        emp_code: '',
        emp_name: '',
        role: '',
        designation: '',
        department: ''
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
    const [departments, setDepartments] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'approve', 'reject', 'disburse'
    const [actionComment, setActionComment] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

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

    // Fetch dynamic approval list from backend
    const fetchApprovalData = async () => {
        try {
            setLoading(true);
            if (setIsLoading) setIsLoading(true);

            const res = await ApiCall('get', '/salaryadvance/approval-list');
            if (res.data?.success) {
                const data = res.data.data;
                const requests = data.requests || [];
                setAllRequests(requests);
                setDepartments(data.departments || [{ value: '', label: 'All Departments' }]);
                if (data.currentUser) {
                    setCurrentUser(data.currentUser);
                }
                calculateStats(requests);
            }
        } catch (err) {
            console.error("Error loading salary advance approval list:", err);
        } finally {
            setLoading(false);
            if (setIsLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovalData()
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
                (r.emp_name && r.emp_name.toLowerCase().includes(query)) ||
                (r.emp_code && r.emp_code.toLowerCase().includes(query)) ||
                (r.purpose && r.purpose.toLowerCase().includes(query)) ||
                (r.id && r.id.toLowerCase().includes(query))
            );
        }

        // Department filter
        if (selectedDepartment) {
            filtered = filtered.filter(r =>
                r.department_code === selectedDepartment ||
                r.department === selectedDepartment
            );
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

    const handleActionSubmit = async () => {
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

        try {
            setSubmittingAction(true);
            let endpoint = '';
            let payload = {};

            if (actionType === 'approve') {
                endpoint = '/salaryadvance/approve';
                payload = { id: selectedRequest.id, comments: actionComment };
            } else if (actionType === 'reject') {
                endpoint = '/salaryadvance/reject';
                payload = { id: selectedRequest.id, rejection_reason: actionComment };
            } else if (actionType === 'disburse') {
                endpoint = '/salaryadvance/disburse';
                payload = {
                    id: selectedRequest.id,
                    mode: disbursementDetails.mode,
                    reference: disbursementDetails.reference,
                    date: disbursementDetails.date
                };
            }

            const res = await ApiCall('post', endpoint, payload);

            if (res.data?.success) {
                setShowActionModal(false);
                setSelectedRequest(null);
                setActionComment('');
                alert(res.data.message || `Request ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : 'marked as disbursed'} successfully`);
                fetchApprovalData();
            }
        } catch (err) {
            const msg = err.data?.message || err.message || `Failed to ${actionType} request`;
            alert(msg);
        } finally {
            setSubmittingAction(false);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3 text-indigo-600 font-medium">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Loading Salary Advance Approvals...</span>
                </div>
            </div>
        );
    }

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
                            <p className="text-xs text-gray-500">Pending Amount</p>
                            <p className="text-lg font-bold text-indigo-600">₹{(stats.pendingAmount / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="p-1.5 bg-indigo-100 rounded-md">
                            <DollarSign className="w-4 h-4 text-indigo-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-4 md:mb-6">
                <div className="border-b border-gray-200 overflow-x-auto">
                    <div className="flex space-x-1 p-2 min-w-max">
                        {[
                            { id: 'pending', label: `Pending (${stats.pending})` },
                            { id: 'approved', label: `Approved (${stats.approved})` },
                            { id: 'disbursed', label: `Disbursed (${stats.disbursed})` },
                            { id: 'rejected', label: `Rejected (${stats.rejected})` },
                            { id: 'all', label: `All Requests (${stats.total})` }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${selectedTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search by name, ID, or purpose..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <CommonDropDown
                                options={departments}
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                placeholder="Department"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <SalaryAdvanceApprovalReq
                filteredRequests={filteredRequests}
                selectedTab={selectedTab}
                handleViewDetails={handleViewDetails}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleDisburse={handleDisburse}
            />

            <ApprovalDetails
                showDetailsModal={showDetailsModal}
                selectedRequest={selectedRequest}
                setShowDetailsModal={setShowDetailsModal}
                setSelectedRequest={setSelectedRequest}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleDisburse={handleDisburse}
            />

            <SalaryAdvApproActionModal
                showActionModal={showActionModal}
                actionType={actionType}
                setShowActionModal={setShowActionModal}
                setSelectedRequest={setSelectedRequest}
                selectedRequest={selectedRequest}
                actionComment={actionComment}
                setActionComment={setActionComment}
                disbursementDetails={disbursementDetails}
                setDisbursementDetails={setDisbursementDetails}
                handleActionSubmit={handleActionSubmit}
                submittingAction={submittingAction}
            />
        </>
    );
}

export default SalaryAdvanceApprovalMain;