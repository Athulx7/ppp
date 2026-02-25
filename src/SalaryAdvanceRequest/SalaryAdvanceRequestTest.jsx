import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Wallet, Calendar, User, Briefcase,
    FileText, CheckCircle, XCircle, AlertCircle, Info,
    HelpCircle, Loader, ChevronRight, ChevronDown, Clock,
    DollarSign, Percent, CreditCard, Home, TrendingUp,
    Shield, ShieldCheck, Plus, Minus, Upload, Download,
    Eye, Edit, Trash2, Copy, Check, AlertTriangle,
    Building, Users, Settings, RefreshCw, History
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonDatePicker from '../basicComponents/CommonDatePicker';

function SalaryAdvanceRequest() {
    const navigate = useNavigate();

    // Current user info
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
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Employee Self Service', to: '/ess' },
                    { label: 'Salary Advance Request' }
                ]}
                title="Salary Advance Request"
                description="Request salary advance with easy repayment options"
            />

            {/* Eligibility Summary Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 text-white">
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
                {/* Main Request Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Wallet className="w-5 h-5 text-indigo-600" />
                            New Salary Advance Request
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            {/* Amount and Tenure Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <CommonInputField
                                        label="Advance Amount (₹) *"
                                        type="number"
                                        value={requestData.advance_amount}
                                        onChange={(e) => handleInputChange('advance_amount', e.target.value)}
                                        placeholder="Enter amount"
                                        error={touched.advance_amount ? errors.advance_amount : ''}
                                        min={eligibility.min_amount}
                                        max={eligibility.max_eligible_amount}
                                        hint={`Min: ₹${eligibility.min_amount} | Max: ₹${eligibility.max_eligible_amount}`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Repayment Tenure (Months) *
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {eligibility.tenure_options.map(months => (
                                            <button
                                                key={months}
                                                type="button"
                                                onClick={() => handleInputChange('repayment_tenure', months.toString())}
                                                className={`p-2 border rounded-lg text-sm font-medium transition-all ${requestData.repayment_tenure === months.toString()
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {months} {months === 1 ? 'Month' : 'Months'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Deduction Preview */}
                            {requestData.advance_amount && requestData.repayment_tenure && (
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Monthly Deduction:</span>
                                        <span className="text-lg font-semibold text-indigo-700">
                                            ₹{calculateMonthlyDeduction().toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                                        <span>Total Amount: ₹{parseInt(requestData.advance_amount).toLocaleString()}</span>
                                        <span>Tenure: {requestData.repayment_tenure} months</span>
                                    </div>
                                </div>
                            )}

                            {/* Purpose */}
                            <div>
                                <CommonInputField
                                    label="Purpose of Advance *"
                                    type="textarea"
                                    rows={3}
                                    value={requestData.purpose}
                                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                                    placeholder="Please provide detailed reason for salary advance..."
                                    error={touched.purpose ? errors.purpose : ''}
                                    hint="Minimum 10 characters"
                                />
                            </div>

                            {/* Preferred Date */}
                            <div>
                                <CommonDatePicker
                                    label="Preferred Disbursal Date *"
                                    value={requestData.preferred_date}
                                    onChange={(val) => handleInputChange('preferred_date', val)}
                                    placeholder="Select date"
                                    error={touched.preferred_date ? errors.preferred_date : ''}
                                    minDate={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Emergency Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CommonInputField
                                    label="Emergency Contact Number *"
                                    type="tel"
                                    value={requestData.emergency_contact}
                                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                                    placeholder="10-digit mobile number"
                                    error={touched.emergency_contact ? errors.emergency_contact : ''}
                                />
                                <CommonInputField
                                    label="Relationship *"
                                    value={requestData.emergency_relation}
                                    onChange={(e) => handleInputChange('emergency_relation', e.target.value)}
                                    placeholder="e.g., Spouse, Parent, Sibling"
                                    error={touched.emergency_relation ? errors.emergency_relation : ''}
                                />
                            </div>

                            {/* Additional Comments */}
                            <div>
                                <CommonInputField
                                    label="Additional Comments (Optional)"
                                    type="textarea"
                                    rows={2}
                                    value={requestData.comments}
                                    onChange={(e) => handleInputChange('comments', e.target.value)}
                                    placeholder="Any additional information..."
                                />
                            </div>

                            {/* Document Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Supporting Documents (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-1">Drag & drop files or click to browse</p>
                                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => {
                                            // Handle file upload
                                            console.log(e.target.files);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs text-gray-600">
                                        I confirm that the information provided is true and correct. I understand that the advance amount will be deducted from my salary in equated monthly installments as per the selected tenure.
                                    </span>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                                >
                                    <Save className="w-4 h-4" />
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar - Eligibility & Info */}
                <div className="space-y-4">
                    {/* Eligibility Card */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            Eligibility Status
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Eligibility:</span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${eligibilityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                                        eligibilityStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {eligibilityStatus.text}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-600">Used: ₹{eligibility.used_advances}</span>
                                    <span className="text-gray-600">Remaining: ₹{eligibility.remaining_limit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 rounded-full h-2"
                                        style={{
                                            width: `${(eligibility.used_advances / eligibility.max_eligible_amount) * 100}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Max Limit: ₹{eligibility.max_eligible_amount.toLocaleString()}
                                </p>
                            </div>

                            <div className="border-t pt-3 mt-2">
                                <div className="flex items-start gap-2 text-xs">
                                    <Info className="w-3 h-3 text-gray-400 mt-0.5" />
                                    <p className="text-gray-600">
                                        Salary advance is interest-free. The amount will be deducted from your salary in {eligibility.tenure_options.join('/')} monthly installments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Account Info */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            Disbursement Account
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Account:</span>
                                <span className="font-medium">{currentUser.bank_account}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">IFSC:</span>
                                <span className="font-medium">{currentUser.ifsc}</span>
                            </div>
                            <button className="w-full mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1">
                                <Edit className="w-3 h-3" />
                                Update Bank Details
                            </button>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                            <HelpCircle className="w-4 h-4" />
                            Quick Tips
                        </h4>
                        <ul className="space-y-2 text-xs text-blue-800">
                            <li className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                                <span>Maximum advance is 2 months of your basic salary</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                                <span>Choose longer tenure for lower monthly deductions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                                <span>Processing takes 2-3 working days after approval</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                                <span>You can track request status in the list below</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Existing Requests Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Your Salary Advance Requests
                </h3>

                {existingRequests.length === 0 ? (
                    <div className="text-center py-8">
                        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No salary advance requests found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {existingRequests.map(request => (
                            <div
                                key={request.id}
                                className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedRequest(request);
                                    setShowDetailsModal(true);
                                }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${request.status === 'approved' ? 'bg-green-100' :
                                                request.status === 'pending' ? 'bg-yellow-100' :
                                                    request.status === 'rejected' ? 'bg-red-100' :
                                                        request.status === 'completed' ? 'bg-blue-100' :
                                                            'bg-gray-100'
                                            }`}>
                                            <Wallet className={`w-4 h-4 ${request.status === 'approved' ? 'text-green-600' :
                                                    request.status === 'pending' ? 'text-yellow-600' :
                                                        request.status === 'rejected' ? 'text-red-600' :
                                                            request.status === 'completed' ? 'text-blue-600' :
                                                                'text-gray-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{request.id}</span>
                                                <StatusBadge status={request.status} />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Requested: {request.request_date} • Purpose: {request.purpose}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-6 ml-9 md:ml-0">
                                        <div className="text-right">
                                            <p className="font-semibold">₹{request.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{request.tenure} months</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">Monthly: ₹{request.monthly_deduction}</p>
                                            <p className="text-xs text-gray-500">Balance: ₹{request.remaining_balance}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && submittedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted Successfully!</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Your salary advance request has been submitted and is pending approval.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs text-gray-500">Request ID:</span>
                                    <span className="text-xs font-medium">{submittedRequest.id}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs text-gray-500">Amount:</span>
                                    <span className="text-xs font-medium">₹{submittedRequest.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs text-gray-500">Tenure:</span>
                                    <span className="text-xs font-medium">{submittedRequest.tenure} months</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-gray-500">Monthly Deduction:</span>
                                    <span className="text-xs font-medium">₹{submittedRequest.monthly_deduction}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        setSubmittedRequest(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                >
                                    Done
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        setSelectedRequest(submittedRequest);
                                        setShowDetailsModal(true);
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Request ID: {selectedRequest.id}</p>
                                    <p className="text-xs text-gray-400">Requested on: {selectedRequest.request_date}</p>
                                </div>
                                <StatusBadge status={selectedRequest.status} />
                            </div>

                            {/* Amount Card */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white mb-6">
                                <p className="text-indigo-100 text-sm mb-1">Advance Amount</p>
                                <p className="text-3xl font-bold">₹{selectedRequest.amount.toLocaleString()}</p>
                                <div className="flex justify-between mt-2 text-indigo-100 text-sm">
                                    <span>Tenure: {selectedRequest.tenure} months</span>
                                    <span>Monthly: ₹{selectedRequest.monthly_deduction}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Purpose</p>
                                    <p className="text-sm font-medium">{selectedRequest.purpose}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Remaining Balance</p>
                                    <p className="text-sm font-medium">₹{selectedRequest.remaining_balance.toLocaleString()}</p>
                                </div>
                                {selectedRequest.approved_by && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Approved By</p>
                                        <p className="text-sm font-medium">{selectedRequest.approved_by}</p>
                                        <p className="text-xs text-gray-400">{selectedRequest.approved_date}</p>
                                    </div>
                                )}
                                {selectedRequest.disbursed_date && (
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">Disbursed Date</p>
                                        <p className="text-sm font-medium">{selectedRequest.disbursed_date}</p>
                                    </div>
                                )}
                                {selectedRequest.rejection_reason && (
                                    <div className="col-span-2 bg-red-50 p-3 rounded-lg">
                                        <p className="text-xs text-red-600">Rejection Reason</p>
                                        <p className="text-sm text-red-700">{selectedRequest.rejection_reason}</p>
                                    </div>
                                )}
                            </div>

                            {/* Comments */}
                            {selectedRequest.comments && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm">{selectedRequest.comments}</p>
                                    </div>
                                </div>
                            )}

                            {/* Repayment Schedule (for approved requests) */}
                            {selectedRequest.status === 'approved' && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Repayment Schedule</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Month</th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Due Date</th>
                                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {Array.from({ length: selectedRequest.tenure }).map((_, i) => {
                                                    const month = i + 1;
                                                    const dueDate = new Date(selectedRequest.disbursed_date);
                                                    dueDate.setMonth(dueDate.getMonth() + month);
                                                    const isPaid = month <= Math.floor((selectedRequest.amount - selectedRequest.remaining_balance) / selectedRequest.monthly_deduction);

                                                    return (
                                                        <tr key={i}>
                                                            <td className="px-3 py-2 text-xs">Month {month}</td>
                                                            <td className="px-3 py-2 text-xs">{dueDate.toISOString().split('T')[0]}</td>
                                                            <td className="px-3 py-2 text-xs text-right">₹{selectedRequest.monthly_deduction}</td>
                                                            <td className="px-3 py-2 text-right">
                                                                {isPaid ? (
                                                                    <span className="text-xs text-green-600">Paid</span>
                                                                ) : month === Math.ceil((selectedRequest.amount - selectedRequest.remaining_balance) / selectedRequest.monthly_deduction) + 1 ? (
                                                                    <span className="text-xs text-yellow-600">Upcoming</span>
                                                                ) : (
                                                                    <span className="text-xs text-gray-400">Pending</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                {selectedRequest.status === 'pending' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            setShowCancelModal(true);
                                        }}
                                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                                    >
                                        Cancel Request
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

            {/* Cancel Request Modal */}
            {showCancelModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Cancel Request</h3>
                                    <p className="text-sm text-gray-500">Are you sure you want to cancel this request?</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Cancellation *
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                    placeholder="Please provide a reason..."
                                    value={cancellationReason}
                                    onChange={(e) => setCancellationReason(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancellationReason('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={handleCancelRequest}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                    Yes, Cancel Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalaryAdvanceRequest;