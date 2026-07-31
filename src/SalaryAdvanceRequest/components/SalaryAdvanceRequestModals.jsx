import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import React from 'react'
import StatusBadge from '../../MyCalendar/components/StatusBadge';

function SalaryAdvanceRequestModals({ showSuccessModal, submittedRequest, setShowCancelModal,
    setShowSuccessModal, setSubmittedRequest, setSelectedRequest, setShowDetailsModal, showDetailsModal, selectedRequest,
    showCancelModal, cancellationReason, setCancellationReason, handleCancelRequest
}) {
    return (
        <>
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
                                    <span className="text-xs font-medium">₹{submittedRequest.amount?.toLocaleString()}</span>
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
                                <StatusBadge  status={selectedRequest.status} />
                            </div>

                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white mb-6">
                                <p className="text-indigo-100 text-sm mb-1">Advance Amount</p>
                                <p className="text-3xl font-bold">₹{selectedRequest.amount?.toLocaleString()}</p>
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
                                    <p className="text-sm font-medium">₹{selectedRequest.remaining_balance?.toLocaleString()}</p>
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

                            {selectedRequest.comments && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm">{selectedRequest.comments}</p>
                                    </div>
                                </div>
                            )}

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
        </>
    )
}

export default SalaryAdvanceRequestModals