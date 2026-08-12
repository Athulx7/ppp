import { AlertCircle, CheckCircle, CreditCard, Download, FileText, Loader, User, X, XCircle } from 'lucide-react';
import React from 'react'

function ApprovalDetails({
    setShowDetailsModal,
    setSelectedRequest,
    selectedRequest,
    handleApprove,
    handleReject,
    handleDisburse
}) {
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
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                    <div className="sticky top-0 bg-white border-b border-b-gray-200 px-6 py-4 flex justify-between items-center">
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

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Purpose</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm">{selectedRequest.purpose}</p>
                            </div>
                        </div>

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

                        {selectedRequest.comments && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Employee Comments</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm">{selectedRequest.comments}</p>
                                </div>
                            </div>
                        )}

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

                        <div className="flex justify-end gap-3 pt-4 border-t border-t-gray-200">
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleReject(selectedRequest);
                                        }}
                                        className="cursor-pointer px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            handleApprove(selectedRequest);
                                        }}
                                        className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
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
                                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    Mark as Disbursed
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedRequest(null);
                                }}
                                className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ApprovalDetails