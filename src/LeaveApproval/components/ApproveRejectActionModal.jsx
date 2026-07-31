import { ThumbsDown, ThumbsUp } from 'lucide-react'
import React from 'react'

function ApproveRejectActionModal({ actionType, selectedRequest, actionComment,
    setActionComment, setShowActionModal, handleActionSubmit
}) {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${actionType === 'approve' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {actionType === 'approve' ? (
                                    <ThumbsUp className="w-6 h-6 text-green-600" />
                                ) : (
                                    <ThumbsDown className="w-6 h-6 text-red-600" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedRequest.emp_name} - {selectedRequest.leave_name}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Duration:</span> {selectedRequest.from_date} to {selectedRequest.to_date} ({selectedRequest.days} days)
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Reason:</span> {selectedRequest.reason}
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {actionType === 'approve' ? 'Add Comments (Optional)' : 'Reason for Rejection *'}
                            </label>
                            <textarea
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder={actionType === 'approve' ? 'Add any comments...' : 'Please provide a reason for rejection...'}
                                value={actionComment}
                                onChange={(e) => setActionComment(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowActionModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleActionSubmit}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${actionType === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ApproveRejectActionModal