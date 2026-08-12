import { CheckCircle, CreditCard, DollarSign, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react'
import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';

function SalaryAdvApproActionModal({ setShowActionModal, actionType, selectedRequest,
    handleActionSubmit, actionComment, setActionComment, disbursementDetails, setDisbursementDetails
}) {
    return (
        <>
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
                                className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleActionSubmit}
                                className={`cursor-pointer px-4 py-2 text-white rounded-md text-sm ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
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
        </>
    )
}

export default SalaryAdvApproActionModal