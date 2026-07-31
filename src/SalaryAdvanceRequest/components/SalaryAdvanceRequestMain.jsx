import {
    Save, X, ArrowLeft, Wallet, Calendar, User, Briefcase,
    FileText, CheckCircle, XCircle, AlertCircle, Info,
    HelpCircle, Loader, ChevronRight, ChevronDown, Clock,
    DollarSign, Percent, CreditCard, Home, TrendingUp,
    Shield, ShieldCheck, Plus, Minus, Upload, Download,
    Eye, Edit, Trash2, Copy, Check, AlertTriangle,
    Building, Users, Settings, RefreshCw, History,
    HdIcon
} from 'lucide-react';
import React, { useEffect, useState } from 'react'
import NewSalaryAdvanceRequest from './NewSalaryAdvanceRequest';
import EligibilityAndInfo from './EligibilityAndInfo';
import SalaryAdvanceRequestModals from './SalaryAdvanceRequestModals';

function SalaryAdvanceRequestMain() {

    const [currentUser, setCurrentUser] = useState({
        emp_code: 'EMP002',
        emp_name: 'Athul Krishna',
        designation: 'Junior Software Engineer',
        department: 'Engineering',
        doj: '2023-06-15',
        salary: 45000,
        bank_account: 'XXXX XXXX 1234',
        ifsc: 'HDFC0001234'
    });

    // State for request form
    const [requestData, setRequestData] = useState({
        advance_amount: '',
        purpose: '',
        repayment_tenure: '3', // months
        preferred_date: '',
        emergency_contact: '',
        emergency_relation: '',
        comments: '',
        supporting_documents: []
    });

    // State for eligibility and limits
    const [eligibility, setEligibility] = useState({
        is_eligible: true,
        max_eligible_amount: 90000, // 2 months salary
        min_amount: 5000,
        max_amount: 90000,
        used_advances: 0,
        pending_advances: 25000,
        remaining_limit: 65000,
        tenure_options: [1, 2, 3, 4, 5, 6],
        interest_rate: 0, // 0% for salary advance
        processing_fee: 0
    });

    // State for existing/past requests
    const [existingRequests, setExistingRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submittedRequest, setSubmittedRequest] = useState(null);

    // Form validation
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Dummy existing requests
    useEffect(() => {
        const dummyRequests = [
            {
                id: 'SAR001',
                request_date: '2024-02-15',
                amount: 30000,
                purpose: 'Medical emergency',
                tenure: 3,
                monthly_deduction: 10000,
                status: 'approved',
                approved_by: 'John Admin',
                approved_date: '2024-02-16',
                disbursed_date: '2024-02-17',
                remaining_balance: 20000,
                next_deduction: '2024-03-01',
                comments: 'Approved'
            },
            {
                id: 'SAR002',
                request_date: '2024-01-10',
                amount: 25000,
                purpose: 'Home renovation',
                tenure: 5,
                monthly_deduction: 5000,
                status: 'pending',
                remaining_balance: 25000,
                comments: 'Under review'
            },
            {
                id: 'SAR003',
                request_date: '2023-12-05',
                amount: 15000,
                purpose: 'Education fees',
                tenure: 3,
                monthly_deduction: 5000,
                status: 'completed',
                approved_by: 'Sarah Johnson',
                approved_date: '2023-12-06',
                disbursed_date: '2023-12-07',
                completed_date: '2024-03-01',
                remaining_balance: 0,
                comments: 'Fully repaid'
            },
            {
                id: 'SAR004',
                request_date: '2024-02-20',
                amount: 40000,
                purpose: 'Wedding expenses',
                tenure: 4,
                monthly_deduction: 10000,
                status: 'rejected',
                rejected_by: 'John Admin',
                rejected_date: '2024-02-21',
                rejection_reason: 'Insufficient tenure for advance amount',
                comments: 'Please reduce amount or increase tenure'
            }
        ];
        setExistingRequests(dummyRequests);
    }, []);

    // Calculate monthly deduction
    const calculateMonthlyDeduction = () => {
        if (!requestData.advance_amount || !requestData.repayment_tenure) return 0;
        return Math.round(requestData.advance_amount / parseInt(requestData.repayment_tenure));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!requestData.advance_amount) {
            newErrors.advance_amount = 'Advance amount is required';
        } else if (requestData.advance_amount < eligibility.min_amount) {
            newErrors.advance_amount = `Minimum amount is ₹${eligibility.min_amount}`;
        } else if (requestData.advance_amount > eligibility.max_eligible_amount) {
            newErrors.advance_amount = `Maximum eligible amount is ₹${eligibility.max_eligible_amount}`;
        }

        if (!requestData.purpose) {
            newErrors.purpose = 'Purpose is required';
        } else if (requestData.purpose.length < 10) {
            newErrors.purpose = 'Please provide more details (min 10 characters)';
        }

        if (!requestData.preferred_date) {
            newErrors.preferred_date = 'Preferred disbursal date is required';
        }

        if (!requestData.emergency_contact) {
            newErrors.emergency_contact = 'Emergency contact is required';
        } else if (!/^\d{10}$/.test(requestData.emergency_contact)) {
            newErrors.emergency_contact = 'Enter valid 10-digit mobile number';
        }

        if (!requestData.emergency_relation) {
            newErrors.emergency_relation = 'Relationship is required';
        }

        return newErrors;
    };

    const handleInputChange = (field, value) => {
        setRequestData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Create new request
            const newRequest = {
                id: `SAR${Date.now()}`,
                request_date: new Date().toISOString().split('T')[0],
                ...requestData,
                amount: parseInt(requestData.advance_amount),
                tenure: parseInt(requestData.repayment_tenure),
                monthly_deduction: calculateMonthlyDeduction(),
                status: 'pending',
                remaining_balance: parseInt(requestData.advance_amount)
            };

            setSubmittedRequest(newRequest);
            setShowSuccessModal(true);

            // Reset form
            setRequestData({
                advance_amount: '',
                purpose: '',
                repayment_tenure: '3',
                preferred_date: '',
                emergency_contact: '',
                emergency_relation: '',
                comments: '',
                supporting_documents: []
            });
            setTouched({});
        }
    };

    const handleCancelRequest = () => {
        if (!cancellationReason) {
            alert('Please provide a reason for cancellation');
            return;
        }

        // Update request status
        setExistingRequests(existingRequests.map(req =>
            req.id === selectedRequest.id
                ? { ...req, status: 'cancelled', cancellation_reason: cancellationReason, cancelled_date: new Date().toISOString().split('T')[0] }
                : req
        ));

        setShowCancelModal(false);
        setSelectedRequest(null);
        setCancellationReason('');
        alert('Request cancelled successfully');
    };

    const getEligibilityStatus = () => {
        const remaining = eligibility.remaining_limit;
        if (remaining <= 0) return { color: 'red', text: 'No remaining limit' };
        if (remaining < eligibility.max_eligible_amount * 0.2) return { color: 'yellow', text: 'Low limit remaining' };
        return { color: 'green', text: 'Eligible' };
    };

    const eligibilityStatus = getEligibilityStatus();

    // Status badge component
    const StatusBadge = ({ status }) => {
        const config = {
            'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader, label: 'Pending' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            'completed': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Check, label: 'Completed' },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', icon: X, label: 'Cancelled' },
            'disbursed': { bg: 'bg-purple-100', text: 'text-purple-800', icon: CreditCard, label: 'Disbursed' }
        };
        const cfg = config[status] || config.pending;
        const Icon = cfg.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <HdIcon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };
    return (
        <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-1">Welcome, {currentUser.emp_name}</h3>
                        <p className="text-indigo-100 text-sm">{currentUser.designation} • {currentUser.department}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        <div>
                            <p className="text-indigo-200 text-xs">Monthly Salary</p>
                            <p className="text-lg font-semibold">₹{currentUser.salary.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Max Eligible</p>
                            <p className="text-lg font-semibold">₹{eligibility.max_eligible_amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Used/Pending</p>
                            <p className="text-lg font-semibold">₹{eligibility.used_advances.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Remaining</p>
                            <p className="text-lg font-semibold">₹{eligibility.remaining_limit.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <NewSalaryAdvanceRequest
                    handleSubmit={handleSubmit}
                    requestData={requestData}
                    handleInputChange={handleInputChange}
                    touched={touched}
                    errors={errors}
                    eligibility={eligibility}
                    calculateMonthlyDeduction={calculateMonthlyDeduction}
                />

                <EligibilityAndInfo
                    eligibilityStatus={eligibilityStatus}
                    eligibility={eligibility}
                    currentUser={currentUser}
                    existingRequests={existingRequests}
                    setSelectedRequest={setSelectedRequest}
                    setShowDetailsModal={setShowDetailsModal}
                />
            </div>

            <SalaryAdvanceRequestModals
                showSuccessModal={showSuccessModal}
                submittedRequest={submittedRequest}
                setShowCancelModal={setShowCancelModal}
                setShowSuccessModal={setShowSuccessModal} setSubmittedRequest={setSubmittedRequest}
                setSelectedRequest={setSelectedRequest}
                setShowDetailsModal={setShowDetailsModal}
                showDetailsModal={showDetailsModal}
                selectedRequest={selectedRequest}
                showCancelModal={showCancelModal} cancellationReason={cancellationReason}
                setCancellationReason={setCancellationReason} handleCancelRequest
            />

        </>
    )
}

export default SalaryAdvanceRequestMain