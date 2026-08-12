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
import React, { useEffect, useState } from 'react';
import NewSalaryAdvanceRequest from './NewSalaryAdvanceRequest';
import EligibilityAndInfo from './EligibilityAndInfo';
import SalaryAdvanceRequestModals from './SalaryAdvanceRequestModals';
import { ApiCall } from '../../library/constants';

function SalaryAdvanceRequestMain() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [currentUser, setCurrentUser] = useState({
        emp_code: '',
        emp_name: '',
        designation: '',
        department: '',
        doj: '',
        salary: 0,
        bank_account: '',
        ifsc: ''
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
        eligibility_message: '',
        max_eligible_amount: 0,
        min_amount: 0,
        max_amount: 0,
        used_advances: 0,
        pending_advances: 0,
        remaining_limit: 0,
        tenure_options: [1, 2, 3, 4, 5],
        interest_rate: 0,
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

    // Fetch dynamic salary advance info & user requests
    const fetchData = async () => {
        try {
            setLoading(true);
            const [infoRes, requestsRes] = await Promise.all([
                ApiCall('get', '/salaryadvance/info'),
                ApiCall('get', '/salaryadvance/my-requests')
            ]);

            if (infoRes.data?.success) {
                setCurrentUser(infoRes.data.data.currentUser || {});
                setEligibility(infoRes.data.data.eligibility || {});
            }

            if (requestsRes.data?.success) {
                setExistingRequests(requestsRes.data.data || []);
            }
        } catch (err) {
            console.error("Failed to load salary advance details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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
        } else if (parseFloat(requestData.advance_amount) < eligibility.min_amount) {
            newErrors.advance_amount = `Minimum amount is ₹${eligibility.min_amount}`;
        } else if (parseFloat(requestData.advance_amount) > eligibility.remaining_limit) {
            newErrors.advance_amount = `Maximum eligible remaining amount is ₹${eligibility.remaining_limit}`;
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setSubmitting(true);
                const res = await ApiCall('post', '/salaryadvance/request', requestData);

                if (res.data?.success) {
                    const newRequest = {
                        id: res.data.request_code,
                        request_date: new Date().toISOString().split('T')[0],
                        ...requestData,
                        amount: parseInt(requestData.advance_amount),
                        tenure: parseInt(requestData.repayment_tenure),
                        monthly_deduction: calculateMonthlyDeduction(),
                        status: res.data.status || 'pending',
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

                    // Refresh dynamic state & requests list from backend
                    fetchData();
                }
            } catch (err) {
                const msg = err.data?.message || err.message || "Failed to submit request";
                alert(msg);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleCancelRequest = async () => {
        if (!cancellationReason) {
            alert('Please provide a reason for cancellation');
            return;
        }

        try {
            const res = await ApiCall('post', '/salaryadvance/cancel', {
                id: selectedRequest.id,
                cancellation_reason: cancellationReason
            });

            if (res.data?.success) {
                setShowCancelModal(false);
                setSelectedRequest(null);
                setCancellationReason('');
                alert('Request cancelled successfully');
                fetchData();
            }
        } catch (err) {
            const msg = err.data?.message || err.message || "Failed to cancel request";
            alert(msg);
        }
    };

    const getEligibilityStatus = () => {
        if (!eligibility.is_eligible) return { color: 'red', text: 'Ineligible' };
        const remaining = eligibility.remaining_limit || 0;
        if (remaining <= 0) return { color: 'red', text: 'No remaining limit' };
        if (remaining < (eligibility.max_eligible_amount || 0) * 0.2) return { color: 'yellow', text: 'Low limit remaining' };
        return { color: 'green', text: 'Eligible' };
    };

    const eligibilityStatus = getEligibilityStatus();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex items-center gap-3 text-indigo-600 font-medium">
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Loading Salary Advance Details...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-1">Welcome, {currentUser.emp_name || 'Employee'}</h3>
                        <p className="text-indigo-100 text-sm">{currentUser.designation || 'N/A'} • {currentUser.department || 'N/A'}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        <div>
                            <p className="text-indigo-200 text-xs">Monthly Net Salary</p>
                            <p className="text-lg font-semibold">₹{(currentUser.salary || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Max Eligible</p>
                            <p className="text-lg font-semibold">₹{(eligibility.max_eligible_amount || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Used/Pending</p>
                            <p className="text-lg font-semibold">₹{((eligibility.used_advances || 0) + (eligibility.pending_advances || 0)).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-indigo-200 text-xs">Remaining</p>
                            <p className="text-lg font-semibold">₹{(eligibility.remaining_limit || 0).toLocaleString()}</p>
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
                    submitting={submitting}
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
                setShowSuccessModal={setShowSuccessModal}
                setSubmittedRequest={setSubmittedRequest}
                setSelectedRequest={setSelectedRequest}
                setShowDetailsModal={setShowDetailsModal}
                showDetailsModal={showDetailsModal}
                selectedRequest={selectedRequest}
                showCancelModal={showCancelModal}
                cancellationReason={cancellationReason}
                setCancellationReason={setCancellationReason}
                handleCancelRequest={handleCancelRequest}
            />
        </>
    );
}

export default SalaryAdvanceRequestMain;